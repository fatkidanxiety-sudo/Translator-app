// On-device text recognition in photos with Tesseract (WebAssembly).
// The engine ships with the app; each language's data (a few MB) is downloaded
// the first time and then kept in the browser's IndexedDB for offline use.

import { createWorker } from 'tesseract.js';
import { lang } from './languages.js';

const base = new URL('./vendor/tesseract/', import.meta.url).href;
let worker = null;
let workerLangs = '';

async function getWorker(langs, onProgress) {
  const key = langs.join('+');
  if (worker && workerLangs === key) return worker;
  if (worker) await worker.terminate();
  worker = null;
  worker = await createWorker(langs, 1, {
    workerPath: `${base}worker.min.js`,
    corePath: base,
    workerBlobURL: false,
    logger: (m) => {
      if (typeof m.progress === 'number') onProgress?.(m.progress, m.status);
    },
  });
  workerLangs = key;
  return worker;
}

/** Tesseract language list for a source choice ("auto" reads common Latin-script languages). */
function tesseractLangs(code) {
  if (code && code !== 'auto') {
    const t = lang(code)?.tess;
    // Many non-Latin scripts also contain English words (menus, signs).
    return t ? (t === 'eng' ? ['eng'] : [t, 'eng']) : ['eng'];
  }
  return ['eng', 'spa', 'fra', 'deu', 'ita'];
}

/**
 * Finds lines of text in an image (canvas, img or blob).
 * Returns [{ text, bbox: {x0, y0, x1, y1} }] in image pixels.
 */
export async function recognizeLines(image, sourceCode, onProgress) {
  const w = await getWorker(tesseractLangs(sourceCode), onProgress);
  const { data } = await w.recognize(image, {}, { blocks: true, text: true });
  const lines = [];
  for (const block of data.blocks ?? []) {
    for (const paragraph of block.paragraphs ?? []) {
      for (const line of paragraph.lines ?? []) {
        const text = line.text.replace(/\s+/g, ' ').trim();
        if (text.length < 2 || line.confidence <= 40) continue;
        // Line boxes can stop short of the last letters; widen them to cover every word.
        const bbox = { ...line.bbox };
        for (const word of line.words ?? []) {
          bbox.x0 = Math.min(bbox.x0, word.bbox.x0);
          bbox.y0 = Math.min(bbox.y0, word.bbox.y0);
          bbox.x1 = Math.max(bbox.x1, word.bbox.x1);
          bbox.y1 = Math.max(bbox.y1, word.bbox.y1);
        }
        lines.push({ text, bbox });
      }
    }
  }
  return lines;
}

export function hasOcr(code) {
  return code === 'auto' || Boolean(lang(code)?.tess);
}

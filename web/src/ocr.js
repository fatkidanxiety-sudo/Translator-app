// On-device text recognition in photos with Tesseract (WebAssembly).
//
// "Auto" first runs a quick script check (Latin, Cyrillic, Japanese, Han, Hangul, Arabic…), then
// reads the text with the matching languages. Language data (a few MB each) is downloaded the first
// time and then kept in the browser's IndexedDB, so it works offline afterwards.

import { createWorker } from 'tesseract.js';
import { LANGUAGES, lang } from './languages.js';

const base = new URL('./vendor/tesseract/', document.baseURI).href;
const workerOptions = (onProgress, extra = {}) => ({
  workerPath: `${base}worker.min.js`,
  corePath: base,
  workerBlobURL: false,
  logger: (m) => {
    if (typeof m.progress === 'number') onProgress?.(m.progress, m.status);
  },
  ...extra,
});

let readWorker = null;
let readLangs = '';
let osdWorker = null;
let idleTimer = null;

/** Frees the text-reading engines (they use a lot of memory on phones). */
export async function releaseOcr() {
  clearTimeout(idleTimer);
  const workers = [readWorker, osdWorker];
  readWorker = null;
  readLangs = '';
  osdWorker = null;
  for (const w of workers) {
    try {
      await (await w)?.terminate();
    } catch {
      /* already gone */
    }
  }
}

function scheduleRelease() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(releaseOcr, 45000);
}

async function getReadWorker(langs, onProgress) {
  scheduleRelease();
  const key = langs.join('+');
  if (readWorker && readLangs === key) return readWorker;
  const old = readWorker;
  readWorker = null;
  readLangs = '';
  old?.terminate();
  readWorker = await createWorker(langs, 1, workerOptions(onProgress));
  readLangs = key;
  return readWorker;
}

async function getOsdWorker(onProgress) {
  if (!osdWorker) {
    osdWorker = createWorker('osd', 0, workerOptions(onProgress, { legacyCore: true, legacyLang: true })).catch((e) => {
      osdWorker = null;
      throw e;
    });
  }
  return osdWorker;
}

// Tesseract's script names → languages that use that script.
const SCRIPT_LANGS = {
  Latin: LANGUAGES.filter((l) => l.script === 'Latin').map((l) => l.code),
  Cyrillic: ['ru', 'uk'],
  Greek: ['el'],
  Hebrew: ['he'],
  Arabic: ['ar', 'fa'],
  Devanagari: ['hi'],
  Thai: ['th'],
  Hangul: ['ko'],
  Japanese: ['ja'],
  Katakana: ['ja'],
  Hiragana: ['ja'],
  Han: ['zh', 'zh-TW'],
};

/** Guesses the writing system in the image. Returns e.g. "Latin", "Japanese", or null. */
export async function detectScript(image, onProgress) {
  scheduleRelease();
  try {
    const worker = await getOsdWorker(onProgress);
    const { data } = await worker.detect(image);
    return data?.script && data.script_confidence > 1 ? data.script : null;
  } catch {
    return null;
  }
}

/**
 * Picks Tesseract languages for a source choice. With "auto", uses the detected script and
 * prefers languages the person uses (`preferred`), at most 3 at a time to stay fast.
 */
export function tesseractLangsFor(sourceCode, script, preferred = []) {
  if (sourceCode && sourceCode !== 'auto') {
    const t = lang(sourceCode)?.tess;
    return t === 'eng' ? ['eng'] : [t, 'eng'];
  }
  const candidates = SCRIPT_LANGS[script] ?? SCRIPT_LANGS.Latin;
  const ordered = [...preferred.filter((c) => candidates.includes(c)), ...candidates.filter((c) => !preferred.includes(c))];
  const picked = ordered.slice(0, 3).map((c) => lang(c).tess);
  if (!picked.includes('eng') && (script === 'Latin' || !script)) picked.unshift('eng');
  if (script && script !== 'Latin' && !picked.includes('eng')) picked.push('eng'); // signs often mix in English
  return [...new Set(picked)].slice(0, 4);
}

/**
 * Reads text in an image (canvas). Returns { lines, confidence } where each line is
 * { text, confidence, bbox, words: [{ text, bbox, confidence }] } in image pixels.
 */
const CJK = /[\u3040-\u30ff\u4e00-\u9fff\uac00-\ud7af]/u;
const VOWELS = /[aeiouyàáâãäåæèéêëìíîïòóôõöøùúûüýÿąęěėįųůœаеёиоуыэюяіїєαεηιουωάέήίόύώ]/iu;

/**
 * Is this a real word, or texture/noise that Tesseract mistook for letters?
 * Real words: confident, mostly letters, not tiny, sensible shape, and (for Latin) contain a vowel.
 */
function looksLikeWord(w, imageHeight) {
  const text = w.text.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
  if (!text) return false;
  const h = w.bbox.y1 - w.bbox.y0;
  const width = w.bbox.x1 - w.bbox.x0;
  if (h < imageHeight * 0.012 || width < 4) return false;
  const ratio = width / h;
  const letters = (text.match(/[\p{L}\p{N}]/gu) ?? []).length;
  if (letters / text.length < 0.75) return false;
  if (CJK.test(text)) return w.confidence >= 55 && ratio < 12 * text.length;
  if (/^\d+([.,:]\d+)*$/.test(text)) return w.confidence >= 70; // numbers, prices, times
  if (text.length < 2) return /^\p{L}$/u.test(text) && w.confidence >= 75 && ratio > 0.2 && ratio < 1.6; // "o", "è", "a"
  if (ratio < 0.25 * text.length || ratio > 2.2 * text.length) return false; // squashed or stretched
  if (!VOWELS.test(text) && !/[\u0590-\u06ff\u0900-\u0e7f]/u.test(text)) return w.confidence >= 85 && text.length <= 4;
  return w.confidence >= 62;
}

export async function readText(image, langs, onProgress, { cleaned = false } = {}) {
  const worker = await getReadWorker(langs, onProgress);
  // Cleaned images are always dark text on white, so skip Tesseract's slow "try it inverted" pass.
  await worker.setParameters({ tessedit_do_invert: cleaned ? '0' : '1' });
  const { data } = await worker.recognize(image, {}, { blocks: true, text: false });
  scheduleRelease();
  const imageHeight = image.height || 1000;
  const noSpaces = langs.some((l) => ['jpn', 'chi_sim', 'chi_tra', 'tha'].includes(l));
  const lines = [];
  for (const block of data.blocks ?? []) {
    for (const paragraph of block.paragraphs ?? []) {
      for (const line of paragraph.lines ?? []) {
        const words = (line.words ?? [])
          .map((w) => ({ text: w.text.trim(), bbox: w.bbox, confidence: w.confidence }))
          .filter((w) => w.text && looksLikeWord(w, imageHeight));
        // A "line" that is mostly noise is dropped entirely.
        if (!words.length || words.length < (line.words?.length ?? 0) * 0.4) continue;
        const text = words.map((w) => w.text).join(noSpaces ? '' : ' ');
        if (text.length < 2) continue;
        // Line boxes can stop short of the last letters; widen them to cover every word.
        const bbox = { ...line.bbox };
        for (const w of words) {
          bbox.x0 = Math.min(bbox.x0, w.bbox.x0);
          bbox.y0 = Math.min(bbox.y0, w.bbox.y0);
          bbox.x1 = Math.max(bbox.x1, w.bbox.x1);
          bbox.y1 = Math.max(bbox.y1, w.bbox.y1);
        }
        const confidence = words.reduce((sum, w) => sum + w.confidence, 0) / words.length;
        bbox.x0 = Math.min(...words.map((w) => w.bbox.x0));
        bbox.x1 = Math.max(...words.map((w) => w.bbox.x1));
        bbox.y0 = Math.min(...words.map((w) => w.bbox.y0));
        bbox.y1 = Math.max(...words.map((w) => w.bbox.y1));
        lines.push({ text, confidence, bbox, words });
      }
    }
  }
  const confidence = lines.length ? lines.reduce((s, l) => s + l.confidence * l.text.length, 0) / lines.reduce((s, l) => s + l.text.length, 0) : 0;
  return { lines, confidence };
}

// When the quick script check isn't sure, try these in order and keep the clearest reading.
const FALLBACK_PASSES = [
  ['eng', 'spa', 'fra'],
  ['jpn', 'chi_sim', 'kor'],
  ['rus', 'ell'],
  ['ara', 'heb'],
  ['hin', 'tha'],
];

/**
 * Reads a photo without knowing its language. Returns { lines, confidence, script }.
 * `preferred` = language codes the person uses, tried first.
 */
export async function autoRead(image, preferred, onStatus, options = {}) {
  const script = await detectScript(image, (p, s) => /load/i.test(s) && onStatus?.('Preparing text reading…'));
  if (script) {
    // Latin: read with English first (fast, handles most alphabets); the caller re-reads once the language is known.
    const langs = script === 'Latin' ? ['eng'] : tesseractLangsFor('auto', script, preferred);
    const result = await readText(image, langs, (p, s) => /load/i.test(s) && onStatus?.('Preparing text reading…'), options);
    if (result.confidence >= 55 || script !== 'Latin') return { ...result, script, pass: langs };
  }
  let best = { lines: [], confidence: 0 };
  for (const pass of FALLBACK_PASSES) {
    const result = await readText(image, pass, undefined, options);
    if (result.confidence > best.confidence) best = { ...result, pass };
    if (result.confidence >= 72) break;
  }
  return best;
}

/** Downloads text-recognition data for these languages ahead of time (for offline use). */
export async function prepareOcr(codes, onProgress) {
  const tess = [...new Set(['eng', ...codes.map((c) => lang(c)?.tess).filter(Boolean)])];
  let done = 0;
  await getOsdWorker();
  for (const t of tess) {
    // Loading a worker for a language stores its data in IndexedDB; then free it right away.
    const w = await createWorker(t, 1, workerOptions());
    await w.terminate();
    onProgress?.(++done / tess.length);
  }
  await releaseOcr();
}

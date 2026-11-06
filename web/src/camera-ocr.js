// Reads text in camera photos with PaddleOCR (see ocr.worker.js).
// Picks the right reader for the language (or tries the likely ones when the language is "auto"),
// and joins pieces of the same printed line so they translate as one phrase.

import { getOcrModels } from './models.js';

/** Which PaddleOCR reader handles each app language (null = not supported; use the fallback). */
const SCRIPT_OF = {
  en: 'latin', es: 'latin', fr: 'latin', de: 'latin', it: 'latin', pt: 'latin', nl: 'latin', pl: 'latin',
  cs: 'latin', ro: 'latin', sv: 'latin', tr: 'latin', id: 'latin', vi: 'latin',
  ru: 'eslav', uk: 'eslav', el: 'greek', ar: 'arabic', fa: 'arabic', hi: 'hindi', th: 'thai', ko: 'korean',
  zh: 'cjk', 'zh-TW': 'cjk', ja: 'cjk', he: null,
};
const ALL_SCRIPTS = ['latin', 'cjk', 'eslav', 'korean', 'arabic', 'greek', 'hindi', 'thai'];
const SCRIPT_CHARS = {
  cjk: /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/u,
  eslav: /[\u0400-\u04ff]/u,
  korean: /[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f]/u,
  arabic: /[\u0600-\u06ff\u0750-\u077f]/u,
  greek: /[\u0370-\u03ff]/u,
  hindi: /[\u0900-\u097f]/u,
  thai: /[\u0e00-\u0e7f]/u,
};

/** Share of words that look like real words in their alphabet (0–1). */
function cleanWords(text, ownChars) {
  const words = text.split(/\s+/).filter((w) => /\p{L}/u.test(w));
  if (!words.length) return 0;
  const good = words.filter((w) => {
    const core = w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
    if (/\p{L}\p{N}|\p{N}\p{L}/u.test(core)) return false; // digit inside a word: "Δο6ρο"
    if (/\p{Ll}\p{Lu}/u.test(core)) return false; // capital in the middle: "ποκαποΒατό"
    const letters = core.match(/\p{L}/gu) ?? [];
    const own = letters.filter((c) => ownChars.test(c)).length;
    return own === 0 || own === letters.length; // not a mix of alphabets: "BbiΧΟΔ"
  });
  return good.length / words.length;
}

export const ocrScriptFor = (code) => (code in SCRIPT_OF ? SCRIPT_OF[code] : 'latin');

let worker = null;
let nextId = 1;
const pending = new Map();
let detLoaded = false;
const recLoaded = new Set();
let idleTimer = null;

function getWorker() {
  if (worker) return worker;
  worker = new Worker(new URL('./ocr-worker.js', import.meta.url), { type: 'module' });
  worker.onmessage = ({ data }) => {
    const entry = pending.get(data.id);
    if (!entry) return;
    if (data.type === 'progress') {
      entry.onProgress?.(data);
      return;
    }
    pending.delete(data.id);
    if (data.type === 'result') entry.resolve(data.result);
    else entry.reject(new Error(data.message));
  };
  worker.onerror = (event) => {
    for (const entry of pending.values()) entry.reject(new Error(event.message || 'Camera reading stopped.'));
    pending.clear();
    releaseCameraReader();
  };
  return worker;
}

function request(type, payload = {}, transfer = [], onProgress) {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(releaseCameraReader, 45000);
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject, onProgress });
    getWorker().postMessage({ id, type, ...payload }, transfer);
  });
}

/** Frees the camera reader's memory (it restarts from the phone's storage when needed). */
export function releaseCameraReader() {
  clearTimeout(idleTimer);
  if (pending.size) return;
  worker?.terminate();
  worker = null;
  detLoaded = false;
  recLoaded.clear();
}

async function ensureRec(script) {
  if (detLoaded && recLoaded.has(script) && (await request('hasRec', { script }))) return;
  const files = await getOcrModels(script, { includeDet: !detLoaded });
  if (!detLoaded) {
    await request('loadDet', { model: files.det }, [files.det]);
    detLoaded = true;
  }
  await request('loadRec', { script, model: files.model, dict: files.dict }, [files.model]);
  recLoaded.add(script);
}

/** Starts the reader in the background (so the first photo is quick). */
export function warmCameraReader(script = 'latin') {
  return ensureRec(script).catch(() => {});
}

/** Joins boxes that sit on the same printed line ("Gnocchi di Patate allo" + "Zafferano"). */
function mergeRows(lines, joiner) {
  const sorted = [...lines].sort((a, b) => (a.bbox.y0 + a.bbox.y1) / 2 - (b.bbox.y0 + b.bbox.y1) / 2);
  const rows = [];
  for (const line of sorted) {
    const h = line.bbox.y1 - line.bbox.y0;
    const row = rows.find((r) => {
      const rh = r.bbox.y1 - r.bbox.y0;
      const overlap = Math.min(r.bbox.y1, line.bbox.y1) - Math.max(r.bbox.y0, line.bbox.y0);
      const gap = line.bbox.x0 - r.bbox.x1;
      return overlap > Math.min(h, rh) * 0.6 && h / rh > 0.7 && h / rh < 1.4 && gap > -h * 0.3 && gap < h * 0.6; // separate dishes side by side stay separate
    });
    if (row) {
      const chars = row.text.length + line.text.length;
      row.confidence = (row.confidence * row.text.length + line.confidence * line.text.length) / chars;
      row.text = `${row.text}${joiner}${line.text}`;
      row.words.push(...line.words);
      row.bbox = { x0: Math.min(row.bbox.x0, line.bbox.x0), y0: Math.min(row.bbox.y0, line.bbox.y0), x1: Math.max(row.bbox.x1, line.bbox.x1), y1: Math.max(row.bbox.y1, line.bbox.y1) };
    } else rows.push({ ...line, words: [...line.words] });
  }
  // Reading order: top to bottom, then left to right.
  return rows.sort((a, b) => (Math.abs(a.bbox.y0 - b.bbox.y0) < (a.bbox.y1 - a.bbox.y0) * 0.5 ? a.bbox.x0 - b.bbox.x0 : a.bbox.y0 - b.bbox.y0));
}

/**
 * Reads the text in a photo (canvas). `sourceCode` is a language code or "auto".
 * Returns { lines, confidence (0–100), script } — or null if this language needs the fallback reader.
 */
export async function readPhoto(canvas, sourceCode, preferredCodes = [], onStatus) {
  const fixed = sourceCode !== 'auto' ? ocrScriptFor(sourceCode) : undefined;
  if (fixed === null) return null;

  onStatus?.('Finding text…');
  await ensureRec(fixed ?? 'latin');
  const bitmap = await createImageBitmap(canvas);
  const found = await request('detect', { bitmap }, [bitmap]);
  if (!found) return { lines: [], confidence: 0, script: fixed ?? 'latin' };

  let script = fixed;
  if (!script) {
    // Every reader can also read Latin letters, so confidence alone can't tell alphabets apart.
    // 1. Latin first: if it reads the photo confidently, it's a Latin-alphabet language.
    // 2. Otherwise use the reader whose output is mostly its own alphabet (Cyrillic, kanji, Hangul…).
    onStatus?.('Reading text…');
    await ensureRec('latin');
    const latin = await request('sample', { script: 'latin' });
    script = 'latin';
    if (latin.score < 0.85) {
      const others = [...new Set([...preferredCodes.map(ocrScriptFor).filter((s) => s && s !== 'latin'), ...ALL_SCRIPTS.filter((s) => s !== 'latin')])];
      // Readers can turn one alphabet into look-alike letters of another (Cyrillic → Greek), so also
      // check that the words look like real words: no digits inside words, no stray capitals,
      // no mixing of alphabets within a word.
      let best = { script: 'latin', value: 0.35 };
      for (const candidate of others) {
        await ensureRec(candidate);
        const { score, text } = await request('sample', { script: candidate });
        const letters = text.match(/\p{L}/gu) ?? [];
        const own = letters.length ? letters.filter((c) => SCRIPT_CHARS[candidate].test(c)).length / letters.length : 0;
        const value = score * own * cleanWords(text, SCRIPT_CHARS[candidate]);
        if (value > best.value) best = { script: candidate, value };
        if (value >= 0.6) break;
      }
      script = best.script;
    }
  }

  onStatus?.('Reading text…');
  await ensureRec(script);
  const raw = await request('read', { script }, [], ({ done, total }) => onStatus?.(`Reading text… ${Math.round((done / total) * 100)}%`));
  const lines = mergeRows(raw, script === 'cjk' || script === 'thai' ? '' : ' ');
  const chars = lines.reduce((s, l) => s + l.text.length, 0);
  const confidence = chars ? (lines.reduce((s, l) => s + l.confidence * l.text.length, 0) / chars) * 100 : 0;
  return { lines, confidence, script };
}

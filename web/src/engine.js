// Main-thread client for engine.worker.js: promise-based requests with progress events.

import { lang, MODELS, route, SPEECH_MODEL } from './languages.js';

const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
let nextId = 1;
const pending = new Map();

worker.onmessage = ({ data }) => {
  const entry = pending.get(data.id);
  if (!entry) return;
  if (data.type === 'progress') {
    entry.onProgress?.(data);
  } else if (data.type === 'result') {
    pending.delete(data.id);
    entry.resolve(data.result);
  } else if (data.type === 'error') {
    pending.delete(data.id);
    entry.reject(new Error(data.message));
  }
};

worker.onerror = (event) => {
  for (const entry of pending.values()) entry.reject(new Error(event.message || 'The translation engine stopped.'));
  pending.clear();
};

function request(type, payload = {}, onProgress, transfer = []) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject, onProgress });
    worker.postMessage({ id, type, ...payload }, transfer);
  });
}

request('init', { speechModel: SPEECH_MODEL });

/**
 * Aggregates per-file progress events into a single 0…1 fraction per request.
 * Calls `callback(fraction, label)`.
 */
export function progressTracker(callback) {
  const files = new Map();
  return (event) => {
    if (!event.file || !event.total) return;
    files.set(`${event.model}/${event.file}`, { loaded: event.loaded, total: event.total });
    let loaded = 0;
    let total = 0;
    for (const f of files.values()) {
      loaded += f.loaded;
      total += f.total;
    }
    callback(total ? loaded / total : 0, total);
  };
}

/** Translates text. Throws if the pair isn't supported. */
export async function translate(text, src, tgt, onProgress) {
  const pairs = route(src, tgt);
  if (pairs === null) throw new Error(`${lang(src).name} → ${lang(tgt).name} isn't available offline.`);
  if (!text.trim() || pairs.length === 0) return text;
  return request(
    'translate',
    {
      text,
      sourceLang: src,
      targetNoSpaces: Boolean(lang(tgt).noSpaces),
      pairs: pairs.map((p) => ({ pair: p, model: MODELS.get(p) })),
    },
    onProgress,
  );
}

/** Turns 16 kHz mono audio into text. `languageCode` may be null to auto-detect. */
export function transcribe(audio, languageCode, onProgress) {
  const whisper = languageCode ? lang(languageCode)?.whisper : null;
  return request('transcribe', { audio, language: whisper }, onProgress, [audio.buffer]);
}

export function downloadPairs(pairs, onProgress) {
  return request('download', { models: pairs.map((p) => MODELS.get(p)), kind: 'translation' }, onProgress);
}

export function downloadSpeech(onProgress) {
  return request('download', { models: [SPEECH_MODEL], kind: 'speech' }, onProgress);
}

export function removePairs(pairs) {
  return request('remove', { models: pairs.map((p) => MODELS.get(p)) });
}

export function removeSpeech() {
  return request('remove', { models: [SPEECH_MODEL] });
}

/** Which pairs (and the speech model) are fully downloaded. Returns { pairs: Set, speech: bool }. */
export async function downloadedStatus() {
  const models = [...MODELS.entries()].map(([, model]) => ({ model, kind: 'translation' }));
  models.push({ model: SPEECH_MODEL, kind: 'speech' });
  const result = await request('status', { models });
  const pairs = new Set([...MODELS.entries()].filter(([, m]) => result[m]).map(([p]) => p));
  return { pairs, speech: Boolean(result[SPEECH_MODEL]) };
}

/** Whether `src` → `tgt` works right now without internet. */
export function isPairReady(status, src, tgt) {
  const pairs = route(src, tgt);
  return pairs !== null && pairs.every((p) => status.pairs.has(p));
}

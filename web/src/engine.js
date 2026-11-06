// Main-thread client for the voice-input worker (engine.worker.js).

import { lang, SPEECH_MODEL } from './languages.js';

let worker = null;
let nextId = 1;
const pending = new Map();

function getWorker() {
  if (worker) return worker;
  worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
  worker.onmessage = ({ data }) => {
    const entry = pending.get(data.id);
    if (!entry) return;
    if (data.type === 'progress') entry.onProgress?.(data);
    else {
      pending.delete(data.id);
      if (data.type === 'result') entry.resolve(data.result);
      else entry.reject(new Error(data.message));
    }
  };
  worker.onerror = (event) => {
    for (const entry of pending.values()) entry.reject(new Error(event.message || 'Voice input stopped.'));
    pending.clear();
  };
  worker.postMessage({ id: 0, type: 'init', speechModel: SPEECH_MODEL });
  return worker;
}

function request(type, payload = {}, onProgress, transfer = []) {
  touch();
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject, onProgress });
    getWorker().postMessage({ id, type, ...payload }, transfer);
  });
}

/** Combines per-file progress events into one 0…1 fraction. */
export function progressTracker(callback) {
  const files = new Map();
  return (event) => {
    if (!event.file || !event.total) return;
    files.set(event.file, { loaded: event.loaded, total: event.total });
    let loaded = 0;
    let total = 0;
    for (const f of files.values()) {
      loaded += f.loaded;
      total += f.total;
    }
    callback(total ? loaded / total : 0);
  };
}

/** Turns 16 kHz mono audio into text. `languageCode` may be null to auto-detect. */
export function transcribe(audio, languageCode) {
  const whisper = languageCode ? lang(languageCode)?.whisper : null;
  return request('transcribe', { audio, language: whisper }, null, [audio.buffer]);
}

export const downloadSpeech = (onProgress) => request('download', {}, onProgress && progressTracker(onProgress));
export const removeSpeech = () => request('remove');
export const speechReady = () => request('status');

/** Shuts the voice engine down to free memory; it restarts (from the phone's cache) when needed. */
export function release() {
  if (!worker || pending.size) return;
  worker.terminate();
  worker = null;
}

// Free the voice engine after a minute without use.
let idle = null;
export function touch() {
  clearTimeout(idle);
  idle = setTimeout(release, 60000);
}

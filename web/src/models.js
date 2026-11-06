// Downloads translation models once and keeps them on the device.
//
// Models are hosted (gzip-compressed) on this repository's "models" branch. They are downloaded
// several files at a time, unpacked in the browser, checked against their SHA-256 hash, and saved
// in Cache Storage. After that, translation never touches the network.

import { lang, packPairs, PACK_CODES } from './languages.js';

export const MODEL_BASE = 'https://raw.githubusercontent.com/fatkidanxiety-sudo/Translator-app/models/';
const CACHE = 'parlivo-models-v1';
const KEY_BASE = 'https://parlivo.local/models/';
const PARALLEL = 4;

let registry = null;
/** Registry pairs whose files are all saved on this device. */
const installedPairs = new Set();
const listeners = new Set();

function emit() {
  for (const fn of listeners) fn(state());
}

/** Subscribe to download/installed changes. Returns an unsubscribe function. */
export function onChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// ---- Registry ---------------------------------------------------------------------------

export async function loadRegistry() {
  if (registry) return registry;
  try {
    const cached = localStorage.getItem('modelRegistry');
    if (cached) registry = JSON.parse(cached);
  } catch {
    /* ignore */
  }
  if (navigator.onLine || !registry) {
    try {
      const response = await fetch(`${MODEL_BASE}registry.json`, { cache: 'no-cache' });
      if (response.ok) {
        registry = await response.json();
        try {
          localStorage.setItem('modelRegistry', JSON.stringify(registry));
        } catch {
          /* ignore */
        }
      }
    } catch {
      /* offline: use the saved copy */
    }
  }
  if (!registry) throw new Error('Connect to the internet once so Parlivo can see which languages are available.');
  return registry;
}

const fileKey = (pair, kind) => `${KEY_BASE}${pair}/${kind}`;

/** Unpacked size of a pair's model files in bytes (0 if unknown). */
export function pairBytes(pair) {
  const entry = registry?.pairs[pair];
  return entry ? Object.values(entry.files).reduce((sum, f) => sum + f.size, 0) : 0;
}

/** Checks which model pairs are already on the device (fast: one listing of the cache). */
export async function scanInstalled() {
  const reg = await loadRegistry().catch(() => null);
  if (!reg) return;
  const cache = await caches.open(CACHE);
  const have = new Set((await cache.keys()).map((r) => r.url));
  installedPairs.clear();
  for (const [pair, entry] of Object.entries(reg.pairs)) {
    if (Object.keys(entry.files).every((kind) => have.has(fileKey(pair, kind)))) installedPairs.add(pair);
  }
  emit();
}

export const isPairInstalled = (pair) => installedPairs.has(pair);
export const isPackInstalled = (code) => code === 'en' || packPairs(code).every((p) => installedPairs.has(p));
export const installedPacks = () => PACK_CODES.filter(isPackInstalled);

/** Compressed download size of language packs, in bytes (remaining only if `remainingOnly`). */
export function packBytes(codes, remainingOnly = false) {
  if (!registry) return 0;
  let total = 0;
  for (const code of codes) {
    for (const pair of packPairs(code)) {
      if (remainingOnly && installedPairs.has(pair)) continue;
      const entry = registry.pairs[pair];
      if (entry) for (const f of Object.values(entry.files)) total += f.gzSize;
    }
  }
  return total;
}

// ---- Reading models ---------------------------------------------------------------------

/** Returns the model files for a pair as ArrayBuffers, downloading them first if needed. */
export async function getModelBuffers(pair, onProgress) {
  const reg = await loadRegistry();
  const entry = reg.pairs[pair];
  if (!entry) throw new Error(`No model for ${pair}`);
  if (!installedPairs.has(pair)) {
    if (!navigator.onLine) throw new Error('offline-not-downloaded');
    await downloadPairs([pair], onProgress);
  }
  const cache = await caches.open(CACHE);
  const out = {};
  for (const kind of Object.keys(entry.files)) {
    const response = await cache.match(fileKey(pair, kind));
    if (!response) {
      installedPairs.delete(pair);
      throw new Error('A downloaded language file is missing. Please download the language again.');
    }
    out[kind] = await response.arrayBuffer();
  }
  return out;
}

// ---- Downloading ------------------------------------------------------------------------

let job = null; // { codes, total, done, startedAt, controller, promise, speed }

export function state() {
  return {
    installed: new Set(installedPairs),
    downloading: job
      ? { codes: job.codes, total: job.total, done: job.done, fraction: job.total ? job.done / job.total : 0, bytesPerSecond: job.speed, current: job.current }
      : null,
  };
}

async function downloadFile(pair, kind, info, controller, onBytes) {
  const response = await fetch(MODEL_BASE + info.path, { signal: controller.signal, cache: 'no-store' });
  if (!response.ok) throw new Error(`Download failed (${response.status})`);
  // Read the compressed bytes while counting them for the progress bar…
  const reader = response.body.getReader();
  const chunks = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    onBytes(value.byteLength);
  }
  // …then unpack and verify.
  const unpacked = await new Response(new Blob(chunks).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
  if (unpacked.byteLength !== info.size) throw new Error('Downloaded file was incomplete. Please try again.');
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', unpacked));
  const hex = Array.from(digest, (b) => b.toString(16).padStart(2, '0')).join('');
  if (hex !== info.sha256) throw new Error('Downloaded file was damaged. Please try again.');
  const cache = await caches.open(CACHE);
  await cache.put(fileKey(pair, kind), new Response(unpacked, { headers: { 'Content-Type': 'application/octet-stream' } }));
}

/**
 * Downloads every missing file of the given registry pairs, several in parallel.
 * `onProgress(fraction)` is optional; subscribers to onChange() also get updates.
 */
export async function downloadPairs(pairs, onProgress, codes = []) {
  const reg = await loadRegistry();
  if (job) {
    // Already downloading: wait for it, then fetch anything still missing.
    await job.promise.catch(() => {});
    if (pairs.every((p) => installedPairs.has(p))) return;
  }
  const cache = await caches.open(CACHE);
  const have = new Set((await cache.keys()).map((r) => r.url));
  const files = [];
  for (const pair of pairs) {
    const entry = reg.pairs[pair];
    if (!entry) continue;
    for (const [kind, info] of Object.entries(entry.files)) {
      if (!have.has(fileKey(pair, kind))) files.push({ pair, kind, info });
    }
  }
  if (!files.length) {
    pairs.forEach((p) => reg.pairs[p] && installedPairs.add(p));
    emit();
    return;
  }

  const controller = new AbortController();
  const current = { codes, total: files.reduce((s, f) => s + f.info.gzSize, 0), done: 0, startedAt: performance.now(), controller, speed: 0, current: null };
  job = current;
  let lastEmit = 0;
  const onBytes = (n) => {
    current.done += n;
    const elapsed = (performance.now() - current.startedAt) / 1000;
    current.speed = elapsed > 0.5 ? current.done / elapsed : 0;
    const now = performance.now();
    if (now - lastEmit > 120) {
      lastEmit = now;
      onProgress?.(current.done / current.total);
      emit();
    }
  };

  // Biggest files first, so the parallel downloads finish at about the same time.
  files.sort((a, b) => b.info.gzSize - a.info.gzSize);
  const queue = [...files];
  const finishedPairs = new Map(pairs.map((p) => [p, 0]));
  const needed = new Map();
  for (const f of files) needed.set(f.pair, (needed.get(f.pair) ?? 0) + 1);

  current.promise = (async () => {
    const workers = Array.from({ length: Math.min(PARALLEL, queue.length) }, async () => {
      while (queue.length && !controller.signal.aborted) {
        const f = queue.shift();
        current.current = f.pair;
        let attempt = 0;
        for (;;) {
          const before = current.done;
          try {
            await downloadFile(f.pair, f.kind, f.info, controller, onBytes);
            break;
          } catch (error) {
            current.done = before; // undo partial progress
            if (controller.signal.aborted || ++attempt >= 3) throw error;
            await new Promise((r) => setTimeout(r, 800 * attempt));
          }
        }
        finishedPairs.set(f.pair, finishedPairs.get(f.pair) + 1);
        if (finishedPairs.get(f.pair) === needed.get(f.pair)) {
          installedPairs.add(f.pair);
          emit();
        }
      }
    });
    await Promise.all(workers);
  })();

  try {
    await current.promise;
    pairs.forEach((p) => reg.pairs[p] && !needed.has(p) && installedPairs.add(p));
    onProgress?.(1);
  } catch (error) {
    if (controller.signal.aborted) throw new Error('Download stopped.');
    throw new Error(navigator.onLine ? `Download failed: ${error.message}` : 'Lost the internet connection. Tap Download to continue where it stopped.');
  } finally {
    if (job === current) job = null;
    emit();
  }
}

/** Downloads whole language packs (to and from English). */
export function downloadPacks(codes, onProgress) {
  return downloadPairs(codes.flatMap(packPairs), onProgress, codes);
}

export function cancelDownload() {
  job?.controller.abort();
}

export async function removePacks(codes) {
  const cache = await caches.open(CACHE);
  for (const code of codes) {
    for (const pair of packPairs(code)) {
      for (const kind of ['model', 'lex', 'vocab', 'srcvocab', 'trgvocab']) await cache.delete(fileKey(pair, kind));
      installedPairs.delete(pair);
    }
  }
  emit();
}

export const languageName = (code) => lang(code)?.name ?? code;

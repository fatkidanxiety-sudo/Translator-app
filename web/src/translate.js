// Fast on-device translation with Mozilla's Bergamot engine (the one inside Firefox).
// Runs in its own Web Worker; models come from models.js (downloaded once, then offline).

import { BatchTranslator, TranslatorBacking } from '@mkljczk/bergamot-translator';
import { lang, routePairs } from './languages.js';
import { getModelBuffers, loadRegistry, pairBytes } from './models.js';

const WORKER_URL = new URL('./vendor/bergamot/translator-worker.js', document.baseURI).href;
// The engine has a fixed amount of memory. Keep the loaded models under this budget (unpacked file
// sizes); beyond it, restart the engine with just the languages needed now.
const MODEL_BUDGET = 130e6;
const TRANSLATE_TIMEOUT = 20000;

class ParlivoBacking extends TranslatorBacking {
  /** Once the engine has a model, drop this thread's copy (it can be re-read from the cache). */
  getTranslationModel(key, options) {
    const promise = super.getTranslationModel(key, options);
    const id = JSON.stringify({ from: key.from, to: key.to });
    promise.then(() => setTimeout(() => this.buffers.get(id) === promise && this.buffers.delete(id), 5000)).catch(() => {});
    return promise;
  }

  async loadModelRegistry() {
    const reg = await loadRegistry();
    return Object.entries(reg.pairs).map(([pair, entry]) => {
      const [from, to] = splitPair(pair);
      return { from, to, files: entry.files };
    });
  }

  async loadTranslationModel({ from, to }) {
    const files = await getModelBuffers(`${from}-${to}`, this.onDownloadProgress);
    return {
      model: files.model,
      shortlist: files.lex,
      vocabs: files.vocab ? [files.vocab] : [files.srcvocab, files.trgvocab],
      config: {},
    };
  }
}

/** "en-zh-Hans" → ["en", "zh-Hans"], "zh-Hant-en" → ["zh-Hant", "en"]. */
function splitPair(pair) {
  if (pair.startsWith('en-')) return ['en', pair.slice(3)];
  return [pair.slice(0, -3), 'en'];
}

let translator = null;
let backing = null;
const loadedPairs = new Set();

function getTranslator() {
  if (!translator) {
    backing = new ParlivoBacking({ workerUrl: WORKER_URL, pivotLanguage: 'en', downloadTimeout: 0 });
    translator = new BatchTranslator({ workers: 1, batchSize: 16 }, backing);
    loadedPairs.clear();
  }
  return translator;
}

function restartEngine() {
  const old = translator;
  translator = null;
  warmed.clear();
  loadedPairs.clear();
  if (old) setTimeout(() => old.delete().catch?.(() => {}), 1000);
}

/** Makes room for `pairs`: if loading them would go over the memory budget, start a fresh engine. */
function trackPairs(pairs) {
  const after = new Set([...loadedPairs, ...pairs]);
  const bytes = [...after].reduce((sum, p) => sum + (pairBytes(p) || 40e6), 0);
  if (bytes > MODEL_BUDGET && loadedPairs.size) restartEngine();
  pairs.forEach((p) => loadedPairs.add(p));
}

/** Cleans up small punctuation quirks and matches the source's ending. */
function tidy(source, output, tgt) {
  let text = output.trim().replace(/([?!？！])\s*[.。]$/u, '$1');
  if (!/^[-–—•]/u.test(source.trim())) text = text.replace(/^[-–—•]\s*/u, ''); // stray leading dash
  if (!/[.!?。！？…:;]$/u.test(source.trim())) text = text.replace(/[.。]$/u, '');
  if (tgt === 'es') text = spanishMarks(text);
  return text;
}

const ES_QUESTION_START = /^(qué|que|cómo|dónde|adónde|cuándo|cuál|cuáles|quién|quiénes|cuánto|cuánta|cuántos|cuántas|por qué|puedes|puede|podría|podrías|hay|tienes|tiene|tienen|es|está|estás|son|hablas|habla|sabes|sabe|quieres|quiere|me|te|le|nos)\b/iu;

/** Spanish questions and exclamations open with ¿ and ¡ ("Hola, ¿cómo estás?"). */
function spanishMarks(text) {
  return text
    .split(/(?<=[.!?])\s+/u)
    .map((sentence) => {
      const end = sentence.at(-1);
      const open = end === '?' ? '¿' : end === '!' ? '¡' : null;
      if (!open || sentence.includes(open)) return sentence;
      // "Hola, cómo estás?" → the question starts after the comma.
      const comma = sentence.lastIndexOf(', ');
      if (comma > 0 && ES_QUESTION_START.test(sentence.slice(comma + 2))) {
        return `${sentence.slice(0, comma + 2)}${open}${sentence.slice(comma + 2)}`;
      }
      return open + sentence;
    })
    .join(' ');
}

/**
 * Translates text from `src` to `tgt` (app language codes). Keeps line breaks.
 * `onDownloadProgress(fraction)` is called if a model has to be downloaded first.
 */
export async function translate(text, src, tgt, { onDownloadProgress } = {}) {
  if (!text.trim() || src === tgt) return text;
  const from = lang(src).model;
  const to = lang(tgt).model;
  trackPairs(routePairs(src, tgt));
  const t = getTranslator();
  backing.onDownloadProgress = onDownloadProgress;

  const lines = text.split('\n').map(sentenceCase);
  const run = (engine) =>
    Promise.all(
      lines.map((line) =>
        line.trim()
          ? engine.translate({ from, to, text: line, html: false, qualityScores: false }).then((r) => tidy(line, r.target.text, tgt))
          : Promise.resolve(''),
      ),
    );
  try {
    return (await withTimeout(run(t), TRANSLATE_TIMEOUT)).join('\n');
  } catch (error) {
    if (/offline-not-downloaded|isn’t downloaded|missing/i.test(error?.message ?? '')) throw error;
    // The engine crashed (e.g. out of memory) or got stuck: start fresh with only this pair and retry once.
    restartEngine();
    trackPairs(routePairs(src, tgt));
    return (await withTimeout(run(getTranslator()), TRANSLATE_TIMEOUT)).join('\n');
  }
}

function withTimeout(promise, ms) {
  return Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error('Translation took too long.')), ms))]);
}

/** Signs are often ALL CAPS, which translation models handle badly; "FUMARE O USARE" → "Fumare o usare". */
function sentenceCase(line) {
  const letters = line.match(/\p{L}/gu) ?? [];
  if (letters.length < 4) return line;
  const upper = letters.filter((c) => c !== c.toLocaleLowerCase()).length;
  if (upper / letters.length < 0.85) return line;
  const lower = line.toLocaleLowerCase();
  return lower.replace(/\p{L}/u, (c) => c.toLocaleUpperCase());
}

/** Translates many short strings at once (phrasebook, photo lines). */
export async function translateMany(texts, src, tgt, options) {
  if (src === tgt) return texts.slice();
  const joined = await translate(texts.map((t) => t.replace(/\n/g, ' ')).join('\n'), src, tgt, options);
  return joined.split('\n');
}

/**
 * Starts the engine and loads language pairs in the background, so the first real translation is
 * instant. `pairs` is a list of [from, to]; pairs already loaded are skipped.
 */
const warmed = new Set();
let warming = Promise.resolve();
export function warmUp(...pairs) {
  for (const [src, tgt] of pairs) {
    if (!src || !tgt || src === tgt || src === 'auto') continue;
    const key = `${src}>${tgt}`;
    if (warmed.has(key)) continue;
    warmed.add(key);
    // One at a time, so a real translation never waits behind several model loads.
    warming = warming.then(() => {
      // Preloading must never push out languages already loaded (that would restart the engine).
      const after = new Set([...loadedPairs, ...routePairs(src, tgt)]);
      const bytes = [...after].reduce((sum, p) => sum + (pairBytes(p) || 40e6), 0);
      if (bytes > MODEL_BUDGET && loadedPairs.size) {
        warmed.delete(key);
        return null;
      }
      return translate('Hello', src, tgt).catch(() => warmed.delete(key));
    });
  }
  return warming;
}

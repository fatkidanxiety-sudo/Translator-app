// Fast on-device translation with Mozilla's Bergamot engine (the one inside Firefox).
// Runs in its own Web Worker; models come from models.js (downloaded once, then offline).

import { BatchTranslator, TranslatorBacking } from '@mkljczk/bergamot-translator';
import { lang, routePairs } from './languages.js';
import { getModelBuffers, loadRegistry } from './models.js';

const WORKER_URL = new URL('./vendor/bergamot/translator-worker.js', document.baseURI).href;
const MAX_LOADED_PAIRS = 2; // keep memory in check on phones (a pair through English uses 2)

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

/** Frees the engine's memory if many different languages have been loaded. */
function trackPairs(pairs) {
  pairs.forEach((p) => loadedPairs.add(p));
  if (loadedPairs.size > MAX_LOADED_PAIRS && translator) {
    const old = translator;
    translator = null;
    setTimeout(() => old.delete(), 2000);
    getTranslator();
    pairs.forEach((p) => loadedPairs.add(p));
  }
}

/** Cleans up small punctuation quirks and matches the source's ending. */
function tidy(source, output, tgt) {
  let text = output.trim().replace(/([?!？！])\s*[.。]$/u, '$1');
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
  const results = await Promise.all(
    lines.map((line) =>
      line.trim()
        ? t.translate({ from, to, text: line, html: false, qualityScores: false }).then((r) => tidy(line, r.target.text, tgt))
        : Promise.resolve(''),
    ),
  );
  return results.join('\n');
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

/** Loads a pair's model in the background so the first translation is instant. */
export function warmUp(src, tgt) {
  if (!src || !tgt || src === tgt) return;
  translate('Hi', src === 'en' ? 'en' : src, tgt).catch(() => {});
}

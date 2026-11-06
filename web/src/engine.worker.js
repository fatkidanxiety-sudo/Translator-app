// Runs the AI models off the main thread so the UI stays smooth.
// Models are downloaded once from Hugging Face and then kept in the browser's
// Cache Storage, so after that everything here works with no connection.

import { env, pipeline } from '@huggingface/transformers';

env.allowLocalModels = false;
env.useBrowserCache = true;
// The ONNX runtime's WebAssembly files ship with the app (see build.mjs),
// so nothing is fetched from a CDN at run time.
env.backends.onnx.wasm.wasmPaths = new URL('./vendor/ort/', self.location.href).href;
env.backends.onnx.wasm.proxy = false;

const CACHE_NAME = 'transformers-cache';
const HUB = 'https://huggingface.co';
const MAX_TRANSLATORS = 2;

/** modelId → Promise<pipeline>, in least-recently-used order. */
const translators = new Map();
let speechPipeline = null;

function post(message) {
  self.postMessage(message);
}

function progressReporter(id, model) {
  return (event) => {
    if (event.status === 'progress' || event.status === 'done' || event.status === 'initiate') {
      post({ id, type: 'progress', model, file: event.file, loaded: event.loaded ?? 0, total: event.total ?? 0, status: event.status });
    }
  };
}

async function getTranslator(modelId, id) {
  if (translators.has(modelId)) {
    const existing = translators.get(modelId);
    translators.delete(modelId);
    translators.set(modelId, existing);
    return existing;
  }

  const loading = pipeline('translation', modelId, {
    dtype: 'q8',
    device: 'wasm',
    progress_callback: progressReporter(id, modelId),
  });
  translators.set(modelId, loading);
  loading.catch(() => translators.delete(modelId));

  // Free memory held by the least recently used model.
  while (translators.size > MAX_TRANSLATORS) {
    const [oldestId, oldest] = translators.entries().next().value;
    translators.delete(oldestId);
    oldest.then((p) => p.dispose()).catch(() => {});
  }
  return loading;
}

async function getSpeech(id) {
  if (!speechPipeline) {
    speechPipeline = pipeline('automatic-speech-recognition', self.speechModel, {
      dtype: 'q8',
      device: 'wasm',
      progress_callback: progressReporter(id, self.speechModel),
    });
    speechPipeline.catch(() => {
      speechPipeline = null;
    });
  }
  return speechPipeline;
}

/** Splits text into lines and sentences so long input stays within the model's limits. */
function segment(text, sourceLang) {
  const lines = text.split(/\n/);
  let segmenter = null;
  try {
    segmenter = new Intl.Segmenter(sourceLang, { granularity: 'sentence' });
  } catch {
    segmenter = null;
  }
  return lines.map((line) => {
    if (!line.trim()) return [];
    if (!segmenter) return [line.trim()];
    return Array.from(segmenter.segment(line), (s) => s.segment.trim()).filter(Boolean);
  });
}

/** Cleans up small punctuation quirks of the models. */
function tidy(source, output) {
  let text = output.trim()
    .replace(/([?!？！])\s*[.。]$/u, '$1') // "?." → "?"
    .replace(/\.{2,}$/u, '.'); // "Hola.." → "Hola."
  // Don't add a final period the source didn't have ("Hello" → "Hola", not "Hola.").
  if (!/[.!?。！？…:;]$/u.test(source.trim())) text = text.replace(/[.。]$/u, '');
  return text;
}

async function translateWith(modelId, sentences, id) {
  const translator = await getTranslator(modelId, id);
  const out = [];
  const BATCH = 8;
  for (let i = 0; i < sentences.length; i += BATCH) {
    const batch = sentences.slice(i, i + BATCH);
    const results = await translator(batch, { max_new_tokens: 400 });
    results.forEach((r, j) => out.push(tidy(batch[j], r.translation_text)));
  }
  return out;
}

async function translate({ id, text, pairs, sourceLang, targetNoSpaces }) {
  const lines = segment(text, sourceLang);
  let sentences = lines.flat();
  for (const pair of pairs) {
    sentences = await translateWith(pair.model, sentences, id);
  }
  // Put sentences back on their original lines.
  let cursor = 0;
  const joiner = targetNoSpaces ? '' : ' ';
  return lines
    .map((line) => {
      const part = sentences.slice(cursor, cursor + line.length);
      cursor += line.length;
      return part.join(joiner);
    })
    .join('\n');
}

async function transcribe({ id, audio, language }) {
  const asr = await getSpeech(id);
  const options = { task: 'transcribe', chunk_length_s: 30, stride_length_s: 5 };
  if (language) options.language = language;
  const result = await asr(audio, options);
  const text = (Array.isArray(result) ? result[0].text : result.text).trim();
  // Whisper labels non-speech like "(dog barking)" or "[Music]"; that isn't something to translate.
  return text.replace(/\[[^\]]*\]|\([^)]*\)|♪+/g, ' ').replace(/\s+/g, ' ').trim();
}

function fileUrls(modelId, kind) {
  const base = `${HUB}/${modelId}/resolve/main/`;
  const onnx = ['onnx/encoder_model_quantized.onnx', 'onnx/decoder_model_merged_quantized.onnx'];
  const common = ['config.json', 'tokenizer.json', 'tokenizer_config.json', 'generation_config.json'];
  const extra = kind === 'speech' ? ['preprocessor_config.json'] : [];
  return [...common, ...extra, ...onnx].map((f) => base + f);
}

async function isCached(modelId, kind) {
  const cache = await caches.open(CACHE_NAME);
  for (const url of fileUrls(modelId, kind)) {
    if (!(await cache.match(url))) return false;
  }
  return true;
}

async function download({ id, models, kind }) {
  for (const modelId of models) {
    if (await isCached(modelId, kind)) continue;
    if (kind === 'speech') {
      await getSpeech(id);
    } else {
      // Loading the pipeline downloads and caches every file it needs.
      const p = await pipeline('translation', modelId, {
        dtype: 'q8',
        device: 'wasm',
        progress_callback: progressReporter(id, modelId),
      });
      if (!translators.has(modelId)) await p.dispose();
    }
  }
  return true;
}

async function remove({ models }) {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  for (const modelId of models) {
    if (translators.has(modelId)) {
      translators.get(modelId).then((p) => p.dispose()).catch(() => {});
      translators.delete(modelId);
    }
    if (modelId === self.speechModel && speechPipeline) {
      speechPipeline.then((p) => p.dispose()).catch(() => {});
      speechPipeline = null;
    }
    for (const request of keys) {
      if (request.url.startsWith(`${HUB}/${modelId}/`)) await cache.delete(request);
    }
  }
  return true;
}

async function status({ models }) {
  const result = {};
  for (const { model, kind } of models) {
    result[model] = await isCached(model, kind);
  }
  return result;
}

self.onmessage = async ({ data }) => {
  const { id, type } = data;
  try {
    let result;
    switch (type) {
      case 'init':
        self.speechModel = data.speechModel;
        result = true;
        break;
      case 'translate':
        result = await translate(data);
        break;
      case 'transcribe':
        result = await transcribe(data);
        break;
      case 'download':
        result = await download(data);
        break;
      case 'remove':
        result = await remove(data);
        break;
      case 'status':
        result = await status(data);
        break;
      default:
        throw new Error(`Unknown request: ${type}`);
    }
    post({ id, type: 'result', result });
  } catch (error) {
    post({ id, type: 'error', message: error?.message ?? String(error) });
  }
};

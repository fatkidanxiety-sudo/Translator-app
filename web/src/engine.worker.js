// Voice input: runs OpenAI Whisper (base) on the device in a background thread.
// The model is downloaded once from Hugging Face and kept in Cache Storage.

import { env, pipeline } from '@huggingface/transformers';

env.allowLocalModels = false;
env.useBrowserCache = true;
// The ONNX runtime's WebAssembly files ship with the app (see build.mjs).
env.backends.onnx.wasm.wasmPaths = new URL('./vendor/ort/', self.location.href).href;
env.backends.onnx.wasm.proxy = false;
// Use several cores when the page is cross-origin isolated (see sw.js).
if (self.crossOriginIsolated) env.backends.onnx.wasm.numThreads = Math.min(4, navigator.hardwareConcurrency || 2);

const CACHE_NAME = 'transformers-cache';
const HUB = 'https://huggingface.co';
let speechModel = null;
let speechPipeline = null;

const post = (message) => self.postMessage(message);

function progressReporter(id) {
  return (event) => {
    if (event.status === 'progress' || event.status === 'done') {
      post({ id, type: 'progress', file: event.file, loaded: event.loaded ?? 0, total: event.total ?? 0 });
    }
  };
}

function getSpeech(id) {
  if (!speechPipeline) {
    speechPipeline = pipeline('automatic-speech-recognition', speechModel, { dtype: 'q8', device: 'wasm', progress_callback: progressReporter(id) });
    speechPipeline.catch(() => (speechPipeline = null));
  }
  return speechPipeline;
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

const FILES = ['config.json', 'tokenizer.json', 'tokenizer_config.json', 'generation_config.json', 'preprocessor_config.json', 'onnx/encoder_model_quantized.onnx', 'onnx/decoder_model_merged_quantized.onnx'];

async function isCached() {
  const cache = await caches.open(CACHE_NAME);
  for (const f of FILES) if (!(await cache.match(`${HUB}/${speechModel}/resolve/main/${f}`))) return false;
  return true;
}

async function remove() {
  if (speechPipeline) {
    speechPipeline.then((p) => p.dispose()).catch(() => {});
    speechPipeline = null;
  }
  const cache = await caches.open(CACHE_NAME);
  for (const request of await cache.keys()) if (request.url.startsWith(`${HUB}/${speechModel}/`)) await cache.delete(request);
  return true;
}

self.onmessage = async ({ data }) => {
  const { id, type } = data;
  try {
    let result;
    if (type === 'init') {
      speechModel = data.speechModel;
      result = true;
    } else if (type === 'transcribe') result = await transcribe(data);
    else if (type === 'download') result = Boolean(await getSpeech(id));
    else if (type === 'remove') result = await remove();
    else if (type === 'status') result = await isCached();
    else throw new Error(`Unknown request: ${type}`);
    post({ id, type: 'result', result });
  } catch (error) {
    post({ id, type: 'error', message: error?.message ?? String(error) });
  }
};

// Microphone recording (for on-device Whisper speech recognition) and text-to-speech.

import { lang } from './languages.js';

const TARGET_RATE = 16000;

/** Records from the microphone until `stop()` is called. */
export class Recorder {
  constructor() {
    this.stream = null;
    this.recorder = null;
    this.chunks = [];
  }

  get isRecording() {
    return this.recorder?.state === 'recording';
  }

  async start() {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('This browser can’t use the microphone.');
    }
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
      });
    } catch {
      throw new Error('Microphone access was blocked. Allow it in Settings › Safari › Microphone (or for this site), then try again.');
    }
    const mimeType = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm'].find((t) => window.MediaRecorder?.isTypeSupported?.(t));
    this.recorder = new MediaRecorder(this.stream, mimeType ? { mimeType } : undefined);
    this.chunks = [];
    this.recorder.ondataavailable = (e) => e.data.size && this.chunks.push(e.data);
    this.recorder.start();
  }

  /** Stops and returns mono 16 kHz Float32Array audio (or null if nothing was recorded). */
  async stop() {
    if (!this.recorder) return null;
    const recorder = this.recorder;
    const stopped = new Promise((resolve) => (recorder.onstop = resolve));
    if (recorder.state !== 'inactive') recorder.stop();
    await stopped;
    this.stream?.getTracks().forEach((t) => t.stop());
    this.recorder = null;
    this.stream = null;

    const blob = new Blob(this.chunks, { type: recorder.mimeType });
    this.chunks = [];
    if (!blob.size) return null;
    return decodeTo16kMono(await blob.arrayBuffer());
  }

  cancel() {
    try {
      this.recorder?.stop();
    } catch {
      /* already stopped */
    }
    this.stream?.getTracks().forEach((t) => t.stop());
    this.recorder = null;
    this.stream = null;
    this.chunks = [];
  }
}

async function decodeTo16kMono(arrayBuffer) {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  const ctx = new Ctx();
  try {
    const decoded = await ctx.decodeAudioData(arrayBuffer);
    const length = Math.max(1, Math.ceil(decoded.duration * TARGET_RATE));
    const offline = new OfflineAudioContext(1, length, TARGET_RATE);
    const source = offline.createBufferSource();
    source.buffer = decoded;
    source.connect(offline.destination);
    source.start();
    const rendered = await offline.startRendering();
    return rendered.getChannelData(0).slice();
  } finally {
    ctx.close?.();
  }
}

// ---- Text to speech (uses the voices built into iOS, works offline) ----

let voices = [];
function loadVoices() {
  voices = window.speechSynthesis?.getVoices() ?? [];
}
if ('speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
}

function voiceFor(code) {
  if (!voices.length) loadVoices();
  const info = lang(code);
  const exact = voices.filter((v) => v.lang.replace('_', '-') === info.bcp47);
  const prefix = voices.filter((v) => v.lang.toLowerCase().startsWith(code));
  const pool = exact.length ? exact : prefix;
  return pool.find((v) => v.localService) ?? pool[0] ?? null;
}

export function canSpeak(code) {
  return 'speechSynthesis' in window && Boolean(voiceFor(code) || voices.length === 0);
}

export function speak(text, code, rate = 1) {
  if (!('speechSynthesis' in window) || !text.trim()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = voiceFor(code);
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang ?? lang(code).bcp47;
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  window.speechSynthesis?.cancel();
}

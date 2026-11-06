// Voice input and text-to-speech.
//
// Voice input prefers the iPhone's built-in speech recognition (the same engine as keyboard dictation):
// it's instant, shows words while you speak and uses almost no memory. If it isn't available
// (some browsers, or offline for a language without on-device dictation) the app records audio and
// runs a small Whisper model on the phone instead.

import { lang } from './languages.js';

const TARGET_RATE = 16000;

/**
 * Records from the microphone until `stop()` is called.
 * The microphone stays open between recordings for a few minutes, so iOS asks for permission
 * once per session instead of on every tap.
 */
export class Recorder {
  constructor() {
    this.stream = null;
    this.recorder = null;
    this.chunks = [];
    this.releaseTimer = null;
  }

  get isRecording() {
    return this.recorder?.state === 'recording';
  }

  async getStream() {
    clearTimeout(this.releaseTimer);
    if (this.stream && this.stream.getTracks().some((t) => t.readyState === 'live')) return this.stream;
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('This browser can’t use the microphone.');
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } });
    } catch {
      throw new Error('Microphone access was blocked. Tap the mic again and choose Allow.');
    }
    return this.stream;
  }

  async start() {
    const stream = await this.getStream();
    const mimeType = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm'].find((t) => window.MediaRecorder?.isTypeSupported?.(t));
    this.recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
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
    this.recorder = null;
    this.scheduleRelease();
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
    this.recorder = null;
    this.chunks = [];
    this.scheduleRelease();
  }

  /** Closes the microphone after a few idle minutes (turns off the orange indicator). */
  scheduleRelease(ms = 180000) {
    clearTimeout(this.releaseTimer);
    this.releaseTimer = setTimeout(() => {
      this.stream?.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }, ms);
  }
}

// ---- Built-in speech recognition (Web Speech API) ----

const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;

/** Errors that mean "built-in recognition can't do this right now; use the on-phone model". */
const FALLBACK_ERRORS = new Set(['network', 'service-not-allowed', 'language-not-supported', 'bad-grammar']);

export class LiveRecognizer {
  static get available() {
    return Boolean(SpeechRecognitionImpl);
  }

  /** `onText(text)` is called with the words heard so far, while speaking. */
  constructor(onText) {
    this.onText = onText;
    this.rec = null;
    this.finalText = '';
    this.interim = '';
    this.error = null;
    this.ended = null;
  }

  /** Starts listening. Resolves once listening, rejects quickly if it can't start. */
  start(bcp47) {
    this.finalText = '';
    this.interim = '';
    this.error = null;
    const rec = new SpeechRecognitionImpl();
    this.rec = rec;
    rec.lang = bcp47;
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    this.ended = new Promise((resolve) => (rec.onend = resolve));
    rec.onresult = (event) => {
      let finalText = '';
      let interim = '';
      for (let i = 0; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      this.finalText = finalText;
      this.interim = interim;
      this.onText?.(this.text);
    };
    return new Promise((resolve, reject) => {
      let settled = false;
      // Never hang: if listening hasn't started within 4 seconds, use the on-phone model instead.
      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        try {
          rec.abort();
        } catch {
          /* ignore */
        }
        reject(Object.assign(new Error('timeout'), { code: 'timeout', fallback: true }));
      }, 4000);
      rec.onstart = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve();
      };
      rec.onerror = (event) => {
        this.error = event.error;
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          reject(Object.assign(new Error(event.error), { code: event.error, fallback: FALLBACK_ERRORS.has(event.error) }));
        }
      };
      try {
        rec.start();
      } catch (e) {
        settled = true;
        reject(Object.assign(new Error(e.message), { code: 'start-failed', fallback: true }));
      }
    });
  }

  get text() {
    return `${this.finalText} ${this.interim}`.replace(/\s+/g, ' ').trim();
  }

  /** Stops and returns everything heard. Throws with `.fallback = true` if the on-phone model should be used. */
  async stop() {
    if (!this.rec) return '';
    try {
      this.rec.stop();
    } catch {
      /* already stopped */
    }
    await Promise.race([this.ended, new Promise((r) => setTimeout(r, 2500))]);
    this.rec = null;
    if (this.error && FALLBACK_ERRORS.has(this.error) && !this.text) {
      throw Object.assign(new Error(this.error), { code: this.error, fallback: true });
    }
    if (this.error === 'not-allowed') throw new Error('Microphone or speech recognition was blocked. Tap the mic again and choose Allow.');
    return this.text;
  }

  cancel() {
    try {
      this.rec?.abort();
    } catch {
      /* ignore */
    }
    this.rec = null;
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

// ---- Continuous listening (Listen mode) -----------------------------------------------

/**
 * Listens continuously and reports each finished phrase. Uses the iPhone's built-in speech
 * recognition when possible (restarting it whenever iOS stops it); otherwise records short chunks
 * and passes them to `transcribeChunk` (the on-phone Whisper model). Audio is never stored.
 */
export class ContinuousListener {
  /**
   * @param {{ onPhrase(text), onPartial(text), onState(state), transcribeChunk(Float32Array) }} handlers
   */
  constructor(handlers) {
    this.h = handlers;
    this.active = false;
    this.rec = null;
    this.mode = null;
    this.stream = null;
    this.chunkTimer = null;
    this.restarts = 0;
  }

  async start(bcp47, { preferChunks = false } = {}) {
    this.active = true;
    this.bcp47 = bcp47;
    this.restarts = 0;
    if (!preferChunks && SpeechRecognitionImpl) {
      try {
        await this.startLive();
        this.mode = 'live';
        return 'live';
      } catch (error) {
        if (!error.fallback) throw error;
      }
    }
    await this.startChunks();
    this.mode = 'chunks';
    return 'chunks';
  }

  stop() {
    this.active = false;
    try {
      this.rec?.abort();
    } catch {
      /* ignore */
    }
    this.rec = null;
    clearTimeout(this.chunkTimer);
    try {
      if (this.recorder?.state === 'recording') this.recorder.stop();
    } catch {
      /* ignore */
    }
    this.recorder = null;
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.h.onState?.('stopped');
  }

  // Built-in recognition: continuous, restarted whenever iOS ends it (silence, time limits).
  startLive() {
    return new Promise((resolve, reject) => {
      const rec = new SpeechRecognitionImpl();
      this.rec = rec;
      rec.lang = this.bcp47;
      rec.continuous = true;
      rec.interimResults = true;
      let started = false;
      const emitted = new Set();
      const timer = setTimeout(() => {
        if (started) return;
        try {
          rec.abort();
        } catch {
          /* ignore */
        }
        reject(Object.assign(new Error('timeout'), { fallback: true }));
      }, 4000);
      rec.onstart = () => {
        started = true;
        clearTimeout(timer);
        this.h.onState?.('listening');
        resolve();
      };
      rec.onresult = (event) => {
        let partial = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const r = event.results[i];
          if (r.isFinal) {
            if (!emitted.has(i) && r[0].transcript.trim()) {
              emitted.add(i);
              this.h.onPhrase?.(r[0].transcript.trim());
            }
          } else partial += r[0].transcript;
        }
        this.h.onPartial?.(partial.trim());
      };
      rec.onerror = (event) => {
        if (!started) {
          clearTimeout(timer);
          reject(Object.assign(new Error(event.error), { fallback: FALLBACK_ERRORS.has(event.error) || event.error === 'audio-capture' }));
        } else if (FALLBACK_ERRORS.has(event.error) && this.active) {
          // Built-in recognition can't continue (e.g. went offline): switch to the on-phone model.
          this.rec = null;
          this.startChunks().then(() => (this.mode = 'chunks'), () => this.stop());
        }
      };
      rec.onend = () => {
        if (!this.active || this.rec !== rec) return;
        // iOS ends recognition after silence or about a minute: start again right away.
        if (++this.restarts > 500) return this.stop();
        setTimeout(() => {
          if (!this.active || this.rec !== rec) return;
          this.startLive().catch(() => this.startChunks().then(() => (this.mode = 'chunks'), () => this.stop()));
        }, 150);
      };
      try {
        rec.start();
      } catch (e) {
        clearTimeout(timer);
        reject(Object.assign(new Error(e.message), { fallback: true }));
      }
    });
  }

  // On-phone model: record ~6-second chunks back to back and transcribe each one with speech in it.
  async startChunks() {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('This browser can’t use the microphone.');
    if (!this.stream) {
      // Turn off voice-call processing so quieter, more distant voices are kept.
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: false, noiseSuppression: false, autoGainControl: true } });
    }
    this.h.onState?.('listening');
    const mimeType = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm'].find((t) => window.MediaRecorder?.isTypeSupported?.(t));
    const next = () => {
      if (!this.active) return;
      const recorder = new MediaRecorder(this.stream, mimeType ? { mimeType } : undefined);
      this.recorder = recorder;
      const chunks = [];
      recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      recorder.onstop = async () => {
        next(); // keep listening while this chunk is being understood
        const blob = new Blob(chunks, { type: recorder.mimeType });
        if (!blob.size) return;
        try {
          const audio = await decodeTo16kMono(await blob.arrayBuffer());
          // Skip near-silent chunks (saves battery and avoids made-up words).
          let energy = 0;
          for (let i = 0; i < audio.length; i += 4) energy += audio[i] * audio[i];
          if (Math.sqrt(energy / (audio.length / 4)) < 0.004) return;
          this.h.onPartial?.('…');
          const text = await this.h.transcribeChunk(audio);
          this.h.onPartial?.('');
          if (text && this.active) this.h.onPhrase?.(text);
        } catch {
          /* skip a chunk that couldn't be read */
        }
      };
      recorder.start();
      this.chunkTimer = setTimeout(() => recorder.state === 'recording' && recorder.stop(), 6000);
    };
    next();
  }
}

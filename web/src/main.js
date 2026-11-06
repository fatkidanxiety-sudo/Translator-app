import { LANGUAGES, lang, PACK_CODES, packsFor, SPEECH_MODEL, SPEECH_MODEL_MB } from './languages.js';
import * as models from './models.js';
import { translate, translateMany, warmUp } from './translate.js';
import * as voice from './engine.js';
import { detectLanguage } from './detect.js';
import { Recorder, LiveRecognizer, speak, stopSpeaking } from './speech.js';
import { tesseractLangsFor, readText, prepareOcr, releaseOcr } from './ocr.js';
import { cleanForOcr } from './ocr-prep.js';
import { readPhoto, releaseCameraReader, warmCameraReader, ocrScriptFor } from './camera-ocr.js';
import { settings, saveSettings, getHistory, addHistory, updateHistory, deleteHistory, clearHistory, getPhraseCache, setPhraseCache } from './store.js';
import { PHRASE_CATEGORIES } from './phrases.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const nameOf = (code) => (code === 'auto' ? 'Detect Language' : lang(code)?.name ?? code);
const SORTED = [...LANGUAGES].sort((a, b) => a.name.localeCompare(b.name));
const OCR_MB = 70;

const ICON = {
  speaker: '<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
  star: '<svg viewBox="0 0 24 24"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2Z"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15"/></svg>',
  mic: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
  stop: '<svg viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor"/></svg>',
  wave: '<svg viewBox="0 0 24 24"><path d="M3 12h2M7 8v8M11 5v14M15 8v8M19 11v2"/></svg>',
  chevron: '<svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>',
};

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

let toastTimer;
function toast(message, ms = 2600) {
  const el = $('toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), ms);
}

function setBar(container, fraction) {
  const bar = container?.querySelector('.progress');
  if (!bar) return;
  bar.hidden = fraction === null;
  if (fraction !== null) bar.firstElementChild.style.width = `${Math.round(Math.min(1, Math.max(0, fraction)) * 100)}%`;
}

const fmtBytes = (b) => (b >= 1e9 ? `${(b / 1e9).toFixed(1)} GB` : `${Math.max(1, Math.round(b / 1e6))} MB`);
function fmtTime(seconds) {
  if (!isFinite(seconds) || seconds <= 0) return '';
  if (seconds < 60) return 'less than a minute left';
  return `about ${Math.round(seconds / 60)} min left`;
}
const listNames = (codes) => codes.map(nameOf).join(' and ');

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast('Copied');
  } catch {
    toast('Couldn’t copy');
  }
}

function friendlyError(error) {
  const message = error?.message ?? String(error);
  if (message === 'offline-not-downloaded' || (/fetch|network|load/i.test(message) && !navigator.onLine)) {
    return 'This language isn’t downloaded yet. Connect to the internet once to download it.';
  }
  return message;
}

const pairReady = (src, tgt) => packsFor(src, tgt).every(models.isPackInstalled);
const missingPacks = (codes) => [...new Set(codes)].filter((c) => c && c !== 'en' && !models.isPackInstalled(c));

// ---------------------------------------------------------------------------
// Downloads (one place for every screen)
// ---------------------------------------------------------------------------

let speechInstalled = localStorage.getItem('speechModel') === SPEECH_MODEL;
let ocrReady = new Set(JSON.parse(localStorage.getItem('ocrReady') || '[]'));
let bigJob = null; // { phase: 'languages' | 'voice' | 'camera', fraction }

/** Downloads language packs for a screen, with progress shown in the strip (and optional callback). */
async function ensurePacks(codes, onProgress) {
  const missing = missingPacks(codes);
  if (!missing.length) return true;
  if (!navigator.onLine) {
    toast(`${listNames(missing)} isn’t downloaded yet. Connect to the internet once to download it.`, 4000);
    return false;
  }
  try {
    await models.downloadPacks(missing, onProgress);
    return true;
  } catch (error) {
    toast(friendlyError(error), 4000);
    return false;
  }
}

/** "Download for Offline": every language, voice input and camera text recognition. */
async function downloadEverything() {
  if (bigJob) return;
  if (!navigator.onLine) {
    toast('Connect to the internet (Wi-Fi is best) to download.');
    return;
  }
  bigJob = { phase: 'languages', fraction: 0 };
  renderDownloads();
  try {
    await models.downloadPacks(PACK_CODES);
    if (!speechInstalled) {
      bigJob = { phase: 'voice', fraction: 0 };
      renderDownloads();
      await voice.downloadSpeech((f) => {
        bigJob.fraction = f;
        renderDownloads();
      });
      markSpeechInstalled();
    }
    if (!models.isOcrReady()) {
      bigJob = { phase: 'camera', fraction: 0 };
      renderDownloads();
      await models.downloadOcr(undefined, (f) => {
        bigJob.fraction = f * 0.9;
        renderDownloads();
      });
    }
    if (!ocrReady.has('he')) {
      await prepareOcr(['he']); // Hebrew uses the older reader
      ocrReady.add('he');
      localStorage.setItem('ocrReady', JSON.stringify([...ocrReady]));
    }
    // Start the camera reader once while online, so its engine files are saved for offline use.
    await warmCameraReader('latin');
    releaseCameraReader();
    toast('All set — Parlivo now works fully offline ✓', 3500);
  } catch (error) {
    toast(friendlyError(error), 4500);
  } finally {
    bigJob = null;
    renderDownloads();
    renderStorage();
  }
}

function markSpeechInstalled() {
  speechInstalled = true;
  localStorage.setItem('speechModel', SPEECH_MODEL);
}

function totalEverythingBytes(remainingOnly) {
  let bytes = models.packBytes(PACK_CODES, remainingOnly);
  if (!remainingOnly || !speechInstalled) bytes += SPEECH_MODEL_MB * 1e6;
  bytes += models.ocrBytes(undefined, remainingOnly);
  return bytes;
}

const everythingReady = () => PACK_CODES.every(models.isPackInstalled) && speechInstalled && models.isOcrReady() && ocrReady.has('he');

/** Updates every piece of download UI: top strip, hero card, settings, screen cards. */
function renderDownloads() {
  const { downloading } = models.state();
  const strip = $('dl-strip');
  let text = null;
  let fraction = 0;
  if (downloading) {
    const what =
      downloading.codes.length === 1 ? nameOf(downloading.codes[0]) : downloading.codes.length > 1 ? `${downloading.codes.length} languages` : bigJob?.phase === 'camera' ? 'camera text reading' : 'files';
    const left = downloading.bytesPerSecond ? (downloading.total - downloading.done) / downloading.bytesPerSecond : NaN;
    text = `Downloading ${what} · ${Math.round(downloading.fraction * 100)}%${downloading.bytesPerSecond ? ` · ${fmtTime(left)}` : ''}`;
    fraction = downloading.fraction;
  } else if (bigJob?.phase === 'voice') {
    text = `Downloading voice input · ${Math.round(bigJob.fraction * 100)}%`;
    fraction = bigJob.fraction;
  } else if (bigJob?.phase === 'camera') {
    text = `Preparing camera text reading · ${Math.round(bigJob.fraction * 100)}%`;
    fraction = bigJob.fraction;
  }
  strip.hidden = !text;
  if (text) {
    $('dl-strip-text').textContent = text;
    $('dl-strip-fill').style.width = `${Math.round(fraction * 100)}%`;
  }

  // First-run hero on the Translate screen
  const nothingYet = models.installedPacks().length === 0;
  $('offline-hero').hidden = !(nothingYet && !text && !localStorage.getItem('heroDismissed'));
  $('hero-text').textContent = `Download every language (${PACK_CODES.length + 1}), voice input and camera reading once — about ${fmtBytes(totalEverythingBytes(false))}. Wi-Fi recommended.`;

  if ($('settings').open) {
    renderDlCard(text, fraction);
    renderPacks();
  }
  updateTranslateUI();
  updatePhraseNeed();
}

let lastInstalledCount = -1;
models.onChange((st) => {
  renderDownloads();
  if (!st.downloading && st.installed.size !== lastInstalledCount) {
    lastInstalledCount = st.installed.size;
    warmUsualPairs();
  }
});
$('dl-strip').addEventListener('click', () => openSettings());
$('hero-download').addEventListener('click', () => downloadEverything());
$('hero-choose').addEventListener('click', () => openSettings());

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

const TITLES = { translate: 'Translate', talk: 'Conversation', camera: 'Camera', phrases: 'Phrasebook', history: 'History' };
let currentTab = 'translate';

function showTab(name) {
  if (name === currentTab) return;
  if (currentTab === 'translate') commitTranslation();
  if (currentTab === 'camera') stopCamera();
  currentTab = name;
  document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t.id === `tab-${name}`));
  document.querySelectorAll('#tabbar button').forEach((b) => b.classList.toggle('active', b.dataset.tab === name));
  $('page-title').textContent = TITLES[name];
  try {
    localStorage.setItem('lastTab', JSON.stringify({ name, at: Date.now() }));
  } catch {
    /* ignore */
  }
  if (name === 'history') renderHistory();
  if (name === 'camera') enterCamera();
  if (name === 'talk' || name === 'translate') warmUsualPairs();
  window.scrollTo({ top: 0 });
}
$('tabbar').addEventListener('click', (e) => {
  const button = e.target.closest('button[data-tab]');
  if (button) showTab(button.dataset.tab);
});

// ---------------------------------------------------------------------------
// Language picker sheet
// ---------------------------------------------------------------------------

let pickerResolve = null;
let pickerOptions = null;

function pickLanguage(options) {
  pickerOptions = options;
  $('picker-title').textContent = options.title;
  $('picker-search').value = '';
  renderPicker();
  $('picker').showModal();
  return new Promise((resolve) => (pickerResolve = resolve));
}

function renderPicker() {
  const { current, allowAuto } = pickerOptions;
  const query = $('picker-search').value.trim().toLowerCase();
  const rows = [];
  if (allowAuto && !query) {
    rows.push(`<button class="list-row" data-code="auto"><span class="main">✨ Detect Language<div class="sub">Identified on your device</div></span>${current === 'auto' ? '<span class="check">✓</span>' : ''}</button>`);
  }
  for (const l of SORTED) {
    if (query && !l.name.toLowerCase().includes(query) && !l.native.toLowerCase().includes(query)) continue;
    const ready = models.isPackInstalled(l.code);
    rows.push(`<button class="list-row" data-code="${l.code}">
      <span class="main">${esc(l.name)}<div class="sub">${esc(l.native)}</div></span>
      ${ready ? '<span class="pill ok">Offline</span>' : ''}
      ${current === l.code ? '<span class="check">✓</span>' : ''}
    </button>`);
  }
  $('picker-list').innerHTML = rows.join('') || '<p class="hint" style="padding:16px">No matches</p>';
}

function closePicker(value) {
  if ($('picker').open) $('picker').close();
  pickerResolve?.(value);
  pickerResolve = null;
}
$('picker-search').addEventListener('input', renderPicker);
$('picker-close').addEventListener('click', () => closePicker(null));
$('picker').addEventListener('cancel', () => closePicker(null));
$('picker-list').addEventListener('click', (e) => {
  const row = e.target.closest('[data-code]');
  if (row) closePicker(row.dataset.code);
});

// ---------------------------------------------------------------------------
// Translate tab — translates as you type
// ---------------------------------------------------------------------------

const input = $('t-input');
let detected = null;
let lastResult = null; // { source, translation, from, to, entryId, saved }
let liveSeq = 0;
let liveTimer = null;
let saveTimer = null;
let pendingTimer = null;

function currentPair() {
  const text = input.value.trim();
  let src = settings.source;
  if (src === 'auto') src = detected;
  if (!src) return null;
  let tgt = settings.target;
  // Typed in the target language with "Detect Language" on: translate the other way.
  if (settings.source === 'auto' && src === tgt) tgt = tgt === 'en' ? (settings.lastOther ?? 'es') : 'en';
  return text ? { src, tgt } : { src, tgt };
}

function renderTranslateLangs() {
  $('t-source').textContent = settings.source === 'auto' && detected ? `${nameOf(detected)} ✨` : nameOf(settings.source);
  $('t-target').textContent = nameOf(settings.target);
  $('t-swap').disabled = settings.source === 'auto' && !detected;
  updateTranslateUI();
}

function updateTranslateUI() {
  const hasText = Boolean(input.value);
  $('t-clear').hidden = !hasText;
  $('t-detected').textContent = settings.source === 'auto' && hasText && !detected ? 'Can’t tell the language yet' : '';

  const pair = currentPair();
  const badge = $('t-badge');
  const need = $('t-need');
  badge.className = 'badge';
  badge.textContent = '';
  need.hidden = true;
  if (!pair) return;
  const missing = missingPacks([pair.src, pair.tgt]);
  const { downloading } = models.state();
  if (!missing.length) {
    badge.textContent = '✓ Works offline';
    badge.classList.add('ok');
    return;
  }
  // Show what's needed, with live progress if it's already downloading.
  need.hidden = false;
  const busy = downloading && missing.every((c) => downloading.codes.includes(c) || bigJob);
  $('t-need-text').textContent = busy
    ? `Downloading ${listNames(missing)} for offline use…`
    : `${listNames(missing)} isn’t on this phone yet (${fmtBytes(models.packBytes(missing, true))}).`;
  $('t-need-btn').hidden = Boolean(busy);
  setBar(need, busy ? downloading.fraction : null);
}

$('t-need-btn').addEventListener('click', async () => {
  const pair = currentPair();
  if (!pair) return;
  if (await ensurePacks([pair.src, pair.tgt])) liveTranslate();
});

function scheduleLive(delay = 180) {
  clearTimeout(liveTimer);
  liveTimer = setTimeout(() => liveTranslate(), delay);
}

input.addEventListener('input', () => {
  if (settings.source === 'auto') detected = detectLanguage(input.value);
  renderTranslateLangs();
  if (lastResult) $('t-output').classList.add('pending');
  scheduleLive();
});
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    input.blur();
  }
});
input.addEventListener('blur', () => commitTranslation({ speakIt: settings.autoSpeak }));

async function liveTranslate({ origin = 'text', commit = false } = {}) {
  const seq = ++liveSeq;
  const text = input.value.trim();
  clearTimeout(pendingTimer);
  if (!text) {
    lastResult = null;
    $('t-output-card').hidden = true;
    updateTranslateUI();
    return;
  }
  if (settings.source === 'auto') detected = detectLanguage(text);
  renderTranslateLangs();
  const pair = currentPair();
  if (!pair) return;
  const { src, tgt } = pair;
  if (tgt !== 'en') saveSettings({ lastOther: tgt });

  const missing = missingPacks([src, tgt]);
  if (missing.length) {
    // Start the download right away when online; the card shows progress.
    if (navigator.onLine && !models.state().downloading) {
      ensurePacks(missing).then((ok) => ok && seq === liveSeq && liveTranslate({ origin, commit }));
    }
    return;
  }

  pendingTimer = setTimeout(() => $('t-output').classList.add('pending'), 250);
  try {
    const translation = await translate(text, src, tgt);
    if (seq !== liveSeq) return; // a newer keystroke won
    clearTimeout(pendingTimer);
    lastResult = { source: text, translation, from: src, to: tgt, entryId: null, saved: false };
    showOutput();
    clearTimeout(saveTimer);
    if (commit) commitTranslation({ origin, speakIt: settings.autoSpeak || origin === 'voice' });
    else saveTimer = setTimeout(() => commitTranslation({ origin }), 2500);
  } catch (error) {
    if (seq === liveSeq) toast(friendlyError(error), 3500);
  }
}

/** Saves the current result to history (once) and optionally reads it aloud. */
function commitTranslation({ origin = 'text', speakIt = false } = {}) {
  clearTimeout(saveTimer);
  if (!lastResult || lastResult.source !== input.value.trim()) return;
  if (!lastResult.saved && settings.saveHistory) {
    const entry = addHistory({ source: lastResult.source, translation: lastResult.translation, from: lastResult.from, to: lastResult.to, origin });
    lastResult.entryId = entry.id;
  }
  lastResult.saved = true;
  if (speakIt) speak(lastResult.translation, lastResult.to, settings.speechRate);
  showOutput();
}

function showOutput() {
  if (!lastResult) return;
  $('t-output-card').hidden = false;
  $('t-out-lang').textContent = nameOf(lastResult.to);
  const out = $('t-output');
  out.textContent = lastResult.translation;
  out.dir = lang(lastResult.to)?.rtl ? 'rtl' : 'auto';
  out.classList.remove('pending');
  const fav = lastResult.entryId && getHistory().find((h) => h.id === lastResult.entryId)?.favorite;
  $('t-fav').classList.toggle('on', Boolean(fav));
}

$('t-source').addEventListener('click', async () => {
  const code = await pickLanguage({ title: 'Translate From', current: settings.source, allowAuto: true });
  if (!code) return;
  saveSettings({ source: code });
  detected = code === 'auto' ? detectLanguage(input.value) : null;
  renderTranslateLangs();
  liveTranslate();
});

$('t-target').addEventListener('click', async () => {
  const code = await pickLanguage({ title: 'Translate To', current: settings.target });
  if (!code) return;
  saveSettings({ target: code });
  renderTranslateLangs();
  liveTranslate();
  warmUsualPairs();
});

$('t-swap').addEventListener('click', () => {
  const pair = currentPair();
  if (!pair) return;
  const previous = lastResult?.translation;
  saveSettings({ source: pair.tgt, target: pair.src });
  detected = null;
  if (previous) input.value = previous;
  renderTranslateLangs();
  liveTranslate();
});

$('t-clear').addEventListener('click', () => {
  commitTranslation();
  input.value = '';
  lastResult = null;
  if (settings.source === 'auto') detected = null;
  $('t-output-card').hidden = true;
  renderTranslateLangs();
  input.focus();
});

$('t-paste').addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      input.value = text;
      if (settings.source === 'auto') detected = detectLanguage(text);
      renderTranslateLangs();
      liveTranslate({ commit: true });
    }
  } catch {
    toast('Long-press in the text box and choose Paste.');
  }
});

$('t-speak').addEventListener('click', () => lastResult && speak(lastResult.translation, lastResult.to, settings.speechRate));
$('t-copy').addEventListener('click', () => lastResult && copyText(lastResult.translation));
$('t-share').addEventListener('click', async () => {
  if (!lastResult) return;
  if (navigator.share) {
    try {
      await navigator.share({ text: lastResult.translation });
    } catch {
      /* cancelled */
    }
  } else copyText(lastResult.translation);
});
$('t-fav').addEventListener('click', () => {
  if (!lastResult) return;
  if (!lastResult.entryId) {
    const entry = addHistory({ source: lastResult.source, translation: lastResult.translation, from: lastResult.from, to: lastResult.to, origin: 'text', favorite: true });
    lastResult.entryId = entry.id;
    lastResult.saved = true;
  } else {
    const entry = getHistory().find((h) => h.id === lastResult.entryId);
    if (entry) updateHistory(entry.id, { favorite: !entry.favorite });
  }
  showOutput();
  toast(getHistory().find((h) => h.id === lastResult.entryId)?.favorite ? 'Added to Favorites' : 'Removed from Favorites');
});

// ---- Voice input ----
// Uses the iPhone's built-in speech recognition when it can (instant, words appear as you speak),
// otherwise records audio and runs the small on-phone Whisper model.

const recorder = new Recorder();
let live = null; // LiveRecognizer while listening with built-in recognition
let micOwner = null; // 'translate' | 'a' | 'b'
let micLang = null;
let liveUnavailable = false; // built-in recognition failed this session (e.g. offline): use the on-phone model
window.addEventListener('online', () => (liveUnavailable = false));

const deviceLang = () => {
  const code = (navigator.language || 'en').slice(0, 2);
  return lang(code) ? code : 'en';
};

async function ensureSpeechModel() {
  if (speechInstalled) return true;
  if (!navigator.onLine) {
    toast('Offline voice input needs a one-time download. Connect to the internet once, then it works offline.', 4000);
    return false;
  }
  toast('Downloading offline voice input (one time)…', 60000);
  try {
    await voice.downloadSpeech((f) => ($('toast').textContent = `Downloading offline voice input… ${Math.round(f * 100)}%`));
    markSpeechInstalled();
    toast('Voice input is ready');
    return true;
  } catch (error) {
    toast(friendlyError(error), 4000);
    return false;
  }
}

/** Starts listening. `languageCode` may be null (detect). `onWords(text)` gets words as they're heard. */
async function startRecording(owner, languageCode, onWords) {
  stopSpeaking();
  releaseOcr(); // the phone has limited memory: free the camera engines while listening
  releaseCameraReader();
  micLang = languageCode;
  if (LiveRecognizer.available && !liveUnavailable) {
    const rec = new LiveRecognizer((text) => micOwner === owner && onWords?.(text));
    try {
      await rec.start(lang(languageCode ?? deviceLang()).bcp47);
      live = rec;
      micOwner = owner;
      return true;
    } catch (error) {
      if (!error.fallback) {
        toast(error.code === 'not-allowed' ? 'Microphone access was blocked. Tap the mic again and choose Allow.' : 'Couldn’t start listening. Try again.', 4000);
        return false;
      }
      liveUnavailable = true; // fall through to the on-phone model
    }
  }
  if (!(await ensureSpeechModel())) return false;
  try {
    await recorder.start();
    micOwner = owner;
    return true;
  } catch (error) {
    toast(error.message, 4000);
    return false;
  }
}

/** Stops listening and returns the words heard ('' if nothing, null if the person should try again). */
async function finishRecording() {
  micOwner = null;
  if (live) {
    const rec = live;
    live = null;
    try {
      return await rec.stop();
    } catch (error) {
      if (!error.fallback) throw error;
      liveUnavailable = true;
      toast('Switched to offline voice recognition — please say that again.', 3500);
      return null;
    }
  }
  const audio = await recorder.stop();
  if (!audio || audio.length < 1600) return '';
  return voice.transcribe(audio, micLang);
}

/** Which language to listen for in the Translate tab. */
function translateListenLang() {
  if (settings.source !== 'auto') return settings.source;
  if (LiveRecognizer.available) {
    const guess = detected ?? settings.lastSpoken ?? deviceLang();
    return guess === settings.target ? (settings.target === 'en' ? settings.lastOther ?? 'es' : 'en') : guess;
  }
  return null; // Whisper detects the language itself
}

function setMicState(button, state) {
  button.classList.toggle('recording', state === 'recording');
  button.classList.toggle('working', state === 'working');
  button.disabled = state === 'working';
  button.innerHTML = state === 'recording' ? ICON.stop : state === 'working' ? '<div class="spinner"></div>' : ICON.mic;
}

$('t-mic').addEventListener('click', async () => {
  const button = $('t-mic');
  if (micOwner === 'translate') {
    setMicState(button, 'working');
    try {
      const text = await finishRecording();
      if (text) {
        input.value = text;
        if (settings.source === 'auto') {
          detected = detectLanguage(text) ?? micLang;
          if (detected) saveSettings({ lastSpoken: detected });
        }
        renderTranslateLangs();
        await liveTranslate({ origin: 'voice', commit: true });
      } else if (text === '') toast('Didn’t catch that. Try again.');
    } catch (error) {
      toast(friendlyError(error), 4000);
    } finally {
      setMicState(button, 'idle');
      input.placeholder = 'Type to translate';
    }
    return;
  }
  if (micOwner) return;
  const started = await startRecording('translate', translateListenLang(), (text) => {
    input.value = text;
    renderTranslateLangs();
  });
  if (started) {
    setMicState(button, 'recording');
    input.value = '';
    input.placeholder = 'Listening… tap ■ when done';
    lastResult = null;
    $('t-output-card').hidden = true;
    renderTranslateLangs();
  }
});

// ---------------------------------------------------------------------------
// Conversation tab
// ---------------------------------------------------------------------------

const messages = [];
let facing = false;
let convBusy = false;
let convStage = 'Understanding speech…';
const sideLang = (side) => (side === 'a' ? settings.convA : settings.convB);

function renderTalkSides() {
  document.querySelectorAll('#tab-talk .talk-side').forEach((el) => {
    const side = el.dataset.side.startsWith('b') ? 'b' : 'a';
    el.innerHTML = `
      <button class="lang-btn" data-pick="${side}">${esc(nameOf(sideLang(side)))}</button>
      <button class="mic-btn big side-${side}" data-mic="${side}" aria-label="Speak ${esc(nameOf(sideLang(side)))}">${ICON.mic}</button>`;
  });
  document.querySelector('#tab-talk .talk-controls [data-side="b"]').hidden = facing;
  $('c-partner').hidden = !facing;
  $('c-facing').textContent = facing ? 'Side by side' : 'Face-to-face';
  updatePartner();
}

function updatePartner(listeningText) {
  if (!facing) return;
  const last = messages.at(-1);
  let text = `Tap the microphone and speak ${nameOf(settings.convB)}`;
  if (listeningText) text = listeningText;
  else if (last) text = last.side === 'a' ? last.translated : last.original;
  $('c-partner-text').textContent = text;
}

function renderTranscript() {
  const box = $('c-transcript');
  $('c-empty').hidden = messages.length > 0 || micOwner === 'a' || micOwner === 'b';
  box.querySelectorAll('.bubble').forEach((b) => b.remove());
  for (const [i, m] of messages.entries()) {
    const el = document.createElement('div');
    el.className = `bubble ${m.side}`;
    el.innerHTML = `<p class="orig">${esc(m.original)}</p><p class="trans"><span dir="auto">${esc(m.translated)}</span><button data-say="${i}" aria-label="Speak again">${ICON.speaker}</button></p>`;
    box.appendChild(el);
  }
  if (micOwner === 'a' || micOwner === 'b') {
    const el = document.createElement('div');
    el.className = `bubble ${micOwner} listening`;
    el.innerHTML = `<p class="orig">${ICON.wave} Listening in ${esc(nameOf(sideLang(micOwner)))}… tap ■ when done</p><p class="trans heard"></p>`;
    box.appendChild(el);
  }
  if (convBusy) {
    const el = document.createElement('div');
    el.className = 'bubble a listening';
    el.innerHTML = `<p class="orig"><span class="spinner" style="width:16px;height:16px;border-width:2px"></span> ${convStage}</p>`;
    box.appendChild(el);
  }
  box.lastElementChild?.scrollIntoView?.({ block: 'end', behavior: 'smooth' });
}

$('tab-talk').addEventListener('click', async (e) => {
  const say = e.target.closest('[data-say]');
  if (say) {
    const m = messages[Number(say.dataset.say)];
    speak(m.translated, m.to, settings.speechRate);
    return;
  }
  const pick = e.target.closest('[data-pick]');
  if (pick && !micOwner) {
    const side = pick.dataset.pick;
    const code = await pickLanguage({ title: side === 'a' ? 'Your Language' : 'Their Language', current: sideLang(side) });
    if (code) {
      saveSettings(side === 'a' ? { convA: code } : { convB: code });
      renderTalkSides();
      warmUsualPairs();
    }
    return;
  }
  const mic = e.target.closest('[data-mic]');
  if (!mic || convBusy) return;
  const side = mic.dataset.mic;
  if (micOwner === side) {
    convBusy = true;
    convStage = 'Understanding speech…';
    renderTranscript();
    document.querySelectorAll(`[data-mic="${side}"]`).forEach((b) => setMicState(b, 'working'));
    try {
      const from = sideLang(side);
      const to = sideLang(side === 'a' ? 'b' : 'a');
      const heard = await finishRecording();
      if (heard === '') toast('Didn’t catch that. Try again.');
      else if (heard) {
        convStage = 'Translating…';
        renderTranscript();
        const translated = await translate(heard, from, to);
        messages.push({ side, original: heard, translated, from, to });
        if (settings.convAutoSpeak) speak(translated, to, settings.speechRate);
        if (settings.saveHistory) addHistory({ source: heard, translation: translated, from, to, origin: 'conversation' });
      }
    } catch (error) {
      toast(friendlyError(error), 4000);
    } finally {
      convBusy = false;
      document.querySelectorAll(`[data-mic="${side}"]`).forEach((b) => setMicState(b, 'idle'));
      renderTranscript();
      updatePartner();
    }
    return;
  }
  if (micOwner) return;
  // Start listening straight from the tap (iOS requires it); only wait if a language must be downloaded first.
  if (missingPacks([settings.convA, settings.convB]).length && !(await ensurePacks([settings.convA, settings.convB]))) return;
  const started = await startRecording(side, sideLang(side), (text) => {
    const bubble = document.querySelector('#c-transcript .bubble.listening .heard');
    if (bubble) bubble.textContent = text;
    updatePartner(text || `🎙️ ${nameOf(sideLang(side))}…`);
  });
  if (started) {
    document.querySelectorAll(`[data-mic="${side}"]`).forEach((b) => setMicState(b, 'recording'));
    renderTranscript();
    updatePartner(`🎙️ ${nameOf(sideLang(side))}…`);
  }
});

$('c-facing').addEventListener('click', () => {
  facing = !facing;
  renderTalkSides();
});
$('c-clear').addEventListener('click', () => {
  messages.length = 0;
  renderTranscript();
  updatePartner();
});

// ---------------------------------------------------------------------------
// Camera tab — live viewfinder, auto translation, or tap the words
// ---------------------------------------------------------------------------

let stream = null;
let photo = null; // { canvas, lines, src, tgt, mode }
let photoRun = 0;

function renderCameraLangs() {
  $('p-source').textContent = nameOf(settings.source);
  $('p-target').textContent = nameOf(settings.target);
}

async function enterCamera() {
  renderCameraLangs();
  voice.release();
  if (models.isOcrReady([ocrScriptFor(settings.source === 'auto' ? settings.lastOther ?? 'en' : settings.source) ?? 'latin'])) {
    warmCameraReader(ocrScriptFor(settings.source === 'auto' ? 'en' : settings.source) ?? 'latin');
  }
  if (photo) return;
  await startCamera();
}

let cameraReleaseTimer = null;

async function startCamera() {
  $('p-photo').hidden = true;
  $('p-tools').hidden = true;
  $('p-lines').hidden = true;
  clearTimeout(cameraReleaseTimer);
  if (!navigator.mediaDevices?.getUserMedia) {
    showCameraFallback();
    return;
  }
  try {
    // Reuse the open camera when possible: iOS asks for permission again whenever it's reopened.
    if (!stream || !stream.getVideoTracks().some((t) => t.readyState === 'live')) {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1440 } },
        audio: false,
      });
    }
    if (currentTab !== 'camera' || photo) return;
    const video = $('p-video');
    if (video.srcObject !== stream) video.srcObject = stream;
    await video.play().catch(() => {});
    $('p-live').hidden = false;
    $('p-start').hidden = true;
  } catch {
    showCameraFallback();
  }
}

function showCameraFallback() {
  $('p-live').hidden = true;
  $('p-start').hidden = Boolean(photo);
}

/** Hides the viewfinder; the camera itself is closed only after a minute away from the Camera screen. */
function stopCamera({ now = false } = {}) {
  $('p-video').pause();
  $('p-live').hidden = true;
  clearTimeout(cameraReleaseTimer);
  const release = () => {
    stream?.getTracks().forEach((t) => t.stop());
    stream = null;
    $('p-video').srcObject = null;
  };
  if (now) release();
  else cameraReleaseTimer = setTimeout(() => currentTab !== 'camera' && release(), 60000);
}

$('p-shutter').addEventListener('click', () => {
  const video = $('p-video');
  if (!video.videoWidth) return;
  // Keep only what's inside the guide frame: less background, fewer false "words", faster reading.
  const view = $('p-live').getBoundingClientRect();
  const frame = $('p-frame').getBoundingClientRect();
  const cover = Math.max(view.width / video.videoWidth, view.height / video.videoHeight);
  const offsetX = (view.width - video.videoWidth * cover) / 2;
  const offsetY = (view.height - video.videoHeight * cover) / 2;
  const sx = Math.max(0, (frame.left - view.left - offsetX) / cover);
  const sy = Math.max(0, (frame.top - view.top - offsetY) / cover);
  const sw = Math.min(video.videoWidth - sx, frame.width / cover);
  const sh = Math.min(video.videoHeight - sy, frame.height / cover);
  const scale = Math.min(1, 1600 / Math.max(sw, sh));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(sw * scale);
  canvas.height = Math.round(sh * scale);
  canvas.getContext('2d').drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  stopCamera();
  showPhoto(canvas);
});

for (const id of ['p-file', 'p-file-live', 'p-file-again']) {
  $(id).addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      stopCamera();
      showPhoto(await fileToCanvas(file, 1600));
    } catch {
      toast('Couldn’t open that photo.');
    }
  });
}

$('p-retake').addEventListener('click', () => {
  photo = null;
  photoRun++;
  $('p-popup').hidden = true;
  startCamera();
});

async function fileToCanvas(file, maxSide) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function showPhoto(canvas) {
  photo = { canvas, lines: [], mode: 'auto' };
  const img = $('p-image');
  img.src = canvas.toDataURL('image/jpeg', 0.88);
  await img.decode?.().catch(() => {});
  $('p-photo').hidden = false;
  $('p-tools').hidden = false;
  $('p-start').hidden = true;
  $('p-overlay').innerHTML = '';
  $('p-popup').hidden = true;
  processPhoto();
}

function setPhotoMode(mode) {
  if (!photo) return;
  photo.mode = mode;
  $('p-mode').querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.mode === mode));
  const overlay = $('p-overlay');
  overlay.classList.toggle('tap', mode === 'tap');
  overlay.classList.toggle('hide', mode === 'original');
  $('p-popup').hidden = true;
  $('p-hint').textContent = mode === 'tap' ? 'Tap any word to see its translation.' : mode === 'auto' ? 'Hard to read? Switch to “Tap words”.' : '';
}

$('p-mode').addEventListener('click', (e) => {
  const button = e.target.closest('button[data-mode]');
  if (button) setPhotoMode(button.dataset.mode);
});

/** Fixes common photo-reading slips that confuse translation (e.g. "Pecoríno" in Italian). */
function cleanOcrText(text, code) {
  if (code === 'it') return text.replace(/í/g, 'i').replace(/ú/g, 'u').replace(/á/g, 'a').replace(/ó/g, 'o');
  if (code === 'en' || code === 'nl' || code === 'de') return text.replace(/[íì]/g, 'i').replace(/[áà]/g, 'a');
  return text;
}

async function processPhoto() {
  if (!photo) return;
  const run = ++photoRun;
  const current = photo;
  const busy = $('p-busy');
  busy.hidden = false;
  $('p-lines').hidden = true;
  $('p-lines').innerHTML = '';
  $('p-overlay').innerHTML = '';
  $('p-hint').textContent = '';
  const status = (t) => run === photoRun && ($('p-busy-text').textContent = t);

  voice.release(); // free the voice engine while reading the photo
  releaseOcr(); // and the old fallback reader
  try {
    status('Finding text…');
    await new Promise((r) => setTimeout(r, 30)); // let the overlay paint first
    const preferred = [settings.lastOther, settings.target, ...models.installedPacks()].filter(Boolean);
    let result = await readPhoto(current.canvas, settings.source, preferred, status);
    if (run !== photoRun) return;
    if (result === null) {
      // Languages the camera reader doesn't cover (Hebrew): use the older reader.
      releaseCameraReader();
      const cleanedImage = cleanForOcr(current.canvas);
      result = await readText(cleanedImage?.canvas ?? current.canvas, tesseractLangsFor(settings.source), (p, s) => /load/i.test(s) && status('Preparing text reading…'));
      if (run !== photoRun) return;
    }
    const { lines, confidence, script } = result;
    if (!lines.length) {
      busy.hidden = true;
      $('p-hint').textContent = 'No text found. Get a little closer, hold steady, and try again.';
      return;
    }

    // Work out each line's language (menus often mix Italian and English).
    const DEFAULT_FOR_SCRIPT = { latin: 'en', cjk: 'zh', eslav: 'ru', arabic: 'ar', korean: 'ko', hindi: 'hi', thai: 'th', greek: 'el' };
    // Fragments with fewer than 3 letters (e.g. "di", "e") aren't worth translating on their own.
    const hasLetters = (t) => (t.match(/\p{L}/gu) ?? []).length >= 3 || /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/u.test(t);
    let tgt = settings.target;
    let src = settings.source;
    let lineLangs = lines.map(() => src);
    if (src === 'auto') {
      lineLangs = lines.map((l) => (hasLetters(l.text) ? detectLanguage(l.text) : null));
      const weight = new Map();
      lineLangs.forEach((code, i) => code && weight.set(code, (weight.get(code) ?? 0) + lines[i].text.length));
      const ranked = [...weight.entries()].sort((a, b) => b[1] - a[1]).map(([code]) => code);
      // The photo's language = the most common one that isn't what you translate into.
      src = ranked.find((c) => c !== tgt) ?? ranked[0] ?? detectLanguage(lines.map((l) => l.text).join(' ')) ?? DEFAULT_FOR_SCRIPT[script] ?? null;
      // Little text (a sign, a cover) is hard to identify: reuse the language of recent photos.
      const letterCount = lines.reduce((n, l) => n + (l.text.match(/\p{L}/gu) ?? []).length, 0);
      if (letterCount < 40 && settings.lastPhotoLang && ocrScriptFor(settings.lastPhotoLang) === script && settings.lastPhotoLang !== tgt) src = settings.lastPhotoLang;
      else if (letterCount >= 40 && src) saveSettings({ lastPhotoLang: src });
      if (!src) throw new Error('Couldn’t tell which language this is. Choose it with the left button.');
      // Each line is either already in your language (left as is) or in the photo's main language.
      lineLangs = lineLangs.map((code) => (code === tgt ? tgt : src));
    }
    if (src === tgt) tgt = tgt === 'en' ? (settings.lastOther ?? 'es') : 'en';
    current.src = src;
    current.tgt = tgt;
    $('p-source').textContent = settings.source === 'auto' ? `${nameOf(src)} ✨` : nameOf(src);

    const needed = [...new Set(lineLangs.filter((c) => c && c !== tgt).concat(src))];
    if (missingPacks([...needed, tgt]).length) {
      status(`Downloading ${listNames(missingPacks([...needed, tgt]))}…`);
      if (!(await ensurePacks([...needed, tgt]))) {
        busy.hidden = true;
        return;
      }
    }
    status('Translating…');
    // Translate each language group; lines already in the target language, and prices/numbers, stay as they are.
    const translated = lines.map((l) => l.text);
    const groups = new Map();
    lines.forEach((l, i) => {
      const code = lineLangs[i] ?? src;
      if (!hasLetters(l.text) || code === tgt) return;
      if (!groups.has(code)) groups.set(code, []);
      groups.get(code).push(i);
    });
    for (const [code, indices] of groups) {
      const out = await translateMany(indices.map((i) => cleanOcrText(lines[i].text, code)), code, tgt);
      indices.forEach((i, k) => {
        const original = lines[i].text;
        const result = out[k] ?? original;
        // Unknown single words (names, misreads) can make the model invent a phrase: keep those as they are.
        const words = original.trim().split(/\s+/).length;
        translated[i] = words <= 2 && result.length > original.length * 2.2 + 4 ? original : result;
      });
    }
    if (run !== photoRun) return;
    current.lines = lines.map((l, i) => ({ ...l, translated: translated[i], same: translated[i] === l.text }));
    drawOverlay();
    renderPhotoLines();
    // Low confidence: let the person tap words instead of covering the photo with guesses.
    setPhotoMode(confidence < 70 ? 'tap' : 'auto');
    if (confidence < 70) $('p-hint').textContent = 'This photo is hard to read — tap the words you want translated.';
    if (settings.saveHistory) {
      addHistory({ source: lines.map((l) => l.text).join('\n'), translation: current.lines.map((l) => l.translated).join('\n'), from: src, to: tgt, origin: 'camera' });
    }
  } catch (error) {
    if (run === photoRun) toast(friendlyError(error), 4500);
  } finally {
    if (run === photoRun) busy.hidden = true;
  }
}

function drawOverlay() {
  const overlay = $('p-overlay');
  const img = $('p-image');
  if (!photo?.lines.length) return;
  const scale = img.clientWidth / photo.canvas.width;
  const boxes = photo.lines.filter((l) => !l.same).map(({ bbox, translated }) => {
    const rawH = (bbox.y1 - bbox.y0) * scale;
    const padX = rawH * 0.25;
    const padY = rawH * 0.22;
    const left = Math.max(0, bbox.x0 * scale - padX);
    const top = Math.max(0, bbox.y0 * scale - padY);
    const w = Math.min(img.clientWidth - left, (bbox.x1 - bbox.x0) * scale + padX * 2);
    const h = rawH + padY * 2;
    const fontSize = Math.max(8, Math.min(rawH * 0.85, (w / Math.max(4, translated.length)) * 1.8));
    return `<div class="box" dir="auto" style="left:${left}px;top:${top}px;width:${Math.max(w, 24)}px;min-height:${h}px;font-size:${fontSize}px">${esc(translated)}</div>`;
  });
  const words = photo.lines.flatMap((line, li) =>
    line.words.map((w, wi) => {
      const pad = 3;
      return `<div class="word" data-line="${li}" data-word="${wi}" style="left:${w.bbox.x0 * scale - pad}px;top:${w.bbox.y0 * scale - pad}px;width:${(w.bbox.x1 - w.bbox.x0) * scale + pad * 2}px;height:${(w.bbox.y1 - w.bbox.y0) * scale + pad * 2}px"></div>`;
    }),
  );
  overlay.innerHTML = boxes.join('') + words.join('');
}

$('p-overlay').addEventListener('click', async (e) => {
  const el = e.target.closest('.word');
  if (!el || !photo) {
    $('p-popup').hidden = true;
    return;
  }
  $('p-overlay').querySelectorAll('.word.sel').forEach((w) => w.classList.remove('sel'));
  el.classList.add('sel');
  const line = photo.lines[Number(el.dataset.line)];
  const word = line.words[Number(el.dataset.word)].text.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
  const popup = $('p-popup');
  const wrapRect = $('p-photo').getBoundingClientRect();
  const r = el.getBoundingClientRect();
  const below = r.bottom - wrapRect.top + 8;
  popup.style.top = below + 150 < wrapRect.height ? `${below}px` : `${Math.max(8, r.top - wrapRect.top - 158)}px`;
  popup.innerHTML = `<p class="p-word">${esc(word)}</p><p class="p-trans">…</p>`;
  popup.hidden = false;
  try {
    const translatedWord = (await translate(word, photo.src, photo.tgt)) || word;
    popup.innerHTML = `
      <div class="row"><p class="p-word">${esc(word)} · ${esc(nameOf(photo.src))}</p><button class="icon-btn" id="pp-say" aria-label="Speak">${ICON.speaker}</button></div>
      <p class="p-trans" dir="auto">${esc(translatedWord)}</p>
      <p class="p-line" dir="auto">${esc(line.text)} → ${esc(line.translated)}</p>`;
    $('pp-say').addEventListener('click', () => speak(translatedWord, photo.tgt, settings.speechRate));
  } catch (error) {
    popup.hidden = true;
    toast(friendlyError(error));
  }
});
$('p-image').addEventListener('click', () => {
  $('p-popup').hidden = true;
});

function renderPhotoLines() {
  const box = $('p-lines');
  box.hidden = false;
  box.innerHTML =
    `<div class="head"><span>Text in photo</span><button class="text-btn" id="p-copy">Copy all</button></div>` +
    photo.lines
      .map((l, i) => `<div class="line"><div><p class="orig" dir="auto">${esc(l.text)}</p><p class="trans" dir="auto">${esc(l.translated)}</p></div><button class="icon-btn" data-line="${i}" aria-label="Speak">${ICON.speaker}</button></div>`)
      .join('');
}

$('p-lines').addEventListener('click', (e) => {
  if (e.target.closest('#p-copy')) copyText(photo.lines.map((l) => l.translated).join('\n'));
  const say = e.target.closest('[data-line]');
  if (say) speak(photo.lines[Number(say.dataset.line)].translated, photo.tgt, settings.speechRate);
});

$('p-source').addEventListener('click', async () => {
  const code = await pickLanguage({ title: 'Text in Photo Is', current: settings.source, allowAuto: true });
  if (!code) return;
  saveSettings({ source: code });
  detected = null;
  renderCameraLangs();
  renderTranslateLangs();
  if (photo) processPhoto();
});
$('p-target').addEventListener('click', async () => {
  const code = await pickLanguage({ title: 'Translate To', current: settings.target });
  if (!code) return;
  saveSettings({ target: code });
  renderCameraLangs();
  renderTranslateLangs();
  if (photo) processPhoto();
});
window.addEventListener('resize', () => photo?.lines.length && drawOverlay());

// ---------------------------------------------------------------------------
// Phrasebook tab
// ---------------------------------------------------------------------------

let openCategory = null;

function renderPhraseHome() {
  $('ph-lang').textContent = `Phrases in ${nameOf(settings.phraseLang)}`;
  $('ph-categories').innerHTML = PHRASE_CATEGORIES.map(
    (c) => `<button class="list-row" data-cat="${c.id}"><span class="cat-icon">${c.icon}</span><span class="main">${esc(c.title)}<div class="sub">${c.phrases.length} phrases</div></span><span class="chev">${ICON.chevron}</span></button>`,
  ).join('');
}

$('ph-lang').addEventListener('click', async () => {
  const code = await pickLanguage({ title: 'Phrasebook Language', current: settings.phraseLang });
  if (!code) return;
  saveSettings({ phraseLang: code });
  renderPhraseHome();
  if (code !== 'en' && !models.isPackInstalled(code) && navigator.onLine) ensurePacks([code]);
});

$('ph-categories').addEventListener('click', (e) => {
  const row = e.target.closest('[data-cat]');
  if (row) openPhraseCategory(PHRASE_CATEGORIES.find((c) => c.id === row.dataset.cat));
});
$('ph-back').addEventListener('click', () => {
  openCategory = null;
  $('ph-category').hidden = true;
  $('ph-home').hidden = false;
});

function renderPhraseList(cache) {
  const code = settings.phraseLang;
  $('ph-list').innerHTML = openCategory.phrases
    .map((p, i) => {
      const tr = code === 'en' ? p : cache[p];
      return `<div class="list-row phrase">
        <button class="main" data-phrase="${i}" style="text-align:left">
          <div class="en">${esc(p)}</div>
          ${tr ? `<div class="tr" dir="auto">${esc(tr)}</div>` : ''}
        </button>
        ${tr ? `<button class="icon-btn" data-phrase="${i}" aria-label="Speak">${ICON.speaker}</button><button class="icon-btn star" data-fav="${i}" aria-label="Add to favorites">${ICON.star}</button>` : ''}
      </div>`;
    })
    .join('');
}

function updatePhraseNeed() {
  if (!openCategory) return;
  const code = settings.phraseLang;
  const need = $('ph-need');
  const missing = missingPacks([code]);
  need.hidden = !missing.length;
  if (!missing.length) {
    const cache = getPhraseCache(code);
    if (code !== 'en' && openCategory.phrases.some((p) => !cache[p])) fillPhrases();
    return;
  }
  const { downloading } = models.state();
  const busy = downloading && (downloading.codes.includes(code) || bigJob);
  $('ph-need-text').textContent = busy ? `Downloading ${nameOf(code)}…` : `Download ${nameOf(code)} (${fmtBytes(models.packBytes([code], true))}) to use these phrases — then they work offline.`;
  $('ph-need-btn').hidden = Boolean(busy);
  setBar(need, busy ? downloading.fraction : null);
}

$('ph-need-btn').addEventListener('click', () => ensurePacks([settings.phraseLang]));

let fillingPhrases = false;
async function fillPhrases() {
  if (fillingPhrases || !openCategory) return;
  const category = openCategory;
  const code = settings.phraseLang;
  const cache = getPhraseCache(code);
  const missing = category.phrases.filter((p) => !cache[p]);
  if (!missing.length) return;
  fillingPhrases = true;
  try {
    const translated = await translateMany(missing, 'en', code);
    translated.forEach((t, i) => t && (cache[missing[i]] = t));
    setPhraseCache(code, cache);
    if (openCategory === category && settings.phraseLang === code) renderPhraseList(cache);
  } catch (error) {
    toast(friendlyError(error), 4000);
  } finally {
    fillingPhrases = false;
  }
}

function openPhraseCategory(category) {
  openCategory = category;
  $('ph-home').hidden = true;
  $('ph-category').hidden = false;
  $('ph-title').textContent = `${category.icon} ${category.title}`;
  window.scrollTo({ top: 0 });
  renderPhraseList(getPhraseCache(settings.phraseLang));
  updatePhraseNeed();
  if (missingPacks([settings.phraseLang]).length && navigator.onLine && !models.state().downloading) ensurePacks([settings.phraseLang]);
}

$('ph-list').addEventListener('click', (e) => {
  const code = settings.phraseLang;
  const cache = getPhraseCache(code);
  const fav = e.target.closest('[data-fav]');
  if (fav) {
    const phrase = openCategory.phrases[Number(fav.dataset.fav)];
    addHistory({ source: phrase, translation: code === 'en' ? phrase : cache[phrase], from: 'en', to: code, origin: 'phrase', favorite: true });
    fav.classList.add('on');
    toast('Added to Favorites');
    return;
  }
  const say = e.target.closest('[data-phrase]');
  if (say) {
    const phrase = openCategory.phrases[Number(say.dataset.phrase)];
    const text = code === 'en' ? phrase : cache[phrase];
    if (text) speak(text, code, settings.speechRate);
  }
});

// ---------------------------------------------------------------------------
// History tab
// ---------------------------------------------------------------------------

let historyFilter = 'all';
const ORIGIN_ICON = { text: '⌨︎', voice: '🎙️', camera: '📷', conversation: '💬', phrase: '📖' };

function relativeTime(ts) {
  const diff = (Date.now() - ts) / 1000;
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  if (diff < 60) return 'just now';
  if (diff < 3600) return rtf.format(-Math.round(diff / 60), 'minute');
  if (diff < 86400) return rtf.format(-Math.round(diff / 3600), 'hour');
  if (diff < 86400 * 7) return rtf.format(-Math.round(diff / 86400), 'day');
  return new Date(ts).toLocaleDateString();
}

function renderHistory() {
  const query = $('h-search').value.trim().toLowerCase();
  const all = getHistory();
  const items = all.filter((h) => (historyFilter === 'all' || h.favorite) && (!query || h.source.toLowerCase().includes(query) || h.translation.toLowerCase().includes(query)));
  $('h-list').innerHTML = items
    .map(
      (h) => `<div class="list-row hist" data-id="${h.id}">
      <div class="main">
        <div class="meta"><span>${ORIGIN_ICON[h.origin] ?? ''}</span><span>${esc(nameOf(h.from))} → ${esc(nameOf(h.to))}</span><span class="spacer"></span><span>${relativeTime(h.at)}</span></div>
        <div class="src" dir="auto">${esc(h.source)}</div>
        <div class="dst" dir="auto">${esc(h.translation)}</div>
      </div>
      <div class="tools">
        <button class="icon-btn" data-act="say" aria-label="Speak">${ICON.speaker}</button>
        <button class="icon-btn star${h.favorite ? ' on' : ''}" data-act="fav" aria-label="Favorite">${ICON.star}</button>
        <button class="icon-btn" data-act="del" aria-label="Delete" style="color:var(--red)">${ICON.trash}</button>
      </div>
    </div>`,
    )
    .join('');
  const empty = $('h-empty');
  empty.hidden = items.length > 0;
  empty.innerHTML = query
    ? `<h2>No results</h2><p>Nothing matches “${esc(query)}”.</p>`
    : historyFilter === 'fav'
      ? '<div class="empty-icon">⭐️</div><h2>No favorites yet</h2><p>Tap the star on a translation to keep it here.</p>'
      : '<div class="empty-icon">🕘</div><h2>No history yet</h2><p>Your translations are saved on this device only.</p>';
  $('h-clear').hidden = !all.some((h) => !h.favorite);
}

$('h-filter').addEventListener('click', (e) => {
  const button = e.target.closest('button');
  if (!button) return;
  historyFilter = button.dataset.filter;
  $('h-filter').querySelectorAll('button').forEach((b) => b.classList.toggle('active', b === button));
  renderHistory();
});
$('h-search').addEventListener('input', renderHistory);
$('h-list').addEventListener('click', (e) => {
  const row = e.target.closest('[data-id]');
  const action = e.target.closest('[data-act]')?.dataset.act;
  if (!row) return;
  const entry = getHistory().find((h) => h.id === row.dataset.id);
  if (!entry) return;
  if (action === 'say') speak(entry.translation, entry.to, settings.speechRate);
  else if (action === 'fav') {
    updateHistory(entry.id, { favorite: !entry.favorite });
    renderHistory();
  } else if (action === 'del') {
    deleteHistory(entry.id);
    renderHistory();
  } else copyText(entry.translation);
});
$('h-clear').addEventListener('click', () => {
  if (confirm('Clear history? Favorites are kept.')) {
    clearHistory({ keepFavorites: true });
    renderHistory();
  }
});

// ---------------------------------------------------------------------------
// Settings sheet
// ---------------------------------------------------------------------------

function renderDlCard(stripText, fraction) {
  const card = $('dl-card');
  const { downloading } = models.state();
  if (stripText) {
    const parts = stripText.split(' · ');
    const details = [parts.slice(2).join(' · '), downloading?.bytesPerSecond ? `${(downloading.bytesPerSecond / 1e6).toFixed(1)} MB/s` : ''].filter(Boolean).join(' · ');
    card.innerHTML = `<h4>${esc(parts[0])}… ${Math.round(fraction * 100)}%</h4>
      <div class="progress"><div style="width:${Math.round(fraction * 100)}%"></div></div>
      <p>${details ? `${esc(details)}. ` : ''}You can keep using Parlivo while this runs.</p>
      ${downloading ? '<button class="btn" id="dl-stop">Stop</button>' : ''}`;
    return;
  }
  if (everythingReady()) {
    card.innerHTML = '<h4 class="ok">✓ Everything is downloaded</h4><p>All languages, voice input and camera reading work with no internet.</p>';
    return;
  }
  const remaining = totalEverythingBytes(true);
  card.innerHTML = `<h4>Download for Offline</h4>
    <p>Every language (${PACK_CODES.length + 1}), voice input and camera reading — ${fmtBytes(remaining)}${remaining < totalEverythingBytes(false) ? ' left' : ''}. Wi-Fi recommended.</p>
    <button class="btn primary wide" id="dl-all">Download Everything</button>`;
}

function renderPacks() {
  const { downloading } = models.state();
  const rows = SORTED.filter((l) => l.code !== 'en').map((l) => {
    const installed = models.isPackInstalled(l.code);
    const busy = downloading?.codes.includes(l.code);
    let right;
    if (busy) right = `<span class="pill">${Math.round(downloading.fraction * 100)}%</span>`;
    else if (installed) right = `<button class="pill ok" data-remove="${l.code}">✓ Ready</button>`;
    else right = `<button class="pill" data-download="${l.code}" ${downloading ? 'disabled' : ''}>Download</button>`;
    return `<div class="list-row pack"><div class="main">${esc(l.name)} <span class="sub">· ${esc(l.native)}</span>
      <div class="sub">${fmtBytes(models.packBytes([l.code]))}</div></div>${right}</div>`;
  });
  const camReady = models.isOcrReady();
  rows.push(`<div class="list-row pack"><div class="main">📷 Camera text reading<div class="sub">All languages · ${fmtBytes(models.ocrBytes())}</div></div>
    ${camReady ? '<span class="pill ok">✓ Ready</span>' : `<button class="pill" data-download="camera" ${downloading || bigJob ? 'disabled' : ''}>Download</button>`}</div>`);
  rows.push(`<div class="list-row pack"><div class="main">🎙️ Voice input<div class="sub">All languages · ${SPEECH_MODEL_MB} MB</div></div>
    ${speechInstalled ? '<button class="pill ok" data-remove="speech">✓ Ready</button>' : `<button class="pill" data-download="speech" ${downloading || bigJob ? 'disabled' : ''}>Download</button>`}</div>`);
  $('packs').innerHTML = rows.join('');
}

async function renderStorage() {
  try {
    const { usage, quota } = await navigator.storage.estimate();
    $('storage-info').textContent = `Parlivo is using ${fmtBytes(usage)} on this phone${quota ? ` (room for up to ${fmtBytes(quota)})` : ''}.`;
  } catch {
    $('storage-info').textContent = '';
  }
}

function openSettings() {
  $('s-autospeak').checked = settings.autoSpeak;
  $('s-convspeak').checked = settings.convAutoSpeak;
  $('s-history').checked = settings.saveHistory;
  $('s-rate').value = settings.speechRate;
  if (!$('settings').open) $('settings').showModal();
  renderDownloads();
  renderDlCard(...stripState());
  renderPacks();
  renderStorage();
}

function stripState() {
  const strip = $('dl-strip');
  if (strip.hidden) return [null, 0];
  return [$('dl-strip-text').textContent, parseFloat($('dl-strip-fill').style.width) / 100 || 0];
}

$('settings').addEventListener('click', async (e) => {
  if (e.target.closest('#dl-all')) downloadEverything();
  if (e.target.closest('#dl-stop')) models.cancelDownload();
  const dl = e.target.closest('[data-download]');
  if (dl) {
    if (dl.dataset.download === 'speech') {
      if (await ensureSpeechModel()) renderPacks();
    } else if (dl.dataset.download === 'camera') {
      try {
        await models.downloadOcr();
        await warmCameraReader('latin');
        toast('Camera text reading is ready');
      } catch (error) {
        toast(friendlyError(error), 4000);
      }
      renderPacks();
    } else ensurePacks([dl.dataset.download]);
  }
  const rm = e.target.closest('[data-remove]');
  if (rm) {
    const code = rm.dataset.remove;
    const label = code === 'speech' ? 'voice input' : nameOf(code);
    if (!confirm(`Remove ${label} from this phone? You can download it again later.`)) return;
    if (code === 'speech') {
      await voice.removeSpeech();
      speechInstalled = false;
      localStorage.removeItem('speechModel');
    } else await models.removePacks([code]);
    renderDownloads();
    renderStorage();
  }
});

$('open-settings').addEventListener('click', openSettings);
$('settings-close').addEventListener('click', () => $('settings').close());
$('s-autospeak').addEventListener('change', (e) => saveSettings({ autoSpeak: e.target.checked }));
$('s-convspeak').addEventListener('change', (e) => saveSettings({ convAutoSpeak: e.target.checked }));
$('s-history').addEventListener('change', (e) => saveSettings({ saveHistory: e.target.checked }));
$('s-rate').addEventListener('change', (e) => {
  saveSettings({ speechRate: Number(e.target.value) });
  speak('This is how translations will sound.', 'en', settings.speechRate);
});
$('s-delete-all').addEventListener('click', () => {
  if (confirm('Delete all history and favorites from this phone?')) {
    clearHistory({ keepFavorites: false });
    renderHistory();
    toast('History deleted');
  }
});

/** Loads the language pairs the person is most likely to use next, in the background. */
function warmUsualPairs() {
  const from = settings.source !== 'auto' ? settings.source : settings.lastSpoken ?? detected ?? deviceLang();
  const pairs = [];
  const add = (a, b) => a && b && a !== b && pairReady(a, b) && pairs.push([a, b], [b, a]);
  if (currentTab === 'talk') add(settings.convA, settings.convB);
  add(from, settings.target);
  add(settings.convA, settings.convB);
  warmUp(...pairs);
}

// ---------------------------------------------------------------------------
// App start
// ---------------------------------------------------------------------------

function updateNetwork() {
  $('net-status').hidden = navigator.onLine;
}
window.addEventListener('online', updateNetwork);
window.addEventListener('offline', updateNetwork);

if ('serviceWorker' in navigator) {
  const startedAt = Date.now();
  const hadController = Boolean(navigator.serviceWorker.controller);
  navigator.serviceWorker.register('sw.js').catch(() => {});
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController) return;
    if (Date.now() - startedAt < 15000 && !micOwner && !models.state().downloading) window.location.reload();
    else toast('An update is ready. Close and reopen Parlivo to use it.', 4000);
  });
}
navigator.storage?.persist?.().catch(() => {});

// Free the space used by the old (larger) translation models from version 1.
caches
  .open('transformers-cache')
  .then(async (cache) => {
    for (const request of await cache.keys()) {
      if (request.url.includes('/Xenova/opus-mt-') || (request.url.includes('/Xenova/whisper-') && !request.url.includes(`/${SPEECH_MODEL}/`))) await cache.delete(request);
    }
  })
  .catch(() => {});

$('version').textContent = `Version ${__APP_VERSION__}`;

if (!localStorage.getItem('settings')) {
  const device = (navigator.language || 'en').slice(0, 2);
  if (lang(device) && device !== 'en') saveSettings({ target: 'en', convA: device, convB: 'en', phraseLang: 'en' });
  else saveSettings({});
}

const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const standalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
if (isIOS && !standalone && !localStorage.getItem('installTipDismissed')) $('install-tip').hidden = false;
$('install-tip-close').addEventListener('click', () => {
  $('install-tip').hidden = true;
  localStorage.setItem('installTipDismissed', '1');
});

// If iOS had to reload the app (e.g. low memory), come back to the same screen and text.
try {
  const saved = JSON.parse(localStorage.getItem('lastTab') || 'null');
  if (saved && Date.now() - saved.at < 30 * 60 * 1000) {
    const savedText = localStorage.getItem('tInput');
    if (savedText) input.value = savedText;
    if (saved.name !== 'translate' && TITLES[saved.name]) setTimeout(() => showTab(saved.name), 0);
  }
} catch {
  /* ignore */
}
input.addEventListener('input', () => {
  try {
    localStorage.setItem('tInput', input.value);
    localStorage.setItem('lastTab', JSON.stringify({ name: currentTab, at: Date.now() }));
  } catch {
    /* ignore */
  }
});

renderTranslateLangs();
renderTalkSides();
renderTranscript();
renderCameraLangs();
renderPhraseHome();
updateNetwork();

models
  .scanInstalled()
  .then(() => models.scanOcr())
  .then(() => {
    renderDownloads();
    // Start the engine and load the usual languages now, so translating is instant when needed.
    warmUsualPairs();
  })
  .catch(() => renderDownloads());

window.__app = { models, settings, translate, downloadEverything };

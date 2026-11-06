import { LANGUAGES, lang, canTranslate, route, packFor, packDirections, modelSizeMB, SPEECH_MODEL_MB } from './languages.js';
import * as engine from './engine.js';
import { detectLanguage } from './detect.js';
import { Recorder, speak, stopSpeaking } from './speech.js';
import { recognizeLines } from './ocr.js';
import { settings, saveSettings, getHistory, addHistory, updateHistory, deleteHistory, clearHistory, getPhraseCache, setPhraseCache } from './store.js';
import { PHRASE_CATEGORIES } from './phrases.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const nameOf = (code) => (code === 'auto' ? 'Detect Language' : lang(code)?.name ?? code);
const SORTED = [...LANGUAGES].sort((a, b) => a.name.localeCompare(b.name));

const ICON = {
  speaker: '<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
  star: '<svg viewBox="0 0 24 24"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2Z"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15"/></svg>',
  copy: '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
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

function setProgress(container, fraction) {
  const bar = container?.querySelector('.progress');
  if (!bar) return;
  bar.hidden = false;
  bar.firstElementChild.style.width = `${Math.round(Math.min(1, Math.max(0, fraction)) * 100)}%`;
}

const mb = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)} GB` : `${Math.round(n)} MB`);

function routeSizeMB(src, tgt) {
  const pairs = route(src, tgt) ?? [];
  return pairs.filter((p) => !status.pairs.has(p)).reduce((sum, p) => sum + modelSizeMB(p), 0);
}

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
  if (/fetch|network|load/i.test(message) && !navigator.onLine) {
    return 'This needs a one-time download. Connect to the internet, then try again.';
  }
  return message;
}

// Downloaded models (refreshed after every download).
let status = { pairs: new Set(), speech: false };
let statusLoaded = null;
async function refreshStatus() {
  try {
    statusLoaded = engine.downloadedStatus();
    status = await statusLoaded;
  } catch {
    /* Cache Storage unavailable (e.g. private browsing) */
  }
  updateTranslateBadge();
  if ($('settings').open) renderPacks();
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

const TITLES = { translate: 'Translate', talk: 'Conversation', camera: 'Camera', phrases: 'Phrasebook', history: 'History' };

function showTab(name) {
  document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t.id === `tab-${name}`));
  document.querySelectorAll('#tabbar button').forEach((b) => b.classList.toggle('active', b.dataset.tab === name));
  $('page-title').textContent = TITLES[name];
  if (name === 'history') renderHistory();
  if (name === 'camera') renderCameraLangs();
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
  const { current, allowAuto, unavailableReason } = pickerOptions;
  const query = $('picker-search').value.trim().toLowerCase();
  const rows = [];
  if (allowAuto && !query) {
    rows.push(`<button class="list-row" data-code="auto"><span class="main">✨ Detect Language<div class="sub">Identified on your device</div></span>${current === 'auto' ? '<span class="check">✓</span>' : ''}</button>`);
  }
  for (const l of SORTED) {
    if (query && !l.name.toLowerCase().includes(query) && !l.native.toLowerCase().includes(query)) continue;
    const reason = unavailableReason?.(l.code);
    const ready = l.code === 'en' || packFor(l.code).every((p) => status.pairs.has(p));
    rows.push(`<button class="list-row${reason ? ' disabled' : ''}" data-code="${l.code}" ${reason ? 'disabled' : ''}>
      <span class="main">${esc(l.name)}<div class="sub">${esc(reason ?? l.native)}</div></span>
      ${ready && l.code !== 'en' ? '<span class="pill ok">Offline</span>' : ''}
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
  if (row && !row.disabled) closePicker(row.dataset.code);
});

// ---------------------------------------------------------------------------
// Translate tab
// ---------------------------------------------------------------------------

const input = $('t-input');
let detected = null;
let lastResult = null; // { source, translation, from, to, input, entryId }
let translating = false;

function renderTranslateLangs() {
  $('t-source').textContent = nameOf(settings.source);
  $('t-target').textContent = nameOf(settings.target);
  $('t-swap').disabled = settings.source === 'auto' && !detected;
  const det = $('t-detected');
  det.hidden = !(settings.source === 'auto' && detected);
  det.textContent = detected ? `${nameOf(detected)} detected` : '';
  updateTranslateBadge();
}

function updateTranslateBadge() {
  const badge = $('t-badge');
  const src = settings.source === 'auto' ? detected : settings.source;
  const tgt = settings.target;
  badge.className = 'badge';
  if (!src) {
    badge.textContent = '';
    return;
  }
  if (!canTranslate(src, tgt)) {
    badge.textContent = `⚠︎ ${nameOf(src)} → ${nameOf(tgt)} isn’t available. Try English.`;
    badge.classList.add('bad');
  } else if (engine.isPairReady(status, src, tgt)) {
    badge.textContent = '✓ Works offline';
    badge.classList.add('ok');
  } else {
    badge.textContent = `⬇︎ One-time download needed (about ${mb(routeSizeMB(src, tgt))}). Happens automatically when you translate.`;
    badge.classList.add('warn');
  }
}

function updateInputUI() {
  $('t-count').textContent = input.value.length;
  $('t-clear').hidden = !input.value;
  $('t-go').disabled = !input.value.trim() || translating;
  $('t-output').classList.toggle('stale', Boolean(lastResult) && input.value !== lastResult.input);
}

function resetOutput() {
  lastResult = null;
  $('t-output-card').hidden = true;
}

input.addEventListener('input', updateInputUI);

$('t-source').addEventListener('click', async () => {
  const code = await pickLanguage({ title: 'Translate From', current: settings.source, allowAuto: true });
  if (!code) return;
  saveSettings({ source: code });
  detected = null;
  if (code !== 'auto' && !canTranslate(code, settings.target)) {
    saveSettings({ target: code === 'en' ? 'es' : 'en' });
    toast(`Switched to ${nameOf(settings.target)} — ${nameOf(code)} can’t go to that language offline.`);
  }
  resetOutput();
  renderTranslateLangs();
});

$('t-target').addEventListener('click', async () => {
  const src = settings.source === 'auto' ? detected : settings.source;
  const code = await pickLanguage({
    title: 'Translate To',
    current: settings.target,
    unavailableReason: (c) => (src && c !== src && !canTranslate(src, c) ? `Not available from ${nameOf(src)}` : null),
  });
  if (!code) return;
  saveSettings({ target: code });
  resetOutput();
  renderTranslateLangs();
});

$('t-swap').addEventListener('click', () => {
  const from = settings.source === 'auto' ? detected : settings.source;
  if (!from) return;
  if (!canTranslate(settings.target, from)) {
    toast(`${nameOf(settings.target)} → ${nameOf(from)} isn’t available offline.`);
    return;
  }
  const previousOutput = lastResult?.translation;
  saveSettings({ source: settings.target, target: from });
  detected = null;
  if (previousOutput) input.value = previousOutput;
  resetOutput();
  renderTranslateLangs();
  updateInputUI();
});

$('t-clear').addEventListener('click', () => {
  input.value = '';
  resetOutput();
  if (settings.source === 'auto') detected = null;
  renderTranslateLangs();
  updateInputUI();
  input.focus();
});

$('t-paste').addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      input.value = text;
      updateInputUI();
    }
  } catch {
    toast('Long-press in the text box and choose Paste.');
  }
});

async function runTranslate(origin = 'text') {
  const text = input.value.trim();
  if (!text || translating) return;
  input.blur();

  let src = settings.source;
  if (src === 'auto') {
    src = detectLanguage(text);
    if (!src) {
      toast('Couldn’t tell which language this is. Tap the left button to choose it.', 3500);
      return;
    }
    detected = src;
    renderTranslateLangs();
  }
  let tgt = settings.target;
  // Typed in the target language with "Detect Language" on: translate the other way.
  if (settings.source === 'auto' && src === tgt) tgt = tgt === 'en' ? (settings.lastOther ?? 'es') : 'en';
  if (tgt !== 'en') saveSettings({ lastOther: tgt });
  if (!canTranslate(src, tgt)) {
    toast(`${nameOf(src)} → ${nameOf(tgt)} isn’t available offline. Try English.`, 3500);
    return;
  }
  let ready = engine.isPairReady(status, src, tgt);
  if (!ready) {
    await refreshStatus();
    ready = engine.isPairReady(status, src, tgt);
  }
  if (!ready && !navigator.onLine) {
    toast(`${nameOf(src)} → ${nameOf(tgt)} hasn’t been downloaded yet. Connect to the internet once to download it.`, 4000);
    return;
  }

  translating = true;
  const go = $('t-go');
  go.textContent = ready ? 'Translating…' : 'Downloading…';
  updateInputUI();
  const card = $('t-download');
  card.hidden = ready;
  $('t-download-text').textContent = `Downloading ${nameOf(src)} → ${nameOf(tgt)} for offline use…`;
  $('t-download-btn').hidden = true;
  setProgress(card, 0);

  try {
    const translation = await engine.translate(
      text,
      src,
      tgt,
      engine.progressTracker((fraction) => {
        setProgress(card, fraction);
        if (fraction >= 0.999) go.textContent = 'Translating…';
      }),
    );
    const entry = settings.saveHistory ? addHistory({ source: text, translation, from: src, to: tgt, origin }) : null;
    lastResult = { source: text, translation, from: src, to: tgt, input: input.value, entryId: entry?.id ?? null };
    showOutput();
    if (settings.autoSpeak) speak(translation, tgt, settings.speechRate);
    if (!ready) refreshStatus();
  } catch (error) {
    toast(friendlyError(error), 4000);
  } finally {
    translating = false;
    card.hidden = true;
    go.textContent = 'Translate';
    updateInputUI();
  }
}

function showOutput() {
  if (!lastResult) return;
  $('t-output-card').hidden = false;
  $('t-out-lang').textContent = nameOf(lastResult.to);
  const out = $('t-output');
  out.textContent = lastResult.translation;
  out.dir = lang(lastResult.to)?.rtl ? 'rtl' : 'auto';
  const fav = lastResult.entryId && getHistory().find((h) => h.id === lastResult.entryId)?.favorite;
  $('t-fav').classList.toggle('on', Boolean(fav));
  updateInputUI();
}

$('t-go').addEventListener('click', () => runTranslate('text'));
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) runTranslate('text');
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
  } else {
    copyText(lastResult.translation);
  }
});
$('t-fav').addEventListener('click', () => {
  if (!lastResult) return;
  let entry = lastResult.entryId ? getHistory().find((h) => h.id === lastResult.entryId) : null;
  if (entry) {
    updateHistory(entry.id, { favorite: !entry.favorite });
  } else {
    entry = addHistory({ source: lastResult.source, translation: lastResult.translation, from: lastResult.from, to: lastResult.to, origin: 'text', favorite: true });
    lastResult.entryId = entry.id;
  }
  showOutput();
  toast(getHistory().find((h) => h.id === lastResult.entryId)?.favorite ? 'Added to Favorites' : 'Removed from Favorites');
});

// ---- Voice input (on-device Whisper) ----

const recorder = new Recorder();
let micOwner = null; // which button is recording: 'translate' | 'a' | 'b'

/** Makes sure the speech model is available, asking before the first download. */
async function ensureSpeechModel() {
  if (!status.speech) await refreshStatus();
  if (status.speech) return true;
  if (!navigator.onLine) {
    toast('Voice input needs a one-time download. Connect to the internet once, then it works offline.', 4000);
    return false;
  }
  if (!confirm(`Voice input needs a one-time download (about ${SPEECH_MODEL_MB} MB). After that it works offline. Download now?`)) return false;
  toast('Downloading voice model…', 60000);
  try {
    await engine.downloadSpeech(engine.progressTracker((f) => ($('toast').textContent = `Downloading voice model… ${Math.round(f * 100)}%`)));
    toast('Voice input is ready');
    await refreshStatus();
    return true;
  } catch (error) {
    toast(friendlyError(error), 4000);
    return false;
  }
}

async function startRecording(owner) {
  if (!(await ensureSpeechModel())) return false;
  stopSpeaking();
  try {
    await recorder.start();
    micOwner = owner;
    return true;
  } catch (error) {
    toast(error.message, 4000);
    return false;
  }
}

/** Stops recording and returns the recognized text ('' if nothing). */
async function finishRecording(languageCode) {
  micOwner = null;
  const audio = await recorder.stop();
  if (!audio || audio.length < 1600) return '';
  return engine.transcribe(audio, languageCode);
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
      const listenLang = settings.source === 'auto' ? null : settings.source;
      const text = await finishRecording(listenLang);
      if (text) {
        input.value = text;
        updateInputUI();
        if (settings.source === 'auto') detected = null;
        await runTranslate('voice');
      } else {
        toast('Didn’t catch that. Try again.');
      }
    } catch (error) {
      toast(friendlyError(error), 4000);
    } finally {
      setMicState(button, 'idle');
    }
    return;
  }
  if (micOwner) return;
  if (await startRecording('translate')) {
    setMicState(button, 'recording');
    resetOutput();
    input.value = '';
    input.placeholder = 'Listening… tap ■ when done';
    updateInputUI();
  }
});
new MutationObserver(() => {
  if (!$('t-mic').classList.contains('recording')) input.placeholder = 'Enter text';
}).observe($('t-mic'), { attributes: true, attributeFilter: ['class'] });

// ---------------------------------------------------------------------------
// Conversation tab
// ---------------------------------------------------------------------------

const messages = [];
let facing = false;
let convBusy = false;

function sideLang(side) {
  return side === 'a' ? settings.convA : settings.convB;
}

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
    el.innerHTML = `<p class="orig">${ICON.wave} Listening in ${esc(nameOf(sideLang(micOwner)))}… tap ■ when done</p>`;
    box.appendChild(el);
  }
  if (convBusy) {
    const el = document.createElement('div');
    el.className = 'bubble a listening';
    el.innerHTML = '<p class="orig"><span class="spinner" style="width:16px;height:16px;border-width:2px"></span> Translating…</p>';
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
    const other = side === 'a' ? settings.convB : settings.convA;
    const code = await pickLanguage({
      title: side === 'a' ? 'Your Language' : 'Their Language',
      current: sideLang(side),
      unavailableReason: (c) => (c !== other && (!canTranslate(c, other) || !canTranslate(other, c)) ? `Can’t go both ways with ${nameOf(other)}` : null),
    });
    if (code) {
      saveSettings(side === 'a' ? { convA: code } : { convB: code });
      renderTalkSides();
    }
    return;
  }

  const mic = e.target.closest('[data-mic]');
  if (!mic || convBusy) return;
  const side = mic.dataset.mic;
  if (micOwner === side) {
    convBusy = true;
    renderTranscript();
    document.querySelectorAll(`[data-mic="${side}"]`).forEach((b) => setMicState(b, 'working'));
    try {
      const from = sideLang(side);
      const to = sideLang(side === 'a' ? 'b' : 'a');
      const heard = await finishRecording(from);
      if (!heard) {
        toast('Didn’t catch that. Try again.');
      } else {
        const translated = await engine.translate(heard, from, to);
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
  if (await startRecording(side)) {
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
// Camera tab
// ---------------------------------------------------------------------------

let photo = null; // { canvas, lines: [{text, bbox, translated}], src, tgt }

function renderCameraLangs() {
  $('p-source').textContent = nameOf(settings.source);
  $('p-target').textContent = nameOf(settings.target);
}

$('p-source').addEventListener('click', async () => {
  const code = await pickLanguage({ title: 'Text in Photo Is', current: settings.source, allowAuto: true });
  if (!code) return;
  saveSettings({ source: code });
  if (code !== 'auto' && !canTranslate(code, settings.target)) saveSettings({ target: code === 'en' ? 'es' : 'en' });
  detected = null;
  renderCameraLangs();
  renderTranslateLangs();
  if (photo) processPhoto();
});

$('p-target').addEventListener('click', async () => {
  const src = settings.source === 'auto' ? null : settings.source;
  const code = await pickLanguage({
    title: 'Translate To',
    current: settings.target,
    unavailableReason: (c) => (src && c !== src && !canTranslate(src, c) ? `Not available from ${nameOf(src)}` : null),
  });
  if (!code) return;
  saveSettings({ target: code });
  renderCameraLangs();
  renderTranslateLangs();
  if (photo) processPhoto();
});

$('p-file').addEventListener('change', async (e) => {
  const file = e.target.files?.[0];
  e.target.value = '';
  if (!file) return;
  try {
    const canvas = await fileToCanvas(file, 2000);
    photo = { canvas, lines: [] };
    const img = $('p-image');
    img.src = canvas.toDataURL('image/jpeg', 0.9);
    await img.decode?.().catch(() => {});
    $('p-photo').hidden = false;
    $('p-empty').hidden = true;
    processPhoto();
  } catch {
    toast('Couldn’t open that photo.');
  }
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

let photoRun = 0;
async function processPhoto() {
  if (!photo) return;
  const run = ++photoRun;
  const busy = $('p-busy');
  busy.hidden = false;
  $('p-overlay').innerHTML = '';
  $('p-lines').hidden = true;
  $('p-toggle').hidden = true;
  const setBusy = (text, fraction) => {
    $('p-busy-text').textContent = text;
    const bar = busy.querySelector('.progress');
    bar.hidden = fraction === undefined;
    if (fraction !== undefined) bar.firstElementChild.style.width = `${Math.round(fraction * 100)}%`;
  };

  try {
    setBusy('Finding text…', 0);
    const lines = await recognizeLines(photo.canvas, settings.source, (p, s) => {
      if (run === photoRun) setBusy(/load|download/i.test(s) ? 'Preparing text recognition…' : 'Finding text…', p);
    });
    if (run !== photoRun) return;
    if (!lines.length) {
      busy.hidden = true;
      toast(settings.source === 'auto' ? 'No text found. For Japanese, Chinese, Korean, Arabic and similar, pick the language first.' : 'No text found in this photo.', 4500);
      return;
    }

    let src = settings.source;
    if (src === 'auto') {
      src = detectLanguage(lines.map((l) => l.text).join(' '));
      if (!src) throw new Error('Couldn’t tell which language the text is in. Choose it with the left button.');
      detected = src;
      renderTranslateLangs();
    }
    const tgt = settings.target;
    if (!canTranslate(src, tgt)) throw new Error(`${nameOf(src)} → ${nameOf(tgt)} isn’t available offline.`);
    if (!engine.isPairReady(status, src, tgt)) await refreshStatus();
    if (!engine.isPairReady(status, src, tgt) && !navigator.onLine) {
      throw new Error(`${nameOf(src)} → ${nameOf(tgt)} hasn’t been downloaded yet.`);
    }

    setBusy('Translating…');
    const joined = lines.map((l) => l.text).join('\n');
    const translated = await engine.translate(
      joined,
      src,
      tgt,
      engine.progressTracker((f) => run === photoRun && setBusy('Downloading language…', f)),
    );
    if (run !== photoRun) return;
    const parts = translated.split('\n');
    photo.lines = lines.map((l, i) => ({ ...l, translated: parts[i] ?? '' }));
    photo.src = src;
    photo.tgt = tgt;
    drawOverlay();
    renderPhotoLines();
    if (settings.saveHistory) addHistory({ source: joined, translation: translated, from: src, to: tgt, origin: 'camera' });
    refreshStatus();
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
  overlay.innerHTML = photo.lines
    .map(({ bbox, translated }) => {
      // Text-recognition boxes hug the letters, so pad them to fully cover the original.
      const rawH = (bbox.y1 - bbox.y0) * scale;
      const padX = rawH * 0.25;
      const padY = rawH * 0.22;
      const left = Math.max(0, bbox.x0 * scale - padX);
      const top = Math.max(0, bbox.y0 * scale - padY);
      const w = Math.min(img.clientWidth - left, (bbox.x1 - bbox.x0) * scale + padX * 2);
      const h = rawH + padY * 2;
      const fontSize = Math.max(8, Math.min(rawH * 0.85, (w / Math.max(4, translated.length)) * 1.8));
      return `<div class="box" dir="auto" style="left:${left}px;top:${top}px;width:${Math.max(w, 24)}px;min-height:${h}px;font-size:${fontSize}px">${esc(translated)}</div>`;
    })
    .join('');
  $('p-toggle').hidden = false;
  overlay.classList.toggle('hide', $('p-toggle').querySelector('.active').dataset.show === 'original');
}

function renderPhotoLines() {
  const box = $('p-lines');
  box.hidden = false;
  box.innerHTML = `<div class="head"><span>Text in photo</span><button class="text-btn" id="p-copy">Copy all</button></div>` +
    photo.lines
      .map((l, i) => `<div class="line"><div><p class="orig">${esc(l.text)}</p><p class="trans" dir="auto">${esc(l.translated)}</p></div><button class="icon-btn" data-line="${i}" aria-label="Speak">${ICON.speaker}</button></div>`)
      .join('');
}

$('p-lines').addEventListener('click', (e) => {
  if (e.target.closest('#p-copy')) copyText(photo.lines.map((l) => l.translated).join('\n'));
  const say = e.target.closest('[data-line]');
  if (say) speak(photo.lines[Number(say.dataset.line)].translated, photo.tgt, settings.speechRate);
});
$('p-toggle').addEventListener('click', (e) => {
  const button = e.target.closest('button');
  if (!button) return;
  $('p-toggle').querySelectorAll('button').forEach((b) => b.classList.toggle('active', b === button));
  $('p-overlay').classList.toggle('hide', button.dataset.show === 'original');
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
  const code = await pickLanguage({
    title: 'Phrasebook Language',
    current: settings.phraseLang,
    unavailableReason: (c) => (c !== 'en' && !canTranslate('en', c) ? 'Not available from English' : null),
  });
  if (!code) return;
  saveSettings({ phraseLang: code });
  renderPhraseHome();
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

function renderPhraseList(cache, pending) {
  const code = settings.phraseLang;
  $('ph-list').innerHTML = openCategory.phrases
    .map((p, i) => {
      const tr = code === 'en' ? p : cache[p];
      return `<div class="list-row phrase">
        <button class="main" data-phrase="${i}" style="text-align:left">
          <div class="en">${esc(p)}</div>
          <div class="tr${tr ? '' : ' pending'}" dir="auto">${esc(tr ?? (pending ? 'Translating…' : '—'))}</div>
        </button>
        ${tr ? `<button class="icon-btn" data-phrase="${i}" aria-label="Speak">${ICON.speaker}</button><button class="icon-btn star" data-fav="${i}" aria-label="Add to favorites">${ICON.star}</button>` : ''}
      </div>`;
    })
    .join('');
}

async function openPhraseCategory(category) {
  openCategory = category;
  $('ph-home').hidden = true;
  $('ph-category').hidden = false;
  $('ph-title').textContent = `${category.icon} ${category.title}`;
  window.scrollTo({ top: 0 });

  const code = settings.phraseLang;
  const cache = getPhraseCache(code);
  const missing = code === 'en' ? [] : category.phrases.filter((p) => !cache[p]);
  renderPhraseList(cache, missing.length > 0);
  if (!missing.length) return;

  if (!engine.isPairReady(status, 'en', code)) await refreshStatus();
  if (!engine.isPairReady(status, 'en', code) && !navigator.onLine) {
    toast(`Download ${nameOf(code)} in Settings to use the phrasebook offline.`, 4000);
    renderPhraseList(cache, false);
    return;
  }
  const progressBox = $('ph-category');
  try {
    const translated = await engine.translate(missing.join('\n'), 'en', code, engine.progressTracker((f) => setProgress(progressBox, f)));
    translated.split('\n').forEach((t, i) => {
      if (missing[i] && t) cache[missing[i]] = t;
    });
    setPhraseCache(code, cache);
    refreshStatus();
  } catch (error) {
    toast(friendlyError(error), 4000);
  } finally {
    progressBox.querySelector('.progress').hidden = true;
    if (openCategory === category && settings.phraseLang === code) renderPhraseList(cache, false);
  }
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
  const items = all.filter(
    (h) => (historyFilter === 'all' || h.favorite) && (!query || h.source.toLowerCase().includes(query) || h.translation.toLowerCase().includes(query)),
  );
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
  } else {
    copyText(entry.translation);
  }
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

let downloading = null; // language code or 'speech'
let downloadFraction = 0;

function renderPacks() {
  const rows = SORTED.filter((l) => l.code !== 'en').map((l) => {
    const pairs = packFor(l.code);
    const have = pairs.filter((p) => status.pairs.has(p));
    const complete = pairs.length > 0 && have.length === pairs.length;
    const size = pairs.reduce((s, p) => s + modelSizeMB(p), 0);
    let right;
    if (downloading === l.code) right = `<span class="pill">${Math.round(downloadFraction * 100)}%</span>`;
    else if (complete) right = `<button class="pill ok" data-remove="${l.code}">✓ Downloaded</button>`;
    else right = `<button class="pill" data-download="${l.code}" ${downloading ? 'disabled' : ''}>Download</button>`;
    return `<div class="list-row pack">
      <div class="main">${esc(l.name)} <span class="sub">· ${esc(l.native)}</span>
        <div class="sub">${packDirections(l.code)} · ${mb(size)}${have.length && !complete ? ' · partly downloaded' : ''}</div>
        ${downloading === l.code ? `<div class="progress"><div style="width:${Math.round(downloadFraction * 100)}%"></div></div>` : ''}
      </div>${right}</div>`;
  });
  $('packs').innerHTML = rows.join('');

  let speechRight;
  if (downloading === 'speech') speechRight = `<span class="pill">${Math.round(downloadFraction * 100)}%</span>`;
  else if (status.speech) speechRight = '<button class="pill ok" data-remove="speech">✓ Downloaded</button>';
  else speechRight = `<button class="pill" data-download="speech" ${downloading ? 'disabled' : ''}>Download</button>`;
  $('speech-pack').innerHTML = `<div class="list-row pack"><div class="main">Speech recognition<div class="sub">All languages · ${SPEECH_MODEL_MB} MB · needed for the microphone</div>
    ${downloading === 'speech' ? `<div class="progress"><div style="width:${Math.round(downloadFraction * 100)}%"></div></div>` : ''}</div>${speechRight}</div>`;
}

async function renderStorage() {
  try {
    const { usage, quota } = await navigator.storage.estimate();
    $('storage-info').textContent = `Using ${mb(usage / 1e6)} of storage${quota ? ` (up to ${mb(quota / 1e6)} available)` : ''}.`;
  } catch {
    $('storage-info').textContent = '';
  }
}

async function downloadPack(code) {
  if (!navigator.onLine) {
    toast('Connect to the internet to download languages.');
    return;
  }
  downloading = code;
  downloadFraction = 0;
  renderPacks();
  const onProgress = engine.progressTracker((f) => {
    downloadFraction = f;
    renderPacks();
  });
  try {
    if (code === 'speech') await engine.downloadSpeech(onProgress);
    else await engine.downloadPairs(packFor(code), onProgress);
    toast(code === 'speech' ? 'Voice input is ready offline' : `${nameOf(code)} is ready offline`);
  } catch (error) {
    toast(friendlyError(error), 4000);
  } finally {
    downloading = null;
    await refreshStatus();
    renderPacks();
    renderStorage();
  }
}

async function removePack(code) {
  const label = code === 'speech' ? 'the voice model' : nameOf(code);
  if (!confirm(`Remove ${label} from this device? You can download it again later.`)) return;
  if (code === 'speech') await engine.removeSpeech();
  else {
    // Keep models another downloaded language still needs? Each pack only holds its own en↔X pairs.
    await engine.removePairs(packFor(code));
  }
  await refreshStatus();
  renderPacks();
  renderStorage();
}

$('settings').addEventListener('click', (e) => {
  const dl = e.target.closest('[data-download]');
  if (dl && !downloading) downloadPack(dl.dataset.download);
  const rm = e.target.closest('[data-remove]');
  if (rm && !downloading) removePack(rm.dataset.remove);
});

$('open-settings').addEventListener('click', () => {
  $('s-autospeak').checked = settings.autoSpeak;
  $('s-convspeak').checked = settings.convAutoSpeak;
  $('s-history').checked = settings.saveHistory;
  $('s-rate').value = settings.speechRate;
  renderPacks();
  renderStorage();
  $('settings').showModal();
  refreshStatus();
});
$('settings-close').addEventListener('click', () => $('settings').close());
$('s-autospeak').addEventListener('change', (e) => saveSettings({ autoSpeak: e.target.checked }));
$('s-convspeak').addEventListener('change', (e) => saveSettings({ convAutoSpeak: e.target.checked }));
$('s-history').addEventListener('change', (e) => saveSettings({ saveHistory: e.target.checked }));
$('s-rate').addEventListener('change', (e) => {
  saveSettings({ speechRate: Number(e.target.value) });
  speak('This is how translations will sound.', 'en', settings.speechRate);
});
$('s-delete-all').addEventListener('click', () => {
  if (confirm('Delete all history and favorites from this device?')) {
    clearHistory({ keepFavorites: false });
    renderHistory();
    toast('History deleted');
  }
});

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
  // A new version was installed. Right after launch, switch to it quietly; later, just mention it.
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController) return;
    if (Date.now() - startedAt < 15000 && !translating && !micOwner) window.location.reload();
    else toast('An update is ready. Close and reopen the app to use it.', 4000);
  });
}
// Ask the browser not to clear downloaded languages when space runs low.
navigator.storage?.persist?.().catch(() => {});

$('version').textContent = `Version ${__APP_VERSION__}`;

// First run: pick sensible defaults from the device language.
if (!localStorage.getItem('settings')) {
  const device = (navigator.language || 'en').slice(0, 2);
  if (lang(device) && device !== 'en') saveSettings({ target: 'en', convA: device, convB: 'en', phraseLang: 'en' });
  else saveSettings({});
}

// iPhone/iPad Safari: suggest installing to the Home Screen (once).
const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const standalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
if (isIOS && !standalone && !localStorage.getItem('installTipDismissed')) $('install-tip').hidden = false;
$('install-tip-close').addEventListener('click', () => {
  $('install-tip').hidden = true;
  localStorage.setItem('installTipDismissed', '1');
});

renderTranslateLangs();
renderTalkSides();
renderTranscript();
renderCameraLangs();
renderPhraseHome();
updateInputUI();
updateNetwork();
refreshStatus();

// Let tests and debugging reach a few internals.
window.__app = { engine, settings, refreshStatus, getStatus: () => status };

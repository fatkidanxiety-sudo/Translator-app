// Small persistent stores kept in localStorage (history, settings, phrase cache).

import { isSupported } from './languages.js';

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked; the app still works without saving */
  }
};

// ---- Settings ----
const DEFAULT_SETTINGS = {
  source: 'auto',
  target: 'es',
  convA: 'en',
  convB: 'es',
  phraseLang: 'es',
  autoSpeak: false,
  convAutoSpeak: true,
  saveHistory: true,
  speechRate: 1,
};

export const settings = { ...DEFAULT_SETTINGS, ...read('settings', {}) };
// Drop languages that this version no longer offers.
for (const key of ['source', 'target', 'convA', 'convB', 'phraseLang']) {
  if (settings[key] !== 'auto' && !isSupported(settings[key])) settings[key] = DEFAULT_SETTINGS[key];
}
export function saveSettings(patch) {
  Object.assign(settings, patch);
  write('settings', settings);
}

// ---- History ----
const MAX_HISTORY = 500;
let history = read('history', []);

export function getHistory() {
  return history;
}

/** Adds an entry unless it repeats the latest one. Returns the stored entry. */
export function addHistory({ source, translation, from, to, origin, favorite = false }) {
  const last = history[0];
  if (last && last.source === source && last.translation === translation && last.to === to) {
    if (favorite) last.favorite = true;
    write('history', history);
    return last;
  }
  const entry = { id: crypto.randomUUID?.() ?? String(Date.now() + Math.random()), source, translation, from, to, origin, favorite, at: Date.now() };
  history.unshift(entry);
  // Keep favorites even when trimming old history.
  if (history.length > MAX_HISTORY) {
    const keep = history.slice(0, MAX_HISTORY);
    const favorites = history.slice(MAX_HISTORY).filter((h) => h.favorite);
    history = keep.concat(favorites);
  }
  write('history', history);
  return entry;
}

export function updateHistory(id, patch) {
  const entry = history.find((h) => h.id === id);
  if (entry) Object.assign(entry, patch);
  write('history', history);
  return entry;
}

export function deleteHistory(id) {
  history = history.filter((h) => h.id !== id);
  write('history', history);
}

export function clearHistory({ keepFavorites }) {
  history = keepFavorites ? history.filter((h) => h.favorite) : [];
  write('history', history);
}

// ---- Phrasebook translations, cached per language so they load instantly offline ----
export function getPhraseCache(code) {
  return read(`phrases2-${code}`, {});
}
export function setPhraseCache(code, map) {
  write(`phrases2-${code}`, map);
}

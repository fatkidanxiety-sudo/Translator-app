// Languages Parlivo can translate offline.
//
// Translation uses Mozilla's Firefox Translations models (Bergamot). Every language has a model
// to and from English; other pairs go through English automatically (Spanish → English → Japanese).

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', model: 'en', tess: 'eng', whisper: 'english', bcp47: 'en-US', script: 'Latin' },
  { code: 'ar', name: 'Arabic', native: 'العربية', model: 'ar', tess: 'ara', whisper: 'arabic', bcp47: 'ar-SA', rtl: true, script: 'Arabic' },
  { code: 'zh', name: 'Chinese (Simplified)', native: '简体中文', model: 'zh-Hans', tess: 'chi_sim', whisper: 'chinese', bcp47: 'zh-CN', noSpaces: true, script: 'Han' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', native: '繁體中文', model: 'zh-Hant', tess: 'chi_tra', whisper: 'chinese', bcp47: 'zh-TW', noSpaces: true, script: 'Han' },
  { code: 'cs', name: 'Czech', native: 'Čeština', model: 'cs', tess: 'ces', whisper: 'czech', bcp47: 'cs-CZ', script: 'Latin' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', model: 'nl', tess: 'nld', whisper: 'dutch', bcp47: 'nl-NL', script: 'Latin' },
  { code: 'fr', name: 'French', native: 'Français', model: 'fr', tess: 'fra', whisper: 'french', bcp47: 'fr-FR', script: 'Latin' },
  { code: 'de', name: 'German', native: 'Deutsch', model: 'de', tess: 'deu', whisper: 'german', bcp47: 'de-DE', script: 'Latin' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά', model: 'el', tess: 'ell', whisper: 'greek', bcp47: 'el-GR', script: 'Greek' },
  { code: 'he', name: 'Hebrew', native: 'עברית', model: 'he', tess: 'heb', whisper: 'hebrew', bcp47: 'he-IL', rtl: true, script: 'Hebrew' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', model: 'hi', tess: 'hin', whisper: 'hindi', bcp47: 'hi-IN', script: 'Devanagari' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', model: 'id', tess: 'ind', whisper: 'indonesian', bcp47: 'id-ID', script: 'Latin' },
  { code: 'it', name: 'Italian', native: 'Italiano', model: 'it', tess: 'ita', whisper: 'italian', bcp47: 'it-IT', script: 'Latin' },
  { code: 'ja', name: 'Japanese', native: '日本語', model: 'ja', tess: 'jpn', whisper: 'japanese', bcp47: 'ja-JP', noSpaces: true, script: 'Japanese' },
  { code: 'ko', name: 'Korean', native: '한국어', model: 'ko', tess: 'kor', whisper: 'korean', bcp47: 'ko-KR', script: 'Hangul' },
  { code: 'fa', name: 'Persian', native: 'فارسی', model: 'fa', tess: 'fas', whisper: 'persian', bcp47: 'fa-IR', rtl: true, script: 'Arabic' },
  { code: 'pl', name: 'Polish', native: 'Polski', model: 'pl', tess: 'pol', whisper: 'polish', bcp47: 'pl-PL', script: 'Latin' },
  { code: 'pt', name: 'Portuguese', native: 'Português', model: 'pt', tess: 'por', whisper: 'portuguese', bcp47: 'pt-PT', script: 'Latin' },
  { code: 'ro', name: 'Romanian', native: 'Română', model: 'ro', tess: 'ron', whisper: 'romanian', bcp47: 'ro-RO', script: 'Latin' },
  { code: 'ru', name: 'Russian', native: 'Русский', model: 'ru', tess: 'rus', whisper: 'russian', bcp47: 'ru-RU', script: 'Cyrillic' },
  { code: 'es', name: 'Spanish', native: 'Español', model: 'es', tess: 'spa', whisper: 'spanish', bcp47: 'es-ES', script: 'Latin' },
  { code: 'sv', name: 'Swedish', native: 'Svenska', model: 'sv', tess: 'swe', whisper: 'swedish', bcp47: 'sv-SE', script: 'Latin' },
  { code: 'th', name: 'Thai', native: 'ไทย', model: 'th', tess: 'tha', whisper: 'thai', bcp47: 'th-TH', noSpaces: true, script: 'Thai' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', model: 'tr', tess: 'tur', whisper: 'turkish', bcp47: 'tr-TR', script: 'Latin' },
  { code: 'uk', name: 'Ukrainian', native: 'Українська', model: 'uk', tess: 'ukr', whisper: 'ukrainian', bcp47: 'uk-UA', script: 'Cyrillic' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', model: 'vi', tess: 'vie', whisper: 'vietnamese', bcp47: 'vi-VN', script: 'Latin' },
];

const BY_CODE = new Map(LANGUAGES.map((l) => [l.code, l]));
export const lang = (code) => BY_CODE.get(code);
export const isSupported = (code) => BY_CODE.has(code);

/** The language codes that aren't English. Each is downloaded as one "language pack". */
export const PACK_CODES = LANGUAGES.filter((l) => l.code !== 'en').map((l) => l.code);

/** Model pairs (registry keys, e.g. "en-zh-Hans") in a language pack: to and from English. */
export function packPairs(code) {
  if (code === 'en') return [];
  const m = lang(code).model;
  return [`en-${m}`, `${m}-en`];
}

/** Model pairs needed to translate `src` → `tgt` (through English if neither is English). */
export function routePairs(src, tgt) {
  if (src === tgt) return [];
  const a = lang(src).model;
  const b = lang(tgt).model;
  if (src === 'en' || tgt === 'en') return [`${a}-${b}`];
  return [`${a}-en`, `en-${b}`];
}

/** Language packs (codes) needed for `src` → `tgt`. */
export function packsFor(src, tgt) {
  return [src, tgt].filter((c) => c !== 'en' && c !== undefined && src !== tgt);
}

export const SPEECH_MODEL = 'Xenova/whisper-base';
export const SPEECH_MODEL_MB = 80;

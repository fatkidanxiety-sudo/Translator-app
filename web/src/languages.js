// Languages the app can translate, and which on-device models connect them.
//
// Every model is an Opus-MT model converted for the browser (Hugging Face "Xenova/opus-mt-*").
// Pairs without a direct model go through English: Spanish → English → Japanese, etc.

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', tess: 'eng', whisper: 'english', bcp47: 'en-US' },
  { code: 'af', name: 'Afrikaans', native: 'Afrikaans', tess: 'afr', whisper: 'afrikaans', bcp47: 'af-ZA' },
  { code: 'ar', name: 'Arabic', native: 'العربية', tess: 'ara', whisper: 'arabic', bcp47: 'ar-SA', rtl: true },
  { code: 'zh', name: 'Chinese', native: '中文', tess: 'chi_sim', whisper: 'chinese', bcp47: 'zh-CN', noSpaces: true },
  { code: 'cs', name: 'Czech', native: 'Čeština', tess: 'ces', whisper: 'czech', bcp47: 'cs-CZ' },
  { code: 'da', name: 'Danish', native: 'Dansk', tess: 'dan', whisper: 'danish', bcp47: 'da-DK' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', tess: 'nld', whisper: 'dutch', bcp47: 'nl-NL' },
  { code: 'et', name: 'Estonian', native: 'Eesti', tess: 'est', whisper: 'estonian', bcp47: 'et-EE' },
  { code: 'fi', name: 'Finnish', native: 'Suomi', tess: 'fin', whisper: 'finnish', bcp47: 'fi-FI' },
  { code: 'fr', name: 'French', native: 'Français', tess: 'fra', whisper: 'french', bcp47: 'fr-FR' },
  { code: 'de', name: 'German', native: 'Deutsch', tess: 'deu', whisper: 'german', bcp47: 'de-DE' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', tess: 'hin', whisper: 'hindi', bcp47: 'hi-IN' },
  { code: 'hu', name: 'Hungarian', native: 'Magyar', tess: 'hun', whisper: 'hungarian', bcp47: 'hu-HU' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', tess: 'ind', whisper: 'indonesian', bcp47: 'id-ID' },
  { code: 'it', name: 'Italian', native: 'Italiano', tess: 'ita', whisper: 'italian', bcp47: 'it-IT' },
  { code: 'ja', name: 'Japanese', native: '日本語', tess: 'jpn', whisper: 'japanese', bcp47: 'ja-JP', noSpaces: true },
  { code: 'ko', name: 'Korean', native: '한국어', tess: 'kor', whisper: 'korean', bcp47: 'ko-KR' },
  { code: 'pl', name: 'Polish', native: 'Polski', tess: 'pol', whisper: 'polish', bcp47: 'pl-PL' },
  { code: 'ro', name: 'Romanian', native: 'Română', tess: 'ron', whisper: 'romanian', bcp47: 'ro-RO' },
  { code: 'ru', name: 'Russian', native: 'Русский', tess: 'rus', whisper: 'russian', bcp47: 'ru-RU' },
  { code: 'es', name: 'Spanish', native: 'Español', tess: 'spa', whisper: 'spanish', bcp47: 'es-ES' },
  { code: 'sv', name: 'Swedish', native: 'Svenska', tess: 'swe', whisper: 'swedish', bcp47: 'sv-SE' },
  { code: 'th', name: 'Thai', native: 'ไทย', tess: 'tha', whisper: 'thai', bcp47: 'th-TH', noSpaces: true },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', tess: 'tur', whisper: 'turkish', bcp47: 'tr-TR' },
  { code: 'uk', name: 'Ukrainian', native: 'Українська', tess: 'ukr', whisper: 'ukrainian', bcp47: 'uk-UA' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', tess: 'vie', whisper: 'vietnamese', bcp47: 'vi-VN' },
  { code: 'xh', name: 'Xhosa', native: 'isiXhosa', tess: null, whisper: null, bcp47: 'xh-ZA' },
];

const BY_CODE = new Map(LANGUAGES.map((l) => [l.code, l]));
export const lang = (code) => BY_CODE.get(code);

// Every model that exists, as "source-target" → Hugging Face model id.
const PAIRS = [
  // English ↔ X
  'en-af', 'af-en', 'en-ar', 'ar-en', 'en-zh', 'zh-en', 'en-cs', 'cs-en', 'en-da', 'da-en',
  'en-nl', 'nl-en', 'en-fi', 'fi-en', 'en-fr', 'fr-en', 'en-de', 'de-en', 'en-hi', 'hi-en',
  'en-hu', 'hu-en', 'en-id', 'id-en', 'en-it', 'it-en', 'en-ru', 'ru-en', 'en-es', 'es-en',
  'en-sv', 'sv-en', 'en-uk', 'uk-en', 'en-vi', 'vi-en', 'en-xh', 'xh-en',
  // Into English only
  'et-en', 'ja-en', 'ko-en', 'pl-en', 'th-en', 'tr-en',
  // From English only
  'en-ro',
  // Direct pairs that skip the English step (better quality, smaller download)
  'de-es', 'de-fr', 'es-de', 'es-fr', 'es-it', 'es-ru', 'fr-de', 'fr-es', 'fr-ro', 'fr-ru',
  'it-es', 'it-fr', 'ru-es', 'ru-fr', 'ru-uk', 'uk-ru', 'nl-fr', 'da-de', 'fi-de',
];

const MODEL_OVERRIDES = { 'tr-en': 'Xenova/opus-mt-tc-big-tr-en' };

export const MODELS = new Map(PAIRS.map((p) => [p, MODEL_OVERRIDES[p] ?? `Xenova/opus-mt-${p}`]));

/** Approximate download size of one translation direction, in MB. */
export const modelSizeMB = (pair) => (pair === 'tr-en' ? 300 : 115);

export const SPEECH_MODEL = 'Xenova/whisper-base';
export const SPEECH_MODEL_MB = 80;

/**
 * The models needed to go from `src` to `tgt`, in order.
 * Returns [] for the same language, or null if there's no way to do it offline.
 */
export function route(src, tgt) {
  if (src === tgt) return [];
  const direct = `${src}-${tgt}`;
  if (MODELS.has(direct)) return [direct];
  const a = `${src}-en`;
  const b = `en-${tgt}`;
  if (MODELS.has(a) && MODELS.has(b)) return [a, b];
  return null;
}

export const canTranslate = (src, tgt) => route(src, tgt) !== null;

/** Models to download so a language works in both directions with English. */
export function packFor(code) {
  if (code === 'en') return [];
  return [`en-${code}`, `${code}-en`].filter((p) => MODELS.has(p));
}

/** Human description of what a language pack covers. */
export function packDirections(code) {
  const into = MODELS.has(`en-${code}`);
  const from = MODELS.has(`${code}-en`);
  if (into && from) return 'both directions';
  if (from) return 'into English only';
  if (into) return 'from English only';
  return 'not available';
}

// Fixes words the camera misread, using each language's 50,000 most common words plus food,
// wine and label vocabulary. Only words the camera was unsure about are touched, and only when a
// real word is very close — tuned for photo-reading slips: look-alike letters (f/t, l/i, c/e…),
// missing thin letters ("rcetta" → "ricetta", "botigia" → "bottiglia") and wrong accents.

import { getDictWords } from './models.js';

// Words subtitles rarely contain but menus, labels and signs do.
const EXTRA = {
  it: `trattoria osteria enoteca pizzeria frantoio frantoi salumi salume salumeria pici pecorino pecorini gnocchi zafferano cinghiale chianina
    maltagliati aglione ragù mantecati mantecato mantecata antipasti antipasto primi secondi contorni contorno dolci coperto bruschetta bruschette
    crostini pappardelle tagliatelle tagliolini ravioli tortellini lasagne risotto polenta prosciutto mozzarella parmigiano burrata tiramisù
    cantucci chianti brunello montepulciano bistecca fiorentina porchetta ribollita pappa pomodoro pomodori carciofi funghi porcini tartufo
    tartufato olio extravergine biologica biologico filtrato spremitura spremuto molitura oliva olive ottenuto mediante procedimenti meccanici
    estratto freddo comunitario categoria superiore bottiglia confezionato imbottigliato scadenza consumarsi preferibilmente entro lotto
    ingredienti allergeni conservare luogo fresco asciutto valori nutrizionali energia grassi saturi carboidrati zuccheri proteine sale
    fibre acqua minerale naturale frizzante gassata vino rosso bianco rosato spumante prosecco grappa limoncello amaro digestivo caffè
    cornetto brioche panino tramezzino focaccia schiacciata gelato gelateria pasticceria panificio forno macelleria alimentari tabacchi
    farmacia uscita ingresso entrata spingere tirare vietato divieto sosta parcheggio fermata binario biglietteria convalidare obliterare
    tagliere affettati formaggi formaggio miele marmellata confettura crudo cotto stagionato stagionatura nostrani nostrano
    casereccio casereccia fatto mano abbattuta cucina sugo salsiccia salsicce peperoncino aglio cipolla basilico rosmarino salvia
    orcia valdichiana barolo barbaresco amarone valpolicella primitivo nero d'avola vermentino negroni aperol spritz bellini campari
    toscana umbria liguria sicilia sardegna puglia campania piemonte veneto lombardia firenze siena pisa lucca roma napoli venezia milano`,
  es: 'tapas carta entrantes primeros segundos postres bebidas plato platos jamón ibérico chorizo paella gazpacho tortilla croquetas aceite oliva virgen extra salida entrada empujar tirar prohibido',
  fr: 'entrées plats desserts boissons fromage fromages charcuterie baguette croissant crêpe galette huile olive vierge sortie entrée poussez tirez interdit',
  de: 'speisekarte vorspeisen hauptgerichte nachspeisen getränke schnitzel bratwurst brezel olivenöl ausgang eingang drücken ziehen verboten',
  pt: 'entradas pratos sobremesas bebidas bacalhau pastel nata azeite virgem saída entrada empurre puxe proibido',
  en: 'homemade starters mains desserts drinks sides extra virgin olive oil organic cold pressed unfiltered',
};

const dictionaries = new Map(); // code → Promise<dictionary | null>
const strip = (s) => s.normalize('NFD').replace(/\p{M}/gu, '');

// Pairs of letters the camera confuses.
const LOOKALIKE = new Map();
for (const pair of ['ft', 'li', 'l1', 'ij', 'ce', 'oa', 'uv', 'nh', 'bh', 'gq', 'mn', 'rn', 'oc', 'tl', 'fl', 'kx', 'eo', 'ir', 'cg', 'ao']) {
  const [a, b] = pair;
  if (!LOOKALIKE.has(a)) LOOKALIKE.set(a, new Set());
  if (!LOOKALIKE.has(b)) LOOKALIKE.set(b, new Set());
  LOOKALIKE.get(a).add(b);
  LOOKALIKE.get(b).add(a);
}
const THIN = new Set(['i', 'l', 't', 'r', 'f', 'j']);

// Reused buffers so checking 50,000 words doesn't allocate.
let prevRow = new Float32Array(64);
let curRow = new Float32Array(64);

/** Weighted edit distance between two words (and their accent-free forms); stops once over `limit`. */
function distance(a, aBase, b, bBase, limit) {
  const n = a.length;
  const m = b.length;
  if (m + 1 > prevRow.length) {
    prevRow = new Float32Array(m + 1);
    curRow = new Float32Array(m + 1);
  }
  let prev = prevRow;
  let cur = curRow;
  prev[0] = 0;
  for (let j = 1; j <= m; j++) prev[j] = prev[j - 1] + (THIN.has(b[j - 1]) ? 0.55 : 1);
  for (let i = 1; i <= n; i++) {
    const ca = a[i - 1];
    const delA = THIN.has(ca) ? 0.55 : 1;
    cur[0] = prev[0] + delA;
    let rowMin = cur[0];
    for (let j = 1; j <= m; j++) {
      const cb = b[j - 1];
      let sub;
      if (ca === cb) sub = 0;
      else if (aBase[i - 1] === bBase[j - 1]) sub = 0.25; // accent misread
      else if (LOOKALIKE.get(ca)?.has(cb)) sub = 0.45;
      else sub = 1;
      let v = prev[j - 1] + sub;
      const del = prev[j] + delA;
      if (del < v) v = del;
      const ins = cur[j - 1] + (THIN.has(cb) ? 0.55 : 1);
      if (ins < v) v = ins;
      cur[j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > limit) return Infinity;
    const t = prev;
    prev = cur;
    cur = t;
  }
  return prev[m];
}

function build(words, extra = '') {
  const all = [...extra.split(/\s+/).filter(Boolean), ...words];
  const set = new Set(all);
  const baseToWord = new Map();
  const byLength = new Map();
  all.forEach((word, rank) => {
    const base = strip(word);
    if (!baseToWord.has(base)) baseToWord.set(base, word);
    if (word.length < 3 || base.length !== word.length || /['’-]/.test(word)) return;
    if (!byLength.has(word.length)) byLength.set(word.length, []);
    byLength.get(word.length).push({ word, base, rank });
  });
  return { set, baseToWord, byLength };
}

export function loadDictionary(code) {
  if (!dictionaries.has(code)) {
    dictionaries.set(
      code,
      getDictWords(code)
        .then((words) => (words ? build(words, EXTRA[code]) : null))
        .catch(() => null),
    );
  }
  return dictionaries.get(code);
}

function matchCase(original, word) {
  if (original.length > 1 && original === original.toUpperCase() && original !== original.toLowerCase()) return word.toUpperCase();
  if (original[0] === original[0].toUpperCase() && original[0] !== original[0].toLowerCase()) return word[0].toUpperCase() + word.slice(1);
  return word;
}

/** The closest real word to `token`, or `token` itself if nothing is close enough. */
export function correctWord(token, dict, strict = false) {
  const lower = token.toLowerCase();
  if (lower.length < 3 || dict.set.has(lower)) return token;
  const base = strip(lower);
  const accentFix = dict.baseToWord.get(base);
  if (accentFix) return matchCase(token, accentFix); // only the accents were off
  // Strict (the camera was sure of the letters): only long, non-name words, and only a couple of
  // look-alike swaps ("fraftoria" → "trattoria"). Capitalized words are probably names: leave them.
  if (strict) {
    const titleCase = token[0] !== token[0].toLowerCase() && token.slice(1) === token.slice(1).toLowerCase();
    if (lower.length < 8 || titleCase) return token;
  }
  const limit = strict ? 0.95 : lower.length <= 4 ? 0.9 : lower.length <= 7 ? 1.3 : 1.9;
  let best = null;
  for (let len = lower.length - 2; len <= lower.length + 2; len++) {
    for (const entry of dict.byLength.get(len) ?? []) {
      const d = distance(lower, base, entry.word, entry.base, limit);
      if (d > limit) continue;
      const score = d + entry.rank / 60000; // prefer common words when equally close
      if (!best || score < best.score) best = { word: entry.word, score };
    }
  }
  return best ? matchCase(token, best.word) : token;
}

/**
 * Corrects the words of a line the camera was unsure about.
 * `words` = [{ text, confidence }]. Returns the corrected line text (null without a word list).
 */
export function correctLine(words, dict, joiner = ' ') {
  if (!dict) return null;
  return words.map((w) => w.text.replace(/\p{L}+/gu, (token) => correctWord(token, dict, w.confidence >= 0.92))).join(joiner);
}

export { build as buildDictionary };

// On-device language detection.
// 1. Unicode script (Japanese, Korean, Chinese, Thai, Arabic, Hindi, Cyrillic)
// 2. Common short words, which works well even for 3–4 word phrases
// 3. Trigram statistics (franc) as a fallback for longer text

import { francAll } from 'franc';

const ISO3_TO_CODE = {
  eng: 'en', afr: 'af', ces: 'cs', dan: 'da', nld: 'nl', est: 'et', fin: 'fi', fra: 'fr',
  deu: 'de', hun: 'hu', ind: 'id', ita: 'it', pol: 'pl', ron: 'ro', spa: 'es', swe: 'sv',
  tur: 'tr', vie: 'vi', xho: 'xh', rus: 'ru', ukr: 'uk',
};
const LATIN_ISO3 = Object.keys(ISO3_TO_CODE).filter((k) => !['rus', 'ukr'].includes(k));

const STOPWORDS = {
  en: 'the a an is are was were be i you he she it we they my your this that what where when how why who which please thank thanks would could can do does not and or of to in on for with from at have has will hello hi yes no me us there here like want need much many good morning evening night sorry excuse bye goodbye ok okay nice meet',
  es: 'el la los las un una es son está están estoy yo tú usted él ella nosotros por favor gracias qué dónde cuándo cómo porque quién de del en con para sin y o no sí hola muy quiero tengo hay mi su lo le se',
  fr: 'le la les un une des est sont suis je tu vous il elle nous ils merci bonjour oui non que qui où quand comment pourquoi de du en avec pour sans et ou pas très je veux ai il y a mon ma mes ce cette',
  de: 'der die das ein eine ist sind bin ich du sie er wir ihr danke bitte hallo ja nein was wo wann wie warum wer von zu mit für ohne und oder nicht sehr ich möchte habe gibt es mein dein auf im den dem',
  it: 'il lo la gli le un una è sono sto io tu lei lui noi voi grazie per favore ciao sì no che chi dove quando come perché di del da in con per senza e o non molto voglio ho c\'è mio mia',
  nl: 'de het een is zijn ben ik jij je u hij zij wij dank bedankt alstublieft hallo ja nee wat waar wanneer hoe waarom wie van naar met voor zonder en of niet heel wil heb er mijn',
  da: 'den det en et er var jeg du han hun vi de tak hej ja nej hvad hvor hvornår hvordan hvorfor hvem af til med for uden og eller ikke meget vil har der min',
  sv: 'den det en ett är var jag du han hon vi de tack hej ja nej vad var när hur varför vem av till med för utan och eller inte mycket vill har finns min',
  pl: 'jest są jestem ja ty on ona my wy dziękuję proszę cześć tak nie co gdzie kiedy jak dlaczego kto z do w na dla bez i lub bardzo chcę mam mój moja to się',
  cs: 'je jsou jsem já ty on ona my vy děkuji prosím ahoj ano ne co kde kdy jak proč kdo z do v na pro bez a nebo velmi chci mám můj moje to se',
  ro: 'este sunt eu tu el ea noi voi mulțumesc vă rog bună da nu ce unde când cum de ce cine din la în cu pentru fără și sau foarte vreau am meu mea',
  tr: 'bir bu şu ve ile için ben sen o biz siz onlar teşekkür ederim lütfen merhaba evet hayır ne nerede ne zaman nasıl neden kim çok istiyorum var değil mi',
  id: 'yang ini itu adalah saya anda kamu dia kami mereka terima kasih tolong halo ya tidak apa di mana kapan bagaimana mengapa siapa dari ke dengan untuk tanpa dan atau sangat mau ada',
  vi: 'là của tôi bạn anh chị em chúng cảm ơn xin chào vâng không gì đâu khi nào thế nào tại sao ai từ đến với cho và hoặc rất muốn có này đó',
  fi: 'on ovat olen minä sinä hän me te he kiitos ole hyvä hei kyllä ei mitä missä milloin miten miksi kuka ja tai hyvin haluan minulla',
  hu: 'a az egy van vagyok én te ő mi ti ők köszönöm kérem szia igen nem mit hol mikor hogyan miért ki és vagy nagyon szeretnék nekem',
  af: 'die is was ek jy hy sy ons hulle dankie asseblief hallo ja nee wat waar wanneer hoe hoekom wie van na met vir sonder en of nie baie wil het daar my',
  et: 'on olen mina sina tema meie teie nemad aitäh palun tere jah ei mis kus millal kuidas miks kes ja või väga tahan mul',
};
const STOP_SETS = Object.fromEntries(Object.entries(STOPWORDS).map(([code, words]) => [code, new Set(words.split(/\s+/))]));

const CYRILLIC_STOP = {
  ru: new Set('где что как это и я ты он она мы вы они спасибо пожалуйста привет да нет хочу есть мне сколько стоит здравствуйте'.split(' ')),
  uk: new Set('де що як це і та я ти він вона ми ви вони дякую будь ласка привіт так ні хочу є мені скільки коштує вітаю'.split(' ')),
};

/** Languages whose common words appear most often in `text` (several if tied). */
function byStopwords(text, sets = STOP_SETS) {
  const words = text.toLowerCase().match(/[\p{L}']+/gu) ?? [];
  if (!words.length) return [];
  const scores = Object.entries(sets).map(([code, set]) => [code, words.reduce((n, w) => n + (set.has(w) ? 1 : 0), 0)]);
  const top = Math.max(...scores.map(([, n]) => n));
  return top > 0 ? scores.filter(([, n]) => n === top).map(([code]) => code) : [];
}

const CODE_TO_ISO3 = Object.fromEntries(Object.entries(ISO3_TO_CODE).map(([iso, code]) => [code, iso]));

/** Picks among `codes` using trigram statistics. */
function breakTie(sample, codes) {
  const [[iso]] = francAll(sample, { only: codes.map((c) => CODE_TO_ISO3[c]), minLength: 1 });
  return ISO3_TO_CODE[iso] ?? codes[0];
}

/** Returns a language code such as "es", or null if it can't tell. */
export function detectLanguage(text) {
  const sample = text.trim().slice(0, 600);
  if (!sample) return null;

  if (/[぀-ヿ]/.test(sample)) return 'ja'; // Hiragana / Katakana
  if (/[가-힯ᄀ-ᇿ]/.test(sample)) return 'ko'; // Hangul
  if (/[一-鿿]/.test(sample)) return 'zh'; // Han without kana
  if (/[฀-๿]/.test(sample)) return 'th';
  if (/[؀-ۿ]/.test(sample)) return 'ar';
  if (/[ऀ-ॿ]/.test(sample)) return 'hi';

  if (/[Ѐ-ӿ]/.test(sample)) {
    if (/[ієїґ]/i.test(sample)) return 'uk';
    if (/[ыэъё]/i.test(sample)) return 'ru';
    const hits = byStopwords(sample, CYRILLIC_STOP);
    if (hits.length === 1) return hits[0];
    return breakTie(sample, ['ru', 'uk']);
  }

  // Letters only some languages use settle it quickly.
  if (/[ñ¿¡]/i.test(sample)) return 'es';
  if (/[ß]/.test(sample)) return 'de';
  if (/[ăâîșşțţ]/i.test(sample) && /[șşțţă]/i.test(sample)) return 'ro';
  if (/[ąęłńśźż]/i.test(sample)) return 'pl';
  if (/[ěřůčšž]/i.test(sample) && /[ěřů]/i.test(sample)) return 'cs';
  if (/[őű]/i.test(sample)) return 'hu';
  if (/[ğış]/i.test(sample)) return 'tr';
  if (/[ơưđ]/i.test(sample) || /[ạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i.test(sample)) return 'vi';

  const hits = byStopwords(sample);
  const words = hits.length === 1 ? hits[0] : hits.length > 1 ? breakTie(sample, hits) : null;
  const longEnough = sample.length >= 40;
  if (words && !longEnough) return words;

  const ranked = francAll(sample, { only: LATIN_ISO3, minLength: 3 });
  const [topIso, topScore] = ranked[0];
  if (topIso === 'und') return words;
  // For longer text trust the statistics, unless the word check strongly disagrees.
  if (words && words !== ISO3_TO_CODE[topIso]) {
    const wordsScore = ranked.find(([iso]) => ISO3_TO_CODE[iso] === words)?.[1] ?? 0;
    if (wordsScore > topScore * 0.9) return words;
  }
  return ISO3_TO_CODE[topIso] ?? words;
}

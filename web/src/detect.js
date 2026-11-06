// On-device language detection.
// 1. Unicode script (Japanese, Korean, Chinese, Thai, Arabic/Persian, Hebrew, Greek, Hindi, Cyrillic)
// 2. Common short words, which works well even for 3–4 word phrases
// 3. Trigram statistics (franc) as a fallback for longer text

import { francAll } from 'franc';

const ISO3_TO_CODE = {
  eng: 'en', ces: 'cs', nld: 'nl', fra: 'fr', deu: 'de', ind: 'id', ita: 'it', pol: 'pl',
  por: 'pt', ron: 'ro', spa: 'es', swe: 'sv', tur: 'tr', vie: 'vi', rus: 'ru', ukr: 'uk',
};
const CODE_TO_ISO3 = Object.fromEntries(Object.entries(ISO3_TO_CODE).map(([iso, code]) => [code, iso]));
const LATIN_ISO3 = Object.keys(ISO3_TO_CODE).filter((k) => !['rus', 'ukr'].includes(k));

const STOPWORDS = {
  en: 'the a an is are was were be i you he she it we they my your this that what where when how why who which please thank thanks would could can do does not and or of to in on for with from at have has will hello hi yes no me us there here like want need much many good morning evening night sorry excuse bye goodbye ok okay nice meet exit entrance open closed water push pull danger caution warning toilet toilets restroom smoking parking free sale homemade fresh cheese sauce soup day meat fish chicken beef pork wine salad bread dessert cake cream potato potatoes garlic tomato egg eggs local selection cured wild boar little chilli starter starters main course side dish dishes menu served daily grilled roasted fried baked rice beans vegetables vegetable',
  es: 'el la los las un una es son está están estoy yo tú usted él ella nosotros por favor gracias qué dónde cuándo cómo porque quién de del en con para sin y o no sí hola muy quiero tengo hay mi su lo le se buenos buenas días noches salida entrada abierto cerrado agua empujar tirar peligro atención aviso baño baños prohibido fumar aparcamiento gratis rebajas restaurante bar tapas carta vino entrantes primeros segundos postres bebidas plato platos del de la con',
  pt: 'o a os as um uma é são está estão estou eu você ele ela nós por favor obrigado obrigada que onde quando como porque quem de do da em com para sem e ou não sim olá muito quero tenho há meu minha bom boa dia noite saída entrada aberto fechado água empurre puxe perigo atenção aviso banheiro proibido fumar estacionamento grátis',
  fr: 'le la les un une des est sont suis je tu vous il elle nous ils merci bonjour oui non que qui où quand comment pourquoi de du en avec pour sans et ou pas très veux ai il y a mon ma mes ce cette sortie entrée ouvert fermé eau poussez tirez danger attention toilettes interdit fumer stationnement gratuit soldes restaurant brasserie boulangerie vin carte entrées plats desserts boissons du des au aux',
  de: 'der die das ein eine ist sind bin ich du sie er wir ihr danke bitte hallo ja nein was wo wann wie warum wer von zu mit für ohne und oder nicht sehr möchte habe gibt es mein dein auf im den dem ausgang eingang geöffnet geschlossen wasser drücken ziehen gefahr achtung vorsicht toiletten verboten rauchen parken frei',
  it: 'il lo la gli le un una è sono sto io tu lei lui noi voi grazie per favore ciao sì no che chi dove quando come perché di del da in con per senza e o non molto voglio ho c\'è mio mia buongiorno buonasera uscita entrata ingresso aperto chiuso acqua naturale frizzante spingere tirare pericolo attenzione bagno bagni vietato fumare divieto parcheggio gratuito saldi nostro impegno trattoria ristorante osteria pizzeria enoteca vino vini menù antipasti antipasto primi secondi contorni dolci bevande piatti piatto coperto servizio della dello degli delle alla allo alle sugo ragù',
  nl: 'de het een is zijn ben ik jij je u hij zij wij dank bedankt alstublieft hallo ja nee wat waar wanneer hoe waarom wie van naar met voor zonder en of niet heel wil heb er mijn uitgang ingang gesloten water duwen trekken gevaar toiletten verboden roken parkeren gratis',
  sv: 'den det en ett är var jag du han hon vi de tack hej ja nej vad när hur varför vem av till med för utan och eller inte mycket vill har finns min',
  pl: 'jest są jestem ja ty on ona my wy dziękuję proszę cześć tak nie co gdzie kiedy jak dlaczego kto z do w na dla bez i lub bardzo chcę mam mój moja to się',
  cs: 'je jsou jsem já ty on ona my vy děkuji prosím ahoj ano ne co kde kdy jak proč kdo z do v na pro bez a nebo velmi chci mám můj moje to se',
  ro: 'este sunt eu tu el ea noi voi mulțumesc vă rog bună da nu ce unde când cum de ce cine din la în cu pentru fără și sau foarte vreau am meu mea',
  tr: 'bir bu şu ve ile için ben sen o biz siz onlar teşekkür ederim lütfen merhaba evet hayır ne nerede ne zaman nasıl neden kim çok istiyorum var değil mi',
  id: 'yang ini itu adalah saya anda kamu dia kami mereka terima kasih tolong halo ya tidak apa di mana kapan bagaimana mengapa siapa dari ke dengan untuk tanpa dan atau sangat mau ada',
  vi: 'là của tôi bạn anh chị em chúng cảm ơn xin chào vâng không gì đâu khi nào thế nào tại sao ai từ đến với cho và hoặc rất muốn có này đó',
};
const STOP_SETS = Object.fromEntries(Object.entries(STOPWORDS).map(([code, words]) => [code, new Set(words.split(/\s+/))]));
const CYRILLIC_STOP = {
  ru: new Set('где что как это и я ты он она мы вы они спасибо пожалуйста привет да нет хочу есть мне сколько стоит здравствуйте'.split(' ')),
  uk: new Set('де що як це і та я ти він вона ми ви вони дякую будь ласка привіт так ні хочу є мені скільки коштує вітаю'.split(' ')),
};
// Characters that only appear in Traditional Chinese.
const TRADITIONAL = /[們這說國會來時個為學對還開關車東長門見電話氣點書買賣錢飯館號樓醫藥雞魚鳥馬語誰嗎沒謝讓請問廁]/;

/** Languages whose common words appear most often in `text` (several if tied). */
function byStopwords(text, sets = STOP_SETS) {
  const words = text.toLowerCase().match(/[\p{L}']+/gu) ?? [];
  if (!words.length) return [];
  const scores = Object.entries(sets).map(([code, set]) => [code, words.reduce((n, w) => n + (set.has(w) ? 1 : 0), 0)]);
  const top = Math.max(...scores.map(([, n]) => n));
  return top > 0 ? scores.filter(([, n]) => n === top).map(([code]) => code) : [];
}

/** Picks among `codes` using trigram statistics. */
function breakTie(sample, codes) {
  const [[iso]] = francAll(sample, { only: codes.map((c) => CODE_TO_ISO3[c]).filter(Boolean), minLength: 1 });
  return ISO3_TO_CODE[iso] ?? codes[0];
}

/** Returns an app language code such as "es", or null if it can't tell. */
export function detectLanguage(text) {
  const sample = text.trim().slice(0, 600);
  if (!sample) return null;

  if (/[぀-ヿ]/.test(sample)) return 'ja'; // Hiragana / Katakana
  if (/[가-힯ᄀ-ᇿ]/.test(sample)) return 'ko'; // Hangul
  if (/[一-鿿]/.test(sample)) return TRADITIONAL.test(sample) ? 'zh-TW' : 'zh';
  if (/[฀-๿]/.test(sample)) return 'th';
  if (/[؀-ۿ]/.test(sample)) return /[پچژگکی]/.test(sample) ? 'fa' : 'ar';
  if (/[֐-׿]/.test(sample)) return 'he';
  if (/[Ͱ-Ͽ]/.test(sample)) return 'el';
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
  if (/[ãõ]/i.test(sample) || /\b(não|você|obrigad[oa])\b/i.test(sample)) return 'pt';
  if (/[ß]/.test(sample)) return 'de';
  if (/[șşțţă]/i.test(sample)) return 'ro';
  if (/[ąęłńśźż]/i.test(sample)) return 'pl';
  if (/[ěřů]/i.test(sample)) return 'cs';
  if (/[ğı]/.test(sample)) return 'tr';
  if (/[ơưđ]/i.test(sample) || /[ạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i.test(sample)) return 'vi';

  const hits = byStopwords(sample);
  const words = hits.length === 1 ? hits[0] : hits.length > 1 ? breakTie(sample, hits) : null;
  if (words && sample.length < 40) return words;

  const ranked = francAll(sample, { only: LATIN_ISO3, minLength: 3 });
  const [topIso, topScore] = ranked[0];
  if (topIso === 'und') return words;
  if (words && words !== ISO3_TO_CODE[topIso]) {
    const wordsScore = ranked.find(([iso]) => ISO3_TO_CODE[iso] === words)?.[1] ?? 0;
    if (wordsScore > topScore * 0.9) return words;
  }
  return ISO3_TO_CODE[topIso] ?? words;
}

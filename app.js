/* ===================================================================
 *  Deck registry + data loading
 *  Card data lives in /data as JSON (loaded via fetch when served) with a
 *  .js global fallback (loaded via <script> injection) so the app also works
 *  when index.html is opened directly over file:// where fetch is blocked.
 * =================================================================== */
const DECK_DEFS = {
  hiragana: { file: "hiragana", type: "kana", script: "h", label: "Hiragana" },
  katakana: { file: "katakana", type: "kana", script: "k", label: "Katakana" },
  advanced: { file: "advanced", type: "kana", script: "h", label: "Advanced" },
  n5: { file: "n5-kanji", type: "kanji", label: "N5 Kanji", apiLevel: 5 },
  n4: { file: "n4-kanji", type: "kanji", label: "N4 Kanji", apiLevel: 4 },
  n3: { file: "n3-kanji", type: "kanji", label: "N3 Kanji", apiLevel: 3 },
  n2: { file: "n2-kanji", type: "kanji", label: "N2 Kanji", apiLevel: 2 },
  n1: { file: "n1-kanji", type: "kanji", label: "N1 Kanji", apiLevel: 1 },
  // N5 vocabulary decks (Jisho-sourced)
  n5vocab:   { file: "n5-vocabulary",    type: "vocab", label: "All N5 Vocabulary" },
  n5nouns:   { file: "n5-nouns",         type: "vocab", label: "N5 Nouns" },
  n5godan:   { file: "n5-verbs-godan",   type: "vocab", label: "N5 Godan Verbs" },
  n5ichidan: { file: "n5-verbs-ichidan", type: "vocab", label: "N5 Ichidan Verbs" },
  n5adji:    { file: "n5-adjectives-i",  type: "vocab", label: "N5 い-Adjectives" },
  n5adjna:   { file: "n5-adjectives-na", type: "vocab", label: "N5 な-Adjectives" },
  n5adverbs: { file: "n5-adverbs",       type: "vocab", label: "N5 Adverbs" },
  n5particles: { file: "n5-particles",   type: "vocab", label: "N5 Particles" },
  // N5 Numbers & Counters
  n5numbers:   { file: "n5-numbers",      type: "vocab", label: "N5 Basic Numbers" },
  n5datetime:  { file: "n5-datetime",     type: "vocab", label: "N5 Dates & Time" },
  n5counters:  { file: "n5-counters",     type: "vocab", label: "N5 Counters" },
  // N5 Phrases & Expressions
  n5greetings: { file: "n5-greetings",    type: "vocab", label: "N5 Greetings" },
  n5intro:     { file: "n5-introductions",type: "vocab", label: "N5 Introductions" },
  n5classroom: { file: "n5-classroom",    type: "vocab", label: "N5 Classroom Phrases" },
  n5shopping:  { file: "n5-shopping",     type: "vocab", label: "N5 Shopping Basics" },
  // N5 Grammar Patterns (study only — patterns make poor game targets)
  n5gramall:   { file: "n5-grammar-all",       type: "vocab", label: "All N5 Grammar", noGame: true },
  n5gramstruct:{ file: "n5-grammar-structure", type: "vocab", label: "N5 Sentence Structure", noGame: true },
  n5gramq:     { file: "n5-grammar-questions", type: "vocab", label: "N5 Question Forms", noGame: true },
  n5gramneg:   { file: "n5-grammar-negatives", type: "vocab", label: "N5 Negative Forms", noGame: true },
  // N4 vocabulary
  n4vocab:   { file: "n4-vocabulary",    type: "vocab", label: "All N4 Vocabulary" },
  n4nouns:   { file: "n4-nouns",         type: "vocab", label: "N4 Nouns" },
  n4godan:   { file: "n4-verbs-godan",   type: "vocab", label: "N4 Godan Verbs" },
  n4ichidan: { file: "n4-verbs-ichidan", type: "vocab", label: "N4 Ichidan Verbs" },
  n4adji:    { file: "n4-adjectives-i",  type: "vocab", label: "N4 い-Adjectives" },
  n4adjna:   { file: "n4-adjectives-na", type: "vocab", label: "N4 な-Adjectives" },
  n4adverbs: { file: "n4-adverbs",       type: "vocab", label: "N4 Adverbs" },
  // N4 grammar patterns, particles & phrases (study decks)
  n4gram:      { file: "n4-grammar-all",         type: "vocab", label: "All N4 Grammar", noGame: true },
  n4gramte:    { file: "n4-grammar-teform",      type: "vocab", label: "N4 Te-form Patterns", noGame: true },
  n4gramcond:  { file: "n4-grammar-conditional", type: "vocab", label: "N4 Conditional Forms", noGame: true },
  n4gramgive:  { file: "n4-grammar-giving",      type: "vocab", label: "N4 Giving & Receiving", noGame: true },
  n4partadv:   { file: "n4-particles-advanced",  type: "vocab", label: "N4 Advanced Particles", noGame: true },
  n4partcomp:  { file: "n4-particles-compound",  type: "vocab", label: "N4 Compound Particles", noGame: true },
  n4phrdaily:  { file: "n4-phrases-daily",       type: "vocab", label: "N4 Daily Conversation", noGame: true },
  n4phropinion:{ file: "n4-phrases-opinion",     type: "vocab", label: "N4 Expressing Opinions", noGame: true },
  n4phrrequest:{ file: "n4-phrases-request",     type: "vocab", label: "N4 Making Requests", noGame: true },
  // N4 verb forms (conjugation drills)
  n4verbte:  { file: "n4-verbs-teform",    type: "vocab", label: "N4 Te-form Verbs", noGame: true },
  n4verbta:  { file: "n4-verbs-taform",    type: "vocab", label: "N4 Ta-form Verbs", noGame: true },
  n4verbnai: { file: "n4-verbs-naiform",   type: "vocab", label: "N4 Nai-form Verbs", noGame: true },
  n4verbpot: { file: "n4-verbs-potential", type: "vocab", label: "N4 Potential Verbs", noGame: true },
  // N3 vocabulary
  n3vocab:   { file: "n3-vocabulary",    type: "vocab", label: "All N3 Vocabulary" },
  n3nouns:   { file: "n3-nouns",         type: "vocab", label: "N3 Nouns" },
  n3godan:   { file: "n3-verbs-godan",   type: "vocab", label: "N3 Godan Verbs" },
  n3ichidan: { file: "n3-verbs-ichidan", type: "vocab", label: "N3 Ichidan Verbs" },
  n3adji:    { file: "n3-adjectives-i",  type: "vocab", label: "N3 い-Adjectives" },
  n3adjna:   { file: "n3-adjectives-na", type: "vocab", label: "N3 な-Adjectives" },
  n3adverbs: { file: "n3-adverbs",       type: "vocab", label: "N3 Adverbs" },
  // N3 grammar, verb forms, keigo & phrases (study decks)
  n3gram:         { file: "n3-grammar-all",              type: "vocab", label: "All N3 Grammar", noGame: true },
  n3gramcompound: { file: "n3-grammar-compound",         type: "vocab", label: "N3 Compound Sentences", noGame: true },
  n3gramnuance:   { file: "n3-grammar-nuance",           type: "vocab", label: "N3 Expressing Nuance", noGame: true },
  n3verbpass:     { file: "n3-verbs-passive",            type: "vocab", label: "N3 Passive Form", noGame: true },
  n3verbcaus:     { file: "n3-verbs-causative",          type: "vocab", label: "N3 Causative Form", noGame: true },
  n3verbcauspass: { file: "n3-verbs-causative-passive",  type: "vocab", label: "N3 Causative-Passive", noGame: true },
  n3keigoteinei:  { file: "n3-keigo-teineigo",           type: "vocab", label: "N3 Teineigo (Polite)", noGame: true },
  n3keigohonor:   { file: "n3-keigo-honorifics",         type: "vocab", label: "N3 Basic Honorifics", noGame: true },
  n3phrformal:    { file: "n3-phrases-formal",           type: "vocab", label: "N3 Formal Conversation", noGame: true },
  n3phrfeelings:  { file: "n3-phrases-feelings",         type: "vocab", label: "N3 Expressing Feelings", noGame: true },
  n3phrconnect:   { file: "n3-phrases-connecting",       type: "vocab", label: "N3 Connecting Ideas", noGame: true },
  // N2 vocabulary
  n2vocab:   { file: "n2-vocabulary",    type: "vocab", label: "All N2 Vocabulary" },
  n2nouns:   { file: "n2-nouns",         type: "vocab", label: "N2 Nouns" },
  n2godan:   { file: "n2-verbs-godan",   type: "vocab", label: "N2 Godan Verbs" },
  n2ichidan: { file: "n2-verbs-ichidan", type: "vocab", label: "N2 Ichidan Verbs" },
  n2adji:    { file: "n2-adjectives-i",  type: "vocab", label: "N2 い-Adjectives" },
  n2adjna:   { file: "n2-adjectives-na", type: "vocab", label: "N2 な-Adjectives" },
  n2adverbs: { file: "n2-adverbs",       type: "vocab", label: "N2 Adverbs" },
  // N2 grammar, keigo & phrases (study decks)
  n2gram:          { file: "n2-grammar-all",      type: "vocab", label: "All N2 Grammar", noGame: true },
  n2gramcomplex:   { file: "n2-grammar-complex",  type: "vocab", label: "N2 Complex Structures", noGame: true },
  n2gramformal:    { file: "n2-grammar-formal",   type: "vocab", label: "N2 Formal Expressions", noGame: true },
  n2keigosonkeigo: { file: "n2-keigo-sonkeigo",   type: "vocab", label: "N2 Sonkeigo (Respectful)", noGame: true },
  n2keigokenjougo: { file: "n2-keigo-kenjougo",   type: "vocab", label: "N2 Kenjougo (Humble)", noGame: true },
  n2phrbusiness:   { file: "n2-phrases-business", type: "vocab", label: "N2 Business Conversation", noGame: true },
  n2phrwritten:    { file: "n2-phrases-written",  type: "vocab", label: "N2 Written Expression", noGame: true },
  // N1 vocabulary
  n1vocab:   { file: "n1-vocabulary",    type: "vocab", label: "All N1 Vocabulary" },
  n1nouns:   { file: "n1-nouns",         type: "vocab", label: "N1 Nouns" },
  n1godan:   { file: "n1-verbs-godan",   type: "vocab", label: "N1 Godan Verbs" },
  n1ichidan: { file: "n1-verbs-ichidan", type: "vocab", label: "N1 Ichidan Verbs" },
  n1adji:    { file: "n1-adjectives-i",  type: "vocab", label: "N1 い-Adjectives" },
  n1adjna:   { file: "n1-adjectives-na", type: "vocab", label: "N1 な-Adjectives" },
  n1adverbs: { file: "n1-adverbs",       type: "vocab", label: "N1 Adverbs" },
  // N1 grammar, keigo & phrases (study decks)
  n1gram:          { file: "n1-grammar-all",      type: "vocab", label: "All N1 Grammar", noGame: true },
  n1gramadvanced:  { file: "n1-grammar-advanced", type: "vocab", label: "N1 Advanced Structures", noGame: true },
  n1gramliterary:  { file: "n1-grammar-literary", type: "vocab", label: "N1 Literary & Written Grammar", noGame: true },
  n1keigoadvanced: { file: "n1-keigo-advanced",   type: "vocab", label: "N1 Advanced Keigo", noGame: true },
  n1keigonuanced:  { file: "n1-keigo-nuanced",    type: "vocab", label: "N1 Nuanced Honorifics", noGame: true },
  n1phrformal:     { file: "n1-phrases-formal",   type: "vocab", label: "N1 Formal & Literary Expression", noGame: true },
  n1phrnuanced:    { file: "n1-phrases-nuanced",  type: "vocab", label: "N1 Nuanced Communication", noGame: true },
};

const KANJIAPI = "https://kanjiapi.dev/v1/";

// Live-fetch a whole JLPT deck from kanjiapi.dev and map it to the card schema.
// (Used as a fallback when the local pre-built JSON for the deck is unavailable.)
async function fetchJlptFromApi(level, onProgress) {
  const getJSON = async u => { try { const r = await fetch(u); if (r.ok) return await r.json(); } catch (_) {} return null; };
  // JLPT list endpoint is hyphenated: /v1/kanji/jlpt-5 ... jlpt-1
  const chars = await getJSON(KANJIAPI + "kanji/jlpt-" + level);
  if (!Array.isArray(chars)) return [];

  // Concurrency-limited fetch helper (keeps the API happy).
  const pool = async (items, limit, fn) => {
    const out = new Array(items.length); let i = 0, done = 0;
    await Promise.all(Array.from({ length: limit }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]);
        if (onProgress) onProgress(++done, items.length);
      }
    }));
    return out;
  };

  const details = await pool(chars, 8, c => getJSON(KANJIAPI + "kanji/" + encodeURIComponent(c)));
  const words   = await pool(chars, 8, c => getJSON(KANJIAPI + "words/" + encodeURIComponent(c)));

  const isKana = s => /^[぀-ヿー]+$/.test(s);
  const pickExample = (wj, kanji) => {
    if (!Array.isArray(wj)) return { w: "", r: "", m: "" };
    const cands = [];
    for (const w of wj) {
      const gloss = w.meanings && w.meanings[0] && w.meanings[0].glosses && w.meanings[0].glosses[0];
      if (!gloss) continue;
      for (const v of (w.variants || [])) {
        if (!v.written || !v.pronounced || !v.written.includes(kanji) || !isKana(v.pronounced)) continue;
        cands.push({ w: v.written, r: v.pronounced, m: gloss, prio: (v.priorities && v.priorities.length) ? 1 : 0, len: v.written.length });
      }
    }
    if (!cands.length) return { w: "", r: "", m: "" };
    cands.sort((a, b) => (b.prio - a.prio) || (a.len - b.len));
    const best = cands.find(c => c.len >= 2) || cands[0];
    return best;
  };

  return chars.map((c, i) => {
    const d = details[i] || {};
    const ex = pickExample(words[i], c);
    return {
      character: c,
      onyomi: (d.on_readings || []).join("、"),
      kunyomi: (d.kun_readings || []).join("、"),
      meaning: (d.meanings || []).join(", "),
      level: "N" + level,
      strokeCount: d.stroke_count || 0,
      exampleWord: ex.w, exampleReading: ex.r, exampleMeaning: ex.m,
    };
  });
}

// Resolve a deck's cards: local pre-built JSON first (instant/offline), then a
// live kanjiapi.dev fetch as a fallback for kanji decks.
async function loadDeckData(def, onProgress) {
  let data = await loadData(def.file);
  // Kanji decks MUST contain kanji-shaped cards (a `character` field). If the
  // local file is missing/empty — or somehow not kanji data (e.g. a stale or
  // wrong cache) — (re)fetch the kanji characters from kanjiapi.dev instead.
  const looksKanji = Array.isArray(data) && data.length && data[0] && "character" in data[0];
  if (def.apiLevel && !looksKanji) {
    data = await fetchJlptFromApi(def.apiLevel, onProgress);
    if (data && data.length) { _dataCache[def.file] = data; if (window.DECKS) window.DECKS[def.file] = data; }
  }
  return data;
}

const _dataCache = {};
function injectScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src; s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => reject(new Error("inject fail " + src));
    document.head.appendChild(s);
  });
}
async function loadData(fileKey) {
  if (_dataCache[fileKey]) return _dataCache[fileKey];
  // 1) fetch the .json (works when served over http/https)
  try {
    const r = await fetch("data/" + fileKey + ".json");
    if (r.ok) { const j = await r.json(); _dataCache[fileKey] = j; return j; }
  } catch (_) { /* file:// blocks fetch — fall through */ }
  // 2) fallback: load data/<fileKey>.js which assigns window.DECKS[fileKey]
  if (!(window.DECKS && window.DECKS[fileKey])) {
    try { await injectScript("data/" + fileKey + ".js"); } catch (_) {}
  }
  const data = (window.DECKS && window.DECKS[fileKey]) || [];
  _dataCache[fileKey] = data;
  return data;
}

/* ---------- Legacy kana data placeholder (now loaded from JSON) ---------- */

// ---------- State ----------
let cards = [];           // raw card objects loaded for the current deck
let currentDeckId = "hiragana";
let deckType = "kana";    // "kana" | "kanji"
let fieldPrefs = {};      // back-field visibility map for the current deck
let fieldOrder = [];      // back-field display order (drag-reorderable) for the current deck
let deck = [];        // current working deck (filtered/shuffled subset of cards)
let results = [];     // per-card score: null = unscored, true = correct, false = wrong
let frontTime = [];   // per-card accumulated ms the FRONT face was visible
let frontStart = null;// timestamp (ms) when the front became visible, or null if paused
let reported = false; // whether the completion report has been shown for this deck
let index = 0;
let flipped = false;

// Accumulate elapsed front-side time onto the current card, then pause the clock.
function pauseFrontTimer() {
  if (frontStart !== null && deck.length) {
    frontTime[index] += performance.now() - frontStart;
    frontStart = null;
  }
}
// Start (or restart) the front-side clock for the current card.
function startFrontTimer() {
  frontStart = performance.now();
}

const $ = id => document.getElementById(id);
const deckSelect = $("deckSelect");
const groupSelect = $("groupSelect");
const card = $("card");

// ---- Universal deck/set selection state (see the selection system below) ----
let activeKanaGroup = "all";    // kana subset: all|basic|dakuten|yoon|advanced
let activeKanjiFilter = null;   // Set<char> to restrict a kanji deck (category/radical), or null
let currentTopKey = "hiragana"; // active top-level deck (Deck dropdown value)
let currentSelKey = "hiragana"; // active set selection key (Set dropdown value / sidebar data-sel)
const KANJI_GROUPS = {};        // level -> { cats:{name:[chars]}, rads:{char:{meaning,kanji:[]}} }
let TOP_DECKS = [];             // [{ key,label,type,sets:[...] }]
let SET_BY_ID = {};             // selKey -> { topKey, set }

function buildDeck() {
  if (deckType === "kana") {
    const group = activeKanaGroup;
    deck = cards.filter(k => {
      if (group === "all") return true;
      if (group === "advanced") return k.g === "dakuten" || k.g === "yoon";
      return k.g === group;
    });
  } else if (deckType === "kanji" && activeKanjiFilter) {
    deck = cards.filter(k => activeKanjiFilter.has(k.character));
  } else {
    deck = cards.slice();
  }
  syncSidebar();
  results = deck.map(() => null);
  frontTime = deck.map(() => 0);
  frontStart = null;
  reported = false;
  index = 0;
  flipped = false;
  render();
}

// ---------- Card field helpers (kana vs kanji) ----------
// The big character shown on the front. For kana this honours the Deck (script)
// dropdown exactly as before; for kanji it's the kanji glyph.
function frontChar(e) {
  if (deckType === "kanji") return e.character;
  if (deckType === "vocab") return e.word;
  return deckSelect.value === "katakana" ? e.k : e.h;
}

const FIELD_LABELS = {
  romaji: "Romaji", equiv: "Kana Equivalent", class: "Classification",
  stroke: "Stroke Order Animation", onyomi: "Onyomi", kunyomi: "Kunyomi",
  meaning: "Meaning", strokecount: "Stroke Count", example: "Example Word",
  reading: "Reading", pos: "Part of Speech", sentence: "Example Sentence",
};
const KANA_FIELDS  = ["romaji", "equiv", "class", "stroke"];
// Romaji / Kana Equivalent / Classification are kana-specific and have no
// counterpart in the kanjiapi.dev response, so they're omitted for kanji decks.
const KANJI_FIELDS = ["meaning", "onyomi", "kunyomi", "strokecount", "example", "stroke"];
const VOCAB_FIELDS = ["reading", "romaji", "meaning", "pos", "sentence"];
function fieldKeysForType(t) { return t === "kanji" ? KANJI_FIELDS : t === "vocab" ? VOCAB_FIELDS : KANA_FIELDS; }
function isFieldEnabled(key) { return fieldPrefs[key] !== false; }

// Cap a long list (kanji can have many okurigana reading variants / meanings)
// so the card stays readable and fits without scrolling. Appends … if trimmed.
function capReadings(str, n, sep) {
  sep = sep || "、";
  const parts = String(str).split(sep);
  return parts.length > n ? parts.slice(0, n).join(sep) + "…" : str;
}

// The display content for a single field on the current card, or null if empty.
// (The "stroke" field is the animation, handled separately by maybeRenderStroke.)
function fieldValue(key, e) {
  switch (key) {
    case "romaji":  return deckType === "vocab" ? (e.romaji || null) : (e.r || null);
    case "equiv": {
      if (deckType !== "kana") return null;
      const script = deckSelect.value;
      const other = script !== "katakana" ? e.k : e.h;
      const label = script !== "katakana" ? "Katakana" : "Hiragana";
      return other ? `${label}: <b>${other}</b>` : null;
    }
    case "class":       return deckType === "kana" ? (e.note || null) : null;
    case "meaning":     return e.meaning ? capReadings(e.meaning, 4, ", ") : null;
    case "onyomi":      return e.onyomi ? `<span class="bf-lbl">On</span> ${capReadings(e.onyomi, 6)}` : null;
    case "kunyomi":     return e.kunyomi ? `<span class="bf-lbl">Kun</span> ${capReadings(e.kunyomi, 6)}` : null;
    case "strokecount": return (e.strokeCount != null) ? `Strokes: ${e.strokeCount}` : null;
    case "example":     return e.exampleWord ? `<b>${e.exampleWord}</b> (${e.exampleReading}) — ${e.exampleMeaning}` : null;
    case "reading":     return e.reading || null;
    case "pos":         return e.partOfSpeech || null;
    case "sentence":    return e.exampleSentence
      ? `<b>${e.exampleSentence}</b>${e.exampleReading ? " (" + e.exampleReading + ")" : ""}${e.exampleMeaning ? " — " + e.exampleMeaning : ""}` : null;
    default:            return null; // includes "stroke"
  }
}

// Build the back-face HTML: enabled text fields in the user's chosen order, where
// position drives hierarchy — 1st = primary (large), 2nd = secondary, rest = detail.
function backFieldsHTML(e) {
  const rendered = [];
  for (const k of fieldOrder) {
    if (!isFieldEnabled(k) || k === "stroke") continue;
    const v = fieldValue(k, e);
    if (v != null) rendered.push(v);
  }
  return rendered.map((v, i) => {
    const cls = i === 0 ? "bf-primary" : i === 1 ? "bf-secondary" : "bf-detail";
    return `<div class="${cls}">${v}</div>`;
  }).join("");
}

// Render the stroke-order animation for the current card if enabled & available.
function maybeRenderStroke() {
  const box = $("strokeOrder");
  if (window.KanjiStrokes) KanjiStrokes.stop(); // halt any running loop first
  const entry = deck[index];
  if (!entry || !isFieldEnabled("stroke")) { box.hidden = true; $("strokeCanvas").innerHTML = ""; return; }
  const ch = frontChar(entry);
  if (!window.KanjiStrokes || !KanjiStrokes.isSupported(ch)) { box.hidden = true; $("strokeCanvas").innerHTML = ""; return; }
  box.hidden = false;
  $("strokeStatus").textContent = "loading stroke order…";
  KanjiStrokes.render($("strokeCanvas"), ch).then(ok => {
    box.hidden = !ok;
    $("strokeStatus").textContent = ok ? "" : "no stroke data";
  });
}
function resetStroke() {
  if (window.KanjiStrokes) KanjiStrokes.stop(); // stop the continuous loop
  const box = $("strokeOrder");
  if (box) { box.hidden = true; $("strokeCanvas").innerHTML = ""; }
}

function updateScore() {
  const correct = results.filter(r => r === true).length;
  const done = results.filter(r => r !== null).length;
  $("score").innerHTML = `Total correct: <b>${correct}</b> / ${deck.length}`;
  $("completed").textContent = `Completed: ${done} / ${deck.length}`;
}

// ---- Diacritic emphasis (dakuten ゛ / handakuten ゜) ----
// Precomposed kana (が) decompose via Unicode NFD into a base (か) + a combining
// mark. Splitting them lets us highlight the small, easily-missed mark so が vs
// か and ば vs ぱ are obvious everywhere (cards, lessons, and the game canvas).
const COMBINING_DAKUTEN = 0x3099, COMBINING_HANDAKUTEN = 0x309A;
// Badge colour mode: "gold" (default), "two" (blue/orange), or "text" (match
// the surrounding character colour — subtle).
const DIA_GOLD = "#ffd24a", DAK_COLOR = "#6cb6ff", HAN_COLOR = "#ff9f43";
let diaMode = "gold";       // colour: gold | two | text
let diaSize = "readable";   // size: natural (real mark) | readable (shape badge)
function splitDiacritic(ch) {
  const nfd = String(ch).normalize("NFD");
  if (nfd.length === 2) {
    const c = nfd.charCodeAt(1);
    if (c === COMBINING_DAKUTEN || c === COMBINING_HANDAKUTEN) return { base: nfd[0], mark: nfd[1] };
  }
  return null;
}
// Like splitDiacritic but for a whole term (e.g. a yōon combo like じゃ): finds
// the first character carrying a dakuten/handakuten and returns its position,
// type, and the term with that character swapped for its plain base.
function diacriticInfo(str) {
  const chars = Array.from(String(str));
  for (let i = 0; i < chars.length; i++) {
    const d = splitDiacritic(chars[i]);
    if (d) {
      const baseArr = chars.slice(); baseArr[i] = d.base;
      return { index: i, han: d.mark.charCodeAt(0) === COMBINING_HANDAKUTEN, baseStr: baseArr.join("") };
    }
  }
  return null;
}

// Walk text nodes under `root` and wrap any combining dakuten/handakuten in a
// <span class="dia"> so CSS can colour just the mark. Safe to run over rich HTML.
function emphasizeDiacritics(root) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const p = node.parentNode;
    if (!p || (p.classList && p.classList.contains("dia"))) continue;
    const val = node.nodeValue;
    let has = false;
    for (const ch of val) if (splitDiacritic(ch)) { has = true; break; }
    if (!has) continue;
    const frag = document.createDocumentFragment();
    for (const ch of val) {
      const d = splitDiacritic(ch);
      if (d) {
        // Render the base kana plus BOTH the real combining mark (".dia", natural
        // size) and a shape badge (".km", larger/clearer). CSS shows one per the
        // chosen size mode; the colour mode tints whichever is visible.
        const han = d.mark.charCodeAt(0) === COMBINING_HANDAKUTEN;
        const cls = han ? "han" : "dak";
        const wrap = document.createElement("span"); wrap.className = "kw";
        wrap.appendChild(document.createTextNode(d.base));
        const dia = document.createElement("span"); dia.className = "dia " + cls; dia.textContent = d.mark;
        wrap.appendChild(dia);
        const km = document.createElement("span"); km.className = "km " + cls; km.setAttribute("aria-hidden", "true");
        wrap.appendChild(km);
        frag.appendChild(wrap);
      } else frag.appendChild(document.createTextNode(ch));
    }
    p.replaceChild(frag, node);
  }
}

function render() {
  // Roomier layout for kanji cards (more fields + larger stroke diagram).
  document.querySelector(".card-wrap").classList.toggle("kanji", deckType === "kanji");
  document.querySelector(".card-wrap").classList.toggle("vocab", deckType === "vocab");
  // Snap back to the front WITHOUT animating, so the next card's answer is never
  // visible mid-spin. Re-enable the transition after forcing a reflow.
  card.classList.add("no-anim");
  card.classList.remove("flipped");
  flipped = false;
  void card.offsetWidth; // force reflow to commit the instant reset
  card.classList.remove("no-anim");
  $("yesno").classList.remove("show"); // hide Yes/No until this card is flipped
  $("speakerBtn").hidden = true;       // replay button only on the back
  stopSpeech();
  resetStroke();

  if (deck.length === 0) {
    $("frontKana").textContent = "—";
    $("backFields").innerHTML = "";
    $("progress").textContent = "No cards";
    updateScore();
    return;
  }
  const entry = deck[index];
  $("frontKana").textContent = frontChar(entry);
  $("backFields").innerHTML = backFieldsHTML(entry);
  emphasizeDiacritics($("frontKana"));
  emphasizeDiacritics($("backFields"));
  $("progress").textContent = `Card ${index + 1} of ${deck.length}`;
  updateScore();

  // A new card front is now showing — (re)start its front-side clock.
  pauseFrontTimer();
  startFrontTimer();
}

function flip() {
  flipped = !flipped;
  card.classList.toggle("flipped", flipped);
  $("yesno").classList.toggle("show", flipped); // Yes/No (below the card) only when flipped
  $("speakerBtn").hidden = !flipped; // replay button on the back (local or online TTS)
  if (flipped) { pauseFrontTimer(); maybeRenderStroke(); speakCurrentCard(); } // auto-pronounce on flip
  else { startFrontTimer(); resetStroke(); stopSpeech(); }
}

function advance() {
  index = (index + 1) % deck.length;
  render();
}

function next() {
  if (deck.length === 0) return;
  pauseFrontTimer(); // bank this card's front time before leaving
  // Moving on counts as correct whether or not it was flipped — but only if it
  // hasn't already been scored (e.g. via a Yes/No answer).
  if (results[index] === null) results[index] = true;
  advance();
  checkComplete();
}
function prev() {
  if (deck.length === 0) return;
  pauseFrontTimer(); // bank this card's front time before leaving
  index = (index - 1 + deck.length) % deck.length;
  render();
}

// Yes/No answer — only valid after flipping the card.
function answer(correct) {
  if (deck.length === 0 || !flipped) return;
  results[index] = correct;
  markCard(correct); // stats / streak / achievements
  advance();
  checkComplete();
}

function checkComplete() {
  if (!reported && deck.length && results.every(r => r !== null)) {
    reported = true;
    pauseFrontTimer(); // capture the final card's front time
    showReport();
  }
}

// Fisher–Yates shuffle
function shuffle() {
  if (deck.length === 0) return;
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  results = deck.map(() => null); // reset score on shuffle
  frontTime = deck.map(() => 0);  // reset time spent on shuffle
  frontStart = null;
  reported = false;
  index = 0;
  hideReport();
  render();
}

function fmt(ms) { return (ms / 1000).toFixed(1) + "s"; }

// Character + sub-label for a card in reports (works for kana and kanji).
function cardChar(e) { return deckType === "kanji" ? e.character : deckType === "vocab" ? e.word : (deckSelect.value === "katakana" ? e.k : e.h); }
function cardSub(e)  { return deckType === "kanji" ? (e.meaning || "").split(",")[0].trim() : deckType === "vocab" ? (e.meaning || "").split(";")[0].trim() : e.r; }

function showReport() {
  const correct = results.filter(r => r === true).length;
  const total = deck.length;
  const pct = total ? Math.round((correct / total) * 100) : 0;
  $("reportScore").innerHTML =
    `Score: <b>${correct} / ${total}</b> &nbsp;(${pct}% correct)`;

  // Build [index] list sorted by front-side time.
  const order = deck.map((_, i) => i);
  const byTimeDesc = [...order].sort((a, b) => frontTime[b] - frontTime[a]);
  const byTimeAsc  = [...order].sort((a, b) => frontTime[a] - frontTime[b]);

  const label = i => {
    const e = deck[i];
    return `<b>${cardChar(e)}</b> (${cardSub(e)})`;
  };
  const li = i => {
    const cls = results[i] === true ? "ok" : results[i] === false ? "bad" : "";
    return `<li class="${cls}">${label(i)}<span class="time">${fmt(frontTime[i])}</span></li>`;
  };

  $("mostList").innerHTML  = byTimeDesc.slice(0, 10).map(li).join("");
  $("leastList").innerHTML = byTimeAsc.slice(0, 10).map(li).join("");

  // Persist this run to localStorage so results survive after the reset.
  const plain = i => {
    const e = deck[i];
    return { kana: cardChar(e), romaji: cardSub(e), ms: Math.round(frontTime[i]) };
  };
  const setLabel = deckType === "kana"
    ? groupSelect.options[groupSelect.selectedIndex].text
    : (DECK_DEFS[currentDeckId] ? DECK_DEFS[currentDeckId].label : "");
  const record = {
    date: new Date().toLocaleString(),
    deck: deckType === "kana" ? deckSelect.value : currentDeckId,
    set: setLabel,
    correct, total, pct,
    most: byTimeDesc.slice(0, 10).map(plain),
    least: byTimeAsc.slice(0, 10).map(plain),
  };
  const n = saveResult(record);
  $("savedNote").textContent = n
    ? `✓ Saved as session #${n}. Closing will reset the deck to start over.`
    : `⚠ Couldn't save (storage unavailable). Closing will reset the deck.`;

  // Optional cloud sync (no-op for guests / when Supabase is unavailable).
  if (window.KanaSync && KanaSync.onDeckComplete) {
    KanaSync.onDeckComplete(record.deck, deck.map((e, i) => ({
      id: cardChar(e),
      correct: results[i] === true ? true : results[i] === false ? false : null,
    })));
  }

  $("overlay").classList.add("show");
}

function hideReport() {
  $("overlay").classList.remove("show");
}

// ---------- Saved results (localStorage) ----------
const STORE_KEY = "kanaFlashcardResults";

function loadResults() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || "[]"); }
  catch { return []; }
}
function saveResult(record) {
  try {
    const hist = loadResults();
    hist.push(record);
    localStorage.setItem(STORE_KEY, JSON.stringify(hist));
    return hist.length;
  } catch { return 0; }
}
function clearResults() {
  try { localStorage.removeItem(STORE_KEY); } catch {}
}

function showHistory() {
  const hist = loadResults();
  const body = $("histBody");
  if (hist.length === 0) {
    body.innerHTML = `<div class="hist-empty">No saved results yet. Finish a deck to record one.</div>`;
  } else {
    body.innerHTML = hist.slice().reverse().map((r, idx) => {
      const num = hist.length - idx;
      const m0 = r.most && r.most[0];
      const isGame = r.type === "game";
      const sub = isGame
        ? (m0 ? `Top missed: ${m0.kana} (${m0.romaji}) ×${m0.count}` : "Top missed: none — clean run!")
        : (m0 ? `Slowest: ${m0.kana} (${m0.romaji}) ${(m0.ms/1000).toFixed(1)}s` : "Slowest: —");
      const meta = `#${num} · ${r.deck} · ${r.set}` + (isGame ? ` · ${abbrevScore(r.score)} pts` : "");
      return `<div class="hist-entry">
        <div class="hrow">
          <span class="hmeta">${meta}</span>
          <span class="hpct">${r.pct}%</span>
        </div>
        <div class="hrow">
          <span class="hdate">${r.date}</span>
          <span class="hmeta">${r.correct} / ${r.total} ${isGame ? "hits" : "correct"}</span>
        </div>
        <div class="hsub">${sub}</div>
      </div>`;
    }).join("");
  }
  $("histOverlay").classList.add("show");
}
function hideHistory() { $("histOverlay").classList.remove("show"); }

// ---------- Sidebar ----------
const SIDEBAR_KEY = "kanaSidebarCollapsed";

// Load any deck (kana or kanji) by fetching its JSON file, then build the view.
async function loadDeck(deckId) {
  if (game.active) backToStudy(); // leave the game if it was running
  const def = DECK_DEFS[deckId];
  if (!def) return;
  currentDeckId = deckId;
  deckType = def.type;
  // The Deck/Set dropdowns + active filters are configured by selectSet()
  // before this runs; buildDeck() applies them. Dropdowns are universal now.
  setControlsVisibility(def.type);
  loadFieldPrefs(deckId, def.type);
  // Show a loading state while a (possibly live) fetch resolves.
  $("frontKana").textContent = "…";
  $("progress").textContent = def.apiLevel ? "Loading " + def.label + " from kanjiapi.dev…" : "Loading…";
  cards = await loadDeckData(def, (done, tot) => {
    if (currentDeckId === deckId) $("progress").textContent = `Fetching ${def.label}… ${done}/${tot}`;
  });
  if (currentDeckId !== deckId) return; // a newer deck was selected meanwhile
  buildDeck(); // also calls syncSidebar() to refresh the highlight
}

// The Deck/Set dropdowns are now universal — always shown for every deck type.
function setControlsVisibility(type) {
  const df = $("deckField"), sf = $("setField");
  if (df) df.style.display = "";
  if (sf) sf.style.display = "";
}

// Highlight the sidebar item matching the active selection. Prefer an exact set
// match (data-sel), then a top-level deck button (data-deck), falling back to
// the section's top-level button when the exact set has no sidebar entry.
function syncSidebar() {
  document.querySelectorAll(".deck").forEach(b => b.classList.remove("active"));
  let el = document.querySelector(`.deck[data-sel="${currentSelKey}"]`)
        || document.querySelector(`.deck[data-deck="${currentSelKey}"]:not([data-game])`)
        || document.querySelector(`.deck[data-deck="${currentTopKey}"]:not([data-game])`);
  if (el) el.classList.add("active");
}

// =====================================================================
//  Universal Deck / Set selection system
//  The Deck dropdown lists every top-level deck; the Set dropdown lists
//  the subsets of the active deck. Sidebar clicks and dropdown changes
//  both route through selectSet() and stay in sync. The last selection is
//  persisted per section in localStorage.
// =====================================================================
const SEL_LEVELS = ["n5", "n4", "n3", "n2", "n1"];
const SEL_LAST_KEY = "anpiLastDeck";
const SEL_SECTION_KEY = top => "anpiSel_" + top;

function levelOf(deckKey) { const m = String(deckKey).match(/^n([1-5])/); return m ? "n" + m[1] : null; }
function selSlug(s) { return String(s).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function selEsc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

// Build the top-deck / set model. `groups` may be partial — kanji category and
// radical sets appear once their JSON has loaded (buildTopDecks is re-run then).
function buildTopDecks(groups) {
  const decks = [];
  const kanaSets = key => ([
    { id: key,               label: "All Kana",                    deckKey: key, kana: "all" },
    { id: key + "#basic",    label: "Basic (gojūon)",              deckKey: key, kana: "basic" },
    { id: key + "#dakuten",  label: "Dakuten / Handakuten",        deckKey: key, kana: "dakuten" },
    { id: key + "#yoon",     label: "Combos (yōon)",               deckKey: key, kana: "yoon" },
    { id: key + "#advanced", label: "Advanced (dakuten + combos)", deckKey: key, kana: "advanced" },
  ]);
  decks.push({ key: "hiragana", label: "Hiragana",      type: "kana", sets: kanaSets("hiragana") });
  decks.push({ key: "katakana", label: "Katakana",      type: "kana", sets: kanaSets("katakana") });
  decks.push({ key: "advanced", label: "Advanced Kana", type: "kana",
    sets: [{ id: "advanced", label: "All Advanced Kana", deckKey: "advanced", kana: "advanced" }] });

  const VOCAB_SETS = [
    ["vocab", "All {L} Vocabulary"], ["nouns", "Nouns"], ["godan", "Godan Verbs"],
    ["ichidan", "Ichidan Verbs"], ["adji", "い-Adjectives"], ["adjna", "な-Adjectives"], ["adverbs", "Adverbs"],
  ];
  for (const lv of SEL_LEVELS) {
    const L = lv.toUpperCase();
    const g = groups[lv] || {};
    const kanjiSets = [{ id: lv, label: "All " + L + " Kanji", deckKey: lv }];
    for (const name of Object.keys(g.cats || {}))
      kanjiSets.push({ id: lv + "#cat#" + selSlug(name), label: "By Category: " + name, shortLabel: name, deckKey: lv, cat: name });
    for (const [rad, info] of Object.entries(g.rads || {}))
      kanjiSets.push({ id: lv + "#rad#" + rad, label: "By Radical: " + rad + " (" + info.meaning + ")", deckKey: lv, rad, radMeaning: info.meaning });
    decks.push({ key: lv, label: L + " Kanji", type: "kanji", sets: kanjiSets });

    const vkey = lv + "vocab";
    decks.push({ key: vkey, label: L + " Vocabulary", type: "vocab",
      sets: VOCAB_SETS.map(([suf, lbl]) => ({ id: suf === "vocab" ? vkey : lv + suf, label: lbl.replace("{L}", L), deckKey: suf === "vocab" ? vkey : lv + suf })) });

    // Particles (N5 so far) — a standalone vocab-style deck.
    if (DECK_DEFS[lv + "particles"]) {
      decks.push({ key: lv + "particles", label: L + " Particles", type: "vocab",
        sets: [{ id: lv + "particles", label: "All " + L + " Particles", deckKey: lv + "particles" }] });
    }
    // Extra N5 sections: Numbers & Counters, Phrases, Grammar (each a deck with
    // its subsets as sets). A set maps to its own data deck (no filter needed).
    if (lv === "n5") {
      const grp = (key, label, sets) => { if (sets.every(s => DECK_DEFS[s.deckKey])) decks.push({ key, label, type: "vocab", sets }); };
      grp("n5num", "N5 Numbers & Counters", [
        { id: "n5numbers", label: "Basic numbers", deckKey: "n5numbers" },
        { id: "n5datetime", label: "Dates & Time", deckKey: "n5datetime" },
        { id: "n5counters", label: "Counters", deckKey: "n5counters" },
      ]);
      grp("n5phr", "N5 Phrases & Expressions", [
        { id: "n5greetings", label: "Greetings", deckKey: "n5greetings" },
        { id: "n5intro", label: "Introductions", deckKey: "n5intro" },
        { id: "n5classroom", label: "Classroom phrases", deckKey: "n5classroom" },
        { id: "n5shopping", label: "Shopping basics", deckKey: "n5shopping" },
      ]);
      grp("n5gram", "N5 Grammar", [
        { id: "n5gramall", label: "All N5 Grammar", deckKey: "n5gramall" },
        { id: "n5gramstruct", label: "Basic sentence structure", deckKey: "n5gramstruct" },
        { id: "n5gramq", label: "Question forms", deckKey: "n5gramq" },
        { id: "n5gramneg", label: "Negative forms", deckKey: "n5gramneg" },
      ]);
    }
    if (lv === "n4") {
      const grp = (key, label, sets) => { if (sets.every(s => DECK_DEFS[s.deckKey])) decks.push({ key, label, type: "vocab", sets }); };
      grp("n4gramgrp", "N4 Grammar Patterns", [
        { id: "n4gram", label: "All N4 Grammar", deckKey: "n4gram" },
        { id: "n4gramte", label: "Te-form patterns", deckKey: "n4gramte" },
        { id: "n4gramcond", label: "Conditional forms", deckKey: "n4gramcond" },
        { id: "n4gramgive", label: "Giving & Receiving", deckKey: "n4gramgive" },
      ]);
      grp("n4partgrp", "N4 Particles", [
        { id: "n4partadv", label: "Advanced particle usage", deckKey: "n4partadv" },
        { id: "n4partcomp", label: "Compound particles", deckKey: "n4partcomp" },
      ]);
      grp("n4verbgrp", "N4 Verb Forms", [
        { id: "n4verbte", label: "Te-form", deckKey: "n4verbte" },
        { id: "n4verbta", label: "Ta-form", deckKey: "n4verbta" },
        { id: "n4verbnai", label: "Nai-form", deckKey: "n4verbnai" },
        { id: "n4verbpot", label: "Potential form", deckKey: "n4verbpot" },
      ]);
      grp("n4phrgrp", "N4 Phrases & Expressions", [
        { id: "n4phrdaily", label: "Daily conversation", deckKey: "n4phrdaily" },
        { id: "n4phropinion", label: "Expressing opinions", deckKey: "n4phropinion" },
        { id: "n4phrrequest", label: "Making requests", deckKey: "n4phrrequest" },
      ]);
    }
    if (lv === "n3") {
      const grp = (key, label, sets) => { if (sets.every(s => DECK_DEFS[s.deckKey])) decks.push({ key, label, type: "vocab", sets }); };
      grp("n3gramgrp", "N3 Grammar Patterns", [
        { id: "n3gram", label: "All N3 Grammar", deckKey: "n3gram" },
        { id: "n3gramcompound", label: "Compound sentences", deckKey: "n3gramcompound" },
        { id: "n3gramnuance", label: "Expressing nuance", deckKey: "n3gramnuance" },
      ]);
      grp("n3verbgrp", "N3 Verb Forms", [
        { id: "n3verbpass", label: "Passive form", deckKey: "n3verbpass" },
        { id: "n3verbcaus", label: "Causative form", deckKey: "n3verbcaus" },
        { id: "n3verbcauspass", label: "Causative passive", deckKey: "n3verbcauspass" },
      ]);
      grp("n3keigogrp", "N3 Keigo — Introduction", [
        { id: "n3keigoteinei", label: "Teineigo (polite)", deckKey: "n3keigoteinei" },
        { id: "n3keigohonor", label: "Basic honorifics", deckKey: "n3keigohonor" },
      ]);
      grp("n3phrgrp", "N3 Phrases & Expressions", [
        { id: "n3phrformal", label: "Formal conversation", deckKey: "n3phrformal" },
        { id: "n3phrfeelings", label: "Expressing feelings", deckKey: "n3phrfeelings" },
        { id: "n3phrconnect", label: "Connecting ideas", deckKey: "n3phrconnect" },
      ]);
    }
    if (lv === "n2") {
      const grp = (key, label, sets) => { if (sets.every(s => DECK_DEFS[s.deckKey])) decks.push({ key, label, type: "vocab", sets }); };
      grp("n2gramgrp", "N2 Grammar Patterns", [
        { id: "n2gram", label: "All N2 Grammar", deckKey: "n2gram" },
        { id: "n2gramcomplex", label: "Complex structures", deckKey: "n2gramcomplex" },
        { id: "n2gramformal", label: "Formal expressions", deckKey: "n2gramformal" },
      ]);
      grp("n2keigogrp", "N2 Keigo", [
        { id: "n2keigosonkeigo", label: "Sonkeigo (respectful)", deckKey: "n2keigosonkeigo" },
        { id: "n2keigokenjougo", label: "Kenjougo (humble)", deckKey: "n2keigokenjougo" },
      ]);
      grp("n2phrgrp", "N2 Phrases & Expressions", [
        { id: "n2phrbusiness", label: "Business conversation", deckKey: "n2phrbusiness" },
        { id: "n2phrwritten", label: "Written expression", deckKey: "n2phrwritten" },
      ]);
    }
    if (lv === "n1") {
      const grp = (key, label, sets) => { if (sets.every(s => DECK_DEFS[s.deckKey])) decks.push({ key, label, type: "vocab", sets }); };
      grp("n1gramgrp", "N1 Grammar Patterns", [
        { id: "n1gram", label: "All N1 Grammar", deckKey: "n1gram" },
        { id: "n1gramadvanced", label: "Advanced structures", deckKey: "n1gramadvanced" },
        { id: "n1gramliterary", label: "Literary & written grammar", deckKey: "n1gramliterary" },
      ]);
      grp("n1keigogrp", "N1 Keigo", [
        { id: "n1keigoadvanced", label: "Advanced Keigo", deckKey: "n1keigoadvanced" },
        { id: "n1keigonuanced", label: "Nuanced honorifics", deckKey: "n1keigonuanced" },
      ]);
      grp("n1phrgrp", "N1 Phrases & Expressions", [
        { id: "n1phrformal", label: "Formal & literary expression", deckKey: "n1phrformal" },
        { id: "n1phrnuanced", label: "Nuanced communication", deckKey: "n1phrnuanced" },
      ]);
    }
  }

  TOP_DECKS = decks;
  SET_BY_ID = {};
  for (const d of decks) for (const s of d.sets) SET_BY_ID[s.id] = { topKey: d.key, set: s };
}

function groupCharsFor(set) {
  const g = KANJI_GROUPS[levelOf(set.deckKey)]; if (!g) return null;
  if (set.cat) return new Set((g.cats && g.cats[set.cat]) || []);
  if (set.rad) return new Set((g.rads && g.rads[set.rad] && g.rads[set.rad].kanji) || []);
  return null;
}

function populateDeckDropdown() {
  deckSelect.innerHTML = TOP_DECKS.map(d => `<option value="${d.key}">${selEsc(d.label)}</option>`).join("");
}
function populateSetDropdown(topKey) {
  const d = TOP_DECKS.find(x => x.key === topKey); if (!d) return;
  groupSelect.innerHTML = d.sets.map(s => `<option value="${selEsc(s.id)}">${selEsc(s.label)}</option>`).join("");
}

// The single entry point. Select a set by its id; update both dropdowns + the
// sidebar highlight, persist, and load the resolved deck (with any filter).
function selectSet(selKey, opts) {
  let entry = SET_BY_ID[selKey];
  if (!entry && DECK_DEFS[selKey]) entry = { topKey: selKey, set: { id: selKey, deckKey: selKey } }; // pre-init fallback
  if (!entry) return;
  const { topKey, set } = entry;
  currentTopKey = topKey;
  currentSelKey = selKey;
  activeKanaGroup = set.kana || "all";
  activeKanjiFilter = (set.cat || set.rad) ? groupCharsFor(set) : null;
  deckSelect.value = topKey;
  populateSetDropdown(topKey);
  groupSelect.value = selKey;
  try { localStorage.setItem(SEL_SECTION_KEY(topKey), selKey); localStorage.setItem(SEL_LAST_KEY, topKey); } catch (e) {}
  if (!opts || !opts.keepView) setMainView("study"); // selecting a deck lands in study (unless silent initial load)
  loadDeck(set.deckKey);
}

// Inject the "By Category" / "By Radical" sub-trees into each level's study
// Kanji entry, converting the plain Kanji button into a collapsible group.
function buildKanjiSidebar() {
  for (const d of TOP_DECKS) {
    if (d.type !== "kanji") continue;
    const lv = d.key;
    const btn = document.querySelector(`.deck[data-deck="${lv}"]:not([data-game])`);
    if (!btn || btn.closest("details.kanji-sub")) continue; // missing or already built
    const L = lv.toUpperCase();
    const cats = d.sets.filter(s => s.cat);
    const rads = d.sets.filter(s => s.rad);
    const catHTML = cats.length
      ? `<details class="sub"><summary>By Category</summary><div class="items">` +
        cats.map(s => `<button class="deck" data-sel="${selEsc(s.id)}">${selEsc(s.shortLabel)}</button>`).join("") +
        `</div></details>` : "";
    const radHTML = rads.length
      ? `<details class="sub"><summary>By Radical</summary><div class="items">` +
        rads.map(s => `<button class="deck" data-sel="${selEsc(s.id)}"><span class="rad-ch">${s.rad}</span> <span class="rad-meaning">${selEsc(s.radMeaning)}</span></button>`).join("") +
        `</div></details>` : "";
    const details = document.createElement("details");
    details.className = "sub kanji-sub";
    details.innerHTML = `<summary>Kanji</summary><div class="items">` +
      `<button class="deck" data-deck="${lv}">All ${L} Kanji</button>${catHTML}${radHTML}</div>`;
    btn.replaceWith(details);
  }
}

async function preloadKanjiGroups() {
  for (const lv of SEL_LEVELS) {
    const cats = await loadData(lv + "-kanji-categories");
    const rads = await loadData(lv + "-kanji-radicals");
    KANJI_GROUPS[lv] = { cats: (cats && !Array.isArray(cats)) ? cats : {}, rads: (rads && !Array.isArray(rads)) ? rads : {} };
  }
}

// Resolve the deck+set to open on load: the last-used selection per the spec,
// else a sensible default (identical first-run behaviour: Hiragana / All Kana).
function restoreSelection() {
  let sel = "hiragana";
  try {
    const top = localStorage.getItem(SEL_LAST_KEY);
    const d = top && TOP_DECKS.find(x => x.key === top);
    if (d) { const saved = localStorage.getItem(SEL_SECTION_KEY(top)); sel = (saved && SET_BY_ID[saved]) ? saved : d.sets[0].id; }
  } catch (e) {}
  if (!SET_BY_ID[sel]) sel = "hiragana";
  selectSet(sel, { keepView: true }); // preload the deck but stay on the home page
}

async function initSelection() {
  // Capture the persisted set FIRST — restoreSelection()'s fallback would
  // otherwise overwrite it before the group files (needed to validate it) load.
  const wantSel = (() => { try { const t = localStorage.getItem(SEL_LAST_KEY); return t && localStorage.getItem(SEL_SECTION_KEY(t)); } catch (e) { return null; } })();
  buildTopDecks({});            // synchronous model (kana / vocab / all-kanji) so clicks work immediately
  populateDeckDropdown();
  restoreSelection();           // first paint without waiting on the group files
  await preloadKanjiGroups();   // category + radical JSON (local; fast)
  buildTopDecks(KANJI_GROUPS);  // re-build with category/radical sets
  populateDeckDropdown();
  buildKanjiSidebar();          // inject By Category / By Radical buttons
  // Keep the dropdowns on the current selection (or apply a persisted group set now available).
  if (wantSel && SET_BY_ID[wantSel] && wantSel !== currentSelKey) selectSet(wantSel, { keepView: true });
  else { deckSelect.value = currentTopKey; populateSetDropdown(currentTopKey); groupSelect.value = currentSelKey; syncSidebar(); }
}

function applySidebarState() {
  // Always start with the nav closed on load; the ☰ button opens it.
  $("sidebar").classList.add("collapsed");
}
function toggleSidebar() {
  const collapsed = $("sidebar").classList.toggle("collapsed");
  try { localStorage.setItem(SIDEBAR_KEY, collapsed ? "1" : "0"); } catch {}
}

// ---------- Right-side field-visibility panel ----------
const FIELD_PREFS_KEY = id => "kanaFieldPrefs_" + id;
const FIELD_PANEL_KEY = "kanaFieldPanelCollapsed";

// Load this deck's saved field prefs (visibility + order) and render the panel.
// Saved shape: { order: [keys…], vis: {key:bool} }. Defaults: all visible, default order.
function loadFieldPrefs(deckId, type) {
  const keys = fieldKeysForType(type);
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(FIELD_PREFS_KEY(deckId)) || "{}"); } catch {}
  // Backward-compat: old format was a flat {key:bool} visibility map.
  const isNew = saved && (saved.vis || saved.order);
  const vis = isNew ? (saved.vis || {}) : (saved || {});
  const order = isNew ? (saved.order || []) : [];
  fieldPrefs = {};
  keys.forEach(k => { fieldPrefs[k] = vis[k] !== undefined ? !!vis[k] : true; });
  // Saved order (valid keys only), then append any keys not yet in it.
  fieldOrder = order.filter(k => keys.includes(k));
  keys.forEach(k => { if (!fieldOrder.includes(k)) fieldOrder.push(k); });
  renderFieldPanel(type);
}
function saveFieldPrefs() {
  try { localStorage.setItem(FIELD_PREFS_KEY(currentDeckId), JSON.stringify({ order: fieldOrder, vis: fieldPrefs })); } catch {}
}
// Re-render the current card's back (and stroke) after a visibility/order change.
function refreshBack() {
  if (!deck.length) return;
  $("backFields").innerHTML = backFieldsHTML(deck[index]);
  emphasizeDiacritics($("backFields"));
  if (flipped) maybeRenderStroke(); else resetStroke();
}

let dragSrcKey = null;
function renderFieldPanel(type) {
  const wrap = $("fieldChecks");
  wrap.innerHTML = fieldOrder.map(k =>
    `<div class="field-row" draggable="true" data-field="${k}">
       <span class="drag-handle" title="Drag to reorder" aria-hidden="true">⠿</span>
       <label class="field-check"><input type="checkbox" data-field="${k}" ${fieldPrefs[k] !== false ? "checked" : ""}> ${FIELD_LABELS[k]}</label>
     </div>`).join("");

  wrap.querySelectorAll("input[data-field]").forEach(cb => {
    cb.addEventListener("change", () => { fieldPrefs[cb.dataset.field] = cb.checked; saveFieldPrefs(); refreshBack(); });
  });

  wrap.querySelectorAll(".field-row").forEach(row => {
    row.addEventListener("dragstart", e => {
      dragSrcKey = row.dataset.field; row.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
      try { e.dataTransfer.setData("text/plain", dragSrcKey); } catch (_) {}
    });
    row.addEventListener("dragend", () => {
      row.classList.remove("dragging");
      wrap.querySelectorAll(".field-row").forEach(r => r.classList.remove("drag-over"));
    });
    row.addEventListener("dragover", e => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; });
    row.addEventListener("dragenter", e => { e.preventDefault(); if (row.dataset.field !== dragSrcKey) row.classList.add("drag-over"); });
    row.addEventListener("dragleave", () => row.classList.remove("drag-over"));
    row.addEventListener("drop", e => {
      e.preventDefault();
      const targetKey = row.dataset.field;
      if (!dragSrcKey || dragSrcKey === targetKey) return;
      const rect = row.getBoundingClientRect();
      const after = (e.clientY - rect.top) > rect.height / 2; // drop in lower half → place after
      const arr = fieldOrder.filter(k => k !== dragSrcKey);
      let ti = arr.indexOf(targetKey); if (after) ti += 1;
      arr.splice(ti, 0, dragSrcKey);
      fieldOrder = arr;
      saveFieldPrefs();
      renderFieldPanel(type); // rebuild rows in new order
      refreshBack();          // reflect new hierarchy on the card
    });
  });
}
function applyFieldPanelState() {
  let collapsed = false;
  try { collapsed = localStorage.getItem(FIELD_PANEL_KEY) === "1"; } catch {}
  $("fieldPanel").classList.toggle("collapsed", collapsed);
}
function toggleFieldPanel() {
  const collapsed = $("fieldPanel").classList.toggle("collapsed");
  try { localStorage.setItem(FIELD_PANEL_KEY, collapsed ? "1" : "0"); } catch {}
}

// ===================================================================
//  Pronunciation — TEMPORARILY DISABLED ("Audio coming soon")
//  The Google Translate TTS implementation is preserved below as commented-out
//  code. To re-enable when a proper backend is ready: delete the no-op stubs at
//  the bottom of this block, uncomment the implementation, and in index.html
//  drop the `disabled` class + `data-tip` from #speakerBtn.
// ===================================================================
// ---- Google Translate TTS implementation (disabled — uncomment to re-enable) ----
// const TTS = { audio: null };
// function googleTtsUrl(text) {
//   // client=tw-ob is required for the endpoint to return audio to browsers.
//   return "https://translate.google.com/translate_tts?ie=UTF-8&tl=ja&client=tw-ob&q=" + encodeURIComponent(text);
// }
// function speak(text) {
//   if (!text) return;
//   stopSpeech();
//   try {
//     const a = new Audio(googleTtsUrl(text)); // media element -> no CORS issue for playback
//     TTS.audio = a;
//     const btn = $("speakerBtn");
//     a.addEventListener("playing", () => { if (btn) btn.classList.add("speaking"); });
//     const clear = () => { if (btn) btn.classList.remove("speaking"); };
//     a.addEventListener("ended", clear);
//     a.addEventListener("error", clear); // fetch/playback failed -> silent
//     const p = a.play();
//     if (p && p.catch) p.catch(() => {}); // ignore autoplay/network rejections silently
//   } catch (_) {}
// }
// function stopSpeech() {
//   if (TTS.audio) { try { TTS.audio.pause(); } catch (_) {} TTS.audio = null; }
//   const btn = $("speakerBtn"); if (btn) btn.classList.remove("speaking");
// }
// function speakCurrentCard() { speak(currentSpeakText()); }
// ---- end disabled TTS ----

// What to pronounce: kana → the shown kana; kanji/vocab → the kana READING
// (far more reliable than letting TTS guess a kanji's reading), with fallbacks.
function currentSpeakText() {
  const e = deck[index];
  if (!e) return "";
  // Kanji: speak the character itself — the TTS engine reads it with its natural
  // reading (一→ichi, 山→yama), cleaner than our comma-separated on/kun lists.
  if (deckType === "kanji") return e.character || "";
  if (deckType === "vocab") return e.reading || e.word || ""; // prefer the kana reading
  return frontChar(e); // kana deck: the character on the front (e.h / e.k)
}

// ---- Pronunciation via the browser's built-in Speech Synthesis (ja-JP) ----
// Free, no backend, no CORS — uses the device's installed Japanese voice.
let autoSpeak = true;
try { autoSpeak = localStorage.getItem("anpiAutoSpeak") !== "0"; } catch (e) {}
let _jaVoice = null;
const TTS = { audio: null };
function speechAvailable() { return !!(window.speechSynthesis && window.SpeechSynthesisUtterance); }
function pickJaVoice() {
  try {
    const vs = (window.speechSynthesis && speechSynthesis.getVoices()) || [];
    const ja = vs.filter(v => /^ja(-|_|$)/i.test(v.lang) || /japanese|日本/i.test(v.name));
    // Only trust a TRULY local (offline) voice. Online "natural" voices — e.g. Edge's
    // Nanami — show up here but frequently don't actually speak via the web Speech API,
    // so we skip them and use the /api/tts proxy (which works reliably for everyone).
    _jaVoice = ja.find(v => v.localService) || null;
  } catch (e) {}
  updateAudioNote();
}
function updateAudioNote() { const u = $("ttsUnavailable"); if (u) u.hidden = !!_jaVoice; } // tip only when no local JP voice
if (speechAvailable()) {
  pickJaVoice();
  try { speechSynthesis.addEventListener("voiceschanged", pickJaVoice); } catch (e) {}
}
// Local Japanese voice (offline, instant) — used only when one is installed.
function speakLocal(text) {
  try {
    const u = new SpeechSynthesisUtterance(String(text));
    u.lang = "ja-JP"; if (_jaVoice) u.voice = _jaVoice; u.rate = 0.9;
    const btn = $("speakerBtn");
    u.onstart = () => { if (btn) btn.classList.add("speaking"); };
    const clear = () => { if (btn) btn.classList.remove("speaking"); };
    u.onend = clear; u.onerror = clear;
    speechSynthesis.speak(u);
  } catch (e) { /* silent */ }
}
// Online fallback so everyone hears audio without installing a voice. Streams MP3
// from our own Cloudflare TTS proxy (/api/tts → Workers AI). Needs a network
// connection and only works on the deployed site (not file://).
function speakOnline(text) {
  try {
    const btn = $("speakerBtn");
    const a = new Audio("/api/tts?q=" + encodeURIComponent(String(text)) + "&v=3"); // v= busts old cached (silent MeloTTS) audio
    TTS.audio = a;
    a.addEventListener("playing", () => { if (btn) btn.classList.add("speaking"); });
    const clear = () => { if (btn) btn.classList.remove("speaking"); };
    a.addEventListener("ended", clear); a.addEventListener("error", clear);
    const p = a.play(); if (p && p.catch) p.catch(() => {});
  } catch (e) { /* silent */ }
}
function speak(text) {
  if (!text) return;
  stopSpeech();
  // Always use the /api/tts proxy on the deployed site — it returns standard WAV and
  // plays consistently everywhere. Local SpeechSynthesis is used ONLY offline (file://),
  // because some browsers' "local" voices (e.g. Edge's online Japanese) silently no-op.
  if (location.protocol === "file:" && speechAvailable() && _jaVoice) speakLocal(text);
  else speakOnline(text);
}
function stopSpeech() {
  try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {}
  if (TTS.audio) { try { TTS.audio.pause(); } catch (e) {} TTS.audio = null; }
  const btn = $("speakerBtn"); if (btn) btn.classList.remove("speaking");
}
function speakCurrentCard() { if (autoSpeak) speak(currentSpeakText()); } // auto-on-flip (respects setting)
function setAutoSpeak(on) {
  autoSpeak = !!on;
  try { localStorage.setItem("anpiAutoSpeak", autoSpeak ? "1" : "0"); } catch (e) {}
}

// ===================================================================
//  Space Invaders mini-game
// ===================================================================
// Low, gentle starting speeds (px/sec) so the opening is manageable; `pts` is the
// difficulty points multiplier (Easy 1× / Medium 2× / Hard 4× / Insane 8×).
const MODES = {
  easy:   { key:"easy",   label:"Easy",   lives:10, speed:9,  pts:1, wrongCostsLife:false,
            desc:"10 lives · very slow, leisurely asteroids. Wrong answers are FREE — only terms that reach your ship cost a life." },
  medium: { key:"medium", label:"Medium", lives:5,  speed:13, pts:2, wrongCostsLife:true,
            desc:"5 lives · a little faster, 2× points. Wrong answers AND terms reaching your ship each cost a life." },
  hard:   { key:"hard",   label:"Hard",   lives:3,  speed:18, pts:4, wrongCostsLife:true,
            desc:"3 lives · noticeably faster, 4× points. Wrong answers AND reaching your ship each cost a life." },
  insane: { key:"insane", label:"Insane", lives:1,  speed:24, pts:8, wrongCostsLife:true,
            desc:"1 life · fastest, 8× points. A single mistake ends the run." },
};

// Per-asteroid base points (doubled from the old 100) + scoring multiplier tiers.
const BASE_POINTS = 200n;
const STREAK_MILESTONES = [5, 10, 25, 50, 100];
function streakTier(streak) {
  if (streak >= 100) return 6;
  if (streak >= 50)  return 5;
  if (streak >= 25)  return 4;
  if (streak >= 10)  return 3;
  if (streak >= 5)   return 2;
  return 1; // streak 1-4 (and 0)
}

// ----- Large-number score helpers (BigInt) -----
function abbrevScore(n) {
  n = (typeof n === "bigint") ? n : BigInt(n || 0);
  const neg = n < 0n; if (neg) n = -n;
  const units = [[1000000000000n, "T"], [1000000000n, "B"], [1000000n, "M"], [1000n, "K"]];
  let s;
  if (n < 1000n) { s = n.toString(); }
  else {
    s = n.toString();
    for (const [div, suf] of units) {
      if (n >= div) {
        const whole = n / div;
        let frac = ((n % div) * 100n / div).toString().padStart(2, "0").replace(/0+$/, "");
        s = whole.toString() + (frac ? "." + frac : "") + suf;
        break;
      }
    }
  }
  return neg ? "-" + s : s;
}
function fullScore(n) {
  n = (typeof n === "bigint") ? n : BigInt(n || 0);
  try { return n.toLocaleString("en-US"); } catch (_) { return n.toString(); }
}

const game = {
  active:false, running:false, mode:null, deckKey:null, deckType:"kana", answerMode:"romaji", pool:[],
  asteroids:[], pops:[], beams:[], shipX:0, shipFlash:0, shipFlashBad:0,
  lives:0, score:0n, combo:0, bestCombo:0, milestoneMult:1, lifeMilestones:{}, destroyed:0, hits:0, misses:0,
  escaped:{}, spawnCooldown:0, lastTs:0, raf:0,
};

const canvas = $("gameCanvas");
const ctx = canvas.getContext("2d");
const gameInput = $("gameInput");

// Fit the canvas to the visible viewport (desktop) and handle the iOS soft
// keyboard via visualViewport (mobile). No fixed pixel heights; recalculated on
// resize / visualViewport change. The game uses canvas.width/height for layout,
// so resizing here makes the ship, spawn range and escape line adapt for free.
function layoutGameCanvas() {
  if (!game.active || $("playArea").hidden) return;
  const vv = window.visualViewport;
  const visH = vv ? vv.height : window.innerHeight;                 // visible height
  const kbInset = vv ? Math.max(0, window.innerHeight - vv.height - vv.offsetTop) : 0; // soft-keyboard height
  const kbOpen = kbInset > 120;
  const tipEl = document.querySelector(".game-tip");

  // Free up vertical space + pin the input above the keyboard when it's open.
  document.body.classList.toggle("kb-open", kbOpen);
  if (kbOpen) {
    gameInput.style.position = "fixed";
    gameInput.style.left = "50%";
    gameInput.style.transform = "translateX(-50%)";
    gameInput.style.bottom = kbInset + "px";        // sit right above the keyboard
    gameInput.style.width = "calc(100% - 2rem)";
    gameInput.style.maxWidth = "460px";
    gameInput.style.zIndex = "45";
    gameInput.style.marginTop = "0";
    window.scrollTo(0, 0);                            // keep HUD/terms at the top of the visible area
  } else {
    gameInput.style.position = ""; gameInput.style.left = ""; gameInput.style.transform = "";
    gameInput.style.bottom = ""; gameInput.style.width = ""; gameInput.style.maxWidth = "";
    gameInput.style.zIndex = ""; gameInput.style.marginTop = "";
  }

  // Scroll to top so focus()-induced scrolling can't corrupt the measurement,
  // and the HUD/terms stay anchored at the top of the visible area.
  window.scrollTo(0, 0);
  // Width: bounded by the main content column (stable, not shrink-to-fit).
  const main = document.querySelector(".main");
  const availW = Math.min(460, (main ? main.clientWidth : window.innerWidth) - 24);
  // Height: from the canvas's top down to just above the input, within the visible viewport.
  const topRel = canvas.getBoundingClientRect().top - (vv ? vv.offsetTop : 0);
  const inputH = gameInput.offsetHeight || 48;
  const tipH = (!kbOpen && tipEl) ? tipEl.offsetHeight : 0;
  // kbOpen: input is fixed just above the keyboard → reserve only input + a thin
  // gap so the canvas runs as tall as possible without the keyboard reaching it.
  // desktop/normal: input + tip flow below, plus a small bottom margin.
  const reserve = kbOpen ? (inputH + 8) : (inputH + tipH + 24);
  const availH = Math.max(180, visH - topRel - reserve);

  const w = Math.max(220, Math.round(availW));
  const h = Math.round(availH);
  canvas.style.maxWidth = "none";
  canvas.style.aspectRatio = "auto";
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  if (canvas.width !== w) canvas.width = w;           // internal resolution = display (1:1)
  if (canvas.height !== h) canvas.height = h;
}

function deckLabel(k) { return DECK_DEFS[k] ? DECK_DEFS[k].label : k; }

// ---------- Game answer mode (romaji vs english meaning), saved per deck ----------
const ANSWER_MODE_KEY = k => "kanaGameAnswerMode_" + k;
function loadAnswerMode(deckKey, type) {
  let saved = null;
  try { saved = localStorage.getItem(ANSWER_MODE_KEY(deckKey)); } catch {}
  // Kana decks have no English meaning, so they're always romaji.
  if (type === "kana") return "romaji";
  return saved === "meaning" ? "meaning" : "romaji";
}
function saveAnswerMode(deckKey, mode) { try { localStorage.setItem(ANSWER_MODE_KEY(deckKey), mode); } catch {} }

// Romanize a kana reading string (best-effort) using the kana datasets.
let _romaMap = null;
async function ensureRomaMap() {
  if (_romaMap) return _romaMap;
  _romaMap = {};
  const h = await loadData("hiragana");
  // longer keys first so yōon combos (2 chars) win over single kana
  for (const e of h) { _romaMap[e.h] = e.r; _romaMap[e.k] = e.r; }
  return _romaMap;
}
function romanize(reading) {
  if (!_romaMap) return "";
  let s = reading.replace(/[.\-―ー･・]/g, "");
  let out = "", i = 0;
  while (i < s.length) {
    const two = s.substr(i, 2);
    if (_romaMap[two]) { out += _romaMap[two]; i += 2; continue; }
    const one = s[i];
    if (_romaMap[one]) { out += _romaMap[one]; i += 1; continue; }
    if (one === "っ" || one === "ッ") { // sokuon: double next consonant
      const nxt = _romaMap[s.substr(i + 1, 2)] || _romaMap[s[i + 1]];
      if (nxt) out += nxt[0];
      i += 1; continue;
    }
    i += 1; // unknown char (kanji okurigana etc.) — skip
  }
  return out.toLowerCase();
}

// Build the falling-term pool from the loaded deck. Each term has a `char`
// (what falls) and `answers` (accepted typed strings, lowercased).
function buildGamePool(deckKey, def, data) {
  if (def.type === "kana") {
    const script = def.script || "h";
    const group = game.set || "all";
    let list = data.filter(k => {
      if (group === "all") return true;
      if (group === "advanced") return k.g === "dakuten" || k.g === "yoon";
      return k.g === group;
    });
    if (!list.length) list = data; // never leave the game with an empty pool
    return list.map(e => ({ char: script === "k" ? e.k : e.h, answers: [String(e.r).toLowerCase()] }));
  }
  if (def.type === "vocab") {
    // Falling term shows the word; answer by romaji or English meaning (toggle).
    return data.map(e => {
      let answers;
      if (game.answerMode === "meaning") {
        answers = (e.meaning || "").split(";").flatMap(s => s.split(","))
          .map(s => s.replace(/\(.*?\)/g, "").trim().toLowerCase()).filter(Boolean);
      } else {
        answers = [String(e.romaji || "").toLowerCase()].filter(Boolean);
      }
      if (!answers.length) answers = [String(e.word)];
      return { char: e.word, answers };
    });
  }
  // kanji
  return data.map(e => {
    let answers;
    if (game.answerMode === "meaning") {
      answers = (e.meaning || "").split(",")
        .map(s => s.replace(/\(.*?\)/g, "").trim().toLowerCase())
        .filter(Boolean);
    } else {
      const readings = []
        .concat((e.onyomi || "").split("、"))
        .concat((e.kunyomi || "").split("、"))
        .map(s => s.trim()).filter(Boolean);
      answers = [...new Set(readings.map(romanize).filter(Boolean))];
    }
    if (!answers.length) answers = [String(e.character)]; // fallback
    return { char: e.character, answers };
  });
}

// High score per deck + difficulty mode (independent per combination).
function highKey(deckKey, mode) { return "kanaGameHigh_" + (deckKey || "?") + "_" + mode; }
// High scores stored as raw decimal strings (no precision loss) and read as BigInt.
function getHigh(deckKey, mode) { try { return BigInt(localStorage.getItem(highKey(deckKey, mode)) || "0"); } catch { return 0n; } }
function setHigh(deckKey, mode, v) { try { localStorage.setItem(highKey(deckKey, mode), (typeof v === "bigint" ? v : BigInt(v)).toString()); } catch {} }

// View switching
// Switch the main column between the Study, Game and Learn views.
function setMainView(which) {
  $("studyView").hidden = which !== "study";
  $("gameView").hidden  = which !== "game";
  const lv = $("learnView"); if (lv) lv.hidden = which !== "learn";
  const hv = $("homeView"); if (hv) hv.hidden = which !== "home";
  const bv = $("leaderboardView"); if (bv) bv.hidden = which !== "leaderboard";
  const sv = $("statsView"); if (sv) sv.hidden = which !== "stats";
  document.body.classList.toggle("game-active", which === "game");
  document.body.classList.toggle("home-active", which === "home");
}
function showLeaderboardView() {
  if (game.active) backToStudy();
  setMainView("leaderboard");
  renderGlobalLeaderboard($("leaderboardBody"), { limit: 50, initialDelay: 0 });
}
function showHome() { if (game.active) backToStudy(); setMainView("home"); }
function showGameView() { setMainView("game"); }
function backToStudy() {
  game.active = false; game.running = false;
  cancelAnimationFrame(game.raf);
  stopPreview();
  // Restore the header and clear any keyboard-pinned input styling.
  document.body.classList.remove("game-active");
  document.body.classList.remove("kb-open");
  gameInput.style.position = ""; gameInput.style.left = ""; gameInput.style.transform = "";
  gameInput.style.bottom = ""; gameInput.style.width = ""; gameInput.style.maxWidth = "";
  gameInput.style.zIndex = ""; gameInput.style.marginTop = "";
  setMainView("study");
  syncSidebar();
}
// Exiting a game mid-play returns to the deck/set picker, still inside game mode
// (not out to the flashcards) so the player can pick another deck and play again.
function exitGameToPicker() {
  game.running = false;
  cancelAnimationFrame(game.raf);
  // Clear any soft-keyboard-pinned input styling left over from play.
  document.body.classList.remove("kb-open");
  try { gameInput.blur(); } catch (e) {}
  gameInput.style.position = ""; gameInput.style.left = ""; gameInput.style.transform = "";
  gameInput.style.bottom = ""; gameInput.style.width = ""; gameInput.style.maxWidth = "";
  gameInput.style.zIndex = ""; gameInput.style.marginTop = "";
  game.active = true;     // remain in the game section
  setMainView("game");
  showDeckPicker();       // back to "Choose deck & set"
}

// ---------- Game deck/set picker (mirrors the study dropdowns) ----------
const GAME_DECK_KEY = "kanaGameDeck";
const GAME_SET_KEY = "kanaGameSet";
const SET_LABELS = { all: "All kana", basic: "Basic", dakuten: "Dakuten / Handakuten", yoon: "Combos", advanced: "Advanced" };

function launchGame(deckKey) {
  // A sidebar game deck was clicked → open the picker preselected to it,
  // keeping the last-used set. Falls back to saved deck if none was passed.
  let savedDeck = null, savedSet = "all";
  try { savedDeck = localStorage.getItem(GAME_DECK_KEY); savedSet = localStorage.getItem(GAME_SET_KEY) || "all"; } catch {}
  game.deckKey = (deckKey && DECK_DEFS[deckKey]) ? deckKey : (savedDeck && DECK_DEFS[savedDeck] ? savedDeck : "hiragana");
  game.set = savedSet;
  game.active = true;
  showGameView();
  showDeckPicker();
  maybeShowGameTutorial(); // first-visit "How to play" overlay
}

function populateGameDeckOptions() {
  const sel = $("gameDeckSelect");
  if (sel.dataset.filled) return;
  sel.innerHTML = Object.keys(DECK_DEFS).filter(k => !DECK_DEFS[k].noGame).map(k => `<option value="${k}">${DECK_DEFS[k].label}</option>`).join("");
  sel.dataset.filled = "1";
}
function updateGameSetVisibility() {
  const def = DECK_DEFS[$("gameDeckSelect").value];
  $("gameSetField").style.display = (def && def.type === "kana") ? "" : "none";
}
function showDeckPicker() {
  game.running = false;
  cancelAnimationFrame(game.raf);
  $("deckPicker").hidden = false;
  $("modeSelect").hidden = true;
  $("playArea").hidden = true;
  $("endScreen").hidden = true;
  populateGameDeckOptions();
  $("gameDeckSelect").value = game.deckKey;
  $("gameSetSelect").value = game.set || "all";
  updateGameSetVisibility();
  startPreview(); // idle ship preview until the user hits Continue
}

// Confirm the picker → persist, load data, then go to difficulty selection.
async function gamePickerContinue() {
  stopPreview(); // leaving the picker
  game.deckKey = $("gameDeckSelect").value;
  game.def = DECK_DEFS[game.deckKey];
  game.deckType = game.def.type;
  game.set = game.deckType === "kana" ? $("gameSetSelect").value : "all";
  try { localStorage.setItem(GAME_DECK_KEY, game.deckKey); localStorage.setItem(GAME_SET_KEY, game.set); } catch {}
  $("deckPicker").hidden = true;
  $("modeDeckLabel").textContent = "Loading…";
  $("modeSelect").hidden = false;
  await ensureRomaMap();
  game.data = await loadDeckData(game.def);
  game.answerMode = loadAnswerMode(game.deckKey, game.deckType);
  showModeSelect();
}

function rebuildGamePool() {
  game.pool = buildGamePool(game.deckKey, game.def, game.data);
}

function showModeSelect() {
  game.running = false;
  cancelAnimationFrame(game.raf);
  $("deckPicker").hidden = true;
  $("modeSelect").hidden = false;
  $("playArea").hidden = true;
  $("endScreen").hidden = true;
  const setSuffix = game.deckType === "kana" ? " · " + (SET_LABELS[game.set] || game.set) : "";
  $("modeDeckLabel").textContent = "Deck: " + deckLabel(game.deckKey) + setSuffix;

  // Answer-mode toggle: romaji vs english meaning (kanji & vocab decks).
  const am = $("answerModeToggle");
  if (game.deckType === "kanji" || game.deckType === "vocab") {
    am.hidden = false;
    am.innerHTML =
      `<span class="am-label">Answer with:</span>
       <button class="am-opt ${game.answerMode === "romaji" ? "on" : ""}" data-am="romaji">Romaji reading</button>
       <button class="am-opt ${game.answerMode === "meaning" ? "on" : ""}" data-am="meaning">English meaning</button>`;
    am.querySelectorAll(".am-opt").forEach(b => b.addEventListener("click", () => {
      game.answerMode = b.dataset.am;
      saveAnswerMode(game.deckKey, game.answerMode);
      showModeSelect(); // re-render to reflect selection
    }));
  } else {
    am.hidden = true;
    am.innerHTML = "";
  }

  $("modeGrid").innerHTML = Object.values(MODES).map(m => `
    <button class="mode-card" data-mode="${m.key}">
      <span class="mode-name">${m.label}</span>
      <span class="mode-desc">${m.desc}</span>
      <span class="mode-hi">High score: ${abbrevScore(getHigh(game.deckKey, m.key))}</span>
    </button>`).join("");
  $("modeGrid").querySelectorAll(".mode-card").forEach(b =>
    b.addEventListener("click", () => startGame(b.dataset.mode)));
}

function startGame(modeKey) {
  rebuildGamePool(); // reflect the chosen answer mode
  game.mode = MODES[modeKey];
  game.lives = game.mode.lives;
  game.score = 0n; game.combo = 0; game.bestCombo = 0; game.milestoneMult = 1;
  game.lifeMilestones = {}; // which streak milestones have already paid out a life
  $("milestone").classList.remove("show");
  game.destroyed = 0; game.hits = 0; game.misses = 0;
  game.asteroids = []; game.pops = []; game.beams = []; game.escaped = {};
  game.shipX = canvas.width / 2; game.shipFlash = 0; game.shipFlashBad = 0;
  game.spawnCooldown = 0; game.lastTs = 0;
  game.active = true; game.running = true;
  $("modeSelect").hidden = true;
  $("endScreen").hidden = true;
  $("playArea").hidden = false;
  gameInput.value = "";
  gameInput.classList.remove("flash-red");
  updateHud();
  requestAnimationFrame(layoutGameCanvas); // size canvas to viewport once playArea is laid out
  gameInput.focus();
  cancelAnimationFrame(game.raf);
  game.raf = requestAnimationFrame(gameLoop);
}

// How many full "decks" worth of asteroids the player has cleared this run.
function gameLaps() { return Math.floor(game.destroyed / Math.max(1, game.pool.length)); }
// Difficulty scaling: a steady buildup (+5% every 8 destroyed) PLUS an extra
// kick each time a whole deck's worth of asteroids is cleared — speed climbs and
// more asteroids can crowd the canvas. Higher caps so it keeps escalating.
function speedMult()     { return Math.min(2.6, Math.pow(1.05, Math.floor(game.destroyed / 8)) * (1 + 0.12 * gameLaps())); }
function currentSpeed()  { return game.mode.speed * speedMult(); }
function maxConcurrent() { return Math.min(9, 2 + Math.floor(game.destroyed / 8) + gameLaps()); }

// Choose a spawn x that doesn't overlap terms still in the upper part of the
// screen. Returns null if the top is too crowded (caller should wait & retry).
function chooseSpawnX(r) {
  const margin = r + 12;
  const minX = margin, maxX = Math.max(margin, canvas.width - margin);
  const span = maxX - minX;
  const minGapX = 2 * r + 18;             // min horizontal centre distance (no touching)
  const dangerY = Math.max(3 * r, canvas.height * 0.4); // only avoid terms still high up (prevents vertical stacking)
  const top = game.asteroids.filter(a => a.y < dangerY);
  if (!top.length || span <= 0) return minX + Math.random() * span;

  let best = null, bestDist = -1;
  for (let i = 0; i < 30; i++) {
    const x = minX + Math.random() * span;
    let d = Infinity;
    for (const a of top) d = Math.min(d, Math.abs(a.x - x));
    if (d >= minGapX) return x;            // clear of every nearby term — good
    if (d > bestDist) { bestDist = d; best = x; }
  }
  // Couldn't find a clear column. Only place if the best candidate is still far
  // enough that the circles can't overlap (centre distance > 2r); otherwise hold
  // off and let the caller retry, so terms never stack/obscure each other.
  return bestDist >= 2 * r + 8 ? best : null;
}

function spawnAsteroid() {
  const r = 33;
  const x = chooseSpawnX(r);
  if (x === null) return false;            // top too crowded — skip this tick
  const t = game.pool[Math.floor(Math.random() * game.pool.length)];
  game.asteroids.push({ x, y: -r, r, char: t.char, answers: t.answers, hue: 200 + Math.random() * 130 });
  return true;
}

function addPop(x, y, good) { game.pops.push({ x, y, t: 0, good }); }

// A correct answer: flash the ship green immediately (responsive feedback) and
// launch a bolt at the target. The asteroid is only *locked* (frozen) now — it
// isn't destroyed/scored until the bolt actually reaches it (see update()).
function fireAt(a) {
  if (a.dying) return;
  a.dying = true;
  game.shipFlash = 0.18; // instant green confirmation, independent of the explosion
  game.beams.push({ x1: game.shipX, y1: canvas.height - 40, x2: a.x, y2: a.y, t: 0, travel: 0.09, dur: 0.2, hue: a.hue, popped: false, target: a });
}

// Bolt impact: remove the asteroid, explode it, and award the score now.
function resolveHit(a) {
  const idx = game.asteroids.indexOf(a);
  if (idx < 0) return;
  game.asteroids.splice(idx, 1);
  addPop(a.x, a.y, true);
  game.destroyed++; game.hits++;
  game.combo++; game.bestCombo = Math.max(game.bestCombo, game.combo); // combo == streak
  // Streak milestone: doubles per-asteroid points (re-applies on each streak run).
  // The FIRST time each listed milestone is reached this game it ALSO grants an
  // extra life (never above the mode's cap). Each milestone pays out once, so
  // after a miss you must climb to the next unclaimed milestone for another life.
  if (STREAK_MILESTONES.includes(game.combo)) {
    game.milestoneMult *= 2;
    let gainedLife = false;
    if (!game.lifeMilestones[game.combo]) {
      game.lifeMilestones[game.combo] = true;
      if (game.lives < game.mode.lives) { game.lives++; gainedLife = true; }
    }
    showMilestone("🔥 " + game.combo + "x Streak!" + (gainedLife ? "  ❤️ +1" : ""));
  }
  // points = base(200) × difficulty × streak-tier × milestone — all integers, BigInt-safe.
  const pts = BASE_POINTS * BigInt(game.mode.pts) * BigInt(streakTier(game.combo)) * BigInt(game.milestoneMult);
  game.score += pts;
  updateHud();
}

// Brief celebration overlay over the canvas (fades in fast, out ~1.5s).
function showMilestone(text) {
  const el = $("milestone");
  if (!el) return;
  el.textContent = text;
  el.classList.remove("show");
  void el.offsetWidth; // restart the animation
  el.classList.add("show");
}

function loseLife() { game.lives--; if (game.lives <= 0) endGame(); }

// Tally a miss for the post-game "missed" report. `typed` is what the user
// wrongly entered (for wrong-input misses), or null for an asteroid that escaped.
function recordMiss(char, answer, typed) {
  let m = game.escaped[char];
  if (!m) m = game.escaped[char] = { char, answer, count: 0, typed: {} };
  m.count++;
  if (typed) m.typed[typed] = (m.typed[typed] || 0) + 1;
}

function registerEscape(a) {
  game.misses++; game.combo = 0; game.milestoneMult = 1; // streak (and its milestone bonus) reset
  recordMiss(a.char, a.answers[0], null);
  loseLife();
  updateHud();
}

function flashInput() {
  gameInput.classList.add("flash-red");
  setTimeout(() => gameInput.classList.remove("flash-red"), 300);
}
function registerWrong(typed, target) {
  game.misses++; game.combo = 0; game.milestoneMult = 1; // streak (and its milestone bonus) reset
  flashInput();
  game.shipFlashBad = 0.18; // red ship flash on a wrong entry
  // Log it against the term it most likely targeted, with what was typed.
  if (target) recordMiss(target.char, target.answers[0], typed);
  gameInput.value = "";
  if (game.mode.wrongCostsLife) loseLife();
  updateHud();
}

function onGameInput() {
  if (!game.running) return;
  const val = gameInput.value.trim().toLowerCase();
  if (!val) return;
  // Only consider asteroids not already locked by an in-flight bolt.
  const live = game.asteroids.filter(a => !a.dying);
  // Exact match → the one closest to the ship wins.
  let exact = null;
  for (const a of live)
    if (a.answers.includes(val) && (!exact || a.y > exact.y)) exact = a;
  // Could the text still grow into a *longer* visible answer? (strict prefix)
  const canGrow = live.some(a =>
    a.answers.some(ans => ans.length > val.length && ans.startsWith(val)));
  if (exact) {
    fireAt(exact);
    // If the text is also the start of a longer visible answer (e.g. "n"=ん while
    // "na"=な is still falling, or "go" vs "good"), KEEP it so the player can
    // finish the longer word — an incidental short match shouldn't wipe their
    // progress (which was causing accidental extra-char misses). Otherwise clear.
    if (!canGrow) gameInput.value = "";
    return;
  }
  // Still progressing toward something on screen → keep waiting.
  if (canGrow) return;
  // Dead end (not a prefix of anything visible): count a miss if it's a
  // completed wrong word (length matches a visible answer). Attribute it to the
  // most likely intended term — the closest asteroid with a same-length answer.
  const target = live
    .filter(a => a.answers.some(ans => ans.length === val.length))
    .sort((a, b) => b.y - a.y)[0];
  if (target) registerWrong(val, target);
}

function updateHud() {
  const high = game.score > getHigh(game.deckKey, game.mode.key) ? game.score : getHigh(game.deckKey, game.mode.key);
  $("gScore").textContent = abbrevScore(game.score);
  $("gHigh").textContent  = abbrevScore(high);
  const mult = streakTier(game.combo) * game.milestoneMult; // points multiplier (excl. difficulty)
  $("gCombo").textContent = game.combo > 0 ? "🔥" + game.combo + " ×" + mult : "🔥 0";
  $("gLives").textContent = game.lives > 6 ? "❤×" + game.lives : "❤".repeat(Math.max(0, game.lives));
}

function gameLoop(ts) {
  if (!game.running) return;
  if (!game.lastTs) game.lastTs = ts;
  let dt = (ts - game.lastTs) / 1000;
  game.lastTs = ts;
  if (dt > 0.1) dt = 0.1;
  update(dt);
  draw();
  if (game.running) game.raf = requestAnimationFrame(gameLoop);
}

function update(dt) {
  const spd = currentSpeed();
  const shipY = canvas.height - 46;
  game.spawnCooldown -= dt;
  if (game.asteroids.length < maxConcurrent() && game.spawnCooldown <= 0) {
    const spawned = spawnAsteroid();
    // Full gap after a successful spawn; short retry if we held off (crowded top).
    game.spawnCooldown = spawned ? 0.9 : 0.25;
  }
  for (let i = game.asteroids.length - 1; i >= 0; i--) {
    const a = game.asteroids[i];
    if (a.dying) continue;   // locked by an in-flight bolt: frozen, can't escape
    a.y += spd * dt;
    if (a.y + a.r >= shipY) {
      game.asteroids.splice(i, 1);
      addPop(a.x, shipY - 8, false);
      registerEscape(a);
    }
  }
  game.shipFlash = Math.max(0, (game.shipFlash || 0) - dt);       // fade the green hit-confirm
  game.shipFlashBad = Math.max(0, (game.shipFlashBad || 0) - dt); // fade the red wrong-flash
  for (let i = game.pops.length - 1; i >= 0; i--) {
    game.pops[i].t += dt;
    if (game.pops[i].t > 0.5) game.pops.splice(i, 1);
  }
  // Ship trails the closest (lowest) asteroid at a capped speed, so it's usually
  // still en route — and thus horizontally offset — when it fires, giving the
  // beam a real angle. Recenters when the field is clear.
  let tx = canvas.width / 2, closest = null;
  for (const a of game.asteroids) if (!a.dying && (!closest || a.y > closest.y)) closest = a;
  if (closest) tx = closest.x;
  if (!game.shipX) game.shipX = tx;
  const dx = tx - game.shipX;
  const maxStep = canvas.width * 0.4 * dt;   // ≈ 2.5s to cross the full width
  game.shipX += Math.abs(dx) <= maxStep ? dx : Math.sign(dx) * maxStep;
  // Advance bolts; on impact destroy + score the target, then age them out.
  for (let i = game.beams.length - 1; i >= 0; i--) {
    const b = game.beams[i];
    b.t += dt;
    if (!b.popped && b.t >= b.travel) {
      b.popped = true;
      if (b.target) { b.x2 = b.target.x; b.y2 = b.target.y; resolveHit(b.target); b.target = null; }
      else addPop(b.x2, b.y2, true);
    }
    if (b.t >= b.dur) game.beams.splice(i, 1);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawShip();
  for (const a of game.asteroids) drawAsteroid(a);
  for (const b of game.beams) drawBeam(b);
  for (const p of game.pops) drawPop(p);
}

function drawBeam(b) {
  // A short bright bolt whose head flies from ship → target over b.travel, then
  // the spent streak fades quickly. Reads as an actual shot, not a static flash.
  const len = Math.hypot(b.x2 - b.x1, b.y2 - b.y1) || 1;
  const ux = (b.x2 - b.x1) / len, uy = (b.y2 - b.y1) / len;
  let headDist, alpha;
  if (b.t <= b.travel) {                       // in flight
    headDist = (b.t / b.travel) * len;
    alpha = 1;
  } else {                                      // arrived → fade the spent bolt
    headDist = len;
    alpha = 1 - (b.t - b.travel) / (b.dur - b.travel);
  }
  // Tail stays pinned at the ship so the bolt visibly grows, until it hits its
  // max length (≈ halfway between a full-line beam and the short bolt), after
  // which it trails the head at that fixed length on the way to the target.
  const maxLen = Math.min(len, (len + 26) / 2);
  const tailDist = Math.max(0, headDist - maxLen);
  const hx = b.x1 + ux * headDist, hy = b.y1 + uy * headDist;
  const tx = b.x1 + ux * tailDist, ty = b.y1 + uy * tailDist;
  ctx.save();
  ctx.globalAlpha = Math.max(0, alpha);
  ctx.lineCap = "round";
  ctx.shadowColor = `hsla(${b.hue},90%,70%,1)`;
  ctx.shadowBlur = 14;
  ctx.strokeStyle = `hsla(${b.hue},95%,72%,0.95)`;
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(hx, hy); ctx.stroke();
  ctx.shadowBlur = 0;                            // bright white core
  ctx.strokeStyle = "rgba(255,255,255,0.95)";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(hx, hy); ctx.stroke();
  ctx.restore();
}

// A small corner badge marking a voiced kana: a ring for handakuten (゜), two
// ticks for dakuten (゛). Shape-distinct (and optionally colour-distinct).
function drawDiacriticBadge(cx, cy, s, isHandakuten, color) {
  ctx.save();
  ctx.strokeStyle = color; ctx.lineCap = "round";
  ctx.shadowColor = "rgba(0,0,0,0.9)"; ctx.shadowBlur = 3; // outline for contrast
  if (isHandakuten) {
    ctx.lineWidth = Math.max(2, s * 0.4);
    ctx.beginPath(); ctx.arc(cx, cy, s * 0.62, 0, Math.PI * 2); ctx.stroke();
  } else {
    ctx.lineWidth = Math.max(2, s * 0.38);
    const off = s * 0.42, half = s * 0.62, tilt = s * 0.15;
    for (const dx of [-off, off]) {
      ctx.beginPath();
      ctx.moveTo(cx + dx + tilt, cy - half);
      ctx.lineTo(cx + dx - tilt, cy + half);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawAsteroid(a) {
  ctx.save();
  ctx.shadowColor = `hsla(${a.hue},85%,65%,0.9)`;
  ctx.shadowBlur = 16;
  const g = ctx.createRadialGradient(a.x - 8, a.y - 8, 4, a.x, a.y, a.r);
  g.addColorStop(0, `hsla(${a.hue},48%,34%,1)`);
  g.addColorStop(1, `hsla(${a.hue},48%,17%,1)`);
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.lineWidth = 2;
  ctx.strokeStyle = `hsla(${a.hue},70%,72%,0.5)`;
  ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.stroke();
  ctx.font = "bold 30px -apple-system, 'Segoe UI', sans-serif";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  const info = diacriticInfo(a.char); // handles single kana AND combos (じゃ, ぴゃ…)
  if (!info) {
    ctx.fillStyle = "#fff"; ctx.fillText(a.char, a.x, a.y + 1);
  } else {
    const col = diaMode === "two" ? (info.han ? HAN_COLOR : DAK_COLOR) : diaMode === "text" ? "#fff" : DIA_GOLD;
    if (diaSize === "readable") {                 // smaller shape badge, over the voiced char
      ctx.fillStyle = "#fff"; ctx.fillText(info.baseStr, a.x, a.y + 1);
      const baseChars = Array.from(info.baseStr);
      const total = ctx.measureText(info.baseStr).width;
      const pre = ctx.measureText(baseChars.slice(0, info.index).join("")).width;
      const cw = ctx.measureText(baseChars[info.index]).width || a.r;
      const cx = a.x - total / 2 + pre + cw / 2;
      drawDiacriticBadge(cx + cw * 0.42, a.y - a.r * 0.5, a.r * 0.24, info.han, col);
    } else if (diaMode === "text") {              // natural, plain (everyday look)
      ctx.fillStyle = "#fff"; ctx.fillText(a.char, a.x, a.y + 1);
    } else {                                       // natural size, mark coloured (two-pass)
      ctx.fillStyle = col; ctx.fillText(a.char, a.x, a.y + 1);
      ctx.fillStyle = "#fff"; ctx.fillText(info.baseStr, a.x, a.y + 1);
    }
  }
}

function drawPop(p) {
  const prog = p.t / 0.5;
  const R = (p.good ? 22 : 20) + prog * (p.good ? 42 : 30);
  const col = p.good ? "61,220,151" : "255,107,107";
  ctx.save();
  ctx.globalAlpha = 1 - prog;
  ctx.lineWidth = 3;
  ctx.strokeStyle = `rgba(${col},1)`;
  ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, Math.PI * 2); ctx.stroke();
  ctx.globalAlpha = (1 - prog) * 0.5;
  ctx.fillStyle = `rgba(${col},0.6)`;
  ctx.beginPath(); ctx.arc(p.x, p.y, R * 0.55, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawShip() {
  const x = game.shipX || canvas.width / 2, y = canvas.height - 22;
  const bad = game.shipFlashBad > 0;           // red flash on a wrong entry (takes priority)
  const good = !bad && game.shipFlash > 0;     // green hit-confirm on a correct entry
  const hull = bad ? "#ff6b6b" : good ? "#3ddc97" : "#7c9cff";
  ctx.save();
  ctx.shadowColor = hull; ctx.shadowBlur = (bad || good) ? 22 : 14;
  ctx.fillStyle = hull;
  ctx.beginPath();
  ctx.moveTo(x, y - 18); ctx.lineTo(x - 22, y + 14); ctx.lineTo(x + 22, y + 14);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = bad ? "#2a0c0c" : good ? "#0c2a1d" : "#ff6b9d";
  ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// Draw the ship (idle blue hull) at an arbitrary point on any 2D context — used
// for the deck-picker preview as well as a building block for the live ship.
function drawShipOn(c, x, y) {
  const hull = "#7c9cff";
  c.save();
  c.shadowColor = hull; c.shadowBlur = 16;
  c.fillStyle = hull;
  c.beginPath();
  c.moveTo(x, y - 18); c.lineTo(x - 22, y + 14); c.lineTo(x + 22, y + 14);
  c.closePath(); c.fill();
  c.fillStyle = "#ff6b9d";
  c.beginPath(); c.arc(x, y, 5, 0, Math.PI * 2); c.fill();
  // A soft thruster flame so the idle ship reads as powered-up and ready.
  c.globalAlpha = 0.5 + 0.3 * Math.sin(previewT * 4);
  c.fillStyle = "#ffb347"; c.shadowColor = "#ffb347"; c.shadowBlur = 12;
  c.beginPath();
  c.moveTo(x - 7, y + 14); c.lineTo(x + 7, y + 14); c.lineTo(x, y + 26);
  c.closePath(); c.fill();
  c.restore();
}

// Idle preview shown on the "Choose deck & set" page: the ship gently bobs in the
// centre of a game-style canvas, so the game feels loaded and ready to launch.
let previewRaf = 0, previewT = 0;
function startPreview() {
  stopPreview();
  const pc = $("gamePreview"); if (!pc) return;
  const pctx = pc.getContext("2d");
  (function loop() {
    previewT += 0.02;
    pctx.clearRect(0, 0, pc.width, pc.height);
    const bob = Math.sin(previewT) * 6;
    drawShipOn(pctx, pc.width / 2, pc.height / 2 + bob);
    previewRaf = requestAnimationFrame(loop);
  })();
}
function stopPreview() { if (previewRaf) cancelAnimationFrame(previewRaf); previewRaf = 0; }

function endGame() {
  if (!game.running) return; // guard against multiple escapes in the same frame
  game.running = false;
  cancelAnimationFrame(game.raf);
  const attempts = game.hits + game.misses;
  const acc = attempts ? Math.round((game.hits / attempts) * 100) : 0;
  const prevHigh = getHigh(game.deckKey, game.mode.key);
  const isHigh = game.score > prevHigh;
  const newHigh = isHigh ? game.score : prevHigh;
  if (isHigh) setHigh(game.deckKey, game.mode.key, game.score);
  // Sync the best score for this deck+mode to the cloud leaderboard after EVERY
  // game (idempotent — the cloud keeps the max). Pushing the local best (not just
  // a brand-new high) lets the cloud catch up to highs set before sign-in or
  // before the leaderboard tables existed.
  if (window.KanaSync && KanaSync.onHighScore) {
    try { KanaSync.onHighScore(game.deckKey, game.mode.key, newHigh.toString(), Math.max(0, game.bestCombo)); } catch (e) {}
  }
  markGame(game.score.toString(), Math.max(0, game.bestCombo)); // stats / streak / achievements
  const missed = Object.values(game.escaped).sort((a, b) => b.count - a.count).slice(0, 5);

  // Feed this session into the saved-results history so it shows in Past Results.
  saveResult({
    type: "game",
    date: new Date().toLocaleString(),
    deck: "Game · " + deckLabel(game.deckKey),
    set: game.mode.label + " mode",
    correct: game.hits, total: attempts, pct: acc,
    score: game.score.toString(), // raw full value as string (no precision loss)
    most: missed.map(m => ({ kana: m.char, romaji: m.answer, count: m.count, typed: Object.keys(m.typed || {}) })),
  });

  $("playArea").hidden = true;
  $("endScreen").hidden = false;
  $("endTitle").textContent = (isHigh && game.score > 0n) ? "New High Score! 🏆" : "Game Over";
  $("endStats").innerHTML = `
    <div class="end-row"><span>Final score</span><b>${abbrevScore(game.score)}</b></div>
    <div class="end-full">${fullScore(game.score)} points</div>
    <div class="end-row"><span>High (${game.mode.label})</span><b>${abbrevScore(newHigh)}</b></div>
    <div class="end-row"><span>Accuracy</span><b>${acc}%</b></div>
    <div class="end-row"><span>Destroyed</span><b>${game.hits}</b></div>
    <div class="end-row"><span>Best streak</span><b>🔥${Math.max(0, game.bestCombo)}</b></div>`;
  $("endMissed").innerHTML = missed.length
    ? missed.map(m => {
        const wrongs = Object.keys(m.typed || {});
        const typedHtml = wrongs.length ? ` <span class="miss-typed">— typed ${wrongs.map(selEsc).join(", ")}</span>` : "";
        return `<li><b>${m.char}</b> (${m.answer}) <span class="miss-x">×${m.count}</span>${typedHtml}</li>`;
      }).join("")
    : `<li class="none">No misses — flawless! 🎉</li>`;
  renderEndLeaderboard();
}

// Global leaderboard shown on the end screen: every score across all decks,
// with a coloured difficulty column and difficulty filter chips. Degrades
// gracefully when offline / signed out / DB not yet set up.
let lbFilter = "";    // "" = all difficulties (game mode)
let lbSetFilter = ""; // "" = all sets (deck)
function gameableDeckKeys() { return Object.keys(DECK_DEFS).filter(k => !DECK_DEFS[k].noGame); }
// Shared renderer: arcade-style board with difficulty (mode) chips + a set
// filter, into `el`. Used by both the end-of-game board and the Leaderboards page.
function renderGlobalLeaderboard(el, opts) {
  opts = opts || {};
  const limit = opts.limit || 25;
  if (!el) return;
  const sync = window.KanaSync;
  if (!sync || !sync.fetchGlobalLeaderboard) { el.hidden = true; return; }
  el.hidden = false;
  el.classList.add("lb-retro");
  const diffs = [["", "ALL"], ["easy", "EASY"], ["medium", "MEDIUM"], ["hard", "HARD"], ["insane", "INSANE"]];
  const setOpts = '<option value="">ALL SETS</option>' +
    gameableDeckKeys().map(k => `<option value="${k}"${k === lbSetFilter ? " selected" : ""}>${selEsc(deckLabel(k))}</option>`).join("");
  el.innerHTML =
    (opts.heading ? `<div class="lb-title">${opts.heading}</div>` : "") +
    '<div class="lb-controls">' +
      '<div class="lb-filters">' + diffs.map(([k, lab]) =>
        `<button class="lb-chip${k ? ` diff-${k}` : ""}${k === lbFilter ? " on" : ""}" data-diff="${k}">${lab}</button>`).join("") +
      '</div>' +
      '<label class="lb-setfilter"><span class="lb-set-label">SET</span><select class="lb-set">' + setOpts + '</select></label>' +
    '</div>' +
    '<div class="lb-body"><div class="lb-note">LOADING…</div></div>';
  const body = el.querySelector(".lb-body");
  el.querySelectorAll(".lb-chip").forEach(chip => chip.addEventListener("click", () => {
    lbFilter = chip.dataset.diff;
    el.querySelectorAll(".lb-chip").forEach(x => x.classList.toggle("on", x === chip));
    loadGlobalBoard(body, 0, limit);
  }));
  const setSel = el.querySelector(".lb-set");
  if (setSel) setSel.addEventListener("change", () => { lbSetFilter = setSel.value; loadGlobalBoard(body, 0, limit); });
  loadGlobalBoard(body, opts.initialDelay || 0, limit);
}
function renderEndLeaderboard() {
  renderGlobalLeaderboard($("endLeaderboard"), { heading: "HIGH SCORES", limit: 25, initialDelay: 700 });
}
// Placeholder standings so the board looks alive before real scores roll in.
// Each fits the columns: username · set (deck) · difficulty · score · streak.
const DUMMY_LEADERBOARD = [
  { name: "SakuraStorm",  deck: "katakana", difficulty: "insane", score: "2480000", streak: 96 },
  { name: "kanjiNinja",   deck: "n3",       difficulty: "hard",   score: "1920000", streak: 78 },
  { name: "YukiReads",    deck: "hiragana", difficulty: "insane", score: "1640000", streak: 71 },
  { name: "TanakaPlays",  deck: "n5",       difficulty: "hard",   score: "1180000", streak: 64 },
  { name: "moshiMoshi",   deck: "n5vocab",  difficulty: "medium", score: "940000",  streak: 58 },
  { name: "RamenLover",   deck: "katakana", difficulty: "medium", score: "720000",  streak: 49 },
  { name: "HiraganaHero", deck: "hiragana", difficulty: "easy",   score: "560000",  streak: 120 },
  { name: "NihongoNow",   deck: "n4",       difficulty: "hard",   score: "430000",  streak: 41 },
  { name: "KanaKat",      deck: "n4vocab",  difficulty: "easy",   score: "280000",  streak: 88 },
  { name: "beginnerBen",  deck: "hiragana", difficulty: "easy",   score: "95000",   streak: 33 },
];
function dummyLeaderboard(diff, deck, limit) {
  return DUMMY_LEADERBOARD
    .filter(r => (!diff || r.difficulty === diff) && (!deck || r.deck === deck))
    .slice(0, limit || 25)
    .map(r => Object.assign({ isYou: false, __dummy: true }, r));
}
// Compare two leaderboard rows by score, descending (BigInt — scores can be huge).
function cmpScoreDesc(a, b) {
  try { const A = BigInt(a.score || 0), B = BigInt(b.score || 0); return A > B ? -1 : A < B ? 1 : 0; }
  catch (e) { return 0; }
}
function loadGlobalBoard(body, delay, limit) {
  if (!body) return;
  const sync = window.KanaSync;
  body.innerHTML = '<div class="lb-note">LOADING…</div>';
  // Wait for a just-finished game's score push to complete before fetching, so a
  // fresh high score appears on the board immediately.
  const ready = (sync && sync.flush) ? Promise.resolve(sync.flush()).catch(() => {}) : Promise.resolve();
  ready.then(() => setTimeout(() => {
    sync.fetchGlobalLeaderboard(lbFilter, lbSetFilter, limit || 25).then(real => {
      const signedIn = !!(sync.isReady && sync.isReady());
      const saveFailed = signedIn && sync.scoreSaved && !sync.scoreSaved();
      // Merge real scores with the sample standings so the board always looks
      // populated, then rank them together by score.
      let rows = (real || []).concat(dummyLeaderboard(lbFilter, lbSetFilter, 25));
      rows.sort(cmpScoreDesc);
      rows = rows.slice(0, limit || 25).map((r, i) => Object.assign({}, r, { rank: i + 1 }));
      const sampleShown = rows.some(r => r.__dummy);
      if (!rows.length) {
        body.innerHTML = '<div class="lb-note">NO SCORES FOR THIS SET / MODE YET.</div>';
      } else {
        const head = '<div class="lb-head"><span class="lb-rank">#</span>' +
          '<span class="lb-name">PLAYER · SET</span><span class="diff-badge lb-modeh">MODE</span>' +
          '<span class="lb-score-cell lb-scoreh">SCORE · 🔥</span></div>';
        body.innerHTML = head + '<ol class="lb-list">' + rows.map(r => {
          const mlabel = (MODES[r.difficulty] && MODES[r.difficulty].label) || r.difficulty;
          return `<li class="lb-row${r.isYou ? " you" : ""}${r.__dummy ? " lb-sample" : ""}">` +
            `<span class="lb-rank">${r.rank}</span>` +
            `<span class="lb-name"><span class="lb-who">${selEsc(r.name)}${r.isYou ? ' <span class="lb-you">you</span>' : ""}</span>` +
              `<span class="lb-deck">${selEsc(deckLabel(r.deck))}</span></span>` +
            `<span class="diff-badge diff-${selEsc(r.difficulty)}">${selEsc(mlabel)}</span>` +
            `<span class="lb-score-cell"><span class="lb-score">${abbrevScore(r.score)}</span>` +
              `<span class="lb-streak">🔥 ${Number(r.streak) || 0}</span></span></li>`;
        }).join("") + '</ol>';
      }
      if (saveFailed) {
        const w = document.createElement("div");
        w.className = "lb-myrank lb-warn";
        w.textContent = "⚠ COULDN'T SAVE YOUR SCORE — THE LEADERBOARD DATABASE ISN'T SET UP YET.";
        body.appendChild(w);
      } else if (sampleShown) {
        const note = document.createElement("div");
        note.className = "lb-myrank";
        note.textContent = "★ INCLUDES SAMPLE STANDINGS UNTIL MORE PLAYERS JOIN ★";
        body.appendChild(note);
      }
      if (!signedIn) appendLbSignIn(body);
    });
  }, delay || 0));
}
function appendLbSignIn(el) {
  const d = document.createElement("div");
  d.className = "lb-myrank";
  d.innerHTML = '<button id="lbSignIn" class="ghost">Sign in to post your score</button>';
  el.appendChild(d);
  const b = $("lbSignIn");
  if (b) b.addEventListener("click", () => { const o = $("authOverlay"); if (o) o.classList.add("show"); });
}

// ================== Stats & Achievements ==================
// Local activity log → daily streak, totals, and earnable badges (a "flex" wall).
const STATS_KEY = "anpiStats";
function loadStats() { try { return JSON.parse(localStorage.getItem(STATS_KEY)) || {}; } catch (e) { return {}; } }
function saveStats(s) { try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch (e) {} }
function dayStr(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function todayStr() { return dayStr(new Date()); }
function prevDay(str) { const p = str.split("-").map(Number); const dt = new Date(p[0], p[1] - 1, p[2]); dt.setDate(dt.getDate() - 1); return dayStr(dt); }
function statsTouchToday(s) { s.days = s.days || {}; s.days[todayStr()] = true; }
function markCard(correct) {
  const s = loadStats();
  statsTouchToday(s);
  s.cardsAnswered = (s.cardsAnswered || 0) + 1;
  if (correct) s.cardsCorrect = (s.cardsCorrect || 0) + 1;
  saveStats(s);
}
function markGame(score, streak) {
  const s = loadStats();
  statsTouchToday(s);
  s.gamesPlayed = (s.gamesPlayed || 0) + 1;
  try { if (BigInt(score || 0) > BigInt(s.bestGameScore || 0)) s.bestGameScore = String(score); } catch (e) {}
  if ((streak || 0) > (s.bestGameStreak || 0)) s.bestGameStreak = streak;
  saveStats(s);
}
function currentStreak(s) {
  s = s || loadStats(); const days = s.days || {};
  let n = 0, d = todayStr();
  if (!days[d]) d = prevDay(d);   // today not logged yet → streak still counts through yesterday
  while (days[d]) { n++; d = prevDay(d); }
  return n;
}
function longestStreak(s) {
  s = s || loadStats();
  const keys = Object.keys(s.days || {}).sort();
  let best = 0, cur = 0, prev = null;
  for (const k of keys) { cur = (prev && prevDay(k) === prev) ? cur + 1 : 1; if (cur > best) best = cur; prev = k; }
  return best;
}
const ACHIEVEMENTS = [
  { id: "streak3",  icon: "🔥", name: "On Fire",        desc: "3-day streak",        earned: s => Math.max(currentStreak(s), longestStreak(s)) >= 3 },
  { id: "streak7",  icon: "🔥", name: "Week Warrior",   desc: "7-day streak",        earned: s => Math.max(currentStreak(s), longestStreak(s)) >= 7 },
  { id: "streak30", icon: "📅", name: "Devoted",        desc: "30-day streak",       earned: s => Math.max(currentStreak(s), longestStreak(s)) >= 30 },
  { id: "cards100", icon: "📚", name: "Getting Going",  desc: "Answer 100 cards",    earned: s => (s.cardsAnswered || 0) >= 100 },
  { id: "cards500", icon: "📖", name: "Bookworm",       desc: "Answer 500 cards",    earned: s => (s.cardsAnswered || 0) >= 500 },
  { id: "cards2k",  icon: "🧠", name: "Scholar",        desc: "Answer 2,000 cards",  earned: s => (s.cardsAnswered || 0) >= 2000 },
  { id: "acc90",    icon: "🎯", name: "Sharpshooter",   desc: "90%+ over 100 cards", earned: s => (s.cardsAnswered || 0) >= 100 && (s.cardsCorrect || 0) / (s.cardsAnswered || 1) >= 0.9 },
  { id: "games10",  icon: "🎮", name: "Gamer",          desc: "Play 10 games",       earned: s => (s.gamesPlayed || 0) >= 10 },
  { id: "games50",  icon: "👾", name: "Arcade Regular", desc: "Play 50 games",       earned: s => (s.gamesPlayed || 0) >= 50 },
  { id: "combo50",  icon: "⚡", name: "Combo Master",   desc: "50× game streak",     earned: s => (s.bestGameStreak || 0) >= 50 },
  { id: "combo100", icon: "💥", name: "Unstoppable",    desc: "100× game streak",    earned: s => (s.bestGameStreak || 0) >= 100 },
  { id: "score1m",  icon: "💎", name: "Millionaire",    desc: "Score 1M in a game",  earned: s => { try { return BigInt(s.bestGameScore || 0) >= 1000000n; } catch (e) { return false; } } },
];
function showStatsView() { if (game.active) backToStudy(); setMainView("stats"); renderStats(); }
function renderStats() {
  const wrap = $("statsBody"); if (!wrap) return;
  const s = loadStats();
  const cur = currentStreak(s), longest = longestStreak(s);
  const cards = s.cardsAnswered || 0, correct = s.cardsCorrect || 0;
  const acc = cards ? Math.round(correct / cards * 100) : 0;
  const earnedList = ACHIEVEMENTS.filter(a => { try { return a.earned(s); } catch (e) { return false; } });
  const tiles = [
    ["CARDS", cards.toLocaleString()],
    ["ACCURACY", cards ? acc + "%" : "—"],
    ["GAMES", (s.gamesPlayed || 0).toLocaleString()],
    ["BEST SCORE", s.bestGameScore ? abbrevScore(s.bestGameScore) : "—"],
    ["BEST COMBO", (s.bestGameStreak || 0) ? "🔥" + s.bestGameStreak : "—"],
    ["BADGES", earnedList.length + "/" + ACHIEVEMENTS.length],
  ];
  wrap.innerHTML =
    '<div class="stats-streak"><div class="num">🔥 ' + cur + '</div><div class="lbl">DAY STREAK' +
      (longest > cur ? ' · BEST ' + longest : '') + '</div></div>' +
    '<div class="stat-tiles">' + tiles.map(t =>
      '<div class="stat-tile"><div class="v">' + selEsc(t[1]) + '</div><div class="k">' + t[0] + '</div></div>').join("") + '</div>' +
    '<div class="ach-title">★ ACHIEVEMENTS ★</div>' +
    '<div class="ach-grid">' + ACHIEVEMENTS.map(a => {
      const got = earnedList.indexOf(a) > -1;
      return '<div class="ach ' + (got ? "earned" : "locked") + '" title="' + selEsc(a.desc) + '">' +
        '<div class="ico">' + a.icon + '</div><div class="nm">' + selEsc(a.name) + '</div>' +
        '<div class="ds">' + selEsc(got ? "✓" : a.desc) + '</div></div>';
    }).join("") + '</div>' +
    '<div class="ach-title">🏆 LEADERBOARD PODIUMS</div><div id="statsPodiums" class="badges-list"><div class="lb-note">…</div></div>';
  renderStatsPodiums();
}
function renderStatsPodiums() {
  const el = $("statsPodiums"); if (!el) return;
  const sync = window.KanaSync;
  if (!sync || !sync.isReady || !sync.isReady() || !sync.fetchMyPodiums) {
    el.innerHTML = '<div class="lb-note">Sign in &amp; reach a leaderboard top-3 to earn podium badges.</div>';
    return;
  }
  sync.fetchMyPodiums().then(rows => {
    const podiums = rows || [];
    if (!podiums.length) { el.innerHTML = '<div class="lb-note">No top-3 finishes yet — climb a leaderboard!</div>'; return; }
    const medals = ["🥇", "🥈", "🥉"];
    const mlabel = k => (MODES[k] && MODES[k].label) || k;
    el.innerHTML = podiums.map(p =>
      '<div class="badge-item diff-' + selEsc(p.difficulty) + '"><span class="badge-medal">' + (medals[(p.rank || 3) - 1] || "🏅") + '</span>' +
      '<span class="badge-where">' + selEsc(deckLabel(p.deck_id)) + ' · <b>' + selEsc(mlabel(p.difficulty)) + '</b></span></div>').join("");
  });
}

// ---------- Events ----------
document.querySelectorAll(".deck[data-game]").forEach(btn => {
  btn.addEventListener("click", () => { launchGame(btn.dataset.game); btn.blur();
    document.querySelectorAll(".deck").forEach(b => b.classList.remove("active")); btn.classList.add("active"); });
});
gameInput.addEventListener("input", onGameInput);
gameInput.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); onGameInput(); } });
canvas.addEventListener("click", () => gameInput.focus());
// Keep the canvas fitted to the viewport (rotation, resize, soft-keyboard show/hide).
window.addEventListener("resize", layoutGameCanvas);
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", layoutGameCanvas);
  window.visualViewport.addEventListener("scroll", layoutGameCanvas);
}
gameInput.addEventListener("focus", () => setTimeout(layoutGameCanvas, 120)); // iOS keyboard backup
gameInput.addEventListener("blur", () => setTimeout(layoutGameCanvas, 120));
$("gameExit").addEventListener("click", exitGameToPicker);
$("gameExitFromMode").addEventListener("click", showDeckPicker); // difficulty → back to deck/set
$("playAgain").addEventListener("click", () => startGame(game.mode.key));
$("changeMode").addEventListener("click", showModeSelect);
$("changeDeck").addEventListener("click", showDeckPicker);
$("endToStudy").addEventListener("click", showHome);
// Deck/set picker
$("gameDeckSelect").addEventListener("change", updateGameSetVisibility);
$("deckPickerNext").addEventListener("click", gamePickerContinue);
$("deckPickerBack").addEventListener("click", showHome);

// ---------- Game "How to play" tutorial (first visit + replay button) ----------
const GAME_TUT_KEY = "anpiGameTutSeen";
function showGameTutorial() { $("gameTutorial").classList.add("show"); }
function closeGameTutorial() { $("gameTutorial").classList.remove("show"); try { localStorage.setItem(GAME_TUT_KEY, "1"); } catch {} }
function maybeShowGameTutorial() {
  let seen = false; try { seen = localStorage.getItem(GAME_TUT_KEY) === "1"; } catch {}
  if (!seen) showGameTutorial();
}
$("gameTutClose").addEventListener("click", closeGameTutorial);
$("gameTutReplay").addEventListener("click", showGameTutorial);
$("gameTutorial").addEventListener("click", e => { if (e.target === $("gameTutorial")) closeGameTutorial(); });

// ---------- Study events ----------
// Delegated: handles static AND dynamically-injected study deck/set buttons.
// Game buttons (data-game) are wired separately and ignored here.
$("sidebar").addEventListener("click", e => {
  const btn = e.target.closest(".deck[data-sel], .deck[data-deck]");
  if (!btn || btn.hasAttribute("data-game")) return;
  selectSet(btn.dataset.sel || btn.dataset.deck);
  btn.blur();
});
$("sidebarToggle").addEventListener("click", () => { toggleSidebar(); $("sidebarToggle").blur(); });

// Deck dropdown → switch section (restoring that section's last set if known).
deckSelect.addEventListener("change", () => {
  const d = TOP_DECKS.find(x => x.key === deckSelect.value);
  if (!d) return;
  let sel = d.sets[0].id;
  try { const saved = localStorage.getItem(SEL_SECTION_KEY(d.key)); if (saved && SET_BY_ID[saved]) sel = saved; } catch (e) {}
  selectSet(sel);
});
// Set dropdown → select that subset within the current section.
groupSelect.addEventListener("change", () => selectSet(groupSelect.value));
$("shuffleBtn").addEventListener("click", () => { if (tourActive) return; shuffle(); });
$("yesBtn").addEventListener("click", e => { e.stopPropagation(); if (tourActive) return; answer(true); });
$("noBtn").addEventListener("click",  e => { e.stopPropagation(); if (tourActive) return; answer(false); });

// ---------- Card tap/click zones: left 25% back · center 50% flip · right 25% correct+next ----------
function flashZone(el, type) {
  const cls = type === "green" ? "flash-green" : "flash-neutral";
  el.classList.remove(cls);
  void el.offsetWidth; // restart the animation
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), 420);
}
// Right edge: force "correct" then advance (equivalent to the ↑ key).
function markCorrectAndNext() {
  if (deck.length === 0) return;
  pauseFrontTimer();
  results[index] = true;
  advance();
  checkComplete();
}
$("zoneCenter").addEventListener("click", () => { flip(); }); // flip stays available (used in the tour)
$("zoneRight").addEventListener("click", () => { if (tourActive) return; flashZone($("zoneRight"), "green"); markCorrectAndNext(); });
$("zoneLeft").addEventListener("click",  () => { if (tourActive) return; flashZone($("zoneLeft"), "neutral"); prev(); });
// Closing the report saves are already done — reset everything to start over.
$("closeReport").addEventListener("click", () => { hideReport(); buildDeck(); });
$("historyBtn").addEventListener("click", showHistory);
$("closeHist").addEventListener("click", hideHistory);
$("clearHist").addEventListener("click", () => { clearResults(); showHistory(); });

// Field-visibility panel
$("fieldPanelToggle").addEventListener("click", () => { toggleFieldPanel(); $("fieldPanelToggle").blur(); });

// Voiced-kana mark colour mode (display preference, applies everywhere via a body class).
const DIA_COLOR_KEY = "anpiDiaColor";
function applyDiaMode(mode) {
  diaMode = (mode === "two" || mode === "text") ? mode : "gold";
  document.body.classList.toggle("dia-twocolor", diaMode === "two");
  document.body.classList.toggle("dia-text", diaMode === "text");
  [$("diaLegend"), $("diaLegendGame")].forEach(lg => { if (lg) lg.hidden = diaMode !== "two"; });
  [$("diaColorSel"), $("diaColorSelGame")].forEach(sel => { if (sel) sel.value = diaMode; });
}
(function () {
  let m = "gold";
  try { const v = localStorage.getItem(DIA_COLOR_KEY); m = v === "1" ? "two" : (v === "two" || v === "text") ? v : "gold"; } catch (e) {}
  applyDiaMode(m);
})();
$("diaColorSel").addEventListener("change", e => {
  try { localStorage.setItem(DIA_COLOR_KEY, e.target.value); } catch (e2) {}
  applyDiaMode(e.target.value);
});

const DIA_SIZE_KEY = "anpiDiaSize";
function applyDiaSize(sz) {
  diaSize = sz === "natural" ? "natural" : "readable";
  document.body.classList.toggle("dia-sz-readable", diaSize === "readable");
  [$("diaSizeSel"), $("diaSizeSelGame")].forEach(sel => { if (sel) sel.value = diaSize; });
}
(function () { let s = "readable"; try { const v = localStorage.getItem(DIA_SIZE_KEY); if (v === "natural" || v === "readable") s = v; } catch (e) {} applyDiaSize(s); })();
$("diaSizeSel").addEventListener("change", e => {
  try { localStorage.setItem(DIA_SIZE_KEY, e.target.value); } catch (e2) {}
  applyDiaSize(e.target.value);
});

// Same controls available in game mode (changeable before or during a game).
$("diaColorSelGame").addEventListener("change", e => {
  try { localStorage.setItem(DIA_COLOR_KEY, e.target.value); } catch (e2) {}
  applyDiaMode(e.target.value);
});
$("diaSizeSelGame").addEventListener("change", e => {
  try { localStorage.setItem(DIA_SIZE_KEY, e.target.value); } catch (e2) {}
  applyDiaSize(e.target.value);
});
$("gameDiaBtn").addEventListener("click", e => { e.stopPropagation(); $("gameDiaPanel").hidden = !$("gameDiaPanel").hidden; });
document.addEventListener("click", e => {
  const p = $("gameDiaPanel");
  if (p && !p.hidden && !p.contains(e.target) && e.target !== $("gameDiaBtn")) p.hidden = true;
});

// Pronunciation: manual replay (Google Translate TTS provides one consistent voice)
$("speakerBtn").addEventListener("click", e => { e.stopPropagation(); speak(currentSpeakText()); });
// Auto-play toggle in the settings panel; disable + note it if there's no TTS.
(function initAudioToggle() {
  const chk = $("autoSpeakChk");
  if (chk) { chk.checked = autoSpeak; chk.addEventListener("change", () => setAutoSpeak(chk.checked)); }
  updateAudioNote(); // shows the "install a JP voice" tip only when none is found
})();

// ---------- First-visit tutorial ----------
const TUT_KEY = "kanaTutorialSeen";
let tutTimers = [];
function startTutorial() {
  const tut = $("tutorial");
  tutTimers.forEach(clearTimeout); tutTimers = [];
  tut.hidden = false;
  $("tutDismiss").hidden = true;
  const steps = [
    { cls: "step1", text: "Tap center to flip" },
    { cls: "step2", text: "Tap right edge to mark correct and advance" },
    { cls: "step3", text: "Tap left edge to go back" },
  ];
  function showStep(n) {
    tut.classList.remove("step1", "step2", "step3");
    tut.classList.add(steps[n].cls);
    $("tutText").textContent = steps[n].text;
  }
  let i = 0;
  showStep(0);
  function nextStep() {
    i++;
    if (i < steps.length) { showStep(i); tutTimers.push(setTimeout(nextStep, 2000)); }
    else { $("tutDismiss").hidden = false; } // last step stays until dismissed
  }
  tutTimers.push(setTimeout(nextStep, 2000));
}
function endTutorial() {
  const tut = $("tutorial");
  tutTimers.forEach(clearTimeout); tutTimers = [];
  tut.hidden = true;
  tut.classList.remove("step1", "step2", "step3");
  try { localStorage.setItem(TUT_KEY, "1"); } catch {}
}
function maybeShowTutorial() {
  let seen = false;
  try { seen = localStorage.getItem(TUT_KEY) === "1"; } catch {}
  if (!seen) startTutorial();
}
$("tutDismiss").addEventListener("click", endTutorial);
$("tutorialReplay").addEventListener("click", () => { startTour(); });

document.addEventListener("keydown", e => {
  if (e.target.tagName === "SELECT") return;
  if (tourActive) return; // tour running → ignore study shortcuts (no card manipulation)
  // While the tutorial is showing, swallow shortcuts; Esc (or Enter/Space once
  // the "Got it" button is up) dismisses it.
  if (!$("tutorial").hidden) {
    if (e.code === "Escape") { e.preventDefault(); endTutorial(); }
    else if ((e.code === "Enter" || e.code === "Space") && !$("tutDismiss").hidden) { e.preventDefault(); endTutorial(); }
    return;
  }
  // The game has its own input handling — let Esc bail out, ignore study shortcuts.
  if (game.active) {
    if (e.code === "Escape") { e.preventDefault(); exitGameToPicker(); }
    return;
  }
  // While the history overlay is open, only allow closing it.
  if ($("histOverlay").classList.contains("show")) {
    if (e.code === "Escape" || e.code === "Enter") { e.preventDefault(); hideHistory(); }
    return;
  }
  // While the report overlay is open, any of these keys saves+restarts.
  if ($("overlay").classList.contains("show")) {
    if (e.code === "Escape" || e.code === "Enter" || e.code === "Space") {
      e.preventDefault(); hideReport(); buildDeck();
    }
    return;
  }
  if (e.code === "Space") { e.preventDefault(); flip(); }
  else if (e.code === "ArrowUp")   { e.preventDefault(); answer(true); }
  else if (e.code === "ArrowDown") { e.preventDefault(); answer(false); }
  else if (e.code === "ArrowRight") next();
  else if (e.code === "ArrowLeft") prev();
  else if (e.key.toLowerCase() === "s") shuffle();
});

// =====================================================================
//  Guided learning path ("Learn") — Phase 1: placement + path + lessons.
//  Soft progression (nothing locked); progress saved in localStorage. The
//  content lives in lib/curriculum.js so units can be added without touching
//  this renderer.
// =====================================================================
const LEARN_KEY = "anpiLearn";
let learnState = { level: null, done: {} };
let currentLessonId = null;
function loadLearnState() {
  try { const s = JSON.parse(localStorage.getItem(LEARN_KEY) || "{}"); learnState = { level: s.level || null, done: s.done || {} }; }
  catch (e) { learnState = { level: null, done: {} }; }
}
function saveLearnState() { try { localStorage.setItem(LEARN_KEY, JSON.stringify(learnState)); } catch (e) {} }

const curUnits = () => (window.CURRICULUM && CURRICULUM.units) || [];
const curLevels = () => (window.CURRICULUM && CURRICULUM.levels) || [];
const unitById = id => curUnits().find(u => u.id === id);
function startIndexForLevel(levelId) {
  const lv = curLevels().find(l => l.id === levelId);
  if (!lv || !lv.start) return 0;
  const i = curUnits().findIndex(u => u.id === lv.start);
  return i < 0 ? 0 : i;
}
// First not-done unit at/after the placement start = the recommended next step.
function recommendedUnitId() {
  const units = curUnits(), startI = startIndexForLevel(learnState.level);
  for (let i = startI; i < units.length; i++) if (!learnState.done[units[i].id]) return units[i].id;
  for (let i = 0; i < units.length; i++) if (!learnState.done[units[i].id]) return units[i].id;
  return null;
}

function showLearnView() {
  if (game.active) backToStudy();
  setMainView("learn");
  loadLearnState();
  if (learnState.level && learnState.level !== "explore") renderLearnPath();
  else renderLearnPlacement();
}
function showLearnScreen(which) {
  $("learnPlacement").hidden = which !== "placement";
  $("learnTest").hidden = which !== "test";
  $("learnPath").hidden = which !== "path";
  $("learnLesson").hidden = which !== "lesson";
}

// ---- Placement test ----
let testIdx = 0, testBest = null, placementNote = "";
const TIER_RANK = { kana: 1, n5: 2, n4: 3, n3: 4 };
const curPlacement = () => (window.CURRICULUM && CURRICULUM.placement) || [];
function startTest() { testIdx = 0; testBest = null; renderTestQuestion(); showLearnScreen("test"); }
function renderTestQuestion() {
  const qs = curPlacement(), q = qs[testIdx];
  if (!q) return finishTest();
  $("testProg").textContent = "Question " + (testIdx + 1) + " of " + qs.length;
  $("testQ").textContent = q.q;
  $("testChoices").innerHTML = q.choices.map((c, i) => `<button class="test-choice" data-i="${i}">${selEsc(c)}</button>`).join("");
  $("testChoices").querySelectorAll(".test-choice").forEach(b => b.addEventListener("click", () => answerTest(+b.dataset.i)));
}
function answerTest(i) {
  const q = curPlacement()[testIdx];
  if (q && i === q.answer && (!testBest || TIER_RANK[q.tier] > TIER_RANK[testBest])) testBest = q.tier;
  testIdx++; renderTestQuestion();
}
function finishTest() {
  const level = testBest || "zero"; // nothing correct → absolute beginner
  learnState.level = level; saveLearnState();
  const lv = curLevels().find(l => l.id === level);
  placementNote = "Based on your answers, we placed you at: " + (lv ? lv.label : level) + ". You can change this anytime with “Change level”.";
  renderLearnPath();
}

function renderLearnPlacement() {
  const wrap = $("learnLevels");
  wrap.innerHTML = curLevels().map(l =>
    `<button class="learn-level" data-level="${l.id}">
       <span class="ll-title">${selEsc(l.label)}</span>
       <span class="ll-desc">${selEsc(l.desc)}</span>
     </button>`).join("");
  wrap.querySelectorAll(".learn-level").forEach(b => b.addEventListener("click", () => chooseLevel(b.dataset.level)));
  showLearnScreen("placement");
}
function chooseLevel(id) {
  learnState.level = id; saveLearnState();
  if (id === "explore") { setMainView("study"); return; } // bow out to free navigation
  renderLearnPath();
}

// ====================== Journey map (the path as a trip up Japan) ======================
let learnMapMode = (function () { try { return localStorage.getItem("anpiLearnView") !== "list"; } catch (e) { return true; } })();
const journeyById = {};
function buildJourneyIndex() { const j = (window.CURRICULUM && CURRICULUM.journey) || []; j.forEach(x => { journeyById[x.id] = x; }); }
const REGION_TINT = {
  "Okinawa": "#ff6b9d", "Kyūshū": "#ff9f43", "Shikoku": "#feca57", "Chūgoku": "#1dd1a1",
  "Kansai": "#54a0ff", "Chūbu": "#a06bff", "Kantō": "#00d2d3", "Tōhoku": "#c8a2ff", "Hokkaidō": "#48dbfb",
};
// ---- pan / zoom (drives the SVG viewBox) ----
let jmapView = null; // {x,y,w,h} — persists across re-renders so zoom is kept
function jmapApplyView(svg) {
  if (svg && jmapView) svg.setAttribute("viewBox", `${jmapView.x.toFixed(1)} ${jmapView.y.toFixed(1)} ${jmapView.w.toFixed(1)} ${jmapView.h.toFixed(1)}`);
}
function jmapAttachPanZoom(svg, wrap) {
  const M = window.JAPAN_MAP; if (!M || !svg) return;
  const MINW = M.W * 0.2, MAXW = M.W, AR = M.H / M.W;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function clampView(v) { v.w = clamp(v.w, MINW, MAXW); v.h = v.w * AR; v.x = clamp(v.x, 0, M.W - v.w); v.y = clamp(v.y, 0, M.H - v.h); return v; }
  function zoomAt(factor, clientX, clientY) {
    const r = svg.getBoundingClientRect(); if (!r.width) return; const v = jmapView;
    const nw = clamp(v.w * factor, MINW, MAXW), nh = nw * AR;
    const fx = v.x + (clientX - r.left) / r.width * v.w, fy = v.y + (clientY - r.top) / r.height * v.h;
    jmapView = clampView({ x: fx - (clientX - r.left) / r.width * nw, y: fy - (clientY - r.top) / r.height * nh, w: nw, h: nh });
    jmapApplyView(svg);
  }
  svg.addEventListener("wheel", e => { e.preventDefault(); zoomAt(e.deltaY > 0 ? 1.15 : 1 / 1.15, e.clientX, e.clientY); }, { passive: false });
  const pts = new Map(); let last = null, pinchD = 0, pinchMid = null, moved = false;
  svg.addEventListener("pointerdown", e => {
    try { svg.setPointerCapture(e.pointerId); } catch (x) {}
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); moved = false;
    if (pts.size === 1) { last = { x: e.clientX, y: e.clientY }; svg.classList.add("grabbing"); }
    else if (pts.size === 2) { const a = [...pts.values()]; pinchD = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y); pinchMid = { x: (a[0].x + a[1].x) / 2, y: (a[0].y + a[1].y) / 2 }; }
  });
  svg.addEventListener("pointermove", e => {
    if (!pts.has(e.pointerId)) return; pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const r = svg.getBoundingClientRect(); if (!r.width) return; const v = jmapView;
    if (pts.size === 1 && last) {
      const dx = e.clientX - last.x, dy = e.clientY - last.y; if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
      v.x -= dx / r.width * v.w; v.y -= dy / r.height * v.h; clampView(v); jmapApplyView(svg); last = { x: e.clientX, y: e.clientY };
    } else if (pts.size === 2) {
      const a = [...pts.values()]; const d = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y); const mid = { x: (a[0].x + a[1].x) / 2, y: (a[0].y + a[1].y) / 2 };
      if (pinchD > 0 && d > 0) zoomAt(pinchD / d, mid.x, mid.y);
      if (pinchMid) { const v2 = jmapView; v2.x -= (mid.x - pinchMid.x) / r.width * v2.w; v2.y -= (mid.y - pinchMid.y) / r.height * v2.h; clampView(v2); jmapApplyView(svg); }
      pinchD = d; pinchMid = mid; moved = true;
    }
  });
  function up(e) { pts.delete(e.pointerId); if (pts.size < 2) { pinchD = 0; pinchMid = null; } if (pts.size === 1) { const a = [...pts.values()][0]; last = { x: a.x, y: a.y }; } if (pts.size === 0) svg.classList.remove("grabbing"); }
  svg.addEventListener("pointerup", up); svg.addEventListener("pointercancel", up); svg.addEventListener("lostpointercapture", up);
  // swallow the click that ends a drag so it doesn't open a lesson
  svg.addEventListener("click", e => { if (moved) { e.stopPropagation(); moved = false; } }, true);
  if (wrap) wrap.querySelectorAll(".jmap-zbtn").forEach(b => b.addEventListener("click", () => { const r = svg.getBoundingClientRect(); zoomAt(b.dataset.z === "in" ? 1 / 1.45 : 1.45, r.left + r.width / 2, r.top + r.height / 2); }));
}
// Approximate [lng, lat] pin for each lesson, spread across the whole country.
const JOURNEY_XY = {
  scripts: [123.78, 24.06], "hiragana-basic": [124.16, 24.34], "hiragana-dakuten": [125.28, 24.80],
  "hiragana-yoon": [127.30, 26.20], "kana-extras": [127.68, 26.21], katakana: [127.88, 26.69],
  pronunciation: [129.50, 28.38], "kanji-readings": [130.50, 30.36], "names-titles": [130.65, 31.25],
  rendaku: [130.66, 31.59], "how-to-study": [130.87, 31.92], "pitch-accent": [131.42, 31.91],
  "n5-kanji": [131.47, 31.74], "n5-numbers": [130.71, 32.80], "n5-vocab": [131.10, 32.88],
  "n5-particles": [129.87, 32.75], "n5-grammar": [129.72, 33.18], "n5-phrases": [130.30, 33.32],
  "verb-groups": [130.40, 33.59], adjectives: [130.52, 33.51], kosoado: [130.88, 33.88],
  counters: [131.50, 33.28], "time-dates": [131.36, 33.26], "big-numbers": [131.80, 33.12],
  comparisons: [133.53, 33.56], "family-terms": [133.02, 32.72], adverbs: [132.77, 33.84],
  restaurant: [132.55, 33.51], shopping: [134.55, 34.07], directions: [134.61, 34.23],
  weather: [134.05, 34.34], food: [133.82, 34.18], "hobbies-routine": [133.93, 34.66],
  "n4-kanji": [133.77, 34.59], "n4-vocab": [132.46, 34.39], "n4-teform": [132.32, 34.30],
  "n4-grammar": [133.20, 34.41], "giving-receiving": [132.22, 34.17], transitivity: [131.40, 34.41],
  "potential-volitional": [134.23, 35.54], quoting: [133.05, 35.47], "time-clauses": [132.69, 35.40],
  "permission-obligation": [134.69, 34.84], doctor: [135.20, 34.69], admin: [135.50, 34.69],
  "phone-emergency": [135.84, 34.69], technology: [135.77, 35.01], "work-school": [135.68, 35.01],
  emotions: [135.81, 34.88], travel: [135.58, 34.21], "common-mistakes": [135.89, 33.67],
  "numbers-life": [136.72, 34.46], "n3-kanji": [136.91, 35.18], "n3-vocab": [136.94, 35.39],
  "n3-grammar": [136.91, 36.26], "keigo-levels": [137.25, 36.15], "passive-causative": [136.66, 36.56],
  nominalization: [137.10, 37.30], onomatopoeia: [137.62, 36.58], conjunctions: [136.36, 36.05],
  "reading-strategy": [137.97, 36.24], dialects: [138.19, 36.66], nature: [137.64, 36.25],
  "particle-combos": [138.73, 35.36], relationships: [138.52, 35.01], health: [139.03, 35.23],
  "n2-kanji": [139.64, 35.44], "n2-vocab": [139.70, 35.69], "n2-grammar": [139.80, 35.71],
  "written-style": [139.60, 36.75], "sentence-particles": [138.60, 36.62], "near-synonyms": [140.45, 36.38],
  "formal-writing": [139.93, 37.49], "n1-kanji": [140.87, 38.27], "n1-vocab": [141.07, 38.37],
  "casual-speech": [140.43, 38.31], loanwords: [140.56, 39.59], aizuchi: [141.11, 38.99],
  proverbs: [140.46, 40.60], "academic-vocab": [140.73, 41.77], "reading-genres": [141.35, 43.06],
  "advanced-kanji": [141.00, 43.19], "classical-grammar": [142.38, 43.34], "n1-grammar": [141.93, 45.42],
  "home-objects": [129.97, 33.45], conditionals: [130.94, 33.96], leisure: [135.87, 35.00],
  certainty: [139.02, 37.90], news: [140.12, 35.61],
  "greetings-intro": [132.56, 33.22], colors: [131.77, 34.46], "change-becoming": [135.19, 34.23],
  "cause-reason": [138.63, 36.35], idioms: [139.84, 38.91],
  "annual-events": [131.31, 32.71], clarifying: [134.18, 34.74], "apolog-thanks": [135.37, 34.46],
  opinions: [138.57, 35.66], "science-tech": [140.10, 36.08],
  "music-pop": [135.36, 34.81], "eating-out": [137.39, 34.77], hypotheticals: [136.99, 36.85],
  business: [137.73, 34.71], ceremonies: [143.20, 42.92],
  transportation: [137.16, 35.08], "how-to": [136.92, 35.50], quantity: [139.49, 35.92],
  "service-keigo": [141.49, 40.51], rhetoric: [144.38, 42.98],
};

// smooth "bendy" curve through points (Catmull-Rom → cubic Bézier)
function jmapSpline(pts) {
  if (!pts || pts.length < 2) return pts && pts.length ? `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}` : "";
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 5, c1y = p1[1] + (p2[1] - p0[1]) / 5;
    const c2x = p2[0] - (p3[0] - p1[0]) / 5, c2y = p2[1] - (p3[1] - p1[1]) / 5;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}
function renderLearnMapSVG(units, recId, startI) {
  buildJourneyIndex();
  const wrap = $("learnMap"); if (!wrap) return;
  const M = window.JAPAN_MAP;
  if (!M) { wrap.innerHTML = ""; return; }
  const pr = M.proj;
  const proj = (lng, lat) => [(lng - pr.minLng) * pr.kx * pr.S, (pr.maxLat - lat) * pr.S];
  const land = M.paths.map(d => `<path d="${d}"/>`).join("");

  let dots = "";
  const ordered = []; let recOrderIdx = -1;   // projected points in journey order
  units.forEach((u, i) => {
    const c = JOURNEY_XY[u.id]; if (!c) return;
    const xy = proj(c[0], c[1]);
    ordered.push(xy); if (u.id === recId) recOrderIdx = ordered.length - 1;
    const j = journeyById[u.id] || {}, region = j.region || "";
    const done = !!learnState.done[u.id];
    const isNext = u.id === recId;
    const optional = i < startI && !done;
    const status = done ? "done" : isNext ? "next" : optional ? "opt" : "todo";
    const tint = REGION_TINT[region] || "#8a93c9";
    const r = isNext ? 11 : done ? 8.5 : 7;
    dots += `<g class="jdot ${status}" data-unit="${u.id}" style="--rc:${tint}" transform="translate(${xy[0].toFixed(1)} ${xy[1].toFixed(1)})">
      ${isNext ? '<circle class="jdot-pulse" r="22"/>' : ""}
      <circle class="jdot-c" r="${r}"/>
      <circle class="jdot-hit" r="20" fill="transparent"/>
      <title>${selEsc(j.place || "")}${j.pref ? " (" + selEsc(j.pref) + ")" : ""} — ${selEsc(u.title)}</title>
    </g>`;
  });
  // the winding "adventure trail" through every stop, in order
  const fullRoute = jmapSpline(ordered);
  const litRoute = recOrderIdx > 0 ? jmapSpline(ordered.slice(0, recOrderIdx + 1)) : "";
  wrap.style.height = "";
  wrap.innerHTML = `<svg class="jmap-svg2" viewBox="${M.viewBox}" preserveAspectRatio="xMidYMid meet">
    <g class="jmap-land">${land}</g>
    <path class="jroute" d="${fullRoute}" vector-effect="non-scaling-stroke" />
    ${litRoute ? `<path class="jroute lit" d="${litRoute}" vector-effect="non-scaling-stroke" />` : ""}
    <g class="jmap-dots">${dots}</g>
  </svg>
  <div class="jmap-zoom"><button class="jmap-zbtn" data-z="in" aria-label="Zoom in">+</button><button class="jmap-zbtn" data-z="out" aria-label="Zoom out">−</button></div>`;
  const svgEl = wrap.querySelector(".jmap-svg2");
  if (!jmapView) jmapView = { x: 0, y: 0, w: M.W, h: M.H };
  jmapAttachPanZoom(svgEl, wrap);
  jmapApplyView(svgEl);
  wrap.querySelectorAll(".jdot").forEach(g => g.addEventListener("click", () => openLesson(g.dataset.unit)));
}
// ===================== MapLibre satellite journey map =====================
let glMap = null, glHere = null, glIntroPlayed = false, glRO = null;
// Catmull-Rom densified spline through [lng,lat] points → smooth bendy trail
function geoSpline(pts, seg) {
  seg = seg || 18;
  if (!pts || pts.length < 2) return pts ? pts.slice() : [];
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    for (let t = 0; t < seg; t++) {
      const s = t / seg, s2 = s * s, s3 = s2 * s;
      const x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * s + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * s2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * s3);
      const y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * s + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * s2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * s3);
      out.push([x, y]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}
// gather ordered [lng,lat] stops + dot descriptors for the current units/progress
function glBuildData(units, recId, startI) {
  buildJourneyIndex();
  const ordered = []; let recIdx = -1, curLngLat = null;
  const dots = [];
  units.forEach((u, i) => {
    const c = JOURNEY_XY[u.id]; if (!c) return;
    ordered.push(c);
    const j = journeyById[u.id] || {}, region = j.region || "";
    const done = !!learnState.done[u.id];
    const isNext = u.id === recId;
    const optional = i < startI && !done;
    const status = done ? "done" : isNext ? "next" : optional ? "opt" : "todo";
    if (isNext) { recIdx = ordered.length - 1; curLngLat = c; }
    const tint = REGION_TINT[region] || "#8a93c9";
    const color = done ? tint : isNext ? "#ffd76a" : optional ? "#5b6486" : "#7e88b8";
    const r = isNext ? 9 : done ? 7 : 6;
    const op = isNext ? 1 : done ? 0.96 : optional ? 0.55 : 0.8;
    dots.push({ id: u.id, lat: c[1], lng: c[0], color, r, op, status, label: (j.place || u.title) + (j.pref ? " · " + j.pref : "") });
  });
  const full = geoSpline(ordered);
  const lit = recIdx > 0 ? geoSpline(ordered.slice(0, recIdx + 1)) : [];
  return { dots, full, lit, curLngLat, ordered };
}
function glBounds(ordered) {
  let m = [999, 999], M = [-999, -999];
  ordered.forEach(c => { m[0] = Math.min(m[0], c[0]); m[1] = Math.min(m[1], c[1]); M[0] = Math.max(M[0], c[0]); M[1] = Math.max(M[1], c[1]); });
  if (ordered.length < 2) return [[24, 122], [46, 146]];        // Leaflet wants [lat,lng]
  return [[m[1] - 0.6, m[0] - 0.6], [M[1] + 0.6, M[0] + 0.6]];
}
function toLatLngs(pts) { return pts.map(p => [p[1], p[0]]); }   // [lng,lat] → Leaflet [lat,lng]
function glSetHere(map, cur) {
  if (!cur) { if (glHere) { map.removeLayer(glHere); glHere = null; } return; }
  const ll = [cur[1], cur[0]];
  if (!glHere) {
    const icon = L.divIcon({ className: "jgl-here-wrap", iconSize: [0, 0],
      html: '<div class="jgl-here"><span class="jgl-ping"></span><span class="jgl-pin">📍</span></div>' });
    glHere = L.marker(ll, { icon, interactive: false, keyboard: false, zIndexOffset: 1000 }).addTo(map);
  } else glHere.setLatLng(ll);
}
let glOverlay = null;
function glDrawOverlay(map, data) {
  if (glOverlay) { map.removeLayer(glOverlay); glOverlay = null; }
  glOverlay = L.layerGroup();
  if (data.full.length > 1)
    L.polyline(toLatLngs(data.full), { color: "#dbe3ff", weight: 2, opacity: 0.5, dashArray: "1 7", lineCap: "round" }).addTo(glOverlay);
  if (data.lit.length > 1)
    L.polyline(toLatLngs(data.lit), { color: "#ffd76a", weight: 3.8, opacity: 0.95, lineCap: "round", lineJoin: "round" }).addTo(glOverlay);
  data.dots.forEach(d => {
    const mk = L.circleMarker([d.lat, d.lng], { radius: d.r, color: "#0a0f24", weight: 1.5, fillColor: d.color, fillOpacity: d.op });
    mk.bindTooltip(d.label, { direction: "top", offset: [0, -2], className: "jgl-tip" });
    mk.on("click", () => openLesson(d.id));
    mk.addTo(glOverlay);
  });
  glOverlay.addTo(map);
  glSetHere(map, data.curLngLat);
}
// Leaflet satellite map (img tiles — no WebGL, works everywhere)
function renderLearnMapGL(units, recId, startI) {
  const wrap = $("learnMap"); if (!wrap) return;
  const data = glBuildData(units, recId, startI);
  // build the map only once; afterwards just refresh the overlay + nudge the camera
  if (glMap && document.getElementById("jglMap")) {
    glDrawOverlay(glMap, data);
    setTimeout(() => { try { glMap.invalidateSize(); } catch (e) {} }, 60);
    if (data.curLngLat) glMap.flyTo([data.curLngLat[1], data.curLngLat[0]], Math.max(glMap.getZoom(), 8), { duration: 1.2 });
    return;
  }
  wrap.innerHTML = '<div class="jgl" id="jglMap"></div><div class="jmap-sea" id="jglSea"></div>'
    + '<div class="jgl-attr">Imagery © Esri</div>'
    + '<div class="jmap-zoom"><button class="jmap-zbtn" data-z="in" aria-label="Zoom in">+</button><button class="jmap-zbtn" data-z="out" aria-label="Zoom out">−</button></div>';
  glMap = L.map("jglMap", { zoomControl: false, attributionControl: false, minZoom: 4, maxZoom: 18, zoomSnap: 0.25 });
  wrap.querySelectorAll(".jmap-zbtn").forEach(b => b.addEventListener("click", () => { if (b.dataset.z === "in") glMap.zoomIn(); else glMap.zoomOut(); }));
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 18 }).addTo(glMap);
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 18, opacity: 0.9 }).addTo(glMap);
  glMap.fitBounds(glBounds(data.ordered), { padding: [28, 28] });
  glDrawOverlay(glMap, data);
  // keep tiles matched to the container (handles hidden→visible + layout changes)
  if (window.ResizeObserver) {
    if (glRO) { try { glRO.disconnect(); } catch (e) {} }
    glRO = new ResizeObserver(() => { if (glMap) { try { glMap.invalidateSize(); } catch (e) {} } });
    glRO.observe(wrap);
  }
  [80, 300, 700].forEach(t => setTimeout(() => { if (glMap) { try { glMap.invalidateSize(); } catch (e) {} } }, t));
  // ---- cinematic intro: surrounding seas fade away, then slow zoom to your stop ----
  if (!glIntroPlayed) {
    glIntroPlayed = true;
    const sea = document.getElementById("jglSea");
    setTimeout(() => { if (sea) sea.classList.add("gone"); }, 1500);
    setTimeout(() => { if (data.curLngLat) glMap.flyTo([data.curLngLat[1], data.curLngLat[0]], 9, { duration: 2.4 }); }, 2300);
    setTimeout(() => { if (sea && sea.parentNode) sea.parentNode.removeChild(sea); }, 4400);
  } else { const sea = document.getElementById("jglSea"); if (sea) sea.remove(); }
}
function renderLearnMap(units, recId, startI) {
  const wrap = $("learnMap"); if (!wrap) return;
  if (window.L && L.map) { try { renderLearnMapGL(units, recId, startI); return; } catch (e) { /* fall through to SVG */ } }
  renderLearnMapSVG(units, recId, startI);
}
function applyLearnView() {
  const map = $("learnMap"), list = $("learnUnits"), tog = $("learnViewToggle");
  if (!map || !list) return;
  map.hidden = !learnMapMode;
  list.hidden = learnMapMode;
  if (tog) tog.textContent = learnMapMode ? "☰ List" : "🗾 Map";
  if (learnMapMode && glMap) requestAnimationFrame(() => { try { glMap.invalidateSize(); } catch (e) {} });
}

function renderLearnPath() {
  const units = curUnits();
  const total = units.length;
  const doneN = units.filter(u => learnState.done[u.id]).length;
  const recId = recommendedUnitId();
  const startI = startIndexForLevel(learnState.level);
  $("learnProgressBar").style.width = (total ? Math.round(doneN / total * 100) : 0) + "%";
  $("learnProgressLabel").textContent = `${doneN} of ${total} lessons complete`;
  const pl = $("learnPlaced");
  if (pl) { if (placementNote) { pl.textContent = "✓ " + placementNote; pl.hidden = false; placementNote = ""; } else pl.hidden = true; }
  let html = "", lastStage = null;
  units.forEach((u, i) => {
    if (u.stage !== lastStage) { html += `<div class="learn-stage-h">${selEsc(u.stage)}</div>`; lastStage = u.stage; }
    const done = !!learnState.done[u.id];
    const isNext = u.id === recId;
    const optional = i < startI && !done;
    const status = done ? "done" : isNext ? "next" : optional ? "opt" : "todo";
    const icon = done ? "✓" : isNext ? "➜" : optional ? "↺" : "○";
    html += `<button class="learn-unit ${status}" data-unit="${u.id}">
      <span class="lu-icon">${icon}</span>
      <span class="lu-text"><span class="lu-title">${selEsc(u.title)}${isNext ? ' <span class="lu-badge">next</span>' : ''}</span>
      <span class="lu-sum">${selEsc(u.summary)}</span></span></button>`;
  });
  $("learnUnits").innerHTML = html;
  $("learnUnits").querySelectorAll(".learn-unit").forEach(b => b.addEventListener("click", () => openLesson(b.dataset.unit)));
  // Progress label doubles as a "you are here" when a journey exists
  buildJourneyIndex();
  const cur = recId && journeyById[recId];
  $("learnProgressLabel").textContent = cur
    ? `📍 ${cur.place}, ${cur.pref} · ${doneN} of ${total} stops`
    : `${doneN} of ${total} lessons complete`;
  showLearnScreen("path");   // make #learnMap visible (sized) BEFORE MapLibre inits its canvas
  renderLearnMap(units, recId, startI);
  applyLearnView();
}

function openLesson(id) {
  const u = unitById(id); if (!u) return;
  currentLessonId = id;
  $("lessonStage").textContent = u.stage;
  $("lessonTitle").textContent = u.title;
  $("lessonBody").innerHTML = (u.sections || []).map(s =>
    `<section class="lesson-sec"><h3>${selEsc(s.heading)}</h3>${s.html}</section>`).join("");
  emphasizeDiacritics($("lessonBody"));
  $("lessonPractice").innerHTML = (u.practice || []).map((p, i) =>
    `<button class="lesson-prac" data-i="${i}">${selEsc(p.label)}</button>`).join("");
  $("lessonPractice").querySelectorAll(".lesson-prac").forEach(b =>
    b.addEventListener("click", () => runPractice(u.practice[+b.dataset.i])));
  const done = !!learnState.done[id];
  $("lessonComplete").textContent = done ? "Completed ✓" : "Mark complete ✓";
  $("lessonComplete").classList.toggle("is-done", done);
  $("lessonNext").classList.remove("shine-once"); // glimmer only after a fresh completion
  showLearnScreen("lesson");
  $("learnView").scrollTop = 0;
}
function runPractice(p) {
  if (!p) return;
  if (p.type === "game") launchGame(p.game);  // → game view
  else selectSet(p.sel);                        // → study view
}
function completeLesson() {
  if (!currentLessonId) return;
  learnState.done[currentLessonId] = true; saveLearnState();
  // Stay on the lesson: just mark the button green and glimmer "Next lesson"
  // so the user chooses when to move on.
  const cb = $("lessonComplete");
  cb.textContent = "Completed ✓"; cb.classList.add("is-done");
  const nb = $("lessonNext"); if (nb) nb.classList.add("shine-once");
}
function gotoNextLesson() {
  const units = curUnits();
  const next = units[units.findIndex(u => u.id === currentLessonId) + 1];
  if (next) openLesson(next.id); else renderLearnPath();
}

$("learnNav").addEventListener("click", () => { showLearnView(); if (window.innerWidth <= 720) $("sidebar").classList.add("collapsed"); });
$("learnChangeLevel").addEventListener("click", renderLearnPlacement);
$("learnViewToggle").addEventListener("click", () => {
  learnMapMode = !learnMapMode;
  try { localStorage.setItem("anpiLearnView", learnMapMode ? "map" : "list"); } catch (e) {}
  applyLearnView();
});
$("learnTestStart").addEventListener("click", startTest);
$("testBack").addEventListener("click", renderLearnPlacement);
$("lessonBack").addEventListener("click", renderLearnPath);
$("lessonComplete").addEventListener("click", completeLesson);
$("lessonNext").addEventListener("click", gotoNextLesson);

// ---------- Interactive feature tour (spotlight walkthrough) ----------
const SB_FC = ".tree > details:nth-of-type(1)";        // Flashcards section
const SB_GAME = ".tree > details:nth-of-type(2)";      // Game section
const SB_FC_JP = SB_FC + " .jp-group";                 // Flashcards › Japanese group
const SB_FC_N5 = SB_FC_JP + " > .group > .cat:nth-of-type(1)";          // › N5 level
const SB_FC_KANA = SB_FC_N5 + " > .group > .sub:nth-of-type(1)";        // › Kana group
const SB_HIRA = '.deck[data-deck="hiragana"]:not([data-game])';        // the Hiragana deck button
const SB_GAME_JP = SB_GAME + " .jp-group";

const TOUR_STEPS = [
  // ---- Phase 1: open the menu, drill the hierarchy, open Hiragana (all clicks) ----
  { sel: "#sidebarToggle", click: true, before: closeNav, do: openNav,
    title: "Open the menu",
    text: "Everything starts in the side menu. 👆 Tap the ☰ button to open it." },
  { sel: SB_FC + " > summary", click: true, before: openNav, do: () => openSel(SB_FC),
    title: "Flashcards",
    text: "📚 Flashcards holds all your study decks. 👆 Open it." },
  { sel: SB_FC_JP + " > summary", click: true, before: () => openSel(SB_FC), do: () => openSel(SB_FC_JP),
    title: "Grouped by language",
    text: "Inside, everything Japanese sits under “Japanese” (room for other languages later). 👆 Open it." },
  { sel: SB_FC_N5 + " > summary", click: true, before: () => { openSel(SB_FC); openSel(SB_FC_JP); }, do: () => openSel(SB_FC_N5),
    title: "Split by level",
    text: "Decks are organized by JLPT level — N5 (beginner) up to N1 (advanced). 👆 Open N5." },
  { sel: SB_FC_KANA + " > summary", click: true, before: () => { openSel(SB_FC); openSel(SB_FC_JP); openSel(SB_FC_N5); }, do: () => openSel(SB_FC_KANA),
    title: "A level's contents",
    text: "Each level breaks into Kana, Kanji, Vocabulary and more. Kana — the phonetic alphabets — is step one. 👆 Open Kana." },
  { sel: SB_HIRA, pad: 6, click: true, before: () => { openSel(SB_FC); openSel(SB_FC_JP); openSel(SB_FC_N5); openSel(SB_FC_KANA); }, do: () => selectSet("hiragana"),
    title: "Open Hiragana",
    text: "Hiragana is the very first deck to learn. 👆 Open it!" },

  // ---- Phase 2: the flashcard (deck now loaded) ----
  { sel: "#cardStage", click: true, before: navForCard, do: () => { if (!flipped) flip(); },
    title: "Your first card",
    text: "Your Hiragana deck is open! The big character is what you're learning. 👆 Tap the card's center to flip it." },
  { sel: "#cardStage", before: () => { navForCard(); ensureFlipped(); },
    title: "The back of the card",
    text: "The flip side gives you everything: the reading (romaji), the same sound in the other script, a short note, and an animated stroke order showing how to write it." },
  { sel: "#cardStage", padB: 26, before: () => { navForCard(); playCardDemoLoop(); },
    title: "Card controls",
    text: "Watch the arrows: tap the center to flip · the right edge to mark it correct & advance · the left edge to go back. (Arrow keys work too.)" },

  // ---- Phase 2b: the info above the card ----
  { sels: ["#progress", "#completed", "#score"], pad: 6, before: navForCard,
    title: "Track your progress",
    text: "Above the card you can see which card you're on, how many you've completed, and your running score for this session." },
  { sel: "#shuffleBtn", before: navForCard,
    title: "Shuffle the deck",
    text: "Hit Shuffle to randomize the card order — great for making sure you actually know them, not just their position." },
  { sel: "#historyBtn", before: navForCard,
    title: "Past Results",
    text: "Finish a deck and it's logged here — review your previous sessions and scores anytime. (Saving these across devices? That's what an account is for — coming up at the end.)" },

  // ---- Phase 3: the card-back panel (checkboxes + drag + voiced marks) ----
  { sel: "#fieldPanel", before: () => { navForCard(); ensureFlipped(); openPanel(); },
    title: "Tune the card display",
    text: "This panel tailors what you see. Tick a box to show or hide a back field, and drag the ⠿ handles to reorder them — whatever's on top shows biggest. The Display options change how voiced marks — ゛(dakuten) and ゜(handakuten), which alter a sound like か→が or は→ぱ — look on the kana itself, so they also affect the character on the front (size & colour). New terms feel confusing at first; that's normal. Note: these options are specific to Japanese and would differ for other languages." },
  { sel: "#cardStage", before: () => { navForCard(); ensureFlipped(); },
    title: "See it on the card",
    text: "Now glance at the card back — it shows exactly the fields you enabled, in the order you set. Tweak the panel and the card updates instantly." },

  // ---- Phase 4: the Learn path (user opens it, then we walk through it) ----
  { sel: "#learnNav", click: true, before: openNav, do: () => showLearnView(),
    title: "The guided Learn path",
    text: "Feeling lost? The Learn path teaches every concept from zero. 👆 Open it." },
  { sel: "#learnTestStart", before: () => { navForCard(); renderLearnPlacement(); },
    title: "1 · Auto-placement (coming soon)",
    text: "Right at the top, a quick placement quiz will pick the perfect starting level for you. It's coming soon — for now, choose your level below." },
  { sel: "#learnLevels", before: () => { navForCard(); renderLearnPlacement(); },
    title: "2 · Place yourself",
    text: "Tell us where you're at — absolute beginner up to advanced. Your path starts at the right spot, and nothing is ever locked, so you can change it anytime." },
  { sel: "#learnUnits", before: () => { navForCard(); demoLearnPath(); },
    title: "3 · Follow the path",
    text: "You then work through an ordered path: lessons grouped by stage (Foundations, N5, N4…). Your progress bar fills as you go and a ➜ marks your recommended next step." },
  { sel: ".learn-unit", pad: 6, before: () => { navForCard(); demoLearnPath(); },
    title: "4 · Inside a lesson",
    text: "Each lesson explains the concept in plain language, then links straight to the matching flashcard deck and game. Finish it and mark it complete to advance." },

  // ---- Phase 5: account & leaderboards ----
  { sel: "#accountBtn", click: true, before: () => closeNav(), do: () => { const b = $("accountBtn"); if (b) b.click(); },
    title: "Make it yours",
    text: "Almost done! Tap the account button to set up a free account. 👆" },
  { sel: ".auth-modal", before: () => { const a = $("authOverlay"); if (a) a.classList.add("show"); },
    title: "Account & leaderboards",
    text: "Sign up (or sign in) with just an email — or keep using Anpi as a guest. Signing in saves your progress, reports and high scores and syncs them across devices, and global leaderboards are on the way so you can compete for top scores.  And that's the tour! You now know the whole app — the decks, the flashcards and their options, the game, and the guided Learn path. Close this and you'll land back on the home page; open the ☰ menu anytime to dive in. 頑張って — good luck, and have fun learning Japanese!" },
];
const TOUR_KEY = "anpiTourSeen";
let tourIdx = -1, tourEls = null, tourActive = false, tourDir = 1;

function buildTourDom() {
  if (tourEls) return;
  const ov = document.createElement("div"); ov.className = "tour-overlay";
  const spot = document.createElement("div"); spot.className = "tour-spot";
  const tip = document.createElement("div"); tip.className = "tour-tip";
  tip.innerHTML = '<div class="tour-step"></div><h3></h3><p></p>' +
    '<div class="tour-foot"><button class="tour-back">← Back</button><div class="tour-dots"></div><button class="tour-skip">Skip tour</button></div>' +
    '<div class="tour-hint"></div>';
  ov.appendChild(spot); ov.appendChild(tip); document.body.appendChild(ov);
  tourEls = { ov, spot, tip,
    step: tip.querySelector(".tour-step"), h: tip.querySelector("h3"), p: tip.querySelector("p"),
    dots: tip.querySelector(".tour-dots"),
    back: tip.querySelector(".tour-back"), skip: tip.querySelector(".tour-skip"),
    hint: tip.querySelector(".tour-hint"), clickEl: null, clickFn: null };
  tourEls.back.addEventListener("click", e => { e.stopPropagation(); tourBack(); });
  tourEls.skip.addEventListener("click", e => { e.stopPropagation(); endTour(); });
  // Backdrop click advances only on DESCRIPTION steps; action steps require
  // clicking the highlighted spot (handled per-step in showTourStep).
  ov.addEventListener("click", e => { const s = TOUR_STEPS[tourIdx]; if (e.target === ov && !(s && s.click)) tourNext(); });
  // Keep the spotlight glued to its target when anything scrolls or resizes
  // (capture=true catches scrolls from nested scrollers like the sidebar).
  window.addEventListener("resize", positionTour);
  window.addEventListener("scroll", positionTour, true);
  // Lock the keyboard while the tour runs so stray keys (space, arrows…) can't
  // manipulate the page. Esc skips the tour.
  window.addEventListener("keydown", tourKeyGuard, true);
  window.addEventListener("keyup", tourKeyGuard, true);
}
function tourKeyGuard(e) {
  if (!tourActive) return;
  if (e.type === "keydown") {
    if (e.key === "Escape" || e.key === "Esc") { e.preventDefault(); endTour(); return; }
    if (e.key === "ArrowLeft") { e.preventDefault(); e.stopPropagation(); tourBack(); return; } // step back (PC)
  }
  e.preventDefault(); e.stopPropagation();
}
function tourBack() { if (tourIdx > 0) { tourDir = -1; tourIdx--; showTourStep(); } }
function startTour() {
  tourActive = true; // freezes card manipulation/advancing while the tour runs
  stopTourNudge();   // hide the highlight as soon as the tour is launched
  setMainView("home"); // stay on the home page; the study view only appears once
                       // the user opens Hiragana (selectSet switches it for them)
  closeNav(); // step 1 is "open the menu" — start collapsed so there's something to open
  buildTourDom();
  tourEls.ov.classList.add("show");
  tourIdx = 0; showTourStep();
}
function openSel(sel) { const e = document.querySelector(sel); if (e && "open" in e) e.open = true; }
// Loop the existing tap-tutorial arrows over the card to demo the zones.
let cardDemoTimers = [];
function playCardDemoLoop() {
  stopCardDemoLoop();
  const tut = $("tutorial"); if (!tut) return;
  tut.hidden = false; $("tutDismiss").hidden = true;
  const steps = [
    { cls: "step1", text: "Center → flip the card" },
    { cls: "step2", text: "Right edge → mark correct & advance" },
    { cls: "step3", text: "Left edge → go back" },
  ];
  let i = 0;
  (function cycle() {
    tut.classList.remove("step1", "step2", "step3");
    tut.classList.add(steps[i].cls);
    $("tutText").textContent = steps[i].text;
    i = (i + 1) % steps.length;
    cardDemoTimers.push(setTimeout(cycle, 1600));
  })();
}
function stopCardDemoLoop() {
  cardDemoTimers.forEach(clearTimeout); cardDemoTimers = [];
  const tut = $("tutorial"); if (tut) { tut.hidden = true; tut.classList.remove("step1", "step2", "step3"); }
}
function openNav()  { $("sidebar").classList.remove("collapsed"); }
function closeNav() { $("sidebar").classList.add("collapsed"); }
// On phones the sidebar overlays the card, so hide it once we're studying the card.
function navForCard() { if (window.innerWidth <= 720) closeNav(); }
function ensureFlipped() { try { if (!flipped && deck.length) flip(); } catch (e) {} }
function openPanel() { const p = $("fieldPanel"); if (p) p.classList.remove("collapsed"); }
// Render the Learn path for the tour without committing a level (restores after).
function demoLearnPath() {
  if (!window.CURRICULUM) return;
  const saved = learnState.level;
  if (!saved || saved === "explore") learnState.level = "zero";
  renderLearnPath();
  learnState.level = saved;
}
function showTourStep() {
  const s = TOUR_STEPS[tourIdx];
  if (!s) return endTour();
  stopCardDemoLoop(); // stop the card-zone demo unless this step restarts it
  if (s.before) { try { s.before(); } catch (e) {} } // e.g. expand sidebar sections
  // A step may highlight one element (sel) or several at once (sels → union rect).
  const sels = s.sels || [s.sel];
  const targets = sels.map(x => document.querySelector(x)).filter(t => {
    if (!t) return false; const r = t.getBoundingClientRect(); return r.width > 0 || r.height > 0;
  });
  if (!targets.length) { // skip missing/hidden targets in the direction we're moving
    tourIdx += tourDir;
    if (tourIdx < 0) { tourIdx = 0; tourDir = 1; }      // can't go before the first step
    else if (tourIdx >= TOUR_STEPS.length) return endTour();
    return showTourStep();
  }
  // Bring the target into view: sidebar items centred in the sidebar; other
  // off-screen targets nudged in with minimal movement.
  const t0 = targets[0];
  try {
    if (t0.closest && t0.closest("#sidebar")) t0.scrollIntoView({ block: "center", inline: "nearest" });
    else { const rr = t0.getBoundingClientRect(); if (rr.top < 8 || rr.bottom > window.innerHeight - 8) t0.scrollIntoView({ block: "nearest", inline: "nearest" }); }
  } catch (e) {}
  tourEls.targets = targets; tourEls.curStep = s;
  tourEls.step.textContent = "Step " + (tourIdx + 1) + " of " + TOUR_STEPS.length;
  tourEls.h.textContent = s.title;
  tourEls.p.textContent = s.text;
  tourEls.back.style.display = tourIdx === 0 ? "none" : "";
  tourEls.dots.innerHTML = TOUR_STEPS.map((_, i) => '<span class="' + (i === tourIdx ? "on" : "") + '"></span>').join("");
  // No Next button. Action steps advance when you click the highlighted element
  // (performing the real action); description steps advance on a tap anywhere on
  // the dimmed backdrop.
  clearTourClick();
  const isClick = !!s.click;
  // The overlay always blocks the page; only the highlighted spot is interactive
  // on action steps, and clicking it performs the step's exact action (s.do).
  tourEls.spot.style.pointerEvents = isClick ? "auto" : "none";
  tourEls.spot.style.cursor = isClick ? "pointer" : "";
  tourEls.hint.textContent = isClick ? "👆 Click the highlighted item"
    : (tourIdx === TOUR_STEPS.length - 1 ? "Tap anywhere to finish" : "Tap anywhere to continue →");
  if (isClick) {
    const fn = e => { e.stopPropagation(); if (s.do) { try { s.do(); } catch (err) {} } clearTourClick(); setTimeout(tourNext, s.clickDelay || 320); };
    tourEls.spot.addEventListener("click", fn);
    tourEls.clickEl = tourEls.spot; tourEls.clickFn = fn;
  }
  positionTour();
  // A step's `before` may open the sidebar or scroll a target into view, which
  // animates — so the first positionTour can read a mid-transition rect (the
  // spotlight lands in the wrong place until the user scrolls). Re-position over
  // the next ~0.45s to track the element to its settled position.
  reflowTour();
}
// Re-run positionTour a few times so the spotlight follows elements that are
// still animating into place (e.g. the sliding sidebar on mobile).
let reflowTimers = [];
function reflowTour() {
  reflowTimers.forEach(clearTimeout); reflowTimers = [];
  requestAnimationFrame(() => positionTour());
  [60, 160, 300, 450].forEach(d => reflowTimers.push(setTimeout(() => positionTour(), d)));
}
function clearTourClick() {
  if (tourEls && tourEls.clickEl && tourEls.clickFn) tourEls.clickEl.removeEventListener("click", tourEls.clickFn);
  if (tourEls) { tourEls.clickEl = null; tourEls.clickFn = null; }
}
// `instant` (set when called from a scroll/resize event) tracks the target with
// no transition so the spotlight stays glued during scroll instead of lagging.
function positionTour(instant) {
  if (!tourEls || !tourEls.ov.classList.contains("show") || !tourEls.targets || !tourEls.targets.length) return;
  const s = tourEls.curStep;
  // Union of all highlighted targets' rects.
  let L = Infinity, T = Infinity, R = -Infinity, B = -Infinity;
  tourEls.targets.forEach(t => { const b = t.getBoundingClientRect(); L = Math.min(L, b.left); T = Math.min(T, b.top); R = Math.max(R, b.right); B = Math.max(B, b.bottom); });
  const r = { left: L, top: T, right: R, width: R - L, height: B - T };
  const pad = s.pad != null ? s.pad : 8;
  const padB = s.padB != null ? s.padB : pad; // optional extra room below (e.g. card-zone demo)
  const x = r.left - pad, y = r.top - pad, w = r.width + pad * 2, hh = r.height + pad + padB;
  tourEls.spot.style.transition = instant ? "none" : "";
  Object.assign(tourEls.spot.style, { left: x + "px", top: y + "px", width: w + "px", height: hh + "px" });
  const tip = tourEls.tip, tw = tip.offsetWidth, th = tip.offsetHeight;
  const vw = window.innerWidth, vh = window.innerHeight;
  if (vw <= 600) { // phone: pin the tooltip to whichever edge is away from the target
    const mid = r.top + r.height / 2;
    tip.style.left = Math.max(8, (vw - tw) / 2) + "px";
    tip.style.top = (mid < vh * 0.5 ? vh - th - 12 : 12) + "px";
    return;
  }
  // Desktop: for sidebar targets, keep the tooltip clear of the nav by placing it
  // just to the right of the sidebar (centre-left of the screen).
  const sb = $("sidebar");
  if (sb && tourEls.targets[0].closest && tourEls.targets[0].closest("#sidebar")) {
    const sr = sb.getBoundingClientRect();
    const txS = Math.max(8, Math.min(sr.right + 16, vw - tw - 8));
    const tyS = Math.max(8, Math.min(vh - th - 8, r.top - pad));
    tip.style.left = txS + "px"; tip.style.top = tyS + "px";
    return;
  }
  let tx, ty;
  if (y + hh + 12 + th <= vh - 8) ty = y + hh + 12;          // below
  else if (y - th - 12 >= 8) ty = y - th - 12;               // above
  else {                                                      // beside (tall targets)
    ty = Math.max(8, Math.min(vh - th - 8, r.top + r.height / 2 - th / 2));
    tx = (r.right + tw + 16 <= vw) ? r.right + 12 : Math.max(8, r.left - tw - 12);
  }
  if (tx == null) tx = Math.max(8, Math.min(vw - tw - 8, r.left + r.width / 2 - tw / 2));
  // Final safety clamp: never let the tooltip spill past any viewport edge.
  tx = Math.max(8, Math.min(tx, vw - tw - 8));
  ty = Math.max(8, Math.min(ty, vh - th - 8));
  tip.style.left = tx + "px"; tip.style.top = ty + "px";
}
function tourNext() { tourDir = 1; tourIdx++; tourIdx >= TOUR_STEPS.length ? endTour() : showTourStep(); }
function endTour() {
  clearTourClick();
  stopCardDemoLoop();
  tourActive = false;
  if (tourEls) { tourEls.ov.classList.remove("show"); tourEls.ov.style.pointerEvents = ""; }
  const auth = $("authOverlay"); if (auth) auth.classList.remove("show"); // close any opened modal
  try { localStorage.setItem(TOUR_KEY, "1"); } catch (e) {}
  stopTourNudge();     // finishing or skipping permanently retires the highlight
  closeNav();          // fully collapse the nav
  setMainView("home"); // land back on the home page
}
// One-time shine over the button box, shown once for visitors who've never run
// the tour (finishing or skipping it permanently retires the highlight).
function tourBox() { return $("homeTour"); }
function stopTourNudge() { const box = tourBox(); if (box) box.classList.remove("shine-once"); }
function maybeNudgeTour() {
  let seen = false; try { seen = localStorage.getItem(TOUR_KEY) === "1"; } catch (e) {}
  const box = tourBox(); if (!box || seen) return;
  box.classList.add("shine-once"); // loops until the user starts/finishes/skips the tour
}

// Home page navigation — the home landing IS the welcome screen now.
$("sideBrand").addEventListener("click", () => { showHome(); if (window.innerWidth <= 720) closeNav(); });
$("homeLearn").addEventListener("click", () => showLearnView());
$("homeStudy").addEventListener("click", () => selectSet("hiragana"));
$("homeGame").addEventListener("click", () => launchGame());
$("homeLeaderboard").addEventListener("click", () => showLeaderboardView());
$("homeStats").addEventListener("click", () => showStatsView());
$("homeTour").addEventListener("click", () => startTour());
$("lbBackHome").addEventListener("click", () => showHome());
$("statsBackHome").addEventListener("click", () => showHome());

applySidebarState();
applyFieldPanelState();
setMainView("home");  // the site always opens on the home landing page
initSelection();      // preloads the deck/set model in the background (stays on home)
maybeNudgeTour();      // shine the "Take the tour" button until the user takes/skips it
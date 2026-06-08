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
  // N4 vocabulary
  n4vocab:   { file: "n4-vocabulary",    type: "vocab", label: "All N4 Vocabulary" },
  n4nouns:   { file: "n4-nouns",         type: "vocab", label: "N4 Nouns" },
  n4godan:   { file: "n4-verbs-godan",   type: "vocab", label: "N4 Godan Verbs" },
  n4ichidan: { file: "n4-verbs-ichidan", type: "vocab", label: "N4 Ichidan Verbs" },
  n4adji:    { file: "n4-adjectives-i",  type: "vocab", label: "N4 い-Adjectives" },
  n4adjna:   { file: "n4-adjectives-na", type: "vocab", label: "N4 な-Adjectives" },
  n4adverbs: { file: "n4-adverbs",       type: "vocab", label: "N4 Adverbs" },
  // N3 vocabulary
  n3vocab:   { file: "n3-vocabulary",    type: "vocab", label: "All N3 Vocabulary" },
  n3nouns:   { file: "n3-nouns",         type: "vocab", label: "N3 Nouns" },
  n3godan:   { file: "n3-verbs-godan",   type: "vocab", label: "N3 Godan Verbs" },
  n3ichidan: { file: "n3-verbs-ichidan", type: "vocab", label: "N3 Ichidan Verbs" },
  n3adji:    { file: "n3-adjectives-i",  type: "vocab", label: "N3 い-Adjectives" },
  n3adjna:   { file: "n3-adjectives-na", type: "vocab", label: "N3 な-Adjectives" },
  n3adverbs: { file: "n3-adverbs",       type: "vocab", label: "N3 Adverbs" },
  // N2 vocabulary
  n2vocab:   { file: "n2-vocabulary",    type: "vocab", label: "All N2 Vocabulary" },
  n2nouns:   { file: "n2-nouns",         type: "vocab", label: "N2 Nouns" },
  n2godan:   { file: "n2-verbs-godan",   type: "vocab", label: "N2 Godan Verbs" },
  n2ichidan: { file: "n2-verbs-ichidan", type: "vocab", label: "N2 Ichidan Verbs" },
  n2adji:    { file: "n2-adjectives-i",  type: "vocab", label: "N2 い-Adjectives" },
  n2adjna:   { file: "n2-adjectives-na", type: "vocab", label: "N2 な-Adjectives" },
  n2adverbs: { file: "n2-adverbs",       type: "vocab", label: "N2 Adverbs" },
  // N1 vocabulary
  n1vocab:   { file: "n1-vocabulary",    type: "vocab", label: "All N1 Vocabulary" },
  n1nouns:   { file: "n1-nouns",         type: "vocab", label: "N1 Nouns" },
  n1godan:   { file: "n1-verbs-godan",   type: "vocab", label: "N1 Godan Verbs" },
  n1ichidan: { file: "n1-verbs-ichidan", type: "vocab", label: "N1 Ichidan Verbs" },
  n1adji:    { file: "n1-adjectives-i",  type: "vocab", label: "N1 い-Adjectives" },
  n1adjna:   { file: "n1-adjectives-na", type: "vocab", label: "N1 な-Adjectives" },
  n1adverbs: { file: "n1-adverbs",       type: "vocab", label: "N1 Adverbs" },
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
  $("speakerBtn").hidden = !flipped; // replay button on the back
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
function selectSet(selKey) {
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
  setMainView("study"); // selecting a deck always lands in the study view
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
  selectSet(sel);
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
  if (wantSel && SET_BY_ID[wantSel] && wantSel !== currentSelKey) selectSet(wantSel);
  else { deckSelect.value = currentTopKey; populateSetDropdown(currentTopKey); groupSelect.value = currentSelKey; syncSidebar(); }
}

function applySidebarState() {
  let stored = null;
  try { stored = localStorage.getItem(SIDEBAR_KEY); } catch {}
  // No saved preference → start collapsed on narrow screens so the card has room.
  const collapsed = stored === null ? window.innerWidth <= 720 : stored === "1";
  $("sidebar").classList.toggle("collapsed", collapsed);
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

// What to pronounce (kept for re-enable): kana → hiragana char; kanji → the kanji.
function currentSpeakText() {
  const e = deck[index];
  if (!e) return "";
  return deckType === "kanji" ? e.character : e.h;
}
// No-op stubs while audio is disabled — call sites stay intact, nothing fetches/plays.
function speak(_text) { /* audio disabled — see commented implementation above */ }
function stopSpeech() { /* audio disabled */ }
function speakCurrentCard() { /* audio disabled */ }

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
  // kbOpen: input is fixed above the keyboard → only reserve input+gap.
  // desktop/normal: input+tip flow below, plus .main's 60px bottom padding.
  const reserve = kbOpen ? (inputH + 16) : (inputH + tipH + 40);
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
  document.body.classList.toggle("game-active", which === "game");
}
function showGameView() { setMainView("game"); }
function backToStudy() {
  game.active = false; game.running = false;
  cancelAnimationFrame(game.raf);
  // Restore the header and clear any keyboard-pinned input styling.
  document.body.classList.remove("game-active");
  document.body.classList.remove("kb-open");
  gameInput.style.position = ""; gameInput.style.left = ""; gameInput.style.transform = "";
  gameInput.style.bottom = ""; gameInput.style.width = ""; gameInput.style.maxWidth = "";
  gameInput.style.zIndex = ""; gameInput.style.marginTop = "";
  setMainView("study");
  syncSidebar();
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
  sel.innerHTML = Object.keys(DECK_DEFS).map(k => `<option value="${k}">${DECK_DEFS[k].label}</option>`).join("");
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
}

// Confirm the picker → persist, load data, then go to difficulty selection.
async function gamePickerContinue() {
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
$("gameExit").addEventListener("click", backToStudy);
$("gameExitFromMode").addEventListener("click", showDeckPicker); // difficulty → back to deck/set
$("playAgain").addEventListener("click", () => startGame(game.mode.key));
$("changeMode").addEventListener("click", showModeSelect);
$("changeDeck").addEventListener("click", showDeckPicker);
$("endToStudy").addEventListener("click", backToStudy);
// Deck/set picker
$("gameDeckSelect").addEventListener("change", updateGameSetVisibility);
$("deckPickerNext").addEventListener("click", gamePickerContinue);
$("deckPickerBack").addEventListener("click", backToStudy);

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
$("shuffleBtn").addEventListener("click", shuffle);
$("yesBtn").addEventListener("click", e => { e.stopPropagation(); answer(true); });
$("noBtn").addEventListener("click",  e => { e.stopPropagation(); answer(false); });

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
$("zoneCenter").addEventListener("click", flip);
$("zoneRight").addEventListener("click", () => { flashZone($("zoneRight"), "green"); markCorrectAndNext(); });
$("zoneLeft").addEventListener("click",  () => { flashZone($("zoneLeft"), "neutral"); prev(); });
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
$("speakerBtn").addEventListener("click", e => { e.stopPropagation(); speakCurrentCard(); });

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
$("tutorialReplay").addEventListener("click", () => {
  // On mobile the sidebar overlays the card — close it so the tutorial is visible.
  if (window.innerWidth <= 720) $("sidebar").classList.add("collapsed");
  startTutorial();
});

document.addEventListener("keydown", e => {
  if (e.target.tagName === "SELECT") return;
  // While the tutorial is showing, swallow shortcuts; Esc (or Enter/Space once
  // the "Got it" button is up) dismisses it.
  if (!$("tutorial").hidden) {
    if (e.code === "Escape") { e.preventDefault(); endTutorial(); }
    else if ((e.code === "Enter" || e.code === "Space") && !$("tutDismiss").hidden) { e.preventDefault(); endTutorial(); }
    return;
  }
  // The game has its own input handling — let Esc bail out, ignore study shortcuts.
  if (game.active) {
    if (e.code === "Escape") { e.preventDefault(); backToStudy(); }
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
  $("learnPath").hidden = which !== "path";
  $("learnLesson").hidden = which !== "lesson";
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

function renderLearnPath() {
  const units = curUnits();
  const total = units.length;
  const doneN = units.filter(u => learnState.done[u.id]).length;
  const recId = recommendedUnitId();
  const startI = startIndexForLevel(learnState.level);
  $("learnProgressBar").style.width = (total ? Math.round(doneN / total * 100) : 0) + "%";
  $("learnProgressLabel").textContent = `${doneN} of ${total} lessons complete`;
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
  showLearnScreen("path");
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
  gotoNextLesson();
}
function gotoNextLesson() {
  const units = curUnits();
  const next = units[units.findIndex(u => u.id === currentLessonId) + 1];
  if (next) openLesson(next.id); else renderLearnPath();
}

$("learnNav").addEventListener("click", () => { showLearnView(); if (window.innerWidth <= 720) $("sidebar").classList.add("collapsed"); });
$("learnChangeLevel").addEventListener("click", renderLearnPlacement);
$("lessonBack").addEventListener("click", renderLearnPath);
$("lessonComplete").addEventListener("click", completeLesson);
$("lessonNext").addEventListener("click", gotoNextLesson);

applySidebarState();
applyFieldPanelState();
initSelection();      // builds the universal deck/set model, then restores the last selection
maybeShowTutorial();  // first-visit guided overlay (once, via localStorage)
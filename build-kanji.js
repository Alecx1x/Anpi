// Build-time generator: pulls accurate JLPT kanji data from kanjiapi.dev
// and writes data/n{5..1}-kanji.json in the project schema. Run with Node.
// Caches every API response so re-runs are fast and resumable.
const fs = require("fs");
const path = require("path");

const CACHE = path.join(__dirname, ".kanji-cache.json");
let cache = {};
try { cache = JSON.parse(fs.readFileSync(CACHE, "utf8")); } catch {}
let cacheDirty = 0;
function saveCache() { fs.writeFileSync(CACHE, JSON.stringify(cache)); cacheDirty = 0; }

async function getJSON(url) {
  if (cache[url]) return cache[url];
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const r = await fetch(url);
      if (r.status === 404) { cache[url] = null; return null; }
      if (!r.ok) throw new Error("HTTP " + r.status);
      const j = await r.json();
      cache[url] = j;
      if (++cacheDirty >= 50) saveCache();
      return j;
    } catch (e) {
      if (attempt === 3) { console.error("FAIL", url, e.message); return null; }
      await new Promise(res => setTimeout(res, 400 * (attempt + 1)));
    }
  }
}

// Run async tasks with a concurrency cap.
async function pool(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
      if (idx % 100 === 0) process.stdout.write(`\r  ...${idx}/${items.length}`);
    }
  });
  await Promise.all(workers);
  return out;
}

const isKana = s => /^[぀-ヿー]+$/.test(s);

function pickExample(wordsJson, kanji) {
  if (!Array.isArray(wordsJson)) return null;
  const cands = [];
  for (const w of wordsJson) {
    const gloss = w.meanings && w.meanings[0] && w.meanings[0].glosses && w.meanings[0].glosses[0];
    if (!gloss) continue;
    for (const v of (w.variants || [])) {
      if (!v.written || !v.pronounced) continue;
      if (!v.written.includes(kanji)) continue;
      if (!isKana(v.pronounced)) continue;
      cands.push({
        written: v.written, pronounced: v.pronounced, gloss,
        prio: (v.priorities && v.priorities.length) ? 1 : 0,
        len: v.written.length,
      });
    }
  }
  if (!cands.length) return null;
  // Prefer common (prioritized) words, then short 2-char compounds.
  cands.sort((a, b) => (b.prio - a.prio) || (a.len - b.len));
  const best = cands.find(c => c.len >= 2) || cands[0];
  return { exampleWord: best.written, exampleReading: best.pronounced, exampleMeaning: best.gloss };
}

(async () => {
  console.log("Fetching joyo kanji list...");
  const joyo = await getJSON("https://kanjiapi.dev/v1/kanji/joyo");
  if (!Array.isArray(joyo)) { console.error("Could not fetch joyo list"); process.exit(1); }
  console.log("Joyo kanji:", joyo.length, "\nFetching details...");

  const details = await pool(joyo, 12, async (ch) => getJSON("https://kanjiapi.dev/v1/kanji/" + encodeURIComponent(ch)));
  saveCache();
  process.stdout.write("\n");

  // Keep JLPT kanji only (jlpt 1..5).
  const jlpt = details.filter(d => d && d.jlpt >= 1 && d.jlpt <= 5);
  console.log("JLPT kanji:", jlpt.length, "\nFetching example words...");

  const words = await pool(jlpt, 12, async (d) => getJSON("https://kanjiapi.dev/v1/words/" + encodeURIComponent(d.kanji)));
  saveCache();
  process.stdout.write("\n");

  const buckets = { 5: [], 4: [], 3: [], 2: [], 1: [] };
  jlpt.forEach((d, idx) => {
    const ex = pickExample(words[idx], d.kanji) || { exampleWord: "", exampleReading: "", exampleMeaning: "" };
    buckets[d.jlpt].push({
      character: d.kanji,
      onyomi: (d.on_readings || []).join("、"),
      kunyomi: (d.kun_readings || []).join("、"),
      meaning: (d.meanings || []).join(", "),
      level: "N" + d.jlpt,
      strokeCount: d.stroke_count,
      exampleWord: ex.exampleWord,
      exampleReading: ex.exampleReading,
      exampleMeaning: ex.exampleMeaning,
    });
  });

  const map = { 5: "n5", 4: "n4", 3: "n3", 2: "n2", 1: "n1" };
  for (const lvl of [5, 4, 3, 2, 1]) {
    const arr = buckets[lvl].sort((a, b) => a.strokeCount - b.strokeCount);
    const file = path.join(__dirname, "data", map[lvl] + "-kanji.json");
    fs.writeFileSync(file, JSON.stringify(arr, null, 2));
    console.log(`Wrote ${map[lvl]}-kanji.json: ${arr.length} kanji`);
  }
  console.log("DONE");
})();

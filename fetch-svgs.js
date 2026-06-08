// Downloads KanjiVG SVGs into assets/kanjivg/ for offline stroke order.
// Single-character glyphs only (yōon combos have no KanjiVG file).
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname, "assets", "kanjivg");

const cp = ch => ch.codePointAt(0).toString(16).padStart(5, "0");
const single = s => Array.from(s).length === 1;

const chars = new Set();
const kana = JSON.parse(fs.readFileSync(path.join(__dirname, "data/hiragana.json"), "utf8"));
for (const e of kana) { if (single(e.h)) chars.add(e.h); if (single(e.k)) chars.add(e.k); }
for (const lv of ["n5", "n4", "n3", "n2", "n1"]) {
  const arr = JSON.parse(fs.readFileSync(path.join(__dirname, "data/" + lv + "-kanji.json"), "utf8"));
  for (const e of arr) if (single(e.character)) chars.add(e.character);
}
const list = [...chars];
console.log("Characters to fetch:", list.length);

async function pool(items, limit, fn) {
  let i = 0, done = 0;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (i < items.length) {
      const idx = i++;
      await fn(items[idx]);
      if (++done % 150 === 0) process.stdout.write(`\r  ...${done}/${items.length}`);
    }
  }));
}

(async () => {
  let got = 0, skip = 0, fail = 0;
  await pool(list, 16, async (ch) => {
    const hex = cp(ch);
    const dest = path.join(OUT, hex + ".svg");
    if (fs.existsSync(dest)) { skip++; return; }
    try {
      const r = await fetch("https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@master/kanji/" + hex + ".svg");
      if (r.ok) { fs.writeFileSync(dest, await r.text()); got++; }
      else fail++;
    } catch { fail++; }
  });
  process.stdout.write("\n");
  console.log(`Downloaded ${got}, skipped ${skip}, failed ${fail}`);
})();

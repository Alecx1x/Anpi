// Build-time generator for kanji semantic-category and radical groupings.
// Produces, per JLPT level: data/nX-kanji-categories.{json,js} and
// data/nX-kanji-radicals.{json,js}.
//
//  - Categories: each level exposes a cumulative set of themes (the spec's base
//    7 plus the more specific themes introduced at that level and below). A
//    level's kanji are assigned to a theme by the curated seed chars (spec
//    lists, authoritative) and, beyond those, by matching the kanji's English
//    meaning against the theme's keywords. Each kanji lands in at most one
//    theme; only that level's own kanji are ever included.
//  - Radicals: derived from the local KanjiVG assets (kvg:radical marker),
//    grouped into the common radicals listed in the spec, per level.
const fs = require("fs");
const path = require("path");
const DATA = path.join(__dirname, "data");
const KVG = path.join(__dirname, "assets", "kanjivg");

const cp = ch => ch.codePointAt(0).toString(16).padStart(5, "0");
const split = s => Array.from(s.replace(/\s+/g, ""));

// ---- Theme definitions: curated seed chars (spec) + meaning keywords --------
// Order = assignment priority (a kanji joins the first theme it matches).
const THEMES = [
  { name: "Nature", seeds: split("山川火水木日月空雨風"),
    kw: ["mountain","river","fire","water","tree","wood","sun","moon","sky","rain","wind","stone","rock","sea","ocean","ice","snow","cloud","cloudy","star","field","forest","woods","flower","grass","lake","valley","spring water"] },
  { name: "People & Body", seeds: split("人口手目耳子女男父母"),
    kw: ["person","people","body","hand","eye","ear","mouth","foot","leg","head","heart","face","finger","hair","blood","bone","skin","tooth","teeth","neck","child","woman","female","man","male","father","mother","self","arm","chest","back"] },
  { name: "Numbers", seeds: split("一二三四五六七八九十百千万"),
    kw: ["one","two","three","four","five","six","seven","eight","nine","ten","hundred","thousand","ten thousand","number","count","amount","quantity","half","whole"] },
  { name: "Time", seeds: split("年月日時分今毎週朝夜"),
    kw: ["year","month","day","time","hour","minute","week","morning","night","evening","now","season","spring","summer","autumn","fall","winter","noon","period","age","clock","past","future","early","late"] },
  { name: "Directions & Place", seeds: split("上下左右中外前後東西南北"),
    kw: ["up","upper","above","down","lower","below","left","right","middle","center","centre","outside","inside","interior","front","back","rear","east","west","south","north","direction","side","near","far","between","corner","edge"] },
  { name: "Transportation", seeds: split("電車船飛空港道橋"),
    kw: ["car","train","ship","boat","fly","flight","airplane","aircraft","harbor","harbour","port","bridge","vehicle","transport","traffic","wheel","sail","voyage","railway"] },
  { name: "Emotions & Mind", seeds: split("心思感好悪楽悲怒"),
    kw: ["feeling","emotion","mind","love","like","hate","anger","angry","sad","sorrow","joy","happy","fear","afraid","worry","think","thought","memory","dream","spirit","mood","glad","comfort","suffer","pleasure"] },
  { name: "Health & Body", seeds: split("病医薬健康痛治体"),
    kw: ["sick","sickness","illness","disease","doctor","medicine","drug","medical","health","healthy","pain","ache","cure","heal","treat","hospital","patient","wound","injury","symptom","fatigue","rest"] },
  { name: "Economy & Work", seeds: split("働給税産業商貿経"),
    kw: ["work","labor","labour","salary","wage","tax","duty","produce","product","industry","business","commerce","trade","economy","sell","buy","employ","profit","cost","price","market","finance","bank","goods","fee","pay","wealth","poor","rich"] },
  { name: "Education & Culture", seeds: split("試験研究科芸術文"),
    kw: ["study","learn","exam","examination","test","research","subject","skill","technique","culture","school","knowledge","scholar","literature","education","teach","lecture","question","problem","practice","train"] },
  { name: "Government & Law", seeds: split("法律政権議裁判罰"),
    kw: ["law","legal","rule","govern","government","politics","political","power","authority","right","council","judge","trial","court","punish","penalty","crime","justice","official","policy","govern","reign","command","order"] },
  { name: "Environment", seeds: split("環境汚染緑資源廃"),
    kw: ["environment","pollute","pollution","dirty","filthy","dye","stain","green","resource","source","waste","abolish","energy","ecology","climate","preserve","conservation"] },
  { name: "Literature & Arts", seeds: split("詩歌劇映画彫刻著"),
    kw: ["poem","poetry","song","sing","drama","play","theater","theatre","movie","film","picture","painting","paint","draw","carve","sculpt","sculpture","author","novel","story","compose","verse","stage"] },
  { name: "Science & Technology", seeds: split("科学技術機械電算"),
    kw: ["science","technique","technology","machine","mechanical","engine","electric","electricity","compute","calculate","engineering","device","data","physics","chemistry","experiment","measure","atom","energy"] },
  { name: "Classical & Formal", seeds: split("候御拝謹恭奉賜勅"),
    kw: ["honorific","revered","revere","respect","worship","offer","bestow","imperial","archaic","ceremony","ritual","noble","courtesy","humble","sincere","prostrate"] },
  { name: "Society", seeds: split("会社公私友族民市"),
    kw: ["society","social","public","private","friend","group","tribe","citizen","community","association","meeting","organization","member","company","gather","crowd","nation","village","town","city"] },
  { name: "Abstract Concepts", seeds: split("概念理論哲義価値"),
    kw: ["concept","idea","notion","reason","logic","theory","philosophy","meaning","value","worth","principle","truth","essence","abstract","sense","relation","system","method","form","matter"] },
  { name: "Actions", seeds: split("見聞行来食飲書読話買"),
    kw: ["see","look","watch","hear","listen","go","come","eat","drink","write","read","speak","talk","say","buy","sell","walk","run","stand","sit","make","use","give","take","meet","wait","open","close","enter","exit","carry","hold","throw","push","pull","turn","cut","build","move","change","begin","finish","help","decide"] },
  { name: "Objects & Places", seeds: split("車本店家学校駅道国町"),
    kw: ["book","shop","store","house","home","school","station","road","street","country","town","building","temple","shrine","room","door","window","money","tool","machine","hospital","garden","park","office","market","field","gate","wall","roof","kitchen","seat","table"] },
];

// Which themes are available at each level (cumulative: base + level additions).
const ADDED = {
  n5: ["Nature","People & Body","Numbers","Time","Directions & Place","Actions","Objects & Places"],
  n4: ["Emotions & Mind","Society","Transportation"],
  n3: ["Economy & Work","Health & Body","Education & Culture"],
  n2: ["Government & Law","Environment","Abstract Concepts"],
  n1: ["Literature & Arts","Science & Technology","Classical & Formal","Specialized"],
};
const LEVELS = ["n5", "n4", "n3", "n2", "n1"];
function themesForLevel(lv) {
  const names = [];
  for (const l of LEVELS) { names.push(...ADDED[l]); if (l === lv) break; }
  return names;
}
// "Specialized" (N1) is a catch-all for professional-domain kanji; defined here
// so it sits LAST in priority (only catches what nothing else did).
const SPECIALIZED = { name: "Specialized", seeds: split("医法経建農林水鉱"),
  kw: ["construct","construction","build","agriculture","farm","farming","cultivate","forest","forestry","mine","mining","mineral","ore","metal","steel","iron","architecture","industrial","professional","technical","specialized","crops","harvest"] };

function meaningWords(m) { return String(m || "").toLowerCase().split(/[^a-z0-9]+/).filter(Boolean); }
function matchesKw(meaning, kw) {
  const words = new Set(meaningWords(meaning));
  const lower = String(meaning || "").toLowerCase();
  for (const k of kw) { if (k.includes(" ") ? lower.includes(k) : words.has(k)) return true; }
  return false;
}

// ---- Common radicals to surface (canonical char -> meaning), in display order
const RADICAL_ORDER = [
  ["人", "person"], ["水", "water"], ["木", "tree"], ["日", "sun/day"],
  ["月", "moon/month"], ["火", "fire"], ["土", "earth"], ["金", "metal/gold"],
  ["口", "mouth"], ["手", "hand"], ["心", "heart/mind"], ["目", "eye"],
  ["言", "speech"], ["足", "foot"], ["糸", "thread"], ["女", "woman"],
  ["山", "mountain"], ["門", "gate"],
];
const VARIANT = {
  "人": "人", "亻": "人",
  "水": "水", "氵": "水", "氺": "水",
  "木": "木", "日": "日", "月": "月",
  "火": "火", "灬": "火", "土": "土",
  "金": "金", "釒": "金", "钅": "金", "口": "口",
  "手": "手", "扌": "手",
  "心": "心", "忄": "心", "㣺": "心", "目": "目",
  "言": "言", "訁": "言", "讠": "言",
  "足": "足", "⻊": "足", "𧾷": "足",
  "糸": "糸", "糹": "糸", "纟": "糸",
  "女": "女", "山": "山", "門": "門", "门": "門",
};

function radicalOf(ch) {
  let txt = null;
  try { txt = fs.readFileSync(path.join(KVG, cp(ch) + ".svg"), "utf8"); }
  catch (e) {
    try { txt = fs.readFileSync(path.join(KVG, cp(ch) + ".js"), "utf8").replace(/\\"/g, '"'); }
    catch (e2) { return null; }
  }
  const tags = txt.match(/<g\b[^>]*kvg:radical="[^"]*"[^>]*>/g) || [];
  let general = null, any = null;
  for (const tag of tags) {
    const el = (tag.match(/kvg:element="([^"]+)"/) || [])[1];
    const ty = (tag.match(/kvg:radical="([^"]*)"/) || [])[1];
    if (!el) continue;
    if (ty === "general" && !general) general = el;
    if (!any) any = el;
  }
  return general || any;
}

function writePair(fileKey, obj) {
  const json = JSON.stringify(obj, null, 2);
  fs.writeFileSync(path.join(DATA, fileKey + ".json"), json);
  fs.writeFileSync(
    path.join(DATA, fileKey + ".js"),
    `// Auto-generated fallback for file:// (when fetch is blocked). Source: ${fileKey}.json\n` +
    `window.DECKS=window.DECKS||{};\nwindow.DECKS[${JSON.stringify(fileKey)}]=${json};\n`
  );
}

for (const lv of LEVELS) {
  const kanji = JSON.parse(fs.readFileSync(path.join(DATA, lv + "-kanji.json"), "utf8"));
  const allowed = new Set(themesForLevel(lv));
  // Active themes for this level, in priority order; Specialized appended last.
  const themes = THEMES.filter(t => allowed.has(t.name));
  if (allowed.has("Specialized")) themes.push(SPECIALIZED);

  const cats = {};
  themes.forEach(t => { cats[t.name] = []; });
  for (const k of kanji) {
    let placed = null;
    for (const t of themes) { if (t.seeds.includes(k.character)) { placed = t.name; break; } }
    if (!placed) {
      for (const t of themes) { if (matchesKw(k.meaning, t.kw)) { placed = t.name; break; } }
    }
    if (placed) cats[placed].push(k.character);
  }
  // Drop empty themes; keep priority order.
  const catsOut = {};
  themes.forEach(t => { if (cats[t.name].length) catsOut[t.name] = cats[t.name]; });
  writePair(lv + "-kanji-categories", catsOut);

  // Radicals.
  const buckets = {};
  let unmatched = 0;
  for (const k of kanji) {
    const rad = radicalOf(k.character);
    const canon = rad && VARIANT[rad];
    if (!canon) { unmatched++; continue; }
    (buckets[canon] = buckets[canon] || []).push(k.character);
  }
  const rads = {};
  for (const [canon, meaning] of RADICAL_ORDER) {
    if (buckets[canon] && buckets[canon].length) rads[canon] = { meaning, kanji: buckets[canon] };
  }
  writePair(lv + "-kanji-radicals", rads);

  const catN = Object.values(catsOut).reduce((n, a) => n + a.length, 0);
  const radN = Object.values(rads).reduce((n, a) => n + a.kanji.length, 0);
  console.log(`${lv}: ${Object.keys(catsOut).length} categories covering ${catN}/${kanji.length} kanji; ` +
    `${Object.keys(rads).length} radical groups covering ${radN}/${kanji.length}`);
}
console.log("DONE");

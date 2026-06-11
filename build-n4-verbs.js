// Generates N4 Verb Forms study decks (Te / Ta / Nai / Potential) as
// vocab-schema JSON + .js fallbacks. Run: node build-n4-verbs.js
const fs = require("fs");
const path = require("path");
const DATA = path.join(__dirname, "data");

const E = (a) => ({
  word: a[0], reading: a[1] || "", romaji: a[2] || "", meaning: a[3] || "",
  partOfSpeech: a[4] || "", exampleSentence: a[5] || "", exampleReading: a[6] || "",
  exampleMeaning: a[7] || "", level: "N4",
});

const SETS = {
  "n4-verbs-teform": [
    ["食べて", "たべて", "tabete", "eating / and eat (from 食べる)", "Verb (te-form)", "食べて、すぐ寝ます。", "たべて、すぐねます。", "I eat and then sleep right away."],
    ["飲んで", "のんで", "nonde", "drinking / and drink (from 飲む)", "Verb (te-form)", "水を飲んでください。", "みずをのんでください。", "Please drink water."],
    ["行って", "いって", "itte", "going / and go (from 行く)", "Verb (te-form)", "学校に行って勉強する。", "がっこうにいってべんきょうする。", "I go to school and study."],
    ["書いて", "かいて", "kaite", "writing / and write (from 書く)", "Verb (te-form)", "ここに名前を書いて。", "ここになまえをかいて。", "Write your name here."],
    ["話して", "はなして", "hanashite", "talking / and talk (from 話す)", "Verb (te-form)", "友達と話している。", "ともだちとはなしている。", "I'm talking with a friend."],
    ["待って", "まって", "matte", "waiting / and wait (from 待つ)", "Verb (te-form)", "ちょっと待ってください。", "ちょっとまってください。", "Please wait a moment."],
    ["読んで", "よんで", "yonde", "reading / and read (from 読む)", "Verb (te-form)", "本を読んでいる。", "ほんをよんでいる。", "I'm reading a book."],
    ["見て", "みて", "mite", "looking / and look (from 見る)", "Verb (te-form)", "これを見てください。", "これをみてください。", "Please look at this."],
    ["来て", "きて", "kite", "coming / and come (from 来る)", "Verb (te-form)", "こっちに来て。", "こっちにきて。", "Come over here."],
    ["して", "して", "shite", "doing / and do (from する)", "Verb (te-form)", "今、宿題をしている。", "いま、しゅくだいをしている。", "I'm doing homework now."],
  ],
  "n4-verbs-taform": [
    ["食べた", "たべた", "tabeta", "ate (plain past of 食べる)", "Verb (ta-form)", "朝ごはんを食べた。", "あさごはんをたべた。", "I ate breakfast."],
    ["飲んだ", "のんだ", "nonda", "drank (from 飲む)", "Verb (ta-form)", "コーヒーを飲んだ。", "コーヒーをのんだ。", "I drank coffee."],
    ["行った", "いった", "itta", "went (from 行く)", "Verb (ta-form)", "昨日、東京に行った。", "きのう、とうきょうにいった。", "I went to Tokyo yesterday."],
    ["書いた", "かいた", "kaita", "wrote (from 書く)", "Verb (ta-form)", "友達に手紙を書いた。", "ともだちにてがみをかいた。", "I wrote a letter to my friend."],
    ["話した", "はなした", "hanashita", "talked (from 話す)", "Verb (ta-form)", "先生と話した。", "せんせいとはなした。", "I talked with the teacher."],
    ["待った", "まった", "matta", "waited (from 待つ)", "Verb (ta-form)", "一時間も待った。", "いちじかんもまった。", "I waited a whole hour."],
    ["読んだ", "よんだ", "yonda", "read (from 読む)", "Verb (ta-form)", "その本はもう読んだ。", "そのほんはもうよんだ。", "I've already read that book."],
    ["見た", "みた", "mita", "saw / watched (from 見る)", "Verb (ta-form)", "昨日、映画を見た。", "きのう、えいがをみた。", "I watched a movie yesterday."],
    ["来た", "きた", "kita", "came (from 来る)", "Verb (ta-form)", "友達が遊びに来た。", "ともだちがあそびにきた。", "A friend came over to hang out."],
    ["した", "した", "shita", "did (from する)", "Verb (ta-form)", "週末、買い物をした。", "しゅうまつ、かいものをした。", "I went shopping on the weekend."],
  ],
  "n4-verbs-naiform": [
    ["食べない", "たべない", "tabenai", "don't eat (plain neg. of 食べる)", "Verb (nai-form)", "朝ごはんを食べない。", "あさごはんをたべない。", "I don't eat breakfast."],
    ["飲まない", "のまない", "nomanai", "don't drink (from 飲む)", "Verb (nai-form)", "お酒を飲まない。", "おさけをのまない。", "I don't drink alcohol."],
    ["行かない", "いかない", "ikanai", "don't go (from 行く)", "Verb (nai-form)", "今日は学校に行かない。", "きょうはがっこうにいかない。", "I'm not going to school today."],
    ["書かない", "かかない", "kakanai", "don't write (from 書く)", "Verb (nai-form)", "日記は書かない。", "にっきはかかない。", "I don't keep a diary."],
    ["話さない", "はなさない", "hanasanai", "don't speak (from 話す)", "Verb (nai-form)", "彼は何も話さない。", "かれはなにもはなさない。", "He doesn't say anything."],
    ["待たない", "またない", "matanai", "don't wait (from 待つ)", "Verb (nai-form)", "もう待たない。", "もうまたない。", "I won't wait anymore."],
    ["読まない", "よまない", "yomanai", "don't read (from 読む)", "Verb (nai-form)", "新聞は読まない。", "しんぶんはよまない。", "I don't read newspapers."],
    ["見ない", "みない", "minai", "don't watch (from 見る)", "Verb (nai-form)", "あまりテレビを見ない。", "あまりテレビをみない。", "I don't watch TV much."],
    ["来ない", "こない", "konai", "don't come (from 来る)", "Verb (nai-form)", "彼は来ないと思う。", "かれはこないとおもう。", "I don't think he'll come."],
    ["しない", "しない", "shinai", "don't do (from する)", "Verb (nai-form)", "今日は何もしない。", "きょうはなにもしない。", "I'm not doing anything today."],
  ],
  "n4-verbs-potential": [
    ["食べられる", "たべられる", "taberareru", "can eat (from 食べる)", "Verb (potential)", "辛い物が食べられる。", "からいものがたべられる。", "I can eat spicy food."],
    ["飲める", "のめる", "nomeru", "can drink (from 飲む)", "Verb (potential)", "もうお酒が飲める。", "もうおさけがのめる。", "I can drink alcohol now."],
    ["行ける", "いける", "ikeru", "can go (from 行く)", "Verb (potential)", "明日なら行ける。", "あしたならいける。", "I can go if it's tomorrow."],
    ["書ける", "かける", "kakeru", "can write (from 書く)", "Verb (potential)", "漢字がたくさん書ける。", "かんじがたくさんかける。", "I can write a lot of kanji."],
    ["話せる", "はなせる", "hanaseru", "can speak (from 話す)", "Verb (potential)", "日本語が話せる。", "にほんごがはなせる。", "I can speak Japanese."],
    ["読める", "よめる", "yomeru", "can read (from 読む)", "Verb (potential)", "この漢字が読める。", "このかんじがよめる。", "I can read this kanji."],
    ["見られる", "みられる", "mirareru", "can see (from 見る)", "Verb (potential)", "ここから海が見られる。", "ここからうみがみられる。", "I can see the sea from here."],
    ["来られる", "こられる", "korareru", "can come (from 来る)", "Verb (potential)", "パーティーに来られる？", "パーティーにこられる？", "Can you come to the party?"],
    ["泳げる", "およげる", "oyogeru", "can swim (from 泳ぐ)", "Verb (potential)", "私は速く泳げる。", "わたしははやくおよげる。", "I can swim fast."],
    ["できる", "できる", "dekiru", "can do (potential of する)", "Verb (potential)", "料理ができる。", "りょうりができる。", "I can cook."],
  ],
};

let total = 0;
for (const [key, rows] of Object.entries(SETS)) {
  const arr = rows.map(E);
  const json = JSON.stringify(arr, null, 2);
  fs.writeFileSync(path.join(DATA, key + ".json"), json);
  fs.writeFileSync(path.join(DATA, key + ".js"),
    `// Auto-generated fallback for file:// (when fetch is blocked). Source: ${key}.json\n` +
    `window.DECKS=window.DECKS||{};\nwindow.DECKS[${JSON.stringify(key)}]=${json};\n`);
  console.log(`${key}: ${arr.length}`);
  total += arr.length;
}
console.log("TOTAL entries:", total);

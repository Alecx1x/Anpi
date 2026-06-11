// Populates the N5 grammar study decks with full, accurate content.
// vocab-schema JSON + .js fallback for file://. Run: node build-grammar-n5.js
const fs = require("fs");
const path = require("path");
const DATA = path.join(__dirname, "data");

// [word, reading, romaji, meaning, partOfSpeech, exSentence, exReading, exMeaning]
const E = (a) => ({
  word: a[0], reading: a[1] || "", romaji: a[2] || "", meaning: a[3] || "",
  partOfSpeech: a[4] || "Grammar", exampleSentence: a[5] || "", exampleReading: a[6] || "",
  exampleMeaning: a[7] || "", level: "N5",
});

const SETS = {
  // ---------------- Basic sentence structure & core particles ----------------
  "n5-grammar-structure": [
    ["〜は〜です", "", "wa ~ desu", "\"A is B\" — topic + copula", "Grammar", "私は学生です。", "わたしはがくせいです。", "I am a student."],
    ["〜は〜が〜", "", "wa ~ ga", "topic + subject (double-subject)", "Grammar", "象は鼻が長い。", "ぞうははながながい。", "As for elephants, their noses are long."],
    ["〜を", "", "o", "direct-object marker", "Grammar", "毎朝パンを食べます。", "まいあさパンをたべます。", "I eat bread every morning."],
    ["〜に (place/time)", "", "ni", "at / in / on (existence, time)", "Grammar", "日本に住んでいます。", "にほんにすんでいます。", "I live in Japan."],
    ["〜へ", "", "e", "to / toward (direction)", "Grammar", "来週、東京へ行きます。", "らいしゅう、とうきょうへいきます。", "I'm going to Tokyo next week."],
    ["〜で (place of action)", "", "de", "at / in (where an action happens)", "Grammar", "図書館で勉強します。", "としょかんでべんきょうします。", "I study at the library."],
    ["〜で (means)", "", "de", "by / with (means, tool)", "Grammar", "バスで会社に行きます。", "バスでかいしゃにいきます。", "I go to work by bus."],
    ["〜と (and / with)", "", "to", "and (nouns) / together with", "Grammar", "友達と映画を見ました。", "ともだちとえいがをみました。", "I watched a movie with a friend."],
    ["〜の", "", "no", "possessive / noun-linking", "Grammar", "これは私の本です。", "これはわたしのほんです。", "This is my book."],
    ["〜も", "", "mo", "also / too", "Grammar", "私も日本語を勉強します。", "わたしもにほんごをべんきょうします。", "I study Japanese too."],
    ["〜から〜まで", "", "kara ~ made", "from ~ until ~", "Grammar", "9時から5時まで働きます。", "くじからごじまではたらきます。", "I work from 9 to 5."],
    ["〜や", "", "ya", "and (a non-exhaustive list)", "Grammar", "机の上にペンやノートがあります。", "つくえのうえにペンやノートがあります。", "There are pens, notebooks, and so on, on the desk."],
    ["〜があります / います", "", "ga arimasu / imasu", "there is (thing / living being)", "Grammar", "公園に犬がいます。", "こうえんにいぬがいます。", "There is a dog in the park."],
    ["〜ましょう", "", "mashou", "let's ~ (suggestion)", "Grammar", "一緒に昼ご飯を食べましょう。", "いっしょにひるごはんをたべましょう。", "Let's eat lunch together."],
    ["〜たいです", "", "tai desu", "want to ~ (speaker's desire)", "Grammar", "冷たい水が飲みたいです。", "つめたいみずがのみたいです。", "I want to drink cold water."],
  ],

  // ---------------- Question forms & sentence-final particles ----------------
  "n5-grammar-questions": [
    ["〜か", "", "ka", "question marker (turns a statement into a question)", "Grammar", "これはペンですか。", "これはペンですか。", "Is this a pen?"],
    ["何 (なに / なん)", "", "nani / nan", "what", "Grammar", "これは何ですか。", "これはなんですか。", "What is this?"],
    ["誰 (だれ)", "", "dare", "who", "Grammar", "あの人は誰ですか。", "あのひとはだれですか。", "Who is that person?"],
    ["どこ", "", "doko", "where", "Grammar", "トイレはどこですか。", "トイレはどこですか。", "Where is the toilet?"],
    ["いつ", "", "itsu", "when", "Grammar", "誕生日はいつですか。", "たんじょうびはいつですか。", "When is your birthday?"],
    ["何時 (なんじ)", "", "nanji", "what time", "Grammar", "今、何時ですか。", "いま、なんじですか。", "What time is it now?"],
    ["いくら", "", "ikura", "how much (price)", "Grammar", "このシャツはいくらですか。", "このシャツはいくらですか。", "How much is this shirt?"],
    ["いくつ", "", "ikutsu", "how many / how old", "Grammar", "りんごをいくつ買いますか。", "りんごをいくつかいますか。", "How many apples will you buy?"],
    ["どう", "", "dou", "how / how about", "Grammar", "新しい仕事はどうですか。", "あたらしいしごとはどうですか。", "How is the new job?"],
    ["どうして / なぜ", "", "doushite / naze", "why", "Grammar", "どうして昨日来ませんでしたか。", "どうしてきのうきませんでしたか。", "Why didn't you come yesterday?"],
    ["どれ / どの / どちら", "", "dore / dono / dochira", "which", "Grammar", "どれがあなたの傘ですか。", "どれがあなたのかさですか。", "Which one is your umbrella?"],
    ["どんな", "", "donna", "what kind of", "Grammar", "どんな音楽が好きですか。", "どんなおんがくがすきですか。", "What kind of music do you like?"],
    ["〜ね", "", "ne", "right? / isn't it? (seeking agreement)", "Grammar", "今日はいい天気ですね。", "きょうはいいてんきですね。", "It's nice weather today, isn't it?"],
    ["〜よ", "", "yo", "you know (giving new info / emphasis)", "Grammar", "明日は休みですよ。", "あしたはやすみですよ。", "Tomorrow is a day off, you know."],
  ],

  // ---------------- Negative forms ----------------
  "n5-grammar-negatives": [
    ["〜じゃありません", "", "ja arimasen", "\"is not\" (noun / na-adjective, polite)", "Grammar", "学生じゃありません。", "がくせいじゃありません。", "I'm not a student."],
    ["〜ではありません", "", "dewa arimasen", "\"is not\" (more formal)", "Grammar", "これは私のではありません。", "これはわたしのではありません。", "This is not mine."],
    ["〜じゃありませんでした", "", "ja arimasen deshita", "\"was not\" (noun / na-adj, past)", "Grammar", "昨日は休みじゃありませんでした。", "きのうはやすみじゃありませんでした。", "Yesterday was not a day off."],
    ["〜ません", "", "masen", "\"do not ~\" (verb, polite)", "Grammar", "肉を食べません。", "にくをたべません。", "I don't eat meat."],
    ["〜ませんでした", "", "masen deshita", "\"did not ~\" (verb, past polite)", "Grammar", "昨日は学校に行きませんでした。", "きのうはがっこうにいきませんでした。", "I didn't go to school yesterday."],
    ["〜くないです", "", "kunai desu", "\"is not ~\" (い-adjective)", "Grammar", "この店は高くないです。", "このみせはたかくないです。", "This shop is not expensive."],
    ["〜くなかったです", "", "kunakatta desu", "\"was not ~\" (い-adjective, past)", "Grammar", "映画は面白くなかったです。", "えいがはおもしろくなかったです。", "The movie was not interesting."],
    ["ありません", "", "arimasen", "there isn't / don't have (things)", "Grammar", "今、お金がありません。", "いま、おかねがありません。", "I don't have any money right now."],
    ["いません", "", "imasen", "there isn't (people / animals)", "Grammar", "教室に誰もいません。", "きょうしつにだれもいません。", "There is no one in the classroom."],
    ["〜ないでください", "", "naide kudasai", "please don't ~", "Grammar", "ここで写真を撮らないでください。", "ここでしゃしんをとらないでください。", "Please don't take photos here."],
    ["〜ない (plain)", "", "nai", "\"not ~\" (plain/casual negative)", "Grammar", "今日はテレビを見ない。", "きょうはテレビをみない。", "I'm not watching TV today."],
    ["まだ〜ていません", "", "mada ~te imasen", "have not ~ yet", "Grammar", "宿題はまだ終わっていません。", "しゅくだいはまだおわっていません。", "I haven't finished my homework yet."],
    ["あまり〜ない", "", "amari ~nai", "not very / not much", "Grammar", "コーヒーはあまり飲みません。", "コーヒーはあまりのみません。", "I don't drink much coffee."],
    ["全然〜ない", "", "zenzen ~nai", "not at all", "Grammar", "意味が全然分かりません。", "いみがぜんぜんわかりません。", "I don't understand the meaning at all."],
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
console.log("N5 grammar TOTAL entries:", total);

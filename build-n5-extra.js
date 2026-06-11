// Generates the remaining N5 "coming soon" decks (Numbers & Counters, Phrases &
// Expressions, Grammar Patterns) as vocab-schema JSON + .js fallbacks.
const fs = require("fs");
const path = require("path");
const DATA = path.join(__dirname, "data");

// [word, reading, romaji, meaning, partOfSpeech, exSentence, exReading, exMeaning]
const E = (a) => ({
  word: a[0], reading: a[1] || "", romaji: a[2] || "", meaning: a[3] || "",
  partOfSpeech: a[4] || "", exampleSentence: a[5] || "", exampleReading: a[6] || "",
  exampleMeaning: a[7] || "", level: "N5",
});

const SETS = {
  "n5-numbers": [
    ["ゼロ", "ゼロ", "zero", "zero (0); also 零 / れい", "Number"],
    ["一", "いち", "ichi", "one (1)", "Number"],
    ["二", "に", "ni", "two (2)", "Number"],
    ["三", "さん", "san", "three (3)", "Number"],
    ["四", "よん", "yon", "four (4); also し (shi)", "Number"],
    ["五", "ご", "go", "five (5)", "Number"],
    ["六", "ろく", "roku", "six (6)", "Number"],
    ["七", "なな", "nana", "seven (7); also しち (shichi)", "Number"],
    ["八", "はち", "hachi", "eight (8)", "Number"],
    ["九", "きゅう", "kyuu", "nine (9); also く (ku)", "Number"],
    ["十", "じゅう", "juu", "ten (10)", "Number"],
    ["百", "ひゃく", "hyaku", "hundred (100)", "Number"],
    ["千", "せん", "sen", "thousand (1,000)", "Number"],
    ["万", "まん", "man", "ten thousand (10,000)", "Number"],
  ],
  "n5-datetime": [
    ["今日", "きょう", "kyou", "today", "Noun", "今日は月曜日です。", "きょうはげつようびです。", "Today is Monday."],
    ["明日", "あした", "ashita", "tomorrow", "Noun"],
    ["昨日", "きのう", "kinou", "yesterday", "Noun"],
    ["今", "いま", "ima", "now", "Noun", "今、何時ですか。", "いま、なんじですか。", "What time is it now?"],
    ["朝", "あさ", "asa", "morning", "Noun"],
    ["昼", "ひる", "hiru", "noon; daytime", "Noun"],
    ["夜", "よる", "yoru", "night; evening", "Noun"],
    ["時", "じ", "ji", "o'clock (hour counter)", "Counter", "三時です。", "さんじです。", "It's three o'clock."],
    ["分", "ふん", "fun", "minute(s)", "Counter"],
    ["半", "はん", "han", "half past (the hour)", "Noun"],
    ["午前", "ごぜん", "gozen", "a.m.; morning", "Noun"],
    ["午後", "ごご", "gogo", "p.m.; afternoon", "Noun"],
    ["月曜日", "げつようび", "getsuyoubi", "Monday", "Noun"],
    ["火曜日", "かようび", "kayoubi", "Tuesday", "Noun"],
    ["水曜日", "すいようび", "suiyoubi", "Wednesday", "Noun"],
    ["木曜日", "もくようび", "mokuyoubi", "Thursday", "Noun"],
    ["金曜日", "きんようび", "kinyoubi", "Friday", "Noun"],
    ["土曜日", "どようび", "doyoubi", "Saturday", "Noun"],
    ["日曜日", "にちようび", "nichiyoubi", "Sunday", "Noun"],
  ],
  "n5-counters": [
    ["〜つ", "つ", "tsu", "general counter for things (1–10: ひとつ, ふたつ…)", "Counter", "りんごを三つください。", "りんごをみっつください。", "Three apples, please."],
    ["〜人", "にん", "nin", "counter for people (note ひとり, ふたり)", "Counter", "学生が二人います。", "がくせいがふたりいます。", "There are two students."],
    ["〜本", "ほん", "hon", "counter for long, cylindrical objects", "Counter", "ペンが三本あります。", "ペンがさんぼんあります。", "There are three pens."],
    ["〜枚", "まい", "mai", "counter for flat, thin objects", "Counter"],
    ["〜匹", "ひき", "hiki", "counter for small animals", "Counter"],
    ["〜個", "こ", "ko", "counter for small objects", "Counter"],
    ["〜台", "だい", "dai", "counter for machines & vehicles", "Counter"],
    ["〜回", "かい", "kai", "counter for times / occurrences", "Counter"],
    ["〜歳", "さい", "sai", "counter for years of age (also 才)", "Counter", "十歳です。", "じゅっさいです。", "I'm ten years old."],
    ["〜冊", "さつ", "satsu", "counter for books & magazines", "Counter"],
    ["〜杯", "はい", "hai", "counter for cupfuls / glassfuls", "Counter"],
  ],
  "n5-greetings": [
    ["おはようございます", "", "ohayou gozaimasu", "Good morning (polite)", "Expression"],
    ["こんにちは", "", "konnichiwa", "Hello / Good afternoon", "Expression"],
    ["こんばんは", "", "konbanwa", "Good evening", "Expression"],
    ["さようなら", "", "sayounara", "Goodbye", "Expression"],
    ["おやすみなさい", "", "oyasuminasai", "Good night", "Expression"],
    ["ありがとうございます", "", "arigatou gozaimasu", "Thank you", "Expression"],
    ["すみません", "", "sumimasen", "Excuse me / I'm sorry", "Expression"],
    ["ごめんなさい", "", "gomennasai", "I'm sorry", "Expression"],
    ["いただきます", "", "itadakimasu", "(said before eating)", "Expression"],
    ["ごちそうさまでした", "", "gochisousama deshita", "(said after eating)", "Expression"],
    ["はい", "", "hai", "yes", "Expression"],
    ["いいえ", "", "iie", "no", "Expression"],
  ],
  "n5-introductions": [
    ["はじめまして", "", "hajimemashite", "Nice to meet you (first meeting)", "Expression"],
    ["よろしくおねがいします", "", "yoroshiku onegaishimasu", "Pleased to meet you / please treat me well", "Expression"],
    ["お名前は", "おなまえは", "onamae wa", "What is your name?", "Expression"],
    ["私は〜です", "わたしは〜です", "watashi wa ... desu", "I am ...", "Expression"],
    ["〜から来ました", "〜からきました", "... kara kimashita", "I come from ...", "Expression"],
    ["学生です", "がくせいです", "gakusei desu", "I am a student", "Expression"],
    ["お元気ですか", "おげんきですか", "ogenki desu ka", "How are you?", "Expression"],
    ["元気です", "げんきです", "genki desu", "I'm fine", "Expression"],
    ["〜さん", "", "san", "Mr. / Ms. (polite name suffix)", "Suffix"],
    ["どうぞよろしく", "", "douzo yoroshiku", "Nice to meet you (casual)", "Expression"],
  ],
  "n5-classroom": [
    ["わかりました", "", "wakarimashita", "I understand / understood", "Expression"],
    ["わかりません", "", "wakarimasen", "I don't understand", "Expression"],
    ["もう一度おねがいします", "もういちどおねがいします", "mou ichido onegaishimasu", "Once more, please", "Expression"],
    ["ちょっと待ってください", "ちょっとまってください", "chotto matte kudasai", "Please wait a moment", "Expression"],
    ["質問があります", "しつもんがあります", "shitsumon ga arimasu", "I have a question", "Expression"],
    ["〜は何ですか", "〜はなんですか", "... wa nan desu ka", "What is ...?", "Expression"],
    ["聞いてください", "きいてください", "kiite kudasai", "Please listen", "Expression"],
    ["見てください", "みてください", "mite kudasai", "Please look", "Expression"],
    ["読んでください", "よんでください", "yonde kudasai", "Please read", "Expression"],
    ["書いてください", "かいてください", "kaite kudasai", "Please write", "Expression"],
  ],
  "n5-shopping": [
    ["いくらですか", "", "ikura desu ka", "How much is it?", "Expression"],
    ["これ", "", "kore", "this (one)", "Pronoun"],
    ["それ", "", "sore", "that (one, near you)", "Pronoun"],
    ["あれ", "", "are", "that (one, over there)", "Pronoun"],
    ["〜をください", "", "... o kudasai", "Please give me ...", "Expression"],
    ["ください", "", "kudasai", "please (give me)", "Expression"],
    ["高いです", "たかいです", "takai desu", "It's expensive", "Expression"],
    ["安いです", "やすいです", "yasui desu", "It's cheap", "Expression"],
    ["〜はありますか", "", "... wa arimasu ka", "Do you have ...?", "Expression"],
    ["ありがとうございました", "", "arigatou gozaimashita", "Thank you (for what you did)", "Expression"],
  ],
  "n5-grammar-structure": [
    ["〜は〜です", "", "", "\"A is B\" — basic statement", "Grammar", "私は学生です。", "わたしはがくせいです。", "I am a student."],
    ["〜も〜です", "", "", "\"A is also B\"", "Grammar", "私も学生です。", "わたしもがくせいです。", "I am also a student."],
    ["〜の〜", "", "", "\"B of A\" / possession (A's B)", "Grammar", "私の本です。", "わたしのほんです。", "It is my book."],
    ["これ・それ・あれ", "", "", "this / that / that over there", "Grammar", "これは本です。", "これはほんです。", "This is a book."],
    ["ここ・そこ・あそこ", "", "", "here / there / over there", "Grammar", "トイレはあそこです。", "トイレはあそこです。", "The toilet is over there."],
    ["〜があります／います", "", "", "\"there is\" (objects / living things)", "Grammar", "猫がいます。", "ねこがいます。", "There is a cat."],
  ],
  "n5-grammar-questions": [
    ["〜ですか", "", "", "yes/no question — \"Is it ~?\"", "Grammar", "学生ですか。", "がくせいですか。", "Are you a student?"],
    ["何ですか", "なんですか", "", "\"What is it?\"", "Grammar", "これは何ですか。", "これはなんですか。", "What is this?"],
    ["だれですか", "", "", "\"Who is it?\"", "Grammar", "あの人はだれですか。", "あのひとはだれですか。", "Who is that person?"],
    ["どこですか", "", "", "\"Where is it?\"", "Grammar", "駅はどこですか。", "えきはどこですか。", "Where is the station?"],
    ["いつですか", "", "", "\"When is it?\"", "Grammar", "テストはいつですか。", "テストはいつですか。", "When is the test?"],
    ["どうですか", "", "", "\"How is it? / How about it?\"", "Grammar", "日本語はどうですか。", "にほんごはどうですか。", "How is (your) Japanese?"],
  ],
  "n5-grammar-negatives": [
    ["〜じゃありません", "", "", "\"is not\" (noun / na-adjective, polite)", "Grammar", "学生じゃありません。", "がくせいじゃありません。", "I'm not a student."],
    ["〜ではありません", "", "", "\"is not\" (more formal)", "Grammar", "学生ではありません。", "がくせいではありません。", "I am not a student."],
    ["〜ません", "", "", "\"do not ~\" (verb, polite)", "Grammar", "食べません。", "たべません。", "I don't eat (it)."],
    ["〜ませんでした", "", "", "\"did not ~\" (verb, past polite)", "Grammar", "行きませんでした。", "いきませんでした。", "I didn't go."],
    ["〜くないです", "", "", "\"is not ~\" (い-adjective)", "Grammar", "高くないです。", "たかくないです。", "It's not expensive."],
    ["ありません", "", "", "\"there isn't / don't have\"", "Grammar", "お金がありません。", "おかねがありません。", "I have no money."],
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

// Generates N4 "coming soon" study decks (Grammar Patterns, Particles,
// Phrases & Expressions) as vocab-schema JSON + .js fallbacks for file://.
// Mirrors build-n5-extra.js. Run: node build-n4-extra.js
const fs = require("fs");
const path = require("path");
const DATA = path.join(__dirname, "data");

// [word, reading, romaji, meaning, partOfSpeech, exSentence, exReading, exMeaning]
const E = (a) => ({
  word: a[0], reading: a[1] || "", romaji: a[2] || "", meaning: a[3] || "",
  partOfSpeech: a[4] || "", exampleSentence: a[5] || "", exampleReading: a[6] || "",
  exampleMeaning: a[7] || "", level: "N4",
});

const SETS = {
  // ---------------- Grammar Patterns ----------------
  "n4-grammar-all": [
    ["〜なければならない", "", "nakereba naranai", "must / have to do", "Grammar", "薬を飲まなければならない。", "くすりをのまなければならない。", "I have to take medicine."],
    ["〜なくてもいい", "", "nakute mo ii", "don't have to", "Grammar", "明日は来なくてもいいです。", "あしたはこなくてもいいです。", "You don't have to come tomorrow."],
    ["〜ことができる", "", "koto ga dekiru", "can / be able to", "Grammar", "漢字を読むことができる。", "かんじをよむことができる。", "I can read kanji."],
    ["〜つもりだ", "", "tsumori da", "intend to", "Grammar", "来年留学するつもりだ。", "らいねんりゅうがくするつもりだ。", "I intend to study abroad next year."],
    ["〜たほうがいい", "", "ta hou ga ii", "had better / should", "Grammar", "早く寝たほうがいい。", "はやくねたほうがいい。", "You'd better sleep early."],
    ["〜すぎる", "", "sugiru", "too much / excessively", "Grammar", "ゆうべ食べすぎた。", "ゆうべたべすぎた。", "I ate too much last night."],
    ["〜やすい・〜にくい", "", "yasui / nikui", "easy to / hard to do", "Grammar", "この本は読みやすい。", "このほんはよみやすい。", "This book is easy to read."],
    ["〜ながら", "", "nagara", "while doing", "Grammar", "音楽を聞きながら勉強する。", "おんがくをききながらべんきょうする。", "I study while listening to music."],
    ["〜そうだ", "", "sou da", "looks like / seems (appearance)", "Grammar", "そのケーキ、おいしそうだ。", "そのケーキ、おいしそうだ。", "That cake looks delicious."],
    ["〜でしょう", "", "deshou", "probably / I suppose", "Grammar", "明日は晴れるでしょう。", "あしたははれるでしょう。", "It will probably be sunny tomorrow."],
  ],
  "n4-grammar-teform": [
    ["〜てください", "", "te kudasai", "please do ~", "Grammar", "窓を開けてください。", "まどをあけてください。", "Please open the window."],
    ["〜ている", "", "te iru", "be ~ing (progressive)", "Grammar", "今、本を読んでいる。", "いま、ほんをよんでいる。", "I'm reading a book now."],
    ["〜てもいい", "", "te mo ii", "may / it's okay to", "Grammar", "入ってもいいですか。", "はいってもいいですか。", "May I come in?"],
    ["〜てはいけない", "", "te wa ikenai", "must not", "Grammar", "ここで写真を撮ってはいけない。", "ここでしゃしんをとってはいけない。", "You must not take photos here."],
    ["〜てから", "", "te kara", "after doing ~", "Grammar", "食べてから出かけます。", "たべてからでかけます。", "I go out after eating."],
    ["〜てみる", "", "te miru", "try doing ~", "Grammar", "この服を着てみます。", "このふくをきてみます。", "I'll try on these clothes."],
    ["〜ておく", "", "te oku", "do ~ in advance", "Grammar", "旅行の前に予約しておく。", "りょこうのまえによやくしておく。", "I'll make a reservation before the trip."],
    ["〜てしまう", "", "te shimau", "do completely / end up doing", "Grammar", "宿題を全部してしまった。", "しゅくだいをぜんぶしてしまった。", "I finished all the homework."],
    ["〜てある", "", "te aru", "has been done (state)", "Grammar", "ドアに名前が書いてある。", "ドアになまえがかいてある。", "A name is written on the door."],
    ["〜てくる・〜ていく", "", "te kuru / te iku", "come to ~ / go on ~ing", "Grammar", "だんだん寒くなってきた。", "だんだんさむくなってきた。", "It has gradually gotten colder."],
  ],
  "n4-grammar-conditional": [
    ["〜たら", "", "tara", "if / when (then)", "Grammar", "雨が降ったら行きません。", "あめがふったらいきません。", "If it rains, I won't go."],
    ["〜ば", "", "ba", "if (hypothetical)", "Grammar", "安ければ買います。", "やすければかいます。", "If it's cheap, I'll buy it."],
    ["〜と", "", "to", "whenever / natural result", "Grammar", "春になると桜が咲く。", "はるになるとさくらがさく。", "When spring comes, the cherry blossoms bloom."],
    ["〜なら", "", "nara", "if it's the case that", "Grammar", "日本へ行くなら京都がいい。", "にほんへいくならきょうとがいい。", "If you're going to Japan, Kyoto is good."],
    ["〜場合は", "〜ばあいは", "baai wa", "in the case of", "Grammar", "遅れる場合は連絡してください。", "おくれるばあいはれんらくしてください。", "In case you'll be late, please contact us."],
    ["〜とき", "", "toki", "when / at the time of", "Grammar", "子供のとき、よく泳いだ。", "こどものとき、よくおよいだ。", "When I was a child, I swam often."],
    ["〜ても", "", "te mo", "even if", "Grammar", "高くても買います。", "たかくてもかいます。", "Even if it's expensive, I'll buy it."],
    ["〜たらどうですか", "", "tara dou desu ka", "why don't you ~?", "Grammar", "医者に行ったらどうですか。", "いしゃにいったらどうですか。", "Why don't you go to the doctor?"],
  ],
  "n4-grammar-giving": [
    ["あげる", "", "ageru", "to give (to others)", "Grammar", "友達にプレゼントをあげる。", "ともだちにプレゼントをあげる。", "I give a present to my friend."],
    ["くれる", "", "kureru", "to give (to me/us)", "Grammar", "兄が本をくれた。", "あにがほんをくれた。", "My older brother gave me a book."],
    ["もらう", "", "morau", "to receive", "Grammar", "友達にチョコをもらった。", "ともだちにチョコをもらった。", "I received chocolate from a friend."],
    ["〜てあげる", "", "te ageru", "do ~ for someone", "Grammar", "道を教えてあげた。", "みちをおしえてあげた。", "I told them the way (as a favor)."],
    ["〜てくれる", "", "te kureru", "do ~ for me", "Grammar", "友達が手伝ってくれた。", "ともだちがてつだってくれた。", "My friend helped me."],
    ["〜てもらう", "", "te morau", "have someone do ~", "Grammar", "先生に直してもらった。", "せんせいになおしてもらった。", "I had the teacher correct it."],
    ["さしあげる", "", "sashiageru", "to give (humble)", "Grammar", "先生にお土産をさしあげる。", "せんせいにおみやげをさしあげる。", "I give a souvenir to my teacher (humble)."],
    ["いただく", "", "itadaku", "to receive (humble)", "Grammar", "部長にアドバイスをいただいた。", "ぶちょうにアドバイスをいただいた。", "I received advice from my manager (humble)."],
    ["くださる", "", "kudasaru", "to give to me (honorific)", "Grammar", "先生が説明してくださった。", "せんせいがせつめいしてくださった。", "The teacher kindly explained (for me)."],
  ],

  // ---------------- Particles ----------------
  "n4-particles-advanced": [
    ["のに", "", "noni", "although / even though", "Particle", "勉強したのに、忘れた。", "べんきょうしたのに、わすれた。", "Although I studied, I forgot."],
    ["ので", "", "node", "because (softer)", "Particle", "雨なので、行きません。", "あめなので、いきません。", "Because it's raining, I won't go."],
    ["ばかり", "", "bakari", "only / nothing but", "Particle", "弟はゲームばかりしている。", "おとうとはゲームばかりしている。", "My brother does nothing but play games."],
    ["しか〜ない", "", "shika ... nai", "only (with negative)", "Particle", "千円しかありません。", "せんえんしかありません。", "I only have 1000 yen."],
    ["だけ", "", "dake", "only / just", "Particle", "一人だけ来た。", "ひとりだけきた。", "Only one person came."],
    ["でも", "", "demo", "~ or something / even", "Particle", "お茶でも飲みませんか。", "おちゃでものみませんか。", "Shall we have some tea or something?"],
    ["とか", "", "toka", "things like ~ (examples)", "Particle", "寿司とか天ぷらが好きだ。", "すしとかてんぷらがすきだ。", "I like things like sushi and tempura."],
    ["ほど", "", "hodo", "to the extent of", "Particle", "死ぬほど疲れた。", "しぬほどつかれた。", "I'm dead tired (tired to the point of dying)."],
    ["くらい・ぐらい", "", "kurai / gurai", "about / to the degree", "Particle", "駅まで一時間くらいかかる。", "えきまでいちじかんくらいかかる。", "It takes about an hour to the station."],
  ],
  "n4-particles-compound": [
    ["について", "", "ni tsuite", "about / concerning", "Particle", "日本の歴史について話す。", "にほんのれきしについてはなす。", "I talk about Japanese history."],
    ["によって", "", "ni yotte", "by / depending on", "Particle", "人によって考えが違う。", "ひとによってかんがえがちがう。", "Opinions differ depending on the person."],
    ["として", "", "toshite", "as (a role)", "Particle", "彼は先生として働いている。", "かれはせんせいとしてはたらいている。", "He works as a teacher."],
    ["にとって", "", "ni totte", "for / to (from the standpoint of)", "Particle", "私にとって家族が一番大切だ。", "わたしにとってかぞくがいちばんたいせつだ。", "For me, family is the most important."],
    ["に対して", "〜にたいして", "ni taishite", "toward / regarding", "Particle", "質問に対して答える。", "しつもんにたいしてこたえる。", "I answer the question."],
    ["のために", "", "no tame ni", "for the sake of / in order to", "Particle", "家族のために働く。", "かぞくのためにはたらく。", "I work for my family."],
    ["によると", "", "ni yoru to", "according to", "Particle", "天気予報によると、明日は雨だ。", "てんきよほうによると、あしたはあめだ。", "According to the forecast, it'll rain tomorrow."],
    ["に比べて", "〜にくらべて", "ni kurabete", "compared to", "Particle", "去年に比べて暑い。", "きょねんにくらべてあつい。", "It's hot compared to last year."],
    ["のように", "", "no you ni", "like / as", "Particle", "鳥のように飛びたい。", "とりのようにとびたい。", "I want to fly like a bird."],
  ],

  // ---------------- Phrases & Expressions ----------------
  "n4-phrases-daily": [
    ["お久しぶりです", "おひさしぶりです", "o-hisashiburi desu", "Long time no see", "Expression", "お久しぶりです。お元気ですか。", "おひさしぶりです。おげんきですか。", "Long time no see. How are you?"],
    ["おかげさまで", "", "okagesama de", "thanks to you (I'm well)", "Expression", "おかげさまで元気です。", "おかげさまでげんきです。", "Thanks to you, I'm doing well."],
    ["お疲れ様です", "おつかれさまです", "otsukaresama desu", "thanks for your hard work", "Expression", "お疲れ様でした。", "おつかれさまでした。", "Thank you for your hard work (today)."],
    ["大丈夫です", "だいじょうぶです", "daijoubu desu", "it's fine / I'm okay", "Expression", "大丈夫です、心配しないで。", "だいじょうぶです、しんぱいしないで。", "It's okay, don't worry."],
    ["なるほど", "", "naruhodo", "I see / that makes sense", "Expression", "なるほど、わかりました。", "なるほど、わかりました。", "I see, I understand now."],
    ["そうですね", "", "sou desu ne", "that's right / let me see", "Expression", "そうですね、いいと思います。", "そうですね、いいとおもいます。", "Right, I think it's good."],
    ["とんでもないです", "", "tondemonai desu", "not at all / don't mention it", "Expression", "いいえ、とんでもないです。", "いいえ、とんでもないです。", "No, not at all."],
    ["気をつけて", "きをつけて", "ki o tsukete", "take care", "Expression", "気をつけて帰ってください。", "きをつけてかえってください。", "Take care on your way home."],
    ["また今度", "またこんど", "mata kondo", "next time / some other time", "Expression", "また今度会いましょう。", "またこんどあいましょう。", "Let's meet next time."],
  ],
  "n4-phrases-opinion": [
    ["〜と思います", "〜とおもいます", "to omoimasu", "I think that ~", "Expression", "いい考えだと思います。", "いいかんがえだとおもいます。", "I think it's a good idea."],
    ["私の意見では", "わたしのいけんでは", "watashi no iken de wa", "in my opinion", "Expression", "私の意見では、賛成です。", "わたしのいけんでは、さんせいです。", "In my opinion, I agree."],
    ["賛成です", "さんせいです", "sansei desu", "I agree", "Expression", "その案に賛成です。", "そのあんにさんせいです。", "I agree with that proposal."],
    ["反対です", "はんたいです", "hantai desu", "I disagree / I'm against it", "Expression", "私は反対です。", "わたしははんたいです。", "I'm against it."],
    ["〜かもしれない", "", "kamoshirenai", "might / maybe", "Expression", "雨が降るかもしれない。", "あめがふるかもしれない。", "It might rain."],
    ["〜はずです", "", "hazu desu", "should / be supposed to", "Expression", "彼は来るはずです。", "かれはくるはずです。", "He's supposed to come."],
    ["確かに", "たしかに", "tashika ni", "certainly / indeed", "Expression", "確かにその通りです。", "たしかにそのとおりです。", "Indeed, that's right."],
    ["〜べきだ", "", "beki da", "should / ought to", "Expression", "もっと努力するべきだ。", "もっとどりょくするべきだ。", "You should make more effort."],
    ["そうは思いません", "そうはおもいません", "sou wa omoimasen", "I don't think so", "Expression", "すみませんが、そうは思いません。", "すみませんが、そうはおもいません。", "Sorry, but I don't think so."],
  ],
  "n4-phrases-request": [
    ["〜てください", "", "te kudasai", "please do ~", "Expression", "ドアを閉めてください。", "ドアをしめてください。", "Please close the door."],
    ["〜ていただけませんか", "", "te itadakemasen ka", "could you please ~? (polite)", "Expression", "手伝っていただけませんか。", "てつだっていただけませんか。", "Could you please help me?"],
    ["〜てもらえますか", "", "te moraemasu ka", "can you do ~ for me?", "Expression", "写真を撮ってもらえますか。", "しゃしんをとってもらえますか。", "Can you take a photo for me?"],
    ["〜ないでください", "", "nai de kudasai", "please don't ~", "Expression", "ここに入らないでください。", "ここにはいらないでください。", "Please don't enter here."],
    ["お願いします", "おねがいします", "onegai shimasu", "please (I request)", "Expression", "これをお願いします。", "これをおねがいします。", "This one, please."],
    ["〜てくれませんか", "", "te kuremasen ka", "won't you do ~?", "Expression", "ペンを貸してくれませんか。", "ペンをかしてくれませんか。", "Won't you lend me a pen?"],
    ["〜させてください", "", "sasete kudasai", "please let me ~", "Expression", "少し休ませてください。", "すこしやすませてください。", "Please let me rest a little."],
    ["〜てほしい", "", "te hoshii", "I want you to ~", "Expression", "そばに来てほしい。", "そばにきてほしい。", "I want you to come close."],
    ["〜ていただきたいんですが", "", "te itadakitai n desu ga", "I'd like you to ~ (very polite)", "Expression", "確認していただきたいんですが。", "かくにんしていただきたいんですが。", "I'd like you to confirm it, if possible."],
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

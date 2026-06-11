// Populates the N4 grammar study decks with full, accurate content.
// vocab-schema JSON + .js fallback for file://. Run: node build-grammar-n4.js
const fs = require("fs");
const path = require("path");
const DATA = path.join(__dirname, "data");

const E = (a) => ({
  word: a[0], reading: a[1] || "", romaji: a[2] || "", meaning: a[3] || "",
  partOfSpeech: a[4] || "Grammar", exampleSentence: a[5] || "", exampleReading: a[6] || "",
  exampleMeaning: a[7] || "", level: "N4",
});

const SETS = {
  // ---------------- All N4 Grammar (broad core set) ----------------
  "n4-grammar-all": [
    ["〜なければならない", "", "nakereba naranai", "must / have to do", "Grammar", "薬を飲まなければならない。", "くすりをのまなければならない。", "I have to take my medicine."],
    ["〜なくてもいい", "", "nakute mo ii", "don't have to", "Grammar", "明日は来なくてもいい。", "あしたはこなくてもいい。", "You don't have to come tomorrow."],
    ["〜ことができる", "", "koto ga dekiru", "can / be able to", "Grammar", "私は漢字を読むことができる。", "わたしはかんじをよむことができる。", "I can read kanji."],
    ["〜たことがある", "", "ta koto ga aru", "have done before (experience)", "Grammar", "日本に行ったことがある。", "にほんにいったことがある。", "I have been to Japan before."],
    ["〜たり〜たりする", "", "tari ~tari suru", "do things like ~ and ~", "Grammar", "週末は本を読んだり音楽を聞いたりする。", "しゅうまつはほんをよんだりおんがくをきいたりする。", "On weekends I do things like read and listen to music."],
    ["〜つもりだ", "", "tsumori da", "intend to / plan to", "Grammar", "来年、留学するつもりだ。", "らいねん、りゅうがくするつもりだ。", "I intend to study abroad next year."],
    ["〜ようと思う", "", "you to omou", "I think I'll ~ (decision)", "Grammar", "今日は早く寝ようと思う。", "きょうははやくねようとおもう。", "I think I'll go to bed early today."],
    ["〜そうだ (様態)", "", "sou da", "looks like / seems (appearance)", "Grammar", "雨が降りそうだ。", "あめがふりそうだ。", "It looks like it's going to rain."],
    ["〜らしい", "", "rashii", "seems / I hear that", "Grammar", "彼は今日来ないらしい。", "かれはきょうこないらしい。", "It seems he isn't coming today."],
    ["〜みたいだ", "", "mitai da", "looks like / seems", "Grammar", "風邪をひいたみたいだ。", "かぜをひいたみたいだ。", "It seems I've caught a cold."],
    ["〜はずだ", "", "hazu da", "should be / supposed to", "Grammar", "彼はもう着いているはずだ。", "かれはもうついているはずだ。", "He should have arrived by now."],
    ["〜場合は", "", "baai wa", "in the case of / if", "Grammar", "地震の場合はエレベーターを使わないでください。", "じしんのばあいはエレベーターをつかわないでください。", "In case of an earthquake, please don't use the elevator."],
    ["〜のに", "", "noni", "although / even though", "Grammar", "約束したのに彼は来なかった。", "やくそくしたのにかれはこなかった。", "Even though he promised, he didn't come."],
    ["〜ので", "", "node", "because (polite, objective reason)", "Grammar", "用事があるので、お先に失礼します。", "ようじがあるので、おさきにしつれいします。", "I have something to do, so I'll be leaving first."],
    ["〜ても", "", "te mo", "even if / even though", "Grammar", "雨が降っても行きます。", "あめがふってもいきます。", "I'll go even if it rains."],
    ["〜し", "", "shi", "and (listing reasons / qualities)", "Grammar", "この店は安いし、おいしい。", "このみせはやすいし、おいしい。", "This place is cheap, and it's tasty too."],
    ["〜ながら", "", "nagara", "while doing (two actions at once)", "Grammar", "音楽を聞きながら勉強する。", "おんがくをききながらべんきょうする。", "I study while listening to music."],
    ["〜方 (かた)", "", "kata", "way / how to do", "Grammar", "漢字の書き方を教えてください。", "かんじのかきかたをおしえてください。", "Please teach me how to write kanji."],
    ["〜やすい", "", "yasui", "easy to ~", "Grammar", "この本は読みやすい。", "このほんはよみやすい。", "This book is easy to read."],
    ["〜にくい", "", "nikui", "hard to ~", "Grammar", "この薬は飲みにくい。", "このくすりはのみにくい。", "This medicine is hard to take."],
    ["〜すぎる", "", "sugiru", "too much / excessively", "Grammar", "昨日は食べすぎてお腹が痛い。", "きのうはたべすぎておなかがいたい。", "I ate too much yesterday and my stomach hurts."],
    ["〜ておく", "", "te oku", "do in advance / leave as is", "Grammar", "旅行の前に切符を買っておく。", "りょこうのまえにきっぷをかっておく。", "I'll buy the tickets before the trip."],
    ["〜てしまう", "", "te shimau", "finish completely / do (regrettably)", "Grammar", "大事な書類を忘れてしまった。", "だいじなしょるいをわすれてしまった。", "I went and forgot the important documents."],
    ["〜てみる", "", "te miru", "try doing", "Grammar", "新しいレストランで食べてみる。", "あたらしいレストランでたべてみる。", "I'll try eating at the new restaurant."],
    ["〜ていく", "", "te iku", "go on ~ing / ~ away (into the future)", "Grammar", "これから暑くなっていく。", "これからあつくなっていく。", "It's going to get hotter from now on."],
    ["〜てくる", "", "te kuru", "come to ~ / begin to ~", "Grammar", "急に雨が降ってきた。", "きゅうにあめがふってきた。", "It suddenly started to rain."],
    ["〜という", "", "to iu", "called / named", "Grammar", "田中という人から電話があった。", "たなかというひとからでんわがあった。", "There was a call from a person named Tanaka."],
    ["〜かもしれない", "", "kamo shirenai", "might / maybe", "Grammar", "明日は雪が降るかもしれない。", "あしたはゆきがふるかもしれない。", "It might snow tomorrow."],
  ],

  // ---------------- Te-form patterns ----------------
  "n4-grammar-teform": [
    ["〜てください", "", "te kudasai", "please do ~", "Grammar", "窓を開けてください。", "まどをあけてください。", "Please open the window."],
    ["〜ている", "", "te iru", "be ~ing / ongoing state", "Grammar", "今、本を読んでいる。", "いま、ほんをよんでいる。", "I'm reading a book now."],
    ["〜てもいい", "", "te mo ii", "may / it's okay to", "Grammar", "ここに座ってもいいですか。", "ここにすわってもいいですか。", "May I sit here?"],
    ["〜てはいけない", "", "te wa ikenai", "must not / not allowed to", "Grammar", "ここでタバコを吸ってはいけない。", "ここでタバコをすってはいけない。", "You must not smoke here."],
    ["〜てから", "", "te kara", "after doing", "Grammar", "手を洗ってからご飯を食べる。", "てをあらってからごはんをたべる。", "I eat after washing my hands."],
    ["〜てある", "", "te aru", "has been done (resultant state)", "Grammar", "壁に絵が掛けてある。", "かべにえがかけてある。", "A picture has been hung on the wall."],
    ["〜ておく", "", "te oku", "do in advance / leave prepared", "Grammar", "会議の前に資料を準備しておく。", "かいぎのまえにしりょうをじゅんびしておく。", "I'll prepare the materials before the meeting."],
    ["〜てしまう", "", "te shimau", "do completely / unfortunately", "Grammar", "財布をなくしてしまった。", "さいふをなくしてしまった。", "I went and lost my wallet."],
    ["〜てみる", "", "te miru", "try doing", "Grammar", "この服を着てみてもいいですか。", "このふくをきてみてもいいですか。", "May I try on these clothes?"],
    ["〜ていく", "", "te iku", "do and go / continue on", "Grammar", "傘を持っていく。", "かさをもっていく。", "I'll take an umbrella with me."],
    ["〜てくる", "", "te kuru", "go and come back / begin to", "Grammar", "ちょっとコンビニに行ってくる。", "ちょっとコンビニにいってくる。", "I'll just pop over to the convenience store."],
    ["〜てもかまわない", "", "te mo kamawanai", "don't mind if / it's fine to", "Grammar", "窓を閉めてもかまいませんか。", "まどをしめてもかまいませんか。", "Do you mind if I close the window?"],
    ["〜てばかりいる", "", "te bakari iru", "do nothing but ~", "Grammar", "弟はゲームをしてばかりいる。", "おとうとはゲームをしてばかりいる。", "My little brother does nothing but play games."],
    ["〜てほしい", "", "te hoshii", "want someone to ~", "Grammar", "もっと私の話を聞いてほしい。", "もっとわたしのはなしをきいてほしい。", "I want you to listen to me more."],
    ["〜ているところ", "", "te iru tokoro", "in the middle of ~ing", "Grammar", "今、夕飯を作っているところだ。", "いま、ゆうはんをつくっているところだ。", "I'm in the middle of making dinner right now."],
  ],

  // ---------------- Conditional forms ----------------
  "n4-grammar-conditional": [
    ["〜と (自然な結果)", "", "to", "whenever / if (natural, inevitable result)", "Grammar", "春になると桜が咲く。", "はるになるとさくらがさく。", "When spring comes, the cherry blossoms bloom."],
    ["〜ば", "", "ba", "if (hypothetical condition)", "Grammar", "値段が安ければ買います。", "ねだんがやすければかいます。", "If the price is cheap, I'll buy it."],
    ["〜なければ", "", "nakereba", "if (one) doesn't ~", "Grammar", "急がなければ間に合わない。", "いそがなければまにあわない。", "If we don't hurry, we won't make it in time."],
    ["〜たら", "", "tara", "if / when (once ~ happens)", "Grammar", "駅に着いたら電話してください。", "えきについたらでんわしてください。", "Please call me when you arrive at the station."],
    ["〜なら", "", "nara", "if it's the case that ~", "Grammar", "日本へ行くなら京都がおすすめだ。", "にほんへいくならきょうとがおすすめだ。", "If you're going to Japan, I recommend Kyoto."],
    ["〜たら (発見)", "", "tara", "when ~ (and then discovered)", "Grammar", "家に帰ったら誰もいなかった。", "いえにかえったらだれもいなかった。", "When I got home, no one was there."],
    ["〜ないと", "", "nai to", "have to (lit. if (one) doesn't ~)", "Grammar", "もう行かないと遅れるよ。", "もういかないとおくれるよ。", "I have to go now or I'll be late."],
    ["〜ば〜ほど", "", "ba ~hodo", "the more ~, the more ~", "Grammar", "練習すればするほど上手になる。", "れんしゅうすればするほどじょうずになる。", "The more you practice, the better you become."],
    ["〜たらどうですか", "", "tara dou desu ka", "why don't you ~? (suggestion)", "Grammar", "一度、医者に行ったらどうですか。", "いちど、いしゃにいったらどうですか。", "Why don't you go see a doctor?"],
    ["もし〜たら", "", "moshi ~tara", "if (hypothetical, with 'moshi')", "Grammar", "もし時間があったら手伝ってください。", "もしじかんがあったらてつだってください。", "If you have time, please help me."],
    ["〜ても", "", "te mo", "even if", "Grammar", "雨が降っても試合は行われる。", "あめがふってもしあいはおこなわれる。", "The match will be held even if it rains."],
    ["〜ばよかった", "", "ba yokatta", "should have ~ (regret)", "Grammar", "もっと早く来ればよかった。", "もっとはやくくればよかった。", "I should have come earlier."],
  ],

  // ---------------- Giving & receiving ----------------
  "n4-grammar-giving": [
    ["あげる", "", "ageru", "give (I/we → others)", "Grammar", "友達に本をあげた。", "ともだちにほんをあげた。", "I gave a book to my friend."],
    ["くれる", "", "kureru", "give (others → me/us)", "Grammar", "兄が私に時計をくれた。", "あにがわたしにとけいをくれた。", "My older brother gave me a watch."],
    ["もらう", "", "morau", "receive", "Grammar", "先生に辞書をもらった。", "せんせいにじしょをもらった。", "I received a dictionary from my teacher."],
    ["〜てあげる", "", "te ageru", "do (something) for someone", "Grammar", "妹の宿題を手伝ってあげた。", "いもうとのしゅくだいをてつだってあげた。", "I helped my little sister with her homework."],
    ["〜てくれる", "", "te kureru", "do (something) for me/us", "Grammar", "友達が駅まで送ってくれた。", "ともだちがえきまでおくってくれた。", "My friend gave me a ride to the station."],
    ["〜てもらう", "", "te morau", "have/get someone to do", "Grammar", "友達に写真を撮ってもらった。", "ともだちにしゃしんをとってもらった。", "I had my friend take a photo for me."],
    ["さしあげる", "", "sashiageru", "give (humble, to a superior)", "Grammar", "先生にお土産をさしあげた。", "せんせいにおみやげをさしあげた。", "I gave my teacher a souvenir (humbly)."],
    ["くださる", "", "kudasaru", "give to me (honorific)", "Grammar", "部長が記念品をくださった。", "ぶちょうがきねんひんをくださった。", "The department head gave me a keepsake (honorific)."],
    ["いただく", "", "itadaku", "receive (humble)", "Grammar", "社長に貴重なアドバイスをいただいた。", "しゃちょうにきちょうなアドバイスをいただいた。", "I received valuable advice from the president (humbly)."],
    ["やる", "", "yaru", "give (to plants, animals, juniors)", "Grammar", "毎朝、花に水をやる。", "まいあさ、はなにみずをやる。", "I water the flowers every morning."],
    ["〜ていただく", "", "te itadaku", "humbly have someone do for me", "Grammar", "先生に作文を直していただいた。", "せんせいにさくぶんをなおしていただいた。", "I had my teacher kindly correct my essay."],
    ["〜てくださる", "", "te kudasaru", "someone kindly does for me (honorific)", "Grammar", "課長が仕事を手伝ってくださった。", "かちょうがしごとをてつだってくださった。", "The section chief kindly helped me with my work."],
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
console.log("N4 grammar TOTAL entries:", total);

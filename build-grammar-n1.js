// Populates the N1 grammar study decks with full, accurate content.
// vocab-schema JSON + .js fallback for file://. Run: node build-grammar-n1.js
const fs = require("fs");
const path = require("path");
const DATA = path.join(__dirname, "data");

const E = (a) => ({
  word: a[0], reading: a[1] || "", romaji: a[2] || "", meaning: a[3] || "",
  partOfSpeech: a[4] || "Grammar", exampleSentence: a[5] || "", exampleReading: a[6] || "",
  exampleMeaning: a[7] || "", level: "N1",
});

const SETS = {
  // ---------------- All N1 Grammar (broad core set) ----------------
  "n1-grammar-all": [
    ["〜にあって", "", "ni atte", "in / at (a special situation)", "Grammar", "緊急時にあって、彼は冷静さを失わなかった。", "きんきゅうじにあって、かれはれいせいさをうしなわなかった。", "Even in an emergency, he didn't lose his composure."],
    ["〜をもとに(して)", "", "o moto ni", "based on / on the basis of", "Grammar", "実話をもとに映画が作られた。", "じつわをもとにえいががつくられた。", "The film was made based on a true story."],
    ["〜に至るまで", "", "ni itaru made", "all the way to / down to", "Grammar", "服装から言葉遣いに至るまで注意された。", "ふくそうからことばづかいにいたるまでちゅういされた。", "I was scolded for everything from my clothes down to my speech."],
    ["〜に至って", "", "ni itatte", "when it finally reached the point of", "Grammar", "事故が起きるに至って、ようやく対策がとられた。", "じこがおきるにいたって、ようやくたいさくがとられた。", "Only when an accident occurred were measures finally taken."],
    ["〜ともなると", "", "to mo naru to", "when it comes to / once it reaches", "Grammar", "年末ともなると、街は混雑する。", "ねんまつともなると、まちはこんざつする。", "When it comes to year-end, the town gets crowded."],
    ["〜ときたら", "", "to kitara", "when it comes to ~ (criticism)", "Grammar", "うちの息子ときたら、全然勉強しない。", "うちのむすこときたら、ぜんぜんべんきょうしない。", "As for my son, he doesn't study at all."],
    ["〜とあって", "", "to atte", "because (a special circumstance)", "Grammar", "連休とあって、どこも人でいっぱいだ。", "れんきゅうとあって、どこもひとでいっぱいだ。", "Because it's a long weekend, everywhere is packed."],
    ["〜や否や", "", "ya inaya", "no sooner ~ than / as soon as", "Grammar", "ベルが鳴るや否や、生徒は教室を出た。", "ベルがなるやいなや、せいとはきょうしつをでた。", "No sooner had the bell rung than the students left the classroom."],
    ["〜が早いか", "", "ga hayai ka", "as soon as / the instant", "Grammar", "席に着くが早いか、彼は話し始めた。", "せきにつくがはやいか、かれははなしはじめた。", "The instant he sat down, he began to talk."],
    ["〜なり", "", "nari", "the moment / as soon as", "Grammar", "彼は帰ってくるなり、部屋に閉じこもった。", "かれはかえってくるなり、へやにとじこもった。", "The moment he got home, he shut himself in his room."],
    ["〜そばから", "", "soba kara", "no sooner ~ than (repeatedly)", "Grammar", "教えるそばから忘れてしまう。", "おしえるそばからわすれてしまう。", "No sooner do I teach it than it's forgotten."],
    ["〜きり", "", "kiri", "only / since (and nothing since)", "Grammar", "彼とは一度会ったきりだ。", "かれとはいちどあったきりだ。", "I've met him only once."],
    ["〜ずくめ", "", "zukume", "entirely / nothing but", "Grammar", "今年はいいことずくめだった。", "ことしはいいことずくめだった。", "This year was nothing but good things."],
    ["〜まみれ", "", "mamire", "covered in / smeared with", "Grammar", "子供は泥まみれになって帰ってきた。", "こどもはどろまみれになってかえってきた。", "The child came home covered in mud."],
    ["〜めく", "", "meku", "to show signs of / become ~-like", "Grammar", "日差しがすっかり春めいてきた。", "ひざしがすっかりはるめいてきた。", "The sunlight has taken on a thoroughly spring-like quality."],
    ["〜べくもない", "", "beku mo nai", "cannot possibly", "Grammar", "素人には知るべくもない。", "しろうとにはしるべくもない。", "An amateur couldn't possibly know."],
    ["〜までもない", "", "made mo nai", "there's no need to / needless to", "Grammar", "言うまでもなく、健康は大切だ。", "いうまでもなく、けんこうはたいせつだ。", "Needless to say, health is important."],
    ["〜に難くない", "", "ni katakunai", "not hard to / easy to imagine", "Grammar", "彼の苦労は想像に難くない。", "かれのくろうはそうぞうにかたくない。", "His hardship is not hard to imagine."],
    ["〜を禁じ得ない", "", "o kinjienai", "cannot suppress / can't help (feeling)", "Grammar", "その光景に涙を禁じ得なかった。", "そのこうけいになみだをきんじえなかった。", "I couldn't hold back my tears at that sight."],
    ["〜てやまない", "", "te yamanai", "sincerely / endlessly (wish)", "Grammar", "皆様のご成功を願ってやみません。", "みなさまのごせいこうをねがってやみません。", "I sincerely wish you all every success."],
    ["〜の極み", "", "no kiwami", "the height of / the extreme of", "Grammar", "連日の残業で、疲労の極みだ。", "れんじつのざんぎょうで、ひろうのきわみだ。", "With days of overtime, I'm at the height of exhaustion."],
    ["〜の至り", "", "no itari", "the height of (an emotion)", "Grammar", "お招きいただき、光栄の至りです。", "おまねきいただき、こうえいのいたりです。", "Being invited, I am deeply honored."],
    ["〜極まりない", "", "kiwamari nai", "extremely / nothing short of", "Grammar", "彼の態度は失礼極まりない。", "かれのたいどはしつれいきわまりない。", "His attitude is extremely rude."],
    ["〜を余儀なくされる", "", "o yogi naku sareru", "be forced to / have no choice but", "Grammar", "台風で試合は中止を余儀なくされた。", "たいふうでしあいはちゅうしをよぎなくされた。", "The match was forced to be canceled due to the typhoon."],
    ["〜といったらない", "", "to ittara nai", "extremely / indescribably", "Grammar", "その景色の美しさといったらない。", "そのけしきのうつくしさといったらない。", "The beauty of that scenery is beyond description."],
  ],

  // ---------------- Advanced structures ----------------
  "n1-grammar-advanced": [
    ["〜ともなく", "", "to mo naku", "without particular intent / aimlessly", "Grammar", "見るともなくテレビを見ていた。", "みるともなくテレビをみていた。", "I was watching TV without really watching it."],
    ["〜とばかりに", "", "to bakari ni", "as if to say", "Grammar", "早く帰れとばかりに、彼は時計を見た。", "はやくかえれとばかりに、かれはとけいをみた。", "He looked at his watch as if to say, \"go home already.\""],
    ["〜んがため(に)", "", "n ga tame ni", "in order to (literary purpose)", "Grammar", "勝たんがために、必死で練習した。", "かたんがために、ひっしでれんしゅうした。", "He practiced desperately in order to win."],
    ["〜がゆえに", "", "ga yue ni", "because of / owing to (formal)", "Grammar", "若さゆえに、無茶をしてしまった。", "わかさゆえに、むちゃをしてしまった。", "Because of his youth, he did something reckless."],
    ["〜であれ", "", "de are", "no matter / whatever it may be", "Grammar", "どんな理由であれ、暴力は許されない。", "どんなりゆうであれ、ぼうりょくはゆるされない。", "Whatever the reason, violence is not permitted."],
    ["〜であろうと", "", "de arou to", "no matter (who/what)", "Grammar", "誰であろうと、ルールは守るべきだ。", "だれであろうと、ルールはまもるべきだ。", "No matter who you are, you should follow the rules."],
    ["〜いかんで(は)", "", "ikan de wa", "depending on", "Grammar", "結果いかんでは、計画を見直す。", "けっかいかんでは、けいかくをみなおす。", "Depending on the results, we'll review the plan."],
    ["〜いかんによらず", "", "ikan ni yorazu", "regardless of", "Grammar", "理由のいかんによらず、遅刻は遅刻だ。", "りゆうのいかんによらず、ちこくはちこくだ。", "Regardless of the reason, late is late."],
    ["〜をものともせず", "", "o mono to mo sezu", "defying / undaunted by", "Grammar", "困難をものともせず、前進した。", "こんなんをものともせず、ぜんしんした。", "Undaunted by hardship, he pressed forward."],
    ["〜をよそに", "", "o yoso ni", "ignoring / in defiance of", "Grammar", "親の心配をよそに、彼は旅に出た。", "おやのしんぱいをよそに、かれはたびにでた。", "Ignoring his parents' worry, he set off on a journey."],
    ["〜ながらに", "", "nagara ni", "while / as it is (set phrases)", "Grammar", "彼女は涙ながらに事情を語った。", "かのじょはなみだながらにじじょうをかたった。", "She tearfully explained the circumstances."],
    ["〜こそすれ", "", "koso sure", "certainly ~ but (not the opposite)", "Grammar", "感謝こそすれ、恨むことはない。", "かんしゃこそすれ、うらむことはない。", "I'm grateful, certainly, but I bear no grudge."],
    ["〜たりとも", "", "tari to mo", "not even (one) / not a single", "Grammar", "一日たりとも忘れたことはない。", "いちにちたりともわすれたことはない。", "I haven't forgotten for even a single day."],
    ["〜にもまして", "", "ni mo mashite", "even more than", "Grammar", "以前にもまして忙しくなった。", "いぜんにもましていそがしくなった。", "I've become even busier than before."],
    ["〜ないまでも", "", "nai made mo", "even if not ~, at least", "Grammar", "完璧でないまでも、最善は尽くした。", "かんぺきでないまでも、さいぜんはつくした。", "Even if not perfect, I did my very best."],
  ],

  // ---------------- Literary & written grammar ----------------
  "n1-grammar-literary": [
    ["〜べし", "", "beshi", "should / must (classical)", "Grammar", "学生は勉学に励むべし。", "がくせいはべんがくにはげむべし。", "Students should devote themselves to study."],
    ["〜べからず", "", "bekarazu", "must not (classical, on signs)", "Grammar", "ここに駐車するべからず。", "ここにちゅうしゃするべからず。", "Parking is forbidden here."],
    ["〜ごとし / ごとく", "", "gotoshi / gotoku", "like / as (classical)", "Grammar", "光陰矢のごとし。", "こういんやのごとし。", "Time flies like an arrow."],
    ["〜んばかり(に)", "", "n bakari ni", "almost / as if about to", "Grammar", "彼女は泣かんばかりの表情だった。", "かのじょはなかんばかりのひょうじょうだった。", "She had an almost-crying expression."],
    ["〜まじき", "", "majiki", "unbefitting / that should never be", "Grammar", "それは教師にあるまじき行為だ。", "それはきょうしにあるまじきこういだ。", "That is conduct unbecoming of a teacher."],
    ["〜ずして", "", "zu shite", "without ~ing (literary)", "Grammar", "努力せずして成功はあり得ない。", "どりょくせずしてせいこうはありえない。", "There can be no success without effort."],
    ["〜ずじまい", "", "zu jimai", "ended up not ~ing", "Grammar", "結局、彼に会えずじまいだった。", "けっきょく、かれにあえずじまいだった。", "In the end, I never got to meet him."],
    ["〜いわんや", "", "iwan ya", "let alone / much less", "Grammar", "大人でも難しい。いわんや子供をや。", "おとなでもむずかしい。いわんやこどもをや。", "It's hard even for adults, let alone children."],
    ["〜とて", "", "tote", "even / even though (literary)", "Grammar", "子供とて、罪は罪だ。", "こどもとて、つみはつみだ。", "Even for a child, a crime is a crime."],
    ["〜ものを", "", "mono o", "if only ~ / and yet (regret)", "Grammar", "言ってくれれば手伝ったものを。", "いってくれればてつだったものを。", "If only you'd told me, I would have helped."],
    ["〜ところを", "", "tokoro o", "at a time when (polite set phrase)", "Grammar", "お忙しいところを、ありがとうございます。", "おいそがしいところを、ありがとうございます。", "Thank you, even though you're busy."],
    ["〜とあれば", "", "to areba", "if it's for ~ / if that's the case", "Grammar", "子供のためとあれば、何でもする。", "こどものためとあれば、なんでもする。", "If it's for my child, I'll do anything."],
    ["〜きらいがある", "", "kirai ga aru", "have a (bad) tendency to", "Grammar", "彼は物事を悲観的に考えるきらいがある。", "かれはものごとをひかんてきにかんがえるきらいがある。", "He has a tendency to think about things pessimistically."],
    ["〜にあらず", "", "ni arazu", "is not (classical)", "Grammar", "これは夢にあらず、現実だ。", "これはゆめにあらず、げんじつだ。", "This is not a dream; it is reality."],
    ["〜んとする", "", "n to suru", "be about to (literary)", "Grammar", "日が暮れんとしている。", "ひがくれんとしている。", "The day is about to draw to a close."],
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
console.log("N1 grammar TOTAL entries:", total);

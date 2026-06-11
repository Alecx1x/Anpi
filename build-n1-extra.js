// Generates N1 "coming soon" study decks (Grammar Patterns, Keigo, Phrases)
// as vocab-schema JSON + .js fallbacks. Mirrors build-n2-extra.js.
// Run: node build-n1-extra.js
const fs = require("fs");
const path = require("path");
const DATA = path.join(__dirname, "data");

const E = (a) => ({
  word: a[0], reading: a[1] || "", romaji: a[2] || "", meaning: a[3] || "",
  partOfSpeech: a[4] || "", exampleSentence: a[5] || "", exampleReading: a[6] || "",
  exampleMeaning: a[7] || "", level: "N1",
});

const SETS = {
  // ---------------- Grammar Patterns ----------------
  "n1-grammar-all": [
    ["〜ざるを得ない", "〜ざるをえない", "zaru o enai", "have no choice but to", "Grammar", "事実を認めざるを得ない。", "じじつをみとめざるをえない。", "I have no choice but to admit the truth."],
    ["〜にあって", "", "ni atte", "in (a situation / time)", "Grammar", "困難な状況にあって冷静だった。", "こんなんなじょうきょうにあってれいせいだった。", "Even in a difficult situation, he stayed calm."],
    ["〜きらいがある", "", "kirai ga aru", "tends to (negative)", "Grammar", "彼は大げさに言うきらいがある。", "かれはおおげさにいうきらいがある。", "He tends to exaggerate."],
    ["〜にかたくない", "", "ni katakunai", "not hard to (imagine, etc.)", "Grammar", "彼の苦労は想像にかたくない。", "かれのくろうはそうぞうにかたくない。", "His hardship is not hard to imagine."],
    ["〜を余儀なくされる", "〜をよぎなくされる", "o yoginaku sareru", "be forced to", "Grammar", "悪天候で中止を余儀なくされた。", "あくてんこうでちゅうしをよぎなくされた。", "We were forced to cancel due to bad weather."],
    ["〜といえども", "", "to iedomo", "even though / although", "Grammar", "専門家といえども間違えることがある。", "せんもんかといえどもまちがえることがある。", "Even experts sometimes make mistakes."],
    ["〜にたえない", "", "ni taenai", "unbearable to / cannot bear", "Grammar", "その光景は見るにたえない。", "そのこうけいはみるにたえない。", "That scene is unbearable to watch."],
    ["〜まで(のこと)だ", "", "made (no koto) da", "will simply / nothing more than", "Grammar", "断られたら諦めるまでだ。", "ことわられたらあきらめるまでだ。", "If refused, I'll simply give up."],
    ["〜ともなしに", "", "to mo nashi ni", "without particularly (doing)", "Grammar", "見るともなしにテレビを見ていた。", "みるともなしにテレビをみていた。", "I was watching TV absentmindedly."],
  ],
  "n1-grammar-advanced": [
    ["〜が早いか", "〜がはやいか", "ga hayai ka", "as soon as / the moment", "Grammar", "席に着くが早いか食べ始めた。", "せきにつくがはやいかたべはじめた。", "The moment he sat down, he started eating."],
    ["〜や否や", "〜やいなや", "ya inaya", "no sooner ~ than", "Grammar", "彼を見るや否や逃げ出した。", "かれをみるやいなやにげだした。", "No sooner had I seen him than I fled."],
    ["〜ともなると", "", "to mo naru to", "when it comes to / once", "Grammar", "社長ともなると責任が重い。", "しゃちょうともなるとせきにんがおもい。", "When it comes to being president, the responsibility is heavy."],
    ["〜にひきかえ", "", "ni hikikae", "in contrast to", "Grammar", "兄にひきかえ弟は静かだ。", "あににひきかえおとうとはしずかだ。", "In contrast to the older brother, the younger is quiet."],
    ["〜であれ", "", "de are", "whether / no matter", "Grammar", "どんな理由であれ許されない。", "どんなりゆうであれゆるされない。", "No matter the reason, it's unforgivable."],
    ["〜にもまして", "", "ni mo mashite", "more than ever / even more", "Grammar", "以前にもまして努力している。", "いぜんにもましてどりょくしている。", "I'm working harder than ever before."],
    ["〜ゆえに", "", "yue ni", "because of / therefore", "Grammar", "若さゆえに失敗した。", "わかさゆえにしっぱいした。", "He failed because of his youth."],
    ["〜ものを", "", "mono o", "if only / and yet (regret)", "Grammar", "言ってくれればよかったものを。", "いってくれればよかったものを。", "If only you had told me..."],
    ["〜とあって", "", "to atte", "because of (a special situation)", "Grammar", "連休とあって道が混雑した。", "れんきゅうとあってみちがこんざつした。", "Because it was a long weekend, the roads were crowded."],
  ],
  "n1-grammar-literary": [
    ["〜べく", "", "beku", "in order to (literary)", "Grammar", "成功すべく努力を重ねた。", "せいこうすべくどりょくをかさねた。", "He kept striving in order to succeed."],
    ["〜んがため", "", "n ga tame", "for the purpose of (literary)", "Grammar", "生きんがために働く。", "いきんがためにはたらく。", "I work in order to live."],
    ["〜ことなしに", "", "koto nashi ni", "without doing", "Grammar", "努力することなしに成功はない。", "どりょくすることなしにせいこうはない。", "There is no success without effort."],
    ["〜をもって", "", "o motte", "by means of / with", "Grammar", "誠意をもって対応する。", "せいいをもってたいおうする。", "I respond with sincerity."],
    ["〜たる", "", "taru", "one who is (formal/literary)", "Grammar", "指導者たる者の責任は重い。", "しどうしゃたるもののせきにんはおもい。", "The responsibility of one who is a leader is heavy."],
    ["〜きっての", "", "kitte no", "the most ~ in (a group)", "Grammar", "この町きっての名医だ。", "このまちきってのめいいだ。", "He's the finest doctor in this town."],
    ["〜ならでは", "", "nara de wa", "unique to / only ~ can", "Grammar", "老舗ならではの味がある。", "しにせならではのあじがある。", "It has a flavor unique to a long-established shop."],
    ["〜の極み", "〜のきわみ", "no kiwami", "the height / extreme of", "Grammar", "感激の極みです。", "かんげきのきわみです。", "It's the height of delight."],
    ["〜にして", "", "ni shite", "being / even (and also)", "Grammar", "天才にして努力家だ。", "てんさいにしてどりょくかだ。", "He is a genius and also hardworking."],
  ],

  // ---------------- Keigo ----------------
  "n1-keigo-advanced": [
    ["〜させていただく", "", "sasete itadaku", "humbly do (with permission)", "Keigo", "ご説明させていただきます。", "ごせつめいさせていただきます。", "Allow me to explain."],
    ["〜申し上げます", "〜もうしあげます", "moushiagemasu", "I humbly (do)", "Keigo", "心よりお詫び申し上げます。", "こころよりおわびもうしあげます。", "I sincerely offer my apologies."],
    ["〜いただければ幸いです", "〜いただければさいわいです", "itadakereba saiwai desu", "I'd be grateful if you would", "Keigo", "ご返信いただければ幸いです。", "ごへんしんいただければさいわいです。", "I would be grateful for your reply."],
    ["〜くださいますよう", "", "kudasaimasu you", "please kindly (formal request)", "Keigo", "ご出席くださいますようお願いします。", "ごしゅっせきくださいますようおねがいします。", "We kindly request your attendance."],
    ["恐縮ですが", "きょうしゅくですが", "kyoushuku desu ga", "I'm much obliged, but / sorry but", "Keigo", "恐縮ですが、ご確認ください。", "きょうしゅくですが、ごかくにんください。", "I'm sorry to trouble you, but please confirm."],
    ["何卒", "なにとぞ", "nanitozo", "please (most formal)", "Keigo", "何卒よろしくお願い申し上げます。", "なにとぞよろしくおねがいもうしあげます。", "I humbly ask for your kind consideration."],
    ["〜のほど", "", "no hodo", "(softener for formal requests)", "Keigo", "ご了承のほどお願い申し上げます。", "ごりょうしょうのほどおねがいもうしあげます。", "I ask for your kind understanding."],
    ["拝啓・敬具", "はいけい・けいぐ", "haikei / keigu", "Dear ~ / Sincerely (letter)", "Keigo", "拝啓、時下ますますご清栄のことと存じます。", "はいけい、じかますますごせいえいのこととぞんじます。", "Dear Sir/Madam, I trust you are flourishing."],
  ],
  "n1-keigo-nuanced": [
    ["〜でいらっしゃる", "", "de irassharu", "to be (honorific, of status)", "Keigo", "社長でいらっしゃいますか。", "しゃちょうでいらっしゃいますか。", "Are you the president?"],
    ["賜る", "たまわる", "tamawaru", "to receive / be granted (humble)", "Keigo", "日頃よりご支援を賜っております。", "ひごろよりごしえんをたまわっております。", "We have long received your support."],
    ["〜てくださいまして", "", "te kudasaimashite", "for kindly doing", "Keigo", "お越しくださいましてありがとうございます。", "おこしくださいましてありがとうございます。", "Thank you for kindly coming."],
    ["ご足労", "ごそくろう", "go-sokurou", "taking the trouble to come", "Keigo", "ご足労いただき恐縮です。", "ごそくろういただききょうしゅくです。", "Thank you for taking the trouble to come."],
    ["〜の至り", "〜のいたり", "no itari", "the height of (formal feeling)", "Keigo", "光栄の至りに存じます。", "こうえいのいたりにぞんじます。", "I consider it the greatest honor."],
    ["〜に存じます", "〜にぞんじます", "ni zonjimasu", "I humbly think / feel", "Keigo", "ありがたく存じます。", "ありがたくぞんじます。", "I am humbly grateful."],
    ["ご査収", "ごさしゅう", "go-sashuu", "please find (and accept) enclosed", "Keigo", "ご査収のほどお願いいたします。", "ごさしゅうのほどおねがいいたします。", "Please find the enclosed (and accept it)."],
    ["平素より", "へいそより", "heiso yori", "always / habitually (formal)", "Keigo", "平素より大変お世話になっております。", "へいそよりたいへんおせわになっております。", "Thank you for your continued patronage."],
  ],

  // ---------------- Phrases & Expressions ----------------
  "n1-phrases-formal": [
    ["〜に他ならない", "〜にほかならない", "ni hokanaranai", "be nothing other than", "Expression", "これは怠慢に他ならない。", "これはたいまんにほかならない。", "This is nothing but negligence."],
    ["〜と言わざるを得ない", "〜といわざるをえない", "to iwazaru o enai", "one must say that ~", "Expression", "失敗と言わざるを得ない。", "しっぱいといわざるをえない。", "One must say it was a failure."],
    ["〜を踏まえて", "〜をふまえて", "o fumaete", "based on / taking into account", "Expression", "結果を踏まえて改善する。", "けっかをふまえてかいぜんする。", "We improve based on the results."],
    ["〜のもとで", "", "no moto de", "under (guidance / conditions)", "Expression", "教授の指導のもとで研究する。", "きょうじゅのしどうのもとでけんきゅうする。", "I conduct research under the professor's guidance."],
    ["〜を契機に", "〜をけいきに", "o keiki ni", "triggered by / prompted by", "Expression", "入院を契機に禁煙した。", "にゅういんをけいきにきんえんした。", "Prompted by hospitalization, I quit smoking."],
    ["〜に即して", "〜にそくして", "ni sokushite", "in line with / according to", "Expression", "現実に即して考えるべきだ。", "げんじつにそくしてかんがえるべきだ。", "We should think in line with reality."],
    ["いわゆる", "", "iwayuru", "so-called", "Expression", "いわゆる専門家の意見だ。", "いわゆるせんもんかのいけんだ。", "It's the opinion of a so-called expert."],
    ["〜の感がある", "〜のかんがある", "no kan ga aru", "there is a sense of", "Expression", "やや時代遅れの感がある。", "ややじだいおくれのかんがある。", "There's a slight sense of being outdated."],
  ],
  "n1-phrases-nuanced": [
    ["言うまでもなく", "いうまでもなく", "iu made mo naku", "needless to say", "Expression", "言うまでもなく健康が一番だ。", "いうまでもなくけんこうがいちばんだ。", "Needless to say, health is the most important."],
    ["〜と言っても過言ではない", "〜といってもかごんではない", "to itte mo kagon de wa nai", "it's no exaggeration to say", "Expression", "最高傑作と言っても過言ではない。", "さいこうけっさくといってもかごんではない。", "It's no exaggeration to call it a masterpiece."],
    ["〜とは言うものの", "〜とはいうものの", "to wa iu mono no", "having said that / that said", "Expression", "安い。とは言うものの、質は良い。", "やすい。とはいうものの、しつはよい。", "It's cheap. That said, the quality is good."],
    ["〜と相まって", "〜とあいまって", "to aimatte", "coupled with / combined with", "Expression", "努力と相まって成功した。", "どりょくとあいまってせいこうした。", "Coupled with effort, he succeeded."],
    ["〜ではあるまいか", "", "de wa arumai ka", "isn't it perhaps ~?", "Expression", "何かの誤解ではあるまいか。", "なにかのごかいではあるまいか。", "Isn't it perhaps some misunderstanding?"],
    ["〜にすぎない", "", "ni suginai", "merely / nothing more than", "Expression", "それは噂にすぎない。", "それはうわさにすぎない。", "That's merely a rumor."],
    ["〜ないとも限らない", "〜ないともかぎらない", "nai to mo kagiranai", "it's not impossible that", "Expression", "雨が降らないとも限らない。", "あめがふらないともかぎらない。", "It's not impossible that it'll rain."],
    ["〜きらいがある", "", "kirai ga aru", "has a tendency to (negative)", "Expression", "悲観的になるきらいがある。", "ひかんてきになるきらいがある。", "There's a tendency to become pessimistic."],
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

// Generates N2 "coming soon" study decks (Grammar Patterns, Keigo, Phrases)
// as vocab-schema JSON + .js fallbacks. Mirrors build-n3-extra.js.
// Run: node build-n2-extra.js
const fs = require("fs");
const path = require("path");
const DATA = path.join(__dirname, "data");

const E = (a) => ({
  word: a[0], reading: a[1] || "", romaji: a[2] || "", meaning: a[3] || "",
  partOfSpeech: a[4] || "", exampleSentence: a[5] || "", exampleReading: a[6] || "",
  exampleMeaning: a[7] || "", level: "N2",
});

const SETS = {
  // ---------------- Grammar Patterns ----------------
  "n2-grammar-all": [
    ["〜どころか", "", "dokoroka", "far from / let alone", "Grammar", "貯金どころか借金がある。", "ちょきんどころかしゃっきんがある。", "Far from having savings, I have debt."],
    ["〜ばかりか", "", "bakari ka", "not only ~ but also", "Grammar", "雨ばかりか風も強い。", "あめばかりかかぜもつよい。", "Not only rain, but the wind is strong too."],
    ["〜にもかかわらず", "", "ni mo kakawarazu", "despite / in spite of", "Grammar", "努力にもかかわらず失敗した。", "どりょくにもかかわらずしっぱいした。", "Despite the effort, it failed."],
    ["〜次第", "〜しだい", "shidai", "as soon as / depending on", "Grammar", "着き次第ご連絡します。", "つきしだいごれんらくします。", "I'll contact you as soon as I arrive."],
    ["〜をはじめ", "", "o hajime", "starting with / including", "Grammar", "社長をはじめ全員が出席した。", "しゃちょうをはじめぜんいんがしゅっせきした。", "Everyone, starting with the president, attended."],
    ["〜に基づいて", "〜にもとづいて", "ni motozuite", "based on", "Grammar", "データに基づいて判断する。", "データにもとづいてはんだんする。", "I judge based on the data."],
    ["〜あまり", "", "amari", "out of (too much) / so ~ that", "Grammar", "緊張のあまり声が出なかった。", "きんちょうのあまりこえがでなかった。", "I was so nervous my voice wouldn't come out."],
    ["〜うえに", "", "ue ni", "on top of / in addition", "Grammar", "安いうえに品質もいい。", "やすいうえにひんしつもいい。", "It's cheap, and on top of that, good quality."],
    ["〜反面", "〜はんめん", "hanmen", "on the other hand / while", "Grammar", "便利な反面、危険もある。", "べんりなはんめん、きけんもある。", "While convenient, there's also danger."],
  ],
  "n2-grammar-complex": [
    ["〜ば〜ほど", "", "ba ... hodo", "the more ~, the more ~", "Grammar", "練習すればするほど上手になる。", "れんしゅうすればするほどじょうずになる。", "The more you practice, the better you get."],
    ["〜わけにはいかない", "", "wake ni wa ikanai", "can't afford to (do)", "Grammar", "今は休むわけにはいかない。", "いまはやすむわけにはいかない。", "I can't afford to rest now."],
    ["〜ないわけにはいかない", "", "nai wake ni wa ikanai", "have no choice but to", "Grammar", "行かないわけにはいかない。", "いかないわけにはいかない。", "I have no choice but to go."],
    ["〜ことなく", "", "koto naku", "without (doing)", "Grammar", "休むことなく働き続けた。", "やすむことなくはたらきつづけた。", "I kept working without resting."],
    ["〜を通じて", "〜をつうじて", "o tsuujite", "through / throughout", "Grammar", "友人を通じて知り合った。", "ゆうじんをつうじてしりあった。", "We got to know each other through a friend."],
    ["〜に応じて", "〜におうじて", "ni oujite", "according to / in response to", "Grammar", "収入に応じて税金が変わる。", "しゅうにゅうにおうじてぜいきんがかわる。", "Taxes change according to income."],
    ["〜のみならず", "", "nomi narazu", "not only ~ (but also)", "Grammar", "国内のみならず海外でも有名だ。", "こくないのみならずかいがいでもゆうめいだ。", "It's famous not only domestically but abroad."],
    ["〜得る", "〜うる", "uru", "can / be possible to", "Grammar", "それは十分起こり得る。", "それはじゅうぶんおこりうる。", "That can definitely happen."],
    ["〜つつある", "", "tsutsu aru", "be in the process of ~ing", "Grammar", "状況は改善しつつある。", "じょうきょうはかいぜんしつつある。", "The situation is gradually improving."],
  ],
  "n2-grammar-formal": [
    ["〜において", "", "ni oite", "in / at (formal)", "Grammar", "会議は東京において行われる。", "かいぎはとうきょうにおいておこなわれる。", "The meeting is held in Tokyo."],
    ["〜に関して", "〜にかんして", "ni kanshite", "regarding / concerning", "Grammar", "この件に関して説明します。", "このけんにかんしてせつめいします。", "I'll explain regarding this matter."],
    ["〜による", "", "ni yoru", "due to / caused by", "Grammar", "地震による被害が大きい。", "じしんによるひがいがおおきい。", "The damage caused by the earthquake is great."],
    ["〜にあたって", "", "ni atatte", "on the occasion of", "Grammar", "開店にあたって挨拶をする。", "かいてんにあたってあいさつをする。", "I give a greeting on the occasion of opening."],
    ["〜をめぐって", "", "o megutte", "concerning / surrounding", "Grammar", "法案をめぐって議論が続く。", "ほうあんをめぐってぎろんがつづく。", "Debate continues concerning the bill."],
    ["〜にわたって", "", "ni watatte", "over / spanning / throughout", "Grammar", "三日間にわたって続いた。", "みっかかんにわたってつづいた。", "It continued over three days."],
    ["〜上で", "〜うえで", "ue de", "after / upon doing", "Grammar", "確認の上で返信します。", "かくにんのうえでへんしんします。", "I'll reply after confirming."],
    ["〜に先立って", "〜にさきだって", "ni sakidatte", "prior to / before", "Grammar", "開会に先立って黙祷した。", "かいかいにさきだってもくとうした。", "We observed a silence prior to the opening."],
    ["〜をもって", "", "o motte", "with / as of (formal)", "Grammar", "本日をもって閉店します。", "ほんじつをもってへいてんします。", "We close as of today."],
  ],

  // ---------------- Keigo ----------------
  "n2-keigo-sonkeigo": [
    ["いらっしゃる", "", "irassharu", "to be / come / go (respectful)", "Keigo (sonkeigo)", "部長はもうすぐいらっしゃいます。", "ぶちょうはもうすぐいらっしゃいます。", "The manager will be here soon."],
    ["おっしゃる", "", "ossharu", "to say (respectful)", "Keigo (sonkeigo)", "お名前は何とおっしゃいますか。", "おなまえはなんとおっしゃいますか。", "What is your name?"],
    ["召し上がる", "めしあがる", "meshiagaru", "to eat / drink (respectful)", "Keigo (sonkeigo)", "こちらをお召し上がりください。", "こちらをおめしあがりください。", "Please help yourself to this."],
    ["ご覧になる", "ごらんになる", "goran ni naru", "to see / look (respectful)", "Keigo (sonkeigo)", "資料をご覧になりましたか。", "しりょうをごらんになりましたか。", "Have you looked at the documents?"],
    ["なさる", "", "nasaru", "to do (respectful)", "Keigo (sonkeigo)", "どうなさいましたか。", "どうなさいましたか。", "What seems to be the matter?"],
    ["ご存じ", "ごぞんじ", "go-zonji", "to know (respectful)", "Keigo (sonkeigo)", "田中様をご存じですか。", "たなかさまをごぞんじですか。", "Do you know Mr. Tanaka?"],
    ["お見えになる", "おみえになる", "o-mie ni naru", "to come (respectful)", "Keigo (sonkeigo)", "お客様がお見えになりました。", "おきゃくさまがおみえになりました。", "The guest has arrived."],
    ["くださる", "", "kudasaru", "to give to me (respectful)", "Keigo (sonkeigo)", "先生がご指導くださった。", "せんせいがごしどうくださった。", "The teacher kindly guided me."],
  ],
  "n2-keigo-kenjougo": [
    ["申し上げる", "もうしあげる", "moushiageru", "to say / tell (humble)", "Keigo (kenjougo)", "お礼を申し上げます。", "おれいをもうしあげます。", "I would like to express my thanks."],
    ["いたす", "", "itasu", "to do (humble)", "Keigo (kenjougo)", "私がご案内いたします。", "わたしがごあんないいたします。", "I will show you the way."],
    ["伺う", "うかがう", "ukagau", "to visit / ask (humble)", "Keigo (kenjougo)", "明日お宅に伺います。", "あしたおたくにうかがいます。", "I'll visit your home tomorrow."],
    ["いただく", "", "itadaku", "to receive / eat (humble)", "Keigo (kenjougo)", "資料をいただきました。", "しりょうをいただきました。", "I have received the documents."],
    ["拝見する", "はいけんする", "haiken suru", "to see / read (humble)", "Keigo (kenjougo)", "お手紙を拝見しました。", "おてがみをはいけんしました。", "I have read your letter."],
    ["存じる", "ぞんじる", "zonjiru", "to know / think (humble)", "Keigo (kenjougo)", "その件は存じております。", "そのけんはぞんじております。", "I am aware of that matter."],
    ["参る", "まいる", "mairu", "to come / go (humble)", "Keigo (kenjougo)", "すぐに参ります。", "すぐにまいります。", "I'll come right away."],
    ["お〜する", "", "o ... suru", "humble verb pattern", "Keigo (kenjougo)", "お荷物をお持ちします。", "おにもつをおもちします。", "I'll carry your luggage."],
  ],

  // ---------------- Phrases & Expressions ----------------
  "n2-phrases-business": [
    ["お世話になっております", "おせわになっております", "o-sewa ni natte orimasu", "thank you for your business", "Expression", "いつもお世話になっております。", "いつもおせわになっております。", "Thank you for your continued business."],
    ["かしこまりました", "", "kashikomarimashita", "certainly / understood", "Expression", "かしこまりました。すぐに手配いたします。", "かしこまりました。すぐにてはいいたします。", "Certainly. I'll arrange it right away."],
    ["確認いたします", "かくにんいたします", "kakunin itashimasu", "I will confirm / check", "Expression", "在庫を確認いたします。", "ざいこをかくにんいたします。", "I'll check the stock."],
    ["折り返しご連絡します", "おりかえしごれんらくします", "orikaeshi go-renraku shimasu", "I'll call/get back to you", "Expression", "折り返しご連絡いたします。", "おりかえしごれんらくいたします。", "I'll get back to you shortly."],
    ["担当に代わります", "たんとうにかわります", "tantou ni kawarimasu", "I'll transfer you to the person in charge", "Expression", "担当の者に代わります。", "たんとうのものにかわります。", "I'll put you through to the person in charge."],
    ["お手数をおかけします", "おてすうをおかけします", "o-tesuu o okake shimasu", "sorry to trouble you", "Expression", "お手数をおかけしますが、よろしくお願いします。", "おてすうをおかけしますが、よろしくおねがいします。", "Sorry for the trouble, but thank you."],
    ["ご検討ください", "ごけんとうください", "go-kentou kudasai", "please consider it", "Expression", "ご検討のほどよろしくお願いします。", "ごけんとうのほどよろしくおねがいします。", "I'd appreciate your kind consideration."],
    ["お疲れ様でございます", "おつかれさまでございます", "otsukaresama de gozaimasu", "thank you for your work (formal)", "Expression", "お疲れ様でございます。", "おつかれさまでございます。", "Thank you for your hard work."],
  ],
  "n2-phrases-written": [
    ["〜と考えられる", "〜とかんがえられる", "to kangaerareru", "it is thought that", "Expression", "原因は人為的と考えられる。", "げんいんはじんいてきとかんがえられる。", "The cause is thought to be man-made."],
    ["〜と言える", "〜といえる", "to ieru", "it can be said that", "Expression", "これは成功と言えるだろう。", "これはせいこうといえるだろう。", "This can be said to be a success."],
    ["〜に過ぎない", "〜にすぎない", "ni suginai", "merely / nothing more than", "Expression", "それは言い訳に過ぎない。", "それはいいわけにすぎない。", "That's nothing but an excuse."],
    ["〜とは限らない", "〜とはかぎらない", "to wa kagiranai", "not necessarily", "Expression", "高いものがいいとは限らない。", "たかいものがいいとはかぎらない。", "Expensive things aren't necessarily good."],
    ["〜ざるを得ない", "〜ざるをえない", "zaru o enai", "have no choice but to", "Expression", "中止せざるを得ない。", "ちゅうしせざるをえない。", "We have no choice but to cancel."],
    ["〜と思われる", "〜とおもわれる", "to omowareru", "it seems / is thought", "Expression", "効果があると思われる。", "こうかがあるとおもわれる。", "It is thought to be effective."],
    ["一方で", "いっぽうで", "ippou de", "on the other hand", "Expression", "一方で、課題も残っている。", "いっぽうで、かだいものこっている。", "On the other hand, issues still remain."],
    ["〜に他ならない", "〜にほかならない", "ni hokanaranai", "be nothing but / precisely", "Expression", "これは努力の結果に他ならない。", "これはどりょくのけっかにほかならない。", "This is nothing but the result of effort."],
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

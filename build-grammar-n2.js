// Populates the N2 grammar study decks with full, accurate content.
// vocab-schema JSON + .js fallback for file://. Run: node build-grammar-n2.js
const fs = require("fs");
const path = require("path");
const DATA = path.join(__dirname, "data");

const E = (a) => ({
  word: a[0], reading: a[1] || "", romaji: a[2] || "", meaning: a[3] || "",
  partOfSpeech: a[4] || "Grammar", exampleSentence: a[5] || "", exampleReading: a[6] || "",
  exampleMeaning: a[7] || "", level: "N2",
});

const SETS = {
  // ---------------- All N2 Grammar (broad core set) ----------------
  "n2-grammar-all": [
    ["〜にとって", "", "ni totte", "for / to (from the standpoint of)", "Grammar", "私にとって家族が一番大切だ。", "わたしにとってかぞくがいちばんたいせつだ。", "For me, family is the most important thing."],
    ["〜に対して", "", "ni taishite", "toward / in contrast to", "Grammar", "子供に対しては優しく接する。", "こどもにたいしてはやさしくせっする。", "I treat children kindly."],
    ["〜に関して", "", "ni kanshite", "regarding / concerning", "Grammar", "その件に関して説明いたします。", "そのけんにかんしてせつめいいたします。", "I will explain regarding that matter."],
    ["〜において", "", "ni oite", "in / at / on (formal setting)", "Grammar", "会議は東京において行われる。", "かいぎはとうきょうにおいておこなわれる。", "The meeting will be held in Tokyo."],
    ["〜をめぐって", "", "o megutte", "concerning / over (a dispute)", "Grammar", "遺産をめぐって兄弟が争っている。", "いさんをめぐってきょうだいがあらそっている。", "The siblings are fighting over the inheritance."],
    ["〜をはじめ", "", "o hajime", "starting with / including", "Grammar", "社長をはじめ、全員が出席した。", "しゃちょうをはじめ、ぜんいんがしゅっせきした。", "Everyone, starting with the president, attended."],
    ["〜に基づいて", "", "ni motozuite", "based on", "Grammar", "事実に基づいて報道する。", "じじつにもとづいてほうどうする。", "They report based on the facts."],
    ["〜に応じて", "", "ni oujite", "according to / in response to", "Grammar", "収入に応じて税金を払う。", "しゅうにゅうにおうじてぜいきんをはらう。", "You pay taxes according to your income."],
    ["〜ことから", "", "koto kara", "from the fact that / because", "Grammar", "桜が多いことから、この町は桜町と呼ばれる。", "さくらがおおいことから、このまちはさくらまちとよばれる。", "Because there are many cherry trees, this town is called Sakuramachi."],
    ["〜ことだから", "", "koto dakara", "since it's ~ (knowing them)", "Grammar", "彼のことだから、また遅れるだろう。", "かれのことだから、またおくれるだろう。", "Knowing him, he'll probably be late again."],
    ["〜際に", "", "sai ni", "on the occasion of / when", "Grammar", "入国の際にパスポートを見せる。", "にゅうこくのさいにパスポートをみせる。", "You show your passport when entering the country."],
    ["〜上で", "", "ue de", "after / upon (doing first)", "Grammar", "よく考えた上で決めます。", "よくかんがえたうえできめます。", "I'll decide after thinking it over carefully."],
    ["〜次第", "", "shidai", "as soon as", "Grammar", "到着し次第、連絡します。", "とうちゃくししだい、れんらくします。", "I'll contact you as soon as I arrive."],
    ["〜末に", "", "sue ni", "after much ~ / in the end", "Grammar", "長い議論の末に結論が出た。", "ながいぎろんのすえにけつろんがでた。", "After a long discussion, a conclusion was reached."],
    ["〜反面", "", "hanmen", "on the other hand / while", "Grammar", "この仕事は大変な反面、やりがいがある。", "このしごとはたいへんなはんめん、やりがいがある。", "This job is tough, but on the other hand it's rewarding."],
    ["〜どころか", "", "dokoroka", "far from / let alone", "Grammar", "貯金どころか、借金がある。", "ちょきんどころか、しゃっきんがある。", "Far from having savings, I'm in debt."],
    ["〜ばかりか", "", "bakari ka", "not only ~ but also", "Grammar", "彼は英語ばかりか中国語も話せる。", "かれはえいごばかりかちゅうごくごもはなせる。", "He can speak not only English but Chinese too."],
    ["〜だけでなく", "", "dake de naku", "not only ~ (but also)", "Grammar", "値段だけでなく品質も大事だ。", "ねだんだけでなくひんしつもだいじだ。", "Not only the price but the quality is important too."],
    ["〜のみならず", "", "nomi narazu", "not only ~ (formal)", "Grammar", "国内のみならず海外でも有名だ。", "こくないのみならずかいがいでもゆうめいだ。", "It's famous not only domestically but abroad as well."],
    ["〜わけにはいかない", "", "wake ni wa ikanai", "can't afford to / mustn't", "Grammar", "明日は試験だから、遊ぶわけにはいかない。", "あしたはしけんだから、あそぶわけにはいかない。", "I have an exam tomorrow, so I can't just go play."],
    ["〜ないことはない", "", "nai koto wa nai", "it's not that ~ can't / possible", "Grammar", "頑張れば、できないことはない。", "がんばれば、できないことはない。", "If you try hard, it's not impossible."],
    ["〜に限らず", "", "ni kagirazu", "not limited to / not just", "Grammar", "若者に限らず、お年寄りも使う。", "わかものにかぎらず、おとしよりもつかう。", "Not just young people — the elderly use it too."],
    ["〜に加えて", "", "ni kuwaete", "in addition to", "Grammar", "雨に加えて風も強くなった。", "あめにくわえてかぜもつよくなった。", "In addition to the rain, the wind grew strong too."],
    ["〜から見ると", "", "kara miru to", "from the viewpoint of", "Grammar", "外国人から見ると、日本は安全だ。", "がいこくじんからみると、にほんはあんぜんだ。", "From a foreigner's viewpoint, Japan is safe."],
    ["〜たとたん", "", "ta totan", "the moment that / just as", "Grammar", "立ち上がったとたん、めまいがした。", "たちあがったとたん、めまいがした。", "The moment I stood up, I felt dizzy."],
    ["〜あまり", "", "amari", "out of too much / so ~ that", "Grammar", "緊張のあまり、声が震えた。", "きんちょうのあまり、こえがふるえた。", "Out of sheer nervousness, my voice trembled."],
  ],

  // ---------------- Complex structures (conditions & concession) ----------------
  "n2-grammar-complex": [
    ["〜からこそ", "", "kara koso", "precisely because", "Grammar", "君のことを思うからこそ、厳しく言う。", "きみのことをおもうからこそ、きびしくいう。", "It's precisely because I care about you that I'm strict."],
    ["〜ばこそ", "", "ba koso", "only because (emphatic)", "Grammar", "努力すればこそ成功できる。", "どりょくすればこそせいこうできる。", "It is only through effort that one can succeed."],
    ["〜てこそ", "", "te koso", "only after / only by doing", "Grammar", "失敗を経験してこそ成長する。", "しっぱいをけいけんしてこそせいちょうする。", "Only by experiencing failure does one grow."],
    ["〜ないことには", "", "nai koto ni wa", "unless (you do ~, ... won't)", "Grammar", "実物を見ないことには判断できない。", "じつぶつをみないことにははんだんできない。", "I can't judge unless I see the real thing."],
    ["〜ない限り", "", "nai kagiri", "as long as ~ not / unless", "Grammar", "謝らない限り許さない。", "あやまらないかぎりゆるさない。", "I won't forgive you unless you apologize."],
    ["〜からには", "", "kara ni wa", "now that / since (with resolve)", "Grammar", "引き受けたからには最後までやる。", "ひきうけたからにはさいごまでやる。", "Now that I've taken it on, I'll see it through."],
    ["〜以上は", "", "ijou wa", "since / now that (therefore)", "Grammar", "約束した以上は守るべきだ。", "やくそくしたいじょうはまもるべきだ。", "Since you've promised, you ought to keep it."],
    ["〜も〜ば〜も", "", "mo ~ba ~mo", "both ~ and / not only ~ but", "Grammar", "彼は頭もよければ性格もいい。", "かれはあたまもよければせいかくもいい。", "He's both smart and good-natured."],
    ["〜ことなく", "", "koto naku", "without ~ing (formal)", "Grammar", "彼は一度も休むことなく働いた。", "かれはいちどもやすむことなくはたらいた。", "He worked without resting even once."],
    ["〜抜きで", "", "nuki de", "without / leaving out", "Grammar", "冗談抜きで、本気で言っている。", "じょうだんぬきで、ほんきでいっている。", "Joking aside, I'm being serious."],
    ["〜つつ", "", "tsutsu", "while / even though (formal)", "Grammar", "悪いと知りつつ、嘘をついた。", "わるいとしりつつ、うそをついた。", "Even while knowing it was wrong, I told a lie."],
    ["〜つつある", "", "tsutsu aru", "be in the process of ~ing", "Grammar", "景気は回復しつつある。", "けいきはかいふくしつつある。", "The economy is in the process of recovering."],
    ["〜ものなら", "", "mono nara", "if (you) could / if (you) dare", "Grammar", "できるものなら、やってみろ。", "できるものなら、やってみろ。", "If you can do it, then go ahead and try."],
    ["〜とはいえ", "", "to wa ie", "although / that said", "Grammar", "春とはいえ、まだ寒い。", "はるとはいえ、まださむい。", "Although it's spring, it's still cold."],
    ["〜にしろ〜にしろ", "", "ni shiro ~ni shiro", "whether ~ or ~", "Grammar", "行くにしろ行かないにしろ、連絡してください。", "いくにしろいかないにしろ、れんらくしてください。", "Whether you go or not, please let me know."],
  ],

  // ---------------- Formal & written expressions ----------------
  "n2-grammar-formal": [
    ["〜ざるを得ない", "", "zaru o enai", "cannot help but / be forced to", "Grammar", "上司の命令だから、従わざるを得ない。", "じょうしのめいれいだから、したがわざるをえない。", "It's the boss's order, so I have no choice but to obey."],
    ["〜ずにはいられない", "", "zu ni wa irarenai", "can't help but ~", "Grammar", "その映画を見ると泣かずにはいられない。", "そのえいがをみるとなかずにはいられない。", "I can't help crying when I watch that movie."],
    ["〜得る / 得ない", "", "uru / enai", "can possibly / cannot possibly", "Grammar", "それも十分あり得る話だ。", "それもじゅうぶんありえるはなしだ。", "That's an entirely possible scenario."],
    ["〜にすぎない", "", "ni suginai", "no more than / merely", "Grammar", "それは言い訳にすぎない。", "それはいいわけにすぎない。", "That's nothing more than an excuse."],
    ["〜にほかならない", "", "ni hoka naranai", "is nothing other than", "Grammar", "成功は努力の結果にほかならない。", "せいこうはどりょくのけっかにほかならない。", "Success is nothing other than the result of effort."],
    ["〜とは限らない", "", "to wa kagiranai", "not necessarily", "Grammar", "高いものがいいとは限らない。", "たかいものがいいとはかぎらない。", "Expensive things aren't necessarily good."],
    ["〜わけではない", "", "wake de wa nai", "it doesn't mean that ~", "Grammar", "嫌いなわけではないが、好きでもない。", "きらいなわけではないが、すきでもない。", "It's not that I dislike it, but I don't like it either."],
    ["〜というものだ", "", "to iu mono da", "that's what ~ is / is simply", "Grammar", "それは無理というものだ。", "それはむりというものだ。", "That's simply asking too much."],
    ["〜であろう", "", "de arou", "probably / surely (written)", "Grammar", "未来はもっと便利になるであろう。", "みらいはもっとべんりになるであろう。", "The future will surely become more convenient."],
    ["〜ねばならない", "", "neba naranai", "must (formal / literary)", "Grammar", "我々は努力せねばならない。", "われわれはどりょくせねばならない。", "We must make an effort."],
    ["〜べく", "", "beku", "in order to (formal)", "Grammar", "真実を知るべく調査を続けた。", "しんじつをしるべくちょうさをつづけた。", "He continued the investigation in order to learn the truth."],
    ["〜とともに", "", "to tomo ni", "along with / as", "Grammar", "経済の発展とともに、生活が豊かになった。", "けいざいのはってんとともに、せいかつがゆたかになった。", "Along with economic development, life became richer."],
    ["〜をもって", "", "o motte", "as of / by means of (formal)", "Grammar", "本日をもって閉店いたします。", "ほんじつをもってへいてんいたします。", "We will be closing as of today."],
    ["〜に際して", "", "ni saishite", "on the occasion of (formal)", "Grammar", "卒業に際して、一言申し上げます。", "そつぎょうにさいして、ひとこともうしあげます。", "On the occasion of graduation, I'd like to say a few words."],
    ["〜かのようだ", "", "ka no you da", "as if / as though", "Grammar", "彼はまるで何も知らないかのように振る舞った。", "かれはまるでなにもしらないかのようにふるまった。", "He behaved as if he knew nothing."],
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
console.log("N2 grammar TOTAL entries:", total);

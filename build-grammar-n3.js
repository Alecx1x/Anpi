// Populates the N3 grammar study decks with full, accurate content.
// vocab-schema JSON + .js fallback for file://. Run: node build-grammar-n3.js
const fs = require("fs");
const path = require("path");
const DATA = path.join(__dirname, "data");

const E = (a) => ({
  word: a[0], reading: a[1] || "", romaji: a[2] || "", meaning: a[3] || "",
  partOfSpeech: a[4] || "Grammar", exampleSentence: a[5] || "", exampleReading: a[6] || "",
  exampleMeaning: a[7] || "", level: "N3",
});

const SETS = {
  // ---------------- All N3 Grammar (broad core set) ----------------
  "n3-grammar-all": [
    ["〜ように", "", "you ni", "so that / in order to (with non-volitional verbs)", "Grammar", "忘れないようにメモする。", "わすれないようにメモする。", "I take notes so that I won't forget."],
    ["〜ようになる", "", "you ni naru", "come to / reach the point where", "Grammar", "日本語が話せるようになった。", "にほんごがはなせるようになった。", "I've become able to speak Japanese."],
    ["〜ようにする", "", "you ni suru", "make an effort to / try to", "Grammar", "毎日運動するようにしている。", "まいにちうんどうするようにしている。", "I make a point of exercising every day."],
    ["〜ことにする", "", "koto ni suru", "decide to (one's own choice)", "Grammar", "タバコをやめることにした。", "タバコをやめることにした。", "I've decided to quit smoking."],
    ["〜ことになる", "", "koto ni naru", "it's been decided / it turns out that", "Grammar", "来月、大阪に転勤することになった。", "らいげつ、おおさかにてんきんすることになった。", "It's been decided that I'll transfer to Osaka next month."],
    ["〜ところだ", "", "tokoro da", "about to / just doing", "Grammar", "今から出かけるところだ。", "いまからでかけるところだ。", "I'm just about to head out."],
    ["〜たところ", "", "ta tokoro", "have just done", "Grammar", "今、駅に着いたところだ。", "いま、えきについたところだ。", "I've just arrived at the station."],
    ["〜たばかり", "", "ta bakari", "just did / only just", "Grammar", "さっき昼ご飯を食べたばかりだ。", "さっきひるごはんをたべたばかりだ。", "I just ate lunch a moment ago."],
    ["〜わけだ", "", "wake da", "no wonder / that's why", "Grammar", "雪が降っている。道理で寒いわけだ。", "ゆきがふっている。どうりでさむいわけだ。", "It's snowing — no wonder it's cold."],
    ["〜わけがない", "", "wake ga nai", "there's no way that ~", "Grammar", "彼が嘘をつくわけがない。", "かれがうそをつくわけがない。", "There's no way he would lie."],
    ["〜はずがない", "", "hazu ga nai", "couldn't possibly be", "Grammar", "そんなことがあるはずがない。", "そんなことがあるはずがない。", "There's no way that could happen."],
    ["〜に違いない", "", "ni chigai nai", "must be / no doubt", "Grammar", "あの様子では、彼が犯人に違いない。", "あのようすでは、かれがはんにんにちがいない。", "Judging by that, he must be the culprit."],
    ["〜べきだ", "", "beki da", "should / ought to", "Grammar", "約束は守るべきだ。", "やくそくはまもるべきだ。", "You should keep your promises."],
    ["〜そうだ (伝聞)", "", "sou da", "I hear that / they say", "Grammar", "天気予報によると明日は晴れるそうだ。", "てんきよほうによるとあしたははれるそうだ。", "According to the forecast, it'll be sunny tomorrow."],
    ["〜ようだ", "", "you da", "it seems / appears that", "Grammar", "誰か来たようだ。", "だれかきたようだ。", "It seems someone has come."],
    ["〜について", "", "ni tsuite", "about / concerning", "Grammar", "日本の文化について研究している。", "にほんのぶんかについてけんきゅうしている。", "I'm doing research about Japanese culture."],
    ["〜によって", "", "ni yotte", "depending on / by means of / due to", "Grammar", "国によって習慣が違う。", "くにによってしゅうかんがちがう。", "Customs differ depending on the country."],
    ["〜として", "", "to shite", "as / in the capacity of", "Grammar", "留学生として日本に来た。", "りゅうがくせいとしてにほんにきた。", "I came to Japan as an exchange student."],
    ["〜のに (目的)", "", "no ni", "in order to (purpose, with cost/time)", "Grammar", "この料理を作るのに二時間かかった。", "このりょうりをつくるのににじかんかかった。", "It took two hours to make this dish."],
    ["〜たがる", "", "tagaru", "(someone else) shows signs of wanting to", "Grammar", "子供は外で遊びたがる。", "こどもはそとであそびたがる。", "Children want to play outside."],
    ["〜うちに", "", "uchi ni", "while / before (a state changes)", "Grammar", "熱いうちに食べてください。", "あついうちにたべてください。", "Please eat it while it's hot."],
    ["〜さえ〜ば", "", "sae ~ba", "if only / as long as", "Grammar", "お金さえあれば買えるのに。", "おかねさえあればかえるのに。", "If only I had the money, I could buy it."],
    ["〜ほど", "", "hodo", "to the extent that / so ~ that", "Grammar", "死ぬほど疲れた。", "しぬほどつかれた。", "I'm dead tired."],
    ["〜くらい / ぐらい", "", "kurai / gurai", "to the extent of / about", "Grammar", "泣きたいくらい悔しかった。", "なきたいくらいくやしかった。", "I was so frustrated I could have cried."],
    ["〜まま", "", "mama", "as is / leaving (a state) unchanged", "Grammar", "電気をつけたまま寝てしまった。", "でんきをつけたままねてしまった。", "I fell asleep with the lights left on."],
    ["〜たらいい / といい", "", "tara ii / to ii", "it would be good if / I hope", "Grammar", "早く夏休みになるといい。", "はやくなつやすみになるといい。", "I hope summer vacation comes soon."],
  ],

  // ---------------- Compound sentences & connectives ----------------
  "n3-grammar-compound": [
    ["〜から", "", "kara", "because (subjective reason)", "Grammar", "雨だから、今日は出かけない。", "あめだから、きょうはでかけない。", "Because it's raining, I won't go out today."],
    ["〜ので", "", "node", "because (polite, objective)", "Grammar", "道が混んでいたので、遅れた。", "みちがこんでいたので、おくれた。", "I was late because the roads were crowded."],
    ["〜のに", "", "noni", "although / even though", "Grammar", "一生懸命勉強したのに、試験に落ちた。", "いっしょうけんめいべんきょうしたのに、しけんにおちた。", "Even though I studied hard, I failed the exam."],
    ["〜けれど(も)", "", "keredo(mo)", "but / although", "Grammar", "高いけれど、買う価値がある。", "たかいけれど、かうかちがある。", "It's expensive, but it's worth buying."],
    ["〜が", "", "ga", "but / and (soft connective)", "Grammar", "すみませんが、道を教えてください。", "すみませんが、みちをおしえてください。", "Excuse me, but could you tell me the way?"],
    ["〜し", "", "shi", "and what's more (adding reasons)", "Grammar", "彼は親切だし、頭もいい。", "かれはしんせつだし、あたまもいい。", "He's kind, and smart too."],
    ["〜て (順序)", "", "te", "and / and then (sequence)", "Grammar", "朝起きて、顔を洗って、朝ご飯を食べる。", "あさおきて、かおをあらって、あさごはんをたべる。", "I get up, wash my face, and eat breakfast."],
    ["それで", "", "sorede", "and so / that's why", "Grammar", "寝坊した。それで遅刻した。", "ねぼうした。それでちこくした。", "I overslept, and so I was late."],
    ["そこで", "", "sokode", "so / and so (took action)", "Grammar", "お腹が空いた。そこで、店に入った。", "おなかがすいた。そこで、みせにはいった。", "I was hungry, so I went into a shop."],
    ["すると", "", "suruto", "thereupon / and then", "Grammar", "ボタンを押した。すると、ドアが開いた。", "ボタンをおした。すると、ドアがあいた。", "I pressed the button, and then the door opened."],
    ["ところが", "", "tokoroga", "however / but (unexpectedly)", "Grammar", "晴れると思った。ところが、雨が降った。", "はれるとおもった。ところが、あめがふった。", "I thought it would be sunny. However, it rained."],
    ["それなのに", "", "sorenanoni", "and yet / in spite of that", "Grammar", "彼は約束した。それなのに、来なかった。", "かれはやくそくした。それなのに、こなかった。", "He promised. And yet, he didn't come."],
    ["つまり", "", "tsumari", "in other words / in short", "Grammar", "父の姉、つまり私の伯母です。", "ちちのあね、つまりわたしのおばです。", "My father's older sister — in other words, my aunt."],
    ["それに", "", "soreni", "moreover / besides", "Grammar", "この部屋は広い。それに、明るい。", "このへやはひろい。それに、あかるい。", "This room is spacious. Besides, it's bright."],
    ["〜うえに", "", "ue ni", "on top of / in addition to", "Grammar", "彼は優秀なうえに、努力家だ。", "かれはゆうしゅうなうえに、どりょくかだ。", "He's excellent, and on top of that, hardworking."],
    ["だから", "", "dakara", "so / therefore (casual)", "Grammar", "明日は試験だ。だから、今日は勉強する。", "あしたはしけんだ。だから、きょうはべんきょうする。", "I have an exam tomorrow, so I'll study today."],
  ],

  // ---------------- Expressing nuance & modality ----------------
  "n3-grammar-nuance": [
    ["〜らしい", "", "rashii", "typical of / like a proper ~", "Grammar", "今日は春らしい暖かさだ。", "きょうははるらしいあたたかさだ。", "Today has a warmth that's typical of spring."],
    ["〜っぽい", "", "ppoi", "-ish / tends to be", "Grammar", "彼は忘れっぽい性格だ。", "かれはわすれっぽいせいかくだ。", "He has a forgetful personality."],
    ["〜がち", "", "gachi", "tend to / be prone to", "Grammar", "冬は風邪をひきがちだ。", "ふゆはかぜをひきがちだ。", "In winter I tend to catch colds."],
    ["〜気味 (ぎみ)", "", "gimi", "a touch of / slightly", "Grammar", "最近、疲れ気味だ。", "さいきん、つかれぎみだ。", "Lately I've been feeling a bit tired."],
    ["〜ようだ (推量)", "", "you da", "it appears / looks like (inference)", "Grammar", "外は雨が降っているようだ。", "そとはあめがふっているようだ。", "It appears to be raining outside."],
    ["〜とか", "", "toka", "~ and such / I heard that ~", "Grammar", "彼、来月結婚するとか。", "かれ、らいげつけっこんするとか。", "I hear he's getting married next month or something."],
    ["〜ものだ", "", "mono da", "used to / that's how it is (generalization)", "Grammar", "子供のころ、よく川で泳いだものだ。", "こどものころ、よくかわでおよいだものだ。", "As a child, I often used to swim in the river."],
    ["〜ことだ", "", "koto da", "the best thing is to / you should", "Grammar", "上手になりたいなら、毎日練習することだ。", "じょうずになりたいなら、まいにちれんしゅうすることだ。", "If you want to get good, you should practice every day."],
    ["〜というより", "", "to iu yori", "rather than / more like", "Grammar", "彼は厳しいというより冷たい。", "かれはきびしいというよりつめたい。", "He's not so much strict as cold."],
    ["どちらかというと", "", "dochiraka to iu to", "if anything / rather", "Grammar", "どちらかというと夏より冬が好きだ。", "どちらかというとなつよりふゆがすきだ。", "If anything, I prefer winter to summer."],
    ["〜に決まっている", "", "ni kimatte iru", "definitely / I'm sure that ~", "Grammar", "そんな話は嘘に決まっている。", "そんなはなしはうそにきまっている。", "A story like that is definitely a lie."],
    ["〜恐れがある", "", "osore ga aru", "there's a risk / fear that", "Grammar", "台風が上陸する恐れがある。", "たいふうがじょうりくするおそれがある。", "There's a risk the typhoon will make landfall."],
    ["〜ふりをする", "", "furi o suru", "pretend to", "Grammar", "彼は知らないふりをした。", "かれはしらないふりをした。", "He pretended not to know."],
    ["〜くせに", "", "kuse ni", "even though (with reproach)", "Grammar", "知っているくせに教えてくれない。", "しっているくせにおしえてくれない。", "Even though he knows, he won't tell me."],
    ["〜だらけ", "", "darake", "full of / covered in (negative)", "Grammar", "子供は泥だらけになって遊んでいる。", "こどもはどろだらけになってあそんでいる。", "The kids are playing, covered in mud."],
    ["〜っぱなし", "", "ppanashi", "leave ~ (undone) / keep ~ing", "Grammar", "水を出しっぱなしにしないで。", "みずをだしっぱなしにしないで。", "Don't leave the water running."],
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
console.log("N3 grammar TOTAL entries:", total);

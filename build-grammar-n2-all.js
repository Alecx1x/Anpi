// Comprehensive "All N2 Grammar" master deck — the full standardized JLPT N2
// grammar list. Overwrites n2-grammar-all.json (themed N2 decks untouched).
// Run: node build-grammar-n2-all.js
const fs = require("fs");
const path = require("path");
const DATA = path.join(__dirname, "data");
const E = (a) => ({
  word: a[0], reading: a[1] || "", romaji: a[2] || "", meaning: a[3] || "",
  partOfSpeech: "Grammar", exampleSentence: a[4] || "", exampleReading: a[5] || "",
  exampleMeaning: a[6] || "", level: "N2",
});
const rows = [
  // ---- standpoint & reference ----
  ["〜にとって","","ni totte","for / to (from the standpoint of)","私にとって家族が一番大切だ。","わたしにとってかぞくがいちばんたいせつだ。","For me, family is most important."],
  ["〜に対して","〜にたいして","ni taishite","toward / in contrast to","親に対して反抗する。","おやにたいしてはんこうする。","He rebels against his parents."],
  ["〜に関して","〜にかんして","ni kanshite","regarding / concerning","その件に関して説明する。","そのけんにかんしてせつめいする。","I'll explain regarding that matter."],
  ["〜において","","ni oite","in / at / on (formal)","会議は東京において行われる。","かいぎはとうきょうにおいておこなわれる。","The meeting is held in Tokyo."],
  ["〜をめぐって","","o megutte","concerning / over (a dispute)","遺産をめぐって争う。","いさんをめぐってあらそう。","They fight over the inheritance."],
  ["〜をはじめ","","o hajime","starting with / including","社長をはじめ全員が出席した。","しゃちょうをはじめぜんいんがしゅっせきした。","Everyone, starting with the president, attended."],
  ["〜に基づいて","〜にもとづいて","ni motozuite","based on","事実に基づいて報道する。","じじつにもとづいてほうどうする。","They report based on facts."],
  ["〜に応じて","〜におうじて","ni oujite","according to / in response to","収入に応じて税を払う。","しゅうにゅうにおうじてぜいをはらう。","You pay tax according to income."],
  ["〜に沿って","〜にそって","ni sotte","along / in line with","川に沿って歩く。","かわにそってあるく。","I walk along the river."],
  ["〜のもとで","","no moto de","under (the guidance of)","先生の指導のもとで研究する。","せんせいのしどうのもとでけんきゅうする。","I research under my teacher's guidance."],
  ["〜を中心に","〜をちゅうしんに","o chuushin ni","centered on / mainly","若者を中心に流行している。","わかものをちゅうしんにりゅうこうしている。","It's popular mainly among young people."],
  ["〜からすると","","kara suru to","judging from / from the view of","この成績からすると合格だ。","このせいせきからするとごうかくだ。","Judging from these grades, it's a pass."],
  // ---- time & occasion ----
  ["〜に際して","〜にさいして","ni saishite","on the occasion of","入学に際して挨拶する。","にゅうがくにさいしてあいさつする。","I give a speech on the occasion of enrollment."],
  ["〜に当たって","〜にあたって","ni atatte","upon / at the time of (an event)","開会に当たって一言述べる。","かいかいにあたってひとことのべる。","I say a few words upon the opening."],
  ["〜上で","〜うえで","ue de","after / upon (doing first)","よく考えた上で決める。","よくかんがえたうえできめる。","I'll decide after thinking it over."],
  ["〜次第","〜しだい","shidai","as soon as","到着し次第連絡する。","とうちゃくししだいれんらくする。","I'll contact you as soon as I arrive."],
  ["〜か〜ないかのうちに","","ka ~nai ka no uchi ni","no sooner ~ than","ベルが鳴るか鳴らないかのうちに飛び出した。","ベルがなるかならないかのうちにとびだした。","No sooner had the bell rung than he dashed out."],
  ["〜てはじめて","","te hajimete","only after / not until","失って初めて大切さが分かる。","うしなってはじめてたいせつさがわかる。","Only after losing it do you realize its value."],
  ["〜最中に","〜さいちゅうに","saichuu ni","right in the middle of","食事の最中に電話が鳴った。","しょくじのさいちゅうにでんわがなった。","The phone rang right in the middle of the meal."],
  ["〜あげく","","ageku","after much ~ (bad result)","迷ったあげく、買わなかった。","まよったあげく、かわなかった。","After agonizing, I didn't buy it after all."],
  ["〜末に","〜すえに","sue ni","after much ~ / in the end","議論の末に結論が出た。","ぎろんのすえにけつろんがでた。","After much debate, a conclusion was reached."],
  ["〜以来","〜いらい","irai","since / ever since","卒業以来、会っていない。","そつぎょういらい、あっていない。","I haven't seen them since graduation."],
  ["〜とともに","","to tomo ni","together with / as","成長とともに考え方が変わった。","せいちょうとともにかんがえかたがかわった。","My way of thinking changed as I grew."],
  // ---- cause & grounds ----
  ["〜ことから","","koto kara","from the fact that / because","煙が出ていることから火事に気づいた。","けむりがでていることからかじにきづいた。","I noticed the fire from the smoke."],
  ["〜ことだから","","koto dakara","since it's ~ (knowing them)","彼のことだから、また遅れるだろう。","かれのことだから、またおくれるだろう。","Knowing him, he'll be late again."],
  ["〜あまり","","amari","out of too much ~","緊張のあまり声が震えた。","きんちょうのあまりこえがふるえた。","My voice trembled out of nervousness."],
  ["〜ばかりに","","bakari ni","simply because (unfortunate)","油断したばかりに負けた。","ゆだんしたばかりにまけた。","I lost simply because I let my guard down."],
  ["〜ものだから","","mono dakara","because / the reason is","道が混んでいたものだから遅れた。","みちがこんでいたものだからおくれた。","I was late because the roads were crowded."],
  ["〜だけに","","dake ni","precisely because / being","プロだけに技術が高い。","プロだけにぎじゅつがたかい。","Being a pro, his skill is high."],
  ["〜だけあって","","dake atte","as expected of / fitting that","人気店だけあっておいしい。","にんきてんだけあっておいしい。","As you'd expect of a popular shop, it's tasty."],
  // ---- condition & concession ----
  ["〜からには","","kara ni wa","now that / since","引き受けたからにはやり遂げる。","ひきうけたからにはやりとげる。","Now that I've taken it on, I'll see it through."],
  ["〜以上は","〜いじょうは","ijou wa","since / now that","約束した以上は守る。","やくそくしたいじょうはまもる。","Since I promised, I'll keep it."],
  ["〜ないことには","","nai koto ni wa","unless (you do ~)","見ないことには判断できない。","みないことにははんだんできない。","I can't judge unless I see it."],
  ["〜ない限り","〜ないかぎり","nai kagiri","as long as ~ not / unless","謝らない限り許さない。","あやまらないかぎりゆるさない。","I won't forgive you unless you apologize."],
  ["〜も〜ば〜も","","mo ~ba ~mo","both ~ and / not only","彼は頭もよければ性格もいい。","かれはあたまもよければせいかくもいい。","He's both smart and good-natured."],
  ["〜からこそ","","kara koso","precisely because","君を思うからこそ厳しく言う。","きみをおもうからこそきびしくいう。","It's because I care that I'm strict."],
  ["〜ものの","","mono no","although / but","買ったものの、一度も使っていない。","かったものの、いちどもつかっていない。","I bought it, but haven't used it once."],
  ["〜ながら(も)","","nagara (mo)","although / even while","狭いながらも楽しい我が家だ。","せまいながらもたのしいわがやだ。","It's small, but it's my happy home."],
  ["〜つつ(も)","","tsutsu (mo)","while / even though","悪いと知りつつ嘘をついた。","わるいとしりつつうそをついた。","Even knowing it was wrong, I lied."],
  ["〜といっても","","to itte mo","although I say ~ / even so","料理といっても卵を焼くだけだ。","りょうりといってもたまごをやくだけだ。","I say \"cook,\" but it's just frying an egg."],
  ["〜にしても","","ni shite mo","even if / even ~","行くにしても連絡してね。","いくにしてもれんらくしてね。","Even if you go, let me know."],
  ["〜にせよ／にしろ","","ni seyo / ni shiro","whether ~ or / even if","賛成にせよ反対にせよ、理由を述べて。","さんせいにせよはんたいにせよ、りゆうをのべて。","Whether for or against, state your reasons."],
  ["〜わりに(は)","","wari ni","considering / for (a ~)","年のわりに若く見える。","としのわりにわかくみえる。","He looks young for his age."],
  // ---- contrast & addition ----
  ["〜反面","〜はんめん","hanmen","while / on the other side","便利な反面、危険もある。","べんりなはんめん、きけんもある。","It's convenient, but on the flip side, risky."],
  ["〜一方で","〜いっぽうで","ippou de","on the other hand","収入が増える一方で支出も増えた。","しゅうにゅうがふえるいっぽうでししゅつもふえた。","Income rose, but so did spending."],
  ["〜どころか","","dokoroka","far from / let alone","貯金どころか借金がある。","ちょきんどころかしゃっきんがある。","Far from savings, I have debt."],
  ["〜ばかりか","","bakari ka","not only ~ but also","彼は英語ばかりか中国語も話す。","かれはえいごばかりかちゅうごくごもはなす。","He speaks not only English but Chinese too."],
  ["〜のみならず","","nomi narazu","not only ~ (formal)","国内のみならず海外でも有名だ。","こくないのみならずかいがいでもゆうめいだ。","Famous not only at home but abroad."],
  ["〜に加えて","〜にくわえて","ni kuwaete","in addition to","雨に加えて風も強い。","あめにくわえてかぜもつよい。","In addition to rain, the wind is strong."],
  ["〜はもちろん","","wa mochiron","not to mention / of course","子供はもちろん大人も楽しめる。","こどもはもちろんおとなもたのしめる。","Children, and of course adults, can enjoy it."],
  ["〜はもとより","","wa moto yori","not only ~ but also (formal)","平日はもとより週末も働く。","へいじつはもとよりしゅうまつもはたらく。","I work weekdays, and weekends too."],
  ["〜に限らず","〜にかぎらず","ni kagirazu","not limited to","若者に限らず高齢者も使う。","わかものにかぎらずこうれいしゃもつかう。","Not just young people — the elderly use it too."],
  // ---- proportion & extent ----
  ["〜につれて","","ni tsurete","as ~ (gradual change)","年を取るにつれて忘れっぽくなる。","としをとるにつれてわすれっぽくなる。","As you age, you get more forgetful."],
  ["〜にしたがって","","ni shitagatte","as / in accordance with","上に行くにしたがって寒くなる。","うえにいくにしたがってさむくなる。","It gets colder as you go higher."],
  ["〜に伴って","〜にともなって","ni tomonatte","accompanying / along with","人口増加に伴って問題が増えた。","じんこうぞうかにともなってもんだいがふえた。","Problems grew along with the population."],
  ["〜ば〜ほど","","ba ~hodo","the more ~, the more","練習すればするほど上手になる。","れんしゅうすればするほどじょうずになる。","The more you practice, the better you get."],
  ["〜ほど","","hodo","to the extent / so ~ that","立てないほど疲れた。","たてないほどつかれた。","I'm so tired I can't stand."],
  // ---- limitation & focus ----
  ["〜こそ","","koso","precisely / it is ~ that","今度こそ成功させる。","こんどこそせいこうさせる。","This time for sure I'll succeed."],
  ["〜さえ","","sae","even","専門家さえ間違える。","せんもんかさえまちがえる。","Even experts make mistakes."],
  ["〜すら","","sura","even (emphatic, formal)","名前すら書けなかった。","なまえすらかけなかった。","I couldn't even write my name."],
  ["〜まで (even)","","made","even / to the point of","親友にまで裏切られた。","しんゆうにまでうらぎられた。","I was betrayed even by my best friend."],
  // ---- state & manner ----
  ["〜まま","","mama","as is / unchanged","電気をつけたまま寝た。","でんきをつけたままねた。","I slept with the lights on."],
  ["〜きり","","kiri","only / since (and no more)","彼とは一度会ったきりだ。","かれとはいちどあったきりだ。","I've met him only once."],
  ["〜っぱなし","","ppanashi","leave ~ (undone) / keep ~ing","水を出しっぱなしにした。","みずをだしっぱなしにした。","I left the water running."],
  ["〜一方だ","〜いっぽうだ","ippou da","keep ~ing (one-way trend)","景気は悪くなる一方だ。","けいきはわるくなるいっぽうだ。","The economy keeps getting worse."],
  ["〜ばかりだ","","bakari da","only get ~ / about to","状況は悪化するばかりだ。","じょうきょうはあっかするばかりだ。","The situation only worsens."],
  ["〜つつある","","tsutsu aru","be in the process of ~ing","景気は回復しつつある。","けいきはかいふくしつつある。","The economy is recovering."],
  // ---- judgment & modality ----
  ["〜に違いない","〜にちがいない","ni chigai nai","must be / no doubt","彼が犯人に違いない。","かれがはんにんにちがいない。","He must be the culprit."],
  ["〜に決まっている","〜にきまっている","ni kimatte iru","definitely / surely","そんな話は嘘に決まっている。","そんなはなしはうそにきまっている。","A story like that is surely a lie."],
  ["〜わけだ","","wake da","so that means / no wonder","雪国育ちだから、スキーが上手なわけだ。","ゆきぐにそだちだから、スキーがじょうずなわけだ。","Raised in snow country — no wonder she skis well."],
  ["〜わけがない","","wake ga nai","there's no way that ~","彼が来るわけがない。","かれがくるわけがない。","There's no way he'll come."],
  ["〜わけではない","","wake de wa nai","it doesn't mean that ~","全部嫌いなわけではない。","ぜんぶきらいなわけではない。","It's not that I dislike all of it."],
  ["〜わけにはいかない","","wake ni wa ikanai","can't afford to / mustn't","ここで諦めるわけにはいかない。","ここであきらめるわけにはいかない。","I can't give up here."],
  ["〜とは限らない","〜とはかぎらない","to wa kagiranai","not necessarily","高いものがいいとは限らない。","たかいものがいいとはかぎらない。","Expensive isn't necessarily good."],
  ["〜おそれがある","","osore ga aru","there's a risk that","津波のおそれがある。","つなみのおそれがある。","There's a risk of a tsunami."],
  ["〜に相違ない","〜にそういない","ni soui nai","without a doubt (formal)","彼の仕業に相違ない。","かれのしわざにそういない。","It's his doing without a doubt."],
  ["〜ようがない","","you ga nai","there's no way to ~","連絡先が分からず、知らせようがない。","れんらくさきがわからず、しらせようがない。","With no contact info, there's no way to tell them."],
  // ---- necessity & possibility ----
  ["〜ざるを得ない","〜ざるをえない","zaru o enai","cannot help but / be forced to","命令だから従わざるを得ない。","めいれいだからしたがわざるをえない。","It's an order, so I have no choice but to obey."],
  ["〜ずにはいられない","","zu ni wa irarenai","can't help but ~","笑わずにはいられない。","わらわずにはいられない。","I can't help laughing."],
  ["〜ないわけにはいかない","","nai wake ni wa ikanai","can't not ~ / have to","出席しないわけにはいかない。","しゅっせきしないわけにはいかない。","I can't not attend."],
  ["〜よりほかない","","yori hoka nai","have no choice but to","自分でやるよりほかない。","じぶんでやるよりほかない。","I have no choice but to do it myself."],
  ["〜得る／得ない","〜うる／えない","uru / enai","can / cannot possibly","それも十分あり得る。","それもじゅうぶんありうる。","That's entirely possible."],
  ["〜かねる","","kaneru","be unable to / cannot (polite)","その件はお答えしかねます。","そのけんはおこたえしかねます。","I'm afraid I can't answer that."],
  ["〜かねない","","kanenai","might (well) / be capable of (bad)","彼ならやりかねない。","かれならやりかねない。","He might well do it."],
  ["〜にすぎない","","ni suginai","is merely / no more than","それは言い訳にすぎない。","それはいいわけにすぎない。","That's merely an excuse."],
  ["〜にほかならない","","ni hoka naranai","is nothing other than","成功は努力の結果にほかならない。","せいこうはどりょくのけっかにほかならない。","Success is nothing but the result of effort."],
  // ---- evaluation & feeling ----
  ["〜てたまらない","","te tamaranai","unbearably / can't stand","暑くてたまらない。","あつくてたまらない。","It's unbearably hot."],
  ["〜てならない","","te naranai","can't help feeling","将来が不安でならない。","しょうらいがふあんでならない。","I can't help feeling anxious about the future."],
  ["〜てしょうがない","","te shou ga nai","extremely / can't help","眠くてしょうがない。","ねむくてしょうがない。","I'm extremely sleepy."],
  ["〜ことか","","koto ka","how ~! (exclamation)","どんなに嬉しかったことか。","どんなにうれしかったことか。","How happy I was!"],
  ["〜ことに(は)","","koto ni","~ly, (to one's ~)","驚いたことに彼は来なかった。","おどろいたことにかれはこなかった。","To my surprise, he didn't come."],
  // ---- other staples ----
  ["〜上に","〜うえに","ue ni","on top of / in addition","安い上においしい。","やすいうえにおいしい。","It's cheap, and on top of that, tasty."],
  ["〜がたい","","gatai","hard to ~ (do)","信じがたい話だ。","しんじがたいはなしだ。","It's a hard-to-believe story."],
  ["〜げ","","ge","-looking / seemingly","不安げな表情をしている。","ふあんげなひょうじょうをしている。","He has an anxious look."],
  ["〜っぽい","","ppoi","-ish / tends to be","この服は子供っぽい。","このふくはこどもっぽい。","These clothes look childish."],
  ["〜向け","〜むけ","muke","intended for","これは初心者向けの教材だ。","これはしょしんしゃむけのきょうざいだ。","This is material for beginners."],
  ["〜向き","〜むき","muki","suitable for / facing","南向きの部屋は明るい。","みなみむきのへやはあかるい。","A south-facing room is bright."],
  ["〜だらけ","","darake","full of / covered in","服が泥だらけだ。","ふくがどろだらけだ。","My clothes are covered in mud."],
  ["〜気味","〜ぎみ","gimi","a touch of / slightly","少し風邪気味だ。","すこしかぜぎみだ。","I have a slight cold."],
  ["〜次第で","〜しだいで","shidai de","depending on","天気次第で予定を変える。","てんきしだいでよていをかえる。","I'll change plans depending on the weather."],
  ["〜ことなく","","koto naku","without ~ing","一度も休むことなく働いた。","いちどもやすむことなくはたらいた。","He worked without resting once."],
  ["〜抜きで","〜ぬきで","nuki de","without / leaving out","冗談抜きで本気だ。","じょうだんぬきでほんきだ。","Joking aside, I'm serious."],
  ["〜を込めて","〜をこめて","o komete","with (feeling) put in","心を込めて手紙を書く。","こころをこめててがみをかく。","I write the letter with heartfelt care."],
  ["〜を通じて／を通して","〜をつうじて／をとおして","o tsuujite / o tooshite","through / throughout","友人を通じて知り合った。","ゆうじんをつうじてしりあった。","We met through a mutual friend."],
  ["〜にわたって","","ni watatte","over / spanning (a range)","三日間にわたって会議が続いた。","みっかかんにわたってかいぎがつづいた。","The conference went on over three days."],
  ["〜にかけて","","ni kakete","from ~ to (a span)","春から夏にかけて雨が多い。","はるからなつにかけてあめがおおい。","From spring to summer there's a lot of rain."],
  ["〜ものなら","","mono nara","if you could / if you dare","できるものならやってみろ。","できるものならやってみろ。","If you can do it, go ahead and try."],
  ["〜とおりに","","toori ni","exactly as","指示のとおりに動く。","しじのとおりにうごく。","I act exactly as instructed."],
  ["〜どおり","","doori","as / according to (suffix)","予定どおり進んでいる。","よていどおりすすんでいる。","It's going according to plan."],
  ["〜ぶり","","buri","after an interval of / manner","十年ぶりに故郷に帰った。","じゅうねんぶりにこきょうにかえった。","I returned home after ten years."],
  ["〜おきに","","oki ni","at intervals of","バスは十分おきに来る。","バスはじゅっぷんおきにくる。","The bus comes every ten minutes."],
  ["〜ごとに","","goto ni","each / every","会うごとに大きくなる。","あうごとにおおきくなる。","She grows bigger each time I see her."],
  ["〜やら〜やら","","yara ~yara","what with ~ and ~","掃除やら洗濯やらで忙しい。","そうじやらせんたくやらでいそがしい。","I'm busy what with cleaning, laundry, and so on."],
  ["〜ものがある","","mono ga aru","there's something ~ about it","彼の演技には心を打つものがある。","かれのえんぎにはこころをうつものがある。","There's something moving about his acting."],
  ["〜て以来","〜ていらい","te irai","ever since ~ing","引っ越して以来、会っていない。","ひっこしていらい、あっていない。","We haven't met since I moved."],
  ["〜得ない","〜えない","enai","cannot possibly","そんなことはあり得ない。","そんなことはありえない。","Such a thing is impossible."],
];
const arr = rows.map(E);
const key = "n2-grammar-all";
const json = JSON.stringify(arr, null, 2);
fs.writeFileSync(path.join(DATA, key + ".json"), json);
fs.writeFileSync(path.join(DATA, key + ".js"),
  `// Auto-generated fallback for file:// (when fetch is blocked). Source: ${key}.json\n` +
  `window.DECKS=window.DECKS||{};\nwindow.DECKS[${JSON.stringify(key)}]=${json};\n`);
console.log(`${key}: ${arr.length} entries`);

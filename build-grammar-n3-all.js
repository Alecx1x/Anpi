// Comprehensive "All N3 Grammar" master deck — the full standardized JLPT N3
// grammar list. Overwrites n3-grammar-all.json (themed N3 decks untouched).
// Run: node build-grammar-n3-all.js
const fs = require("fs");
const path = require("path");
const DATA = path.join(__dirname, "data");
const E = (a) => ({
  word: a[0], reading: a[1] || "", romaji: a[2] || "", meaning: a[3] || "",
  partOfSpeech: "Grammar", exampleSentence: a[4] || "", exampleReading: a[5] || "",
  exampleMeaning: a[6] || "", level: "N3",
});
const rows = [
  // ---- becoming & effort ----
  ["〜ようになる","","you ni naru","come to / reach the point where","日本語が話せるようになった。","にほんごがはなせるようになった。","I've become able to speak Japanese."],
  ["〜ようにする","","you ni suru","make an effort to","毎日運動するようにしている。","まいにちうんどうするようにしている。","I make a point of exercising daily."],
  ["〜ことにする","","koto ni suru","decide to","タバコをやめることにした。","タバコをやめることにした。","I've decided to quit smoking."],
  ["〜ことになる","","koto ni naru","it's been decided that","大阪に転勤することになった。","おおさかにてんきんすることになった。","It's been decided I'll transfer to Osaka."],
  ["〜ことにしている","","koto ni shite iru","make a habit of","毎朝走ることにしている。","まいあさはしることにしている。","I make it a rule to run each morning."],
  ["〜ことになっている","","koto ni natte iru","it's the rule / arrangement that","会議は十時からということになっている。","かいぎはじゅうじからということになっている。","The meeting is set for ten o'clock."],
  // ---- conjecture & modality ----
  ["〜はずだ","","hazu da","should be / supposed to","彼はもう着いているはずだ。","かれはもうついているはずだ。","He should have arrived by now."],
  ["〜はずがない","","hazu ga nai","couldn't possibly be","彼が知らないはずがない。","かれがしらないはずがない。","There's no way he doesn't know."],
  ["〜に違いない","〜にちがいない","ni chigai nai","must be / no doubt","あれが犯人に違いない。","あれがはんにんにちがいない。","That must be the culprit."],
  ["〜かもしれない","","kamo shirenai","might / maybe","明日は雪かもしれない。","あしたはゆきかもしれない。","It might snow tomorrow."],
  ["〜ようだ","","you da","it seems / appears","誰か来たようだ。","だれかきたようだ。","It seems someone came."],
  ["〜らしい","","rashii","apparently / I hear","彼は退院したらしい。","かれはたいいんしたらしい。","Apparently he left the hospital."],
  ["〜みたいだ","","mitai da","looks like / seems","風邪をひいたみたいだ。","かぜをひいたみたいだ。","It seems I've caught a cold."],
  ["〜そうだ (伝聞)","","sou da","I hear that","天気予報によると晴れるそうだ。","てんきよほうによるとはれるそうだ。","The forecast says it'll be sunny."],
  ["〜そうだ (様態)","","sou da","looks like (appearance)","ボタンが取れそうだ。","ボタンがとれそうだ。","The button looks about to come off."],
  ["〜っぽい","","ppoi","-ish / tends to be","彼は忘れっぽい。","かれはわすれっぽい。","He's forgetful."],
  ["〜に決まっている","〜にきまっている","ni kimatte iru","definitely / surely","そんな話は嘘に決まっている。","そんなはなしはうそにきまっている。","A story like that is surely a lie."],
  ["〜恐れがある","〜おそれがある","osore ga aru","there's a risk that","台風が上陸する恐れがある。","たいふうがじょうりくするおそれがある。","There's a risk the typhoon will land."],
  // ---- explanation & assertion ----
  ["〜わけだ","","wake da","so that means / no wonder","道理で寒いわけだ。","どうりでさむいわけだ。","No wonder it's cold."],
  ["〜わけがない","","wake ga nai","there's no way that ~","彼が嘘をつくわけがない。","かれがうそをつくわけがない。","There's no way he'd lie."],
  ["〜わけではない","","wake de wa nai","it doesn't mean that ~","嫌いなわけではない。","きらいなわけではない。","It's not that I dislike it."],
  ["〜わけにはいかない","","wake ni wa ikanai","can't afford to / mustn't","今日は休むわけにはいかない。","きょうはやすむわけにはいかない。","I can't afford to take today off."],
  ["〜ものだ","","mono da","that's how it is / used to","子供のころよく泣いたものだ。","こどものころよくないたものだ。","I often used to cry as a child."],
  ["〜ことだ","","koto da","you should / it's best to","上手になりたいなら練習することだ。","じょうずになりたいなられんしゅうすることだ。","If you want to improve, you should practice."],
  ["〜というものだ","","to iu mono da","that's simply ~","それは言い過ぎというものだ。","それはいいすぎというものだ。","That's simply going too far."],
  ["〜のだ／んだ","","no da / n da","explanatory \"it's that ~\"","顔色が悪い。具合が悪いんだ。","かおいろがわるい。ぐあいがわるいんだ。","You look pale — you must be unwell."],
  // ---- time & aspect ----
  ["〜ところだ","","tokoro da","be about to ~","今から出かけるところだ。","いまからでかけるところだ。","I'm just about to head out."],
  ["〜ているところ","","te iru tokoro","in the middle of ~ing","今、調べているところだ。","いま、しらべているところだ。","I'm in the middle of looking it up."],
  ["〜たところ","","ta tokoro","have just done","駅に着いたところだ。","えきについたところだ。","I've just arrived at the station."],
  ["〜たばかり","","ta bakari","just did / brand new","この時計は買ったばかりだ。","このとけいはかったばかりだ。","I just bought this watch."],
  ["〜うちに","","uchi ni","while / before (it changes)","明るいうちに帰ろう。","あかるいうちにかえろう。","Let's go home while it's still light."],
  ["〜間に","〜あいだに","aida ni","while / during (a span)","留守の間に泥棒が入った。","るすのあいだにどろぼうがはいった。","A burglar broke in while I was out."],
  ["〜間","〜あいだ","aida","throughout (the whole time)","夏休みの間ずっと働いた。","なつやすみのあいだずっとはたらいた。","I worked the whole summer break."],
  ["〜たとたん","","ta totan","the moment that","立ち上がったとたん、めまいがした。","たちあがったとたん、めまいがした。","The moment I stood up, I felt dizzy."],
  ["〜最中に","〜さいちゅうに","saichuu ni","right in the middle of","食事の最中に電話が鳴った。","しょくじのさいちゅうにでんわがなった。","The phone rang right in the middle of dinner."],
  ["〜ついでに","","tsuide ni","while you're at it / on the way","買い物のついでに郵便局へ寄った。","かいもののついでにゆうびんきょくへよった。","I stopped by the post office while shopping."],
  ["〜きり","","kiri","only / since (and no more)","彼とは一度会ったきりだ。","かれとはいちどあったきりだ。","I've met him only once."],
  ["〜一方だ","〜いっぽうだ","ippou da","keep ~ing (one-way trend)","物価は上がる一方だ。","ぶっかはあがるいっぽうだ。","Prices keep going up."],
  // ---- conditional & concession ----
  ["〜ても","","te mo","even if","雨が降っても行く。","あめがふってもいく。","I'll go even if it rains."],
  ["〜のに","","noni","although / even though","薬を飲んだのに治らない。","くすりをのんだのになおらない。","Even though I took medicine, I'm not better."],
  ["〜くせに","","kuse ni","even though (with reproach)","知っているくせに教えない。","しっているくせにおしえない。","Even though he knows, he won't tell."],
  ["〜ば〜ほど","","ba ~hodo","the more ~, the more","考えれば考えるほど分からない。","かんがえればかんがえるほどわからない。","The more I think, the less I understand."],
  ["〜さえ〜ば","","sae ~ba","if only / as long as","お金さえあれば買える。","おかねさえあればかえる。","As long as I had money, I could buy it."],
  ["〜からといって","","kara to itte","just because ~ (doesn't mean)","安いからといって買いすぎるな。","やすいからといってかいすぎるな。","Don't overbuy just because it's cheap."],
  ["〜としても","","to shite mo","even if / even supposing","本当だとしても信じない。","ほんとうだとしてもしんじない。","Even if it's true, I won't believe it."],
  ["〜ばよかった","","ba yokatta","should have ~ (regret)","もっと早く来ればよかった。","もっとはやくくればよかった。","I should have come earlier."],
  // ---- relation & reference ----
  ["〜について","","ni tsuite","about / concerning","環境問題について話す。","かんきょうもんだいについてはなす。","I talk about environmental issues."],
  ["〜に対して","〜にたいして","ni taishite","toward / in contrast to","目上の人に対して敬語を使う。","めうえのひとにたいしてけいごをつかう。","You use keigo toward your superiors."],
  ["〜によって","","ni yotte","depending on / by means of","国によって文化が違う。","くにによってぶんかがちがう。","Culture differs from country to country."],
  ["〜によると","","ni yoru to","according to","ニュースによると地震があったそうだ。","ニュースによるとじしんがあったそうだ。","According to the news, there was an earthquake."],
  ["〜にとって","","ni totte","for / to (from the view of)","私にとって家族が一番だ。","わたしにとってかぞくがいちばんだ。","For me, family comes first."],
  ["〜として","","to shite","as / in the role of","代表として参加する。","だいひょうとしてさんかする。","I take part as a representative."],
  ["〜に関して","〜にかんして","ni kanshite","regarding / concerning","事件に関して調査する。","じけんにかんしてちょうさする。","They investigate regarding the incident."],
  ["〜に比べて","〜にくらべて","ni kurabete","compared to","去年に比べて暑い。","きょねんにくらべてあつい。","It's hot compared to last year."],
  // ---- cause & purpose ----
  ["〜ために (目的)","","tame ni","in order to / for","合格のために勉強する。","ごうかくのためにべんきょうする。","I study in order to pass."],
  ["〜ように (目的)","","you ni","so that ~","見えるように大きく書く。","みえるようにおおきくかく。","I write large so it can be seen."],
  ["〜おかげで","","okage de","thanks to (positive)","友達のおかげで助かった。","ともだちのおかげでたすかった。","Thanks to my friend, I was saved."],
  ["〜せいで","","sei de","because of (blame)","事故のせいで遅れた。","じこのせいでおくれた。","I was late because of the accident."],
  // ---- addition & parallel ----
  ["〜ばかりでなく","","bakari de naku","not only ~ but also","彼は英語ばかりでなく中国語も話す。","かれはえいごばかりでなくちゅうごくごもはなす。","He speaks not only English but Chinese too."],
  ["〜だけでなく","","dake de naku","not only ~ (but also)","値段だけでなく質も大切だ。","ねだんだけでなくしつもたいせつだ。","Not only price but quality matters."],
  ["〜とともに","","to tomo ni","together with / as","年とともに体が弱くなる。","としとともにからだがよわくなる。","The body weakens with age."],
  ["〜一方で","〜いっぽうで","ippou de","on the other hand","便利な一方で危険もある。","べんりないっぽうできけんもある。","It's convenient; on the other hand, there's danger."],
  ["〜反面","〜はんめん","hanmen","while / on the other side","給料がいい反面、忙しい。","きゅうりょうがいいはんめん、いそがしい。","The pay is good, but on the flip side it's busy."],
  ["〜代わりに","〜かわりに","kawari ni","instead of / in exchange for","肉の代わりに魚を食べる。","にくのかわりにさかなをたべる。","I eat fish instead of meat."],
  // ---- change & proportion ----
  ["〜にしたがって","","ni shitagatte","as / in accordance with","年を取るにしたがって丸くなる。","としをとるにしたがってまるくなる。","As one ages, one mellows."],
  ["〜につれて","","ni tsurete","as ~ (gradual change)","春になるにつれて暖かくなる。","はるになるにつれてあたたかくなる。","As spring approaches, it gets warmer."],
  ["〜とおりに","","toori ni","exactly as / in the way","説明書のとおりに組み立てる。","せつめいしょのとおりにくみたてる。","Assemble it just as the manual says."],
  ["〜どおり","","doori","as / according to (suffix)","予定どおりに進んでいる。","よていどおりにすすんでいる。","It's going according to plan."],
  // ---- manner & extent ----
  ["〜ほど","","hodo","to the extent / so ~ that","死ぬほど疲れた。","しぬほどつかれた。","I'm dead tired."],
  ["〜くらい／ぐらい","","kurai / gurai","to the extent of / about","泣きたいくらい悔しい。","なきたいくらいくやしい。","I'm so frustrated I could cry."],
  ["〜やすい","","yasui","easy to ~","この字は読みやすい。","このじはよみやすい。","This writing is easy to read."],
  ["〜にくい","","nikui","hard to ~","この道は歩きにくい。","このみちはあるきにくい。","This road is hard to walk on."],
  ["〜すぎる","","sugiru","too much / excessively","昨日は飲みすぎた。","きのうはのみすぎた。","I drank too much yesterday."],
  ["〜がち","","gachi","tend to / be prone to","冬は風邪をひきがちだ。","ふゆはかぜをひきがちだ。","In winter I tend to catch colds."],
  ["〜気味","〜ぎみ","gimi","a touch of / slightly","最近、疲れ気味だ。","さいきん、つかれぎみだ。","Lately I feel a bit tired."],
  ["〜だらけ","","darake","full of / covered in","机の上は書類だらけだ。","つくえのうえはしょるいだらけだ。","The desk is covered in papers."],
  ["〜っぱなし","","ppanashi","leave ~ (undone) / keep ~ing","電気をつけっぱなしにした。","でんきをつけっぱなしにした。","I left the lights on."],
  ["〜きる","","kiru","do completely / fully","マラソンを走りきった。","マラソンをはしりきった。","I ran the whole marathon."],
  ["〜きれない","","kirenai","cannot finish / too many to","多すぎて食べきれない。","おおすぎてたべきれない。","There's too much to finish eating."],
  ["〜がたい","","gatai","hard to ~ (do)","信じがたい話だ。","しんじがたいはなしだ。","It's a hard-to-believe story."],
  // ---- obligation & advice ----
  ["〜なければならない","","nakereba naranai","must / have to","明日までに出さなければならない。","あしたまでにださなければならない。","I have to submit it by tomorrow."],
  ["〜べきだ","","beki da","should / ought to","約束は守るべきだ。","やくそくはまもるべきだ。","You should keep your promises."],
  ["〜ことはない","","koto wa nai","there's no need to","そんなに心配することはない。","そんなにしんぱいすることはない。","There's no need to worry so much."],
  // ---- auxiliary verbs ----
  ["〜てある","","te aru","has been done (state)","ドアに鍵がかけてある。","ドアにかぎがかけてある。","The door is locked."],
  ["〜ておく","","te oku","do in advance","会議の前に資料を準備しておく。","かいぎのまえにしりょうをじゅんびしておく。","I prepare the materials before the meeting."],
  ["〜てしまう","","te shimau","do completely / regret","宿題を忘れてしまった。","しゅくだいをわすれてしまった。","I went and forgot my homework."],
  ["〜ていく","","te iku","go on ~ing","これから人口が減っていく。","これからじんこうがへっていく。","The population will keep decreasing."],
  ["〜てくる","","te kuru","come to ~ / begin to","だんだん寒くなってきた。","だんだんさむくなってきた。","It's gradually gotten cold."],
  ["〜出す","〜だす","dasu","suddenly start ~ing","赤ちゃんが泣き出した。","あかちゃんがなきだした。","The baby suddenly started crying."],
  ["〜始める","〜はじめる","hajimeru","begin to ~","桜が咲き始めた。","さくらがさきはじめた。","The cherry blossoms began to bloom."],
  ["〜続ける","〜つづける","tsuzukeru","continue to ~","三時間歩き続けた。","さんじかんあるきつづけた。","I kept walking for three hours."],
  ["〜終わる","〜おわる","owaru","finish ~ing","本を読み終わった。","ほんをよみおわった。","I finished reading the book."],
  ["〜かける","","kakeru","be in the middle of / half-~","言いかけてやめた。","いいかけてやめた。","I started to speak, then stopped."],
  ["〜直す","〜なおす","naosu","redo / ~ again","作文を書き直す。","さくぶんをかきなおす。","I rewrite the essay."],
  // ---- causative / passive / giving ----
  ["〜（さ）せる","","(sa)seru","causative — make / let do","子供に部屋を掃除させる。","こどもにへやをそうじさせる。","I make my child clean the room."],
  ["〜（ら）れる (受身)","","(ra)reru","passive — be done to","先生に注意された。","せんせいにちゅういされた。","I was warned by the teacher."],
  ["〜（さ）せられる","","(sa)serareru","causative-passive — be made to","上司に残業させられた。","じょうしにざんぎょうさせられた。","I was made to work overtime by my boss."],
  ["〜（さ）せてください","","(sa)sete kudasai","please let me ~","少し休ませてください。","すこしやすませてください。","Please let me rest a bit."],
  ["〜てもらう","","te morau","have/get someone to do","友達に手伝ってもらった。","ともだちにてつだってもらった。","I had my friend help me."],
  ["〜てくれる","","te kureru","do (something) for me","母が弁当を作ってくれた。","ははがべんとうをつくってくれた。","My mom made me a lunch."],
  ["〜てほしい","","te hoshii","want someone to ~","早く元気になってほしい。","はやくげんきになってほしい。","I want you to get well soon."],
  // ---- quotation & definition ----
  ["〜という","","to iu","called / named","北海道という所に住む。","ほっかいどうというところにすむ。","I live in a place called Hokkaido."],
  ["〜ということだ","","to iu koto da","I hear / it means that","会議は中止ということだ。","かいぎはちゅうしということだ。","I hear the meeting is canceled."],
  ["〜というのは","","to iu no wa","the thing called / the reason is","遅れた。というのは寝坊したからだ。","おくれた。というのはねぼうしたからだ。","I was late — that's because I overslept."],
  ["〜とは","","to wa","~ means / by ~ is meant","「無料」とはただという意味だ。","「むりょう」とはただといういみだ。","\"Free of charge\" means it costs nothing."],
  ["〜と言われている","〜といわれている","to iwarete iru","it is said that ~","お茶は体にいいと言われている。","おちゃはからだにいいといわれている。","Tea is said to be good for you."],
  // ---- particles & focus ----
  ["〜こそ","","koso","precisely / it is ~ that","今度こそ成功させる。","こんどこそせいこうさせる。","This time for sure I'll make it work."],
  ["〜さえ","","sae","even","自分の名前さえ書けない。","じぶんのなまえさえかけない。","He can't even write his own name."],
  ["〜しか〜ない","","shika ~nai","only (with negative)","千円しかない。","せんえんしかない。","I only have a thousand yen."],
  ["〜のみ","","nomi","only (formal)","会員のみ入場できる。","かいいんのみにゅうじょうできる。","Only members may enter."],
  ["〜ばかり","","bakari","only / nothing but","彼は文句ばかり言う。","かれはもんくばかりいう。","He does nothing but complain."],
  ["〜なんて","","nante","such a thing as / (surprise)","彼が失敗するなんて信じられない。","かれがしっぱいするなんてしんじられない。","I can't believe he'd fail."],
  // ---- misc ----
  ["〜向け","〜むけ","muke","intended for","これは子供向けの本だ。","これはこどもむけのほんだ。","This is a book for children."],
  ["〜向き","〜むき","muki","suitable for / facing","この料理は初心者向きだ。","このりょうりはしょしんしゃむきだ。","This dish is suitable for beginners."],
  ["〜たて","","tate","freshly / just-done","焼きたてのパンはおいしい。","やきたてのパンはおいしい。","Freshly baked bread is delicious."],
  ["〜ながら (逆接)","","nagara","although / despite","残念ながら、参加できない。","ざんねんながら、さんかできない。","Unfortunately, I can't attend."],
  ["〜つもり","","tsumori","intend to","来年結婚するつもりだ。","らいねんけっこんするつもりだ。","I intend to get married next year."],
  ["〜たがる","","tagaru","(someone) shows signs of wanting","子供はお菓子を食べたがる。","こどもはおかしをたべたがる。","Children want to eat sweets."],
  ["〜（よ）うとする","","you to suru","try to / be about to","立ち上がろうとしたが、痛かった。","たちあがろうとしたが、いたかった。","I tried to stand up, but it hurt."],
  ["〜まま","","mama","as is / unchanged","靴を履いたまま入った。","くつをはいたままはいった。","I came in with my shoes still on."],
  ["〜ように (依頼・忠告)","","you ni","(asking/telling) to ~","遅れないように言われた。","おくれないようにいわれた。","I was told not to be late."],
];
const arr = rows.map(E);
const key = "n3-grammar-all";
const json = JSON.stringify(arr, null, 2);
fs.writeFileSync(path.join(DATA, key + ".json"), json);
fs.writeFileSync(path.join(DATA, key + ".js"),
  `// Auto-generated fallback for file:// (when fetch is blocked). Source: ${key}.json\n` +
  `window.DECKS=window.DECKS||{};\nwindow.DECKS[${JSON.stringify(key)}]=${json};\n`);
console.log(`${key}: ${arr.length} entries`);

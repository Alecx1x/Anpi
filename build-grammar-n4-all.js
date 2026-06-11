// Comprehensive "All N4 Grammar" master deck — the full standardized JLPT N4
// grammar list. Overwrites n4-grammar-all.json (themed N4 decks untouched).
// Run: node build-grammar-n4-all.js
const fs = require("fs");
const path = require("path");
const DATA = path.join(__dirname, "data");
const E = (a) => ({
  word: a[0], reading: a[1] || "", romaji: a[2] || "", meaning: a[3] || "",
  partOfSpeech: "Grammar", exampleSentence: a[4] || "", exampleReading: a[5] || "",
  exampleMeaning: a[6] || "", level: "N4",
});
const rows = [
  // ---- intention & volition ----
  ["〜（よ）うと思う","〜（よ）うとおもう","you to omou","I think I'll ~ (decision)","今日は早く寝ようと思う。","きょうははやくねようとおもう。","I think I'll go to bed early today."],
  ["〜つもりだ","","tsumori da","intend to / plan to","来年留学するつもりだ。","らいねんりゅうがくするつもりだ。","I intend to study abroad next year."],
  ["〜予定だ","〜よていだ","yotei da","be scheduled to","三時に出発する予定だ。","さんじにしゅっぱつするよていだ。","We're scheduled to depart at three."],
  ["〜（よ）う","","you","volitional (\"let's ~\", casual)","そろそろ行こう。","そろそろいこう。","Let's get going."],
  ["〜ことにする","","koto ni suru","decide to","タバコをやめることにした。","タバコをやめることにした。","I've decided to quit smoking."],
  ["〜ことになる","","koto ni naru","it's been decided that","来月転勤することになった。","らいげつてんきんすることになった。","It's been decided I'll transfer next month."],
  ["〜ことにしている","","koto ni shite iru","make a habit of","毎朝走ることにしている。","まいあさはしることにしている。","I make it a rule to run every morning."],
  ["〜ことになっている","","koto ni natte iru","it's the rule that","校内では靴を脱ぐことになっている。","こうないではくつをぬぐことになっている。","The rule is to take off your shoes inside the school."],
  // ---- te-form patterns ----
  ["〜てある","","te aru","has been done (resultant state)","壁に地図が貼ってある。","かべにちずがはってある。","A map is posted on the wall."],
  ["〜ておく","","te oku","do in advance","旅行の前に切符を買っておく。","りょこうのまえにきっぷをかっておく。","I buy tickets before the trip."],
  ["〜てしまう","","te shimau","do completely / unfortunately","大事な書類を忘れてしまった。","だいじなしょるいをわすれてしまった。","I went and forgot the important papers."],
  ["〜てみる","","te miru","try doing","新しい店で食べてみる。","あたらしいみせでたべてみる。","I'll try eating at the new place."],
  ["〜ていく","","te iku","go on ~ing / ~ away","これから暑くなっていく。","これからあつくなっていく。","It'll get hotter from now on."],
  ["〜てくる","","te kuru","come to ~ / begin to","急に雨が降ってきた。","きゅうにあめがふってきた。","It suddenly started to rain."],
  ["〜てあげる","","te ageru","do (something) for someone","妹を手伝ってあげた。","いもうとをてつだってあげた。","I helped my little sister."],
  ["〜てくれる","","te kureru","do (something) for me","友達が送ってくれた。","ともだちがおくってくれた。","My friend gave me a ride."],
  ["〜てもらう","","te morau","have/get someone to do","友達に直してもらった。","ともだちになおしてもらった。","I had my friend fix it."],
  ["〜てほしい","","te hoshii","want someone to ~","もっと話を聞いてほしい。","もっとはなしをきいてほしい。","I want you to listen to me more."],
  ["〜てもかまわない","","te mo kamawanai","don't mind if","窓を閉めてもかまいませんか。","まどをしめてもかまいませんか。","Do you mind if I close the window?"],
  // ---- conditionals ----
  ["〜と (条件)","","to","whenever / if (natural result)","春になると桜が咲く。","はるになるとさくらがさく。","When spring comes, the cherry blossoms bloom."],
  ["〜ば","","ba","if (hypothetical)","安ければ買います。","やすければかいます。","If it's cheap, I'll buy it."],
  ["〜たら","","tara","if / when (once ~)","駅に着いたら電話して。","えきについたらでんわして。","Call me when you arrive at the station."],
  ["〜なら","","nara","if it's the case that ~","行くなら朝がいい。","いくならあさがいい。","If you're going, morning is best."],
  ["〜ても","","te mo","even if","雨が降っても行く。","あめがふってもいく。","I'll go even if it rains."],
  ["〜ば〜ほど","","ba ~hodo","the more ~, the more ~","練習すればするほど上手になる。","れんしゅうすればするほどじょうずになる。","The more you practice, the better you get."],
  // ---- potential / passive / causative ----
  ["〜（ら）れる (可能)","","(ra)reru","potential — can do","漢字が読める。","かんじがよめる。","I can read kanji."],
  ["〜（ら）れる (受身)","","(ra)reru","passive — be done to","先生にほめられた。","せんせいにほめられた。","I was praised by the teacher."],
  ["〜（さ）せる (使役)","","(sa)seru","causative — make / let do","子供に野菜を食べさせる。","こどもにやさいをたべさせる。","I make my child eat vegetables."],
  ["〜（さ）せられる","","(sa)serareru","causative-passive — be made to do","先輩にお酒を飲まされた。","せんぱいにおさけをのまされた。","I was made to drink by my senior."],
  // ---- conjecture & modality ----
  ["〜だろう／でしょう","","darou / deshou","probably / I bet","明日は晴れるだろう。","あしたははれるだろう。","It'll probably be sunny tomorrow."],
  ["〜と思う","〜とおもう","to omou","I think (that)","それはいい考えだと思う。","それはいいかんがえだとおもう。","I think that's a good idea."],
  ["〜かもしれない","","kamo shirenai","might / maybe","雪が降るかもしれない。","ゆきがふるかもしれない。","It might snow."],
  ["〜はずだ","","hazu da","should be / supposed to","彼はもう着いているはずだ。","かれはもうついているはずだ。","He should have arrived by now."],
  ["〜はずがない","","hazu ga nai","couldn't possibly be","彼が嘘をつくはずがない。","かれがうそをつくはずがない。","There's no way he'd lie."],
  ["〜そうだ (様態)","","sou da","looks like (appearance)","雨が降りそうだ。","あめがふりそうだ。","It looks like it'll rain."],
  ["〜そうだ (伝聞)","","sou da","I hear that","彼は来ないそうだ。","かれはこないそうだ。","I hear he isn't coming."],
  ["〜ようだ","","you da","it seems / appears","誰か来たようだ。","だれかきたようだ。","It seems someone has come."],
  ["〜みたいだ","","mitai da","looks like / seems","風邪をひいたみたいだ。","かぜをひいたみたいだ。","It seems I've caught a cold."],
  ["〜らしい","","rashii","apparently / I hear","彼は引っ越したらしい。","かれはひっこしたらしい。","Apparently he moved."],
  // ---- experience & habit ----
  ["〜たことがある","","ta koto ga aru","have done before","日本に行ったことがある。","にほんにいったことがある。","I've been to Japan before."],
  ["〜ことがある","","koto ga aru","there are times when","たまに遅れることがある。","たまにおくれることがある。","Sometimes I'm late."],
  ["〜たり〜たり","","tari ~tari","do things like ~ and ~","読んだり書いたりする。","よんだりかいたりする。","I do things like reading and writing."],
  ["〜ながら","","nagara","while doing (two actions)","音楽を聞きながら勉強する。","おんがくをききながらべんきょうする。","I study while listening to music."],
  ["〜し","","shi","and (listing reasons)","安いし、おいしい。","やすいし、おいしい。","It's cheap, and tasty too."],
  ["〜たがる","","tagaru","(someone) shows signs of wanting to","子供は外で遊びたがる。","こどもはそとであそびたがる。","Children want to play outside."],
  ["〜がる","","garu","show signs of (a feeling)","弟は怖がっている。","おとうとはこわがっている。","My little brother is scared."],
  // ---- ability & becoming ----
  ["〜ことができる","","koto ga dekiru","can / be able to","ピアノを弾くことができる。","ピアノをひくことができる。","I can play the piano."],
  ["〜ようになる","","you ni naru","come to (be able to)","自転車に乗れるようになった。","じてんしゃにのれるようになった。","I've become able to ride a bike."],
  ["〜ようにする","","you ni suru","make an effort to","毎日野菜を食べるようにする。","まいにちやさいをたべるようにする。","I try to eat vegetables every day."],
  ["〜なくなる","","naku naru","come to no longer ~","最近、テレビを見なくなった。","さいきん、テレビをみなくなった。","Lately I've stopped watching TV."],
  // ---- reason & cause ----
  ["〜ので","","node","because (polite, objective)","用事があるので、失礼します。","ようじがあるので、しつれいします。","I have an errand, so I'll excuse myself."],
  ["〜ために (原因)","","tame ni","because of / due to","事故のために電車が遅れた。","じこのためにでんしゃがおくれた。","The train was late due to an accident."],
  ["〜おかげで","","okage de","thanks to (positive)","先生のおかげで合格した。","せんせいのおかげでごうかくした。","Thanks to my teacher, I passed."],
  ["〜せいで","","sei de","because of (blame)","雨のせいで中止になった。","あめのせいでちゅうしになった。","It was canceled because of the rain."],
  ["〜のに","","noni","although / even though","約束したのに来なかった。","やくそくしたのにこなかった。","Even though he promised, he didn't come."],
  // ---- time ----
  ["〜とき","","toki","when ~","国に帰るとき、お土産を買う。","くににかえるとき、おみやげをかう。","When I go home, I buy souvenirs."],
  ["〜間に","〜あいだに","aida ni","while / during","留守の間に荷物が届いた。","るすのあいだににもつがとどいた。","A package arrived while I was out."],
  ["〜うちに","","uchi ni","while / before (it changes)","熱いうちに食べてください。","あついうちにたべてください。","Please eat it while it's hot."],
  ["〜ところだ","","tokoro da","be about to ~","今から出かけるところだ。","いまからでかけるところだ。","I'm just about to head out."],
  ["〜ているところ","","te iru tokoro","in the middle of ~ing","今、料理しているところだ。","いま、りょうりしているところだ。","I'm in the middle of cooking."],
  ["〜たところ","","ta tokoro","have just done","今、駅に着いたところだ。","いま、えきについたところだ。","I've just arrived at the station."],
  ["〜たばかり","","ta bakari","just did / only just","さっき食べたばかりだ。","さっきたべたばかりだ。","I just ate a moment ago."],
  ["〜までに","","made ni","by (a deadline)","五時までに帰る。","ごじまでにかえる。","I'll be back by five."],
  // ---- purpose ----
  ["〜ために (目的)","","tame ni","in order to / for","家を買うために貯金する。","いえをかうためにちょきんする。","I save money in order to buy a house."],
  ["〜ように","","you ni","so that (with potential/neg.)","忘れないようにメモする。","わすれないようにメモする。","I take notes so I won't forget."],
  ["〜のに (用途)","","no ni","for (a use) / to do","この道具は何をするのに使う?","このどうぐはなにをするのにつかう?","What is this tool used for?"],
  // ---- advice & obligation ----
  ["〜ほうがいい","","hou ga ii","it's better to ~","早く寝たほうがいい。","はやくねたほうがいい。","You'd better go to bed early."],
  ["〜なければならない","","nakereba naranai","must / have to","薬を飲まなければならない。","くすりをのまなければならない。","I have to take my medicine."],
  ["〜なくてはいけない","","nakute wa ikenai","must / have to","明日までに出さなくてはいけない。","あしたまでにださなくてはいけない。","I have to turn it in by tomorrow."],
  ["〜なくてもいい","","nakute mo ii","don't have to","明日は来なくてもいい。","あしたはこなくてもいい。","You don't have to come tomorrow."],
  ["〜こと (指示)","","koto","must (written instruction)","必ず手を洗うこと。","かならずてをあらうこと。","Be sure to wash your hands."],
  // ---- verb compounds & auxiliaries ----
  ["〜やすい","","yasui","easy to ~","この本は読みやすい。","このほんはよみやすい。","This book is easy to read."],
  ["〜にくい","","nikui","hard to ~","この薬は飲みにくい。","このくすりはのみにくい。","This medicine is hard to take."],
  ["〜すぎる","","sugiru","too much / excessively","食べすぎてお腹が痛い。","たべすぎておなかがいたい。","I ate too much and my stomach hurts."],
  ["〜方 (かた)","〜かた","kata","way of / how to do","漢字の書き方を教えて。","かんじのかきかたをおしえて。","Teach me how to write kanji."],
  ["〜始める","〜はじめる","hajimeru","begin to ~","桜が咲き始めた。","さくらがさきはじめた。","The cherry blossoms began to bloom."],
  ["〜続ける","〜つづける","tsuzukeru","continue to ~","三時間歩き続けた。","さんじかんあるきつづけた。","I kept walking for three hours."],
  ["〜終わる","〜おわる","owaru","finish ~ing","本を読み終わった。","ほんをよみおわった。","I finished reading the book."],
  ["〜出す","〜だす","dasu","suddenly start ~ing","赤ちゃんが泣き出した。","あかちゃんがなきだした。","The baby suddenly started crying."],
  // ---- quotation & embedded ----
  ["〜という","","to iu","called / named","田中という人が来た。","たなかというひとがきた。","A person named Tanaka came."],
  ["〜と言っていた","〜といっていた","to itte ita","(someone) said that ~","彼は来ると言っていた。","かれはくるといっていた。","He said he'd come."],
  ["〜かどうか","","ka dou ka","whether or not","行くかどうか分からない。","いくかどうかわからない。","I don't know whether I'll go or not."],
  ["疑問詞＋か","ぎもんし＋か","gimonshi + ka","embedded question (what/where/etc.)","何を買うか決めた。","なにをかうかきめた。","I decided what to buy."],
  ["〜ということ","","to iu koto","the fact / matter that ~","合格したということを聞いた。","ごうかくしたということをきいた。","I heard that you passed."],
  // ---- explanatory & misc ----
  ["〜のだ／んだ","","no da / n da","explanatory \"it's that ~\"","遅れたのは事故があったんだ。","おくれたのはじこがあったんだ。","The reason I'm late is there was an accident."],
  ["〜場合は","〜ばあいは","baai wa","in the case of / if","地震の場合は外に出ない。","じしんのばあいはそとにでない。","In case of an earthquake, don't go outside."],
  ["〜まま","","mama","as is / leaving unchanged","靴を履いたまま入った。","くつをはいたままはいった。","I went in with my shoes still on."],
  ["〜について","","ni tsuite","about / concerning","日本の文化について調べる。","にほんのぶんかについてしらべる。","I research about Japanese culture."],
  ["〜たらどうですか","","tara dou desu ka","why don't you ~?","少し休んだらどうですか。","すこしやすんだらどうですか。","Why don't you rest a bit?"],
  ["〜なさい","","nasai","do ~! (gentle command)","早く起きなさい。","はやくおきなさい。","Get up early!"],
  ["〜な (禁止)","","na","don't ~! (prohibition)","ここに入るな。","ここにはいるな。","Don't enter here!"],
  ["〜だけで","","dake de","just by / with only","見ただけで分かる。","みただけでわかる。","I can tell just by looking."],
  ["〜しかない","","shika nai","have no choice but to","歩いて帰るしかない。","あるいてかえるしかない。","I have no choice but to walk home."],
  ["〜とか〜とか","","toka ~toka","things like ~ and ~","映画とか音楽とかが好きだ。","えいがとかおんがくとかがすきだ。","I like things like movies and music."],
  ["〜のような／のように","","no you na / ni","like / as","鳥のように飛びたい。","とりのようにとびたい。","I want to fly like a bird."],
  ["〜さ","","sa","-ness (adjective → noun)","山の高さに驚いた。","やまのたかさにおどろいた。","I was surprised at the height of the mountain."],
  ["〜がする","","ga suru","(a smell / sound / feeling) occurs","いいにおいがする。","いいにおいがする。","It smells nice."],
  ["〜たがっている","","tagatte iru","(someone) wants to (right now)","子供が公園に行きたがっている。","こどもがこうえんにいきたがっている。","The child wants to go to the park."],
];
const arr = rows.map(E);
const key = "n4-grammar-all";
const json = JSON.stringify(arr, null, 2);
fs.writeFileSync(path.join(DATA, key + ".json"), json);
fs.writeFileSync(path.join(DATA, key + ".js"),
  `// Auto-generated fallback for file:// (when fetch is blocked). Source: ${key}.json\n` +
  `window.DECKS=window.DECKS||{};\nwindow.DECKS[${JSON.stringify(key)}]=${json};\n`);
console.log(`${key}: ${arr.length} entries`);

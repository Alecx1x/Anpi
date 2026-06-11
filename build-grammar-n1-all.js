// Comprehensive "All N1 Grammar" master deck — the full standardized JLPT N1
// grammar list. Overwrites n1-grammar-all.json (themed N1 decks untouched).
// Run: node build-grammar-n1-all.js
const fs = require("fs");
const path = require("path");
const DATA = path.join(__dirname, "data");
const E = (a) => ({
  word: a[0], reading: a[1] || "", romaji: a[2] || "", meaning: a[3] || "",
  partOfSpeech: "Grammar", exampleSentence: a[4] || "", exampleReading: a[5] || "",
  exampleMeaning: a[6] || "", level: "N1",
});
const rows = [
  // ---- immediacy & timing ----
  ["〜が早いか","〜がはやいか","ga hayai ka","as soon as / the instant","席に着くが早いか話し始めた。","せきにつくがはやいかはなしはじめた。","The instant he sat down, he began to talk."],
  ["〜や否や","〜やいなや","ya inaya","no sooner ~ than","ベルが鳴るや否や教室を出た。","ベルがなるやいなやきょうしつをでた。","No sooner had the bell rung than they left."],
  ["〜なり","","nari","the moment / as soon as","彼は帰るなり部屋にこもった。","かれはかえるなりへやにこもった。","The moment he got home, he shut himself in."],
  ["〜そばから","","soba kara","no sooner ~ than (repeatedly)","教えるそばから忘れてしまう。","おしえるそばからわすれてしまう。","No sooner do I teach it than it's forgotten."],
  ["〜てからというもの","","te kara to iu mono","ever since ~","就職してからというもの忙しい。","しゅうしょくしてからというものいそがしい。","Ever since I got a job, I've been busy."],
  ["〜を限りに","〜をかぎりに","o kagiri ni","as of / ending with","今日を限りに禁煙する。","きょうをかぎりにきんえんする。","As of today, I'll quit smoking."],
  ["〜を皮切りに","〜をかわきりに","o kawakiri ni","starting with / kicking off","東京を皮切りに全国を回る。","とうきょうをかわきりにぜんこくをまわる。","Starting with Tokyo, they tour the country."],
  ["〜に先立って","〜にさきだって","ni sakidatte","prior to / before","開会に先立って挨拶がある。","かいかいにさきだってあいさつがある。","Before the opening, there's a greeting."],
  ["〜矢先に","〜やさきに","yasaki ni","just as / right when (about to)","出かけようとした矢先に電話が来た。","でかけようとしたやさきにでんわがきた。","Right as I was about to leave, a call came."],
  // ---- standpoint, basis & relation ----
  ["〜にあって","","ni atte","in / at (a special situation)","非常時にあって冷静さを保つ。","ひじょうじにあってれいせいさをたもつ。","Even in a crisis, he stays calm."],
  ["〜をもって","","o motte","with / by means of / as of","本日をもって閉店する。","ほんじつをもってへいてんする。","We close as of today."],
  ["〜をもとに","","o moto ni","based on","実話をもとに映画を作る。","じつわをもとにえいがをつくる。","The film is based on a true story."],
  ["〜に至るまで","〜にいたるまで","ni itaru made","all the way to / down to","服装から言葉遣いに至るまで厳しい。","ふくそうからことばづかいにいたるまできびしい。","Strict about everything from dress to speech."],
  ["〜に至って","〜にいたって","ni itatte","when it finally reached","事故に至って対策がとられた。","じこにいたってたいさくがとられた。","Only when an accident occurred were measures taken."],
  ["〜に至っては","〜にいたっては","ni itatte wa","when it comes to (extreme)","弟に至っては全く勉強しない。","おとうとにいたってはまったくべんきょうしない。","As for my brother, he doesn't study at all."],
  ["〜にして","","ni shite","being ~ / only at (a stage)","彼にして解けない問題だ。","かれにしてとけないもんだいだ。","It's a problem even he can't solve."],
  ["〜ともなると","","to mo naru to","when it comes to / once","年末ともなると街が混む。","ねんまつともなるとまちがこむ。","Come year-end, the town gets crowded."],
  ["〜ときたら","","to kitara","when it comes to ~ (criticism)","うちの息子ときたら勉強しない。","うちのむすこときたらべんきょうしない。","As for my son, he won't study."],
  ["〜たるもの","","taru mono","as one who is ~ (befitting)","教師たるもの模範であるべきだ。","きょうしたるものもはんであるべきだ。","One who is a teacher should set an example."],
  ["〜ともあろう","","to mo arou","someone as ~ (should not)","プロともあろう者がミスをした。","プロともあろうものがミスをした。","Someone of all people a pro made a mistake."],
  // ---- emphasis & extremes ----
  ["〜といったらない","","to ittara nai","extremely / indescribably","その美しさといったらない。","そのうつくしさといったらない。","Its beauty is beyond words."],
  ["〜この上ない","〜このうえない","kono ue nai","utmost / nothing more ~","この上ない幸せだ。","このうえないしあわせだ。","It's the greatest happiness."],
  ["〜極まりない","〜きわまりない","kiwamari nai","extremely / nothing short of","失礼極まりない態度だ。","しつれいきわまりないたいどだ。","An extremely rude attitude."],
  ["〜の極み","〜のきわみ","no kiwami","the height of / extreme of","贅沢の極みだ。","ぜいたくのきわみだ。","It's the height of luxury."],
  ["〜の至り","〜のいたり","no itari","the height of (emotion)","光栄の至りです。","こうえいのいたりです。","I'm deeply honored."],
  ["〜限りだ","〜かぎりだ","kagiri da","extremely / utterly (feeling)","一人で心細い限りだ。","ひとりでこころぼそいかぎりだ。","I feel utterly lonely on my own."],
  ["〜てやまない","","te yamanai","sincerely / endlessly","ご成功を願ってやまない。","ごせいこうをねがってやまない。","I sincerely wish you success."],
  ["〜てかなわない","","te kanawanai","unbearably / can't stand","暑くてかなわない。","あつくてかなわない。","It's unbearably hot."],
  // ---- inevitability & impossibility ----
  ["〜を禁じ得ない","〜をきんじえない","o kinjienai","cannot suppress (a feeling)","涙を禁じ得ない。","なみだをきんじえない。","I cannot hold back my tears."],
  ["〜を余儀なくされる","〜をよぎなくされる","o yogi naku sareru","be forced to","中止を余儀なくされた。","ちゅうしをよぎなくされた。","We were forced to cancel."],
  ["〜ないではいられない","","nai de wa irarenai","cannot help but ~","応援しないではいられない。","おうえんしないではいられない。","I can't help cheering them on."],
  ["〜ずにはおかない","","zu ni wa okanai","be bound to / will surely","観客を感動させずにはおかない。","かんきゃくをかんどうさせずにはおかない。","It's bound to move the audience."],
  ["〜べくもない","","beku mo nai","cannot possibly","素人には知るべくもない。","しろうとにはしるべくもない。","An amateur couldn't possibly know."],
  ["〜に難くない","〜にかたくない","ni katakunai","not hard to / easy to imagine","彼の苦労は想像に難くない。","かれのくろうはそうぞうにかたくない。","His hardship is not hard to imagine."],
  ["〜までもない","","made mo nai","there's no need to","言うまでもないことだ。","いうまでもないことだ。","It goes without saying."],
  ["〜までだ／までのことだ","","made da","I'll simply ~ (if so)","ダメなら諦めるまでだ。","ダメならあきらめるまでだ。","If it fails, I'll simply give up."],
  ["〜ばそれまでだ","","ba sore made da","if ~ then that's the end","壊れたらそれまでだ。","こわれたらそれまでだ。","If it breaks, that's the end of it."],
  ["〜を得ない","〜をえない","o enai","cannot help but (with ざる)","認めざるを得ない。","みとめざるをえない。","I cannot but admit it."],
  // ---- concession & regardless ----
  ["〜であれ","","de are","no matter / whatever it be","理由が何であれ許されない。","りゆうがなんであれゆるされない。","Whatever the reason, it's not allowed."],
  ["〜であろうと","","de arou to","no matter (who/what)","誰であろうと例外はない。","だれであろうとれいがいはない。","No matter who, there are no exceptions."],
  ["〜（よ）うが","","you ga","no matter how / even if","何を言われようが気にしない。","なにをいわれようがきにしない。","No matter what's said, I don't care."],
  ["〜（よ）うが〜まいが","","you ga ~mai ga","whether or not ~","行こうが行くまいが自由だ。","いこうがいくまいがじゆうだ。","Whether you go or not is up to you."],
  ["〜といえども","","to iedomo","even though / although","子供といえども油断できない。","こどもといえどもゆだんできない。","Even though a child, you can't let your guard down."],
  ["〜ところで","","tokoro de","even if ~ (it's useless)","今さら謝ったところで遅い。","いまさらあやまったところでおそい。","Even if you apologize now, it's too late."],
  ["〜ものを","","mono o","if only ~ / and yet","言ってくれれば助けたものを。","いってくれればたすけたものを。","If only you'd said so, I'd have helped."],
  ["〜とはいえ","","to wa ie","although / that said","春とはいえまだ寒い。","はるとはいえまださむい。","Although it's spring, it's still cold."],
  ["〜ながらも","","nagara mo","although / even while","狭いながらも快適だ。","せまいながらもかいてきだ。","Cramped though it is, it's comfortable."],
  ["〜つつも","","tsutsu mo","even while / although","悪いと思いつつも続けた。","わるいとおもいつつもつづけた。","Even while feeling it was wrong, I kept on."],
  // ---- cause, basis & purpose ----
  ["〜がゆえに","","ga yue ni","because of / owing to","若さゆえに無茶をした。","わかさゆえにむちゃをした。","Owing to his youth, he was reckless."],
  ["〜ばこそ","","ba koso","precisely because","努力すればこそ成功する。","どりょくすればこそせいこうする。","It is only through effort that one succeeds."],
  ["〜とあって","","to atte","because (a special situation)","連休とあって混雑している。","れんきゅうとあってこんざつしている。","Because it's a long weekend, it's crowded."],
  ["〜こととて","","koto tote","since / because (apologetic)","慣れぬこととてご容赦を。","なれぬこととてごようしゃを。","As I'm not used to it, please forgive me."],
  ["〜んがため(に)","","n ga tame ni","in order to (literary)","勝たんがために練習する。","かたんがためにれんしゅうする。","He practices in order to win."],
  ["〜べく","","beku","in order to (formal)","真実を知るべく調査した。","しんじつをしるべくちょうさした。","I investigated in order to learn the truth."],
  ["〜まいと","","mai to","so as not to","遅れまいと急いだ。","おくれまいといそいだ。","I hurried so as not to be late."],
  // ---- limitation & exclusivity ----
  ["〜をおいて","","o oite","other than / besides","彼をおいて適任はいない。","かれをおいててきにんはいない。","There's no one suitable other than him."],
  ["〜ならでは","","narade wa","unique to / only ~ can","この店ならではの味だ。","このみせならではのあじだ。","A flavor unique to this shop."],
  ["〜に限る","〜にかぎる","ni kagiru","nothing beats / the best is","夏はビールに限る。","なつはビールにかぎる。","In summer, nothing beats beer."],
  ["〜あっての","","atte no","made possible only by","お客様あっての商売だ。","おきゃくさまあってのしょうばいだ。","Business exists only thanks to customers."],
  ["〜てこそ","","te koso","only after / only by","苦労してこそ成長する。","くろうしてこそせいちょうする。","Only through hardship does one grow."],
  // ---- manner & covering ----
  ["〜ながらに","","nagara ni","while / as (set phrases)","涙ながらに語った。","なみだながらにかたった。","She spoke through her tears."],
  ["〜がてら","","gatera","while also / on the way to","散歩がてら買い物をする。","さんぽがてらかいものをする。","I shop while taking a walk."],
  ["〜かたがた","","katagata","while also (formal)","お礼かたがたご報告します。","おれいかたがたごほうこくします。","I report to you, and to thank you as well."],
  ["〜ずくめ","","zukume","entirely / nothing but","いいことずくめの一年だった。","いいことずくめのいちねんだった。","It was a year of nothing but good things."],
  ["〜まみれ","","mamire","covered in / smeared","汗まみれになって働いた。","あせまみれになってはたらいた。","I worked drenched in sweat."],
  ["〜めく","","meku","take on the air of / -like","日差しが春めいてきた。","ひざしがはるめいてきた。","The sunlight has taken on a spring-like feel."],
  ["〜ぐるみ","","gurumi","involving the whole ~","町ぐるみで祭りを行う。","まちぐるみでまつりをおこなう。","The whole town holds the festival."],
  ["〜きっての","","kitte no","the most ~ in / leading","業界きっての専門家だ。","ぎょうかいきってのせんもんかだ。","He's the industry's leading expert."],
  // ---- addition & parallel ----
  ["〜はおろか","","wa oroka","let alone / not to mention","漢字はおろか平仮名も書けない。","かんじはおろかひらがなもかけない。","Let alone kanji, he can't even write hiragana."],
  ["〜もさることながら","","mo sarinagara","not only ~ but also","味もさることながら見た目も美しい。","あじもさることながらみためもうつくしい。","Not just the taste — the look is beautiful too."],
  ["〜なり〜なり","","nari ~nari","either ~ or ~","電話なりメールなりで連絡して。","でんわなりメールなりでれんらくして。","Contact me by phone or email or whatever."],
  ["〜といい〜といい","","to ii ~to ii","both ~ and ~ (evaluation)","色といいデザインといい素晴らしい。","いろといいデザインといいすばらしい。","Both the color and design are wonderful."],
  ["〜であれ〜であれ","","de are ~de are","whether ~ or ~","晴れであれ雨であれ決行する。","はれであれあめであれけっこうする。","Rain or shine, we'll go ahead."],
  // ---- negation & prohibition ----
  ["〜べからず","","bekarazu","must not (classical, signs)","ここに駐車するべからず。","ここにちゅうしゃするべからず。","Parking forbidden here."],
  ["〜まじき","","majiki","unbefitting / should never","教師にあるまじき行為だ。","きょうしにあるまじきこういだ。","Conduct unbecoming of a teacher."],
  ["〜どころではない","","dokoro de wa nai","not the time/place for","忙しくて旅行どころではない。","いそがしくてりょこうどころではない。","I'm too busy for travel."],
  ["〜ものか","","mono ka","absolutely not / as if ~!","二度と行くものか。","にどといくものか。","I'll never go there again!"],
  ["〜なくして(は)","","naku shite (wa)","without ~ (there's no)","努力なくして成功はない。","どりょくなくしてせいこうはない。","Without effort, there's no success."],
  ["〜ことなしに","","koto nashi ni","without ~ing","誰の助けも借りることなしに完成した。","だれのたすけもかりることなしにかんせいした。","I finished it without anyone's help."],
  ["〜なしには","","nashi ni wa","without ~ (cannot)","涙なしには見られない。","なみだなしにはみられない。","You can't watch it without tears."],
  // ---- classical & literary ----
  ["〜ごとし／ごとく","","gotoshi / gotoku","like / as (classical)","光陰矢のごとし。","こういんやのごとし。","Time flies like an arrow."],
  ["〜べし","","beshi","should / must (classical)","学生は勉学に励むべし。","がくせいはべんがくにはげむべし。","Students should devote themselves to study."],
  ["〜んとする","","n to suru","be about to (literary)","日が暮れんとしている。","ひがくれんとしている。","The day is about to end."],
  ["〜んばかり","","n bakari","almost / as if about to","泣かんばかりの顔だった。","なかんばかりのかおだった。","He had an almost-crying face."],
  ["〜ずして","","zu shite","without ~ing (literary)","努力せずして成功はない。","どりょくせずしてせいこうはない。","There's no success without effort."],
  ["〜にあらず","","ni arazu","is not (classical)","これは夢にあらず現実だ。","これはゆめにあらずげんじつだ。","This is not a dream but reality."],
  ["〜きらいがある","","kirai ga aru","have a (bad) tendency to","物事を悲観的に見るきらいがある。","ものごとをひかんてきにみるきらいがある。","He tends to see things pessimistically."],
  // ---- result & state ----
  ["〜始末だ","〜しまつだ","shimatsu da","end up (badly) / come to","喧嘩までする始末だ。","けんかまでするしまつだ。","It got so bad they even fought."],
  ["〜とばかりに","","to bakari ni","as if to say","早く帰れとばかりに時計を見た。","はやくかえれとばかりにとけいをみた。","He checked his watch as if to say \"go home.\""],
  ["〜と言わんばかり","〜といわんばかり","to iwan bakari","as if to say (almost saying)","邪魔だと言わんばかりの顔だ。","じゃまだといわんばかりのかおだ。","A face that all but says \"you're in the way.\""],
  ["〜とみえて","","to miete","it seems / apparently","疲れていたとみえてすぐ寝た。","つかれていたとみえてすぐねた。","Seemingly tired, he fell asleep at once."],
  ["〜ともなく","","to mo naku","without particular intent","見るともなく外を眺めた。","みるともなくそとをながめた。","I gazed outside without really looking."],
  ["〜かたわら","","katawara","while also / alongside","仕事のかたわら小説を書く。","しごとのかたわらしょうせつをかく。","Alongside my job, I write novels."],
  // ---- judgment & dependence ----
  ["〜いかんで","","ikan de","depending on","結果いかんで方針を変える。","けっかいかんでほうしんをかえる。","Depending on the results, we'll change course."],
  ["〜いかんによらず","","ikan ni yorazu","regardless of","理由のいかんによらず遅刻は遅刻だ。","りゆうのいかんによらずちこくはちこくだ。","Regardless of the reason, late is late."],
  ["〜をものともせず","","o mono to mo sezu","undaunted by","困難をものともせず進んだ。","こんなんをものともせずすすんだ。","Undaunted by hardship, he pressed on."],
  ["〜をよそに","","o yoso ni","ignoring / in defiance of","親の心配をよそに旅に出た。","おやのしんぱいをよそにたびにでた。","Ignoring his parents' worry, he set off."],
  ["〜にもまして","","ni mo mashite","even more than","以前にもまして忙しい。","いぜんにもましていそがしい。","Even busier than before."],
  ["〜ないまでも","","nai made mo","even if not ~, at least","完璧でないまでも最善を尽くす。","かんぺきでないまでもさいぜんをつくす。","Even if not perfect, I do my best."],
  ["〜こそすれ","","koso sure","certainly ~ but (not)","感謝こそすれ恨みはしない。","かんしゃこそすれうらみはしない。","I'm grateful, certainly, but bear no grudge."],
  ["〜たりとも","","tari to mo","not even (one)","一日たりとも忘れない。","いちにちたりともわすれない。","I won't forget for even a single day."],
  // ---- additional staples ----
  ["〜が早いか / なり / や否や (即時)","","sokuji","(immediacy family — see above)","着くなり寝てしまった。","つくなりねてしまった。","The moment he arrived, he fell asleep."],
  ["〜にかこつけて","","ni kakotsukete","under the pretext of","出張にかこつけて観光した。","しゅっちょうにかこつけてかんこうした。","Under the pretext of a business trip, I sightsaw."],
  ["〜をおして","","o oshite","despite / braving","病をおして出席した。","やまいをおしてしゅっせきした。","He attended despite his illness."],
  ["〜であれ何であれ","〜であれなんであれ","de are nan de are","whatever it may be","贈り物であれ何であれ感謝する。","おくりものであれなんであれかんしゃする。","Whatever it is, I'm grateful."],
  ["〜にして初めて","〜にしてはじめて","ni shite hajimete","only when / not until","親になって初めて分かる。","おやになってはじめてわかる。","You understand only once you become a parent."],
  ["〜ないものでもない","","nai mono de mo nai","it's not that ~ can't","やってみれば、できないものでもない。","やってみれば、できないものでもない。","If you try, it's not that you can't do it."],
  ["〜であろうとなかろうと","","de arou to nakarou to","whether or not it is ~","本物であろうとなかろうと関係ない。","ほんものであろうとなかろうとかんけいない。","Whether it's real or not doesn't matter."],
  ["〜ともなしに","","to mo nashi ni","without particular intent","聞くともなしに会話を聞いた。","きくともなしにかいわをきいた。","I overheard the conversation absent-mindedly."],
];
const arr = rows.map(E);
const key = "n1-grammar-all";
const json = JSON.stringify(arr, null, 2);
fs.writeFileSync(path.join(DATA, key + ".json"), json);
fs.writeFileSync(path.join(DATA, key + ".js"),
  `// Auto-generated fallback for file:// (when fetch is blocked). Source: ${key}.json\n` +
  `window.DECKS=window.DECKS||{};\nwindow.DECKS[${JSON.stringify(key)}]=${json};\n`);
console.log(`${key}: ${arr.length} entries`);

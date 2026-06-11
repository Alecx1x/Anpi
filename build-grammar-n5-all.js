// Comprehensive "All N5 Grammar" master deck — the full standardized JLPT N5
// grammar list (particles, copula/adjectives, verb forms, existence, question
// words, comparison). vocab-schema JSON + .js fallback. Run: node build-grammar-n5-all.js
const fs = require("fs");
const path = require("path");
const DATA = path.join(__dirname, "data");
const E = (a) => ({
  word: a[0], reading: a[1] || "", romaji: a[2] || "", meaning: a[3] || "",
  partOfSpeech: "Grammar", exampleSentence: a[4] || "", exampleReading: a[5] || "",
  exampleMeaning: a[6] || "", level: "N5",
});
const rows = [
  // ---- particles ----
  ["〜は","","wa","topic marker (\"as for ~\")","私は田中です。","わたしはたなかです。","I am Tanaka."],
  ["〜が","","ga","subject marker","庭に猫がいます。","にわにねこがいます。","There is a cat in the garden."],
  ["〜を","","o","direct-object marker","毎日本を読みます。","まいにちほんをよみます。","I read a book every day."],
  ["〜に (時・場所)","","ni","at / in / on (time, location, destination)","七時に起きます。","しちじにおきます。","I get up at seven."],
  ["〜へ","","e","to / toward (direction)","学校へ行きます。","がっこうへいきます。","I go to school."],
  ["〜で (場所)","","de","at / in (place of an action)","公園で遊びます。","こうえんであそびます。","I play in the park."],
  ["〜で (手段)","","de","by / with (means)","電車で行きます。","でんしゃでいきます。","I go by train."],
  ["〜と","","to","and / with","パンと卵を買う。","パンとたまごをかう。","I buy bread and eggs."],
  ["〜の","","no","possessive / of","これは私の本です。","これはわたしのほんです。","This is my book."],
  ["〜も","","mo","also / too","私も行きます。","わたしもいきます。","I'll go too."],
  ["〜や","","ya","and (a partial list)","ペンやノートを買う。","ペンやノートをかう。","I buy pens, notebooks, and so on."],
  ["〜から (起点・理由)","","kara","from / because","授業は九時から始まる。","じゅぎょうはくじからはじまる。","Class starts from nine."],
  ["〜まで","","made","until / up to","五時まで働く。","ごじまではたらく。","I work until five."],
  ["〜か","","ka","question marker","学生ですか。","がくせいですか。","Are you a student?"],
  ["〜ね","","ne","\"right? / isn't it?\"","いい天気ですね。","いいてんきですね。","Nice weather, isn't it?"],
  ["〜よ","","yo","\"you know\" (emphasis / new info)","明日は休みですよ。","あしたはやすみですよ。","Tomorrow is a day off, you know."],
  ["〜が (逆接)","","ga","but / however","高いですが、買います。","たかいですが、かいます。","It's expensive, but I'll buy it."],
  ["〜だけ","","dake","only / just","少しだけください。","すこしだけください。","Just a little, please."],
  ["〜ぐらい／くらい","","gurai / kurai","about / approximately","三十分ぐらい待つ。","さんじゅっぷんぐらいまつ。","I'll wait about thirty minutes."],
  ["〜ずつ","","zutsu","each / apiece","一つずつ取る。","ひとつずつとる。","Take one each."],
  ["〜しか〜ない","","shika ~nai","only (with a negative)","百円しかない。","ひゃくえんしかない。","I only have a hundred yen."],
  ["〜でも","","demo","~ or something / even","お茶でも飲みましょう。","おちゃでものみましょう。","Let's have some tea or something."],
  ["〜など","","nado","and so on / etc.","果物などを買う。","くだものなどをかう。","I buy fruit and such."],
  ["〜ながら","","nagara","while (doing two things)","歌いながら歩く。","うたいながらあるく。","I walk while singing."],
  // ---- copula & adjectives ----
  ["〜です","","desu","\"to be\" (polite copula)","これはペンです。","これはペンです。","This is a pen."],
  ["〜でした","","deshita","\"was\" (polite past)","昨日は雨でした。","きのうはあめでした。","It was rainy yesterday."],
  ["〜じゃない／ではない","","ja nai / dewa nai","\"is not\"","これは私の本じゃない。","これはわたしのほんじゃない。","This is not my book."],
  ["い-形容詞","","i-keiyoushi","i-adjective (ends in 〜い)","この本は面白い。","このほんはおもしろい。","This book is interesting."],
  ["〜かった","","katta","i-adjective past (\"was ~\")","映画は面白かった。","えいがはおもしろかった。","The movie was interesting."],
  ["〜くない","","kunai","i-adjective negative (\"not ~\")","今日は寒くない。","きょうはさむくない。","It's not cold today."],
  ["な-形容詞","","na-keiyoushi","na-adjective (〜な + noun)","静かな部屋です。","しずかなへやです。","It's a quiet room."],
  ["〜くて／〜で","","kute / de","adjective te-form (linking)","この店は安くておいしい。","このみせはやすくておいしい。","This shop is cheap and tasty."],
  ["〜くなる／〜になる","","ku naru / ni naru","become ~","春は暖かくなる。","はるはあたたかくなる。","It gets warm in spring."],
  // ---- verbs ----
  ["〜ます","","masu","polite verb ending","毎日勉強します。","まいにちべんきょうします。","I study every day."],
  ["〜ました","","mashita","polite past","昨日映画を見ました。","きのうえいがをみました。","I watched a movie yesterday."],
  ["〜ません","","masen","polite negative","お酒を飲みません。","おさけをのみません。","I don't drink alcohol."],
  ["〜ませんでした","","masen deshita","polite past negative","昨日は行きませんでした。","きのうはいきませんでした。","I didn't go yesterday."],
  ["〜に行く","〜にいく","ni iku","go in order to do","映画を見に行く。","えいがをみにいく。","I go to see a movie."],
  ["〜たい","","tai","want to (do)","冷たい水が飲みたい。","つめたいみずがのみたい。","I want to drink cold water."],
  ["〜ましょう","","mashou","let's ~","一緒に行きましょう。","いっしょにいきましょう。","Let's go together."],
  ["〜ましょうか","","mashou ka","shall I / shall we?","窓を開けましょうか。","まどをあけましょうか。","Shall I open the window?"],
  ["〜ませんか","","masen ka","won't you ~? (invitation)","お茶を飲みませんか。","おちゃをのみませんか。","Won't you have some tea?"],
  ["〜てください","","te kudasai","please do ~","名前を書いてください。","なまえをかいてください。","Please write your name."],
  ["〜ている","","te iru","be ~ing (progressive / state)","今、本を読んでいる。","いま、ほんをよんでいる。","I'm reading a book now."],
  ["〜てから","","te kara","after doing ~","食べてから出かける。","たべてからでかける。","I go out after eating."],
  ["〜てもいいです","","te mo ii desu","may / it's okay to","入ってもいいですか。","はいってもいいですか。","May I come in?"],
  ["〜てはいけません","","te wa ikemasen","must not","ここで遊んではいけません。","ここであそんではいけません。","You must not play here."],
  ["〜ないでください","","naide kudasai","please don't ~","写真を撮らないでください。","しゃしんをとらないでください。","Please don't take photos."],
  ["〜なければなりません","","nakereba narimasen","must / have to","薬を飲まなければなりません。","くすりをのまなければなりません。","I have to take my medicine."],
  ["〜なくてもいいです","","nakute mo ii desu","don't have to","急がなくてもいいです。","いそがなくてもいいです。","You don't have to hurry."],
  ["〜前に","〜まえに","mae ni","before ~","寝る前に歯を磨く。","ねるまえにはをみがく。","I brush my teeth before bed."],
  ["〜た後で","〜たあとで","ta ato de","after ~","食べた後で散歩する。","たべたあとでさんぽする。","I take a walk after eating."],
  ["〜とき","","toki","when ~","子供のとき、よく泣いた。","こどものとき、よくないた。","When I was a child, I cried a lot."],
  ["〜ことができる","","koto ga dekiru","can / be able to","ピアノを弾くことができる。","ピアノをひくことができる。","I can play the piano."],
  ["〜のが好き／上手","〜のがすき／じょうず","no ga suki / jouzu","like / be good at doing","歌うのが好きです。","うたうのがすきです。","I like singing."],
  ["辞書形 (普通形)","じしょけい","jishokei","dictionary / plain form","友達と日本語を話す。","ともだちとにほんごをはなす。","I speak Japanese with my friend."],
  ["〜た (普通・過去)","","ta","plain past","昨日、友達に会った。","きのう、ともだちにあった。","I met a friend yesterday."],
  ["〜ない (普通・否定)","","nai","plain negative","今日は行かない。","きょうはいかない。","I'm not going today."],
  ["〜たり〜たり","","tari ~tari","do things like ~ and ~","読んだり書いたりする。","よんだりかいたりする。","I do things like reading and writing."],
  // ---- existence & possession ----
  ["ある","","aru","there is (inanimate)","机の上に本がある。","つくえのうえにほんがある。","There is a book on the desk."],
  ["いる","","iru","there is (animate)","部屋に猫がいる。","へやにねこがいる。","There is a cat in the room."],
  ["〜は〜があります","","wa ~ ga arimasu","\"~ has ~\"","私は車があります。","わたしはくるまがあります。","I have a car."],
  // ---- demonstratives & question words ----
  ["これ／それ／あれ／どれ","","kore / sore / are / dore","this / that / that over there / which","これは何ですか。","これはなんですか。","What is this?"],
  ["この／その／あの／どの","","kono / sono / ano / dono","this/that/which + noun","この本は私のです。","このほんはわたしのです。","This book is mine."],
  ["ここ／そこ／あそこ／どこ","","koko / soko / asoko / doko","here / there / over there / where","トイレはどこですか。","トイレはどこですか。","Where is the toilet?"],
  ["何 (なに／なん)","なに／なん","nani / nan","what","それは何ですか。","それはなんですか。","What is that?"],
  ["誰 (だれ)","だれ","dare","who","あの人は誰ですか。","あのひとはだれですか。","Who is that person?"],
  ["いつ","","itsu","when","試験はいつですか。","しけんはいつですか。","When is the exam?"],
  ["どう","","dou","how / how about","味はどうですか。","あじはどうですか。","How does it taste?"],
  ["どうして／なぜ","","doushite / naze","why","どうして遅れたんですか。","どうしておくれたんですか。","Why were you late?"],
  ["いくら","","ikura","how much (price)","これはいくらですか。","これはいくらですか。","How much is this?"],
  ["いくつ","","ikutsu","how many / how old","卵はいくつ要りますか。","たまごはいくついりますか。","How many eggs do you need?"],
  ["どんな","","donna","what kind of","どんな映画が好きですか。","どんなえいががすきですか。","What kind of movies do you like?"],
  // ---- comparison & misc ----
  ["〜より〜の方が","〜より〜のほうが","yori ~ no hou ga","~ is more ~ than ~","電車より車の方が速い。","でんしゃよりくるまのほうがはやい。","Cars are faster than trains."],
  ["〜で一番","〜でいちばん","de ichiban","the most ~ in / of","クラスで一番背が高い。","クラスでいちばんせがたかい。","He's the tallest in the class."],
  ["〜と同じ","〜とおなじ","to onaji","the same as","私のと同じかばんだ。","わたしのとおなじかばんだ。","It's the same bag as mine."],
  ["もう","","mou","already","もう昼ご飯を食べました。","もうひるごはんをたべました。","I've already eaten lunch."],
  ["まだ","","mada","still / not yet","宿題はまだ終わっていません。","しゅくだいはまだおわっていません。","My homework isn't finished yet."],
  ["〜でしょう","","deshou","probably / ~ right?","明日は晴れるでしょう。","あしたははれるでしょう。","It'll probably be sunny tomorrow."],
  ["〜が欲しい","〜がほしい","ga hoshii","want (something)","新しい靴が欲しい。","あたらしいくつがほしい。","I want new shoes."],
  ["〜つもり","","tsumori","intend to / plan to","明日勉強するつもりです。","あしたべんきょうするつもりです。","I intend to study tomorrow."],
];
const arr = rows.map(E);
const key = "n5-grammar-all";
const json = JSON.stringify(arr, null, 2);
fs.writeFileSync(path.join(DATA, key + ".json"), json);
fs.writeFileSync(path.join(DATA, key + ".js"),
  `// Auto-generated fallback for file:// (when fetch is blocked). Source: ${key}.json\n` +
  `window.DECKS=window.DECKS||{};\nwindow.DECKS[${JSON.stringify(key)}]=${json};\n`);
console.log(`${key}: ${arr.length} entries`);

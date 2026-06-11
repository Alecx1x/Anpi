// Generates N3 "coming soon" study decks (Grammar Patterns, Verb Forms,
// Keigo Introduction, Phrases) as vocab-schema JSON + .js fallbacks for file://.
// Mirrors build-n4-extra.js. Run: node build-n3-extra.js
const fs = require("fs");
const path = require("path");
const DATA = path.join(__dirname, "data");

const E = (a) => ({
  word: a[0], reading: a[1] || "", romaji: a[2] || "", meaning: a[3] || "",
  partOfSpeech: a[4] || "", exampleSentence: a[5] || "", exampleReading: a[6] || "",
  exampleMeaning: a[7] || "", level: "N3",
});

const SETS = {
  // ---------------- Grammar Patterns ----------------
  "n3-grammar-all": [
    ["〜ようになる", "", "you ni naru", "come to / reach the point where", "Grammar", "日本語が話せるようになった。", "にほんごがはなせるようになった。", "I've become able to speak Japanese."],
    ["〜ことにする", "", "koto ni suru", "decide to (one's own choice)", "Grammar", "毎朝走ることにした。", "まいあさはしることにした。", "I decided to run every morning."],
    ["〜ことになる", "", "koto ni naru", "it has been decided that", "Grammar", "来月転勤することになった。", "らいげつてんきんすることになった。", "It's been decided I'll transfer next month."],
    ["〜はずだ", "", "hazu da", "should / be supposed to", "Grammar", "彼はもう着いたはずだ。", "かれはもうついたはずだ。", "He should have already arrived."],
    ["〜らしい", "", "rashii", "seems / apparently", "Grammar", "田中さんは結婚するらしい。", "たなかさんはけっこんするらしい。", "Apparently Mr. Tanaka is getting married."],
    ["〜みたいに", "", "mitai ni", "like / similar to", "Grammar", "子供みたいに笑う。", "こどもみたいにわらう。", "He laughs like a child."],
    ["〜ために", "", "tame ni", "in order to / for", "Grammar", "健康のために運動する。", "けんこうのためにうんどうする。", "I exercise for my health."],
    ["〜という", "", "to iu", "called / named", "Grammar", "「さくら」という店に行った。", "「さくら」というみせにいった。", "I went to a shop called Sakura."],
    ["〜まま", "", "mama", "as is / leaving as it is", "Grammar", "電気をつけたまま寝た。", "でんきをつけたままねた。", "I slept with the lights on."],
    ["〜ところだ", "", "tokoro da", "about to / in the middle of", "Grammar", "今から出かけるところだ。", "いまからでかけるところだ。", "I'm just about to go out."],
  ],
  "n3-grammar-compound": [
    ["〜し、〜し", "", "shi ... shi", "and (listing reasons)", "Grammar", "安いし、おいしいし、よく行く。", "やすいし、おいしいし、よくいく。", "It's cheap and tasty, so I go often."],
    ["〜ば〜ほど", "", "ba ... hodo", "the more ~, the more ~", "Grammar", "考えれば考えるほど分からない。", "かんがえればかんがえるほどわからない。", "The more I think, the less I understand."],
    ["〜のに", "", "noni", "despite / although", "Grammar", "約束したのに来なかった。", "やくそくしたのにこなかった。", "Although he promised, he didn't come."],
    ["〜ても", "", "te mo", "even if / no matter how", "Grammar", "どんなに難しくても諦めない。", "どんなにむずかしくてもあきらめない。", "No matter how hard, I won't give up."],
    ["〜ながらも", "", "nagara mo", "even though / while", "Grammar", "知っていながらも黙っていた。", "しっていながらもだまっていた。", "Even though I knew, I stayed silent."],
    ["それに", "", "soreni", "moreover / besides", "Grammar", "安い。それに、駅に近い。", "やすい。それに、えきにちかい。", "It's cheap. Moreover, it's near the station."],
    ["そのため", "", "sono tame", "therefore / for that reason", "Grammar", "雪が降った。そのため電車が遅れた。", "ゆきがふった。そのためでんしゃがおくれた。", "It snowed; therefore the train was late."],
    ["〜たり〜たり", "", "tari ... tari", "do things like ~ and ~", "Grammar", "週末は読んだり書いたりする。", "しゅうまつはよんだりかいたりする。", "On weekends I do things like read and write."],
    ["〜うちに", "", "uchi ni", "while / before (it changes)", "Grammar", "若いうちに勉強しなさい。", "わかいうちにべんきょうしなさい。", "Study while you're young."],
  ],
  "n3-grammar-nuance": [
    ["〜かもしれない", "", "kamoshirenai", "might / maybe", "Grammar", "遅れるかもしれない。", "おくれるかもしれない。", "I might be late."],
    ["〜に違いない", "〜にちがいない", "ni chigainai", "must be / no doubt", "Grammar", "彼が犯人に違いない。", "かれがはんにんにちがいない。", "He must be the culprit."],
    ["〜そうだ", "", "sou da", "I heard that (hearsay)", "Grammar", "来週は雨だそうだ。", "らいしゅうはあめだそうだ。", "I heard it'll rain next week."],
    ["〜ようだ", "", "you da", "it seems / appears", "Grammar", "誰もいないようだ。", "だれもいないようだ。", "It seems no one is here."],
    ["〜わけだ", "", "wake da", "no wonder / that's why", "Grammar", "道理で寒いわけだ。", "どうりでさむいわけだ。", "No wonder it's cold."],
    ["〜はずがない", "", "hazu ga nai", "can't possibly", "Grammar", "彼が嘘をつくはずがない。", "かれがうそをつくはずがない。", "There's no way he'd lie."],
    ["〜べきだ", "", "beki da", "should / ought to", "Grammar", "もっと努力するべきだ。", "もっとどりょくするべきだ。", "You should try harder."],
    ["〜かどうか", "", "ka dou ka", "whether or not", "Grammar", "来るかどうか分からない。", "くるかどうかわからない。", "I don't know whether he'll come."],
    ["〜ものだ", "", "mono da", "it's the way things are", "Grammar", "時間は早く過ぎるものだ。", "じかんははやくすぎるものだ。", "Time passes quickly (as it tends to)."],
  ],

  // ---------------- Verb Forms ----------------
  "n3-verbs-passive": [
    ["呼ばれる", "よばれる", "yobareru", "to be called", "Verb (passive)", "名前を呼ばれた。", "なまえをよばれた。", "My name was called."],
    ["褒められる", "ほめられる", "homerareru", "to be praised", "Verb (passive)", "先生に褒められた。", "せんせいにほめられた。", "I was praised by the teacher."],
    ["叱られる", "しかられる", "shikarareru", "to be scolded", "Verb (passive)", "母に叱られた。", "ははにしかられた。", "I was scolded by my mother."],
    ["盗まれる", "ぬすまれる", "nusumareru", "to have (something) stolen", "Verb (passive)", "財布を盗まれた。", "さいふをぬすまれた。", "My wallet was stolen."],
    ["作られる", "つくられる", "tsukurareru", "to be made", "Verb (passive)", "この車は日本で作られた。", "このくるまはにほんでつくられた。", "This car was made in Japan."],
    ["建てられる", "たてられる", "taterareru", "to be built", "Verb (passive)", "駅前に新しいビルが建てられた。", "えきまえにあたらしいビルがたてられた。", "A new building was built in front of the station."],
    ["招待される", "しょうたいされる", "shoutai sareru", "to be invited", "Verb (passive)", "パーティーに招待された。", "パーティーにしょうたいされた。", "I was invited to the party."],
    ["踏まれる", "ふまれる", "fumareru", "to get stepped on (suffering)", "Verb (passive)", "電車で足を踏まれた。", "でんしゃであしをふまれた。", "My foot got stepped on in the train."],
    ["言われる", "いわれる", "iwareru", "to be told / said", "Verb (passive)", "そう言われると困る。", "そういわれるとこまる。", "When I'm told that, I'm troubled."],
  ],
  "n3-verbs-causative": [
    ["食べさせる", "たべさせる", "tabesaseru", "to make / let eat", "Verb (causative)", "子供に野菜を食べさせる。", "こどもにやさいをたべさせる。", "I make my child eat vegetables."],
    ["待たせる", "またせる", "mataseru", "to make (someone) wait", "Verb (causative)", "友達を待たせてしまった。", "ともだちをまたせてしまった。", "I kept my friend waiting."],
    ["行かせる", "いかせる", "ikaseru", "to let / make go", "Verb (causative)", "息子を留学に行かせる。", "むすこをりゅうがくにいかせる。", "I'll let my son go study abroad."],
    ["休ませる", "やすませる", "yasumaseru", "to let (someone) rest", "Verb (causative)", "病気の社員を休ませた。", "びょうきのしゃいんをやすませた。", "I let the sick employee rest."],
    ["笑わせる", "わらわせる", "warawaseru", "to make (someone) laugh", "Verb (causative)", "彼はみんなを笑わせた。", "かれはみんなをわらわせた。", "He made everyone laugh."],
    ["覚えさせる", "おぼえさせる", "oboesaseru", "to make (someone) memorize", "Verb (causative)", "学生に単語を覚えさせる。", "がくせいにたんごをおぼえさせる。", "I make the students memorize words."],
    ["心配させる", "しんぱいさせる", "shinpai saseru", "to make (someone) worry", "Verb (causative)", "親を心配させた。", "おやをしんぱいさせた。", "I made my parents worry."],
    ["手伝わせる", "てつだわせる", "tetsudawaseru", "to make (someone) help", "Verb (causative)", "弟に宿題を手伝わせた。", "おとうとにしゅくだいをてつだわせた。", "I made my brother help with homework."],
  ],
  "n3-verbs-causative-passive": [
    ["待たせられる", "またせられる", "mataserareru", "to be made to wait", "Verb (caus-passive)", "一時間も待たせられた。", "いちじかんもまたせられた。", "I was made to wait a whole hour."],
    ["食べさせられる", "たべさせられる", "tabesaserareru", "to be made to eat", "Verb (caus-passive)", "嫌いな物を食べさせられた。", "きらいなものをたべさせられた。", "I was made to eat food I dislike."],
    ["飲まされる", "のまされる", "nomasareru", "to be made to drink", "Verb (caus-passive)", "お酒を飲まされた。", "おさけをのまされた。", "I was made to drink alcohol."],
    ["働かされる", "はたらかされる", "hatarakasareru", "to be made to work", "Verb (caus-passive)", "遅くまで働かされた。", "おそくまではたらかされた。", "I was made to work until late."],
    ["勉強させられる", "べんきょうさせられる", "benkyou saserareru", "to be made to study", "Verb (caus-passive)", "親に勉強させられた。", "おやにべんきょうさせられた。", "I was made to study by my parents."],
    ["歌わされる", "うたわされる", "utawasareru", "to be made to sing", "Verb (caus-passive)", "カラオケで歌わされた。", "カラオケでうたわされた。", "I was made to sing at karaoke."],
    ["立たされる", "たたされる", "tatasareru", "to be made to stand", "Verb (caus-passive)", "廊下に立たされた。", "ろうかにたたされた。", "I was made to stand in the hallway."],
    ["行かせられる", "いかせられる", "ikaserareru", "to be made to go", "Verb (caus-passive)", "急な出張に行かせられた。", "きゅうなしゅっちょうにいかせられた。", "I was made to go on a sudden business trip."],
  ],

  // ---------------- Keigo — Introduction ----------------
  "n3-keigo-teineigo": [
    ["ございます", "", "gozaimasu", "polite 'to be / there is'", "Keigo", "ありがとうございます。", "ありがとうございます。", "Thank you very much."],
    ["〜でございます", "", "de gozaimasu", "polite 'is' (formal です)", "Keigo", "こちらが会議室でございます。", "こちらがかいぎしつでございます。", "This is the meeting room."],
    ["よろしいですか", "", "yoroshii desu ka", "is it alright? (polite)", "Keigo", "こちらでよろしいですか。", "こちらでよろしいですか。", "Is this alright?"],
    ["〜ていただけますか", "", "te itadakemasu ka", "could you please ~?", "Keigo", "確認していただけますか。", "かくにんしていただけますか。", "Could you please confirm?"],
    ["申し訳ございません", "もうしわけございません", "moushiwake gozaimasen", "I'm very sorry", "Keigo", "ご迷惑をおかけし、申し訳ございません。", "ごめいわくをおかけし、もうしわけございません。", "I'm sorry for the trouble caused."],
    ["失礼します", "しつれいします", "shitsurei shimasu", "excuse me (entering/leaving)", "Keigo", "失礼します。入ってもよろしいですか。", "しつれいします。はいってもよろしいですか。", "Excuse me. May I come in?"],
    ["かしこまりました", "", "kashikomarimashita", "certainly / understood (polite)", "Keigo", "かしこまりました。すぐにお持ちします。", "かしこまりました。すぐにおもちします。", "Certainly. I'll bring it right away."],
    ["少々お待ちください", "しょうしょうおまちください", "shoushou o-machi kudasai", "please wait a moment (polite)", "Keigo", "少々お待ちください。", "しょうしょうおまちください。", "Please wait a moment."],
  ],
  "n3-keigo-honorifics": [
    ["いらっしゃる", "", "irassharu", "to be / come / go (honorific)", "Keigo", "社長は今いらっしゃいますか。", "しゃちょうはいまいらっしゃいますか。", "Is the president in right now?"],
    ["おっしゃる", "", "ossharu", "to say (honorific)", "Keigo", "先生がそうおっしゃいました。", "せんせいがそうおっしゃいました。", "The teacher said so."],
    ["召し上がる", "めしあがる", "meshiagaru", "to eat / drink (honorific)", "Keigo", "どうぞ召し上がってください。", "どうぞめしあがってください。", "Please eat."],
    ["ご覧になる", "ごらんになる", "goran ni naru", "to see / look (honorific)", "Keigo", "こちらをご覧ください。", "こちらをごらんください。", "Please look at this."],
    ["なさる", "", "nasaru", "to do (honorific)", "Keigo", "お飲み物は何になさいますか。", "おのみものはなんになさいますか。", "What would you like to drink?"],
    ["お〜になる", "", "o ... ni naru", "honorific verb pattern", "Keigo", "先生がお帰りになります。", "せんせいがおかえりになります。", "The teacher is going home."],
    ["ご存じ", "ごぞんじ", "go-zonji", "to know (honorific)", "Keigo", "その件をご存じですか。", "そのけんをごぞんじですか。", "Do you know about that matter?"],
    ["くださる", "", "kudasaru", "to give (to me, honorific)", "Keigo", "先生が本をくださった。", "せんせいがほんをくださった。", "The teacher kindly gave me a book."],
  ],

  // ---------------- Phrases & Expressions ----------------
  "n3-phrases-formal": [
    ["お世話になっております", "おせわになっております", "o-sewa ni natte orimasu", "thank you for your support", "Expression", "いつもお世話になっております。", "いつもおせわになっております。", "Thank you for your continued support."],
    ["よろしくお願いいたします", "よろしくおねがいいたします", "yoroshiku onegai itashimasu", "I look forward to working with you", "Expression", "どうぞよろしくお願いいたします。", "どうぞよろしくおねがいいたします。", "I look forward to working with you."],
    ["恐れ入りますが", "おそれいりますが", "osore irimasu ga", "I'm sorry to trouble you, but", "Expression", "恐れ入りますが、お名前を伺えますか。", "おそれいりますが、おなまえをうかがえますか。", "Excuse me, but may I have your name?"],
    ["承知しました", "しょうちしました", "shouchi shimashita", "understood / certainly (formal)", "Expression", "承知しました。対応いたします。", "しょうちしました。たいおういたします。", "Understood. I'll handle it."],
    ["失礼いたします", "しつれいいたします", "shitsurei itashimasu", "excuse me (very formal)", "Expression", "それでは、失礼いたします。", "それでは、しつれいいたします。", "Well then, please excuse me."],
    ["いかがでしょうか", "", "ikaga deshou ka", "how is it? (polite)", "Expression", "こちらの案はいかがでしょうか。", "こちらのあんはいかがでしょうか。", "How about this proposal?"],
    ["大変申し訳ございません", "たいへんもうしわけございません", "taihen moushiwake gozaimasen", "I deeply apologize", "Expression", "この度は大変申し訳ございません。", "このたびはたいへんもうしわけございません。", "I deeply apologize for this matter."],
    ["お手数ですが", "おてすうですが", "o-tesuu desu ga", "sorry to bother you, but", "Expression", "お手数ですが、ご確認ください。", "おてすうですが、ごかくにんください。", "Sorry to trouble you, but please check."],
  ],
  "n3-phrases-feelings": [
    ["嬉しいです", "うれしいです", "ureshii desu", "I'm happy", "Expression", "合格して嬉しいです。", "ごうかくしてうれしいです。", "I'm happy I passed."],
    ["楽しみにしています", "たのしみにしています", "tanoshimi ni shite imasu", "I'm looking forward to it", "Expression", "お会いするのを楽しみにしています。", "おあいするのをたのしみにしています。", "I'm looking forward to meeting you."],
    ["残念です", "ざんねんです", "zannen desu", "that's too bad / a shame", "Expression", "行けなくて残念です。", "いけなくてざんねんです。", "It's a shame I can't go."],
    ["感動しました", "かんどうしました", "kandou shimashita", "I was moved / touched", "Expression", "その映画に感動しました。", "そのえいがにかんどうしました。", "I was moved by that movie."],
    ["びっくりしました", "", "bikkuri shimashita", "I was surprised", "Expression", "急な知らせにびっくりしました。", "きゅうなしらせにびっくりしました。", "I was surprised by the sudden news."],
    ["がっかりしました", "", "gakkari shimashita", "I was disappointed", "Expression", "結果にがっかりしました。", "けっかにがっかりしました。", "I was disappointed by the result."],
    ["心配です", "しんぱいです", "shinpai desu", "I'm worried", "Expression", "試験のことが心配です。", "しけんのことがしんぱいです。", "I'm worried about the exam."],
    ["ほっとしました", "", "hotto shimashita", "I'm relieved", "Expression", "無事だと聞いてほっとしました。", "ぶじだときいてほっとしました。", "I was relieved to hear you're safe."],
    ["感謝しています", "かんしゃしています", "kansha shite imasu", "I'm grateful", "Expression", "心から感謝しています。", "こころからかんしゃしています。", "I'm sincerely grateful."],
  ],
  "n3-phrases-connecting": [
    ["まず", "", "mazu", "first of all", "Expression", "まず、自己紹介をします。", "まず、じこしょうかいをします。", "First, I'll introduce myself."],
    ["次に", "つぎに", "tsugi ni", "next", "Expression", "次に、計画を説明します。", "つぎに、けいかくをせつめいします。", "Next, I'll explain the plan."],
    ["それから", "", "sorekara", "and then / after that", "Expression", "買い物をして、それから帰った。", "かいものをして、それからかえった。", "I went shopping, and then went home."],
    ["しかし", "", "shikashi", "however", "Expression", "しかし、一つ問題があります。", "しかし、ひとつもんだいがあります。", "However, there's one problem."],
    ["つまり", "", "tsumari", "in other words / that is", "Expression", "つまり、無理ということです。", "つまり、むりということです。", "In other words, it's impossible."],
    ["例えば", "たとえば", "tatoeba", "for example", "Expression", "例えば、これはどうですか。", "たとえば、これはどうですか。", "For example, how about this?"],
    ["ところで", "", "tokorode", "by the way", "Expression", "ところで、週末は暇ですか。", "ところで、しゅうまつはひまですか。", "By the way, are you free this weekend?"],
    ["最後に", "さいごに", "saigo ni", "finally / lastly", "Expression", "最後に、お礼を申し上げます。", "さいごに、おれいをもうしあげます。", "Finally, I'd like to express my thanks."],
    ["だから", "", "dakara", "so / therefore", "Expression", "雨だ。だから、出かけない。", "あめだ。だから、でかけない。", "It's raining. So, I won't go out."],
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

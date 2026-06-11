// Populates the verb-conjugation study decks (N4 te/ta/nai/potential,
// N3 passive/causative/causative-passive). A conjugation engine generates each
// form from the dictionary verb so the Japanese is guaranteed correct; meanings
// and example sentences are authored per row.
// vocab-schema JSON + .js fallback for file://. Run: node build-verbs-forms.js
const fs = require("fs");
const path = require("path");
const DATA = path.join(__dirname, "data");

// ---- hiragana -> romaji (Hepburn) ----
const KMAP = {
  あ:"a",い:"i",う:"u",え:"e",お:"o",
  か:"ka",き:"ki",く:"ku",け:"ke",こ:"ko", が:"ga",ぎ:"gi",ぐ:"gu",げ:"ge",ご:"go",
  さ:"sa",し:"shi",す:"su",せ:"se",そ:"so", ざ:"za",じ:"ji",ず:"zu",ぜ:"ze",ぞ:"zo",
  た:"ta",ち:"chi",つ:"tsu",て:"te",と:"to", だ:"da",ぢ:"ji",づ:"zu",で:"de",ど:"do",
  な:"na",に:"ni",ぬ:"nu",ね:"ne",の:"no",
  は:"ha",ひ:"hi",ふ:"fu",へ:"he",ほ:"ho", ば:"ba",び:"bi",ぶ:"bu",べ:"be",ぼ:"bo",
  ぱ:"pa",ぴ:"pi",ぷ:"pu",ぺ:"pe",ぽ:"po",
  ま:"ma",み:"mi",む:"mu",め:"me",も:"mo", や:"ya",ゆ:"yu",よ:"yo",
  ら:"ra",り:"ri",る:"ru",れ:"re",ろ:"ro", わ:"wa",を:"o",ん:"n",ー:"",
};
const YMAP = {
  きゃ:"kya",きゅ:"kyu",きょ:"kyo", しゃ:"sha",しゅ:"shu",しょ:"sho",
  ちゃ:"cha",ちゅ:"chu",ちょ:"cho", にゃ:"nya",にゅ:"nyu",にょ:"nyo",
  ひゃ:"hya",ひゅ:"hyu",ひょ:"hyo", みゃ:"mya",みゅ:"myu",みょ:"myo",
  りゃ:"rya",りゅ:"ryu",りょ:"ryo", ぎゃ:"gya",ぎゅ:"gyu",ぎょ:"gyo",
  じゃ:"ja",じゅ:"ju",じょ:"jo", びゃ:"bya",びゅ:"byu",びょ:"byo", ぴゃ:"pya",ぴゅ:"pyu",ぴょ:"pyo",
};
function romanize(s) {
  let out = "", dbl = false;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "っ") { dbl = true; continue; }
    let tok = "";
    const pair = s[i] + (s[i + 1] || "");
    if (YMAP[pair]) { tok = YMAP[pair]; i++; }
    else if (KMAP[s[i]]) { tok = KMAP[s[i]]; }
    else { tok = s[i]; }
    if (dbl && tok) { tok = (tok.slice(0, 2) === "ch" ? "t" : tok[0]) + tok; dbl = false; }
    out += tok;
  }
  return out;
}

// ---- conjugation engine ----
// a-row (negative/passive/causative stem) and e-row (potential) for godan finals
const AROW = { う:"わ",く:"か",ぐ:"が",す:"さ",つ:"た",ぬ:"な",ぶ:"ば",む:"ま",る:"ら" };
const EROW = { う:"え",く:"け",ぐ:"げ",す:"せ",つ:"て",ぬ:"ね",ぶ:"べ",む:"め",る:"れ" };
function teSuffix(lk) {
  if ("うつる".includes(lk)) return "って";
  if ("ぬぶむ".includes(lk)) return "んで";
  if (lk === "く") return "いて";
  if (lk === "ぐ") return "いで";
  if (lk === "す") return "して";
  return "って";
}
// returns the kana suffix to append after the stem (stem = word minus final kana)
function godanSuffix(form, lk, isIku) {
  switch (form) {
    case "te":  return isIku ? "って" : teSuffix(lk);
    case "ta":  return (isIku ? "って" : teSuffix(lk)).replace("て", "た").replace("で", "だ");
    case "nai": return AROW[lk] + "ない";
    case "pot": return EROW[lk] + "る";
    case "pass":return AROW[lk] + "れる";
    case "caus":return AROW[lk] + "せる";
    case "cpas":return AROW[lk] + "せられる";
  }
}
const ICHI = { te:"て", ta:"た", nai:"ない", pot:"られる", pass:"られる", caus:"させる", cpas:"させられる" };
const SURU = { te:"して", ta:"した", nai:"しない", pot:"できる", pass:"される", caus:"させる", cpas:"させられる" };
// 来る: [reading-stem, suffix] per form (kanji is always 来 + suffix)
const KURU = {
  te:["き","て"], ta:["き","た"], nai:["こ","ない"], pot:["こ","られる"],
  pass:["こ","られる"], caus:["こ","させる"], cpas:["こ","させられる"],
};
function conjugate(kanji, reading, type, form) {
  let word, read;
  if (type === "k") { // 来る
    const [rs, suf] = KURU[form];
    word = "来" + suf; read = rs + suf;
  } else if (type === "s") { // ～する (incl. plain する)
    const suf = SURU[form];
    word = kanji.slice(0, -2) + suf; read = reading.slice(0, -2) + suf;
  } else if (type === "i") { // ichidan
    const suf = ICHI[form];
    word = kanji.slice(0, -1) + suf; read = reading.slice(0, -1) + suf;
  } else { // godan
    const lk = reading.slice(-1);
    const isIku = reading === "いく";
    const suf = godanSuffix(form, lk, isIku);
    word = kanji.slice(0, -1) + suf; read = reading.slice(0, -1) + suf;
  }
  return { word, reading: read, romaji: romanize(read) };
}

// ---- deck data ----  rows: [kanji, reading, type, meaning, exJP, exRead, exMean]
const DECKS = {
  "n4-verbs-teform": { level: "N4", form: "te", pos: "Verb (te-form)", rows: [
    ["書く","かく","g","write → 書いて (and / please)","ここに名前を書いてください。","ここになまえをかいてください。","Please write your name here."],
    ["行く","いく","g","go → 行って (irregular!)","銀行に行ってきます。","ぎんこうにいってきます。","I'll go to the bank (and come back)."],
    ["話す","はなす","g","speak → 話して","もっとゆっくり話してください。","もっとゆっくりはなしてください。","Please speak more slowly."],
    ["泳ぐ","およぐ","g","swim → 泳いで","海で泳いで、楽しかった。","うみでおよいで、たのしかった。","I swam in the sea and it was fun."],
    ["待つ","まつ","g","wait → 待って","ちょっと待ってください。","ちょっとまってください。","Please wait a moment."],
    ["飲む","のむ","g","drink → 飲んで","薬を飲んで寝た。","くすりをのんでねた。","I took my medicine and went to sleep."],
    ["読む","よむ","g","read → 読んで","本を読んで感想を書く。","ほんをよんでかんそうをかく。","I read a book and write my impressions."],
    ["遊ぶ","あそぶ","g","play → 遊んで","公園で遊んでいる。","こうえんであそんでいる。","They're playing in the park."],
    ["買う","かう","g","buy → 買って","パンを買ってきた。","パンをかってきた。","I went and bought some bread."],
    ["使う","つかう","g","use → 使って","辞書を使って調べる。","じしょをつかってしらべる。","I look it up using a dictionary."],
    ["帰る","かえる","g","return → 帰って","家に帰って休む。","いえにかえってやすむ。","I'll go home and rest."],
    ["作る","つくる","g","make → 作って","料理を作って待っている。","りょうりをつくってまっている。","I'm making food and waiting."],
    ["持つ","もつ","g","hold → 持って","傘を持って出かける。","かさをもってでかける。","I'll take an umbrella and go out."],
    ["呼ぶ","よぶ","g","call → 呼んで","友達を呼んでパーティーをする。","ともだちをよんでパーティーをする。","I'll invite friends and have a party."],
    ["急ぐ","いそぐ","g","hurry → 急いで","急いで駅へ向かった。","いそいでえきへむかった。","I hurried toward the station."],
    ["食べる","たべる","i","eat → 食べて","ご飯を食べて薬を飲む。","ごはんをたべてくすりをのむ。","I eat a meal and take my medicine."],
    ["見る","みる","i","watch → 見て","映画を見て泣いた。","えいがをみてないた。","I watched a movie and cried."],
    ["起きる","おきる","i","get up → 起きて","朝六時に起きて散歩する。","あさろくじにおきてさんぽする。","I get up at 6 a.m. and take a walk."],
    ["する","する","s","do → して","宿題をして寝た。","しゅくだいをしてねた。","I did my homework and went to bed."],
    ["来る","くる","k","come → 来て (きて)","友達が遊びに来て嬉しい。","ともだちがあそびにきてうれしい。","I'm happy my friend came to visit."],
  ]},

  "n4-verbs-taform": { level: "N4", form: "ta", pos: "Verb (ta-form / plain past)", rows: [
    ["書く","かく","g","wrote → 書いた","友達に手紙を書いた。","ともだちにてがみをかいた。","I wrote a letter to my friend."],
    ["行く","いく","g","went → 行った (irregular!)","去年、日本へ行った。","きょねん、にほんへいった。","I went to Japan last year."],
    ["話す","はなす","g","spoke → 話した","先生と進路について話した。","せんせいとしんろについてはなした。","I talked with my teacher about my future path."],
    ["泳ぐ","およぐ","g","swam → 泳いだ","昨日、プールで泳いだ。","きのう、プールでおよいだ。","I swam in the pool yesterday."],
    ["待つ","まつ","g","waited → 待った","一時間も待った。","いちじかんもまった。","I waited a whole hour."],
    ["飲む","のむ","g","drank → 飲んだ","冷たい水を飲んだ。","つめたいみずをのんだ。","I drank some cold water."],
    ["読む","よむ","g","read → 読んだ","その小説をもう読んだ。","そのしょうせつをもうよんだ。","I've already read that novel."],
    ["遊ぶ","あそぶ","g","played → 遊んだ","子供と公園で遊んだ。","こどもとこうえんであそんだ。","I played with the kids at the park."],
    ["買う","かう","g","bought → 買った","新しい靴を買った。","あたらしいくつをかった。","I bought new shoes."],
    ["帰る","かえる","g","returned → 帰った","夜遅く家に帰った。","よるおそくいえにかえった。","I got home late at night."],
    ["作る","つくる","g","made → 作った","母が夕飯を作った。","ははがゆうはんをつくった。","My mother made dinner."],
    ["持つ","もつ","g","held → 持った","重い荷物を持った。","おもいにもつをもった。","I carried heavy luggage."],
    ["呼ぶ","よぶ","g","called → 呼んだ","救急車を呼んだ。","きゅうきゅうしゃをよんだ。","I called an ambulance."],
    ["急ぐ","いそぐ","g","hurried → 急いだ","遅れそうで急いだ。","おくれそうでいそいだ。","I hurried because I was going to be late."],
    ["聞く","きく","g","heard → 聞いた","そのニュースを聞いた。","そのニュースをきいた。","I heard that news."],
    ["食べる","たべる","i","ate → 食べた","朝ごはんをもう食べた。","あさごはんをもうたべた。","I've already eaten breakfast."],
    ["見る","みる","i","saw → 見た","面白い夢を見た。","おもしろいゆめをみた。","I had an interesting dream."],
    ["起きる","おきる","i","got up → 起きた","今朝は早く起きた。","けさははやくおきた。","I got up early this morning."],
    ["する","する","s","did → した","昨日は買い物をした。","きのうはかいものをした。","I went shopping yesterday."],
    ["来る","くる","k","came → 来た (きた)","友達が家に来た。","ともだちがいえにきた。","A friend came to my house."],
  ]},

  "n4-verbs-naiform": { level: "N4", form: "nai", pos: "Verb (nai-form / plain neg.)", rows: [
    ["食べる","たべる","i","don't eat → 食べない","朝ごはんを食べない。","あさごはんをたべない。","I don't eat breakfast."],
    ["見る","みる","i","don't watch → 見ない","あまりテレビを見ない。","あまりテレビをみない。","I don't watch much TV."],
    ["起きる","おきる","i","don't get up → 起きない","休みの日は早く起きない。","やすみのひははやくおきない。","I don't get up early on days off."],
    ["飲む","のむ","g","don't drink → 飲まない","お酒を飲まない。","おさけをのまない。","I don't drink alcohol."],
    ["読む","よむ","g","don't read → 読まない","新聞を読まない。","しんぶんをよまない。","I don't read the newspaper."],
    ["行く","いく","g","don't go → 行かない","今日は学校に行かない。","きょうはがっこうにいかない。","I'm not going to school today."],
    ["書く","かく","g","don't write → 書かない","最近、日記を書かない。","さいきん、にっきをかかない。","I haven't been writing in my diary lately."],
    ["話す","はなす","g","don't speak → 話さない","彼はあまり話さない。","かれはあまりはなさない。","He doesn't talk much."],
    ["泳ぐ","およぐ","g","don't swim → 泳がない","冬は海で泳がない。","ふゆはうみでおよがない。","I don't swim in the sea in winter."],
    ["待つ","まつ","g","don't wait → 待たない","これ以上は待たない。","これいじょうはまたない。","I won't wait any longer."],
    ["買う","かう","g","don't buy → 買わない (u→wa!)","高いものは買わない。","たかいものはかわない。","I don't buy expensive things."],
    ["使う","つかう","g","don't use → 使わない","この道具は使わない。","このどうぐはつかわない。","I don't use this tool."],
    ["帰る","かえる","g","don't return → 帰らない","今夜は帰らない。","こんやはかえらない。","I'm not coming home tonight."],
    ["作る","つくる","g","don't make → 作らない","平日は料理を作らない。","へいじつはりょうりをつくらない。","I don't cook on weekdays."],
    ["持つ","もつ","g","don't carry → 持たない","現金を持たない。","げんきんをもたない。","I don't carry cash."],
    ["呼ぶ","よぶ","g","don't call → 呼ばない","彼は呼ばない。","かれはよばない。","I won't invite him."],
    ["急ぐ","いそぐ","g","don't hurry → 急がない","時間があるから急がない。","じかんがあるからいそがない。","I won't rush since there's time."],
    ["遊ぶ","あそぶ","g","don't play → 遊ばない","試験前は遊ばない。","しけんまえはあそばない。","I don't go out before exams."],
    ["する","する","s","don't do → しない","週末は仕事をしない。","しゅうまつはしごとをしない。","I don't work on weekends."],
    ["来る","くる","k","don't come → 来ない (こない)","彼はパーティーに来ない。","かれはパーティーにこない。","He's not coming to the party."],
  ]},

  "n4-verbs-potential": { level: "N4", form: "pot", pos: "Verb (potential / can do)", rows: [
    ["書く","かく","g","can write → 書ける","漢字が書ける。","かんじがかける。","I can write kanji."],
    ["行く","いく","g","can go → 行ける","一人で行ける。","ひとりでいける。","I can go by myself."],
    ["話す","はなす","g","can speak → 話せる","日本語が少し話せる。","にほんごがすこしはなせる。","I can speak a little Japanese."],
    ["泳ぐ","およぐ","g","can swim → 泳げる","彼は速く泳げる。","かれははやくおよげる。","He can swim fast."],
    ["待つ","まつ","g","can wait → 待てる","あと十分なら待てる。","あとじゅっぷんならまてる。","I can wait ten more minutes."],
    ["飲む","のむ","g","can drink → 飲める","お酒が飲める。","おさけがのめる。","I can drink alcohol."],
    ["読む","よむ","g","can read → 読める","この漢字が読める。","このかんじがよめる。","I can read this kanji."],
    ["遊ぶ","あそぶ","g","can play → 遊べる","週末は友達と遊べる。","しゅうまつはともだちとあそべる。","I can hang out with friends on weekends."],
    ["買う","かう","g","can buy → 買える","ここで切符が買える。","ここできっぷがかえる。","You can buy tickets here."],
    ["使う","つかう","g","can use → 使える","このカードはどこでも使える。","このカードはどこでもつかえる。","You can use this card anywhere."],
    ["帰る","かえる","g","can return → 帰れる","今日は早く帰れる。","きょうははやくかえれる。","I can go home early today."],
    ["作る","つくる","g","can make → 作れる","簡単な料理なら作れる。","かんたんなりょうりならつくれる。","I can make simple dishes."],
    ["持つ","もつ","g","can hold → 持てる","片手で持てる。","かたてでもてる。","I can hold it with one hand."],
    ["聞く","きく","g","can hear → 聞ける","ここでいい音楽が聞ける。","ここでいいおんがくがきける。","You can hear good music here."],
    ["食べる","たべる","i","can eat → 食べられる","辛いものも食べられる。","からいものもたべられる。","I can eat spicy food too."],
    ["見る","みる","i","can see → 見られる","ここから富士山が見られる。","ここからふじさんがみられる。","You can see Mt. Fuji from here."],
    ["起きる","おきる","i","can get up → 起きられる","明日は早く起きられる。","あしたははやくおきられる。","I can get up early tomorrow."],
    ["覚える","おぼえる","i","can memorize → 覚えられる","一日で覚えられる。","いちにちでおぼえられる。","I can memorize it in one day."],
    ["する","する","s","can do → できる","テニスができる。","テニスができる。","I can play tennis."],
    ["来る","くる","k","can come → 来られる (こられる)","明日のパーティーに来られる?","あしたのパーティーにこられる?","Can you come to tomorrow's party?"],
  ]},

  "n3-verbs-passive": { level: "N3", form: "pass", pos: "Verb (passive / 受身)", rows: [
    ["言う","いう","g","be told/said → 言われる","友達にうそつきだと言われた。","ともだちにうそつきだといわれた。","I was called a liar by my friend."],
    ["呼ぶ","よぶ","g","be called → 呼ばれる","先生に名前を呼ばれた。","せんせいになまえをよばれた。","My name was called by the teacher."],
    ["書く","かく","g","be written → 書かれる","壁に落書きを書かれた。","かべにらくがきをかかれた。","Graffiti was scrawled on my wall (on me)."],
    ["読む","よむ","g","be read → 読まれる","日記を妹に読まれた。","にっきをいもうとによまれた。","My diary was read by my little sister."],
    ["使う","つかう","g","be used → 使われる","パソコンを勝手に使われた。","パソコンをかってにつかわれた。","My computer was used without permission."],
    ["取る","とる","g","be taken → 取られる","泥棒に財布を取られた。","どろぼうにさいふをとられた。","My wallet was taken by a thief."],
    ["飲む","のむ","g","be drunk → 飲まれる","ジュースを弟に飲まれた。","ジュースをおとうとにのまれた。","My juice was drunk by my little brother."],
    ["踏む","ふむ","g","be stepped on → 踏まれる","満員電車で足を踏まれた。","まんいんでんしゃであしをふまれた。","My foot was stepped on in the crowded train."],
    ["笑う","わらう","g","be laughed at → 笑われる","みんなに笑われた。","みんなにわらわれた。","I was laughed at by everyone."],
    ["怒る","おこる","g","be scolded → 怒られる","遅刻して先生に怒られた。","ちこくしてせんせいにおこられた。","I was late and got scolded by the teacher."],
    ["売る","うる","g","be sold → 売られる","その絵は高く売られた。","そのえはたかくうられた。","That painting was sold for a high price."],
    ["建てる","たてる","i","be built → 建てられる","駅前に新しいビルが建てられた。","えきまえにあたらしいビルがたてられた。","A new building was built in front of the station."],
    ["食べる","たべる","i","be eaten → 食べられる","ケーキを猫に食べられた。","ケーキをねこにたべられた。","My cake was eaten by the cat."],
    ["見る","みる","i","be seen → 見られる","泣いているところを見られた。","ないているところをみられた。","I was seen while crying."],
    ["ほめる","ほめる","i","be praised → ほめられる","仕事を上司にほめられた。","しごとをじょうしにほめられた。","I was praised for my work by my boss."],
    ["招待する","しょうたいする","s","be invited → 招待される","結婚式に招待された。","けっこんしきにしょうたいされた。","I was invited to the wedding."],
    ["注意する","ちゅういする","s","be warned → 注意される","店員に注意された。","てんいんにちゅういされた。","I was warned by the store clerk."],
    ["来る","くる","k","be come (adversative) → 来られる","忙しい時に友達に来られて困った。","いそがしいときにともだちにこられてこまった。","I was troubled by a friend coming when I was busy."],
  ]},

  "n3-verbs-causative": { level: "N3", form: "caus", pos: "Verb (causative / 使役)", rows: [
    ["行く","いく","g","make/let go → 行かせる","子供を一人で買い物に行かせた。","こどもをひとりでかいものにいかせた。","I let my child go shopping alone."],
    ["待つ","まつ","g","make wait → 待たせる","お客様を三十分も待たせた。","おきゃくさまをさんじゅっぷんもまたせた。","I kept the customer waiting 30 minutes."],
    ["書く","かく","g","make write → 書かせる","学生に作文を書かせる。","がくせいにさくぶんをかかせる。","I have the students write essays."],
    ["読む","よむ","g","make read → 読ませる","子供に毎日本を読ませる。","こどもにまいにちほんをよませる。","I have my child read a book every day."],
    ["飲む","のむ","g","make drink → 飲ませる","赤ちゃんにミルクを飲ませる。","あかちゃんにミルクをのませる。","I feed the baby milk."],
    ["使う","つかう","g","let use → 使わせる","弟にパソコンを使わせた。","おとうとにパソコンをつかわせた。","I let my little brother use the computer."],
    ["持つ","もつ","g","make carry → 持たせる","子供にお弁当を持たせた。","こどもにおべんとうをもたせた。","I sent my child off with a lunchbox."],
    ["休む","やすむ","g","let rest → 休ませる","熱があるので学校を休ませた。","ねつがあるのでがっこうをやすませた。","I let them stay home from school because of a fever."],
    ["立つ","たつ","g","make stand → 立たせる","先生は生徒を立たせた。","せんせいはせいとをたたせた。","The teacher made the student stand."],
    ["泣く","なく","g","make cry → 泣かせる","妹を泣かせてしまった。","いもうとをなかせてしまった。","I ended up making my little sister cry."],
    ["笑う","わらう","g","make laugh → 笑わせる","彼はいつもみんなを笑わせる。","かれはいつもみんなをわらわせる。","He always makes everyone laugh."],
    ["手伝う","てつだう","g","make help → 手伝わせる","息子に料理を手伝わせる。","むすこにりょうりをてつだわせる。","I have my son help with cooking."],
    ["食べる","たべる","i","make eat → 食べさせる","子供に野菜を食べさせる。","こどもにやさいをたべさせる。","I make my child eat vegetables."],
    ["覚える","おぼえる","i","make memorize → 覚えさせる","生徒に単語を覚えさせる。","せいとにたんごをおぼえさせる。","I have the students memorize vocabulary."],
    ["やめる","やめる","i","make quit → やめさせる","危ないので彼に仕事をやめさせた。","あぶないのでかれにしごとをやめさせた。","It was dangerous, so I made him quit the job."],
    ["練習する","れんしゅうする","s","make practice → 練習させる","コーチは選手を毎日練習させる。","コーチはせんしゅをまいにちれんしゅうさせる。","The coach makes the players practice every day."],
    ["する","する","s","make do → させる","子供に部屋の掃除をさせる。","こどもにへやのそうじをさせる。","I make my child clean the room."],
    ["来る","くる","k","make come → 来させる (こさせる)","部下を会社に来させた。","ぶかをかいしゃにこさせた。","I made my subordinate come to the office."],
  ]},

  "n3-verbs-causative-passive": { level: "N3", form: "cpas", pos: "Verb (causative-passive / 使役受身)", rows: [
    ["飲む","のむ","g","be made to drink → 飲ませられる (colloq. 飲まされる)","先輩にお酒を飲ませられた。","せんぱいにおさけをのませられた。","I was made to drink alcohol by my senior."],
    ["待つ","まつ","g","be made to wait → 待たせられる (待たされる)","一時間も待たせられた。","いちじかんもまたせられた。","I was made to wait a whole hour."],
    ["行く","いく","g","be made to go → 行かせられる (行かされる)","母に買い物に行かせられた。","ははにかいものにいかせられた。","I was made to go shopping by my mother."],
    ["書く","かく","g","be made to write → 書かせられる (書かされる)","反省文を書かせられた。","はんせいぶんをかかせられた。","I was made to write a letter of apology."],
    ["読む","よむ","g","be made to read → 読ませられる (読まされる)","大勢の前で読ませられた。","おおぜいのまえでよませられた。","I was made to read in front of a crowd."],
    ["払う","はらう","g","be made to pay → 払わせられる (払わされる)","高い料金を払わせられた。","たかいりょうきんをはらわせられた。","I was made to pay a high fee."],
    ["歌う","うたう","g","be made to sing → 歌わせられる (歌わされる)","カラオケで歌わせられた。","カラオケでうたわせられた。","I was made to sing at karaoke."],
    ["立つ","たつ","g","be made to stand → 立たせられる (立たされる)","廊下に立たせられた。","ろうかにたたせられた。","I was made to stand in the hallway."],
    ["働く","はたらく","g","be made to work → 働かせられる (働かされる)","休みの日も働かせられた。","やすみのひもはたらかせられた。","I was made to work even on my days off."],
    ["手伝う","てつだう","g","be made to help → 手伝わせられる","友達の引っ越しを手伝わせられた。","ともだちのひっこしをてつだわせられた。","I was made to help with my friend's move."],
    ["食べる","たべる","i","be made to eat → 食べさせられる","嫌いな野菜を食べさせられた。","きらいなやさいをたべさせられた。","I was made to eat vegetables I dislike."],
    ["覚える","おぼえる","i","be made to memorize → 覚えさせられる","たくさんの漢字を覚えさせられた。","たくさんのかんじをおぼえさせられた。","I was made to memorize a lot of kanji."],
    ["やめる","やめる","i","be forced to quit → やめさせられる","会社をやめさせられた。","かいしゃをやめさせられた。","I was forced to quit the company."],
    ["勉強する","べんきょうする","s","be made to study → 勉強させられる","親に英語を勉強させられた。","おやにえいごをべんきょうさせられた。","I was made to study English by my parents."],
    ["練習する","れんしゅうする","s","be made to practice → 練習させられる","毎日遅くまで練習させられた。","まいにちおそくまでれんしゅうさせられた。","I was made to practice late every day."],
    ["する","する","s","be made to do → させられる","つまらない仕事をさせられた。","つまらないしごとをさせられた。","I was made to do boring work."],
    ["来る","くる","k","be made to come → 来させられる (こさせられる)","休日に会社に来させられた。","きゅうじつにかいしゃにこさせられた。","I was made to come to the office on my day off."],
  ]},
};

let total = 0;
for (const [key, def] of Object.entries(DECKS)) {
  const arr = def.rows.map((r) => {
    const [kanji, reading, type, meaning, exJP, exRead, exMean] = r;
    const c = conjugate(kanji, reading, type, def.form);
    return {
      word: c.word, reading: c.reading, romaji: c.romaji, meaning,
      partOfSpeech: def.pos, exampleSentence: exJP, exampleReading: exRead,
      exampleMeaning: exMean, level: def.level,
    };
  });
  const json = JSON.stringify(arr, null, 2);
  fs.writeFileSync(path.join(DATA, key + ".json"), json);
  fs.writeFileSync(path.join(DATA, key + ".js"),
    `// Auto-generated fallback for file:// (when fetch is blocked). Source: ${key}.json\n` +
    `window.DECKS=window.DECKS||{};\nwindow.DECKS[${JSON.stringify(key)}]=${json};\n`);
  console.log(`${key}: ${arr.length}`);
  total += arr.length;
}
console.log("Verb-form TOTAL entries:", total);

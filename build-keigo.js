// Populates the keigo (politeness) study decks: N3 teineigo + basic honorifics,
// N2 sonkeigo (respectful) + kenjougo (humble), N1 advanced + nuanced.
// vocab-schema JSON + .js fallback for file://. Run: node build-keigo.js
const fs = require("fs");
const path = require("path");
const DATA = path.join(__dirname, "data");

// rows: [word, reading, romaji, meaning, exJP, exRead, exMean]
const mk = (level, pos) => (r) => ({
  word: r[0], reading: r[1] || "", romaji: r[2] || "", meaning: r[3] || "",
  partOfSpeech: pos, exampleSentence: r[4] || "", exampleReading: r[5] || "",
  exampleMeaning: r[6] || "", level,
});

const DECKS = {
  "n3-keigo-teineigo": { level: "N3", pos: "Keigo (teineigo)", rows: [
    ["〜です／〜ます","","desu / masu","polite sentence endings — the standard 丁寧語 register","私は学生です。毎日勉強します。","わたしはがくせいです。まいにちべんきょうします。","I'm a student. I study every day."],
    ["でございます","","de gozaimasu","very polite \"to be\" (formal です)","こちらが受付でございます。","こちらがうけつけでございます。","This is the reception desk."],
    ["ございます","","gozaimasu","polite \"there is / to have\" (formal ある)","ご質問がございますか。","ごしつもんがございますか。","Do you have any questions?"],
    ["お〜・ご〜（美化語）","","o~ / go~","beautifying polite prefix on nouns","お水とお茶をお持ちします。","おみずとおちゃをおもちします。","I'll bring water and tea."],
    ["〜ております","","te orimasu","polite \"-ing / state\" (humble-polite ている)","ただいま確認しております。","ただいまかくにんしております。","I'm checking on it right now."],
    ["よろしいでしょうか","","yoroshii deshou ka","\"would that be all right?\" (polite check)","こちらの席でよろしいでしょうか。","こちらのせきでよろしいでしょうか。","Would this seat be all right?"],
    ["〜ていただけますか","","te itadakemasu ka","\"could you please ~?\" (polite request)","少々お待ちいただけますか。","しょうしょうおまちいただけますか。","Could you please wait a moment?"],
    ["お願いいたします","おねがいいたします","onegai itashimasu","\"please / I kindly ask\"","よろしくお願いいたします。","よろしくおねがいいたします。","Thank you in advance for your help."],
    ["失礼します","しつれいします","shitsurei shimasu","\"excuse me / pardon me\"","お先に失礼します。","おさきにしつれいします。","Please excuse me for leaving first."],
    ["かしこまりました","","kashikomarimashita","\"certainly\" (polite acknowledgment)","かしこまりました。すぐにお持ちします。","かしこまりました。すぐにおもちします。","Certainly. I'll bring it right away."],
    ["承知しました","しょうちしました","shouchi shimashita","\"understood / noted\" (business polite)","承知しました。明日対応いたします。","しょうちしました。あしたたいおういたします。","Understood. I'll take care of it tomorrow."],
    ["恐れ入りますが","おそれいりますが","osore irimasu ga","\"I'm sorry to trouble you, but\"","恐れ入りますが、お名前をお願いします。","おそれいりますが、おなまえをおねがいします。","Excuse me, but may I have your name?"],
    ["〜でしょうか","","deshou ka","polite, softened question ending","何時にお会いできるでしょうか。","なんじにおあいできるでしょうか。","What time could we meet?"],
    ["お〜ください","","o~ kudasai","polite request form","こちらにお掛けください。","こちらにおかけください。","Please have a seat here."],
    ["少々お待ちください","しょうしょうおまちください","shoushou omachi kudasai","\"please wait a moment\"","少々お待ちください。","しょうしょうおまちください。","Please wait just a moment."],
    ["どうぞ","","douzo","\"please / go ahead\" (offering)","どうぞお入りください。","どうぞおはいりください。","Please, come in."],
  ]},

  "n3-keigo-honorifics": { level: "N3", pos: "Keigo (honorific)", rows: [
    ["〜さん","","san","Mr./Ms. — standard polite suffix","田中さんはいらっしゃいますか。","たなかさんはいらっしゃいますか。","Is Mr./Ms. Tanaka in?"],
    ["〜様（さま）","さま","sama","very polite suffix (customers, letters)","お客様、こちらへどうぞ。","おきゃくさま、こちらへどうぞ。","This way, please, sir/madam."],
    ["〜君（くん）","くん","kun","familiar suffix (juniors, often male)","山田君、ちょっといいですか。","やまだくん、ちょっといいですか。","Yamada, do you have a moment?"],
    ["〜殿（どの）","どの","dono","formal suffix (official documents)","山田太郎殿","やまだたろうどの","Mr. Taro Yamada (formal / written)"],
    ["御中（おんちゅう）","おんちゅう","onchuu","\"Messrs.\" — addressing a company / department","人事部御中","じんじぶおんちゅう","To the HR Department (on mail)"],
    ["〜先生（せんせい）","せんせい","sensei","honorific for teachers, doctors, etc.","山田先生に相談しました。","やまだせんせいにそうだんしました。","I consulted Dr./Prof. Yamada."],
    ["どなた","","donata","\"who\" — polite form of 誰","失礼ですが、どなたですか。","しつれいですが、どなたですか。","Excuse me, but who are you?"],
    ["お〜になる","","o~ ni naru","productive respectful verb pattern","社長はもうお帰りになりました。","しゃちょうはもうおかえりになりました。","The president has already gone home."],
    ["ご〜になる","","go~ ni naru","respectful pattern for する-nouns","先生はいつご出発になりますか。","せんせいはいつごしゅっぱつになりますか。","When will you depart, sir?"],
    ["〜（ら）れる","","(ra)reru","respectful verb form (= passive shape)","部長は何時に来られますか。","ぶちょうはなんじにこられますか。","What time will the manager arrive?"],
    ["お名前・ご住所","おなまえ・ごじゅうしょ","onamae / gojuusho","honorific お/ご on the listener's belongings","お名前とご住所をお願いします。","おなまえとごじゅうしょをおねがいします。","Your name and address, please."],
    ["ご存知（ぞんじ）だ","ごぞんじだ","gozonji da","\"to know\" (respectful)","この件をご存知ですか。","このけんをごぞんじですか。","Are you aware of this matter?"],
    ["なさる","","nasaru","\"to do\" (respectful, for する)","どうなさいましたか。","どうなさいましたか。","What's the matter?"],
    ["いらっしゃる","","irassharu","\"to be / come / go\" (respectful)","先生は研究室にいらっしゃいます。","せんせいはけんきゅうしつにいらっしゃいます。","The professor is in his office."],
    ["お〜です","","o~ desu","light respectful form (お + stem + です)","もうお帰りですか。","もうおかえりですか。","Are you leaving already?"],
  ]},

  "n2-keigo-sonkeigo": { level: "N2", pos: "Keigo (sonkeigo)", rows: [
    ["いらっしゃる","","irassharu","to be / come / go (respectful)","部長はもうすぐいらっしゃいます。","ぶちょうはもうすぐいらっしゃいます。","The manager will be here soon."],
    ["おっしゃる","","ossharu","to say (respectful)","お名前は何とおっしゃいますか。","おなまえはなんとおっしゃいますか。","What is your name, please?"],
    ["召し上がる","めしあがる","meshiagaru","to eat / drink (respectful)","どうぞ温かいうちに召し上がってください。","どうぞあたたかいうちにめしあがってください。","Please eat while it's warm."],
    ["ご覧になる","ごらんになる","goran ni naru","to look / see / read (respectful)","こちらの資料をご覧になりましたか。","こちらのしりょうをごらんになりましたか。","Have you looked at these documents?"],
    ["なさる","","nasaru","to do (respectful)","週末はゴルフをなさいますか。","しゅうまつはゴルフをなさいますか。","Do you play golf on weekends?"],
    ["くださる","","kudasaru","to give (to me/us) (respectful)","先生が推薦状をくださった。","せんせいがすいせんじょうをくださった。","The professor gave me a recommendation letter."],
    ["ご存知だ","ごぞんじだ","gozonji da","to know (respectful)","社長をご存知ですか。","しゃちょうをごぞんじですか。","Do you know the president?"],
    ["お〜になる","","o~ ni naru","general respectful verb pattern","部長はもうお帰りになりました。","ぶちょうはもうおかえりになりました。","The manager has already left."],
    ["お休みになる","おやすみになる","oyasumi ni naru","to sleep / rest (respectful)","社長は今お休みになっています。","しゃちょうはいまおやすみになっています。","The president is resting now."],
    ["お見えになる","おみえになる","omie ni naru","to come / show up (respectful, of guests)","お客様がお見えになりました。","おきゃくさまがおみえになりました。","The guest has arrived."],
    ["お召しになる","おめしになる","omeshi ni naru","to wear (respectful, of 着る)","素敵な着物をお召しになっていますね。","すてきなきものをおめしになっていますね。","You're wearing a lovely kimono."],
    ["〜（ら）れる","","(ra)reru","respectful verb form","社長はもう出発されました。","しゃちょうはもうしゅっぱつされました。","The president has already departed."],
    ["ご〜になる","","go~ ni naru","respectful pattern (する-nouns)","先生がご説明になります。","せんせいがごせつめいになります。","The teacher will explain."],
    ["お元気でいらっしゃる","おげんきでいらっしゃる","ogenki de irassharu","to be well (respectful)","ご両親はお元気でいらっしゃいますか。","ごりょうしんはおげんきでいらっしゃいますか。","Are your parents well?"],
    ["どちら様","どちらさま","dochira-sama","who (very respectful)","失礼ですが、どちら様でしょうか。","しつれいですが、どちらさまでしょうか。","Excuse me, but who are you?"],
    ["お〜くださる","","o~ kudasaru","to kindly do for me (respectful)","わざわざお越しくださり、ありがとうございます。","わざわざおこしくださり、ありがとうございます。","Thank you for taking the trouble to come."],
  ]},

  "n2-keigo-kenjougo": { level: "N2", pos: "Keigo (kenjougo)", rows: [
    ["参る（まいる）","まいる","mairu","to go / come (humble)","明日、御社に参ります。","あした、おんしゃにまいります。","I'll come to your company tomorrow."],
    ["申す（もうす）","もうす","mousu","to say / be called (humble)","田中と申します。","たなかともうします。","My name is Tanaka."],
    ["申し上げる（もうしあげる）","もうしあげる","moushiageru","to say / tell (humble, to a superior)","心よりお礼申し上げます。","こころよりおれいもうしあげます。","I sincerely thank you."],
    ["いたす","","itasu","to do (humble, for する)","私がご案内いたします。","わたしがごあんないいたします。","I will show you the way."],
    ["いただく","","itadaku","to eat / drink / receive (humble)","遠慮なくいただきます。","えんりょなくいただきます。","I'll gladly have some."],
    ["拝見する（はいけんする）","はいけんする","haiken suru","to look / see (humble)","お写真を拝見しました。","おしゃしんをはいけんしました。","I saw your photo."],
    ["伺う（うかがう）","うかがう","ukagau","to ask / visit / hear (humble)","明日、お宅に伺います。","あした、おたくにうかがいます。","I'll visit your home tomorrow."],
    ["存じる（ぞんじる）","ぞんじる","zonjiru","to know / think (humble)","その件は存じております。","そのけんはぞんじております。","I'm aware of that matter."],
    ["存じ上げる（ぞんじあげる）","ぞんじあげる","zonjiageru","to know (a person) (humble)","お名前は存じ上げております。","おなまえはぞんじあげております。","I know your name."],
    ["おる","","oru","to be / exist (humble, for いる)","父は今、外出しております。","ちちはいま、がいしゅつしております。","My father is out right now."],
    ["お目にかかる（おめにかかる）","おめにかかる","ome ni kakaru","to meet (humble, of 会う)","社長にお目にかかりました。","しゃちょうにおめにかかりました。","I met the president."],
    ["お〜する／お〜いたす","","o~ suru / itasu","general humble verb pattern","お荷物をお持ちします。","おにもつをおもちします。","I'll carry your luggage."],
    ["差し上げる（さしあげる）","さしあげる","sashiageru","to give (humble)","資料を差し上げます。","しりょうをさしあげます。","I'll give you the documents."],
    ["承る（うけたまわる）","うけたまわる","uketamawaru","to receive / undertake (humble, of 聞く/受ける)","ご注文を承ります。","ごちゅうもんをうけたまわります。","I'll take your order."],
    ["拝借する（はいしゃくする）","はいしゃくする","haishaku suru","to borrow (humble)","お電話を拝借できますか。","おでんわをはいしゃくできますか。","May I use your phone?"],
    ["〜させていただく","","sasete itadaku","to humbly do (with your permission)","それでは、説明させていただきます。","それでは、せつめいさせていただきます。","Now then, allow me to explain."],
  ]},

  "n1-keigo-advanced": { level: "N1", pos: "Keigo (advanced)", rows: [
    ["〜でいらっしゃる","","de irassharu","respectful copula \"to be\" (for people)","佐藤様でいらっしゃいますね。","さとうさまでいらっしゃいますね。","You're Mr./Ms. Sato, I presume."],
    ["〜ておられる","","te orareru","respectful \"-ing\" (of ている)","部長は会議に出ておられます。","ぶちょうはかいぎにでておられます。","The manager is in a meeting."],
    ["お〜申し上げる","","o~ moushiageru","very humble verb pattern","ご協力をお願い申し上げます。","ごきょうりょくをおねがいもうしあげます。","I humbly ask for your cooperation."],
    ["〜かねます","","kanemasu","\"unable to ~\" (polite refusal)","その件はお答えしかねます。","そのけんはおこたえしかねます。","I'm afraid I can't answer that."],
    ["〜いたしかねます","","itashikanemasu","\"cannot do\" (very polite refusal)","返品はいたしかねます。","へんぴんはいたしかねます。","I'm afraid we cannot accept returns."],
    ["〜ていただけますでしょうか","","te itadakemasu deshou ka","extremely polite request","内容をご確認いただけますでしょうか。","ないようをごかくにんいただけますでしょうか。","Could you kindly check the contents?"],
    ["〜ていただければ幸いです","","te itadakereba saiwai desu","\"I'd be grateful if you would ~\"","ご返信いただければ幸いです。","ごへんしんいただければさいわいです。","I'd be grateful for your reply."],
    ["恐縮ですが（きょうしゅく）","きょうしゅくですが","kyoushuku desu ga","\"I'm much obliged, but / sorry but\"","恐縮ですが、ご署名をお願いします。","きょうしゅくですが、ごしょめいをおねがいします。","I'm sorry to ask, but please sign here."],
    ["〜たく存じます（ぞんじます）","","taku zonjimasu","\"I would humbly like to ~\"","ぜひご出席いただきたく存じます。","ぜひごしゅっせきいただきたくぞんじます。","I would very much like you to attend."],
    ["ご無沙汰しております（ごぶさた）","ごぶさたしております","gobusata shite orimasu","\"it's been a long time\" (formal)","ご無沙汰しております。お元気ですか。","ごぶさたしております。おげんきですか。","It's been a while. How have you been?"],
    ["ご査収ください（ごさしゅう）","ごさしゅうください","gosashuu kudasai","\"please find enclosed and check\" (business)","資料を添付いたします。ご査収ください。","しりょうをてんぷいたします。ごさしゅうください。","I've attached the documents; please review them."],
    ["お納めください（おさめ）","おおさめください","oosame kudasai","\"please accept (this)\"","心ばかりの品ですが、お納めください。","こころばかりのしなですが、おおさめください。","It's only a small token, but please accept it."],
    ["〜申し上げます","","moushiagemasu","humble \"I (verb)\" (formal closings)","謹んでお祝い申し上げます。","つつしんでおいわいもうしあげます。","I humbly offer my congratulations."],
    ["お力添え（おちからぞえ）","おちからぞえ","ochikarazoe","\"your kind assistance\" (formal)","お力添えをいただき、感謝いたします。","おちからぞえをいただき、かんしゃいたします。","Thank you for your kind assistance."],
    ["〜の運び（はこび）となる","のはこびとなる","no hakobi to naru","\"to reach the stage of ~\" (formal)","無事、開業の運びとなりました。","ぶじ、かいぎょうのはこびとなりました。","We have successfully reached our opening."],
  ]},

  "n1-keigo-nuanced": { level: "N1", pos: "Keigo (polite expression)", rows: [
    ["恐れ入りますが","おそれいりますが","osore irimasu ga","cushion word: \"I'm sorry to trouble you, but\"","恐れ入りますが、少々お待ちください。","おそれいりますが、しょうしょうおまちください。","Sorry to trouble you, but please wait a moment."],
    ["申し訳ございませんが","もうしわけございませんが","moushiwake gozaimasen ga","cushion word: \"I'm terribly sorry, but\"","申し訳ございませんが、本日は満席です。","もうしわけございませんが、ほんじつはまんせきです。","I'm very sorry, but we're full today."],
    ["お手数ですが（おてすう）","おてすうですが","otesuu desu ga","\"sorry for the trouble, but\"","お手数ですが、ご記入をお願いします。","おてすうですが、ごきにゅうをおねがいします。","Sorry to trouble you, but please fill this in."],
    ["差し支えなければ（さしつかえ）","さしつかえなければ","sashitsukae nakereba","\"if it's not inconvenient\"","差し支えなければ、お電話番号を教えてください。","さしつかえなければ、おでんわばんごうをおしえてください。","If you don't mind, please tell me your number."],
    ["あいにく","","ainiku","\"unfortunately\" (polite)","あいにく担当者は不在でございます。","あいにくたんとうしゃはふざいでございます。","Unfortunately, the person in charge is away."],
    ["〜のほど","","no hodo","softening nominalizer in requests","ご了承のほど、よろしくお願いします。","ごりょうしょうのほど、よろしくおねがいします。","We kindly ask for your understanding."],
    ["よろしければ","","yoroshikereba","\"if you'd like / if it's all right\"","よろしければ、ご案内いたします。","よろしければ、ごあんないいたします。","If you'd like, I'll show you around."],
    ["〜と存じます（ぞんじます）","","to zonjimasu","\"I believe / think\" (humble, soft)","問題ないかと存じます。","もんだいないかとぞんじます。","I believe there is no problem."],
    ["ご了承ください（りょうしょう）","ごりょうしょうください","goryoushou kudasai","\"please understand / accept in advance\"","変更の場合がございます。ご了承ください。","へんこうのばあいがございます。ごりょうしょうください。","There may be changes; thank you for your understanding."],
    ["ご容赦ください（ようしゃ）","ごようしゃください","goyousha kudasai","\"please forgive / excuse\"","不行き届きの点はご容赦ください。","ふゆきとどきのてんはごようしゃください。","Please excuse any shortcomings."],
    ["〜ではございますが","","de wa gozaimasu ga","\"it is ~, but\" (formal concession)","簡単ではございますが、ご挨拶まで。","かんたんではございますが、ごあいさつまで。","Just a brief note by way of greeting."],
    ["二重敬語（にじゅうけいご）","にじゅうけいご","nijuu keigo","\"double keigo\" — over-stacked, often incorrect","「お召し上がりになる」は二重敬語です。","「おめしあがりになる」はにじゅうけいごです。","\"O-meshiagari-ni-naru\" is double keigo."],
    ["クッション言葉（ことば）","クッションことば","kusshon kotoba","\"cushion words\" that soften a request","クッション言葉を添えると印象が和らぐ。","クッションことばをそえるといんしょうがやわらぐ。","Adding cushion words softens the impression."],
    ["〜かと存じますが","","ka to zonjimasu ga","\"I believe ~, but\" (very soft opinion)","こちらでよろしいかと存じますが。","こちらでよろしいかとぞんじますが。","I believe this should be fine."],
    ["お納めいただければ（おさめ）","おおさめいただければ","oosame itadakereba","\"if you would kindly accept\"","ささやかですが、お納めいただければ幸いです。","ささやかですが、おおさめいただければさいわいです。","It's modest, but I'd be glad if you'd accept it."],
  ]},
};

let total = 0;
for (const [key, def] of Object.entries(DECKS)) {
  const arr = def.rows.map(mk(def.level, def.pos));
  const json = JSON.stringify(arr, null, 2);
  fs.writeFileSync(path.join(DATA, key + ".json"), json);
  fs.writeFileSync(path.join(DATA, key + ".js"),
    `// Auto-generated fallback for file:// (when fetch is blocked). Source: ${key}.json\n` +
    `window.DECKS=window.DECKS||{};\nwindow.DECKS[${JSON.stringify(key)}]=${json};\n`);
  console.log(`${key}: ${arr.length}`);
  total += arr.length;
}
console.log("Keigo TOTAL entries:", total);

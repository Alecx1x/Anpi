/* lib/curriculum.js — guided learning path data.
 *
 * A linear list of UNITS grouped into STAGES. Each unit teaches a concept
 * (sections of prose) and links to existing decks for practice (study or game).
 * LEVELS let a learner place themselves (or be placed by the test); `start` is
 * the unit their path begins at. CURRICULUM.placement is a short quiz that maps
 * answers to a level. Plain data — add units without touching app.js.
 *
 * practice item shape:
 *   { label, type:"study", sel:"<selKey>" }   → opens that study deck/set
 *   { label, type:"game",  game:"<deckKey>" } → launches the game on that deck
 *
 * Inside section `html` strings: never use backticks or ${...} (they would
 * break the template literal). Straight/curly quotes and HTML entities are fine.
 */
window.CURRICULUM = {
  levels: [
    { id: "zero",    label: "Absolute beginner",  desc: "I've never studied Japanese", start: "scripts" },
    { id: "kana",    label: "I can read kana",     desc: "Hiragana & katakana are comfortable", start: "n5-kanji" },
    { id: "n5",      label: "Around N5",           desc: "Basic kanji, vocab & grammar already", start: "n5-particles" },
    { id: "n4",      label: "Around N4",           desc: "Comfortable with everyday Japanese", start: "n4-kanji" },
    { id: "n3",      label: "N3 or above",         desc: "Intermediate — building toward fluency", start: "n3-kanji" },
    { id: "explore", label: "Just let me explore", desc: "Skip the guided path — I'll navigate myself", start: null },
  ],

  // Quick placement test → maps to a level. `tier` is the level assigned when
  // this is the hardest question answered correctly (none correct → "zero").
  placement: [
    { q: "What is the reading of the hiragana あ?", choices: ["a", "o", "e", "ka"], answer: 0, tier: "kana" },
    { q: "What is the reading of じゃ?", choices: ["ja", "sha", "cha", "ya"], answer: 0, tier: "kana" },
    { q: "What does the kanji 水 mean?", choices: ["water", "fire", "tree", "mountain"], answer: 0, tier: "n5" },
    { q: "What does 食べる (たべる) mean?", choices: ["to eat", "to drink", "to buy", "to go"], answer: 0, tier: "n5" },
    { q: "What does 始める (はじめる) mean?", choices: ["to begin", "to finish", "to wait", "to use"], answer: 0, tier: "n4" },
    { q: "What does 経験 (けいけん) mean?", choices: ["experience", "opinion", "society", "reason"], answer: 0, tier: "n3" },
  ],

  units: [
    // ============================ Foundations ============================
    {
      id: "scripts", stage: "Foundations", title: "How Japanese Is Written",
      summary: "The three scripts, rōmaji, and what “reading” actually means.",
      sections: [
        { heading: "Three scripts, one language", html:
          `<p>Written Japanese mixes <b>three</b> scripts, each with a job:</p>
           <ul>
             <li><b>Hiragana</b> (ひらがな) — flowing, rounded characters for native Japanese words and grammar. This is where everyone starts.</li>
             <li><b>Katakana</b> (カタカナ) — sharp, angular characters used mainly for foreign/loan words (コーヒー = coffee), names, and emphasis.</li>
             <li><b>Kanji</b> (漢字) — characters borrowed from Chinese that each carry meaning (山 = mountain). Used for most nouns, verb stems, and adjectives.</li>
           </ul>
           <p>A normal sentence uses all three at once. Hiragana and katakana are <b>phonetic</b> — each character is just a sound. Kanji carry <b>meaning</b>. Learn the two kana sets first and you can already read and pronounce anything.</p>` },
        { heading: "See all three at once", html:
          `<p>Here is one ordinary sentence, colour-coded by script:</p>
           <p style="font-size:1.25rem">私は コーヒー を 飲みます。</p>
           <ul>
             <li>私 (kanji = "I") ・ は (hiragana particle) </li>
             <li>コーヒー (katakana = "coffee") ・ を (hiragana particle)</li>
             <li>飲 (kanji = "drink") ・ みます (hiragana verb ending)</li>
           </ul>
           <p>Reading: <i>watashi wa kōhī o nomimasu</i> — "I drink coffee." Notice the pattern: kanji for the meaty meaning, hiragana for the grammatical glue, katakana for the imported word.</p>` },
        { heading: "What is rōmaji?", html:
          `<p><b>Rōmaji</b> is Japanese written with the Latin alphabet you already know — <i>konnichiwa</i> instead of こんにちは. It's a helpful bridge for your first days, and it's shown on the back of the flashcards.</p>
           <p>Treat it as training wheels: the goal is to read the kana directly. The faster you drop rōmaji, the faster real reading clicks.</p>` },
        { heading: "How reading actually works", html:
          `<p>Japanese isn't spelled letter-by-letter. It's built from <b>syllable-sized sounds</b> (called <i>mora</i>). Each hiragana/katakana character is one of those sounds:</p>
           <p style="font-size:1.4rem;letter-spacing:2px">か = "ka" &nbsp;・&nbsp; さ = "sa" &nbsp;・&nbsp; き = "ki"</p>
           <p>So こ + ん + に + ち + は reads <i>ko‑n‑ni‑chi‑wa</i>. Once you know the ~46 basic hiragana, you can sound out any Japanese word — even before you know what it means.</p>` },
        { heading: "Your first move", html:
          `<div class="lesson-key"><b>Goal:</b> read all of hiragana on sight. Everything else in Japanese sits on top of this.</div>
           <p>Start with <b>hiragana</b>. Use the flashcards to learn each character's sound, then the game to drill recognition speed until it's automatic.</p>` },
      ],
      practice: [
        { label: "📖 Study Hiragana (Basic)", type: "study", sel: "hiragana#basic" },
        { label: "🎮 Play the Hiragana game", type: "game", game: "hiragana" },
      ],
    },
    {
      id: "hiragana-basic", stage: "Foundations", title: "Hiragana: the 46 Basic Sounds",
      summary: "The gojūon grid — five vowels times nine consonant rows.",
      sections: [
        { heading: "The vowels come first", html:
          `<p>Every Japanese sound is built on just <b>five vowels</b>, always pronounced the same way:</p>
           <p style="font-size:1.3rem">あ <i>a</i> (ah) ・ い <i>i</i> (ee) ・ う <i>u</i> (oo) ・ え <i>e</i> (eh) ・ お <i>o</i> (oh)</p>
           <p>Unlike English, these never drift — あ is always "ah". Get these five steady and the rest of hiragana is just a consonant placed in front of them.</p>` },
        { heading: "The gojūon grid", html:
          `<p>The other characters follow a clean pattern: a consonant (k, s, t, n, h, m, y, r, w) + each vowel. This 5×9 layout is called the <b>gojūon</b> (“fifty sounds”).</p>
           <table class="kana-grid">
             <tr><th></th><th>a</th><th>i</th><th>u</th><th>e</th><th>o</th></tr>
             <tr><th>–</th><td>あ</td><td>い</td><td>う</td><td>え</td><td>お</td></tr>
             <tr><th>k</th><td>か</td><td>き</td><td>く</td><td>け</td><td>こ</td></tr>
             <tr><th>s</th><td>さ</td><td>し</td><td>す</td><td>せ</td><td>そ</td></tr>
             <tr><th>t</th><td>た</td><td>ち</td><td>つ</td><td>て</td><td>と</td></tr>
             <tr><th>n</th><td>な</td><td>に</td><td>ぬ</td><td>ね</td><td>の</td></tr>
             <tr><th>h</th><td>は</td><td>ひ</td><td>ふ</td><td>へ</td><td>ほ</td></tr>
             <tr><th>m</th><td>ま</td><td>み</td><td>む</td><td>め</td><td>も</td></tr>
             <tr><th>y</th><td>や</td><td></td><td>ゆ</td><td></td><td>よ</td></tr>
             <tr><th>r</th><td>ら</td><td>り</td><td>る</td><td>れ</td><td>ろ</td></tr>
             <tr><th>w</th><td>わ</td><td></td><td></td><td></td><td>を</td></tr>
           </table>
           <p>Plus one lone nasal sound, <b>ん</b> (<i>n</i>) — the only character that isn't a full syllable.</p>` },
        { heading: "A few sounds to watch", html:
          `<p>Most are regular, but a handful drift from the pattern:</p>
           <ul>
             <li><b>し</b> is <i>shi</i> (not "si"), <b>ち</b> is <i>chi</i>, <b>つ</b> is <i>tsu</i>.</li>
             <li><b>ふ</b> is a soft <i>fu</i>, between "hu" and "fu".</li>
             <li>The <b>r</b>-row (ら り る れ ろ) is a light tap, halfway between English "r" and "l".</li>
             <li><b>を</b> sounds like <i>o</i> — it's only used as a grammar particle.</li>
           </ul>` },
        { heading: "How to actually memorize it", html:
          `<div class="lesson-key"><b>Plan:</b> learn one row (5 characters) at a time. Flashcards to meet them, game to make recall fast.</div>
           <p>Don't try to cram all 46 in one sitting. A row a day, reviewing yesterday's, gets you reading hiragana in about a week. Speed matters as much as accuracy — the game's the fastest way to get there.</p>` },
      ],
      practice: [
        { label: "📖 Study Hiragana (Basic)", type: "study", sel: "hiragana#basic" },
        { label: "🎮 Play the Hiragana game", type: "game", game: "hiragana" },
      ],
    },
    {
      id: "hiragana-dakuten", stage: "Foundations", title: "Voiced Sounds: Dakuten & Handakuten",
      summary: "Two small marks that turn k→g, s→z, t→d, h→b/p.",
      sections: [
        { heading: "Small marks, new sounds", html:
          `<p>You don't learn new shapes here — you reuse the ones you know with a small mark added:</p>
           <ul>
             <li><b>Dakuten</b> (゛, two ticks) <i>voices</i> a consonant: it makes your throat buzz.</li>
             <li><b>Handakuten</b> (゜, a small circle) appears only on the h-row, making a "p" sound.</li>
           </ul>
           <p>That's ~25 extra sounds for almost no new memorization.</p>` },
        { heading: "The full voiced grid", html:
          `<table class="kana-grid">
             <tr><th></th><th>a</th><th>i</th><th>u</th><th>e</th><th>o</th></tr>
             <tr><th>g</th><td>が</td><td>ぎ</td><td>ぐ</td><td>げ</td><td>ご</td></tr>
             <tr><th>z</th><td>ざ</td><td>じ</td><td>ず</td><td>ぜ</td><td>ぞ</td></tr>
             <tr><th>d</th><td>だ</td><td>ぢ</td><td>づ</td><td>で</td><td>ど</td></tr>
             <tr><th>b</th><td>ば</td><td>び</td><td>ぶ</td><td>べ</td><td>ぼ</td></tr>
             <tr><th>p</th><td>ぱ</td><td>ぴ</td><td>ぷ</td><td>ぺ</td><td>ぽ</td></tr>
           </table>
           <p>So か→が (ka→ga), さ→ざ (sa→za), た→だ (ta→da), は→ば (ha→ba), は→ぱ (ha→pa). Note <b>じ</b> is <i>ji</i> and <b>ぢ</b> is also <i>ji</i> (rare); <b>づ</b> is <i>zu</i> (rare) — じ and ず are the everyday spellings.</p>` },
        { heading: "Hear the difference", html:
          `<table class="ex-table">
             <tr><td>かさ</td><td>kasa</td><td>umbrella</td></tr>
             <tr><td>かざ…</td><td>kaza…</td><td>(in 風 kaze, "wind")</td></tr>
             <tr><td>て</td><td>te</td><td>hand</td></tr>
             <tr><td>で</td><td>de</td><td>(particle "at/by")</td></tr>
           </table>
           <p>The voiced mark can completely change a word, so it's worth seeing clearly.</p>` },
        { heading: "Tip: spot the mark", html:
          `<p>The marks are small. In this app you can enlarge or colour them — open the ⚙ panel (or the あ゛ button in the game) and set <b>Voiced kana marks</b> to your taste. <b>Two ticks = dakuten</b>, <b>a ring = handakuten</b>.</p>` },
      ],
      practice: [
        { label: "📖 Study Hiragana (Dakuten)", type: "study", sel: "hiragana#dakuten" },
        { label: "🎮 Play the Hiragana game", type: "game", game: "hiragana" },
      ],
    },
    {
      id: "hiragana-yoon", stage: "Foundations", title: "Combined Sounds: Yōon",
      summary: "Glides like きゃ (kya) made by shrinking や/ゆ/よ.",
      sections: [
        { heading: "Two characters, one sound", html:
          `<p>Take an <i>i</i>-row character (き, し, ち, に, ひ, み, り, plus voiced ぎ, じ, び, ぴ) and add a <b>small</b> や, ゆ, or よ to glide into a single sound:</p>
           <p style="font-size:1.3rem">き + ゃ = きゃ <i>kya</i> ・ し + ゅ = しゅ <i>shu</i> ・ ち + ょ = ちょ <i>cho</i></p>
           <p>The small kana is written half-size. It is one beat (one mora), not two — say it quickly as a single glide.</p>` },
        { heading: "The yōon grid", html:
          `<table class="kana-grid">
             <tr><th></th><th>ya</th><th>yu</th><th>yo</th></tr>
             <tr><th>k</th><td>きゃ</td><td>きゅ</td><td>きょ</td></tr>
             <tr><th>sh</th><td>しゃ</td><td>しゅ</td><td>しょ</td></tr>
             <tr><th>ch</th><td>ちゃ</td><td>ちゅ</td><td>ちょ</td></tr>
             <tr><th>n</th><td>にゃ</td><td>にゅ</td><td>にょ</td></tr>
             <tr><th>h</th><td>ひゃ</td><td>ひゅ</td><td>ひょ</td></tr>
             <tr><th>m</th><td>みゃ</td><td>みゅ</td><td>みょ</td></tr>
             <tr><th>r</th><td>りゃ</td><td>りゅ</td><td>りょ</td></tr>
             <tr><th>g</th><td>ぎゃ</td><td>ぎゅ</td><td>ぎょ</td></tr>
             <tr><th>j</th><td>じゃ</td><td>じゅ</td><td>じょ</td></tr>
             <tr><th>b</th><td>びゃ</td><td>びゅ</td><td>びょ</td></tr>
             <tr><th>p</th><td>ぴゃ</td><td>ぴゅ</td><td>ぴょ</td></tr>
           </table>` },
        { heading: "They're everywhere", html:
          `<table class="ex-table">
             <tr><td>東京</td><td>とうきょう / Tōkyō</td><td>Tokyo</td></tr>
             <tr><td>お茶</td><td>おちゃ / ocha</td><td>tea</td></tr>
             <tr><td>百</td><td>ひゃく / hyaku</td><td>hundred</td></tr>
             <tr><td>会社</td><td>かいしゃ / kaisha</td><td>company</td></tr>
           </table>
           <div class="lesson-key"><b>Watch out:</b> a <b>big</b> や is its own beat (きや = ki-ya, two beats), a <b>small</b> ゃ glides (きゃ = kya, one beat). Size changes the word.</div>` },
      ],
      practice: [
        { label: "📖 Study Hiragana (Combos)", type: "study", sel: "hiragana#yoon" },
        { label: "🎮 Play the Hiragana game", type: "game", game: "hiragana" },
      ],
    },
    {
      id: "kana-extras", stage: "Foundations", title: "Long Vowels & Double Consonants",
      summary: "The small っ, long vowels, and the katakana ー — length changes meaning.",
      sections: [
        { heading: "Japanese is rhythmic", html:
          `<p>Japanese is timed in even beats (mora). Two features stretch that rhythm — a held consonant and a held vowel — and <b>both can change a word's meaning</b>, so they're not optional decoration.</p>` },
        { heading: "The small tsu (っ)", html:
          `<p>A <b>small</b> っ (half-size つ) marks a brief pause — it doubles the next consonant. You hold your mouth for one silent beat, then release:</p>
           <table class="ex-table">
             <tr><td>かこ</td><td>kako</td><td>past</td></tr>
             <tr><td>かっこ</td><td>kakko</td><td>parentheses</td></tr>
             <tr><td>きて</td><td>kite</td><td>come (please)</td></tr>
             <tr><td>きって</td><td>kitte</td><td>stamp</td></tr>
           </table>
           <p>In rōmaji the doubled letter shows it: kit<b>t</b>e, gak<b>k</b>ō, zas<b>s</b>hi.</p>` },
        { heading: "Long vowels", html:
          `<p>Holding a vowel longer is a full extra beat, and can change the word entirely:</p>
           <table class="ex-table">
             <tr><td>おばさん</td><td>obasan</td><td>aunt / middle-aged woman</td></tr>
             <tr><td>おばあさん</td><td>obāsan</td><td>grandmother</td></tr>
             <tr><td>ゆき</td><td>yuki</td><td>snow</td></tr>
             <tr><td>ゆうき</td><td>yūki</td><td>courage</td></tr>
           </table>
           <p>In <b>hiragana</b>, long vowels are written by adding the matching vowel: ああ, いい, うう, ええ. Special cases: long "o" is usually written おう (とう = tō), and long "e" is often えい (せんせい = sensē).</p>` },
        { heading: "Katakana takes a shortcut", html:
          `<p>In <b>katakana</b>, any long vowel just uses a bar: <b>ー</b>.</p>
           <table class="ex-table">
             <tr><td>コーヒー</td><td>kōhī</td><td>coffee</td></tr>
             <tr><td>ラーメン</td><td>rāmen</td><td>ramen</td></tr>
             <tr><td>ケーキ</td><td>kēki</td><td>cake</td></tr>
           </table>
           <p>The “Advanced Kana” deck drills these length patterns directly.</p>` },
      ],
      practice: [
        { label: "📖 Study Advanced Kana", type: "study", sel: "advanced" },
        { label: "🎮 Drill kana in the game", type: "game", game: "hiragana" },
      ],
    },
    {
      id: "katakana", stage: "Foundations", title: "Katakana: the Second Alphabet",
      summary: "Same sounds as hiragana, sharper shapes, used for loanwords.",
      sections: [
        { heading: "Same sounds, different costume", html:
          `<p>Katakana maps to the <b>exact same sound system</b> as hiragana — あ/ア are both <i>a</i>, か/カ both <i>ka</i>. Only the shapes differ: katakana is angular and sharp.</p>
           <p>Because you already know the sounds, this is <b>recognition practice</b>, not new theory. The grid, dakuten and yōon all work identically.</p>` },
        { heading: "When katakana is used", html:
          `<ul>
             <li><b>Loanwords</b> from other languages: テレビ (terebi, TV), パン (pan, bread), アイス (aisu, ice cream).</li>
             <li><b>Foreign names & places:</b> アメリカ (Amerika), ジョン (John).</li>
             <li><b>Onomatopoeia & sound effects:</b> ワンワン (woof), ドキドキ (heartbeat).</li>
             <li><b>Emphasis</b> — like writing a word in italics or ALL CAPS.</li>
             <li><b>Scientific names</b> of plants/animals, and many company/product names.</li>
           </ul>` },
        { heading: "Look-alikes to separate", html:
          `<p>A few katakana are easy to confuse — study them deliberately, watching stroke direction:</p>
           <ul>
             <li>シ <i>shi</i> vs ツ <i>tsu</i> (shi's strokes sweep up; tsu's come down)</li>
             <li>ン <i>n</i> vs ソ <i>so</i></li>
             <li>ク <i>ku</i> vs ワ <i>wa</i> vs ケ <i>ke</i></li>
             <li>ノ <i>no</i> vs メ <i>me</i> vs ヌ <i>nu</i></li>
           </ul>` },
        { heading: "Extended katakana", html:
          `<p>To spell foreign sounds Japanese lacks, katakana combines characters with small vowels: <b>ファ</b> (fa), <b>ティ</b> (ti), <b>ウィ</b> (wi), <b>ヴ</b> (vu). You'll see フォーク (fōku, fork), パーティー (pātī, party). No need to drill these in isolation — recognize them in words.</p>` },
      ],
      practice: [
        { label: "📖 Study Katakana", type: "study", sel: "katakana" },
        { label: "🎮 Play the Katakana game", type: "game", game: "katakana" },
      ],
    },

    {
      id: "pronunciation", stage: "Foundations", title: "Pronunciation & Pitch Accent",
      summary: "Mora timing, pure vowels, devoicing, and the pitch that English speakers miss.",
      sections: [
        { heading: "Count beats, not syllables", html:
          `<p>Japanese rhythm is built from the <b>mora</b> — a unit of equal length. Every kana is exactly one beat, and so are three things English speakers tend to rush:</p>
           <ul>
             <li>The small <b>っ</b> (a held pause): き<b>っ</b>て (<i>ki-t-te</i>, "stamp") is three beats, not two.</li>
             <li>The final <b>ん</b>: にほ<b>ん</b> (<i>ni-ho-n</i>) is three beats.</li>
             <li>A <b>long vowel</b>: おばあさん (grandmother) holds あ for two beats — おばさん (aunt) is a different word.</li>
           </ul>
           <p>Tap a steady beat and give each mora one tap. Even, machine-like timing already sounds more native than perfect consonants do.</p>` },
        { heading: "Five pure vowels", html:
          `<p>The five vowels never glide or change, no matter the word:</p>
           <p style="font-size:1.3rem">あ <i>a</i> (ah) ・ い <i>i</i> (ee) ・ う <i>u</i> (oo) ・ え <i>e</i> (eh) ・ お <i>o</i> (oh)</p>
           <p>English vowels drift into diphthongs ("oh" really glides to "ow"). Japanese keeps each one short, flat, and clean. Holding a vowel <i>twice as long</i> is the only change it ever makes.</p>` },
        { heading: "Pitch accent: 箸 vs 橋", html:
          `<p>Japanese isn't <i>stressed</i> like English (PHO-to-graph). Instead each word has a <b>pitch</b> pattern — mora ride high or low. In standard Tokyo speech, はし changes meaning by pitch alone:</p>
           <table class="ex-table">
             <tr><td>箸</td><td>HA-shi (high–low)</td><td>chopsticks</td></tr>
             <tr><td>橋</td><td>ha-SHI (low–high)</td><td>bridge</td></tr>
             <tr><td>端</td><td>ha-SHI (low–high, stays up)</td><td>edge</td></tr>
           </table>
           <p>A rule of thumb: the first two mora are almost always <b>different</b> pitches, and once the pitch drops it stays down. You don't need every word's accent memorized — but training your ear to hear the up/down makes you sound dramatically more natural.</p>` },
        { heading: "Silent vowels (devoicing)", html:
          `<p>The vowels <b>i</b> and <b>u</b> often go nearly silent between two voiceless consonants, or at the end of a word:</p>
           <ul>
             <li>です sounds like <i>des</i> (the う almost vanishes).</li>
             <li>すき (like) sounds like <i>ski</i>.</li>
             <li>〜ます endings sound like <i>-mas</i>.</li>
             <li>ひと (person) leans toward <i>h'to</i>.</li>
           </ul>
           <p>Don't force the vowel back in — letting it drop is what makes speech sound effortless and real.</p>` },
        { heading: "How to train it", html:
          `<div class="lesson-key"><b>Method:</b> shadowing. Play a short native clip, then say it <i>at the same time</i>, copying the melody and rhythm — not just the words.</div>
           <p>Use the flashcard audio (the 🔊 button) to hear each item, then repeat aloud, matching length and pitch. Getting <b>rhythm and pitch</b> right buys you more comprehensibility than any single consonant.</p>` },
      ],
      practice: [
        { label: "📖 Study Hiragana (Basic)", type: "study", sel: "hiragana#basic" },
        { label: "🎮 Play the Hiragana game", type: "game", game: "hiragana" },
      ],
    },
    {
      id: "kanji-readings", stage: "Foundations", title: "How Kanji Work: Readings, Radicals & Strokes",
      summary: "On'yomi vs kun'yomi, okurigana, the building blocks, and stroke order.",
      sections: [
        { heading: "Two kinds of reading", html:
          `<p>Most kanji have (at least) two readings, and which one you use depends on context:</p>
           <ul>
             <li><b>Kun'yomi</b> (訓読み) — the native Japanese reading, used when the kanji stands alone or with a kana tail. 水 on its own is <b>みず</b> (water).</li>
             <li><b>On'yomi</b> (音読み) — the reading borrowed from Chinese, used mostly in <i>compounds</i> of two or more kanji. 水曜日 (Wednesday) reads 水 as <b>すい</b>.</li>
           </ul>
           <p>Rule of thumb: <b>kanji + kana = kun</b>, <b>kanji + kanji = on</b>. There are exceptions, but it's right often enough to be a real guide.</p>` },
        { heading: "Okurigana: the kana tail", html:
          `<p>When a kanji is part of a verb or adjective, the changeable ending is written in hiragana — the <b>okurigana</b>:</p>
           <table class="ex-table">
             <tr><td>食べる</td><td>ta-beru</td><td>to eat (べる can conjugate)</td></tr>
             <tr><td>食べました</td><td>ta-bemashita</td><td>ate (the 食 stays, the tail changes)</td></tr>
             <tr><td>大きい</td><td>ō-kii</td><td>big (adjective ending)</td></tr>
           </table>
           <p>The kanji holds the meaning; the okurigana shows the grammar. That's why the same 食 appears in 食べる, 食事 (meal), and 朝食 (breakfast) with different readings.</p>` },
        { heading: "Radicals: the building blocks", html:
          `<p>Kanji are made of recurring parts called <b>radicals</b> (部首). Learning them turns scary characters into combinations you can recognize — and many hint at meaning:</p>
           <table class="ex-table">
             <tr><td>氵</td><td>water</td><td>海 (sea), 河 (river), 泳 (swim)</td></tr>
             <tr><td>木</td><td>tree / wood</td><td>林 (woods), 森 (forest), 村 (village)</td></tr>
             <tr><td>亻</td><td>person</td><td>休 (rest = person + tree), 体 (body)</td></tr>
             <tr><td>口</td><td>mouth</td><td>名 (name), 味 (taste), 呼 (call)</td></tr>
           </table>
           <p>Read 休 as "a person 亻 leaning on a tree 木 = rest" and it sticks far better than memorizing strokes blindly.</p>` },
        { heading: "Stroke order matters", html:
          `<p>Kanji are written in a fixed stroke order, and it isn't arbitrary — it makes characters legible, balanced, and quick to write. The core rules:</p>
           <ul>
             <li><b>Top to bottom</b>, and <b>left to right</b>.</li>
             <li>Horizontal strokes usually come <b>before</b> a crossing vertical (十 = horizontal, then vertical).</li>
             <li>Outside frame before the inside; the closing bottom stroke comes last (国).</li>
             <li>A central stroke before symmetric sides (小).</li>
           </ul>
           <p>Correct order also makes your handwriting recognizable and helps you read others' fast, cursive writing.</p>` },
        { heading: "The smart way to study kanji", html:
          `<div class="lesson-key"><b>Don't learn kanji in isolation.</b> Learn them inside <i>words</i> you'll actually use — that teaches the meaning, the reading, and the context all at once.</div>
           <p>Meet a character with the flashcards, notice its radical and likely readings, then cement it by reading it in real vocabulary. Recognition first; handwriting can come later if you want it.</p>` },
      ],
      practice: [
        { label: "📖 Study N5 Kanji", type: "study", sel: "n5" },
        { label: "🎮 Play the N5 Kanji game", type: "game", game: "n5" },
      ],
    },

    {
      id: "names-titles", stage: "Foundations", title: "Names, Titles & Addressing People",
      summary: "Family-name-first, the suffixes (さん/様/君/ちゃん), and how to address people politely.",
      sections: [
        { heading: "Surname comes first", html:
          `<p>In Japanese, the <b>family name leads</b> and the given name follows: 山田太郎 is "Yamada (surname) Taro (given)". In Japanese settings you'll be introduced and addressed by your <i>surname</i> — given names are reserved for family and close friends.</p>
           <p>So you'd call a coworker 田中さん (Tanaka-san), almost never by their first name.</p>` },
        { heading: "The honorific suffixes", html:
          `<p>A name almost never stands bare — it takes a suffix that signals the relationship:</p>
           <table class="ex-table">
             <tr><td>〜さん</td><td>the default polite "Mr./Ms." — safe for almost anyone</td></tr>
             <tr><td>〜様 (さま)</td><td>very respectful — customers, letters, formal service</td></tr>
             <tr><td>〜君 (くん)</td><td>juniors / younger males / classmates</td></tr>
             <tr><td>〜ちゃん</td><td>affectionate — children, close friends, pets</td></tr>
             <tr><td>〜先生 (せんせい)</td><td>teachers, doctors, and other experts</td></tr>
           </table>
           <p>One firm rule: <b>never attach さん or 様 to your own name</b> — it's like calling yourself "Mr." It's only ever for others.</p>` },
        { heading: "Titles instead of names", html:
          `<p>Job and role titles often <i>replace</i> さん, and can stand alone or follow the surname:</p>
           <ul>
             <li>社長 (company president), 部長 (department head), 店長 (shop manager).</li>
             <li>田中部長 = "Department Head Tanaka"; or just 部長 ("boss") on its own.</li>
             <li>お客様 (customer) is the all-purpose respectful term in any shop or service.</li>
           </ul>` },
        { heading: "\"You\" is a trap", html:
          `<p>Textbook "you" — <b>あなた</b> — is <i>not</i> a safe default; to a superior it can sound blunt or even cold. The natural move is to use the person's <b>name + suffix</b> where English would say "you":</p>
           <p>田中さんは コーヒーを 飲みますか = "Tanaka-san, will <u>you</u> have coffee?"</p>
           <div class="lesson-key"><b>When in doubt:</b> surname + さん is almost always right. Dropping the suffix entirely (呼び捨て) is reserved for close friends — using it too early reads as rude.</div>` },
      ],
      practice: [
        { label: "📖 N3 Basic Honorifics", type: "study", sel: "n3keigohonor" },
        { label: "📖 N4 Daily Conversation", type: "study", sel: "n4phrdaily" },
      ],
    },
    {
      id: "rendaku", stage: "Foundations", title: "Rendaku: Why Readings Change in Compounds",
      summary: "The voicing shift (か→が, は→ば) that makes 紙 become がみ when words combine.",
      sections: [
        { heading: "What rendaku is", html:
          `<p>When two words join into a compound, the second word's first consonant often <b>voices</b> — a sound change called <b>rendaku</b> (連濁, "sequential voicing"). The unvoiced sound gains a dakuten:</p>
           <p style="font-size:1.15rem">か→が ・ さ→ざ ・ た→だ ・ は→ば・ぱ</p>
           <p>So ひと + ひと becomes ひと<b>び</b>と (people), and て + かみ becomes て<b>が</b>み (letter). The second element's meaning is unchanged — only its first sound shifts.</p>` },
        { heading: "Common examples", html:
          `<table class="ex-table">
             <tr><td>花 (はな) + 火 (ひ)</td><td>花火 はな<b>び</b></td><td>fireworks</td></tr>
             <tr><td>折り + 紙 (かみ)</td><td>折り紙 おり<b>が</b>み</td><td>origami</td></tr>
             <tr><td>島 (しま) + 国 (くに)</td><td>島国 しま<b>ぐ</b>に</td><td>island nation</td></tr>
             <tr><td>時 (とき) + 時</td><td>時々 とき<b>ど</b>き</td><td>sometimes</td></tr>
             <tr><td>人 (ひと) + 人</td><td>人々 ひと<b>び</b>と</td><td>people</td></tr>
           </table>` },
        { heading: "When it doesn't happen", html:
          `<p>Rendaku is a <i>tendency</i>, not an absolute rule, and it's blocked in some cases — most famously when the second element already contains a voiced sound later in the word (this is called <b>Lyman's Law</b>):</p>
           <ul>
             <li>やま + かぜ stays 山<b>か</b>ぜ-like patterns rather than voicing, because かぜ already has a voiced ぜ.</li>
             <li>Coordinate compounds ("A and B") usually don't voice.</li>
           </ul>
           <p>Don't memorize the exceptions — just know that not every compound voices.</p>` },
        { heading: "Related: gemination in on-compounds", html:
          `<p>A cousin sound-change appears in kanji read with on'yomi: a consonant doubles (the small っ) or an h-sound becomes p:</p>
           <ul>
             <li>学 (がく) + 校 (こう) → 学校 が<b>っ</b>こう.</li>
             <li>一 (いち) + 本 (ほん) → 一本 い<b>っ</b>ぽん.</li>
           </ul>
           <div class="lesson-key"><b>Why it helps:</b> you won't apply these consciously — but recognizing the pattern stops you from being thrown when 紙 shows up as がみ or 校 as こう/っこう, and makes guessing new readings far easier.</div>` },
      ],
      practice: [
        { label: "📖 Study N5 Kanji", type: "study", sel: "n5" },
        { label: "🎮 Play the N5 Kanji game", type: "game", game: "n5" },
      ],
    },

    {
      id: "how-to-study", stage: "Foundations", title: "How to Study Japanese (and Use This App)",
      summary: "Spaced repetition, immersion, and building a habit that actually sticks.",
      sections: [
        { heading: "Train three skills, not one", html:
          `<p>It's tempting to only drill flashcards, but fluency needs three muscles working together:</p>
           <ul>
             <li><b>Recognition</b> — reading kana/kanji and understanding words on sight.</li>
             <li><b>Recall</b> — producing words and grammar yourself (the harder direction).</li>
             <li><b>Listening</b> — parsing real speech at real speed.</li>
           </ul>
           <p>Flashcards build recognition fast; balance them with output (saying/writing sentences) and lots of listening, or one skill races ahead of the others.</p>` },
        { heading: "Spaced repetition: review before you forget", html:
          `<p>Memory fades on a curve. The trick is to review an item <i>just</i> as it's about to slip — frequently at first, then less often. This is <b>spaced repetition</b>, and it's why little-and-often beats one long cram:</p>
           <p>Fifteen focused minutes daily will outperform a three-hour weekend session every time. Use the flashcards to meet items and the game to force quick recall under pressure.</p>` },
        { heading: "Immersion & comprehensible input", html:
          `<p>Grammar rules tell you <i>why</i>; exposure makes it <i>automatic</i>. Feed yourself Japanese that's a little above your level — where you understand most and stretch for the rest:</p>
           <ul>
             <li>Reading: graded readers, NHK News Web Easy, simple manga.</li>
             <li>Listening: beginner podcasts, anime/drama with Japanese subtitles.</li>
           </ul>
           <p>The sheer <b>volume</b> of input is what turns studied patterns into intuition.</p>` },
        { heading: "Getting the most from this app", html:
          `<table class="ex-table">
             <tr><td>Learn path</td><td>understand each concept before drilling it</td></tr>
             <tr><td>Flashcards</td><td>meet and review items; flip for reading + meaning</td></tr>
             <tr><td>Game</td><td>build recognition <i>speed</i> until it's automatic</td></tr>
             <tr><td>🔊 audio</td><td>hear native pronunciation and shadow it aloud</td></tr>
             <tr><td>Stats &amp; streaks</td><td>keep yourself honest and motivated</td></tr>
           </table>` },
        { heading: "Make it a habit", html:
          `<div class="lesson-key"><b>Consistency beats intensity.</b> A short session every day — even five minutes — compounds far faster than occasional marathons. Protect the streak, set one concrete goal (a JLPT level, a book you want to read), and let the daily reps carry you there.</div>` },
      ],
      practice: [
        { label: "📖 Study Hiragana (Basic)", type: "study", sel: "hiragana#basic" },
        { label: "🎮 Play the Hiragana game", type: "game", game: "hiragana" },
      ],
    },

    {
      id: "pitch-accent", stage: "Foundations", title: "Pitch Accent: A Deeper Look",
      summary: "The four accent patterns, minimal pairs, and the one 'downstep' rule behind them.",
      sections: [
        { heading: "One word, one possible drop", html:
          `<p>You met pitch in the Pronunciation lesson; here's the system. A Tokyo-Japanese word's accent is simply <b>where the pitch falls</b> — if it falls at all. The key rules: the first two mora are different pitches, and once the pitch drops, it <i>stays</i> down. A word has at most <b>one</b> drop.</p>
           <p>So "knowing a word's accent" just means knowing where (or whether) that single downstep happens.</p>` },
        { heading: "The four patterns", html:
          `<table class="ex-table">
             <tr><td><b>平板</b> heiban</td><td>no drop — rises and stays high</td><td>さくら (LHH), most common</td></tr>
             <tr><td><b>頭高</b> atamadaka</td><td>high on mora 1, drops at once</td><td>ねこ (HL, cat)</td></tr>
             <tr><td><b>中高</b> nakadaka</td><td>rises, then drops in the middle</td><td>おかし (LHL, snack)</td></tr>
             <tr><td><b>尾高</b> odaka</td><td>high to the end — the drop hits the next particle</td><td>おとこ＋が (otoko stays high, が drops)</td></tr>
           </table>` },
        { heading: "Minimal pairs", html:
          `<p>Pitch alone can change the word — these are identical in kana:</p>
           <table class="ex-table">
             <tr><td>雨 あめ (HL)</td><td>vs 飴 あめ (LH)</td><td>rain vs candy</td></tr>
             <tr><td>箸 はし (HL)</td><td>vs 橋 はし (LH)</td><td>chopsticks vs bridge</td></tr>
             <tr><td>神 かみ (HL)</td><td>vs 紙 かみ (LH)</td><td>god vs paper</td></tr>
           </table>` },
        { heading: "The particle test", html:
          `<p>平板 and 尾高 words both rise and stay high <i>on the word itself</i> — so how do you tell them apart? Attach a particle: with 尾高 the particle <b>drops</b> low (橋が = hashi-GA falls), while with 平板 it stays <b>high</b> (端が stays level). The accent reveals itself on what follows.</p>` },
        { heading: "How much should you care?", html:
          `<div class="lesson-key"><b>Aim for the melody, not a lookup table.</b> Don't memorize every word's pattern. Learn the heiban default and the common atamadaka exceptions, and absorb the rest by <i>shadowing</i> native audio. Dictionaries do mark accent with a number (0 = heiban) if you want to check a specific word.</div>` },
      ],
      practice: [
        { label: "📖 Study Hiragana (Basic)", type: "study", sel: "hiragana#basic" },
        { label: "🎮 Play the Hiragana game", type: "game", game: "hiragana" },
      ],
    },

    // ============================ Beginner · N5 ============================
    {
      id: "n5-kanji", stage: "Beginner · N5", title: "Your First Kanji",
      summary: "Meaning-carrying characters, their two reading types, and how to study them.",
      sections: [
        { heading: "Kanji carry meaning", html:
          `<p>Unlike kana, each <b>kanji</b> stands for an idea: 山 = mountain, 水 = water, 人 = person, 日 = sun/day. They make text compact and instantly readable once you know them — your eyes grab meaning without sounding anything out.</p>` },
        { heading: "On'yomi and kun'yomi", html:
          `<p>Most kanji have <b>two kinds of readings</b>:</p>
           <ul>
             <li><b>Kun'yomi</b> — the native Japanese reading, often used when the kanji stands alone or with hiragana endings: 山 = <i>yama</i>, 食べる = <i>ta</i>beru.</li>
             <li><b>On'yomi</b> — the reading borrowed from Chinese, used in compound words: 富士山 = Fuji<i>san</i>, 火山 = ka<i>zan</i> (volcano).</li>
           </ul>
           <div class="lesson-key"><b>Rule of thumb:</b> kanji alone or with okurigana (trailing hiragana) → usually kun'yomi. Two-kanji compound → usually on'yomi.</div>` },
        { heading: "Radicals: kanji are built from parts", html:
          `<p>Kanji aren't random scribbles — they're assembled from smaller components called <b>radicals</b>. Spotting them makes characters far easier to remember:</p>
           <ul>
             <li>木 (tree) appears in 林 (woods) and 森 (forest) — literally two and three trees.</li>
             <li>氵 (the "water" radical) hints at meaning in 海 (sea), 池 (pond), 泳 (swim).</li>
           </ul>
           <p>Use the kanji deck's <b>By Radical</b> view to learn families together.</p>` },
        { heading: "Use the stroke order", html:
          `<p>Each kanji flashcard animates its <b>stroke order</b>. Following it makes characters easier to remember and to write — there's a logic (top→bottom, left→right, horizontal-before-vertical) you'll start to feel after a dozen characters.</p>
           <div class="lesson-key"><b>Strategy:</b> learn the ~80 N5 kanji <b>inside words</b>, not as a flashcard wall of isolated symbols. Meeting 学 in 学生 (student) and 学校 (school) teaches the character and useful vocabulary at once.</div>` },
      ],
      practice: [
        { label: "📖 Study N5 Kanji", type: "study", sel: "n5" },
        { label: "🎮 Play the N5 Kanji game", type: "game", game: "n5" },
      ],
    },
    {
      id: "n5-numbers", stage: "Beginner · N5", title: "Numbers, Dates & Counters",
      summary: "Count, tell time and dates, and use Japanese counter words.",
      sections: [
        { heading: "The number system", html:
          `<p>Japanese numbers are wonderfully regular. Learn 1–10, then build up by combining:</p>
           <table class="kana-grid">
             <tr><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th></tr>
             <tr><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td><td>七</td><td>八</td><td>九</td><td>十</td></tr>
             <tr><td>ichi</td><td>ni</td><td>san</td><td>shi/yon</td><td>go</td><td>roku</td><td>shichi/nana</td><td>hachi</td><td>kyū/ku</td><td>jū</td></tr>
           </table>
           <p>11 is 十一 (jū-ichi, "ten-one"), 20 is 二十 (ni-jū, "two-ten"), 35 is 三十五. Then 百 = 100, 千 = 1,000, 万 = 10,000. Note 4 and 7 have two readings — <i>yon</i> and <i>nana</i> are the safe everyday choices.</p>` },
        { heading: "Counters", html:
          `<p>Japanese counts different things with different <b>counter</b> words — like "two <i>sheets</i> of paper" in English, but for everything:</p>
           <ul>
             <li>〜つ — general counter (ひとつ, ふたつ, みっつ…) for objects with no special counter</li>
             <li>〜人 (nin) — people (irregular: ひとり 1, ふたり 2)</li>
             <li>〜本 (hon) — long, thin things (pens, bottles, trains)</li>
             <li>〜枚 (mai) — flat, thin things (paper, plates, shirts)</li>
             <li>〜匹 (hiki) — small animals ・ 〜台 (dai) — machines/vehicles</li>
           </ul>
           <div class="lesson-key"><b>Sound changes:</b> 一本 = <i>ippon</i> (not "ichihon"), 三本 = <i>sanbon</i>, 六本 = <i>roppon</i>. These shifts are regular-ish — you'll absorb them with exposure.</div>` },
        { heading: "Time & dates", html:
          `<p>〜時 (ji) marks the hour, 〜分 (fun/pun) the minutes, 半 (han) means "half past". The days of the week all end in 〜曜日 (yōbi): 月曜日 (Monday), 火曜日 (Tuesday)… Days of the <i>month</i> have famously irregular readings (一日 = ついたち, 二日 = ふつか) — drill these in the Dates &amp; Time deck.</p>` },
      ],
      practice: [
        { label: "📖 Basic numbers", type: "study", sel: "n5numbers" },
        { label: "📖 Dates & Time", type: "study", sel: "n5datetime" },
        { label: "📖 Counters", type: "study", sel: "n5counters" },
        { label: "🎮 Play numbers", type: "game", game: "n5numbers" },
      ],
    },
    {
      id: "n5-vocab", stage: "Beginner · N5", title: "Core N5 Vocabulary",
      summary: "Build a starter vocabulary across nouns, verbs and adjectives.",
      sections: [
        { heading: "Words are where it clicks", html:
          `<p>With kana and a few kanji, you can start stacking <b>vocabulary</b>. The N5 set (~600–800 words) covers the most common everyday nouns, verbs, and adjectives — the words you'll use every single day. This is the biggest single lever on your comprehension.</p>` },
        { heading: "Two verb families", html:
          `<p>Every Japanese verb belongs to one of two groups, which conjugate differently:</p>
           <ul>
             <li><b>Godan</b> (う-verbs) — the larger group; the stem's last sound shifts through the う-row. 飲む (nomu) → 飲みます, 行く (iku) → 行きます.</li>
             <li><b>Ichidan</b> (る-verbs) — tidy: drop る, add the ending. 食べる (taberu) → 食べます, 見る (miru) → 見ます.</li>
           </ul>
           <p>(Plus two irregulars: する "to do" and 来る "to come".) Studying them in separate decks makes the patterns obvious before you hit conjugation at N4.</p>` },
        { heading: "Two adjective types", html:
          `<ul>
             <li><b>い-adjectives</b> end in い and act almost like verbs: 高い (takai, expensive), 高くない (not expensive), 高かった (was expensive).</li>
             <li><b>な-adjectives</b> attach with な before a noun: 静かな部屋 (a quiet room), and use です/じゃない like nouns.</li>
           </ul>` },
        { heading: "How to study vocab efficiently", html:
          `<div class="lesson-key"><b>Tip:</b> learn words in small themed batches (food, places, time), flip the card to check the example sentence, then use the game for speed. Saying each word aloud locks in pronunciation and rhythm.</div>` },
      ],
      practice: [
        { label: "📖 All N5 Vocabulary", type: "study", sel: "n5vocab" },
        { label: "📖 Nouns", type: "study", sel: "n5nouns" },
        { label: "📖 Verbs (Godan)", type: "study", sel: "n5godan" },
        { label: "📖 い-Adjectives", type: "study", sel: "n5adji" },
        { label: "🎮 Play N5 Vocabulary", type: "game", game: "n5vocab" },
      ],
    },
    {
      id: "n5-particles", stage: "Beginner · N5", title: "Particles: the Glue",
      summary: "は, が, を, に, で, の and friends — the words that show who does what.",
      sections: [
        { heading: "Why particles matter", html:
          `<p>Japanese word order is flexible because tiny <b>particles</b> mark each word's <i>role</i> instead. They come <b>after</b> the word they apply to. Master a handful and sentences suddenly parse:</p>
           <table class="ex-table">
             <tr><td>は</td><td>wa</td><td>topic — "as for…"</td></tr>
             <tr><td>が</td><td>ga</td><td>subject — who/what does it</td></tr>
             <tr><td>を</td><td>o</td><td>direct object — what the verb acts on</td></tr>
             <tr><td>に</td><td>ni</td><td>time, destination, location of existence</td></tr>
             <tr><td>へ</td><td>e</td><td>direction (toward)</td></tr>
             <tr><td>で</td><td>de</td><td>place of action; means/tool</td></tr>
             <tr><td>の</td><td>no</td><td>possession / links two nouns</td></tr>
             <tr><td>と</td><td>to</td><td>"and" (lists); "with"</td></tr>
             <tr><td>も</td><td>mo</td><td>"also / too"</td></tr>
             <tr><td>から / まで</td><td>kara / made</td><td>from / until</td></tr>
           </table>` },
        { heading: "See them at work", html:
          `<table class="ex-table">
             <tr><td>私は学生です。</td><td>watashi wa gakusei desu</td><td>I am a student.</td></tr>
             <tr><td>パンを食べます。</td><td>pan o tabemasu</td><td>I eat bread.</td></tr>
             <tr><td>学校へ行きます。</td><td>gakkō e ikimasu</td><td>I go to school.</td></tr>
             <tr><td>バスで行きます。</td><td>basu de ikimasu</td><td>I go by bus.</td></tr>
             <tr><td>私の本</td><td>watashi no hon</td><td>my book</td></tr>
           </table>` },
        { heading: "は vs が — the classic", html:
          `<p>Both can mark the "subject", but they do different jobs: <b>は</b> sets the <i>topic</i> (known/old information — "speaking of X…") while <b>が</b> introduces or emphasizes <i>new</i> information, or marks the subject of a description.</p>
           <ul>
             <li>猫<u>は</u>好きです — "As for cats, I like them." (topic)</li>
             <li>猫<u>が</u>好きです — "It's cats that I like." (identifies what)</li>
           </ul>
           <p>It feels fuzzy at first; exposure makes it natural — don't get stuck here.</p>` },
        { heading: "Easy mix-ups", html:
          `<ul>
             <li><b>に vs で</b>: に = where something <i>exists</i> or a <i>destination</i> (学校にいる); で = where an <i>action happens</i> (学校で勉強する).</li>
             <li><b>へ vs に</b> for direction overlap heavily; に is fine almost everywhere.</li>
           </ul>` },
      ],
      practice: [
        { label: "📖 Study N5 Particles", type: "study", sel: "n5particles" },
        { label: "🎮 Play Particles", type: "game", game: "n5particles" },
      ],
    },
    {
      id: "n5-grammar", stage: "Beginner · N5", title: "Building Sentences",
      summary: "です, asking questions with か, negatives, and this/that words.",
      sections: [
        { heading: "A is B — です", html:
          `<p>The core sentence pattern: <b>AはBです</b> = "A is B". です is the polite "to be / it is". Its plain form is だ.</p>
           <table class="ex-table">
             <tr><td>私は学生です。</td><td>watashi wa gakusei desu</td><td>I am a student.</td></tr>
             <tr><td>これは本です。</td><td>kore wa hon desu</td><td>This is a book.</td></tr>
           </table>` },
        { heading: "Questions with か", html:
          `<p>Add <b>か</b> to the end and you have a question — no word-order change, no rising punctuation needed:</p>
           <table class="ex-table">
             <tr><td>学生ですか。</td><td>gakusei desu ka</td><td>Are you a student?</td></tr>
             <tr><td>これは何ですか。</td><td>kore wa nan desu ka</td><td>What is this?</td></tr>
           </table>
           <p>Combine with question words: 何 (nani/nan, what), どこ (where), だれ (who), いつ (when), どう (how), いくら (how much).</p>` },
        { heading: "Negatives", html:
          `<p>Three patterns by word type (polite):</p>
           <table class="ex-table">
             <tr><td>nouns / な-adj</td><td>じゃありません</td><td>学生じゃありません — not a student</td></tr>
             <tr><td>verbs</td><td>〜ません</td><td>食べません — don't eat</td></tr>
             <tr><td>い-adjectives</td><td>〜くないです</td><td>高くないです — not expensive</td></tr>
           </table>` },
        { heading: "This, that, that over there", html:
          `<p>The <b>こそあど</b> set marks distance from speaker and listener:</p>
           <table class="kana-grid">
             <tr><th></th><th>near me</th><th>near you</th><th>over there</th><th>which?</th></tr>
             <tr><th>thing</th><td>これ</td><td>それ</td><td>あれ</td><td>どれ</td></tr>
             <tr><th>+ noun</th><td>この</td><td>その</td><td>あの</td><td>どの</td></tr>
             <tr><th>place</th><td>ここ</td><td>そこ</td><td>あそこ</td><td>どこ</td></tr>
           </table>` },
        { heading: "There is / there are", html:
          `<p>Existence uses two verbs: <b>あります</b> for inanimate things, <b>います</b> for living things. 本があります (there is a book), 猫がいます (there is a cat). The thing that exists is usually marked with が, and its location with に.</p>` },
      ],
      practice: [
        { label: "📖 Sentence structure", type: "study", sel: "n5gramstruct" },
        { label: "📖 Question forms", type: "study", sel: "n5gramq" },
        { label: "📖 Negative forms", type: "study", sel: "n5gramneg" },
      ],
    },
    {
      id: "n5-phrases", stage: "Beginner · N5", title: "Everyday Phrases",
      summary: "Greetings, introductions, classroom and shopping set phrases.",
      sections: [
        { heading: "Speak from day one", html:
          `<p>Set phrases let you communicate before you've mastered grammar. Memorize them as whole chunks — you'll naturally pick apart the grammar later.</p>` },
        { heading: "Greetings by time of day", html:
          `<table class="ex-table">
             <tr><td>おはようございます</td><td>ohayō gozaimasu</td><td>Good morning (polite)</td></tr>
             <tr><td>こんにちは</td><td>konnichiwa</td><td>Hello / Good afternoon</td></tr>
             <tr><td>こんばんは</td><td>konbanwa</td><td>Good evening</td></tr>
             <tr><td>おやすみなさい</td><td>oyasuminasai</td><td>Good night</td></tr>
             <tr><td>さようなら</td><td>sayōnara</td><td>Goodbye</td></tr>
           </table>` },
        { heading: "Introductions", html:
          `<p>The standard first-meeting ritual:</p>
           <table class="ex-table">
             <tr><td>はじめまして</td><td>hajimemashite</td><td>Nice to meet you (first time)</td></tr>
             <tr><td>〜と申します</td><td>… to mōshimasu</td><td>My name is … (humble)</td></tr>
             <tr><td>よろしくおねがいします</td><td>yoroshiku onegaishimasu</td><td>Please treat me well / pleased to meet you</td></tr>
           </table>` },
        { heading: "Politeness formulas", html:
          `<table class="ex-table">
             <tr><td>ありがとうございます</td><td>arigatō gozaimasu</td><td>Thank you</td></tr>
             <tr><td>すみません</td><td>sumimasen</td><td>Excuse me / sorry / thanks</td></tr>
             <tr><td>おねがいします</td><td>onegaishimasu</td><td>Please (do me a favor)</td></tr>
             <tr><td>いただきます / ごちそうさま</td><td>itadakimasu / gochisōsama</td><td>before / after eating</td></tr>
           </table>
           <p>すみません is a Swiss-army phrase — it apologizes, gets attention, and thanks, all depending on context.</p>` },
        { heading: "Shopping & classroom survival", html:
          `<table class="ex-table">
             <tr><td>いくらですか。</td><td>ikura desu ka</td><td>How much is it?</td></tr>
             <tr><td>これをください。</td><td>kore o kudasai</td><td>This one, please.</td></tr>
             <tr><td>わかりました / わかりません</td><td>wakarimashita / wakarimasen</td><td>I understand / I don't understand</td></tr>
             <tr><td>もう一度おねがいします。</td><td>mō ichido onegaishimasu</td><td>Once more, please.</td></tr>
           </table>` },
      ],
      practice: [
        { label: "📖 Greetings", type: "study", sel: "n5greetings" },
        { label: "📖 Introductions", type: "study", sel: "n5intro" },
        { label: "📖 Classroom phrases", type: "study", sel: "n5classroom" },
        { label: "📖 Shopping basics", type: "study", sel: "n5shopping" },
      ],
    },

    {
      id: "verb-groups", stage: "Beginner · N5", title: "Verb Groups & the Conjugation System",
      summary: "The three verb types — and why everything in Japanese grammar depends on them.",
      sections: [
        { heading: "Three groups, and why they matter", html:
          `<p>Before you can conjugate <i>anything</i>, you have to know which of three groups a verb belongs to. Every tense, negative, and polite form follows from this one fact:</p>
           <table class="ex-table">
             <tr><td><b>Group 1</b></td><td>godan / う-verbs</td><td>飲む, 書く, 話す, 待つ, 帰る</td></tr>
             <tr><td><b>Group 2</b></td><td>ichidan / る-verbs</td><td>食べる, 見る, 起きる, 寝る</td></tr>
             <tr><td><b>Group 3</b></td><td>irregular</td><td>する (do), 来る (come)</td></tr>
           </table>
           <p>Group 2 is the easy one: drop る and add the ending. Group 1 changes the final sound. Group 3 is just two verbs you memorize.</p>` },
        { heading: "Telling Group 1 and Group 2 apart", html:
          `<p>Both can end in る, so how do you tell them apart? Look at the vowel <i>before</i> the final る:</p>
           <ul>
             <li>If it's an <b>-iru</b> or <b>-eru</b> sound, it's <i>usually</i> Group 2: 食べる (tab<b>e</b>-ru), 見る (m<b>i</b>-ru), 起きる (ok<b>i</b>-ru).</li>
             <li>Any other vowel (-aru, -uru, -oru) is Group 1: 分かる, 作る, 乗る, 降る.</li>
           </ul>
           <p>Watch out for famous <b>exceptions</b> that look like Group 2 but conjugate as Group 1: 帰る (return), 入る (enter), 走る (run), 切る (cut), 知る (know), 要る (need). When in doubt, the flashcards label each verb's group.</p>` },
        { heading: "The masu-form & the dictionary form", html:
          `<p>You'll meet every verb in two shapes. The <b>dictionary form</b> (plain) is how it's listed: 飲む. The <b>masu-form</b> is the polite present: 飲みます. To build the masu-form you change the verb's <i>stem</i>:</p>
           <table class="ex-table">
             <tr><td>Group 1</td><td>final う-sound → い-sound + ます</td><td>飲む → 飲みます</td></tr>
             <tr><td>Group 2</td><td>drop る + ます</td><td>食べる → 食べます</td></tr>
             <tr><td>Group 3</td><td>memorize</td><td>する → します ・ 来る → 来ます</td></tr>
           </table>` },
        { heading: "Everything branches from here", html:
          `<p>That same group knowledge powers every form you'll learn — negative, past, te-form, potential, passive, causative. For Group 1, you shift the final sound along the あ/い/う/え/お row; for Group 2, you just swap the ending onto the stem.</p>
           <div class="lesson-key"><b>Takeaway:</b> the moment you meet a new verb, ask "which group?" Get that reflex and conjugation stops being memorization and becomes a system.</div>` },
      ],
      practice: [
        { label: "📖 Study N5 Godan Verbs", type: "study", sel: "n5godan" },
        { label: "📖 Study N5 Ichidan Verbs", type: "study", sel: "n5ichidan" },
        { label: "🎮 Play N5 Godan Verbs", type: "game", game: "n5godan" },
      ],
    },
    {
      id: "adjectives", stage: "Beginner · N5", title: "Adjectives: い and な",
      summary: "Two types of adjective, how each conjugates, and how to turn them into adverbs.",
      sections: [
        { heading: "Two families", html:
          `<p>Japanese adjectives come in two types, and they behave differently:</p>
           <ul>
             <li><b>い-adjectives</b> end in い and conjugate by themselves: 高い (expensive), 大きい (big), 新しい (new), おいしい (tasty).</li>
             <li><b>な-adjectives</b> act more like nouns and take な before a noun: 静か (quiet), 便利 (convenient), 好き (liked), きれい (pretty).</li>
           </ul>
           <p>Heads-up: きれい and 嫌い (kirai, disliked) end in い but are <b>な-adjectives</b> — the い is part of the word, not a conjugating ending.</p>` },
        { heading: "Conjugating い-adjectives", html:
          `<p>The final い does the work — drop it and add the ending:</p>
           <table class="ex-table">
             <tr><td>present</td><td>高い</td><td>is expensive</td></tr>
             <tr><td>negative</td><td>高くない</td><td>is not expensive</td></tr>
             <tr><td>past</td><td>高かった</td><td>was expensive</td></tr>
             <tr><td>neg. past</td><td>高くなかった</td><td>was not expensive</td></tr>
             <tr><td>te-form</td><td>高くて</td><td>expensive and… (linking)</td></tr>
           </table>
           <p>One irregular: いい (good) conjugates from よ — よくない, よかった, よくて.</p>` },
        { heading: "Conjugating な-adjectives", html:
          `<p>These borrow the copula です / だ, just like nouns:</p>
           <table class="ex-table">
             <tr><td>before a noun</td><td>静かな部屋</td><td>a quiet room</td></tr>
             <tr><td>present</td><td>静かだ / です</td><td>is quiet</td></tr>
             <tr><td>negative</td><td>静かじゃない</td><td>is not quiet</td></tr>
             <tr><td>past</td><td>静かだった</td><td>was quiet</td></tr>
             <tr><td>te-form</td><td>静かで</td><td>quiet and… (linking)</td></tr>
           </table>` },
        { heading: "Making adverbs", html:
          `<p>Turn an adjective into an adverb ("quickly", "quietly") with a tiny change:</p>
           <ul>
             <li><b>い-adjective</b>: い → く. 早い (fast) → 早く 走る (run fast).</li>
             <li><b>な-adjective</b>: + に. 静か → 静かに 話す (speak quietly).</li>
           </ul>
           <div class="lesson-key"><b>First question for any new adjective:</b> い or な? That decides how it conjugates and how it attaches to a noun.</div>` },
      ],
      practice: [
        { label: "📖 Study N5 い-Adjectives", type: "study", sel: "n5adji" },
        { label: "📖 Study N5 な-Adjectives", type: "study", sel: "n5adjna" },
        { label: "🎮 Play N5 い-Adjectives", type: "game", game: "n5adji" },
      ],
    },
    {
      id: "kosoado", stage: "Beginner · N5", title: "This, That & the こそあど System",
      summary: "A tidy grid for pointing at things, places, and ideas — near, far, and unknown.",
      sections: [
        { heading: "One pattern, four distances", html:
          `<p>A huge family of pointing words follows a single grid. The first sound tells you the distance:</p>
           <table class="ex-table">
             <tr><td><b>こ</b>-</td><td>near the speaker</td><td>"this / here"</td></tr>
             <tr><td><b>そ</b>-</td><td>near the listener</td><td>"that / there (by you)"</td></tr>
             <tr><td><b>あ</b>-</td><td>far from both</td><td>"that over there"</td></tr>
             <tr><td><b>ど</b>-</td><td>question</td><td>"which? / where?"</td></tr>
           </table>
           <p>Learn the four prefixes once and a dozen words fall into place automatically.</p>` },
        { heading: "The full grid", html:
          `<table class="ex-table">
             <tr><td>things</td><td>これ・それ・あれ・どれ</td><td>this / that / that / which one</td></tr>
             <tr><td>+ noun</td><td>この・その・あの・どの</td><td>this ___ / that ___ / which ___</td></tr>
             <tr><td>places</td><td>ここ・そこ・あそこ・どこ</td><td>here / there / over there / where</td></tr>
             <tr><td>direction (polite)</td><td>こちら・そちら・あちら・どちら</td><td>this way / that way / which way</td></tr>
             <tr><td>kind</td><td>こんな・そんな・あんな・どんな</td><td>this kind of / what kind of</td></tr>
             <tr><td>manner</td><td>こう・そう・ああ・どう</td><td>like this / like that / how</td></tr>
           </table>` },
        { heading: "こ vs そ vs あ in real use", html:
          `<p>The distance can be physical <i>or</i> conversational:</p>
           <ul>
             <li><b>その</b> is for things in the listener's space — or something <i>they just mentioned</i>: "その話 (that story you brought up)".</li>
             <li><b>あの</b> is for things both of you can see far off — or <i>shared knowledge</i>: "あの店、よかったね (that shop we both know was nice)".</li>
             <li><b>あの…</b> on its own is also a spoken filler, like "um…".</li>
           </ul>
           <div class="lesson-key"><b>Tip:</b> when you forget a word mid-sentence, そう and どう are your friends — そうです ("that's right"), どうですか ("how is it?").</div>` },
      ],
      practice: [
        { label: "📖 All N5 Grammar", type: "study", sel: "n5gramall" },
        { label: "📖 Study Core N5 Vocabulary", type: "study", sel: "n5vocab" },
      ],
    },
    {
      id: "counters", stage: "Beginner · N5", title: "Counting Things: Counters",
      summary: "Why you can't just say a number — and the counter words that go with each kind of thing.",
      sections: [
        { heading: "Numbers need a counter", html:
          `<p>In Japanese you rarely count a noun with a bare number. You attach a <b>counter</b> that matches the <i>kind</i> of thing — a bit like English "two <i>sheets</i> of paper" or "three <i>cups</i> of coffee", but for almost everything.</p>
           <p>リンゴ を 三<b>つ</b> ください = "three apples, please." The 三 is "three"; the つ is the counter.</p>` },
        { heading: "The all-purpose つ counter", html:
          `<p>When you don't know the right counter, the native <b>つ</b> series (1–10) works for most physical objects:</p>
           <table class="ex-table">
             <tr><td>ひとつ・ふたつ・みっつ</td><td>1, 2, 3</td></tr>
             <tr><td>よっつ・いつつ・むっつ</td><td>4, 5, 6</td></tr>
             <tr><td>ななつ・やっつ・ここのつ・とお</td><td>7, 8, 9, 10</td></tr>
           </table>
           <p>From 11 up, you switch to plain numbers (十一, 十二…). For people, use a different set: ひとり (1), ふたり (2), then 三人 (さんにん), 四人 (よにん)…</p>` },
        { heading: "Common counters", html:
          `<table class="ex-table">
             <tr><td>〜人 (にん)</td><td>people</td><td>四人 yon-nin = 4 people</td></tr>
             <tr><td>〜個 (こ)</td><td>small objects</td><td>りんご五個</td></tr>
             <tr><td>〜枚 (まい)</td><td>flat things</td><td>紙三枚 = 3 sheets</td></tr>
             <tr><td>〜本 (ほん)</td><td>long, thin things</td><td>ペン二本, バナナ一本</td></tr>
             <tr><td>〜匹 (ひき)</td><td>small animals</td><td>猫三匹</td></tr>
             <tr><td>〜台 (だい)</td><td>machines / vehicles</td><td>車一台</td></tr>
             <tr><td>〜冊 (さつ)</td><td>books</td><td>本五冊</td></tr>
             <tr><td>〜杯 (はい)</td><td>cupfuls / glassfuls</td><td>コーヒー一杯</td></tr>
           </table>` },
        { heading: "Watch the sound changes", html:
          `<p>Counters starting with は/ひ/ふ (and a few others) shift sound with certain numbers — this trips everyone up at first:</p>
           <table class="ex-table">
             <tr><td>〜本</td><td>いっぽん (1), さんぼん (3), ろっぽん (6), はっぽん (8)</td></tr>
             <tr><td>〜匹</td><td>いっぴき (1), さんびき (3), ろっぴき (6)</td></tr>
             <tr><td>〜杯</td><td>いっぱい (1), さんばい (3), ろっぱい (6)</td></tr>
           </table>
           <div class="lesson-key"><b>To ask "how many?"</b> put 何 in front of the counter: 何人 (how many people), 何個, 何枚. Learn counters with the things they count, and the sound changes settle in naturally.</div>` },
      ],
      practice: [
        { label: "📖 Study N5 Counters", type: "study", sel: "n5counters" },
        { label: "📖 Study N5 Numbers", type: "study", sel: "n5numbers" },
        { label: "🎮 Play N5 Numbers", type: "game", game: "n5numbers" },
      ],
    },

    {
      id: "time-dates", stage: "Beginner · N5", title: "Time, Dates & the Calendar",
      summary: "Telling the clock, days, months, and the relative-time words you need daily.",
      sections: [
        { heading: "Telling the clock", html:
          `<p>Hours take <b>〜時 (じ)</b>, minutes take <b>〜分 (ふん / ぷん)</b>. 午前 (a.m.) and 午後 (p.m.) go in front; 半 means "half past":</p>
           <p>午後三時半 = 3:30 p.m. ・ 七時十五分 = 7:15</p>
           <p>A few readings are irregular and worth memorizing: <b>4時 よじ</b>, <b>7時 しちじ</b>, <b>9時 くじ</b>; and minutes shift sound — 1分 <b>いっぷん</b>, 3分 <b>さんぷん</b>, 4分 <b>よんぷん</b>, 6分 <b>ろっぷん</b>, 10分 <b>じゅっぷん</b>.</p>` },
        { heading: "Days of the week", html:
          `<p>Each day is an element + 曜日 (ようび):</p>
           <table class="ex-table">
             <tr><td>月曜日</td><td>getsuyōbi</td><td>Monday (moon)</td></tr>
             <tr><td>火曜日</td><td>kayōbi</td><td>Tuesday (fire)</td></tr>
             <tr><td>水曜日</td><td>suiyōbi</td><td>Wednesday (water)</td></tr>
             <tr><td>木曜日</td><td>mokuyōbi</td><td>Thursday (tree)</td></tr>
             <tr><td>金曜日</td><td>kinyōbi</td><td>Friday (gold)</td></tr>
             <tr><td>土曜日</td><td>doyōbi</td><td>Saturday (earth)</td></tr>
             <tr><td>日曜日</td><td>nichiyōbi</td><td>Sunday (sun)</td></tr>
           </table>` },
        { heading: "Months & dates", html:
          `<p>Months are simply <b>number + 月 (がつ)</b> — but watch 4月 <b>しがつ</b>, 7月 <b>しちがつ</b>, 9月 <b>くがつ</b>. Days of the month (〜日) are the tricky part: the first ten are irregular native readings.</p>
           <table class="ex-table">
             <tr><td>1日 ついたち</td><td>2日 ふつか</td><td>3日 みっか</td></tr>
             <tr><td>4日 よっか</td><td>5日 いつか</td><td>6日 むいか</td></tr>
             <tr><td>7日 なのか</td><td>8日 ようか</td><td>9日 ここのか</td></tr>
             <tr><td>10日 とおか</td><td>14日 じゅうよっか</td><td>20日 はつか</td></tr>
           </table>
           <p>From 11 on they're mostly regular (じゅういちにち…), except those echoing the irregulars (14, 20, 24).</p>` },
        { heading: "Relative time words", html:
          `<p>You'll use these constantly — learn them as sets:</p>
           <table class="ex-table">
             <tr><td>一昨日・昨日・今日・明日・明後日</td><td>day before yest. / yest. / today / tomorrow / day after</td></tr>
             <tr><td>先週・今週・来週</td><td>last / this / next week</td></tr>
             <tr><td>先月・今月・来月</td><td>last / this / next month</td></tr>
             <tr><td>今朝・今晩・今夜</td><td>this morning / tonight</td></tr>
           </table>
           <div class="lesson-key"><b>Where to focus:</b> the readings are the only hard part — よじ, ついたち, はつか and friends. Drill those handful of irregulars and the rest is just numbers.</div>` },
      ],
      practice: [
        { label: "📖 Study Dates & Time", type: "study", sel: "n5datetime" },
        { label: "📖 Study N5 Numbers", type: "study", sel: "n5numbers" },
        { label: "🎮 Play Dates & Time", type: "game", game: "n5datetime" },
      ],
    },
    {
      id: "big-numbers", stage: "Beginner · N5", title: "Numbers in Depth: Big Numbers & Money",
      summary: "Building large numbers, the 万 grouping that trips up English speakers, and prices.",
      sections: [
        { heading: "Building blocks", html:
          `<p>Stack the units 十 (10), 百 (100), 千 (1,000) in front of digits. A few combinations change sound:</p>
           <table class="ex-table">
             <tr><td>百 (100)</td><td>300 さんびゃく, 600 ろっぴゃく, 800 はっぴゃく</td></tr>
             <tr><td>千 (1,000)</td><td>3,000 さんぜん, 8,000 はっせん</td></tr>
           </table>
           <p>So 1,500 = 千五百 (せんごひゃく), 3,800 = 三千八百 (さんぜんはっぴゃく).</p>` },
        { heading: "The big idea: group by 万, not 1,000", html:
          `<p>English groups large numbers every <b>three</b> digits (thousand, million, billion). Japanese groups every <b>four</b> digits around <b>万 (10,000)</b> — this is the real hurdle:</p>
           <table class="ex-table">
             <tr><td>万 まん</td><td>10,000</td></tr>
             <tr><td>十万</td><td>100,000</td></tr>
             <tr><td>百万</td><td>1,000,000 (one million)</td></tr>
             <tr><td>千万</td><td>10,000,000</td></tr>
             <tr><td>億 おく</td><td>100,000,000 (one hundred million)</td></tr>
           </table>
           <p>12,345 = 一万 二千三百四十五 (ichi-man ni-sen san-byaku yon-jū go). Train yourself to split the number after the 4th digit from the right.</p>` },
        { heading: "Money & prices", html:
          `<p>Japanese yen uses <b>〜円 (えん)</b>, and because there are no cents, prices are whole numbers:</p>
           <ul>
             <li>500円 = ごひゃくえん ・ 1,200円 = せんにひゃくえん.</li>
             <li>一万円 (ichiman-en) = a 10,000-yen note — the everyday "big bill".</li>
             <li>Ask the price with いくらですか ("how much is it?").</li>
           </ul>` },
        { heading: "Other number jobs", html:
          `<ul>
             <li><b>Phone numbers</b> are read digit by digit, with の for the dashes: 03-1234-5678 → ゼロさん の いちにさんよん の ….</li>
             <li><b>〜番 (ばん)</b> = number/order: 三番 (number 3), 何番.</li>
             <li><b>〜歳 / 才 (さい)</b> = age: 二十歳 is irregular — <b>はたち</b>.</li>
           </ul>
           <div class="lesson-key"><b>The 万 grouping is the one real obstacle.</b> Practice converting both directions until "one man = ten thousand" is automatic — everything bigger builds on it.</div>` },
      ],
      practice: [
        { label: "📖 Study N5 Numbers", type: "study", sel: "n5numbers" },
        { label: "🎮 Play N5 Numbers", type: "game", game: "n5numbers" },
      ],
    },
    {
      id: "comparisons", stage: "Beginner · N5", title: "Making Comparisons",
      summary: "More than, the most, the same as, and not as ~ as — the comparison toolkit.",
      sections: [
        { heading: "A is more than B: より & のほうが", html:
          `<p>Use <b>より</b> ("than") to mark what you're comparing against. The thing that's "more" can be highlighted with <b>のほうが</b> ("the side of"):</p>
           <ul>
             <li>電車は車<u>より</u>速い — "the train is faster than the car."</li>
             <li>車<u>より</u>電車<u>のほうが</u>速い — "the train is faster than the car." (same idea, more emphatic)</li>
           </ul>` },
        { heading: "The most: 一番", html:
          `<p><b>一番 (いちばん)</b> = "number one / the most", placed right before the adjective. Mark the group with 〜の中で ("among"):</p>
           <ul>
             <li>クラスで一番背が高い — "the tallest in the class."</li>
             <li>果物の中で りんごが一番好きだ — "of all fruit, I like apples best."</li>
           </ul>` },
        { heading: "Asking comparisons", html:
          `<p>For two items, ask with <b>どちら (どっち)</b>; for three or more, use <b>どれ / 何 + 一番</b>:</p>
           <ul>
             <li>コーヒーと お茶と、<b>どちら</b>がいいですか — "which do you prefer, coffee or tea?"</li>
             <li>スポーツの中で <b>何が一番</b>好きですか — "what sport do you like most?"</li>
           </ul>` },
        { heading: "Same, and \"not as ~ as\"", html:
          `<ul>
             <li><b>〜と同じ</b> — "the same as": これは私のと同じだ.</li>
             <li><b>AはBほど〜ない</b> — "A is not as ~ as B": 今日は昨日<b>ほど</b>暑く<b>ない</b> ("today isn't as hot as yesterday").</li>
           </ul>
           <div class="lesson-key"><b>Key pattern to lock in:</b> 〜ほど〜ない for "not as ~ as". It's the one comparison shape that doesn't map neatly onto English, so it's worth extra reps.</div>` },
      ],
      practice: [
        { label: "📖 Study N5 い-Adjectives", type: "study", sel: "n5adji" },
        { label: "📖 All N5 Grammar", type: "study", sel: "n5gramall" },
        { label: "🎮 Play Core N5 Vocabulary", type: "game", game: "n5vocab" },
      ],
    },

    {
      id: "family-terms", stage: "Beginner · N5", title: "Family Terms & In-Group / Out-Group",
      summary: "Two words for every relative — and the うち/そと instinct that underpins all of keigo.",
      sections: [
        { heading: "Every relative has two names", html:
          `<p>Japanese has <b>two</b> words for each family member: a plain/humble one for <i>your own</i> family (when speaking to outsiders), and a polite one for <i>someone else's</i> family — or to address your own:</p>
           <table class="ex-table">
             <tr><th>my family (humble)</th><th>others' / address (polite)</th><th></th></tr>
             <tr><td>父 ちち</td><td>お父さん おとうさん</td><td>father</td></tr>
             <tr><td>母 はは</td><td>お母さん おかあさん</td><td>mother</td></tr>
             <tr><td>兄 あに</td><td>お兄さん おにいさん</td><td>older brother</td></tr>
             <tr><td>姉 あね</td><td>お姉さん おねえさん</td><td>older sister</td></tr>
             <tr><td>妻 つま</td><td>奥さん おくさん</td><td>wife</td></tr>
             <tr><td>夫 おっと</td><td>ご主人 ごしゅじん</td><td>husband</td></tr>
           </table>` },
        { heading: "Address vs refer", html:
          `<p>The split is about <i>who you're talking to</i>:</p>
           <ul>
             <li>Talking <b>to</b> your own mother, you call her お母さん.</li>
             <li>Talking <b>about</b> her to an outsider, you call her 母 (humble): 母は料理が上手です ("my mom is good at cooking").</li>
             <li>Asking about someone else's mother, always お母さん: お母さんはお元気ですか.</li>
           </ul>` },
        { heading: "The うち / そと principle", html:
          `<p>This two-word system is your first taste of the deepest rule in Japanese social language: the divide between <b>うち</b> (in-group — you, your family, your company) and <b>そと</b> (out-group — everyone else).</p>
           <p>You <i>lower</i> your in-group and <i>raise</i> the out-group. That's exactly why you speak humbly about your own father — and, later, why you'll use humble forms about your own <i>boss</i> when talking to a customer.</p>` },
        { heading: "Why it matters early", html:
          `<div class="lesson-key"><b>This instinct powers all of keigo.</b> Get comfortable now with "humble for my side, polite for the other side" using family words, and honorific language later will feel like the same reflex scaled up — not a new system.</div>` },
      ],
      practice: [
        { label: "📖 Study N5 Nouns", type: "study", sel: "n5nouns" },
        { label: "📖 Study Core N5 Vocabulary", type: "study", sel: "n5vocab" },
        { label: "🎮 Play Core N5 Vocabulary", type: "game", game: "n5vocab" },
      ],
    },
    {
      id: "adverbs", stage: "Beginner · N5", title: "Adverbs & Degree Words",
      summary: "How much, how often, and the 'negative-magnet' adverbs that demand a ~ない ending.",
      sections: [
        { heading: "Degree: how much?", html:
          `<p>These tune the strength of a verb or adjective, and sit right in front of it:</p>
           <table class="ex-table">
             <tr><td>とても / すごく</td><td>very</td><td>とても寒い</td></tr>
             <tr><td>少し / ちょっと</td><td>a little</td><td>少し疲れた</td></tr>
             <tr><td>もっと</td><td>more</td><td>もっと食べて</td></tr>
             <tr><td>一番 (いちばん)</td><td>most</td><td>一番好き</td></tr>
             <tr><td>あまり〜ない</td><td>not very</td><td>あまり高くない</td></tr>
             <tr><td>ぜんぜん〜ない</td><td>not at all</td><td>ぜんぜん分からない</td></tr>
           </table>` },
        { heading: "Frequency: how often?", html:
          `<table class="ex-table">
             <tr><td>いつも</td><td>always</td></tr>
             <tr><td>よく</td><td>often</td></tr>
             <tr><td>時々 ときどき</td><td>sometimes</td></tr>
             <tr><td>たまに</td><td>occasionally</td></tr>
             <tr><td>あまり〜ない</td><td>rarely / not much</td></tr>
             <tr><td>ぜんぜん〜ない</td><td>never</td></tr>
           </table>` },
        { heading: "Making your own adverbs", html:
          `<p>You can turn any adjective into an adverb (covered in the Adjectives lesson, worth repeating):</p>
           <ul>
             <li><b>い-adjective</b>: い → く. 早い → 早<b>く</b> 起きる (get up early).</li>
             <li><b>な-adjective</b>: + に. 静か → 静か<b>に</b> 話す (speak quietly).</li>
           </ul>` },
        { heading: "The negative-magnet adverbs", html:
          `<p>A few common adverbs <b>require</b> a negative verb to finish the thought — forgetting the 〜ない is a classic beginner slip:</p>
           <ul>
             <li><b>あまり</b> … 〜ない = "not very": コーヒーは あまり 飲ま<b>ない</b>.</li>
             <li><b>ぜんぜん</b> … 〜ない = "not at all": 意味が ぜんぜん 分から<b>ない</b>.</li>
           </ul>
           <div class="lesson-key"><b>Remember the pair:</b> あまり and ぜんぜん are "negative magnets" — the moment you say one, your sentence is committed to ending in 〜ない.</div>` },
      ],
      practice: [
        { label: "📖 Study N5 Adverbs", type: "study", sel: "n5adverbs" },
        { label: "🎮 Play Core N5 Vocabulary", type: "game", game: "n5vocab" },
      ],
    },

    {
      id: "restaurant", stage: "Beginner · N5", title: "Survival Japanese: At a Restaurant",
      summary: "Being seated, ordering, and paying — the phrases that carry a whole meal out.",
      sections: [
        { heading: "Walking in", html:
          `<p>Staff greet you with <b>いらっしゃいませ</b> ("welcome") — you don't reply, just acknowledge. They'll ask how many:</p>
           <ul>
             <li>何名様ですか / 何人ですか — "how many people?"</li>
             <li>Answer with the people-counter: 二人です (futari = 2), 三人です (san-nin = 3).</li>
             <li>禁煙席 (non-smoking) / 喫煙席 (smoking) — they may ask your preference.</li>
           </ul>` },
        { heading: "Ordering", html:
          `<p>A handful of patterns order anything:</p>
           <table class="ex-table">
             <tr><td>メニューをください</td><td>the menu, please</td></tr>
             <tr><td>〜をお願いします</td><td>I'll have ~ (polite)</td></tr>
             <tr><td>〜をください</td><td>~, please</td></tr>
             <tr><td>これにします</td><td>I'll go with this one</td></tr>
             <tr><td>おすすめは何ですか</td><td>what do you recommend?</td></tr>
             <tr><td>〜はありますか</td><td>do you have ~?</td></tr>
           </table>` },
        { heading: "During the meal", html:
          `<ul>
             <li>Call staff over with <b>すみません</b> ("excuse me") — raise a hand; it's normal and not rude.</li>
             <li>お水をください — "water, please."</li>
             <li>Before eating, say <b>いただきます</b>; it acknowledges the meal.</li>
           </ul>` },
        { heading: "Paying & leaving", html:
          `<table class="ex-table">
             <tr><td>お会計お願いします</td><td>the check, please</td></tr>
             <tr><td>別々で / 別々でお願いします</td><td>separate checks, please</td></tr>
             <tr><td>カードは使えますか</td><td>can I use a card?</td></tr>
             <tr><td>ごちそうさまでした</td><td>"thanks for the meal" (on the way out)</td></tr>
           </table>
           <div class="lesson-key"><b>Two phrases do most of the work:</b> 〜をお願いします (to ask for anything) and すみません (to get attention). Master those and you can navigate almost any service situation.</div>` },
      ],
      practice: [
        { label: "📖 Study N5 Greetings", type: "study", sel: "n5greetings" },
        { label: "📖 Study Core N5 Vocabulary", type: "study", sel: "n5vocab" },
        { label: "🎮 Play Core N5 Vocabulary", type: "game", game: "n5vocab" },
      ],
    },
    {
      id: "shopping", stage: "Beginner · N5", title: "Survival Japanese: Shopping & Asking for Things",
      summary: "Prices, availability, trying things on, and paying — the shopping toolkit.",
      sections: [
        { heading: "Browsing", html:
          `<p>You'll be greeted with いらっしゃいませ. If a clerk offers help and you're just looking:</p>
           <ul>
             <li>見ているだけです — "I'm just looking."</li>
             <li>これは何ですか — "what is this?"</li>
           </ul>` },
        { heading: "Price & availability", html:
          `<table class="ex-table">
             <tr><td>これはいくらですか</td><td>how much is this?</td></tr>
             <tr><td>〜はありますか</td><td>do you have ~?</td></tr>
             <tr><td>もっと安いのはありますか</td><td>is there a cheaper one?</td></tr>
             <tr><td>別の色はありますか</td><td>do you have another color?</td></tr>
           </table>` },
        { heading: "Buying & trying on", html:
          `<ul>
             <li><b>これをください</b> / <b>これにします</b> — "I'll take this."</li>
             <li>試着してもいいですか — "may I try this on?"</li>
             <li>もっと大きいの / 小さいの — "a bigger / smaller one."</li>
             <li>サイズはありますか — "do you have my size?"</li>
           </ul>` },
        { heading: "At the register", html:
          `<table class="ex-table">
             <tr><td>カードで / 現金で</td><td>by card / by cash</td></tr>
             <tr><td>袋いりますか</td><td>do you need a bag? (you'll be asked)</td></tr>
             <tr><td>レシートをください</td><td>a receipt, please</td></tr>
           </table>
           <div class="lesson-key"><b>Two phrases unlock shopping:</b> 〜はありますか ("do you have ~?") to find things, and 〜をください ("~, please") to buy them.</div>` },
      ],
      practice: [
        { label: "📖 Study N5 Shopping Basics", type: "study", sel: "n5shopping" },
        { label: "📖 Study N5 Numbers", type: "study", sel: "n5numbers" },
        { label: "🎮 Play Core N5 Vocabulary", type: "game", game: "n5vocab" },
      ],
    },
    {
      id: "directions", stage: "Beginner · N5", title: "Survival Japanese: Directions & Getting Around",
      summary: "Asking the way, the direction words, and navigating trains and stations.",
      sections: [
        { heading: "Asking the way", html:
          `<p>Open with すみません, then point at a place with 〜はどこですか:</p>
           <ul>
             <li>すみません、駅はどこですか — "excuse me, where's the station?"</li>
             <li>〜まで どうやって行きますか — "how do I get to ~?"</li>
             <li>道に迷いました — "I'm lost."</li>
           </ul>` },
        { heading: "Direction words", html:
          `<table class="ex-table">
             <tr><td>まっすぐ</td><td>straight ahead</td></tr>
             <tr><td>右 / 左</td><td>right / left</td></tr>
             <tr><td>曲がる</td><td>to turn</td></tr>
             <tr><td>角 かど</td><td>corner</td></tr>
             <tr><td>信号 しんごう</td><td>traffic light</td></tr>
             <tr><td>〜の近く / となり / 前</td><td>near / next to / in front of ~</td></tr>
           </table>
           <p>A typical answer: まっすぐ行って、二つ目の角を右です ("go straight, then right at the second corner").</p>` },
        { heading: "Trains & transport", html:
          `<table class="ex-table">
             <tr><td>駅 えき / 切符 きっぷ</td><td>station / ticket</td></tr>
             <tr><td>〜行き ゆき</td><td>bound for ~ (on signs)</td></tr>
             <tr><td>乗り換え のりかえ</td><td>transfer / change trains</td></tr>
             <tr><td>〜番線 ばんせん</td><td>platform number ~</td></tr>
             <tr><td>この電車は〜に止まりますか</td><td>does this train stop at ~?</td></tr>
           </table>` },
        { heading: "Putting it together", html:
          `<div class="lesson-key"><b>The unstuck phrase:</b> 〜はどこですか. Combine it with the direction words above and you can ask for, and understand, the way to anywhere — the single most useful travel skill.</div>
           <p>Don't worry about catching every word of the answer — listen for 右/左/まっすぐ and the corner count, and you'll get there.</p>` },
      ],
      practice: [
        { label: "📖 Study N5 Nouns", type: "study", sel: "n5nouns" },
        { label: "📖 Study Core N5 Vocabulary", type: "study", sel: "n5vocab" },
        { label: "🎮 Play Core N5 Vocabulary", type: "game", game: "n5vocab" },
      ],
    },

    {
      id: "weather", stage: "Beginner · N5", title: "Weather, Seasons & Small Talk",
      summary: "Weather words, the four seasons, and Japan's favorite icebreaker.",
      sections: [
        { heading: "Weather words", html:
          `<table class="ex-table">
             <tr><td>晴れ はれ</td><td>sunny / clear</td></tr>
             <tr><td>曇り くもり</td><td>cloudy</td></tr>
             <tr><td>雨 あめ</td><td>rain</td></tr>
             <tr><td>雪 ゆき</td><td>snow</td></tr>
             <tr><td>風 かぜ</td><td>wind</td></tr>
             <tr><td>暑い / 寒い</td><td>hot / cold</td></tr>
             <tr><td>暖かい / 涼しい</td><td>warm / cool</td></tr>
             <tr><td>蒸し暑い むしあつい</td><td>hot and humid</td></tr>
           </table>` },
        { heading: "Talking about the weather", html:
          `<ul>
             <li>いい天気ですね — "nice weather, isn't it?"</li>
             <li>今日は暑いですね — "it's hot today, isn't it?"</li>
             <li>雨が降っています — "it's raining." (雪が降る for snow)</li>
             <li>降り<b>そう</b>です — "it looks like it'll rain" (the 様態 そう you met in N4).</li>
             <li>天気予報 (てんきよほう) によると… — "according to the forecast…"</li>
           </ul>` },
        { heading: "The four seasons", html:
          `<table class="ex-table">
             <tr><td>春 はる</td><td>spring — 桜 (cherry blossoms)</td></tr>
             <tr><td>夏 なつ</td><td>summer — hot, 梅雨 (つゆ, rainy season) first</td></tr>
             <tr><td>秋 あき</td><td>autumn — 紅葉 (こうよう, fall leaves)</td></tr>
             <tr><td>冬 ふゆ</td><td>winter — 雪, cold</td></tr>
           </table>
           <p>Japan is strongly season-conscious — food, festivals, and greetings all shift with the seasons.</p>` },
        { heading: "Weather is the icebreaker", html:
          `<div class="lesson-key"><b>The universal opener:</b> commenting on the weather with 〜ですね is the safest way to start almost any conversation. Pair it with an aizuchi reply (そうですね) and you have an instant, natural exchange.</div>` },
      ],
      practice: [
        { label: "📖 Study Core N5 Vocabulary", type: "study", sel: "n5vocab" },
        { label: "📖 Study N5 い-Adjectives", type: "study", sel: "n5adji" },
        { label: "🎮 Play Core N5 Vocabulary", type: "game", game: "n5vocab" },
      ],
    },

    {
      id: "food", stage: "Beginner · N5", title: "Food, Tastes & Cooking",
      summary: "Taste words, food vocabulary, and a taste of Japanese food culture.",
      sections: [
        { heading: "Describing taste", html:
          `<table class="ex-table">
             <tr><td>甘い あまい</td><td>sweet</td></tr>
             <tr><td>辛い からい</td><td>spicy / hot</td></tr>
             <tr><td>しょっぱい / 塩辛い</td><td>salty</td></tr>
             <tr><td>酸っぱい すっぱい</td><td>sour</td></tr>
             <tr><td>苦い にがい</td><td>bitter</td></tr>
             <tr><td>おいしい / まずい</td><td>tasty / bad-tasting</td></tr>
           </table>` },
        { heading: "Food & drink basics", html:
          `<ul>
             <li>Staples: ご飯 (rice/meal), パン (bread), 麺 (noodles).</li>
             <li>Meat 肉: 牛肉 (beef), 豚肉 (pork), 鶏肉 (chicken); plus 魚 (fish), 卵 (egg).</li>
             <li>野菜 (vegetables), 果物 (fruit).</li>
             <li>Drinks: 水, お茶, コーヒー, お酒, ビール.</li>
           </ul>` },
        { heading: "A taste of Japanese cuisine", html:
          `<p>和食 (washoku, Japanese food) has its own essential vocabulary:</p>
           <table class="ex-table">
             <tr><td>寿司 / 刺身</td><td>sushi / sashimi</td></tr>
             <tr><td>天ぷら</td><td>tempura</td></tr>
             <tr><td>ラーメン / うどん / そば</td><td>noodle dishes</td></tr>
             <tr><td>定食 ていしょく</td><td>a set meal</td></tr>
             <tr><td>出汁 だし</td><td>the foundational soup stock</td></tr>
           </table>
           <p>Meals are bookended by いただきます (before) and ごちそうさまでした (after).</p>` },
        { heading: "Cooking verbs", html:
          `<table class="ex-table">
             <tr><td>切る きる</td><td>to cut</td></tr>
             <tr><td>焼く やく</td><td>to grill / bake</td></tr>
             <tr><td>煮る にる</td><td>to simmer</td></tr>
             <tr><td>茹でる ゆでる</td><td>to boil</td></tr>
             <tr><td>炒める いためる</td><td>to stir-fry</td></tr>
           </table>
           <div class="lesson-key"><b>Make meals count:</b> naming a taste (甘い, 辛い) and saying いただきます turns every time you eat into a quick, natural review.</div>` },
      ],
      practice: [
        { label: "📖 Study Core N5 Vocabulary", type: "study", sel: "n5vocab" },
        { label: "📖 Study N5 い-Adjectives", type: "study", sel: "n5adji" },
        { label: "🎮 Play Core N5 Vocabulary", type: "game", game: "n5vocab" },
      ],
    },

    {
      id: "hobbies-routine", stage: "Beginner · N5", title: "Hobbies, Likes & Your Daily Routine",
      summary: "Talking about what you like and what you do every day — the core of any first conversation.",
      sections: [
        { heading: "Likes & dislikes", html:
          `<p>These mark what you like with <b>が</b> (not を), because they're describing a feeling, not an action:</p>
           <table class="ex-table">
             <tr><td>〜が好き / 大好き</td><td>like / love</td><td>音楽が好きです</td></tr>
             <tr><td>〜が嫌い</td><td>dislike</td><td>納豆が嫌いです</td></tr>
             <tr><td>〜が上手 / 下手</td><td>good / bad at</td><td>料理が上手です</td></tr>
           </table>
           <p>To say you like an <i>action</i>, nominalize it with の: 泳ぐ<b>の</b>が好きです ("I like swimming").</p>` },
        { heading: "Talking about hobbies", html:
          `<p>Introduce a hobby with 趣味は〜です ("my hobby is ~"):</p>
           <ul>
             <li>趣味は読書です — "my hobby is reading."</li>
             <li>Common ones: 音楽 (music), 映画 (movies), スポーツ, 料理 (cooking), 旅行 (travel), ゲーム.</li>
           </ul>` },
        { heading: "Your daily routine", html:
          `<p>A handful of verbs covers the whole day:</p>
           <table class="ex-table">
             <tr><td>起きる</td><td>get up</td></tr>
             <tr><td>朝ご飯を食べる</td><td>eat breakfast</td></tr>
             <tr><td>学校 / 会社に行く</td><td>go to school / work</td></tr>
             <tr><td>勉強する / 働く</td><td>study / work</td></tr>
             <tr><td>家に帰る</td><td>go home</td></tr>
             <tr><td>お風呂に入る</td><td>take a bath</td></tr>
             <tr><td>寝る</td><td>go to sleep</td></tr>
           </table>` },
        { heading: "Stringing it together", html:
          `<p>Use time and frequency words plus the て-form to link the day into a sequence:</p>
           <p>毎朝 七時に起き<b>て</b>、朝ご飯を食べ<b>てから</b> 学校に行きます。 — "Every morning I get up at seven, and after eating breakfast I go to school."</p>
           <div class="lesson-key"><b>This is your self-introduction engine:</b> 趣味は〜です and 〜のが好きです let you say who you are, and the routine verbs let you describe your day — exactly what every first conversation is built from.</div>` },
      ],
      practice: [
        { label: "📖 Study Core N5 Vocabulary", type: "study", sel: "n5vocab" },
        { label: "📖 Study N5 Godan Verbs", type: "study", sel: "n5godan" },
        { label: "🎮 Play Core N5 Vocabulary", type: "game", game: "n5vocab" },
      ],
    },

    {
      id: "home-objects", stage: "Beginner · N5", title: "The Home, Clothing & Everyday Objects",
      summary: "Rooms, furniture, the things you carry — and the different verbs for 'to wear'.",
      sections: [
        { heading: "Around the home", html:
          `<table class="ex-table">
             <tr><td>家 いえ / 部屋 へや</td><td>house / room</td></tr>
             <tr><td>台所 だいどころ</td><td>kitchen</td></tr>
             <tr><td>お風呂 / トイレ</td><td>bath / toilet</td></tr>
             <tr><td>玄関 げんかん</td><td>entryway (where shoes come off)</td></tr>
             <tr><td>庭 にわ</td><td>garden / yard</td></tr>
           </table>` },
        { heading: "Furniture & objects", html:
          `<p>Furniture (家具): 机 (desk), 椅子 (chair), ベッド, テーブル, 棚 (shelf). And the things you carry daily:</p>
           <table class="ex-table">
             <tr><td>時計 とけい / 鍵 かぎ</td><td>clock-watch / key</td></tr>
             <tr><td>財布 さいふ / かばん</td><td>wallet / bag</td></tr>
             <tr><td>傘 かさ / 眼鏡 めがね</td><td>umbrella / glasses</td></tr>
             <tr><td>スマホ / 充電器</td><td>phone / charger</td></tr>
           </table>` },
        { heading: "Clothing", html:
          `<table class="ex-table">
             <tr><td>服 ふく</td><td>clothes (general)</td></tr>
             <tr><td>シャツ / ズボン</td><td>shirt / trousers</td></tr>
             <tr><td>靴 くつ / 靴下 くつした</td><td>shoes / socks</td></tr>
             <tr><td>帽子 ぼうし / コート</td><td>hat / coat</td></tr>
           </table>` },
        { heading: "Japanese has many \"wear\" verbs", html:
          `<p>This catches everyone out: the verb for "wear" depends on <b>where</b> on the body it goes:</p>
           <table class="ex-table">
             <tr><td>着る きる</td><td>torso / overall (shirt, coat, kimono)</td></tr>
             <tr><td>履く はく</td><td>legs &amp; feet (trousers, shoes, socks)</td></tr>
             <tr><td>かぶる</td><td>head (hat)</td></tr>
             <tr><td>かける</td><td>glasses</td></tr>
             <tr><td>する</td><td>accessories (watch, scarf, tie)</td></tr>
           </table>
           <div class="lesson-key"><b>Learn the verb with the item:</b> 帽子を<b>かぶる</b>, ズボンを<b>履く</b>, 眼鏡を<b>かける</b>. Using 着る for everything is the classic beginner tell.</div>` },
      ],
      practice: [
        { label: "📖 Study N5 Nouns", type: "study", sel: "n5nouns" },
        { label: "📖 Study Core N5 Vocabulary", type: "study", sel: "n5vocab" },
        { label: "🎮 Play Core N5 Vocabulary", type: "game", game: "n5vocab" },
      ],
    },

    {
      id: "greetings-intro", stage: "Beginner · N5", title: "Greetings & Self-Introduction",
      summary: "The daily greetings and the jiko-shōkai frame that opens every first meeting.",
      sections: [
        { heading: "Everyday greetings", html:
          `<table class="ex-table">
             <tr><td>おはよう(ございます)</td><td>good morning</td></tr>
             <tr><td>こんにちは / こんばんは</td><td>hello / good evening</td></tr>
             <tr><td>おやすみ(なさい)</td><td>good night</td></tr>
             <tr><td>さようなら / またね</td><td>goodbye / see you</td></tr>
             <tr><td>ありがとう / すみません</td><td>thanks / excuse me · sorry</td></tr>
           </table>` },
        { heading: "The self-introduction frame (自己紹介)", html:
          `<p>First meetings follow a set script — memorize it and you can introduce yourself anywhere:</p>
           <ul>
             <li><b>はじめまして</b> — "nice to meet you" (only on a first meeting).</li>
             <li>(name)<b>と申します</b> / <b>です</b> — "I'm ~" (申します is humbler).</li>
             <li>(place)<b>から来ました</b> — "I'm from ~".</li>
             <li>趣味は (hobby) です — "my hobby is ~".</li>
             <li><b>どうぞよろしくお願いします</b> — the essential closing bow-phrase.</li>
           </ul>` },
        { heading: "Asking the other person", html:
          `<ul>
             <li>お名前は? — "your name?"</li>
             <li>ご出身は? — "where are you from?"</li>
             <li>お仕事は? — "what do you do?"</li>
           </ul>
           <p>They answer with 〜です: 田中です ・ 東京の出身です ・ 学生です.</p>` },
        { heading: "The unspoken part", html:
          `<div class="lesson-key"><b>よろしくお願いします</b> has no real English equivalent — it's a wish for the relationship to go well, and ending your intro without it feels incomplete. Pair it with a small bow (お辞儀) and you've made a proper Japanese first impression.</div>` },
      ],
      practice: [
        { label: "📖 Study N5 Greetings", type: "study", sel: "n5greetings" },
        { label: "📖 N4 Daily Conversation", type: "study", sel: "n4phrdaily" },
        { label: "🎮 Play Core N5 Vocabulary", type: "game", game: "n5vocab" },
      ],
    },
    {
      id: "colors", stage: "Beginner · N5", title: "Colors, Shapes & Describing Things",
      summary: "Color words (and the い-vs-noun catch), shapes, and everyday describing adjectives.",
      sections: [
        { heading: "Colors", html:
          `<table class="ex-table">
             <tr><td>赤 あか / 青 あお</td><td>red / blue</td></tr>
             <tr><td>白 しろ / 黒 くろ</td><td>white / black</td></tr>
             <tr><td>黄色 きいろ / 緑 みどり</td><td>yellow / green</td></tr>
             <tr><td>茶色 ちゃいろ / 紫 むらさき</td><td>brown / purple</td></tr>
             <tr><td>ピンク / オレンジ / 灰色</td><td>pink / orange / gray</td></tr>
           </table>` },
        { heading: "The color grammar catch", html:
          `<p>Some colors are <b>い-adjectives</b>, others behave like <b>nouns</b> — and they attach to a noun differently:</p>
           <ul>
             <li><b>い-adjectives</b>: 赤い・青い・白い・黒い・黄色い・茶色い → 赤<b>い</b>本 ("a red book").</li>
             <li><b>Nouns</b>: 緑・紫・ピンク・オレンジ・灰色 → 緑<b>の</b>本, ピンク<b>の</b>かばん.</li>
           </ul>
           <p>So it's 赤い車 but 緑の車 — mixing these up is a classic slip.</p>` },
        { heading: "Shapes & size", html:
          `<table class="ex-table">
             <tr><td>丸 まる / 四角 しかく / 三角</td><td>circle / square / triangle</td></tr>
             <tr><td>大きい / 小さい</td><td>big / small</td></tr>
             <tr><td>長い / 短い</td><td>long / short</td></tr>
             <tr><td>高い / 低い</td><td>tall-high / low</td></tr>
           </table>` },
        { heading: "More describing words", html:
          `<table class="ex-table">
             <tr><td>新しい / 古い</td><td>new / old</td></tr>
             <tr><td>きれい / 汚い きたない</td><td>clean-pretty / dirty</td></tr>
             <tr><td>軽い / 重い</td><td>light / heavy</td></tr>
             <tr><td>柔らかい / 硬い</td><td>soft / hard</td></tr>
           </table>
           <div class="lesson-key"><b>Remember the split:</b> the four core colors 赤・青・白・黒 (plus 黄色・茶色) are い-adjectives (赤い); newer and loanword colors are nouns and need の (緑の, ピンクの).</div>` },
      ],
      practice: [
        { label: "📖 Study N5 い-Adjectives", type: "study", sel: "n5adji" },
        { label: "📖 Study Core N5 Vocabulary", type: "study", sel: "n5vocab" },
        { label: "🎮 Play Core N5 Vocabulary", type: "game", game: "n5vocab" },
      ],
    },

    {
      id: "annual-events", stage: "Beginner · N5", title: "Annual Events & Japanese Culture",
      summary: "The festivals and holidays that shape the Japanese year — and their vocabulary.",
      sections: [
        { heading: "New Year — お正月", html:
          `<p>The biggest holiday of the year, centered on family:</p>
           <table class="ex-table">
             <tr><td>初詣 はつもうで</td><td>first shrine/temple visit of the year</td></tr>
             <tr><td>お年玉 おとしだま</td><td>money gift to children</td></tr>
             <tr><td>おせち / お雑煮</td><td>traditional New Year food</td></tr>
             <tr><td>年賀状 ねんがじょう</td><td>New Year greeting cards</td></tr>
           </table>
           <p>The greeting is 明けましておめでとうございます.</p>` },
        { heading: "Spring & summer", html:
          `<table class="ex-table">
             <tr><td>花見 はなみ</td><td>cherry-blossom viewing (spring)</td></tr>
             <tr><td>ゴールデンウィーク</td><td>"Golden Week" holiday run (early May)</td></tr>
             <tr><td>七夕 たなばた</td><td>the star festival (July)</td></tr>
             <tr><td>お盆 おぼん</td><td>honoring ancestors (August)</td></tr>
             <tr><td>花火大会 はなびたいかい</td><td>fireworks festival</td></tr>
           </table>` },
        { heading: "Autumn & winter", html:
          `<table class="ex-table">
             <tr><td>紅葉 こうよう</td><td>autumn leaves</td></tr>
             <tr><td>クリスマス</td><td>Christmas (a couples'/festive event here)</td></tr>
             <tr><td>大晦日 おおみそか</td><td>New Year's Eve</td></tr>
             <tr><td>年越しそば</td><td>buckwheat noodles eaten on NYE</td></tr>
           </table>` },
        { heading: "At a festival (祭り)", html:
          `<p>Summer especially is festival season — handy words:</p>
           <ul>
             <li>神社 (shrine) / お寺 (temple), お参り (to pray/visit).</li>
             <li>浴衣 ゆかた (summer kimono), 屋台 やたい (food stalls), 神輿 みこし (portable shrine).</li>
           </ul>
           <div class="lesson-key"><b>The two pillars:</b> お正月 and お盆 are the big family-gathering holidays, and 祭り fill the summer. Knowing the calendar makes small talk ("行きましたか?") flow naturally all year.</div>` },
      ],
      practice: [
        { label: "📖 Study Core N5 Vocabulary", type: "study", sel: "n5vocab" },
        { label: "📖 Study Dates & Time", type: "study", sel: "n5datetime" },
        { label: "🎮 Play Core N5 Vocabulary", type: "game", game: "n5vocab" },
      ],
    },

    // ============================ Elementary · N4 ============================
    {
      id: "n4-kanji", stage: "Elementary · N4", title: "N4 Kanji",
      summary: "~170 more kanji that unlock everyday reading.",
      sections: [
        { heading: "From sounding-out to reading", html:
          `<p>N4 roughly doubles your kanji to around 250 total. With these you can read simple signs, menus, schedules and short messages without leaning on kana. This is the level where text starts feeling like text, not a puzzle.</p>` },
        { heading: "Compounds multiply your power", html:
          `<p>Known kanji combine into new words, so each character you learn pays off many times:</p>
           <table class="ex-table">
             <tr><td>電 (electricity) + 車 (car)</td><td>電車 / densha</td><td>train</td></tr>
             <tr><td>電 + 話 (talk)</td><td>電話 / denwa</td><td>telephone</td></tr>
             <tr><td>映 (reflect) + 画 (picture)</td><td>映画 / eiga</td><td>movie</td></tr>
           </table>
           <p>Learning 電 once helps with 電車, 電話, 電気, 電池… Lean into compounds rather than isolated characters.</p>` },
        { heading: "Lean on radicals", html:
          `<p>By N4 the radical view earns its keep. Characters sharing a component often share a meaning zone — 語, 話, 読, 説 all carry 言 (word/speech). Group your study by radical to learn families fast.</p>
           <div class="lesson-key"><b>Habit:</b> whenever you meet a new kanji, note its radical and one word it lives in. Two anchors beat rote repetition.</div>` },
      ],
      practice: [
        { label: "📖 Study N4 Kanji", type: "study", sel: "n4" },
        { label: "🎮 Play the N4 Kanji game", type: "game", game: "n4" },
      ],
    },
    {
      id: "n4-vocab", stage: "Elementary · N4", title: "N4 Vocabulary",
      summary: "Everyday verbs, adjectives and nouns for real conversations.",
      sections: [
        { heading: "Rounding out the basics", html:
          `<p>N4 vocabulary (~600 more words) fills the gaps that make speech natural — more verbs of daily life, time and frequency words, and connectives that let you build longer thoughts.</p>` },
        { heading: "Study by category", html:
          `<p>Grouping reinforces the patterns you'll conjugate later:</p>
           <ul>
             <li><b>Godan & ichidan verbs</b> — keep practicing the two families; you'll conjugate them constantly in the grammar lessons.</li>
             <li><b>い- and な-adjectives</b> — N4 adds many descriptive words for opinions and feelings.</li>
             <li><b>Adverbs</b> — たぶん (probably), もう (already), まだ (not yet), ちょっと (a little) make speech sound real.</li>
           </ul>` },
        { heading: "Transitive vs intransitive pairs", html:
          `<p>Japanese loves verb pairs where one takes an object and one doesn't — same root, different ending:</p>
           <table class="ex-table">
             <tr><td>開ける / 開く</td><td>akeru / aku</td><td>to open (something) / (it) opens</td></tr>
             <tr><td>始める / 始まる</td><td>hajimeru / hajimaru</td><td>to begin (it) / (it) begins</td></tr>
           </table>
           <p>Notice them as pairs now and the grammar later is much smoother.</p>` },
      ],
      practice: [
        { label: "📖 All N4 Vocabulary", type: "study", sel: "n4vocab" },
        { label: "📖 Godan Verbs", type: "study", sel: "n4godan" },
        { label: "📖 Ichidan Verbs", type: "study", sel: "n4ichidan" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "n4-teform", stage: "Elementary · N4", title: "The て-Form in Depth",
      summary: "The single most useful conjugation — how to build it and what it does.",
      sections: [
        { heading: "Why the て-form is king", html:
          `<p>The <b>て-form</b> is the workhorse of Japanese grammar. It links actions, makes requests, forms the progressive, asks permission, and plugs into dozens of later patterns. Nail this one conjugation and a huge amount of grammar opens up.</p>` },
        { heading: "How to form it (godan verbs)", html:
          `<p>Godan て-forms depend on the final kana — memorize this little song:</p>
           <table class="ex-table">
             <tr><td>う・つ・る</td><td>→ って</td><td>買う→買って, 待つ→待って, 取る→取って</td></tr>
             <tr><td>む・ぬ・ぶ</td><td>→ んで</td><td>飲む→飲んで, 死ぬ→死んで, 遊ぶ→遊んで</td></tr>
             <tr><td>く</td><td>→ いて</td><td>書く→書いて (exception: 行く→行って)</td></tr>
             <tr><td>ぐ</td><td>→ いで</td><td>泳ぐ→泳いで</td></tr>
             <tr><td>す</td><td>→ して</td><td>話す→話して</td></tr>
           </table>` },
        { heading: "Ichidan & irregulars", html:
          `<p><b>Ichidan</b> verbs are easy: drop る, add て. 食べる→食べて, 見る→見て. The irregulars: する→して, 来る→来て (きて).</p>
           <div class="lesson-key"><b>Drill tip:</b> conjugate 10 verbs to て-form out loud each day for a week. It needs to become automatic, not calculated.</div>` },
        { heading: "What it does", html:
          `<table class="ex-table">
             <tr><td>食べて、寝る</td><td>tabete, neru</td><td>eat, then sleep (linking)</td></tr>
             <tr><td>待ってください</td><td>matte kudasai</td><td>please wait (request)</td></tr>
             <tr><td>食べている</td><td>tabete iru</td><td>is eating (progressive)</td></tr>
             <tr><td>食べてもいいです</td><td>tabete mo ii desu</td><td>you may eat (permission)</td></tr>
             <tr><td>食べてはいけません</td><td>tabete wa ikemasen</td><td>you must not eat (prohibition)</td></tr>
           </table>` },
      ],
      practice: [
        { label: "📖 Te-form verbs", type: "study", sel: "n4verbte" },
        { label: "📖 Te-form patterns", type: "study", sel: "n4gramte" },
        { label: "📖 N4 Godan verbs", type: "study", sel: "n4godan" },
        { label: "🎮 Drill verbs in the game", type: "game", game: "n4godan" },
      ],
    },
    {
      id: "n4-grammar", stage: "Elementary · N4", title: "Plain Form, Tense & Key Patterns",
      summary: "Casual speech, past tense, can/must, and connecting ideas.",
      sections: [
        { heading: "Plain (dictionary) form", html:
          `<p>Beyond polite 〜ます lies the <b>plain form</b> used in casual speech, in thoughts, and as the base for most grammar patterns. You must know both registers:</p>
           <table class="ex-table">
             <tr><td>polite</td><td>食べます / 行きます</td><td>(formal)</td></tr>
             <tr><td>plain</td><td>食べる / 行く</td><td>(casual, dictionary)</td></tr>
           </table>` },
        { heading: "Past tense", html:
          `<p>The past mirrors the て-form's shape, swapping て→た and で→だ:</p>
           <table class="ex-table">
             <tr><td>食べた</td><td>tabeta</td><td>ate (plain past)</td></tr>
             <tr><td>飲んだ</td><td>nonda</td><td>drank</td></tr>
             <tr><td>行きました</td><td>ikimashita</td><td>went (polite past)</td></tr>
             <tr><td>高かった</td><td>takakatta</td><td>was expensive (い-adj past)</td></tr>
           </table>` },
        { heading: "Ability, obligation, desire", html:
          `<ul>
             <li><b>Can</b>: potential form (食べられる) or 〜ことができる. 日本語が話せる = "can speak Japanese".</li>
             <li><b>Must</b>: 〜なければなりません / casual 〜なきゃ. 行かなければなりません = "have to go".</li>
             <li><b>Want to</b>: 〜たい. 食べたい = "want to eat".</li>
             <li><b>Should / try</b>: 〜たほうがいい (had better), 〜てみる (try doing).</li>
           </ul>` },
        { heading: "Connecting ideas", html:
          `<p>Move past one-clause sentences:</p>
           <table class="ex-table">
             <tr><td>〜から / 〜ので</td><td>kara / node</td><td>because</td></tr>
             <tr><td>〜が / 〜けど</td><td>ga / kedo</td><td>but / although</td></tr>
             <tr><td>〜とき</td><td>toki</td><td>when</td></tr>
             <tr><td>〜たり〜たりする</td><td>tari … tari</td><td>do things like A and B</td></tr>
           </table>
           <div class="lesson-key"><b>Milestone:</b> with plain form + て-form + these connectors, you can express most everyday thoughts. This is the heart of "comfortable" Japanese.</div>` },
      ],
      practice: [
        { label: "📖 All N4 Grammar", type: "study", sel: "n4gram" },
        { label: "📖 Conditional forms", type: "study", sel: "n4gramcond" },
        { label: "📖 Giving & Receiving", type: "study", sel: "n4gramgive" },
        { label: "📖 Advanced particles", type: "study", sel: "n4partadv" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },

    {
      id: "giving-receiving", stage: "Elementary · N4", title: "Giving & Receiving (あげる・くれる・もらう)",
      summary: "The favor-direction system that trips up every learner — and how to think about it.",
      sections: [
        { heading: "It's all about direction", html:
          `<p>Japanese has <i>three</i> verbs for giving and receiving, chosen by which way the thing (or favor) flows relative to <b>you</b>:</p>
           <table class="ex-table">
             <tr><td><b>あげる</b></td><td>give outward</td><td>I give to others / others give to others (away from me)</td></tr>
             <tr><td><b>くれる</b></td><td>give toward me</td><td>someone gives to me or my side</td></tr>
             <tr><td><b>もらう</b></td><td>receive</td><td>I (or my side) get something from someone</td></tr>
           </table>
           <p>English uses "give" for both あげる and くれる — Japanese forces you to mark the direction. That's the whole hurdle.</p>` },
        { heading: "あげる vs くれる", html:
          `<p>Same event, two verbs, depending on the arrow:</p>
           <ul>
             <li>私は弟に本を<b>あげた</b> — I gave my brother a book. (out from me)</li>
             <li>友達が私に本を<b>くれた</b> — A friend gave me a book. (in toward me)</li>
           </ul>
           <p>くれる always points at <b>me or my in-group</b> (家族, friends). You'd never use あげる for a gift coming to you. もらう flips the viewpoint to the receiver: 私は友達に本を<b>もらった</b> — "I received a book from a friend."</p>` },
        { heading: "Favors: て-form + giving verb", html:
          `<p>Attach these to a て-form and they express doing or getting a <b>favor</b> — this is where they become essential for natural speech:</p>
           <table class="ex-table">
             <tr><td>〜てあげる</td><td>do (something) for someone</td><td>妹を手伝ってあげた</td></tr>
             <tr><td>〜てくれる</td><td>someone does it for me (gratitude)</td><td>友達が送ってくれた</td></tr>
             <tr><td>〜てもらう</td><td>I get someone to do it for me</td><td>友達に直してもらった</td></tr>
           </table>
           <p>〜てくれて ありがとう ("thanks for doing ~") is one of the most useful phrases you'll ever learn.</p>` },
        { heading: "Politeness shifts the verb", html:
          `<p>Up or down the social ladder, the verbs change form:</p>
           <ul>
             <li>To a superior, "give" becomes humble <b>さしあげる</b>; a superior giving to you is honorific <b>くださる</b>.</li>
             <li>"Receive" from a superior becomes humble <b>いただく</b>.</li>
           </ul>
           <div class="lesson-key"><b>One question solves it:</b> which way is the favor flowing — toward me, or away? Answer that first, then pick the verb and the right politeness level.</div>` },
      ],
      practice: [
        { label: "📖 Study Giving & Receiving", type: "study", sel: "n4gramgive" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "transitivity", stage: "Elementary · N4", title: "Transitive & Intransitive Pairs (自他動詞)",
      summary: "Two verbs for one event — ドアが開く vs ドアを開ける — and why the difference matters.",
      sections: [
        { heading: "Does it happen, or do you do it?", html:
          `<p>Many Japanese verbs come in <b>pairs</b>: one for "X happens by itself" and one for "someone does X". They take different particles:</p>
           <ul>
             <li><b>Intransitive</b> (自動詞) — no doer; the subject takes <b>が</b>: ドア<u>が</u>開く ("the door opens").</li>
             <li><b>Transitive</b> (他動詞) — someone acts on an object marked <b>を</b>: ドア<u>を</u>開ける ("I open the door").</li>
           </ul>
           <p>English often reuses one word ("the door opens" / "I open the door"). Japanese gives you two distinct verbs.</p>` },
        { heading: "Common pairs", html:
          `<table class="ex-table">
             <tr><th>intransitive (が)</th><th>transitive (を)</th><th>meaning</th></tr>
             <tr><td>開く あく</td><td>開ける あける</td><td>open</td></tr>
             <tr><td>閉まる しまる</td><td>閉める しめる</td><td>close</td></tr>
             <tr><td>始まる はじまる</td><td>始める はじめる</td><td>begin</td></tr>
             <tr><td>つく</td><td>つける</td><td>(light) come on / turn on</td></tr>
             <tr><td>消える きえる</td><td>消す けす</td><td>go out / turn off</td></tr>
             <tr><td>入る はいる</td><td>入れる いれる</td><td>enter / put in</td></tr>
             <tr><td>出る でる</td><td>出す だす</td><td>come out / take out</td></tr>
             <tr><td>落ちる おちる</td><td>落とす おとす</td><td>fall / drop</td></tr>
           </table>` },
        { heading: "Why it changes the meaning", html:
          `<p>The pair you pick changes what a sentence says — especially with 〜ている:</p>
           <ul>
             <li>電気<u>が</u>ついて<b>いる</b> — "the light is on" (a resulting <i>state</i>, intransitive).</li>
             <li>電気<u>を</u>つけて<b>いる</b> — "(someone) is turning on the light" (an ongoing <i>action</i>, transitive).</li>
           </ul>
           <p>And 〜てある (a prepared state) always uses the <b>transitive</b> verb: 窓が開けてある ("the window has been opened / left open").</p>` },
        { heading: "How to learn them", html:
          `<div class="lesson-key"><b>Learn them in pairs, out loud.</b> あく／あける, しまる／しめる — drilling the two together fixes both the verb and its particle (が vs を) at once.</div>
           <p>There are loose tendencies (many transitives end in -eru, many intransitives in -aru), but they're not reliable enough to trust. The pair-drill is what sticks.</p>` },
      ],
      practice: [
        { label: "📖 Study N4 Godan Verbs", type: "study", sel: "n4godan" },
        { label: "📖 Study N4 Ichidan Verbs", type: "study", sel: "n4ichidan" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "potential-volitional", stage: "Elementary · N4", title: "Potential, Volitional & Desire",
      summary: "Saying what you can do, what you intend to do, and what you want.",
      sections: [
        { heading: "Potential: \"can do\"", html:
          `<p>The <b>potential form</b> means "is able to". The thing you can do often takes <b>が</b> instead of を:</p>
           <table class="ex-table">
             <tr><td>Group 1</td><td>final う-sound → え-sound + る</td><td>飲む → 飲める, 書く → 書ける</td></tr>
             <tr><td>Group 2</td><td>drop る + られる</td><td>食べる → 食べられる</td></tr>
             <tr><td>Group 3</td><td>memorize</td><td>する → できる, 来る → 来られる</td></tr>
           </table>
           <p>日本語<u>が</u>話せる = "I can speak Japanese." In casual speech, Group 2 often drops the ら (食べ<b>れ</b>る) — common but considered informal.</p>` },
        { heading: "Volitional: \"let's / I'll\"", html:
          `<p>The <b>volitional</b> expresses will or invitation. Polite is 〜ましょう; plain is 〜よう / 〜おう:</p>
           <ul>
             <li>行き<b>ましょう</b> / 行<b>こう</b> — "let's go."</li>
             <li>〜ようと思う — "I think I'll ~" (a decision): 早く寝ようと思う.</li>
             <li>〜ようとする — "try to / be about to": 立ち上がろうとした.</li>
           </ul>` },
        { heading: "Desire: want to do, want a thing", html:
          `<p>Three different "wants", and they don't mix:</p>
           <table class="ex-table">
             <tr><td>〜たい</td><td>I want to (do)</td><td>水が飲みたい</td></tr>
             <tr><td>〜たがる</td><td>someone else wants to</td><td>子供が遊びたがる</td></tr>
             <tr><td>〜がほしい</td><td>I want (a thing)</td><td>新しい靴がほしい</td></tr>
             <tr><td>〜てほしい</td><td>I want someone to ~</td><td>聞いてほしい</td></tr>
           </table>
           <div class="lesson-key"><b>Careful:</b> 〜たい and ほしい describe <i>your own</i> feelings. For a third person, switch to 〜たがる / ほしがる — Japanese avoids stating others' inner desires directly.</div>` },
      ],
      practice: [
        { label: "📖 Study N4 Potential Verbs", type: "study", sel: "n4verbpot" },
        { label: "📖 All N4 Grammar", type: "study", sel: "n4gram" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },

    {
      id: "quoting", stage: "Elementary · N4", title: "Quoting & Reported Speech",
      summary: "Saying what someone said or thought — with と, って, and embedded questions.",
      sections: [
        { heading: "The quote particle と", html:
          `<p><b>と</b> marks a quote, then a verb of speaking or thinking follows. The quoted part keeps its own (usually plain) form:</p>
           <ul>
             <li><b>Direct</b> (word-for-word): 「明日来る」<u>と</u>言った — he said, "I'll come tomorrow."</li>
             <li><b>Indirect</b>: 明日来る<u>と</u>言った — he said (that) he'd come tomorrow.</li>
             <li>With thought: いい考えだ<u>と</u>思う — "I think it's a good idea."</li>
           </ul>
           <p>Notice the quoted clause stays plain (来る, not 来ます) even when the main verb is polite (言いました).</p>` },
        { heading: "Casual quoting: って", html:
          `<p>In speech, <b>って</b> replaces と (and often the verb too):</p>
           <ul>
             <li>田中さん、来る<b>って</b> — "Tanaka says he's coming."</li>
             <li>明日休みだ<b>って</b> — "(I heard) tomorrow's a day off."</li>
           </ul>
           <p>って also works as a casual topic marker: 日本語<b>って</b>難しいね ("Japanese sure is hard, huh").</p>` },
        { heading: "Embedded questions", html:
          `<p>To slot a question inside a bigger sentence, use <b>かどうか</b> ("whether or not") or a <b>question word + か</b>:</p>
           <ul>
             <li>来る<b>かどうか</b>分からない — "I don't know whether he'll come."</li>
             <li>何を買う<b>か</b>決めた — "I decided what to buy."</li>
             <li>どこに行った<b>か</b>知っていますか — "do you know where they went?"</li>
           </ul>` },
        { heading: "Reporting what you heard", html:
          `<p>Beyond direct quoting, three patterns relay information secondhand:</p>
           <ul>
             <li><b>〜と言っていた</b> — "(someone) said that ~": 来ると言っていた.</li>
             <li><b>〜そうだ</b> (hearsay) — "I hear that ~": 晴れるそうだ.</li>
             <li><b>〜らしい</b> — "apparently ~": 引っ越したらしい.</li>
           </ul>
           <div class="lesson-key"><b>The golden rule:</b> whatever sits before と / って / か goes in <i>plain form</i>. Get that reflex and reported speech becomes mechanical.</div>` },
      ],
      practice: [
        { label: "📖 All N4 Grammar", type: "study", sel: "n4gram" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "time-clauses", stage: "Elementary · N4", title: "Time Clauses: When Things Happen",
      summary: "とき, 前に, 後で, てから, ながら, うちに — and how verb form sets the timing.",
      sections: [
        { heading: "〜とき: \"when\"", html:
          `<p>Attach <b>とき</b> to a plain-form clause to mean "when / at the time of". Crucially, the <i>tense</i> of the verb before とき sets the timing:</p>
           <ul>
             <li>日本へ<b>行くとき</b>、辞書を買った — "when going to Japan (before/on the way), I bought a dictionary."</li>
             <li>日本へ<b>行ったとき</b>、辞書を買った — "when I had gone to Japan (after arriving), I bought a dictionary."</li>
           </ul>
           <p>Dictionary form = the main action happens first/around then; past form = the とき-action already finished.</p>` },
        { heading: "Before, after, after-and-then", html:
          `<p>Three patterns, each demanding a specific verb form:</p>
           <table class="ex-table">
             <tr><td>〜前に</td><td>dictionary form</td><td>寝る前に歯を磨く (before sleeping)</td></tr>
             <tr><td>〜後で</td><td>past (た) form</td><td>食べた後で散歩する (after eating)</td></tr>
             <tr><td>〜てから</td><td>て-form</td><td>手を洗ってから食べる (after washing, then eat)</td></tr>
           </table>
           <p>前に always takes the dictionary form regardless of when it happened; 後で always takes た.</p>` },
        { heading: "Simultaneous & during", html:
          `<ul>
             <li><b>〜ながら</b> — two actions by the <i>same</i> person at once: 音楽を聞き<b>ながら</b>勉強する.</li>
             <li><b>〜間 (あいだ)</b> — "the whole time during": 留守の<b>間</b>、雨だった.</li>
             <li><b>〜間に (あいだに)</b> — "at some point during": 留守の<b>間に</b>荷物が届いた.</li>
             <li><b>〜うちに</b> — "while a state still lasts": 熱い<b>うちに</b>食べて (while it's hot).</li>
           </ul>` },
        { heading: "間 vs 間に", html:
          `<div class="lesson-key"><b>The classic trap:</b> 〜間 = something continues for the <i>whole</i> duration; 〜間に = a one-time event happens <i>at some point</i> within it. 寝ている間 (slept the whole time) vs 寝ている間に地震があった (an earthquake hit while I slept).</div>
           <p>When you meet a time clause, your first question is always "what form does the verb need?" — that, not the meaning, is where mistakes happen.</p>` },
      ],
      practice: [
        { label: "📖 All N4 Grammar", type: "study", sel: "n4gram" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },

    {
      id: "permission-obligation", stage: "Elementary · N4", title: "Permission, Obligation & Advice",
      summary: "May I, must, mustn't, don't have to, and you'd better — all built on two verb stems.",
      sections: [
        { heading: "Permission & prohibition", html:
          `<p>Both build on the <b>て-form</b>:</p>
           <ul>
             <li><b>〜てもいい</b> — "may / it's okay to": ここに座っ<b>てもいい</b>ですか ("may I sit here?").</li>
             <li><b>〜てはいけない</b> — "must not / not allowed": ここで写真を撮っ<b>てはいけない</b> ("you mustn't take photos here").</li>
           </ul>
           <p>In casual speech 〜てはいけない often shrinks to 〜ちゃいけない / 〜ちゃだめ.</p>` },
        { heading: "Obligation: \"must\"", html:
          `<p>These build on the <b>negative (ない) stem</b> — literally "if you don't ~, it won't do":</p>
           <table class="ex-table">
             <tr><td>〜なければならない</td><td>must / have to (formal)</td></tr>
             <tr><td>〜なくてはいけない</td><td>must / have to (everyday)</td></tr>
             <tr><td>〜なきゃ / 〜なくちゃ</td><td>casual contractions of the above</td></tr>
           </table>
           <p>もう行か<b>なければならない</b> = "I have to go now." Casually: もう行か<b>なきゃ</b>.</p>` },
        { heading: "No obligation", html:
          `<p>The flip side — "you don't have to" — uses the same ない stem + てもいい:</p>
           <p>急が<b>なくてもいい</b>ですよ = "you don't have to hurry." (Contrast with 急いではいけない = "you mustn't hurry".)</p>` },
        { heading: "Giving advice", html:
          `<ul>
             <li><b>〜方がいい</b> — "it's better to": 早く寝た<b>方がいい</b> ("you'd better sleep early"). Note the <i>past</i> form 寝た for advice.</li>
             <li><b>〜べきだ</b> — "should (morally)": 約束は守る<b>べきだ</b>.</li>
             <li><b>〜たらどうですか</b> — "why don't you ~?": 医者に行っ<b>たらどう</b>ですか.</li>
           </ul>
           <div class="lesson-key"><b>The shortcut:</b> this whole cluster grows from just two stems — the <b>て-form</b> (permission/prohibition) and the <b>ない-stem</b> (obligation). Nail those two and "may/must/mustn't/needn't" all fall into place.</div>` },
      ],
      practice: [
        { label: "📖 All N4 Grammar", type: "study", sel: "n4gram" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },

    {
      id: "doctor", stage: "Elementary · N4", title: "Survival Japanese: At the Doctor & Pharmacy",
      summary: "Describing symptoms, body parts, and handling a prescription.",
      sections: [
        { heading: "Saying what's wrong", html:
          `<p>The core pattern is <b>body part + が痛い</b> ("~ hurts"), plus a few key health phrases:</p>
           <ul>
             <li>頭が痛い (atama ga itai) — "I have a headache." Likewise お腹が痛い, のどが痛い.</li>
             <li>熱があります — "I have a fever."</li>
             <li>気分が悪い — "I feel sick / unwell."</li>
             <li>咳が出ます (せきがでます) — "I have a cough."</li>
           </ul>` },
        { heading: "Body parts", html:
          `<table class="ex-table">
             <tr><td>頭 あたま</td><td>head</td></tr>
             <tr><td>お腹 おなか</td><td>stomach / belly</td></tr>
             <tr><td>のど</td><td>throat</td></tr>
             <tr><td>歯 は</td><td>tooth</td></tr>
             <tr><td>背中 せなか / 腰 こし</td><td>back / lower back</td></tr>
             <tr><td>目・耳・鼻</td><td>eye / ear / nose</td></tr>
             <tr><td>手・足</td><td>hand-arm / foot-leg</td></tr>
           </table>` },
        { heading: "At the clinic", html:
          `<p>Soften a guess with 〜みたいです or 〜と思います, and expect a few questions:</p>
           <ul>
             <li>風邪をひいたみたいです — "I think I've caught a cold."</li>
             <li>いつからですか — "since when?" Answer: 昨日から (since yesterday).</li>
             <li>Useful nouns: 風邪 (cold), 熱 (fever), 怪我 けが (injury), アレルギー (allergy).</li>
           </ul>` },
        { heading: "At the pharmacy", html:
          `<table class="ex-table">
             <tr><td>薬 くすり</td><td>medicine</td></tr>
             <tr><td>処方箋 しょほうせん</td><td>prescription</td></tr>
             <tr><td>一日三回 いちにちさんかい</td><td>three times a day</td></tr>
             <tr><td>食後 / 食前</td><td>after / before meals</td></tr>
           </table>
           <div class="lesson-key"><b>The kit:</b> "(body part) が痛い" + "熱があります" + "〜みたいです" lets you describe almost any everyday ailment clearly.</div>` },
      ],
      practice: [
        { label: "📖 Study N5 Nouns", type: "study", sel: "n5nouns" },
        { label: "📖 Study N4 Vocabulary", type: "study", sel: "n4vocab" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "admin", stage: "Elementary · N4", title: "Survival Japanese: Hotel, Bank & Post Office",
      summary: "The polite \"I'd like to…\" frame and the vocabulary for everyday errands.",
      sections: [
        { heading: "The magic opener: 〜たいんですが", html:
          `<p>Almost every counter interaction starts the same way — state your goal with <b>〜たいんですが</b> ("I'd like to ~, …") and let the staff guide you:</p>
           <ul>
             <li>チェックインしたいんですが — "I'd like to check in…"</li>
             <li>両替したいんですが — "I'd like to exchange money…"</li>
             <li>これを送りたいんですが — "I'd like to send this…"</li>
           </ul>
           <p>The trailing んですが softens it and invites help — far more natural than a bare command.</p>` },
        { heading: "At a hotel", html:
          `<table class="ex-table">
             <tr><td>予約 よやく</td><td>reservation</td></tr>
             <tr><td>チェックイン / チェックアウト</td><td>check-in / check-out</td></tr>
             <tr><td>一泊 いっぱく</td><td>one night('s stay)</td></tr>
             <tr><td>朝食付き ちょうしょくつき</td><td>with breakfast</td></tr>
           </table>` },
        { heading: "Bank & money", html:
          `<table class="ex-table">
             <tr><td>両替 りょうがえ</td><td>currency exchange</td></tr>
             <tr><td>口座 こうざ</td><td>(bank) account</td></tr>
             <tr><td>振り込み ふりこみ</td><td>bank transfer</td></tr>
             <tr><td>引き出す ひきだす</td><td>to withdraw</td></tr>
           </table>` },
        { heading: "Post office", html:
          `<table class="ex-table">
             <tr><td>送る おくる</td><td>to send</td></tr>
             <tr><td>切手 きって</td><td>stamp</td></tr>
             <tr><td>封筒 / はがき</td><td>envelope / postcard</td></tr>
             <tr><td>航空便 こうくうびん / 船便 ふなびん</td><td>airmail / surface mail</td></tr>
           </table>
           <div class="lesson-key"><b>One frame, endless uses:</b> 〜たいんですが states what you want politely and hands the conversation to the person who knows the next step. It's the workhorse of every errand.</div>` },
      ],
      practice: [
        { label: "📖 Study N4 Vocabulary", type: "study", sel: "n4vocab" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "phone-emergency", stage: "Elementary · N4", title: "Survival Japanese: Phone, Email & Emergencies",
      summary: "Phone etiquette, email openers, and the phrases you hope you'll never need.",
      sections: [
        { heading: "On the phone", html:
          `<p>Phone Japanese has its own set phrases:</p>
           <ul>
             <li><b>もしもし</b> — "hello?" (phone only).</li>
             <li>〜さんをお願いします — "may I speak to ~?"</li>
             <li>〜と申します — "this is ~ (speaking)" (humble self-intro).</li>
             <li>少々お待ちください — "one moment please."</li>
             <li>また かけ直します — "I'll call back."</li>
           </ul>` },
        { heading: "Email & letter frames", html:
          `<p>Business and polite messages open and close with fixed phrases:</p>
           <ul>
             <li>Opening: お世話になっております ("thank you for your continued support").</li>
             <li>Closing: よろしくお願いいたします ("thank you in advance").</li>
             <li>Sign-off: 〜より ("from ~").</li>
           </ul>` },
        { heading: "Emergencies", html:
          `<p>Memorize these — the two numbers especially:</p>
           <table class="ex-table">
             <tr><td>110 (ひゃくとおばん)</td><td>police</td></tr>
             <tr><td>119 (ひゃくじゅうきゅうばん)</td><td>fire &amp; ambulance</td></tr>
             <tr><td>助けて(ください)!</td><td>help!</td></tr>
             <tr><td>救急車を呼んでください</td><td>please call an ambulance</td></tr>
             <tr><td>〜が盗まれました</td><td>my ~ was stolen</td></tr>
           </table>` },
        { heading: "Asking for help", html:
          `<ul>
             <li>すみません、ちょっといいですか — "excuse me, do you have a moment?"</li>
             <li>〜が分かりません / 道に迷いました — "I don't understand ~ / I'm lost."</li>
             <li>病院はどこですか — "where's the hospital?"</li>
           </ul>
           <div class="lesson-key"><b>Lock these in now:</b> 119 for an ambulance, 110 for police, and 助けてください / 救急車を呼んでください. They're the few phrases worth knowing cold before you ever need them.</div>` },
      ],
      practice: [
        { label: "📖 N4 Daily Conversation", type: "study", sel: "n4phrdaily" },
        { label: "📖 Study N4 Vocabulary", type: "study", sel: "n4vocab" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },

    {
      id: "technology", stage: "Elementary · N4", title: "Technology & the Internet",
      summary: "Devices, apps, and online life — the (mostly katakana) vocabulary of modern Japan.",
      sections: [
        { heading: "Devices", html:
          `<table class="ex-table">
             <tr><td>スマホ</td><td>smartphone (clipped from スマートフォン)</td></tr>
             <tr><td>パソコン</td><td>computer (personal computer)</td></tr>
             <tr><td>ノートパソコン</td><td>laptop</td></tr>
             <tr><td>タブレット</td><td>tablet</td></tr>
             <tr><td>充電する じゅうでん</td><td>to charge</td></tr>
             <tr><td>電源 でんげん</td><td>power (on/off)</td></tr>
           </table>` },
        { heading: "Online & apps", html:
          `<table class="ex-table">
             <tr><td>ネット / インターネット</td><td>the internet</td></tr>
             <tr><td>アプリ</td><td>app</td></tr>
             <tr><td>サイト / ウェブサイト</td><td>website</td></tr>
             <tr><td>メール</td><td>email</td></tr>
             <tr><td>パスワード / ログイン</td><td>password / log in</td></tr>
             <tr><td>検索する けんさく</td><td>to search</td></tr>
             <tr><td>ダウンロード / アップロード</td><td>download / upload</td></tr>
           </table>` },
        { heading: "Messaging & social media", html:
          `<ul>
             <li>SNS — "social networking service" (how Japanese refers to social media collectively).</li>
             <li>メッセージを送る / 届く — send / receive a message.</li>
             <li>既読 きどく — "read" (the read-receipt; 既読スルー = leaving a read message unanswered).</li>
             <li>通知 つうじ→つうち — notification ・ ビデオ通話 — video call.</li>
           </ul>` },
        { heading: "It's mostly loanwords", html:
          `<div class="lesson-key"><b>Tech vocabulary is overwhelmingly katakana</b> gairaigo, frequently clipped (スマホ, アプリ, リモコン). If your katakana reading is fast, you already understand most of it — and watch for wasei-eigo coinages that look English but aren't.</div>` },
      ],
      practice: [
        { label: "📖 Study Katakana", type: "study", sel: "katakana" },
        { label: "📖 Study N4 Vocabulary", type: "study", sel: "n4vocab" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "work-school", stage: "Elementary · N4", title: "Work & School Life",
      summary: "The vocabulary and hierarchy of classrooms and offices — including senpai/kohai.",
      sections: [
        { heading: "School", html:
          `<table class="ex-table">
             <tr><td>小学校・中学校・高校・大学</td><td>elementary / junior high / high school / university</td></tr>
             <tr><td>授業 じゅぎょう</td><td>class / lesson</td></tr>
             <tr><td>宿題 しゅくだい</td><td>homework</td></tr>
             <tr><td>試験 / テスト</td><td>exam / test</td></tr>
             <tr><td>成績 せいせき</td><td>grades</td></tr>
             <tr><td>部活 ぶかつ</td><td>club activities</td></tr>
           </table>` },
        { heading: "Work", html:
          `<table class="ex-table">
             <tr><td>会社 かいしゃ / 仕事 しごと</td><td>company / job</td></tr>
             <tr><td>社員 しゃいん</td><td>(full) employee</td></tr>
             <tr><td>アルバイト / パート</td><td>part-time work</td></tr>
             <tr><td>給料 きゅうりょう</td><td>salary / pay</td></tr>
             <tr><td>残業 ざんぎょう</td><td>overtime</td></tr>
             <tr><td>会議 かいぎ</td><td>meeting</td></tr>
           </table>` },
        { heading: "Roles & hierarchy", html:
          `<p>Japanese organizations are strongly ranked, and the words reflect it:</p>
           <ul>
             <li>Titles: 社長 (president) &gt; 部長 (dept. head) &gt; 課長 (section chief).</li>
             <li><b>先輩 (senpai)</b> / <b>後輩 (kōhai)</b> — your senior / junior by entry, not just age. This relationship governs tone, favors, and language in clubs and companies alike.</li>
             <li>同僚 (dōryō) — a colleague at your level.</li>
           </ul>` },
        { heading: "Everyday phrases", html:
          `<ul>
             <li>お疲れ様です — the all-purpose workplace greeting (hello / well done / bye).</li>
             <li>よろしくお願いします — opening a task or relationship.</li>
             <li>お先に失礼します — "excuse me for leaving first" (when you clock out).</li>
           </ul>
           <div class="lesson-key"><b>Hierarchy is baked into the language.</b> 先輩/後輩 and お疲れ様 aren't just vocabulary — they encode the social structure that decides which politeness level you use with whom.</div>` },
      ],
      practice: [
        { label: "📖 N5 Classroom Phrases", type: "study", sel: "n5classroom" },
        { label: "📖 Study N4 Vocabulary", type: "study", sel: "n4vocab" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },

    {
      id: "emotions", stage: "Elementary · N4", title: "Emotions & Describing People",
      summary: "Feelings, personality, appearance — and the rule for talking about others' emotions.",
      sections: [
        { heading: "Feelings", html:
          `<table class="ex-table">
             <tr><td>嬉しい うれしい</td><td>happy</td></tr>
             <tr><td>悲しい かなしい</td><td>sad</td></tr>
             <tr><td>楽しい たのしい</td><td>fun / enjoyable</td></tr>
             <tr><td>つまらない</td><td>boring</td></tr>
             <tr><td>怖い こわい / 寂しい さびしい</td><td>scary / lonely</td></tr>
             <tr><td>怒る おこる / びっくりする</td><td>get angry / be surprised</td></tr>
           </table>` },
        { heading: "Others' feelings are indirect", html:
          `<p>Japanese avoids flatly stating what someone <i>else</i> feels inside — you report it through evidence. (You met both tools earlier.)</p>
           <ul>
             <li><b>〜そう</b> ("looks ~"): 弟は嬉し<b>そう</b>だ ("my brother looks happy").</li>
             <li><b>〜がる</b> ("shows signs of ~"): 子供が怖<b>がって</b>いる ("the child is scared").</li>
           </ul>
           <p>About yourself: 嬉しい. About others: 嬉しそう / 嬉しがっている.</p>` },
        { heading: "Personality", html:
          `<table class="ex-table">
             <tr><td>優しい やさしい</td><td>kind, gentle</td></tr>
             <tr><td>まじめ</td><td>serious, diligent</td></tr>
             <tr><td>面白い おもしろい</td><td>funny / interesting</td></tr>
             <tr><td>静か / 元気</td><td>quiet / energetic</td></tr>
             <tr><td>親切 しんせつ</td><td>kind, helpful</td></tr>
             <tr><td>わがまま</td><td>selfish, willful</td></tr>
           </table>` },
        { heading: "Appearance", html:
          `<p>Describe looks with adjectives, and use 〜ている for ongoing physical states:</p>
           <ul>
             <li>背が高い / 低い (tall / short), かわいい (cute), かっこいい (cool), きれい (pretty).</li>
             <li>State verbs take 〜ている: 痩せ<b>ている</b> (is slim), 太っ<b>ている</b> (is heavy), メガネをかけ<b>ている</b> (wears glasses).</li>
           </ul>
           <div class="lesson-key"><b>Two reminders:</b> most feelings are い-adjectives, and you describe <i>your own</i> emotions directly but <i>others'</i> through 〜そう / 〜がる.</div>` },
      ],
      practice: [
        { label: "📖 Study N4 い-Adjectives", type: "study", sel: "n4adji" },
        { label: "📖 Study N4 Vocabulary", type: "study", sel: "n4vocab" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "travel", stage: "Elementary · N4", title: "Travel & Transport in Depth",
      summary: "Getting around Japan — transport modes, tickets, and trip-planning questions.",
      sections: [
        { heading: "Modes of transport", html:
          `<p>The vehicle is marked with <b>で</b> ("by"): 新幹線<u>で</u>行く.</p>
           <table class="ex-table">
             <tr><td>電車 / 新幹線</td><td>train / bullet train</td></tr>
             <tr><td>バス / タクシー</td><td>bus / taxi</td></tr>
             <tr><td>飛行機 ひこうき / 船 ふね</td><td>plane / ship</td></tr>
             <tr><td>自転車 じてんしゃ</td><td>bicycle</td></tr>
           </table>` },
        { heading: "Tickets & booking", html:
          `<table class="ex-table">
             <tr><td>切符 きっぷ / 予約する</td><td>ticket / to reserve</td></tr>
             <tr><td>片道 / 往復</td><td>one-way / round trip</td></tr>
             <tr><td>指定席 / 自由席</td><td>reserved seat / unreserved seat</td></tr>
             <tr><td>〜行き ゆき</td><td>bound for ~</td></tr>
           </table>` },
        { heading: "Trip-planning questions", html:
          `<ul>
             <li>〜まで いくらですか — "how much to ~?"</li>
             <li>〜まで どのくらい かかりますか — "how long does it take to ~?"</li>
             <li>次の電車は何時ですか — "what time is the next train?"</li>
             <li>乗り換えが必要ですか — "do I need to transfer?"</li>
           </ul>` },
        { heading: "Sightseeing", html:
          `<table class="ex-table">
             <tr><td>観光 かんこう</td><td>sightseeing</td></tr>
             <tr><td>名所 めいしょ / 観光地</td><td>famous spot / tourist area</td></tr>
             <tr><td>お土産 おみやげ</td><td>souvenir</td></tr>
             <tr><td>案内所 あんないじょ</td><td>information center</td></tr>
           </table>
           <div class="lesson-key"><b>The trip-planning trio:</b> 〜まで + どのくらい/いくら + どうやって行きますか. With those three you can sort out cost, time, and route to anywhere.</div>` },
      ],
      practice: [
        { label: "📖 Study N4 Vocabulary", type: "study", sel: "n4vocab" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },

    {
      id: "common-mistakes", stage: "Elementary · N4", title: "Common Mistakes & False Friends",
      summary: "The errors English speakers make most — topic vs subject, perspective, and が-objects.",
      sections: [
        { heading: "は vs が, one more time", html:
          `<p>The single most persistent trap. Quick reliable cues:</p>
           <ul>
             <li><b>は</b> marks the <i>topic</i> — known/old info ("speaking of ~").</li>
             <li><b>が</b> marks <i>new</i> info, the subject of a description, and the answer to a question word: 誰が来た? → 私<b>が</b>来た (never 私は here).</li>
           </ul>
           <p>If you could put "as for…" in front, use は; if you're identifying <i>which one</i>, use が.</p>` },
        { heading: "Perspective: 行く vs 来る", html:
          `<p>Japanese 来る ("come") means <i>movement toward the speaker's location</i> — so where English says "I'll come (to you)", Japanese uses 行く:</p>
           <ul>
             <li>"I'll come to your party" → パーティーに<b>行きます</b> (motion away from <i>me</i>).</li>
             <li>来る is only when something moves toward where <i>you</i> are.</li>
           </ul>
           <p>The same speaker-centered logic drives あげる/くれる and 連れて行く / 連れて来る.</p>` },
        { heading: "Likes & ability take が, not を", html:
          `<p>With 好き, 嫌い, 上手, 欲しい, and the potential form, the "object" is marked with <b>が</b>:</p>
           <ul>
             <li>私は寿司<b>が</b>好きです (not を好き).</li>
             <li>日本語<b>が</b>話せます (potential — が, not を).</li>
           </ul>` },
        { heading: "Structure carried over from English", html:
          `<ul>
             <li><b>Pronoun overuse</b>: drop 私/あなた whenever context is clear — repeating them sounds unnatural.</li>
             <li><b>"Have"</b>: use ある (things) / いる (people) for possession-existence, 持っている for physically holding — not one catch-all verb.</li>
             <li><b>Intransitive + を</b>: ドア<b>が</b>開く ("the door opens"), never ドアを開く.</li>
           </ul>
           <div class="lesson-key"><b>The pattern behind the errors:</b> most come from mapping English structure onto Japanese. Watch topic-vs-subject, the speaker-centered 行く/来る, and the が-marked object of feelings — fixing those three clears up the majority of slips.</div>` },
      ],
      practice: [
        { label: "📖 All N4 Grammar", type: "study", sel: "n4gram" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "numbers-life", stage: "Elementary · N4", title: "Numbers in Real Life: Money, Measures & Stats",
      summary: "Paying, measuring, percentages, and the number forms that surprise English speakers.",
      sections: [
        { heading: "Money in action", html:
          `<table class="ex-table">
             <tr><td>払う はらう</td><td>to pay</td></tr>
             <tr><td>貯金 ちょきん</td><td>savings</td></tr>
             <tr><td>借りる / 貸す</td><td>to borrow / to lend</td></tr>
             <tr><td>値段 / 料金 / 費用</td><td>price / fee / cost</td></tr>
             <tr><td>税金 ぜいきん</td><td>tax</td></tr>
             <tr><td>無料 / 有料</td><td>free / paid</td></tr>
             <tr><td>おつり</td><td>change (money back)</td></tr>
           </table>` },
        { heading: "Measurements", html:
          `<table class="ex-table">
             <tr><td>メートル / キロ</td><td>meter / kilometer (or kilogram)</td></tr>
             <tr><td>グラム / センチ / リットル</td><td>gram / centimeter / liter</td></tr>
             <tr><td>度 ど</td><td>degrees (temperature / angle)</td></tr>
           </table>
           <p>今日は三十度です — "it's 30 degrees today."</p>` },
        { heading: "Percentages & proportions", html:
          `<p>Two systems for parts-of-a-whole, and the 割 one trips everyone up:</p>
           <table class="ex-table">
             <tr><td>パーセント</td><td>percent (30% = 三十パーセント)</td></tr>
             <tr><td>〜割 わり</td><td>tens of percent: 三割 = 30%, 五割 = 50%</td></tr>
             <tr><td>半分 はんぶん / 倍 ばい</td><td>half / double (or "~ times")</td></tr>
             <tr><td>〜分の〜</td><td>fractions: 三分の一 = one third</td></tr>
           </table>` },
        { heading: "Reading statistics", html:
          `<p>This vocabulary fills N3+ reading and news graphs:</p>
           <ul>
             <li>増える / 減る — to increase / decrease.</li>
             <li>約 (approx.), 以上 / 以下 (or more / or less), 平均 (average).</li>
           </ul>
           <div class="lesson-key"><b>Two forms to drill:</b> 〜割 (count in tens of percent, so 三割 = 30%) and 〜分の〜 (fractions, read "denominator 分の numerator"). Both run backward from English intuition.</div>` },
      ],
      practice: [
        { label: "📖 Study N4 Vocabulary", type: "study", sel: "n4vocab" },
        { label: "📖 Study N5 Numbers", type: "study", sel: "n5numbers" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },

    {
      id: "conditionals", stage: "Elementary · N4", title: "Conditionals: と・ば・たら・なら",
      summary: "Japan's four ways to say \"if/when\" — and the distinct flavor of each.",
      sections: [
        { heading: "Four conditionals, four flavors", html:
          `<p>Where English has one "if", Japanese has four — and choosing the right one is a hallmark of solid N4 grammar:</p>
           <table class="ex-table">
             <tr><td>〜と</td><td>automatic, natural result</td><td>押すと開く</td></tr>
             <tr><td>〜ば</td><td>general hypothetical</td><td>安ければ買う</td></tr>
             <tr><td>〜たら</td><td>the all-purpose "if / when"</td><td>着いたら電話して</td></tr>
             <tr><td>〜なら</td><td>"if it's the case that…"</td><td>行くなら教えて</td></tr>
           </table>` },
        { heading: "〜と — inevitable result", html:
          `<p><b>と</b> states that B <i>always</i> follows A — laws of nature, machines, directions:</p>
           <ul>
             <li>春になる<b>と</b>桜が咲く — "when spring comes, the blossoms bloom."</li>
             <li>右に曲がる<b>と</b>駅があります — "turn right and there's the station."</li>
           </ul>
           <p>You <i>can't</i> follow と with a command, request, or invitation — only a natural consequence.</p>` },
        { heading: "〜ば and 〜たら", html:
          `<ul>
             <li><b>〜ば</b> — a general "if": 練習すれ<b>ば</b>上手になる. Also the "the more…" pattern: 〜ば〜ほど.</li>
             <li><b>〜たら</b> — the most flexible; "if" <i>or</i> "when (once ~ happens)": 家に帰っ<b>たら</b>、電話して. It even covers a past discovery: 窓を開け<b>たら</b>、猫がいた ("when I opened the window, there was a cat").</li>
           </ul>` },
        { heading: "〜なら — given that / as for", html:
          `<p><b>なら</b> responds to a situation or topic — "if that's the case, then…". It often picks up something just mentioned:</p>
           <ul>
             <li>「京都に行きます」「京都<b>なら</b>、清水寺がいいよ」 — "Kyoto? Then Kiyomizu-dera is nice."</li>
             <li>Unlike たら, the なら-clause needn't happen first: 日本に行く<b>なら</b>、円を買っておこう ("if you're going to Japan, buy yen beforehand").</li>
           </ul>
           <div class="lesson-key"><b>When stuck, reach for たら</b> — it covers most "if/when" cases. Then layer in と for inevitabilities, ば for hypotheticals, and なら for "given that."</div>` },
      ],
      practice: [
        { label: "📖 All N4 Grammar", type: "study", sel: "n4gram" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "leisure", stage: "Elementary · N4", title: "Sports, Hobbies & Leisure",
      summary: "Talking about sports, the arts, and what you do for fun.",
      sections: [
        { heading: "Sports", html:
          `<p>Most sports are nouns + する (or やる, casual): テニスを<b>する</b>, サッカーを<b>やる</b>.</p>
           <table class="ex-table">
             <tr><td>野球 / サッカー</td><td>baseball / soccer</td></tr>
             <tr><td>テニス / 水泳 すいえい</td><td>tennis / swimming</td></tr>
             <tr><td>スキー / 登山 とざん</td><td>skiing / mountain climbing</td></tr>
             <tr><td>試合 しあい / 練習</td><td>a match / practice</td></tr>
           </table>` },
        { heading: "Arts & at-home hobbies", html:
          `<ul>
             <li>音楽 (music); play an instrument 楽器 with <b>弾く</b>: ピアノ／ギターを弾く.</li>
             <li>絵を描く (draw/paint), 写真を撮る (photography), 読書 (reading), 料理 (cooking).</li>
           </ul>` },
        { heading: "Going out & leisure", html:
          `<table class="ex-table">
             <tr><td>映画 / カラオケ</td><td>movies / karaoke</td></tr>
             <tr><td>旅行 / キャンプ</td><td>travel / camping</td></tr>
             <tr><td>釣り つり / 散歩</td><td>fishing / a walk</td></tr>
           </table>` },
        { heading: "Saying what you're into", html:
          `<ul>
             <li>〜が得意 / 苦手 — good / bad at: スポーツが<b>得意</b>です.</li>
             <li>〜に興味がある — interested in: 日本の歴史<b>に興味がある</b>.</li>
             <li>〜にはまっている — really into / hooked on (casual): 最近ゲーム<b>にはまっている</b>.</li>
           </ul>
           <div class="lesson-key"><b>Conversation gold:</b> 〜に興味がある ("I'm interested in ~") and 〜が得意 ("I'm good at ~") turn a hobby list into an actual conversation about yourself.</div>` },
      ],
      practice: [
        { label: "📖 Study N4 Vocabulary", type: "study", sel: "n4vocab" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },

    {
      id: "change-becoming", stage: "Elementary · N4", title: "Expressing Change & Becoming",
      summary: "なる, ようになる, ようにする, and the gradual change of ～ていく／てくる.",
      sections: [
        { heading: "なる — to become", html:
          `<p>The core "change" verb. How it attaches depends on the word:</p>
           <table class="ex-table">
             <tr><td>い-adjective</td><td>い → く + なる</td><td>寒くなる (get cold)</td></tr>
             <tr><td>な-adjective</td><td>+ に + なる</td><td>静かになる (get quiet)</td></tr>
             <tr><td>noun</td><td>+ に + なる</td><td>先生になる (become a teacher)</td></tr>
           </table>` },
        { heading: "〜ようになる — a new ability or habit", html:
          `<p>Use it for reaching a state you couldn't before — especially with the potential form:</p>
           <ul>
             <li>日本語が話せる<b>ようになった</b> — "I've become able to speak Japanese."</li>
             <li>野菜を食べる<b>ようになった</b> — "I've started eating vegetables (as a habit)."</li>
           </ul>
           <p>Its negative twin is 〜なくなる ("come to no longer ~"): テレビを見なくなった.</p>` },
        { heading: "〜ようにする — make an effort to", html:
          `<p>This is a change <i>you</i> drive — making a point of doing something:</p>
           <ul>
             <li>毎日運動する<b>ようにしている</b> — "I make a point of exercising daily."</li>
             <li>遅れない<b>ようにする</b> — "I'll try not to be late."</li>
           </ul>` },
        { heading: "Gradual change: 〜ていく / 〜てくる", html:
          `<p>For change <i>over time</i>, the direction word tells you which way the timeline runs:</p>
           <ul>
             <li><b>〜てくる</b> — change <i>up to now</i>: だんだん寒くなっ<b>てきた</b> ("it's gotten cold").</li>
             <li><b>〜ていく</b> — change <i>from now on</i>: これから人口が減っ<b>ていく</b> ("the population will keep falling").</li>
           </ul>
           <div class="lesson-key"><b>Three tools, three jobs:</b> なる = a change of state · ようになる = a change in ability/habit · 〜てくる／ていく = gradual change along a timeline (toward now / away into the future).</div>` },
      ],
      practice: [
        { label: "📖 All N4 Grammar", type: "study", sel: "n4gram" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },

    {
      id: "clarifying", stage: "Elementary · N4", title: "Asking, Clarifying & Checking Understanding",
      summary: "What to say when you don't catch something — the survival skill for real conversation.",
      sections: [
        { heading: "When you didn't catch it", html:
          `<ul>
             <li>すみません、もう一度お願いします — "sorry, once more please."</li>
             <li>もう少しゆっくり話してください — "please speak a little more slowly."</li>
             <li>えっ? / 今、何と言いましたか — "huh? / what did you just say?"</li>
           </ul>` },
        { heading: "Checking meaning", html:
          `<ul>
             <li>「(word)」って どういう意味ですか — "what does ~ mean?"</li>
             <li>「(word)」という意味ですか — "do you mean ~?"</li>
             <li>これで合っていますか — "is this right?"</li>
             <li>(word) は どう書きますか — "how do you write ~?"</li>
           </ul>` },
        { heading: "Confirming you understood", html:
          `<ul>
             <li>なるほど / 分かりました — "I see / understood."</li>
             <li>つまり、〜ということですね — "so, you mean ~, right?" (great for confirming).</li>
             <li>Repeat back the key word with 〜ですね to check.</li>
           </ul>` },
        { heading: "Buying time & admitting you're lost", html:
          `<ul>
             <li>Fillers: えーと… / あのー… (the natural "um…").</li>
             <li>ちょっと分かりません — "I don't quite understand."</li>
             <li>Note: 分かりません = "I don't understand"; 知りません = "I don't know (that fact)" — and a bare 知りません can sound cold.</li>
           </ul>
           <div class="lesson-key"><b>Don't fake it.</b> もう一度お願いします and 「〜」ってどういう意味? keep a real conversation moving when you're lost — and asking shows you're engaged, which Japanese speakers appreciate.</div>` },
      ],
      practice: [
        { label: "📖 N4 Daily Conversation", type: "study", sel: "n4phrdaily" },
        { label: "📖 N4 Making Requests", type: "study", sel: "n4phrrequest" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "apolog-thanks", stage: "Elementary · N4", title: "Apologizing, Thanking & Declining",
      summary: "Sorry, thanks, and 'no' at the right level — the social lubricant of Japanese.",
      sections: [
        { heading: "Three levels of 'sorry'", html:
          `<table class="ex-table">
             <tr><td>ごめん(ね)</td><td>casual — friends, family</td></tr>
             <tr><td>すみません</td><td>everyday — also "excuse me" and even "thanks"</td></tr>
             <tr><td>申し訳ありません / ございません</td><td>formal, sincere apology</td></tr>
           </table>
           <p>For a real apology to a customer or superior, すみません is too light — step up to 申し訳ございません.</p>` },
        { heading: "Thanking", html:
          `<ul>
             <li>ありがとう(ございます) / どうも — thanks (casual → polite).</li>
             <li>〜てくれて／いただいて ありがとうございます — "thanks for ~ing."</li>
             <li>助かりました — "that really helped / you saved me."</li>
             <li>おかげさまで — "thanks to you" (for well-wishes).</li>
           </ul>` },
        { heading: "Excusing yourself & entering", html:
          `<ul>
             <li>失礼します — "excuse me" (entering/leaving a room, ending a call).</li>
             <li>お邪魔します — said when entering someone's home.</li>
             <li>ちょっとよろしいですか — "do you have a moment?"</li>
             <li>お先に(失礼します) — "(excuse me for going) ahead."</li>
           </ul>` },
        { heading: "Saying 'no' gently", html:
          `<p>A flat refusal feels harsh; Japanese softens or trails off:</p>
           <ul>
             <li>せっかくですが… — "thank you for the offer, but…"</li>
             <li>ちょっと… (trailing off) — a polite "no."</li>
             <li>また今度(お願いします) — "another time."</li>
           </ul>
           <div class="lesson-key"><b>すみません does triple duty</b> — sorry, excuse me, AND thanks. But escalate to 申し訳ございません for genuine apologies, and to decline, let a soft ちょっと… do the work rather than a blunt いいえ.</div>` },
      ],
      practice: [
        { label: "📖 N4 Daily Conversation", type: "study", sel: "n4phrdaily" },
        { label: "📖 N3 Formal Conversation", type: "study", sel: "n3phrformal" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },

    {
      id: "music-pop", stage: "Elementary · N4", title: "Music, Anime & Pop Culture",
      summary: "Anime, manga, music, and fan culture — and how to use them to learn.",
      sections: [
        { heading: "Anime & manga", html:
          `<table class="ex-table">
             <tr><td>アニメ / 漫画 まんが</td><td>anime / manga</td></tr>
             <tr><td>声優 せいゆう</td><td>voice actor</td></tr>
             <tr><td>原作 げんさく</td><td>the original (source) work</td></tr>
             <tr><td>キャラ(クター)</td><td>character</td></tr>
           </table>
           <p>Manga is read right-to-left, back-to-front — the "front" cover is where an English book's back would be.</p>` },
        { heading: "Music", html:
          `<table class="ex-table">
             <tr><td>J-POP / バンド</td><td>J-pop / a band</td></tr>
             <tr><td>ライブ / コンサート</td><td>a live show / concert</td></tr>
             <tr><td>歌詞 かし</td><td>lyrics</td></tr>
             <tr><td>アイドル / カラオケ</td><td>idol / karaoke</td></tr>
           </table>` },
        { heading: "Fan culture", html:
          `<table class="ex-table">
             <tr><td>オタク</td><td>a serious fan / geek</td></tr>
             <tr><td>推し おし</td><td>your favorite (member/character)</td></tr>
             <tr><td>グッズ / コスプレ</td><td>merch / cosplay</td></tr>
             <tr><td>聖地巡礼 せいちじゅんれい</td><td>visiting real-life anime locations</td></tr>
           </table>` },
        { heading: "Talking about what you like", html:
          `<ul>
             <li>〜にはまっている — "I'm hooked on ~."</li>
             <li>〜のファンです / 推しは〜です — "I'm a fan of ~ / my fave is ~."</li>
             <li>おすすめは(何)? — "what do you recommend?"</li>
           </ul>
           <div class="lesson-key"><b>Pop culture is a study superpower.</b> Anime, music, and games give you endless natural, in-context Japanese — and a genuine reason to keep showing up. Watch with Japanese subtitles and mine new words from what you love.</div>` },
      ],
      practice: [
        { label: "📖 Study N4 Vocabulary", type: "study", sel: "n4vocab" },
        { label: "📖 Study Katakana", type: "study", sel: "katakana" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "eating-out", stage: "Elementary · N4", title: "Eating Out & Izakaya Culture",
      summary: "Beyond ordering — the flow, etiquette, and vocabulary of dining out in Japan.",
      sections: [
        { heading: "Where to eat", html:
          `<table class="ex-table">
             <tr><td>居酒屋 いざかや</td><td>pub-style eatery (drinks + small plates)</td></tr>
             <tr><td>食堂 / ファミレス</td><td>cafeteria / family restaurant</td></tr>
             <tr><td>回転寿司</td><td>conveyor-belt sushi</td></tr>
             <tr><td>カフェ / 喫茶店</td><td>café / old-style coffee shop</td></tr>
           </table>` },
        { heading: "The izakaya flow", html:
          `<ul>
             <li><b>とりあえずビール</b> — "a beer to start," the classic opener.</li>
             <li><b>乾杯!</b> (kanpai) — "cheers!" — wait for it before drinking.</li>
             <li><b>お通し</b> — a small starter you didn't order (a seating charge, not a freebie).</li>
             <li>Dishes are shared — 取り分ける (portion out) onto small plates.</li>
           </ul>` },
        { heading: "Ordering & the bill", html:
          `<table class="ex-table">
             <tr><td>おすすめは?</td><td>what do you recommend?</td></tr>
             <tr><td>食べ放題 / 飲み放題</td><td>all-you-can-eat / -drink</td></tr>
             <tr><td>アレルギーがあります</td><td>I have an allergy</td></tr>
             <tr><td>別々で / 割り勘</td><td>separate bills / split evenly</td></tr>
           </table>` },
        { heading: "Manners", html:
          `<ul>
             <li>Say いただきます before eating, ごちそうさま after.</li>
             <li>It's polite to pour drinks <i>for others</i> (お酌), not yourself.</li>
             <li><b>No tipping</b> — it's not expected and can confuse. Call staff with すみません.</li>
           </ul>
           <div class="lesson-key"><b>Know the rhythm:</b> とりあえずビール → 乾杯 → expect an お通し → share the plates → settle up with 割り勘. Following the flow makes you feel like a regular, not a tourist.</div>` },
      ],
      practice: [
        { label: "📖 Study N4 Vocabulary", type: "study", sel: "n4vocab" },
        { label: "📖 N4 Daily Conversation", type: "study", sel: "n4phrdaily" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },

    {
      id: "transportation", stage: "Elementary · N4", title: "Transportation & Commuting",
      summary: "Riding Japan's trains like a local — types, IC cards, and commute survival.",
      sections: [
        { heading: "Trains & which one to take", html:
          `<p>Get on the wrong type and you'll sail past your stop. The key distinction is <i>which trains stop where</i>:</p>
           <table class="ex-table">
             <tr><td>各駅停車 / 普通</td><td>local — stops at every station</td></tr>
             <tr><td>快速 かいそく</td><td>rapid — skips some stops</td></tr>
             <tr><td>急行 きゅうこう</td><td>express</td></tr>
             <tr><td>特急 とっきゅう</td><td>limited express (often extra fee)</td></tr>
           </table>` },
        { heading: "Tickets, IC cards & gates", html:
          `<table class="ex-table">
             <tr><td>切符 きっぷ / 改札 かいさつ</td><td>ticket / ticket gate</td></tr>
             <tr><td>IC カード (Suica · Pasmo)</td><td>tap-to-ride card</td></tr>
             <tr><td>チャージ</td><td>to top up the card</td></tr>
             <tr><td>定期券 ていきけん</td><td>commuter pass</td></tr>
           </table>` },
        { heading: "Surviving the commute", html:
          `<table class="ex-table">
             <tr><td>満員電車</td><td>a packed (rush-hour) train</td></tr>
             <tr><td>ラッシュアワー</td><td>rush hour</td></tr>
             <tr><td>乗り換え / 遅延</td><td>transfer / delay</td></tr>
             <tr><td>終電 しゅうでん</td><td>the last train of the night</td></tr>
           </table>` },
        { heading: "Reading signs & announcements", html:
          `<ul>
             <li>〜行き (bound for ~), 〜番線 (platform ~).</li>
             <li>この電車は〜に止まりますか — "does this train stop at ~?"</li>
             <li>Announcements: まもなく〜に到着します ("arriving shortly at ~"), 次は〜 ("next is ~").</li>
           </ul>
           <div class="lesson-key"><b>Two things and you're set:</b> an IC card (just tap in and out), and knowing 各駅 vs 急行 vs 特急 so you board a train that actually stops where you're going. And mind the 終電 — miss it and you're walking.</div>` },
      ],
      practice: [
        { label: "📖 Study N4 Vocabulary", type: "study", sel: "n4vocab" },
        { label: "📖 Study N5 Nouns", type: "study", sel: "n5nouns" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "how-to", stage: "Elementary · N4", title: "Describing How-To & Processes",
      summary: "Sequencing words and the 〜方 pattern — how to explain any recipe, route, or procedure.",
      sections: [
        { heading: "Sequencing words", html:
          `<p>String the steps together with these signposts:</p>
           <table class="ex-table">
             <tr><td>まず</td><td>first (of all)</td></tr>
             <tr><td>次に / それから</td><td>next / then</td></tr>
             <tr><td>最後に</td><td>finally</td></tr>
             <tr><td>〜てから / 〜たら</td><td>after ~ing</td></tr>
           </table>` },
        { heading: "The 〜方 pattern: 'how to ~'", html:
          `<p>Take a verb's ます-stem and add <b>方 (かた)</b> to make "the way of ~ing":</p>
           <ul>
             <li>使う → 使い<b>方</b> (how to use), 作る → 作り<b>方</b> (how to make).</li>
             <li>読む → 読み<b>方</b> (how to read / reading), 行く → 行き<b>方</b> (how to get there).</li>
           </ul>
           <p>この漢字の読み方を教えてください — "please tell me how to read this kanji."</p>` },
        { heading: "Giving instructions", html:
          `<ul>
             <li>Soft commands: 〜てください ("please ~"), 〜ないでください ("please don't ~").</li>
             <li>Purpose: 〜ように ("so that ~"): こぼれないように、気をつけて.</li>
             <li>Written rules: 〜こと (必ず手を洗うこと = "be sure to wash your hands").</li>
           </ul>` },
        { heading: "Putting it together", html:
          `<p>A recipe, route, or procedure becomes easy to follow:</p>
           <p><b>まず</b>野菜を切って、<b>次に</b>フライパンで炒めて、<b>最後に</b>味をつけます。</p>
           <div class="lesson-key"><b>The toolkit:</b> まず → 次に → 最後に to order the steps, plus the 〜方 noun ("the way of ~ing") to name a method. With these you can explain any process clearly.</div>` },
      ],
      practice: [
        { label: "📖 All N4 Grammar", type: "study", sel: "n4gram" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },

    // ============================ Intermediate · N3 ============================
    {
      id: "n3-kanji", stage: "Intermediate · N3", title: "N3 Kanji",
      summary: "A big jump (~370) toward reading real-world Japanese.",
      sections: [
        { heading: "Reading takes off", html:
          `<p>N3 is the bridge to fluency — roughly 650 kanji total. With this range you can start reading news headlines, blog posts, instructions and signage with only occasional dictionary help. The jump is large, so steady daily review matters more than ever.</p>` },
        { heading: "Readings get slippery", html:
          `<p>At this level a single kanji may have several on'yomi used in different compounds, and you'll meet more exceptions and rare kun'yomi. Don't try to learn every reading abstractly — let the <b>words</b> teach you which reading applies where.</p>
           <table class="ex-table">
             <tr><td>生</td><td>せい / しょう / い・きる / う・まれる / なま</td><td>life/birth/raw — reading depends on the word</td></tr>
           </table>` },
        { heading: "Use radicals as scaffolding", html:
          `<p>With hundreds of characters in play, the <b>By Radical</b> view is your best friend — it lets you learn 20 related kanji as a family instead of 20 strangers. Phonetic components also start to hint at readings (e.g. characters containing 青 often read せい).</p>
           <div class="lesson-key"><b>Strategy:</b> prioritize kanji you actually keep meeting in your reading over a fixed list order. Frequency beats sequence.</div>` },
      ],
      practice: [
        { label: "📖 Study N3 Kanji", type: "study", sel: "n3" },
        { label: "🎮 Play the N3 Kanji game", type: "game", game: "n3" },
      ],
    },
    {
      id: "n3-vocab", stage: "Intermediate · N3", title: "N3 Vocabulary",
      summary: "Abstract and everyday-life vocabulary for fuller expression.",
      sections: [
        { heading: "Saying what you mean", html:
          `<p>N3 vocabulary adds nuance — feelings, opinions, and abstract ideas (経験 experience, 理由 reason, 関係 relationship). This is where you stop translating word-by-word and start thinking in chunks.</p>` },
        { heading: "Synonyms with shades", html:
          `<p>You'll meet clusters of near-synonyms that differ in tone or register. Learning the <i>difference</i> is the N3 skill:</p>
           <table class="ex-table">
             <tr><td>思う vs 考える</td><td>omou / kangaeru</td><td>to feel/think (gut) vs to think over (reason)</td></tr>
             <tr><td>だんだん vs どんどん</td><td>dandan / dondon</td><td>gradually vs rapidly/steadily</td></tr>
           </table>` },
        { heading: "Suru-verbs explode", html:
          `<p>Many N3 nouns become verbs just by adding する: 勉強する (study), 心配する (worry), 説明する (explain). Learn the noun and you get the verb for free — a huge multiplier.</p>` },
      ],
      practice: [
        { label: "📖 All N3 Vocabulary", type: "study", sel: "n3vocab" },
        { label: "📖 Nouns", type: "study", sel: "n3nouns" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },
    {
      id: "n3-grammar", stage: "Intermediate · N3", title: "Intermediate Grammar",
      summary: "Conditionals, passive & causative, giving/receiving, and keigo basics.",
      sections: [
        { heading: "Four ways to say “if”", html:
          `<p>Japanese splits "if/when" into four conditionals with different flavors — choosing the right one is a hallmark of intermediate skill:</p>
           <table class="ex-table">
             <tr><td>〜と</td><td>to</td><td>natural/automatic result: 押すと開く (push and it opens)</td></tr>
             <tr><td>〜ば</td><td>ba</td><td>general hypothetical: 安ければ買う</td></tr>
             <tr><td>〜たら</td><td>tara</td><td>most versatile "if/when": 着いたら電話して</td></tr>
             <tr><td>〜なら</td><td>nara</td><td>"if it's the case that…": 行くなら教えて</td></tr>
           </table>` },
        { heading: "Passive & causative", html:
          `<ul>
             <li><b>Passive</b> (〜られる) — "to be done to": 先生に褒められた = "I was praised by the teacher." Also used for the "suffering passive" (something happened to my detriment).</li>
             <li><b>Causative</b> (〜させる) — "to make/let do": 子供に野菜を食べさせる = "make the kids eat vegetables."</li>
             <li><b>Causative-passive</b> (〜させられる) — "to be made to do": 待たせられた = "I was forced to wait."</li>
           </ul>` },
        { heading: "Giving & receiving", html:
          `<p>The あげる / くれる / もらう trio encodes <i>direction</i> of a favor and is essential for natural speech: 友達が手伝ってくれた = "my friend helped me (did me the favor)." Getting the perspective right is very Japanese.</p>` },
        { heading: "First taste of keigo", html:
          `<p>You'll start meeting <b>keigo</b> — humble (謙譲語) and honorific (尊敬語) forms used in formal and business settings: いらっしゃる (honorific "to be/come/go"), いたします (humble "do"). At N3, <i>recognizing</i> them is the goal; fluent production comes later.</p>
           <div class="lesson-key"><b>Reality check:</b> intermediate grammar is wide. Meet each pattern, then cement it through lots of reading and listening — drilling alone won't make it stick.</div>` },
      ],
      practice: [
        { label: "📖 All N3 Grammar", type: "study", sel: "n3gram" },
        { label: "📖 Passive form", type: "study", sel: "n3verbpass" },
        { label: "📖 Causative form", type: "study", sel: "n3verbcaus" },
        { label: "📖 Honorifics (keigo)", type: "study", sel: "n3keigohonor" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },

    {
      id: "keigo-levels", stage: "Intermediate · N3", title: "Keigo: The Three Politeness Levels",
      summary: "Teineigo, sonkeigo, and kenjougo — how Japanese encodes respect into the verbs themselves.",
      sections: [
        { heading: "Three systems, three jobs", html:
          `<p>Japanese politeness (敬語 keigo) splits into three layers. The trick is knowing <i>whose</i> action you're describing:</p>
           <table class="ex-table">
             <tr><td><b>丁寧語</b> teineigo</td><td>polite</td><td>plain です/ます — neutral courtesy to anyone</td></tr>
             <tr><td><b>尊敬語</b> sonkeigo</td><td>respectful</td><td>raises the <i>other</i> person's actions up</td></tr>
             <tr><td><b>謙譲語</b> kenjougo</td><td>humble</td><td>lowers <i>your own</i> actions down</td></tr>
           </table>
           <p>Use sonkeigo for what the customer/boss does, kenjougo for what <i>you</i> do for them. Both raise the other person relative to you.</p>` },
        { heading: "The special verb swaps", html:
          `<p>The most common verbs become entirely different words. These are worth memorizing as a set:</p>
           <table class="ex-table">
             <tr><th>plain</th><th>尊敬 (their action)</th><th>謙譲 (my action)</th></tr>
             <tr><td>する</td><td>なさる</td><td>いたす</td></tr>
             <tr><td>行く・来る・いる</td><td>いらっしゃる</td><td>参る・おる</td></tr>
             <tr><td>言う</td><td>おっしゃる</td><td>申す・申し上げる</td></tr>
             <tr><td>食べる・飲む</td><td>召し上がる</td><td>いただく</td></tr>
             <tr><td>見る</td><td>ご覧になる</td><td>拝見する</td></tr>
             <tr><td>知っている</td><td>ご存じだ</td><td>存じております</td></tr>
           </table>` },
        { heading: "The productive patterns", html:
          `<p>For verbs without a special form, two templates do the work:</p>
           <ul>
             <li><b>Respectful:</b> お / ご + verb-stem + になる. 社長が<b>お帰りになる</b> ("the president goes home").</li>
             <li><b>Humble:</b> お / ご + verb-stem + する / いたす. 私が<b>ご案内いたします</b> ("I'll show you the way").</li>
           </ul>
           <p>You'll also see the lighter respectful 〜（ら）れる (社長が話<b>される</b>), which is one notch less formal than お〜になる.</p>` },
        { heading: "In-group vs out-group", html:
          `<p>Keigo tracks <b>social groups</b>, not just individuals. When talking to an outsider about your <i>own</i> boss, you use <b>humble</b> forms for your boss — because your whole company is your in-group, lowered relative to the customer.</p>
           <div class="lesson-key"><b>At N3, aim to recognize and respond.</b> Hearing いらっしゃいますか and answering はい、おります is a realistic goal. Smooth production comes with exposure — keigo is learned by using it, not memorizing charts.</div>` },
      ],
      practice: [
        { label: "📖 N3 Basic Honorifics", type: "study", sel: "n3keigohonor" },
        { label: "📖 Sonkeigo (respectful)", type: "study", sel: "n2keigosonkeigo" },
        { label: "📖 Kenjougo (humble)", type: "study", sel: "n2keigokenjougo" },
      ],
    },
    {
      id: "passive-causative", stage: "Intermediate · N3", title: "Passive, Causative & Causative-Passive in Depth",
      summary: "Being done to, making/letting do, and being made to do — including the famous \"suffering passive\".",
      sections: [
        { heading: "Passive (受身): \"be done to\"", html:
          `<p>Form it by taking the あ-row stem + れる (Group 1) or stem + られる (Group 2); する → される, 来る → 来られる. The doer is marked with <b>に</b>:</p>
           <p>先生<u>に</u>褒め<b>られた</b> — "I was praised by the teacher."</p>
           <p>Note that Group 2 passive looks identical to its potential form (食べられる) — context tells them apart.</p>` },
        { heading: "The \"suffering passive\"", html:
          `<p>Japanese has a passive English lacks: one that says something happened <b>to your detriment</b>, even with no clear object:</p>
           <ul>
             <li>雨<u>に</u>降られた — "I got rained on" (and it was a nuisance).</li>
             <li>財布を盗まれた — "I had my wallet stolen."</li>
             <li>子供に泣かれて困った — "the kid cried on me and it was a problem."</li>
           </ul>
           <p>If a sentence feels like "this annoying thing happened to me," it's probably a suffering passive.</p>` },
        { heading: "Causative (使役): make or let", html:
          `<p>The causative (あ-row + せる / stem + させる; する → させる) covers both <b>making</b> and <b>letting</b> — tone and context decide which:</p>
           <ul>
             <li>子供<u>に</u>野菜を食べ<b>させる</b> — "make the kids eat vegetables."</li>
             <li>休ま<b>せて</b>あげる — "let (them) rest" (with a giving verb, it leans toward "let").</li>
           </ul>
           <p>The person made/let to act takes <b>に</b> (or を when there's no other object).</p>` },
        { heading: "Causative-passive: \"be made to\"", html:
          `<p>Stack them — causative + passive — to say you were <i>forced</i> to do something:</p>
           <p>先輩にお酒を飲ま<b>せられた</b> — "I was made to drink by my senior." For Group 1 verbs this often contracts to 〜される (飲ま<b>される</b>).</p>
           <p>And the very useful 〜させてください = "please <b>let me</b> ~": 説明させてください ("allow me to explain").</p>
           <div class="lesson-key"><b>Build it in steps:</b> nail the plain causative and plain passive separately first — the causative-passive is just the two combined.</div>` },
      ],
      practice: [
        { label: "📖 Passive form", type: "study", sel: "n3verbpass" },
        { label: "📖 Causative form", type: "study", sel: "n3verbcaus" },
        { label: "📖 Causative-passive", type: "study", sel: "n3verbcauspass" },
      ],
    },
    {
      id: "nominalization", stage: "Intermediate · N3", title: "Nominalization & Noun-Modifying Clauses",
      summary: "Turning verbs into nouns (こと/の), and describing a noun with a whole sentence.",
      sections: [
        { heading: "Making a verb into a noun: こと & の", html:
          `<p>To use a verb or whole phrase as a noun (a subject or object), wrap it with <b>こと</b> or <b>の</b>:</p>
           <ul>
             <li>泳ぐ<b>の</b>が好きだ — "I like swimming."</li>
             <li>日本語を話す<b>こと</b>ができる — "I can speak Japanese."</li>
           </ul>
           <p>Rough guide: use <b>の</b> with verbs of perception and when the action is concrete/simultaneous (子供が遊ぶのを見る = "watch the kids play"); use <b>こと</b> for abstract facts and before だ/です (私の趣味は読書をすることだ).</p>` },
        { heading: "Describing a noun with a clause", html:
          `<p>This is the big one. Japanese has <b>no relative pronouns</b> ("who/which/that"). Instead a whole clause, ending in <b>plain form</b>, simply sits <i>in front of</i> the noun it describes:</p>
           <table class="ex-table">
             <tr><td>私が読んだ<b>本</b></td><td>the book (that) I read</td></tr>
             <tr><td>昨日買った<b>シャツ</b></td><td>the shirt I bought yesterday</td></tr>
             <tr><td>京都に住んでいる<b>友達</b></td><td>a friend who lives in Kyoto</td></tr>
           </table>
           <p>English builds these backwards ("the book that I read"); Japanese front-loads the whole description before the noun. Reading them fluently is a core intermediate skill.</p>` },
        { heading: "が becomes の inside the clause", html:
          `<p>Within a noun-modifying clause, the subject's <b>が</b> can switch to <b>の</b> with no change in meaning:</p>
           <ul>
             <li>背<u>が</u>高い人 = 背<u>の</u>高い人 — "a tall person."</li>
             <li>母<u>が</u>作った料理 = 母<u>の</u>作った料理 — "the food my mother made."</li>
           </ul>
           <div class="lesson-key"><b>Reading tip:</b> when you hit a string of words before a noun, treat it as one big adjective describing that noun — find the noun first, then unpack the clause in front of it.</div>` },
      ],
      practice: [
        { label: "📖 All N3 Grammar", type: "study", sel: "n3gram" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },
    {
      id: "onomatopoeia", stage: "Intermediate · N3", title: "Onomatopoeia: 擬音語 & 擬態語",
      summary: "The sound-and-state words that fill everyday Japanese, manga, and conversation.",
      sections: [
        { heading: "A core feature, not slang", html:
          `<p>Japanese is packed with mimetic words — far more than English — and they're used by everyone, everywhere. They split into two kinds:</p>
           <ul>
             <li><b>擬音語</b> (giongo) — actual <i>sounds</i>: ワンワン (woof), ザーザー (pouring rain), ドンドン (banging).</li>
             <li><b>擬態語</b> (gitaigo) — <i>states, textures, feelings</i> that make no sound: キラキラ (sparkling), ぺこぺこ (starving), ドキドキ (heart pounding).</li>
           </ul>
           <p>They're often doubled (キラキラ, ぺこぺこ) and add vividness no plain verb can.</p>` },
        { heading: "A starter set", html:
          `<table class="ex-table">
             <tr><td>ニコニコ</td><td>smiling warmly</td></tr>
             <tr><td>わくわく</td><td>excited, looking forward</td></tr>
             <tr><td>ドキドキ</td><td>heart pounding (nerves/thrill)</td></tr>
             <tr><td>ぺこぺこ</td><td>very hungry</td></tr>
             <tr><td>くたくた / へとへと</td><td>worn out, exhausted</td></tr>
             <tr><td>ぺらぺら</td><td>fluent (speaking)</td></tr>
             <tr><td>つるつる</td><td>smooth / slippery (also slurping noodles)</td></tr>
             <tr><td>びっくり</td><td>startled, surprised</td></tr>
           </table>` },
        { heading: "How to use them", html:
          `<p>Most attach to a sentence in one of three ways:</p>
           <ul>
             <li><b>+ する</b>: ドキドキ<b>する</b> ("my heart races"), わくわく<b>する</b>.</li>
             <li><b>+ だ</b>: お腹が ぺこぺこ<b>だ</b> ("I'm starving").</li>
             <li><b>as an adverb (often + と)</b>: 星が キラキラ<b>と</b>光る ("the stars sparkle").</li>
           </ul>
           <div class="lesson-key"><b>Why bother:</b> these are everywhere in real Japanese — conversation, manga, ads, kids' books. Learning even ten makes casual speech and reading dramatically easier to follow.</div>` },
      ],
      practice: [
        { label: "📖 Study N3 Vocabulary", type: "study", sel: "n3vocab" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },

    {
      id: "conjunctions", stage: "Intermediate · N3", title: "Connecting Sentences: Conjunctions & Flow",
      summary: "The connecting words that link your sentences into smooth, natural paragraphs.",
      sections: [
        { heading: "Sequence & addition", html:
          `<p>These carry your listener from one point to the next:</p>
           <table class="ex-table">
             <tr><td>そして</td><td>and (then) — links two facts/events</td></tr>
             <tr><td>それから</td><td>after that / and then (sequence)</td></tr>
             <tr><td>また</td><td>also / furthermore (adds a point)</td></tr>
             <tr><td>さらに</td><td>moreover / on top of that</td></tr>
           </table>` },
        { heading: "Contrast", html:
          `<table class="ex-table">
             <tr><td>でも</td><td>but (casual, sentence-start)</td></tr>
             <tr><td>しかし</td><td>however (formal/written)</td></tr>
             <tr><td>けれど(も)</td><td>but / though (mid-formality)</td></tr>
             <tr><td>ところが</td><td>but unexpectedly / and yet</td></tr>
             <tr><td>一方（で）</td><td>on the other hand</td></tr>
           </table>
           <p>でも opens a casual reply; しかし and 一方 belong to essays and reports. Matching the connector to the register keeps writing from sounding lopsided.</p>` },
        { heading: "Cause & result", html:
          `<table class="ex-table">
             <tr><td>だから</td><td>so / therefore (casual)</td></tr>
             <tr><td>それで</td><td>and so / that's why (links to what follows)</td></tr>
             <tr><td>そのため</td><td>for that reason (formal)</td></tr>
             <tr><td>なぜなら〜から</td><td>this is because ~</td></tr>
           </table>
           <p>Note the difference from clause-internal から/ので, which join <i>within</i> one sentence — these stand at the <b>start</b> of a new sentence, pointing back at the last one.</p>` },
        { heading: "Topic shift & summary", html:
          `<ul>
             <li><b>ところで</b> — "by the way" (changes the subject).</li>
             <li><b>つまり</b> — "in other words" (restates).</li>
             <li><b>要するに</b> — "in short" (sums up).</li>
             <li><b>ちなみに</b> — "incidentally / for reference" (adds an aside).</li>
           </ul>
           <div class="lesson-key"><b>Watch the register.</b> Casual speech leans on じゃあ, だって, でも; formal writing uses したがって, しかし, さらに. A handful of well-placed connectors is what turns choppy sentences into flowing paragraphs.</div>` },
      ],
      practice: [
        { label: "📖 N3 Connecting Ideas", type: "study", sel: "n3phrconnect" },
        { label: "📖 All N3 Grammar", type: "study", sel: "n3gram" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },

    {
      id: "reading-strategy", stage: "Intermediate · N3", title: "Reading & Listening Strategy",
      summary: "How to parse long sentences, skim for meaning, and catch fast speech.",
      sections: [
        { heading: "The verb lands at the end", html:
          `<p>Japanese is <b>subject–object–verb</b>: the main verb — along with its tense and any negation — arrives <i>last</i>. A sentence isn't resolved until you reach the end:</p>
           <p>私は昨日 友達と 映画を 見<b>なかった</b>。 — you don't learn it's negative ("didn't watch") until the final word.</p>
           <p>Train yourself to <b>hold</b> the sentence and let it complete, rather than guessing the meaning early as you would in English.</p>` },
        { heading: "Find the spine, then the modifiers", html:
          `<p>Long sentences bury the core under stacked modifiers — especially noun-modifying clauses that pile up <i>before</i> a noun. Your job is to locate the backbone first:</p>
           <ul>
             <li>Spot the main verb at the end, and the topic (〜は) near the front.</li>
             <li>Treat each chunk before a noun as one big adjective describing it (the relative-clause skill).</li>
             <li>Then unpack the modifiers once you know what they attach to.</li>
           </ul>` },
        { heading: "Don't stop at every unknown word", html:
          `<p>The biggest reading-speed killer is dictionary-hopping. Read for the <b>gist</b> instead:</p>
           <ul>
             <li>Guess unknown words from their kanji and the context.</li>
             <li>Only look up a word if it genuinely blocks the meaning of the passage.</li>
             <li>Re-read smoothly afterward — volume and flow build speed far faster than perfect coverage.</li>
           </ul>` },
        { heading: "Listening: catch the frame", html:
          `<p>You can't catch every syllable at native speed, so listen for <b>structure</b>:</p>
           <ul>
             <li>Particles and sentence-enders (は/が/を/ね/よ/から) carry the skeleton — lock onto those.</li>
             <li>Expect contracted and devoiced sounds (です→"des", 〜ている→〜てる) — the pronunciation and casual-speech lessons prepared you for these.</li>
             <li><b>Shadow</b> native audio — repeating in real time tunes your ear better than passive listening.</li>
           </ul>
           <div class="lesson-key"><b>The real exam is comprehension.</b> From N3 up, progress is about reading speed and inference, not memorizing more isolated words. Build the habit of reading and listening to whole passages, slightly above your comfort level, every day.</div>` },
      ],
      practice: [
        { label: "📖 All N3 Grammar", type: "study", sel: "n3gram" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },

    {
      id: "dialects", stage: "Intermediate · N3", title: "Japanese Dialects (方言)",
      summary: "Standard vs regional speech — and the Kansai markers you'll meet constantly.",
      sections: [
        { heading: "Standard vs regional", html:
          `<p>What you're learning is <b>標準語</b> (hyōjungo) — the Tokyo-based standard understood everywhere, used in news, school, and formal settings. But everyday local speech is <b>方言</b> (hōgen, dialect), and it can sound surprisingly different.</p>
           <p>You only need to <i>produce</i> standard Japanese — but <i>recognizing</i> dialect keeps you from getting lost in real conversation, comedy, and drama.</p>` },
        { heading: "関西弁 (Kansai-ben)", html:
          `<p>The dialect of Osaka–Kyoto–Kobe is the one you'll meet most — it dominates comedy and shows up everywhere. Key markers:</p>
           <table class="ex-table">
             <tr><td>copula や</td><td>= だ</td><td>そうや (= そうだ)</td></tr>
             <tr><td>〜へん</td><td>= 〜ない</td><td>分からへん (= 分からない)</td></tr>
             <tr><td>あかん</td><td>= だめ</td><td>"no good / can't"</td></tr>
             <tr><td>ええ</td><td>= いい</td><td>"good"</td></tr>
             <tr><td>ほんま</td><td>= 本当</td><td>"really"</td></tr>
             <tr><td>おおきに</td><td>= ありがとう</td><td>"thanks"</td></tr>
           </table>
           <p>めっちゃ ("super") started as Kansai slang and is now nationwide — dialects feed the standard over time.</p>` },
        { heading: "Other regions", html:
          `<p>Every region has its own flavor, in vocabulary and intonation:</p>
           <ul>
             <li><b>博多弁</b> (Fukuoka): sentence-enders 〜と / 〜ばい / 〜けん.</li>
             <li><b>東北弁</b> (northeast): softer consonants, distinctive intonation.</li>
             <li><b>沖縄</b>: the Ryukyuan languages are so different they're arguably separate, though modern Okinawan speech blends with Japanese.</li>
           </ul>
           <p>Pitch and intonation also shift region to region — Kansai's pitch patterns famously differ from Tokyo's.</p>` },
        { heading: "What to do about it", html:
          `<div class="lesson-key"><b>Speak standard, recognize Kansai.</b> You don't need to use dialect — but learning the handful of 関西弁 markers (や, へん, あかん, ほんま) means a Kansai speaker, a comedy duo, or a drama character won't throw you.</div>` },
      ],
      practice: [
        { label: "📖 Study N3 Vocabulary", type: "study", sel: "n3vocab" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },

    {
      id: "nature", stage: "Intermediate · N3", title: "Nature, the Environment & the Outdoors",
      summary: "Landscape and animal vocabulary — plus the environmental words all over N3+ reading.",
      sections: [
        { heading: "Landscape & nature", html:
          `<table class="ex-table">
             <tr><td>山 やま / 川 かわ</td><td>mountain / river</td></tr>
             <tr><td>海 うみ / 湖 みずうみ</td><td>sea / lake</td></tr>
             <tr><td>森 もり / 林 はやし</td><td>forest / woods</td></tr>
             <tr><td>空 そら / 星 ほし / 月 つき</td><td>sky / star / moon</td></tr>
             <tr><td>自然 しぜん</td><td>nature</td></tr>
           </table>` },
        { heading: "Animals & plants", html:
          `<ul>
             <li>動物 (animals): 犬, 猫, 鳥 (bird), 魚 (fish), 虫 (insect), 馬 (horse).</li>
             <li>植物 (plants): 木 (tree), 花 (flower), 草 (grass), 葉 (leaf).</li>
           </ul>` },
        { heading: "Weather & natural disasters", html:
          `<p>Japan's geography makes this vocabulary essential — and common in the news:</p>
           <table class="ex-table">
             <tr><td>台風 たいふう</td><td>typhoon</td></tr>
             <tr><td>地震 じしん / 津波 つなみ</td><td>earthquake / tsunami</td></tr>
             <tr><td>洪水 こうずい / 災害 さいがい</td><td>flood / disaster</td></tr>
           </table>
           <p>Risk is often phrased with 〜の恐れがある: 大雨の恐れがあります ("there's a risk of heavy rain").</p>` },
        { heading: "Environmental issues", html:
          `<p>This set shows up constantly in N3+ reading, essays, and news — front-loading it pays off:</p>
           <table class="ex-table">
             <tr><td>環境 かんきょう</td><td>environment</td></tr>
             <tr><td>地球温暖化 ちきゅうおんだんか</td><td>global warming</td></tr>
             <tr><td>汚染 おせん</td><td>pollution</td></tr>
             <tr><td>リサイクル / ゴミ</td><td>recycling / trash</td></tr>
             <tr><td>自然を守る</td><td>to protect nature</td></tr>
           </table>
           <div class="lesson-key"><b>Read-ahead vocabulary:</b> 環境, 温暖化, 汚染 and friends are everywhere in intermediate reading passages. Knowing them before you hit those texts removes a major comprehension roadblock.</div>` },
      ],
      practice: [
        { label: "📖 Study N3 Vocabulary", type: "study", sel: "n3vocab" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },

    {
      id: "particle-combos", stage: "Intermediate · N3", title: "Particle Combinations & Nuance",
      summary: "Stacking particles (には/では/とは), and how は and も add topic, contrast, and 'even'.",
      sections: [
        { heading: "Particles stack", html:
          `<p>A case particle (に/で/へ/と/から/まで) can be followed by <b>は</b> or <b>も</b> to add a layer of meaning. Read the combo as "role + topic/contrast/also":</p>
           <table class="ex-table">
             <tr><td>には</td><td>に (to/at) + は (topic/contrast)</td></tr>
             <tr><td>では</td><td>で (at/by) + は (topic/contrast)</td></tr>
             <tr><td>とは / からは / までは</td><td>case particle + は</td></tr>
             <tr><td>にも / とも / からも</td><td>case particle + も ("also")</td></tr>
           </table>` },
        { heading: "には / では in action", html:
          `<ul>
             <li>日本に<b>は</b>四季がある — "in Japan (as for here), there are four seasons." (に marks location, は makes it the topic)</li>
             <li>ここで<b>は</b>タバコは吸えません — "here (in contrast), you can't smoke."</li>
             <li>私に<b>は</b>難しい — "for me (at least), it's hard."</li>
           </ul>` },
        { heading: "Contrastive は replacing が / を", html:
          `<p><b>は</b> can take the place of が or を to inject contrast or topic — implying "this one, (unlike others)":</p>
           <ul>
             <li>寿司<b>は</b>食べる — "I do eat sushi (but maybe not other things)."</li>
             <li>ビール<b>は</b>飲まない — "beer I don't drink (other drinks, maybe)."</li>
           </ul>
           <p>That unspoken contrast is exactly the nuance native speakers hear.</p>` },
        { heading: "も and 〜とも", html:
          `<ul>
             <li>私<b>も</b> ("me too"); 日本に<b>も</b>ある ("there's some in Japan too").</li>
             <li>二人<b>とも</b> = "both (of the two)"; 三つ<b>とも</b> = "all three."</li>
           </ul>
           <div class="lesson-key"><b>Decompose, don't memorize.</b> Every stacked particle is just "case particle (the grammatical role) + は/も (topic, contrast, or 'also')." Split it in two and the meaning falls right out.</div>` },
      ],
      practice: [
        { label: "📖 All N3 Grammar", type: "study", sel: "n3gram" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },
    {
      id: "relationships", stage: "Intermediate · N3", title: "Relationships & Social Life",
      summary: "The people in your life, the verbs that connect them, and how to make plans.",
      sections: [
        { heading: "People in your life", html:
          `<table class="ex-table">
             <tr><td>友達 / 親友</td><td>friend / best friend</td></tr>
             <tr><td>知り合い しりあい</td><td>acquaintance</td></tr>
             <tr><td>恋人 こいびと</td><td>romantic partner</td></tr>
             <tr><td>彼 / 彼女</td><td>boyfriend / girlfriend (also he/she)</td></tr>
             <tr><td>同僚 どうりょう / 近所の人</td><td>colleague / neighbor</td></tr>
           </table>` },
        { heading: "Relationship verbs", html:
          `<table class="ex-table">
             <tr><td>付き合う つきあう</td><td>to date / to keep company with</td></tr>
             <tr><td>出会う であう</td><td>to meet, encounter</td></tr>
             <tr><td>別れる わかれる</td><td>to break up / part</td></tr>
             <tr><td>結婚 / 離婚する</td><td>to marry / divorce</td></tr>
             <tr><td>喧嘩する けんか</td><td>to quarrel</td></tr>
             <tr><td>仲がいい / 悪い</td><td>to get along well / badly</td></tr>
           </table>` },
        { heading: "Making plans", html:
          `<ul>
             <li>誘う さそう — to invite (someone out).</li>
             <li>約束 やくそく — a promise / plan.</li>
             <li>飲み会 のみかい — a drinking party (a big part of social and work life).</li>
             <li>紹介する しょうかいする — to introduce (one person to another).</li>
           </ul>
           <div class="lesson-key"><b>One verb, two meanings:</b> 付き合う means both "to date" and "to keep someone company" — context decides. Pair 誘う and 約束 to run your whole social calendar.</div>` },
      ],
      practice: [
        { label: "📖 Study N3 Vocabulary", type: "study", sel: "n3vocab" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },
    {
      id: "health", stage: "Intermediate · N3", title: "Health, Body & Well-being",
      summary: "Talking about health, lifestyle, and getting sick or better — beyond the clinic.",
      sections: [
        { heading: "Health & lifestyle", html:
          `<table class="ex-table">
             <tr><td>健康 けんこう</td><td>health</td></tr>
             <tr><td>体にいい / 悪い</td><td>good / bad for the body</td></tr>
             <tr><td>運動する うんどう</td><td>to exercise</td></tr>
             <tr><td>食生活 / 睡眠</td><td>diet / sleep</td></tr>
             <tr><td>ストレス</td><td>stress</td></tr>
           </table>` },
        { heading: "Getting sick & getting better", html:
          `<table class="ex-table">
             <tr><td>病気 / 症状</td><td>illness / symptom</td></tr>
             <tr><td>風邪をひく</td><td>to catch a cold</td></tr>
             <tr><td>熱が出る / 下がる</td><td>a fever comes / breaks</td></tr>
             <tr><td>治る なおる / 治す なおす</td><td>to recover / to cure</td></tr>
             <tr><td>予防 よぼう</td><td>prevention</td></tr>
           </table>` },
        { heading: "Body & condition", html:
          `<ul>
             <li>太る / 痩せる — to gain / lose weight.</li>
             <li>疲れる (get tired), 元気 (well, energetic).</li>
             <li>調子がいい / 悪い — to be in good / bad condition (body or things).</li>
             <li>怪我 けが (injury), 入院 / 退院 (hospitalization / discharge).</li>
           </ul>` },
        { heading: "Caring phrases", html:
          `<div class="lesson-key"><b>Warm, natural everyday phrases:</b> 調子はどう? ("how are you feeling?") and 体に気をつけて(ください) ("take care of yourself"). They show care and come up constantly — well worth having ready.</div>` },
      ],
      practice: [
        { label: "📖 Study N3 Vocabulary", type: "study", sel: "n3vocab" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },

    {
      id: "certainty", stage: "Intermediate · N3", title: "Expressing Certainty & Probability",
      summary: "The whole scale from \"definitely\" to \"maybe\" — and how to pick the right one.",
      sections: [
        { heading: "The confidence scale", html:
          `<p>Japanese marks <i>how sure</i> you are with a different ending for each level of confidence:</p>
           <table class="ex-table">
             <tr><td>絶対 / 必ず</td><td>definitely / without fail</td></tr>
             <tr><td>〜に違いない / に決まっている</td><td>must be / surely (strong inference)</td></tr>
             <tr><td>〜はずだ</td><td>should be (logical expectation)</td></tr>
             <tr><td>〜だろう / でしょう</td><td>probably</td></tr>
             <tr><td>〜かもしれない</td><td>might / maybe</td></tr>
             <tr><td>〜かどうか分からない</td><td>not sure whether</td></tr>
           </table>` },
        { heading: "はず vs だろう vs かもしれない", html:
          `<ul>
             <li><b>はず</b> — you have a <i>reason</i> to expect it: 彼は来るはずだ (he said he would).</li>
             <li><b>だろう／でしょう</b> — a general guess: 明日は晴れるだろう.</li>
             <li><b>かもしれない</b> — genuine uncertainty, maybe 50/50: 雨が降るかもしれない.</li>
           </ul>` },
        { heading: "Judging from evidence", html:
          `<p>When you're inferring from what you see or hear, switch to the "seems" family (covered in the nuance lesson):</p>
           <ul>
             <li>〜そうだ — from appearance: 落ちそうだ.</li>
             <li>〜ようだ / みたいだ — reasoned inference: 留守のようだ.</li>
             <li>〜らしい — from information / hearsay: 中止らしい.</li>
           </ul>` },
        { heading: "Softening your claims", html:
          `<p>Even when fairly sure, Japanese tends to <i>hedge</i> — flat assertions can sound blunt:</p>
           <ul>
             <li>〜と思う — "I think": いいと思う.</li>
             <li>〜気がする — "I get the feeling": うまくいく気がする.</li>
             <li>〜んじゃない(?) — "isn't it…?": 高いんじゃない?</li>
           </ul>
           <div class="lesson-key"><b>Match the modal to your actual confidence.</b> Saying はず when you mean かもしれない (or vice-versa) is a subtle but real error — and overusing 絶対 sounds pushy. Calibrating certainty <i>is</i> the N3 skill here.</div>` },
      ],
      practice: [
        { label: "📖 All N3 Grammar", type: "study", sel: "n3gram" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },
    {
      id: "news", stage: "Intermediate · N3", title: "The News & Current Events",
      summary: "The 漢語 topic vocabulary that unlocks newspapers, TV news, and N3+ reading.",
      sections: [
        { heading: "The big topics", html:
          `<table class="ex-table">
             <tr><td>政治 せいじ / 経済 けいざい</td><td>politics / economy</td></tr>
             <tr><td>社会 しゃかい / 国際 こくさい</td><td>society / international</td></tr>
             <tr><td>事件 じけん / 事故 じこ</td><td>incident / accident</td></tr>
             <tr><td>災害 さいがい / 環境 かんきょう</td><td>disaster / environment</td></tr>
           </table>` },
        { heading: "Politics & society", html:
          `<table class="ex-table">
             <tr><td>選挙 せんきょ / 政府 せいふ</td><td>election / government</td></tr>
             <tr><td>首相 しゅしょう / 大統領</td><td>prime minister / president</td></tr>
             <tr><td>法律 ほうりつ / 問題 もんだい</td><td>law / issue</td></tr>
             <tr><td>少子高齢化</td><td>declining birthrate &amp; aging society</td></tr>
           </table>` },
        { heading: "Economy", html:
          `<table class="ex-table">
             <tr><td>景気 けいき</td><td>economic conditions</td></tr>
             <tr><td>物価 ぶっか / 株 かぶ</td><td>prices / stocks</td></tr>
             <tr><td>円高 / 円安</td><td>strong yen / weak yen</td></tr>
             <tr><td>失業 しつぎょう / 税金</td><td>unemployment / tax</td></tr>
           </table>` },
        { heading: "Following the news", html:
          `<p>News is written in <b>である調</b> with heavy reporting grammar (from the reading-genres lesson):</p>
           <ul>
             <li>〜によると … (according to ~), 〜と発表した (announced that ~).</li>
             <li>Neutral passives: 〜とされる, 〜と見られる, 〜が決定された.</li>
           </ul>
           <div class="lesson-key"><b>It's mostly vocabulary.</b> Once these few dozen 漢語 topic words are familiar, the grammar of news is predictable — and NHK News Web Easy becomes readable. This is the single highest-leverage vocab set for intermediate reading.</div>` },
      ],
      practice: [
        { label: "📖 Study N3 Vocabulary", type: "study", sel: "n3vocab" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },

    {
      id: "cause-reason", stage: "Intermediate · N3", title: "Cause, Reason & Result",
      summary: "から, ので, ため, おかげで, せいで — the ways to say 'because', and their nuances.",
      sections: [
        { heading: "から vs ので", html:
          `<p>Both mean "because", but the feel differs:</p>
           <ul>
             <li><b>から</b> — emphasizes <i>your</i> reasoning; the natural choice before a command, request, or opinion: 危ない<b>から</b>、気をつけて.</li>
             <li><b>ので</b> — softer and more objective; preferred when being polite or stating a plain fact: 道が混んでいた<b>ので</b>、遅れました.</li>
           </ul>
           <p>In polite/business situations, ので sounds more considerate than a blunt から.</p>` },
        { heading: "ため(に): cause or purpose", html:
          `<p>The same 〜ために does two different jobs — context decides which:</p>
           <ul>
             <li><b>Cause</b>: 事故の<b>ために</b>電車が遅れた ("the train was late <i>because of</i> an accident").</li>
             <li><b>Purpose</b>: 合格する<b>ために</b>勉強する ("I study <i>in order to</i> pass").</li>
           </ul>
           <p>A volitional action after it → purpose; a result you didn't control → cause.</p>` },
        { heading: "おかげで vs せいで", html:
          `<p>These add a <i>judgment</i> about the outcome:</p>
           <table class="ex-table">
             <tr><td>〜おかげで</td><td>thanks to ~ (good result)</td><td>先生のおかげで合格した</td></tr>
             <tr><td>〜せいで</td><td>because of ~ (bad result / blame)</td><td>雨のせいで中止になった</td></tr>
           </table>` },
        { heading: "More reason patterns", html:
          `<ul>
             <li><b>〜ことから</b> — "from the fact that": 煙が出ていることから火事に気づいた.</li>
             <li><b>〜ものだから</b> — "(it's just that) because…" (often an excuse): 道が混んでいたものだから….</li>
             <li><b>〜だけに</b> — "precisely because / being ~": プロだけに上手だ.</li>
           </ul>
           <div class="lesson-key"><b>Quick guide:</b> から／ので = everyday "because" (ので politer) · おかげで／せいで stamp it good or bad · ため(に) swings between cause and purpose depending on what follows.</div>` },
      ],
      practice: [
        { label: "📖 All N3 Grammar", type: "study", sel: "n3gram" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },

    {
      id: "opinions", stage: "Intermediate · N3", title: "Expressing & Discussing Opinions",
      summary: "Stating a view, agreeing, and disagreeing politely — Japanese-style.",
      sections: [
        { heading: "Stating your view", html:
          `<ul>
             <li>〜と思います / 〜と考えます — "I think / I believe."</li>
             <li>私の意見では… — "in my opinion…"</li>
             <li>〜のではないでしょうか — "isn't it perhaps that ~?" (a soft, modest claim).</li>
             <li>〜べきだと思います — "I think we should ~."</li>
           </ul>` },
        { heading: "Agreeing", html:
          `<table class="ex-table">
             <tr><td>確かに</td><td>indeed / certainly</td></tr>
             <tr><td>その通りです</td><td>exactly so</td></tr>
             <tr><td>私もそう思います</td><td>I think so too</td></tr>
             <tr><td>賛成です / 同感です</td><td>I agree / I feel the same</td></tr>
           </table>` },
        { heading: "Disagreeing — gently", html:
          `<p>Direct contradiction feels harsh, so Japanese cushions it. The classic move: <b>agree first, then "but."</b></p>
           <ul>
             <li><b>確かに</b>〜<b>が</b>、… — "certainly ~, but…"</li>
             <li>それはそうですが… — "that may be so, but…"</li>
             <li>ちょっと違うかもしれません — "it might be a little different" (very soft "you're wrong").</li>
             <li>〜とは限りません — "that's not necessarily the case."</li>
           </ul>` },
        { heading: "Structuring a point", html:
          `<p>Lay out an argument so it's easy to follow:</p>
           <ul>
             <li>まず… / 次に… — "first… / next…"</li>
             <li>理由は〜からです — "the reason is ~."</li>
             <li>例えば… — "for example…"</li>
             <li>だから / したがって — "so / therefore."</li>
           </ul>
           <div class="lesson-key"><b>Disagree like a native:</b> open with 確かに〜 (acknowledging their point), then pivot with が/けど, and hedge with かもしれません. A blunt 違います lands much harder than English "I disagree."</div>` },
      ],
      practice: [
        { label: "📖 N3 Expressing Feelings", type: "study", sel: "n3phrfeelings" },
        { label: "📖 All N3 Grammar", type: "study", sel: "n3gram" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },

    {
      id: "hypotheticals", stage: "Intermediate · N3", title: "Hypotheticals, Wishes & Regrets",
      summary: "\"If only…\", \"I hope…\", and \"I should have…\" — the counterfactual side of conditionals.",
      sections: [
        { heading: "Counterfactual: 〜ば／たら〜のに", html:
          `<p>Add <b>のに</b> to a conditional and it becomes "if ~, then ~ — but reality is otherwise." The のに carries the unspoken "but it isn't so":</p>
           <ul>
             <li>お金があれ<b>ば</b>買える<b>のに</b> — "if I had money, I could buy it (but I don't)."</li>
             <li>もう少し早く来<b>たら</b>、間に合った<b>のに</b> — "if you'd come a bit earlier, you'd have made it (but you didn't)."</li>
           </ul>` },
        { heading: "Wishes: 〜といい / たらいい / ばいい", html:
          `<p>For hopes about things not yet settled:</p>
           <ul>
             <li>早く元気になる<b>といい</b>ね — "I hope you get better soon."</li>
             <li>明日晴れ<b>たらいい</b>な — "I hope it's sunny tomorrow."</li>
             <li>For an out-of-reach wish, add のに: 行け<b>たらいいのに</b> ("I wish I could go").</li>
           </ul>` },
        { heading: "Regrets: 〜ばよかった", html:
          `<ul>
             <li>もっと勉強すれ<b>ばよかった</b> — "I should have studied more."</li>
             <li>あんなこと言わなけれ<b>ばよかった</b> — "I shouldn't have said that."</li>
           </ul>
           <p>It's literally "it would have been good if ~" — a gentle, wistful regret.</p>` },
        { heading: "Supposing: もし・たとえ・としたら", html:
          `<ul>
             <li><b>もし</b>〜たら — flags a hypothetical: もし宝くじが当たったら….</li>
             <li><b>たとえ</b>〜ても — "even if": たとえ高くても買う.</li>
             <li><b>〜としたら／とすれば</b> — "supposing that ~": 行くとしたら、いつ?</li>
           </ul>
           <div class="lesson-key"><b>のに is the magic ingredient.</b> A plain conditional states a possibility; adding のに turns it wistful — "if only… (but not)." That single particle is what makes a wish or a regret.</div>` },
      ],
      practice: [
        { label: "📖 All N3 Grammar", type: "study", sel: "n3gram" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },
    {
      id: "business", stage: "Intermediate · N3", title: "Business Japanese Basics",
      summary: "How the Japanese workplace communicates — 報連相, business cards, meetings, and keigo in action.",
      sections: [
        { heading: "The workplace mindset", html:
          `<p>One acronym captures the core expectation: <b>報連相 (ほうれんそう)</b> —</p>
           <ul>
             <li><b>報告</b> (hōkoku) — report on progress.</li>
             <li><b>連絡</b> (renraku) — keep people informed.</li>
             <li><b>相談</b> (sōdan) — consult before acting.</li>
           </ul>
           <p>Combined with the senpai/kōhai hierarchy, this drives how (and how much) you communicate.</p>` },
        { heading: "First contact", html:
          `<ul>
             <li>名刺交換 — exchange business cards with <b>both hands</b>, card facing the other person.</li>
             <li>Greeting: いつもお世話になっております.</li>
             <li>Introduce yourself: 〜社の(name)<b>と申します</b>.</li>
           </ul>` },
        { heading: "Meetings & tasks", html:
          `<table class="ex-table">
             <tr><td>会議 / 打ち合わせ</td><td>meeting / briefing</td></tr>
             <tr><td>締め切り しめきり</td><td>deadline</td></tr>
             <tr><td>資料 しりょう</td><td>materials / documents</td></tr>
             <tr><td>承知しました</td><td>"understood" (to a superior/client)</td></tr>
           </table>` },
        { heading: "Phrases you'll hear all day", html:
          `<ul>
             <li>お疲れ様です — the universal workplace greeting.</li>
             <li>よろしくお願いします — opening a task or request.</li>
             <li>失礼します — ending a phone call or leaving.</li>
             <li>出張 (business trip), 残業 (overtime), 有給 (paid leave).</li>
           </ul>
           <div class="lesson-key"><b>報連相 is the unwritten rule of the Japanese office</b> — report, contact, consult, early and often. Layer it onto お疲れ様です and the keigo you've learned and you can function in a real workplace.</div>` },
      ],
      practice: [
        { label: "📖 N2 Business Conversation", type: "study", sel: "n2phrbusiness" },
        { label: "📖 N3 Formal Conversation", type: "study", sel: "n3phrformal" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },

    {
      id: "quantity", stage: "Intermediate · N3", title: "Quantity, Approximation & Degree",
      summary: "Saying 'about', 'at least', 'almost', and 'quite' — precision (and vagueness) about amounts.",
      sections: [
        { heading: "Approximate amounts", html:
          `<table class="ex-table">
             <tr><td>約 やく</td><td>approximately (before a number): 約百人</td></tr>
             <tr><td>だいたい / ほぼ</td><td>roughly / almost</td></tr>
             <tr><td>〜くらい / ぐらい</td><td>about (after a number): 三十分くらい</td></tr>
             <tr><td>〜前後 ぜんご</td><td>around / give or take: 五時前後</td></tr>
           </table>` },
        { heading: "Thresholds & limits", html:
          `<table class="ex-table">
             <tr><td>以上 / 以下</td><td>~ or more / ~ or less (inclusive)</td></tr>
             <tr><td>未満 みまん</td><td>less than (exclusive): 20歳未満</td></tr>
             <tr><td>少なくとも</td><td>at least</td></tr>
             <tr><td>せいぜい</td><td>at most / at best</td></tr>
           </table>` },
        { heading: "Almost all / hardly any", html:
          `<ul>
             <li>ほとんど — almost all (+ positive) / hardly any (+ negative): ほとんど終わった / ほとんど分からない.</li>
             <li>わずか — only a little / a mere: わずか三人.</li>
             <li>たっぷり — plenty of; いっぱい — full / a lot.</li>
           </ul>` },
        { heading: "Degree adverbs", html:
          `<table class="ex-table">
             <tr><td>かなり / 相当 そうとう</td><td>quite / considerably</td></tr>
             <tr><td>非常に / 極めて</td><td>extremely (formal)</td></tr>
             <tr><td>わりと / 意外と</td><td>relatively / surprisingly</td></tr>
           </table>
           <div class="lesson-key"><b>Two sets to lock in:</b> 約／だいたい／くらい for fuzzy "about", and 以上／以下／未満 for exact cutoffs. They're everywhere in prices, statistics, and news — where being clear about amounts matters.</div>` },
      ],
      practice: [
        { label: "📖 Study N3 Vocabulary", type: "study", sel: "n3vocab" },
        { label: "📖 All N3 Grammar", type: "study", sel: "n3gram" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },

    // ============================ Upper-Intermediate · N2 ============================
    {
      id: "n2-kanji", stage: "Upper-Intermediate · N2", title: "N2 Kanji",
      summary: "Toward newspaper-level literacy.",
      sections: [
        { heading: "Most of daily literacy", html:
          `<p>By the end of N2 you can read the large majority of everyday text — roughly 1,000 kanji. Newspapers, work emails, and most novels become accessible with manageable lookup. The remaining characters are increasingly specialized.</p>` },
        { heading: "Recognize in context, learn compounds", html:
          `<p>At this stage, learning isolated characters is inefficient. Focus on the <b>compound vocabulary</b> of formal writing — 経済 (economy), 政治 (politics), 環境 (environment) — and let the kanji come along for the ride. Many share phonetic components that predict their on'yomi.</p>
           <div class="lesson-key"><b>Habit:</b> read something real every day. Your N2 kanji will be the ones you keep meeting, not the ones on a list.</div>` },
      ],
      practice: [
        { label: "📖 Study N2 Kanji", type: "study", sel: "n2" },
        { label: "🎮 Play the N2 Kanji game", type: "game", game: "n2" },
      ],
    },
    {
      id: "n2-vocab", stage: "Upper-Intermediate · N2", title: "N2 Vocabulary",
      summary: "Formal, written, and nuanced vocabulary.",
      sections: [
        { heading: "The language of essays and news", html:
          `<p>N2 vocabulary leans formal and written — the words of editorials, reports, and workplace Japanese. Many are Sino-Japanese compounds (漢語) that feel weightier than their everyday kun'yomi cousins.</p>
           <table class="ex-table">
             <tr><td>everyday vs formal</td><td>だんだん / 次第に</td><td>gradually</td></tr>
             <tr><td>everyday vs formal</td><td>やっぱり / やはり</td><td>as expected</td></tr>
           </table>` },
        { heading: "Register awareness", html:
          `<p>The key N2 vocab skill is knowing <i>where</i> a word belongs — casual conversation, polite speech, or written/formal. Using a stiff 漢語 with friends sounds odd; using slang in a report sounds worse. The example sentences on each card show the natural register.</p>` },
        { heading: "Idioms & set phrases", html:
          `<p>You'll meet four-character idioms (四字熟語) and fixed expressions: 一石二鳥 (one stone, two birds), 気をつける (be careful). Collect them — they make your Japanese sound fluent and native.</p>` },
      ],
      practice: [
        { label: "📖 All N2 Vocabulary", type: "study", sel: "n2vocab" },
        { label: "📖 Nouns", type: "study", sel: "n2nouns" },
        { label: "🎮 Play N2 Vocabulary", type: "game", game: "n2vocab" },
      ],
    },
    {
      id: "n2-grammar", stage: "Upper-Intermediate · N2", title: "N2 Grammar & Nuance",
      summary: "The dense grammar patterns of formal speech and writing.",
      sections: [
        { heading: "Grammar as vocabulary", html:
          `<p>N2 grammar is largely a long list of <b>set patterns</b> — fixed structures with specific nuances. Treat them like vocabulary: learn the shape, the meaning, and one good example each.</p>` },
        { heading: "High-frequency patterns", html:
          `<table class="ex-table">
             <tr><td>〜わけだ</td><td>wake da</td><td>"that's why / it follows that"</td></tr>
             <tr><td>〜に違いない</td><td>ni chigainai</td><td>"must be / no doubt"</td></tr>
             <tr><td>〜どころか</td><td>dokoroka</td><td>"far from / let alone"</td></tr>
             <tr><td>〜ものだ</td><td>mono da</td><td>"it's the way things are / used to"</td></tr>
             <tr><td>〜ば〜ほど</td><td>ba … hodo</td><td>"the more…, the more…"</td></tr>
           </table>` },
        { heading: "Subtle contrasts", html:
          `<p>Many N2 patterns differ only in nuance — 〜ために vs 〜ように (purpose), 〜うちに vs 〜あいだに (timing), 〜ばかり vs 〜だけ (only/just). Exam questions love these distinctions; reading widely is what makes them intuitive.</p>
           <div class="lesson-key"><b>Method:</b> when a pattern appears in your reading, note the whole sentence — context teaches nuance far better than a definition.</div>` },
      ],
      practice: [
        { label: "📖 All N2 Grammar", type: "study", sel: "n2gram" },
        { label: "📖 Complex structures", type: "study", sel: "n2gramcomplex" },
        { label: "📖 Keigo: Sonkeigo", type: "study", sel: "n2keigosonkeigo" },
        { label: "📖 Keigo: Kenjougo", type: "study", sel: "n2keigokenjougo" },
        { label: "🎮 Play N2 Vocabulary", type: "game", game: "n2vocab" },
      ],
    },

    {
      id: "written-style", stage: "Upper-Intermediate · N2", title: "Formal & Written Japanese (である調)",
      summary: "The plain-but-formal register of essays, news, and academic writing.",
      sections: [
        { heading: "Two written registers", html:
          `<p>Beyond the polite です/ます you learned for speech, written Japanese has its own formal register built on <b>だ / である</b>:</p>
           <table class="ex-table">
             <tr><td>です・ます調</td><td>polite</td><td>letters, emails, speeches, anything addressed to a reader</td></tr>
             <tr><td>だ・である調</td><td>plain-formal</td><td>essays, news, reports, academic and literary writing</td></tr>
           </table>
           <p>である isn't casual — it's <i>objective and authoritative</i>. Pick one register and stay in it throughout a piece; mixing them reads as careless.</p>` },
        { heading: "Hallmarks of である style", html:
          `<ul>
             <li>The copula is <b>である</b> (not だ or です): これは事実<b>である</b>.</li>
             <li>Explanatory のだ becomes <b>のである</b>; "can be thought" uses passive 〜と考えられる for objectivity.</li>
             <li>Heavier kanji use, formal connectors: また (also), さらに (furthermore), したがって (therefore), しかし (however), 一方 (on the other hand).</li>
             <li>Nominalized, noun-heavy phrasing: 〜の増加, 〜の必要性.</li>
           </ul>` },
        { heading: "Newspaper compression", html:
          `<p>Headlines and news prose squeeze the language hard. Recognizing the shortcuts speeds your reading enormously:</p>
           <ul>
             <li>Particles dropped: 首相、中国へ ("PM [to go] to China").</li>
             <li>する-nouns stand alone as verbs: 政府が発表 ("the government announces").</li>
             <li>Passive 〜される for neutral reporting: 〜が決定された.</li>
             <li>へ / で marking direction and place tightly.</li>
           </ul>` },
        { heading: "How to absorb it", html:
          `<div class="lesson-key"><b>Read real text.</b> NHK News Web Easy, Wikipedia articles, and op-eds are pure である-style — a few minutes a day trains the register far faster than any rule list.</div>
           <p>You don't need to <i>write</i> である fluently for most goals, but recognizing it instantly tells you "this is formal/written" and shifts how you parse the grammar around it.</p>` },
      ],
      practice: [
        { label: "📖 N2 Written Expression", type: "study", sel: "n2phrwritten" },
        { label: "📖 All N2 Grammar", type: "study", sel: "n2gram" },
      ],
    },
    {
      id: "sentence-particles", stage: "Upper-Intermediate · N2", title: "Sentence-Ending Particles & Nuance",
      summary: "ね, よ, な, わ, の and friends — the tiny words that carry tone, gender, and attitude.",
      sections: [
        { heading: "Tone lives at the end", html:
          `<p>Final particles barely change a sentence's <i>meaning</i> but completely change its <i>feeling</i>. They're how spoken Japanese conveys attitude:</p>
           <table class="ex-table">
             <tr><td>ね</td><td>seeks agreement / softens</td><td>いい天気だね ("nice weather, right?")</td></tr>
             <tr><td>よ</td><td>asserts / informs (new info)</td><td>もう始まってるよ ("it's already started!")</td></tr>
             <tr><td>よね</td><td>confirm shared knowledge</td><td>明日休みだよね ("tomorrow's off, right?")</td></tr>
             <tr><td>な / なあ</td><td>reflection, emotion (to self)</td><td>いいなあ ("man, that's nice")</td></tr>
             <tr><td>の / のだ</td><td>explanation / soft question</td><td>どうしたの? ("what's up?")</td></tr>
             <tr><td>かな</td><td>"I wonder…"</td><td>来るかな ("I wonder if they'll come")</td></tr>
             <tr><td>っけ</td><td>trying to recall</td><td>名前、何だっけ ("what was the name again?")</td></tr>
           </table>` },
        { heading: "ね vs よ — the core contrast", html:
          `<p>Get these two right and you sound far more natural:</p>
           <ul>
             <li><b>ね</b> assumes the listener <i>already agrees</i> — you're sharing a feeling. Overusing よ where ね belongs sounds pushy.</li>
             <li><b>よ</b> delivers something the listener <i>doesn't know yet</i>. Dropping it where it belongs can sound flat or cold.</li>
           </ul>
           <p>そうですね ("yes, indeed") vs そうですよ ("yes it is — for your information") feel quite different in a conversation.</p>` },
        { heading: "Register & gender coloring", html:
          `<p>Some endings carry a strong social color — useful to recognize even if you don't use them:</p>
           <ul>
             <li><b>ぞ / ぜ</b> — rough, assertive, masculine: 行くぞ.</li>
             <li><b>わ</b> — softening; feminine in standard Tokyo speech (but gender-neutral in Kansai).</li>
             <li><b>かしら</b> — "I wonder", traditionally feminine.</li>
             <li><b>さ</b> — casual filler/assertion: だからさ….</li>
           </ul>
           <div class="lesson-key"><b>Don't drill these from a chart — tune them by ear.</b> They're about social feel, so the only real teacher is lots of listening to natural conversation.</div>` },
      ],
      practice: [
        { label: "📖 All N2 Grammar", type: "study", sel: "n2gram" },
        { label: "🎮 Play N2 Vocabulary", type: "game", game: "n2vocab" },
      ],
    },

    {
      id: "near-synonyms", stage: "Upper-Intermediate · N2", title: "Nuance: Choosing Between Near-Synonyms",
      summary: "そう vs よう vs らしい, はず vs べき vs わけ — the distinctions that separate N2 from N3.",
      sections: [
        { heading: "The four \"seems\": そう・よう・みたい・らしい", html:
          `<p>By N2 the challenge isn't learning new patterns but picking the <i>right</i> one. These four all translate as "seems", but each has a trigger:</p>
           <table class="ex-table">
             <tr><td>〜そう (様態)</td><td>from what I <b>see</b> right now / about to happen</td><td>雨が降りそうだ</td></tr>
             <tr><td>〜ようだ</td><td>inference from <b>evidence</b> (formal)</td><td>誰か来たようだ</td></tr>
             <tr><td>〜みたいだ</td><td>same as ようだ, but casual</td><td>風邪をひいたみたい</td></tr>
             <tr><td>〜らしい</td><td>from <b>information / hearsay</b> ("apparently")</td><td>彼は辞めたらしい</td></tr>
           </table>
           <p>そう = your eyes; ようだ/みたい = your reasoning; らしい = something you heard.</p>` },
        { heading: "はず vs べき vs わけ", html:
          `<p>Three "should/so"-ish endings with very different jobs:</p>
           <ul>
             <li><b>はず</b> — logical <i>expectation</i> from facts: 彼は来るはずだ ("he should be coming — he said so").</li>
             <li><b>べき</b> — <i>moral</i> obligation: 約束は守るべきだ ("you ought to keep promises").</li>
             <li><b>わけ</b> — a <i>conclusion / reason</i>: 道理で寒いわけだ ("no wonder it's cold").</li>
           </ul>` },
        { heading: "ため vs ように (purpose)", html:
          `<p>Both mean "in order to", but the verb before them decides which:</p>
           <ul>
             <li><b>〜ために</b> — with a <i>volitional, same-subject</i> action (or a noun): 合格する<b>ために</b>勉強する.</li>
             <li><b>〜ように</b> — with a <i>potential, negative, or non-volitional</i> verb: 忘れない<b>ように</b>メモする ・ 見える<b>ように</b>大きく書く.</li>
           </ul>` },
        { heading: "Future: つもり vs 予定 vs はず", html:
          `<ul>
             <li><b>つもり</b> — personal <i>intention</i>: 行くつもりだ.</li>
             <li><b>予定</b> — a fixed <i>schedule / arrangement</i>: 三時に出発する予定だ.</li>
             <li><b>はず</b> — an <i>expectation</i> about what will happen: もう着くはずだ.</li>
           </ul>
           <div class="lesson-key"><b>The N2 skill:</b> for each cluster, learn the one <i>trigger</i> that distinguishes the members — evidence type, obligation vs expectation, verb form. That's what the exam (and real nuance) tests.</div>` },
      ],
      practice: [
        { label: "📖 All N2 Grammar", type: "study", sel: "n2gram" },
        { label: "🎮 Play N2 Vocabulary", type: "game", game: "n2vocab" },
      ],
    },
    {
      id: "formal-writing", stage: "Upper-Intermediate · N2", title: "Formal Letters & Business Writing",
      summary: "The fixed frames of letters and business email — open, body, close, and polite requests.",
      sections: [
        { heading: "The letter skeleton", html:
          `<p>Traditional letters are built on a fixed frame of opening and closing words:</p>
           <table class="ex-table">
             <tr><td>拝啓 はいけい</td><td>opening salutation ("Dear…")</td></tr>
             <tr><td>敬具 けいぐ</td><td>closing ("Sincerely") — pairs with 拝啓</td></tr>
             <tr><td>前略 … 草々</td><td>shorter, less formal pair (skips the greeting)</td></tr>
           </table>` },
        { heading: "Seasonal greetings (時候の挨拶)", html:
          `<p>After 拝啓, a formal letter opens with a <b>season line</b> and a health inquiry — it's expected, not optional:</p>
           <ul>
             <li>新緑の候、いかがお過ごしでしょうか — "In this season of fresh greenery, how are you?"</li>
             <li>寒さ厳しき折、お体ご自愛ください — a wintertime sign-off wishing care for one's health.</li>
           </ul>
           <p>You can keep a small stock of these by season and reuse them verbatim.</p>` },
        { heading: "Business email structure", html:
          `<p>Email is less ornate but just as patterned. The order almost never varies:</p>
           <table class="ex-table">
             <tr><td>1. 宛名</td><td>recipient + 様 / 御中</td></tr>
             <tr><td>2. 挨拶</td><td>いつもお世話になっております</td></tr>
             <tr><td>3. 名乗り</td><td>your name / company</td></tr>
             <tr><td>4. 用件</td><td>the actual message</td></tr>
             <tr><td>5. 結び</td><td>よろしくお願いいたします</td></tr>
           </table>` },
        { heading: "Polite request grammar", html:
          `<p>Requests climb in politeness; business writing favors the highest rungs:</p>
           <ul>
             <li>〜ていただけますでしょうか — "could you kindly ~?"</li>
             <li>〜ていただければ幸いです — "I'd be grateful if you would ~".</li>
             <li>ご〜くださいますようお願い申し上げます — the most formal "please ~".</li>
           </ul>
           <div class="lesson-key"><b>Slot, don't compose.</b> Business Japanese runs on set frames — master the skeleton and drop your content into it. Improvising the structure is what reads as off; reusing the frames reads as competent.</div>` },
      ],
      practice: [
        { label: "📖 N2 Business Conversation", type: "study", sel: "n2phrbusiness" },
        { label: "📖 N2 Written Expression", type: "study", sel: "n2phrwritten" },
      ],
    },

    {
      id: "idioms", stage: "Upper-Intermediate · N2", title: "Everyday Idioms & 気-Expressions",
      summary: "The 気-phrases and set expressions that fill natural speech but never translate literally.",
      sections: [
        { heading: "The 気 family", html:
          `<p>A huge slice of everyday feeling and attention runs through 気 (ki, "spirit / mind"). Learn these as whole units:</p>
           <table class="ex-table">
             <tr><td>気をつける</td><td>to be careful</td></tr>
             <tr><td>気にする</td><td>to worry about / mind</td></tr>
             <tr><td>気になる</td><td>to be curious / bothered by</td></tr>
             <tr><td>気がつく</td><td>to notice</td></tr>
             <tr><td>気が合う</td><td>to get along (click with someone)</td></tr>
             <tr><td>気が変わる</td><td>to change one's mind</td></tr>
           </table>
           <p>Note the pair 気にする ("<i>I</i> mind it") vs 気になる ("it bothers/intrigues me") — a classic mix-up.</p>` },
        { heading: "Common set adverbs", html:
          `<table class="ex-table">
             <tr><td>やっぱり</td><td>as expected / after all</td></tr>
             <tr><td>とにかく</td><td>anyway / in any case</td></tr>
             <tr><td>せっかく</td><td>(took the trouble) specially</td></tr>
             <tr><td>わざわざ</td><td>going out of one's way</td></tr>
             <tr><td>さすが</td><td>impressive (as you'd expect)</td></tr>
           </table>` },
        { heading: "Feeling & effort idioms", html:
          `<ul>
             <li>頭にくる — to get angry ("it comes to the head").</li>
             <li>気が重い / 気が楽 — feel weighed down / feel at ease.</li>
             <li>手間がかかる — to take effort/trouble; 面倒くさい — what a hassle.</li>
             <li>仕方がない / しょうがない — "it can't be helped."</li>
           </ul>` },
        { heading: "Conversation softeners", html:
          `<p>Tiny words that smooth speech and buy thinking time:</p>
           <ul>
             <li><b>なんか</b> — "like / somehow" (vague filler): なんか変だ.</li>
             <li><b>ちょっと</b> — "a bit", and a gentle way to decline.</li>
             <li><b>まあ</b> — "well… / sort of".</li>
           </ul>
           <div class="lesson-key"><b>Don't translate these word-by-word.</b> 気をつける isn't "attach spirit" — it's "be careful." Collect them as fixed expressions, and your Japanese will suddenly sound far less textbook.</div>` },
      ],
      practice: [
        { label: "📖 All N2 Grammar", type: "study", sel: "n2gram" },
        { label: "🎮 Play N2 Vocabulary", type: "game", game: "n2vocab" },
      ],
    },

    {
      id: "science-tech", stage: "Upper-Intermediate · N2", title: "Science, Technology & the Future",
      summary: "The 漢語 vocabulary of research, tech, and society — a major N2+ reading genre.",
      sections: [
        { heading: "Science & research", html:
          `<table class="ex-table">
             <tr><td>科学 かがく / 技術 ぎじゅつ</td><td>science / technology</td></tr>
             <tr><td>研究 / 実験</td><td>research / experiment</td></tr>
             <tr><td>開発 / 発明</td><td>development / invention</td></tr>
             <tr><td>理論 / データ</td><td>theory / data</td></tr>
           </table>` },
        { heading: "Digital & tech", html:
          `<table class="ex-table">
             <tr><td>人工知能 (AI)</td><td>artificial intelligence</td></tr>
             <tr><td>ロボット / システム</td><td>robot / system</td></tr>
             <tr><td>情報 じょうほう</td><td>information</td></tr>
             <tr><td>自動化 / デジタル化</td><td>automation / digitalization</td></tr>
           </table>` },
        { heading: "Future & society", html:
          `<table class="ex-table">
             <tr><td>未来 / 宇宙</td><td>future / space</td></tr>
             <tr><td>環境 / エネルギー</td><td>environment / energy</td></tr>
             <tr><td>影響 / 課題</td><td>impact / challenge</td></tr>
             <tr><td>解決 / 進化</td><td>solution / evolution</td></tr>
           </table>` },
        { heading: "Reading science writing", html:
          `<p>Science/tech articles combine this vocabulary with the formal grammar you've met:</p>
           <ul>
             <li>である調, neutral passives 〜とされる, 〜と考えられる, 〜によって.</li>
             <li>The abstract suffixes from the academic-vocabulary lesson: 〜化 (-ization), 〜性 (-ity), 〜的 (-ic).</li>
           </ul>
           <div class="lesson-key"><b>It's a vocabulary genre.</b> These 漢語 terms plus the academic suffixes unlock science and tech journalism — one of the most common (and predictable) N2/N1 reading genres.</div>` },
      ],
      practice: [
        { label: "📖 N2 Written Expression", type: "study", sel: "n2phrwritten" },
        { label: "📖 All N2 Grammar", type: "study", sel: "n2gram" },
        { label: "🎮 Play N2 Vocabulary", type: "game", game: "n2vocab" },
      ],
    },

    {
      id: "service-keigo", stage: "Upper-Intermediate · N2", title: "Customer-Service Keigo (What You'll Hear)",
      summary: "The polite phrases shops, restaurants, and stations fire at you — tuned for your ear.",
      sections: [
        { heading: "You'll mostly hear, not say, this", html:
          `<p>Unlike the keigo you <i>produce</i>, this is the wall of politeness aimed <i>at</i> you as a customer. Catching it makes daily life effortless:</p>
           <table class="ex-table">
             <tr><td>いらっしゃいませ</td><td>"welcome" (no reply needed)</td></tr>
             <tr><td>少々お待ちください</td><td>"one moment, please"</td></tr>
             <tr><td>お待たせいたしました</td><td>"sorry to keep you waiting"</td></tr>
             <tr><td>ありがとうございました</td><td>"thank you" (on leaving)</td></tr>
           </table>` },
        { heading: "Shops & restaurants", html:
          `<table class="ex-table">
             <tr><td>ご注文はお決まりですか</td><td>"are you ready to order?"</td></tr>
             <tr><td>〜でよろしいでしょうか</td><td>"is ~ all right?"</td></tr>
             <tr><td>お会計は〜円でございます</td><td>"your total is ~ yen"</td></tr>
             <tr><td>またのお越しをお待ちしております</td><td>"please come again"</td></tr>
           </table>` },
        { heading: "バイト敬語 — the \"manual\" keigo", html:
          `<p>Part-time staff use a few forms that are technically <i>incorrect</i> but absolutely everywhere — recognize them, even though you shouldn't copy them in formal writing:</p>
           <ul>
             <li>〜のほう: お水の<b>ほう</b>をお持ちします (the のほう is filler).</li>
             <li>〜になります: 千円<b>になります</b> (it just <i>is</i> ¥1000 — になります is over-applied).</li>
             <li>よろしかったでしょうか — odd past tense for a present question.</li>
           </ul>` },
        { heading: "Station & in-store announcements", html:
          `<ul>
             <li>まもなく〜に到着します — "arriving shortly at ~."</li>
             <li>ドアが閉まります、ご注意ください — "the doors are closing."</li>
             <li>足元にお気をつけください — "watch your step."</li>
           </ul>
           <div class="lesson-key"><b>This is a listening skill.</b> You receive far more keigo than you give. Train your ear on いらっしゃいませ / お待ちください / 〜になります and shops, trains, and restaurants stop feeling like a wall of polite noise.</div>` },
      ],
      practice: [
        { label: "📖 N2 Business Conversation", type: "study", sel: "n2phrbusiness" },
        { label: "📖 Sonkeigo (respectful)", type: "study", sel: "n2keigosonkeigo" },
        { label: "🎮 Play N2 Vocabulary", type: "game", game: "n2vocab" },
      ],
    },

    // ============================ Advanced · N1 ============================
    {
      id: "n1-kanji", stage: "Advanced · N1", title: "N1 Kanji",
      summary: "The full set for advanced, near-native reading.",
      sections: [
        { heading: "The home stretch", html:
          `<p>N1 covers the remaining common kanji — around 2,000 total — including rarer readings and literary or specialized vocabulary. At this point you're refining breadth and speed rather than learning fundamentals.</p>` },
        { heading: "Rare readings & literary forms", html:
          `<p>The challenge shifts to <b>uncommon readings</b>, older/literary kanji, and dense compounds in academic, legal and journalistic writing. Furigana disappears; you're expected to know it. Specialized fields each carry their own kanji vocabulary.</p>
           <div class="lesson-key"><b>Truth:</b> nobody finishes N1 kanji by drilling alone. Volume of real reading — books, essays, news — is what carries you across the line.</div>` },
      ],
      practice: [
        { label: "📖 Study N1 Kanji", type: "study", sel: "n1" },
        { label: "🎮 Play the N1 Kanji game", type: "game", game: "n1" },
      ],
    },
    {
      id: "n1-vocab", stage: "Advanced · N1", title: "N1 Vocabulary",
      summary: "Nuanced, formal and literary language.",
      sections: [
        { heading: "Toward native-like range", html:
          `<p>N1 vocabulary is broad and often abstract or literary — precise synonyms, formal 漢語, idioms, and words you'll mostly meet in writing. The goal is not just to recognize them but to feel their exact shade.</p>` },
        { heading: "Precision and onomatopoeia", html:
          `<p>Two N1-flavored challenges: distinguishing fine synonyms (改善 vs 改良 vs 改正, all "improvement/revision" in different domains) and mastering the huge world of <b>onomatopoeia</b> (ぎりぎり just barely, しみじみ deeply/keenly) that natives use constantly.</p>` },
        { heading: "Immersion is the path now", html:
          `<p>The real engine at this level is <b>immersion</b> — novels, news, podcasts, films — with the decks as a backstop for words you keep meeting. Read what you enjoy; enjoyment sustains the volume that advanced Japanese requires.</p>` },
      ],
      practice: [
        { label: "📖 All N1 Vocabulary", type: "study", sel: "n1vocab" },
        { label: "📖 Nouns", type: "study", sel: "n1nouns" },
        { label: "🎮 Play N1 Vocabulary", type: "game", game: "n1vocab" },
      ],
    },
    {
      id: "casual-speech", stage: "Advanced · N1", title: "Casual & Spoken Japanese",
      summary: "The contractions, dropped particles, and slang that textbooks skip but everyone uses.",
      sections: [
        { heading: "How casual differs", html:
          `<p>Real conversation among friends drops the polite scaffolding. The shifts from textbook Japanese are systematic:</p>
           <ul>
             <li>Verbs go to <b>plain form</b>: 食べます → 食べる, 行きました → 行った.</li>
             <li>Particles get <b>dropped</b>: ご飯（を）食べた? / これ（は）いいね.</li>
             <li>Questions use a rising <b>〜の?</b> or just intonation: どこ行くの? / もう食べた?</li>
             <li>です/ます mostly vanish among peers.</li>
           </ul>` },
        { heading: "The sound contractions", html:
          `<p>Spoken Japanese squeezes common endings together. These are everywhere in speech, anime, and manga:</p>
           <table class="ex-table">
             <tr><td>〜ている</td><td>〜てる</td><td>何してる?</td></tr>
             <tr><td>〜ておく</td><td>〜とく</td><td>買っとく</td></tr>
             <tr><td>〜てしまう</td><td>〜ちゃう / じゃう</td><td>忘れちゃった</td></tr>
             <tr><td>〜なければ</td><td>〜なきゃ</td><td>行かなきゃ</td></tr>
             <tr><td>〜ては / では</td><td>〜ちゃ / じゃ</td><td>食べちゃだめ</td></tr>
             <tr><td>〜という</td><td>〜って</td><td>田中って人</td></tr>
             <tr><td>〜ない</td><td>〜ん</td><td>分かんない</td></tr>
           </table>` },
        { heading: "Casual words & enders", html:
          `<ul>
             <li><b>うん / ううん</b> — casual yes / no (vs はい / いいえ).</li>
             <li><b>〜じゃん</b> — "isn't it?" / "see?": いいじゃん.</li>
             <li><b>めっちゃ / すごく</b> — "super / really": めっちゃ美味しい.</li>
             <li><b>〜けど…</b> trailing off — softens or leaves the rest implied.</li>
             <li><b>〜っす</b> — clipped, casual-polite (です): いいっす.</li>
           </ul>
           <div class="lesson-key"><b>Comprehension first.</b> You can keep speaking politely and still need to <i>understand</i> all of this — it's most of what you'll hear in real life and media.</div>` },
      ],
      practice: [
        { label: "📖 All N1 Grammar", type: "study", sel: "n1gram" },
        { label: "🎮 Play N1 Vocabulary", type: "game", game: "n1vocab" },
      ],
    },
    {
      id: "loanwords", stage: "Advanced · N1", title: "Loanwords & Wasei-Eigo",
      summary: "Gairaigo in katakana — and the \"English\" words that aren't actually English.",
      sections: [
        { heading: "Gairaigo: borrowed words", html:
          `<p>Thousands of everyday words are <b>gairaigo</b> (外来語) — borrowed from other languages and written in katakana. Most are from English, but not all:</p>
           <ul>
             <li>From German: アルバイト (part-time job), エネルギー (energy).</li>
             <li>From Portuguese: パン (bread), タバコ (tobacco).</li>
             <li>From French: アンケート (survey), カフェ.</li>
           </ul>
           <p>Because they're written in katakana, reading katakana fluently <i>is</i> reading a huge slice of modern vocabulary.</p>` },
        { heading: "How English gets reshaped", html:
          `<p>Japanese has no consonant clusters and few final consonants, so loanwords get padded with vowels — which can make them hard to recognize at first:</p>
           <table class="ex-table">
             <tr><td>ストレス</td><td>su-to-re-su</td><td>stress</td></tr>
             <tr><td>マクドナルド</td><td>ma-ku-do-na-ru-do</td><td>McDonald's</td></tr>
             <tr><td>テーブル</td><td>tē-bu-ru</td><td>table</td></tr>
             <tr><td>ビール</td><td>bī-ru</td><td>beer</td></tr>
           </table>
           <p>L and R both become the same ら-row sound, and a vowel (usually u, sometimes o) fills every gap.</p>` },
        { heading: "Wasei-eigo: \"made-in-Japan English\"", html:
          `<p>Beware the false friends — <b>wasei-eigo</b> (和製英語) are English-looking words coined in Japan that a native English speaker wouldn't understand:</p>
           <table class="ex-table">
             <tr><td>サラリーマン</td><td>"salary man" = office worker</td></tr>
             <tr><td>ベビーカー</td><td>"baby car" = stroller</td></tr>
             <tr><td>マンション</td><td>"mansion" = apartment / condo</td></tr>
             <tr><td>コンセント</td><td>"consent" = power outlet</td></tr>
             <tr><td>ノートパソコン</td><td>"note + personal computer" = laptop</td></tr>
           </table>
           <p>Japanese also loves to <b>clip</b> long loans: リモコン (remote control), エアコン (air conditioner), コンビニ (convenience store), スマホ (smartphone).</p>` },
        { heading: "The takeaway", html:
          `<div class="lesson-key"><b>Two skills:</b> read katakana smoothly enough to sound words out, and never assume a katakana word means exactly what the English looks like. Confirm the real meaning the first time you meet one.</div>` },
      ],
      practice: [
        { label: "📖 Study Katakana", type: "study", sel: "katakana" },
        { label: "🎮 Play the Katakana game", type: "game", game: "katakana" },
      ],
    },
    {
      id: "aizuchi", stage: "Advanced · N1", title: "Aizuchi & Conversation Culture",
      summary: "Backchanneling, indirectness, and the unwritten rules that make conversation flow.",
      sections: [
        { heading: "Aizuchi: active listening out loud", html:
          `<p>In a Japanese conversation, the listener constantly chimes in with little signals called <b>aizuchi</b> (相槌) — they mean "I'm following, keep going." Staying silent can read as bored or not listening:</p>
           <ul>
             <li><b>うん / ええ / はい</b> — "mm-hm / yes" (casual → polite).</li>
             <li><b>そうですね / そうなんだ</b> — "I see / is that so".</li>
             <li><b>なるほど</b> — "ah, makes sense".</li>
             <li><b>へえ / ほんとに?</b> — "ohh / really?" (interest, surprise).</li>
           </ul>
           <p>Sprinkle these while someone talks and the exchange instantly feels natural. Their absence feels cold.</p>` },
        { heading: "Indirectness & softening", html:
          `<p>Japanese leans on implication; a flat "no" can feel harsh, so refusals are softened or left unfinished:</p>
           <ul>
             <li>Trailing off: ちょっと… / 今日は ちょっと難しいですね… (= a polite "no").</li>
             <li>Hedging with 〜けど / 〜が: いいと思うんですけど… (leaving room to disagree).</li>
             <li>Stating a difficulty rather than refusing: それは厳しいかもしれません.</li>
           </ul>
           <p>Learning to <i>hear</i> a no inside a soft phrase is as important as any grammar point.</p>` },
        { heading: "Ritual set phrases", html:
          `<p>Daily life runs on fixed expressions tied to moments — using them marks you as culturally fluent:</p>
           <table class="ex-table">
             <tr><td>よろしくお願いします</td><td>opening a relationship / request (untranslatable, essential)</td></tr>
             <tr><td>お疲れ様です</td><td>acknowledging others' effort (workplace glue)</td></tr>
             <tr><td>いただきます / ごちそうさま</td><td>before / after eating</td></tr>
             <tr><td>お先に失礼します</td><td>"excuse me for leaving first"</td></tr>
           </table>
           <div class="lesson-key"><b>Fluency isn't just grammar.</b> The rhythm of aizuchi and the habit of softening carry as much social weight as vocabulary — absorb them by watching real conversation, not just studying sentences.</div>` },
      ],
      practice: [
        { label: "📖 N4 Daily Conversation", type: "study", sel: "n4phrdaily" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },
    {
      id: "proverbs", stage: "Advanced · N1", title: "Proverbs, Idioms & Four-Character Phrases",
      summary: "ことわざ, 慣用句, and 四字熟語 — the compact wisdom that signals real cultural fluency.",
      sections: [
        { heading: "ことわざ: proverbs", html:
          `<p>Like every language, Japanese has a stock of pithy proverbs. Recognizing them adds color and shows depth:</p>
           <table class="ex-table">
             <tr><td>猿も木から落ちる</td><td>even monkeys fall from trees (anyone can slip up)</td></tr>
             <tr><td>七転び八起き</td><td>fall seven times, rise eight (resilience)</td></tr>
             <tr><td>花より団子</td><td>dumplings over flowers (substance over style)</td></tr>
             <tr><td>急がば回れ</td><td>if in a hurry, go around (more haste, less speed)</td></tr>
             <tr><td>石の上にも三年</td><td>three years on a cold stone (perseverance pays off)</td></tr>
           </table>` },
        { heading: "四字熟語: four-character idioms", html:
          `<p><b>Yojijukugo</b> pack a whole idea into four kanji — they appear in writing, speeches, and tests:</p>
           <table class="ex-table">
             <tr><td>一石二鳥 いっせきにちょう</td><td>one stone, two birds</td></tr>
             <tr><td>十人十色 じゅうにんといろ</td><td>ten people, ten colors (to each their own)</td></tr>
             <tr><td>一期一会 いちごいちえ</td><td>a once-in-a-lifetime encounter</td></tr>
             <tr><td>自業自得 じごうじとく</td><td>you reap what you sow</td></tr>
             <tr><td>臨機応変 りんきおうへん</td><td>adapting flexibly to circumstances</td></tr>
           </table>` },
        { heading: "慣用句: set idioms (often body parts)", html:
          `<p>Everyday idioms frequently build on body parts — their literal meaning is a poor guide, so learn them whole:</p>
           <table class="ex-table">
             <tr><td>顔が広い かおがひろい</td><td>"wide face" = well-connected</td></tr>
             <tr><td>手が空く てがあく</td><td>"hands open" = be free / available</td></tr>
             <tr><td>腹が立つ はらがたつ</td><td>"stomach stands" = get angry</td></tr>
             <tr><td>頭が固い あたまがかたい</td><td>"hard head" = stubborn, inflexible</td></tr>
             <tr><td>口が軽い くちがかるい</td><td>"light mouth" = can't keep a secret</td></tr>
           </table>` },
        { heading: "How to use them", html:
          `<div class="lesson-key"><b>Recognition first, sparing use second.</b> You'll meet these in newspapers, novels, and conversation far more than you'll need to produce them. Knowing a couple dozen makes dense text click — and dropping the right 四字熟語 at the right moment is unmistakably fluent.</div>
           <p>Treat them as vocabulary: collect the ones you keep running into, and they'll start to feel natural.</p>` },
      ],
      practice: [
        { label: "📖 All N1 Grammar", type: "study", sel: "n1gram" },
        { label: "🎮 Play N1 Vocabulary", type: "game", game: "n1vocab" },
      ],
    },
    {
      id: "academic-vocab", stage: "Advanced · N1", title: "Abstract & Academic Vocabulary",
      summary: "Sino-Japanese compounds and the productive suffixes that build abstract terms.",
      sections: [
        { heading: "漢語 powers formal vocabulary", html:
          `<p>Formal and academic Japanese leans heavily on <b>漢語 (kango)</b> — two-kanji on'yomi compounds borrowed from Chinese. They're denser and more formal than their native (和語) cousins:</p>
           <ul>
             <li>始める (native) → 開始する (kango) = "to begin".</li>
             <li>考え (native) → 概念・思考 (kango) = "concept / thinking".</li>
           </ul>
           <p>In writing, the kango version signals a higher register — the same shift as English "begin" vs "commence".</p>` },
        { heading: "Suffixes that build abstraction", html:
          `<p>A handful of productive suffixes generate hundreds of abstract words. Learn the suffix and you can decode (and coin) them:</p>
           <table class="ex-table">
             <tr><td>〜的 てき</td><td>-ic / -al</td><td>社会的, 客観的, 一般的</td></tr>
             <tr><td>〜性 せい</td><td>-ness / -ity</td><td>可能性, 重要性, 安全性</td></tr>
             <tr><td>〜化 か</td><td>-ization</td><td>国際化, 自動化, 高齢化</td></tr>
             <tr><td>〜主義 しゅぎ</td><td>-ism</td><td>資本主義, 民主主義</td></tr>
             <tr><td>〜論 ろん</td><td>theory / discourse of</td><td>進化論, 議論</td></tr>
             <tr><td>〜者 しゃ</td><td>-ist / person who</td><td>研究者, 消費者</td></tr>
           </table>` },
        { heading: "Nominalizing for abstraction", html:
          `<p>Abstract writing turns actions and qualities into <i>concepts</i>:</p>
           <ul>
             <li>Adjective → noun with <b>〜さ</b> (objective) or <b>〜み</b> (subjective feel): 重要さ, 深み.</li>
             <li>Verb → noun with the kango compound: 発展する → 発展, 影響する → 影響.</li>
           </ul>` },
        { heading: "Decoding dense compounds", html:
          `<div class="lesson-key"><b>Break it into kanji.</b> 環境問題 = 環境 (environment) + 問題 (problem). 国際化 = 国際 (international) + 化 (-ization). When you meet an unfamiliar abstract word, read each kanji's meaning and the suffix — you'll guess right far more often than not.</div>` },
      ],
      practice: [
        { label: "📖 Study N1 Vocabulary", type: "study", sel: "n1vocab" },
        { label: "🎮 Play N1 Vocabulary", type: "game", game: "n1vocab" },
      ],
    },
    {
      id: "reading-genres", stage: "Advanced · N1", title: "Reading Genres: News, Essays & Literature",
      summary: "Each genre has its own grammar and rhythm — recognize it, and you know how to read it.",
      sections: [
        { heading: "News & journalism", html:
          `<p>Written in <b>である調</b>, news prose is compressed and impersonal:</p>
           <ul>
             <li>Heavy passives and reporting forms: 〜とされる, 〜と見られる, 〜によると ("according to").</li>
             <li>Dropped particles and する-noun verbs in headlines: 政府、増税を検討.</li>
             <li>Dense kanji compounds carry the content.</li>
           </ul>
           <p>Read for the <b>who / what / outcome</b>; the structure is predictable once you expect it.</p>` },
        { heading: "Opinion & academic essays", html:
          `<p>論説 (editorials) and academic writing live and die by <b>logical flow</b>. The connectors are your map:</p>
           <ul>
             <li>したがって (therefore), つまり (in other words), 一方 (on the other hand), ただし (however/provided).</li>
             <li>Structure: thesis → supporting points → conclusion, signposted explicitly.</li>
           </ul>
           <p>Track the argument by following the connectors, not by translating every sentence.</p>` },
        { heading: "Literature & fiction", html:
          `<p>Novels and stories reach for tools the other genres avoid:</p>
           <ul>
             <li>Literary/older grammar: 〜ぬ (= 〜ない), 〜まい, classical inflections.</li>
             <li>Free indirect thought — a character's inner voice blends into the narration.</li>
             <li>Rich onomatopoeia, and speech that shifts <b>register or dialect</b> to characterize people.</li>
           </ul>` },
        { heading: "Match your reading to the genre", html:
          `<div class="lesson-key"><b>One size doesn't fit all.</b> Skim news for facts, follow the logic chain in essays, and slow down to infer mood and subtext in fiction. Identifying the genre in the first lines tells you which gear to read in.</div>` },
      ],
      practice: [
        { label: "📖 All N1 Grammar", type: "study", sel: "n1gram" },
        { label: "🎮 Play N1 Vocabulary", type: "game", game: "n1vocab" },
      ],
    },
    {
      id: "advanced-kanji", stage: "Advanced · N1", title: "Advanced Kanji: Compounds, Jukugo & Attack Strategies",
      summary: "How multi-kanji words parse, the mixed and special readings, and decoding the unknown.",
      sections: [
        { heading: "How jukugo parse", html:
          `<p>Compound words (熟語) build up in predictable shapes — seeing the structure helps you read and guess them:</p>
           <table class="ex-table">
             <tr><td>2 kanji</td><td>usually on + on</td><td>社会, 経済, 環境</td></tr>
             <tr><td>3 kanji</td><td>often 1+2 or 2+1</td><td>不可能 (不+可能), 高学歴 (高+学歴)</td></tr>
             <tr><td>4 kanji</td><td>usually 2+2</td><td>環境問題, 国際社会 (or a 四字熟語)</td></tr>
           </table>` },
        { heading: "Mixed readings", html:
          `<p>Most compounds are on+on, but two hybrid patterns are common enough to expect:</p>
           <ul>
             <li><b>重箱読み</b> (jūbako) — on + kun: 台所 (だい+どころ);</li>
             <li><b>湯桶読み</b> (yutō) — kun + on: 場所 (ば+しょ), 手帳 (て+ちょう).</li>
           </ul>
           <p>So a "wrong-looking" reading often isn't wrong — it's one of these hybrids.</p>` },
        { heading: "当て字 & whole-word readings", html:
          `<p>Some words ignore the normal reading rules entirely:</p>
           <ul>
             <li><b>当て字 (ateji)</b> — kanji chosen for sound, not meaning: 寿司 (sushi), 珈琲 (coffee).</li>
             <li><b>熟字訓</b> — a reading assigned to the <i>whole word</i>, not its parts: 今日 (きょう), 昨日 (きのう), 大人 (おとな), 上手 (じょうず).</li>
           </ul>
           <p>These are memorized as units — you can't sound them out from the kanji.</p>` },
        { heading: "Attacking an unknown word", html:
          `<div class="lesson-key"><b>Decompose, then infer.</b> For meaning, read each component kanji and its radical (氵 = water, 言 = speech). For reading, recall the on'yomi you already know from other compounds. You'll resolve most unfamiliar jukugo without a dictionary — and only the few that block comprehension are worth a lookup.</div>` },
      ],
      practice: [
        { label: "📖 Study N1 Kanji", type: "study", sel: "n1" },
        { label: "🎮 Play the N1 Kanji game", type: "game", game: "n1" },
      ],
    },
    {
      id: "classical-grammar", stage: "Advanced · N1", title: "A Primer on Classical Japanese (古文)",
      summary: "Why the old grammar still matters — and the classical forms hiding in modern Japanese.",
      sections: [
        { heading: "Why learn any 古文?", html:
          `<p>You'll never need to read <i>The Tale of Genji</i> to use Japanese — but <b>古文</b> (classical Japanese) isn't purely historical. Its grammar survives in proverbs, set phrases, song lyrics, formal writing, and many N1 patterns. A little recognition demystifies a lot.</p>` },
        { heading: "Key classical auxiliaries", html:
          `<p>Classical Japanese used a different set of helper verbs. The most common ones to recognize:</p>
           <table class="ex-table">
             <tr><td>なり</td><td>to be (= だ / である)</td></tr>
             <tr><td>けり</td><td>past / exclamatory ("…indeed")</td></tr>
             <tr><td>べし</td><td>should / must / will</td></tr>
             <tr><td>ず</td><td>not (= ない); survives as 〜ぬ / 〜ざる</td></tr>
             <tr><td>む / ん</td><td>will / intend (= 〜う/よう)</td></tr>
             <tr><td>ごとし</td><td>like / as (= ようだ)</td></tr>
           </table>` },
        { heading: "Classical forms hiding in modern Japanese", html:
          `<p>You already use fossilized 古文 without realizing it:</p>
           <ul>
             <li><b>〜ざるを得ない</b>, <b>〜べき</b>, <b>〜ぬ</b> (見え<b>ぬ</b> = 見えない), <b>〜ごとし</b> (光陰矢のごとし).</li>
             <li><b>〜ん</b> for volitional in set phrases: 言わ<b>ん</b>とする (= 言おうとする).</li>
             <li>我 (われ, "I"), 〜なり in old sayings.</li>
           </ul>
           <p>Recognizing these as "the classical version of X" makes literary N1 grammar click instead of feeling random.</p>` },
        { heading: "How it differs structurally", html:
          `<p>Two features mark a classical text at a glance:</p>
           <ul>
             <li><b>係り結び</b> (kakari-musubi) — particles ぞ・なむ・や・か trigger a special sentence-ending form, and こそ pairs with the 已然形. A grammatical "agreement" modern Japanese dropped.</li>
             <li><b>歴史的仮名遣い</b> — historical kana spelling (けふ read きょう, ゐ/ゑ characters).</li>
           </ul>
           <div class="lesson-key"><b>Goal: recognition, not fluency.</b> You don't need to parse classical texts — but knowing the common auxiliaries (べし, ず, なり, ごとし) turns opaque old phrases and stiff N1 grammar into something you can decode.</div>` },
      ],
      practice: [
        { label: "📖 Literary & Written Grammar", type: "study", sel: "n1gramliterary" },
        { label: "📖 All N1 Grammar", type: "study", sel: "n1gram" },
      ],
    },
    {
      id: "ceremonies", stage: "Advanced · N1", title: "Ceremonies, Speeches & Formal Occasions",
      summary: "The fixed phrases — and the taboo words — of weddings, funerals, and formal speeches.",
      sections: [
        { heading: "Congratulations & condolences", html:
          `<table class="ex-table">
             <tr><td>結婚式</td><td>おめでとうございます · 末永くお幸せに</td></tr>
             <tr><td>お葬式 / お通夜</td><td>ご愁傷様です · お悔やみ申し上げます</td></tr>
             <tr><td>出産 / 入学 / 卒業</td><td>おめでとうございます (+ the occasion)</td></tr>
           </table>
           <p>At a funeral you also hear ご冥福をお祈りします ("I pray for the repose of their soul").</p>` },
        { heading: "Giving a speech", html:
          `<p>Formal speeches (挨拶) open and close with set moves:</p>
           <ul>
             <li>本日はお忙しい中、お集まりいただき… — "thank you for gathering today despite your busy schedules…"</li>
             <li>僭越ながら、ひとことご挨拶を — "if I may presume, a few words…"</li>
             <li>乾杯の音頭 — leading the toast.</li>
           </ul>` },
        { heading: "おめでた言葉 — auspicious phrasing", html:
          `<p>Celebrations call for positive, forward-looking set phrases:</p>
           <ul>
             <li>末永くお幸せに — "may your happiness last forever" (weddings).</li>
             <li>ますますのご発展を — "wishing you ever-greater success" (business/openings).</li>
           </ul>` },
        { heading: "忌み言葉 — the words to avoid", html:
          `<p>This is the cultural minefield: certain words are <b>taboo</b> at certain events because they evoke the wrong thing.</p>
           <ul>
             <li><b>Weddings</b>: avoid 別れる, 切れる, 終わる, 帰る, repeated words (重ね重ね) — they hint at separation.</li>
             <li><b>Funerals</b>: avoid 重ね重ね / たびたび (repetition suggests recurrence) and overly direct words for death.</li>
           </ul>
           <div class="lesson-key"><b>Formal Japanese is as much about avoidance as the right phrase.</b> Knowing the おめでた言葉 to say — and the 忌み言葉 to never say — is a mark of genuine cultural fluency that even advanced learners often miss.</div>` },
      ],
      practice: [
        { label: "📖 N1 Formal & Literary Expression", type: "study", sel: "n1phrformal" },
        { label: "📖 Advanced Keigo", type: "study", sel: "n1keigoadvanced" },
        { label: "🎮 Play N1 Vocabulary", type: "game", game: "n1vocab" },
      ],
    },
    {
      id: "rhetoric", stage: "Advanced · N1", title: "Literary Devices & Rhetoric",
      summary: "Metaphor, irony, and reading between the lines — the craft behind N1 prose.",
      sections: [
        { heading: "Figures of speech", html:
          `<table class="ex-table">
             <tr><td>比喩 ひゆ</td><td>metaphor / simile (〜のような・〜のように)</td></tr>
             <tr><td>擬人法 ぎじんほう</td><td>personification (giving things human traits)</td></tr>
             <tr><td>誇張 こちょう</td><td>exaggeration / hyperbole</td></tr>
             <tr><td>対句 ついく</td><td>parallel, balanced phrasing</td></tr>
           </table>` },
        { heading: "Structure & emphasis", html:
          `<ul>
             <li><b>倒置</b> (tōchi) — inverting normal word order for impact.</li>
             <li><b>省略</b> (shōryaku) — leaving words out; the reader fills the gap.</li>
             <li><b>反復</b> (hanpuku) — repetition for rhythm or emphasis.</li>
             <li><b>体言止め</b> — ending a sentence on a noun (no verb) for a lingering effect.</li>
           </ul>` },
        { heading: "Irony & implication", html:
          `<ul>
             <li><b>反語</b> (hango) — a rhetorical question that means its opposite: そんなことがあるだろうか (= surely not).</li>
             <li><b>皮肉</b> (hiniku) — irony / sarcasm.</li>
             <li><b>行間を読む</b> — "read between the lines"; in Japanese prose, what's <i>left unsaid</i> often carries the meaning.</li>
           </ul>` },
        { heading: "Allusion & shifting register", html:
          `<p>Sophisticated writing leans on shared culture and tone:</p>
           <ul>
             <li>引用 (quotation) and allusions to classical works or proverbs.</li>
             <li>Deliberately shifting register — slipping into 古文 or plain speech mid-text — for characterization or effect.</li>
           </ul>
           <div class="lesson-key"><b>N1 reading is interpretation, not decoding.</b> Once the grammar is automatic, the real skill is catching 比喩, sensing 反語 and 皮肉, and 行間を読む — reading the meaning the author implied but never wrote.</div>` },
      ],
      practice: [
        { label: "📖 N1 Nuanced Communication", type: "study", sel: "n1phrnuanced" },
        { label: "📖 Literary & Written Grammar", type: "study", sel: "n1gramliterary" },
        { label: "🎮 Play N1 Vocabulary", type: "game", game: "n1vocab" },
      ],
    },
    {
      id: "n1-grammar", stage: "Advanced · N1", title: "N1 Grammar & What Comes Next",
      summary: "Literary and formal structures — and life after the path.",
      sections: [
        { heading: "Formal & literary grammar", html:
          `<p>N1 grammar is mostly <b>formal, written, and emphatic</b> set patterns — the language of speeches, editorials, and literature. Many feel stiff or archaic in conversation but are everywhere in serious text.</p>
           <table class="ex-table">
             <tr><td>〜をめぐって</td><td>o megutte</td><td>"concerning / surrounding (an issue)"</td></tr>
             <tr><td>〜ざるを得ない</td><td>zaru o enai</td><td>"have no choice but to"</td></tr>
             <tr><td>〜にあって</td><td>ni atte</td><td>"in (a situation/time)" (formal)</td></tr>
             <tr><td>〜きらいがある</td><td>kirai ga aru</td><td>"tends to (negative)"</td></tr>
           </table>` },
        { heading: "Reading is the real exam", html:
          `<p>N1 success rests less on memorizing patterns and more on <b>reading speed and inference</b> across dense, abstract passages. Train by reading widely and timing yourself — comprehension under pressure is the actual skill being measured.</p>` },
        { heading: "Keep going", html:
          `<div class="lesson-key"><b>The path doesn't end here.</b> Mix the decks into the game for speed, revisit weak spots via Past Results, set a daily reading habit, and find Japanese you genuinely love. Fluency is a direction, not a finish line.</div>
           <p>頑張って！ — you've come a long way.</p>` },
      ],
      practice: [
        { label: "📖 All N1 Grammar", type: "study", sel: "n1gram" },
        { label: "📖 Advanced structures", type: "study", sel: "n1gramadvanced" },
        { label: "📖 Literary & written grammar", type: "study", sel: "n1gramliterary" },
        { label: "📖 Advanced Keigo", type: "study", sel: "n1keigoadvanced" },
        { label: "🎮 Play N1 Vocabulary", type: "game", game: "n1vocab" },
      ],
    },
  ],

  // ---- Journey: each lesson is pinned to a real place, routed south→north,
  //      winding through every region of Japan from Okinawa to Hokkaidō. ----
  journey: [
    { id: "scripts",              place: "Hateruma Island",   pref: "Okinawa",   region: "Okinawa" },
    { id: "hiragana-basic",       place: "Ishigaki",          pref: "Okinawa",   region: "Okinawa" },
    { id: "hiragana-dakuten",     place: "Miyako Island",      pref: "Okinawa",   region: "Okinawa" },
    { id: "hiragana-yoon",        place: "Kerama Islands",      pref: "Okinawa",   region: "Okinawa" },
    { id: "kana-extras",          place: "Naha",               pref: "Okinawa",   region: "Okinawa" },
    { id: "katakana",             place: "Churaumi (Nago)",     pref: "Okinawa",   region: "Okinawa" },
    { id: "pronunciation",        place: "Amami Ōshima",        pref: "Kagoshima", region: "Kyūshū" },
    { id: "kanji-readings",       place: "Yakushima",           pref: "Kagoshima", region: "Kyūshū" },
    { id: "names-titles",         place: "Ibusuki",             pref: "Kagoshima", region: "Kyūshū" },
    { id: "rendaku",              place: "Sakurajima",          pref: "Kagoshima", region: "Kyūshū" },
    { id: "how-to-study",         place: "Kirishima",           pref: "Kagoshima", region: "Kyūshū" },
    { id: "pitch-accent",         place: "Miyazaki",            pref: "Miyazaki",  region: "Kyūshū" },
    { id: "n5-kanji",             place: "Aoshima (Nichinan)",  pref: "Miyazaki",  region: "Kyūshū" },
    { id: "n5-numbers",           place: "Kumamoto Castle",     pref: "Kumamoto",  region: "Kyūshū" },
    { id: "n5-vocab",             place: "Mount Aso",           pref: "Kumamoto",  region: "Kyūshū" },
    { id: "n5-particles",         place: "Nagasaki",            pref: "Nagasaki",  region: "Kyūshū" },
    { id: "n5-grammar",           place: "Sasebo",              pref: "Nagasaki",  region: "Kyūshū" },
    { id: "n5-phrases",           place: "Yoshinogari",         pref: "Saga",      region: "Kyūshū" },
    { id: "verb-groups",          place: "Fukuoka",             pref: "Fukuoka",   region: "Kyūshū" },
    { id: "adjectives",           place: "Dazaifu",             pref: "Fukuoka",   region: "Kyūshū" },
    { id: "kosoado",              place: "Kitakyūshū",          pref: "Fukuoka",   region: "Kyūshū" },
    { id: "counters",             place: "Beppu",               pref: "Ōita",      region: "Kyūshū" },
    { id: "time-dates",           place: "Yufuin",              pref: "Ōita",      region: "Kyūshū" },
    { id: "big-numbers",          place: "Usuki",               pref: "Ōita",      region: "Kyūshū" },
    { id: "comparisons",          place: "Kōchi",               pref: "Kōchi",     region: "Shikoku" },
    { id: "family-terms",         place: "Cape Ashizuri",       pref: "Kōchi",     region: "Shikoku" },
    { id: "adverbs",              place: "Dōgo Onsen (Matsuyama)", pref: "Ehime",  region: "Shikoku" },
    { id: "restaurant",           place: "Ōzu",                 pref: "Ehime",     region: "Shikoku" },
    { id: "shopping",             place: "Tokushima",           pref: "Tokushima", region: "Shikoku" },
    { id: "directions",           place: "Naruto Whirlpools",   pref: "Tokushima", region: "Shikoku" },
    { id: "weather",              place: "Takamatsu",           pref: "Kagawa",    region: "Shikoku" },
    { id: "food",                 place: "Kotohira",            pref: "Kagawa",    region: "Shikoku" },
    { id: "hobbies-routine",      place: "Kōraku-en (Okayama)", pref: "Okayama",   region: "Chūgoku" },
    { id: "n4-kanji",             place: "Kurashiki",           pref: "Okayama",   region: "Chūgoku" },
    { id: "n4-vocab",             place: "Hiroshima",           pref: "Hiroshima", region: "Chūgoku" },
    { id: "n4-teform",            place: "Miyajima",            pref: "Hiroshima", region: "Chūgoku" },
    { id: "n4-grammar",           place: "Onomichi",            pref: "Hiroshima", region: "Chūgoku" },
    { id: "giving-receiving",     place: "Iwakuni",             pref: "Yamaguchi", region: "Chūgoku" },
    { id: "transitivity",         place: "Hagi",                pref: "Yamaguchi", region: "Chūgoku" },
    { id: "potential-volitional", place: "Tottori Sand Dunes",  pref: "Tottori",   region: "Chūgoku" },
    { id: "quoting",              place: "Matsue",              pref: "Shimane",   region: "Chūgoku" },
    { id: "time-clauses",         place: "Izumo Taisha",        pref: "Shimane",   region: "Chūgoku" },
    { id: "permission-obligation",place: "Himeji Castle",       pref: "Hyōgo",     region: "Kansai" },
    { id: "doctor",               place: "Kobe",                pref: "Hyōgo",     region: "Kansai" },
    { id: "admin",                place: "Osaka",               pref: "Osaka",     region: "Kansai" },
    { id: "phone-emergency",      place: "Tōdai-ji (Nara)",     pref: "Nara",      region: "Kansai" },
    { id: "technology",           place: "Kyoto",               pref: "Kyoto",     region: "Kansai" },
    { id: "work-school",          place: "Arashiyama",          pref: "Kyoto",     region: "Kansai" },
    { id: "emotions",             place: "Uji",                 pref: "Kyoto",     region: "Kansai" },
    { id: "travel",               place: "Mount Kōya",          pref: "Wakayama",  region: "Kansai" },
    { id: "common-mistakes",      place: "Nachi Falls",         pref: "Wakayama",  region: "Kansai" },
    { id: "numbers-life",         place: "Ise Grand Shrine",    pref: "Mie",       region: "Kansai" },
    { id: "n3-kanji",             place: "Nagoya",              pref: "Aichi",     region: "Chūbu" },
    { id: "n3-vocab",             place: "Inuyama Castle",      pref: "Aichi",     region: "Chūbu" },
    { id: "n3-grammar",           place: "Shirakawa-gō",        pref: "Gifu",      region: "Chūbu" },
    { id: "keigo-levels",         place: "Takayama",            pref: "Gifu",      region: "Chūbu" },
    { id: "passive-causative",    place: "Kanazawa",            pref: "Ishikawa",  region: "Chūbu" },
    { id: "nominalization",       place: "Noto Peninsula",      pref: "Ishikawa",  region: "Chūbu" },
    { id: "onomatopoeia",         place: "Tateyama",            pref: "Toyama",    region: "Chūbu" },
    { id: "conjunctions",         place: "Eihei-ji",            pref: "Fukui",     region: "Chūbu" },
    { id: "reading-strategy",     place: "Matsumoto Castle",    pref: "Nagano",    region: "Chūbu" },
    { id: "dialects",             place: "Zenkō-ji (Nagano)",   pref: "Nagano",    region: "Chūbu" },
    { id: "nature",               place: "Kamikōchi (Japan Alps)", pref: "Nagano", region: "Chūbu" },
    { id: "particle-combos",      place: "Mount Fuji",          pref: "Yamanashi", region: "Chūbu" },
    { id: "relationships",        place: "Miho no Matsubara",   pref: "Shizuoka",  region: "Chūbu" },
    { id: "health",               place: "Hakone",              pref: "Kanagawa",  region: "Kantō" },
    { id: "n2-kanji",             place: "Yokohama",            pref: "Kanagawa",  region: "Kantō" },
    { id: "n2-vocab",             place: "Shinjuku (Tokyo)",    pref: "Tokyo",     region: "Kantō" },
    { id: "n2-grammar",           place: "Asakusa (Tokyo)",     pref: "Tokyo",     region: "Kantō" },
    { id: "written-style",        place: "Nikkō",               pref: "Tochigi",   region: "Kantō" },
    { id: "sentence-particles",   place: "Kusatsu Onsen",       pref: "Gunma",     region: "Kantō" },
    { id: "near-synonyms",        place: "Kairaku-en",          pref: "Ibaraki",   region: "Kantō" },
    { id: "formal-writing",       place: "Aizu-Wakamatsu",      pref: "Fukushima", region: "Tōhoku" },
    { id: "n1-kanji",             place: "Sendai",              pref: "Miyagi",    region: "Tōhoku" },
    { id: "n1-vocab",             place: "Matsushima",          pref: "Miyagi",    region: "Tōhoku" },
    { id: "casual-speech",        place: "Yamadera",            pref: "Yamagata",  region: "Tōhoku" },
    { id: "loanwords",            place: "Kakunodate",          pref: "Akita",     region: "Tōhoku" },
    { id: "aizuchi",              place: "Hiraizumi",           pref: "Iwate",     region: "Tōhoku" },
    { id: "proverbs",             place: "Hirosaki",            pref: "Aomori",    region: "Tōhoku" },
    { id: "academic-vocab",       place: "Hakodate",            pref: "Hokkaidō",  region: "Hokkaidō" },
    { id: "reading-genres",       place: "Sapporo",             pref: "Hokkaidō",  region: "Hokkaidō" },
    { id: "advanced-kanji",       place: "Otaru",               pref: "Hokkaidō",  region: "Hokkaidō" },
    { id: "classical-grammar",    place: "Furano",              pref: "Hokkaidō",  region: "Hokkaidō" },
    { id: "n1-grammar",           place: "Cape Sōya (Wakkanai)", pref: "Hokkaidō", region: "Hokkaidō" },
    { id: "home-objects",         place: "Karatsu",             pref: "Saga",      region: "Kyūshū" },
    { id: "conditionals",         place: "Shimonoseki",         pref: "Yamaguchi", region: "Chūgoku" },
    { id: "leisure",              place: "Lake Biwa (Ōtsu)",    pref: "Shiga",     region: "Kansai" },
    { id: "certainty",            place: "Niigata",             pref: "Niigata",   region: "Chūbu" },
    { id: "news",                 place: "Chiba",               pref: "Chiba",     region: "Kantō" },
    { id: "greetings-intro",      place: "Uwajima",             pref: "Ehime",     region: "Shikoku" },
    { id: "colors",               place: "Tsuwano",             pref: "Shimane",   region: "Chūgoku" },
    { id: "change-becoming",      place: "Wakayama",            pref: "Wakayama",  region: "Kansai" },
    { id: "cause-reason",         place: "Karuizawa",           pref: "Nagano",    region: "Chūbu" },
    { id: "idioms",               place: "Sakata",              pref: "Yamagata",  region: "Tōhoku" },
    { id: "annual-events",        place: "Takachiho",           pref: "Miyazaki",  region: "Kyūshū" },
    { id: "clarifying",           place: "Bizen",               pref: "Okayama",   region: "Chūgoku" },
    { id: "apolog-thanks",        place: "Kishiwada",           pref: "Osaka",     region: "Kansai" },
    { id: "opinions",             place: "Kōfu",                pref: "Yamanashi", region: "Chūbu" },
    { id: "science-tech",         place: "Tsukuba",             pref: "Ibaraki",   region: "Kantō" },
    { id: "music-pop",            place: "Takarazuka",          pref: "Hyōgo",     region: "Kansai" },
    { id: "eating-out",           place: "Toyohashi",           pref: "Aichi",     region: "Chūbu" },
    { id: "hypotheticals",        place: "Himi",                pref: "Toyama",    region: "Chūbu" },
    { id: "business",             place: "Hamamatsu",           pref: "Shizuoka",  region: "Chūbu" },
    { id: "ceremonies",           place: "Obihiro",             pref: "Hokkaidō",  region: "Hokkaidō" },
    { id: "transportation",       place: "Toyota",              pref: "Aichi",     region: "Chūbu" },
    { id: "how-to",               place: "Seki",                pref: "Gifu",      region: "Chūbu" },
    { id: "quantity",             place: "Kawagoe",             pref: "Saitama",   region: "Kantō" },
    { id: "service-keigo",        place: "Hachinohe",           pref: "Aomori",    region: "Tōhoku" },
    { id: "rhetoric",             place: "Kushiro",             pref: "Hokkaidō",  region: "Hokkaidō" },
  ],
};

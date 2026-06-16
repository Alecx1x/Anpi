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
      id: "long-sounds", stage: "Foundations", title: "Long Vowels, っ & ん: The Beats of Japanese",
      summary: "Three sounds that each take a full beat — and change a word's meaning if you miss them.",
      sections: [
        { heading: "Long vowels (ちょうおん)", html:
          `<p>Holding a vowel for an extra beat makes a different word:</p>
           <table class="ex-table">
             <tr><td>おば<b>さん</b> / おば<b>あ</b>さん</td><td>aunt / grandmother</td></tr>
             <tr><td>ゆき / ゆ<b>う</b>き</td><td>snow / courage</td></tr>
           </table>
           <p>Hiragana writes long お mostly with う (がっこ<b>う</b>); katakana uses a bar ー (コーヒー).</p>` },
        { heading: "Small っ — the held consonant (そくおん)", html:
          `<table class="ex-table">
             <tr><td>きて / き<b>っ</b>て</td><td>come / stamp</td></tr>
             <tr><td>かこ / か<b>っ</b>こ</td><td>past / parentheses</td></tr>
           </table>
           <p>Romaji doubles the next consonant: ki<b>tt</b>e. There's a tiny pause where the small っ sits.</p>` },
        { heading: "ん — the moraic n (はつおん)", html:
          `<p>ん is its own beat, and its sound shifts with what follows (n / m / ng):</p>
           <table class="ex-table">
             <tr><td>しんぶん</td><td>shi-n-bu-n (4 beats)</td></tr>
             <tr><td>こんにちは</td><td>ko-n-ni-chi-wa</td></tr>
           </table>
           <div class="lesson-key"><b>Rhythm beats stress:</b> long vowels, っ, and ん each count as one mora. Japanese keeps an even beat per mora — get the beats right and you'll be understood even with a flat tone.</div>` },
      ],
      practice: [
        { label: "📖 Study Hiragana", type: "study", sel: "hiragana" },
        { label: "📖 Study Katakana", type: "study", sel: "katakana" },
        { label: "🎮 Play the Hiragana game", type: "game", game: "hiragana" },
      ],
    },
    {
      id: "reading-quirks", stage: "Foundations", title: "Reading Quirks: は・へ・を",
      summary: "Three kana that change how they sound the moment they act as particles.",
      sections: [
        { heading: "Particles break the rule", html:
          `<p>As <b>particles</b>, these three are read differently from their normal sound:</p>
           <table class="ex-table">
             <tr><td>は → <b>wa</b></td><td>これ<b>は</b> (kore wa) = as for this</td></tr>
             <tr><td>へ → <b>e</b></td><td>がっこう<b>へ</b> (gakkō e) = to school</td></tr>
             <tr><td>を → <b>o</b></td><td>ほん<b>を</b> (hon o) = (object) book</td></tr>
           </table>` },
        { heading: "Inside words they're normal", html:
          `<table class="ex-table">
             <tr><td>はな = ha-na (flower)</td><td>は here is "ha"</td></tr>
             <tr><td>へや = he-ya (room)</td><td>へ here is "he"</td></tr>
           </table>
           <p>を is special: it appears almost only as the object particle, so you'll nearly always read it "o".</p>` },
        { heading: "Read by role", html:
          `<div class="lesson-key"><b>Rule of thumb:</b> は and へ shift to wa / e only when they're doing a particle's job (marking topic or direction). Spot the particle, switch the sound.</div>` },
      ],
      practice: [
        { label: "📖 Study Hiragana", type: "study", sel: "hiragana" },
        { label: "🎮 Play the Hiragana game", type: "game", game: "hiragana" },
      ],
    },
    {
      id: "stroke-order", stage: "Foundations", title: "Stroke Order & Handwriting",
      summary: "A few simple rules give every character a consistent, legible shape.",
      sections: [
        { heading: "Why order matters", html:
          `<p>Following stroke order makes your writing legible and balanced, and it's how characters are taught, looked up, and recognized. Even if you mostly type, writing a little cements the shapes.</p>` },
        { heading: "The core rules", html:
          `<table class="ex-table">
             <tr><td>Top → bottom, left → right</td><td>三、川</td></tr>
             <tr><td>Horizontal before a crossing vertical</td><td>十 (ー then ｜)</td></tr>
             <tr><td>Outside before inside</td><td>国、回</td></tr>
             <tr><td>Center before symmetric wings</td><td>小、水</td></tr>
             <tr><td>Closing/enclosing stroke last</td><td>国 (the box shuts last)</td></tr>
           </table>` },
        { heading: "Kana follow the same logic", html:
          `<p>あ、き、な and friends each have a set order built from these same principles — generally top-to-bottom, left-to-right.</p>
           <div class="lesson-key"><b>Tip:</b> trace each kana a few times by hand as you learn it. Handwriting engages memory far more than tapping alone, and it makes look-alikes (シ/ツ, ソ/ン) click.</div>` },
      ],
      practice: [
        { label: "📖 Study Hiragana", type: "study", sel: "hiragana" },
        { label: "📖 Study Katakana", type: "study", sel: "katakana" },
        { label: "🎮 Play the Katakana game", type: "game", game: "katakana" },
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
      id: "question-words", stage: "Beginner · N5", title: "Question Words: だれ・なに・どこ・いつ",
      summary: "The handful of words that turn any sentence into a question — who, what, where, when, why, how.",
      sections: [
        { heading: "The core question words", html:
          `<table class="ex-table">
             <tr><td>だれ</td><td>who</td><td>polite: どなた</td></tr>
             <tr><td>なに／なん</td><td>what</td><td></td></tr>
             <tr><td>どこ</td><td>where</td><td>polite: どちら</td></tr>
             <tr><td>いつ</td><td>when</td><td></td></tr>
             <tr><td>どうして／なぜ</td><td>why</td><td>なぜ is more written</td></tr>
             <tr><td>どう</td><td>how</td><td></td></tr>
             <tr><td>いくら</td><td>how much (price)</td><td></td></tr>
             <tr><td>いくつ</td><td>how many / how old</td><td></td></tr>
           </table>
           <p>どれ・どの・どんな ("which / what kind") come from the こそあど grid.</p>` },
        { heading: "How to ask", html:
          `<p>Keep the word order of a normal statement, drop the question word where the answer would go, and add か:</p>
           <table class="ex-table">
             <tr><td>これは なん ですか。</td><td>What is this?</td></tr>
             <tr><td>だれが きましたか。</td><td>Who came?</td></tr>
             <tr><td>どこで たべますか。</td><td>Where will you eat?</td></tr>
             <tr><td>いつ いきますか。</td><td>When will you go?</td></tr>
           </table>
           <p>The particle stays glued to the question word: だれ<b>が</b>、どこ<b>で</b>、なに<b>を</b>.</p>` },
        { heading: "なに vs なん", html:
          `<p>The same kanji 何 is read <b>なん</b> before t/d/n sounds, counters, and です — and <b>なに</b> elsewhere:</p>
           <table class="ex-table">
             <tr><td>なん ですか・なん の・なん にん</td><td>before t/d/n, counters, です</td></tr>
             <tr><td>なに を・なに が・なに も</td><td>elsewhere</td></tr>
           </table>
           <div class="lesson-key"><b>Tip:</b> answer with the same particle the question word carried — Q: だれが？ → A: 田中さんが。</div>` },
      ],
      practice: [
        { label: "📖 Question patterns", type: "study", sel: "n5gramq" },
        { label: "📖 Particles", type: "study", sel: "n5particles" },
        { label: "🎮 Play N5 Vocabulary", type: "game", game: "n5vocab" },
      ],
    },
    {
      id: "existence", stage: "Beginner · N5", title: "There is / There are: ある & いる",
      summary: "Two verbs for existence — one for living things, one for everything else — and how to say where something is.",
      sections: [
        { heading: "いる for living, ある for the rest", html:
          `<p>To say something exists or is somewhere, Japanese picks the verb by whether the thing is alive and can move:</p>
           <table class="ex-table">
             <tr><td><b>いる</b></td><td>people &amp; animals</td><td>ねこ が いる = there's a cat</td></tr>
             <tr><td><b>ある</b></td><td>objects, plants, events</td><td>ほん が ある = there's a book</td></tr>
           </table>
           <p>Polite: います／あります. Negative: いません／ありません.</p>` },
        { heading: "Saying where", html:
          `<p>Two word orders, same meaning. Use に for the location and が for the thing:</p>
           <table class="ex-table">
             <tr><td>つくえの うえ に ねこ が います。</td><td>There's a cat on the desk.</td></tr>
             <tr><td>えき は どこ に ありますか。</td><td>Where is the station?</td></tr>
           </table>` },
        { heading: "Position words", html:
          `<table class="ex-table">
             <tr><td>うえ／した</td><td>above / below</td></tr>
             <tr><td>なか／そと</td><td>inside / outside</td></tr>
             <tr><td>まえ／うしろ</td><td>front / behind</td></tr>
             <tr><td>となり／ちかく／あいだ</td><td>next to / near / between</td></tr>
           </table>
           <div class="lesson-key"><b>Note:</b> ある also means "to have (an event)": あした テスト が ある = I have a test tomorrow.</div>` },
      ],
      practice: [
        { label: "📖 Sentence structure", type: "study", sel: "n5gramstruct" },
        { label: "📖 Particles", type: "study", sel: "n5particles" },
        { label: "🎮 Play N5 Vocabulary", type: "game", game: "n5vocab" },
      ],
    },
    {
      id: "wants-invites", stage: "Beginner · N5", title: "Wants & Invitations: 〜たい・〜ませんか",
      summary: "Say what you want to do, and invite someone to do something with you.",
      sections: [
        { heading: "〜たい — want to do", html:
          `<p>Take the polite stem (the ます form minus ます) and add たい:</p>
           <table class="ex-table">
             <tr><td>たべます → たべ<b>たい</b></td><td>want to eat</td></tr>
             <tr><td>いきます → いき<b>たい</b></td><td>want to go</td></tr>
           </table>
           <p>〜たい then behaves like an い-adjective: たく<b>ない</b> (don't want), た<b>かった</b> (wanted). The object may take が or を: みず<b>が</b>のみたい.</p>` },
        { heading: "Inviting: 〜ませんか / 〜ましょう", html:
          `<table class="ex-table">
             <tr><td>〜ませんか</td><td>won't you…? (soft invite)</td><td>いきませんか</td></tr>
             <tr><td>〜ましょう</td><td>let's…!</td><td>たべましょう</td></tr>
             <tr><td>〜ましょうか</td><td>shall I / we…?</td><td>てつだいましょうか</td></tr>
           </table>
           <p>〜ませんか is gentle — it leaves room to say no. 〜ましょう assumes you both agree.</p>` },
        { heading: "Watch out", html:
          `<div class="lesson-key"><b>Tip:</b> avoid asking a superior 〜たいですか ("do you want to…?") — it can sound nosy. Offer with 〜ませんか instead. To talk about what <i>someone else</i> wants, use 〜たがる: かれは いきたがっている.</div>` },
      ],
      practice: [
        { label: "📖 All N5 Grammar", type: "study", sel: "n5gramall" },
        { label: "📖 Greetings & set phrases", type: "study", sel: "n5greetings" },
        { label: "🎮 Play N5 Vocabulary", type: "game", game: "n5vocab" },
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
      id: "te-form", stage: "Beginner · N5", title: "Making the て-Form",
      summary: "The single most useful verb form — and the sound-change rules for building it from each verb group.",
      sections: [
        { heading: "Why the て-form matters", html:
          `<p>The て-form is the gateway to dozens of patterns: requests (〜てください), the progressive (〜ている), permission (〜てもいい), linking actions, and more. Learn to build it and the rest of N5/N4 grammar opens up.</p>` },
        { heading: "る-verbs &amp; irregulars (easy)", html:
          `<table class="ex-table">
             <tr><td>る-verb: drop る + て</td><td>たべる → たべ<b>て</b>、みる → み<b>て</b></td></tr>
             <tr><td>する</td><td>→ し<b>て</b></td></tr>
             <tr><td>くる</td><td>→ き<b>て</b></td></tr>
           </table>` },
        { heading: "う-verbs: the sound-change groups", html:
          `<p>Group the う-verb by its final kana:</p>
           <table class="ex-table">
             <tr><td>う・つ・る</td><td>→ って</td><td>かう → かって、まつ → まって</td></tr>
             <tr><td>む・ぶ・ぬ</td><td>→ んで</td><td>のむ → のんで、あそぶ → あそんで</td></tr>
             <tr><td>く</td><td>→ いて</td><td>かく → かいて</td></tr>
             <tr><td>ぐ</td><td>→ いで</td><td>およぐ → およいで</td></tr>
             <tr><td>す</td><td>→ して</td><td>はなす → はなして</td></tr>
           </table>
           <div class="lesson-key"><b>The one exception:</b> いく → い<b>って</b> (not いいて). A handy memory tune: "うつる → って, むぶぬ → んで, く → いて, ぐ → いで, す → して".</div>` },
      ],
      practice: [
        { label: "📖 All N5 Grammar", type: "study", sel: "n5gramall" },
        { label: "📖 う-verbs (godan)", type: "study", sel: "n5godan" },
        { label: "📖 る-verbs (ichidan)", type: "study", sel: "n5ichidan" },
        { label: "🎮 Play N5 Vocabulary", type: "game", game: "n5vocab" },
      ],
    },
    {
      id: "because-kara", stage: "Beginner · N5", title: "Giving Reasons: 〜から",
      summary: "State a reason and its result in one sentence with から (because).",
      sections: [
        { heading: "Reason + から", html:
          `<p>Put から after the reason clause; the result follows. から attaches to the plain or polite form:</p>
           <table class="ex-table">
             <tr><td>さむい <b>から</b>、まど を しめます。</td><td>It's cold, so I'll close the window.</td></tr>
             <tr><td>じかん が ない <b>から</b>、いそぎましょう。</td><td>We have no time, so let's hurry.</td></tr>
           </table>
           <p>Order is reason → から → result, the reverse of casual English "I'll close it because it's cold".</p>` },
        { heading: "Answering なぜ / どうして", html:
          `<p>To answer a "why?" you can lead with the reason and end the sentence with から:</p>
           <table class="ex-table">
             <tr><td>どうして きませんでしたか。</td><td>Why didn't you come?</td></tr>
             <tr><td>いそがしかった <b>から</b>です。</td><td>Because I was busy.</td></tr>
           </table>` },
        { heading: "A note on tone", html:
          `<div class="lesson-key"><b>Heads up:</b> から gives <i>your</i> reason and can sound a little assertive. The softer 〜ので (N4) is preferred when making excuses or being polite — but から is the right first tool at N5.</div>` },
      ],
      practice: [
        { label: "📖 Sentence structure", type: "study", sel: "n5gramstruct" },
        { label: "📖 All N5 Grammar", type: "study", sel: "n5gramall" },
        { label: "🎮 Play N5 Vocabulary", type: "game", game: "n5vocab" },
      ],
    },
    {
      id: "final-particles", stage: "Beginner · N5", title: "Sentence-Final Particles: ね・よ・か",
      summary: "The little words at the end of a sentence that carry tone — agreement, new info, and questions.",
      sections: [
        { heading: "The big three", html:
          `<table class="ex-table">
             <tr><td>か</td><td>makes a question</td><td>いきますか。 = Are you going?</td></tr>
             <tr><td>ね</td><td>seeking agreement / "right?"</td><td>いい てんき です<b>ね</b>。 = Nice weather, isn't it?</td></tr>
             <tr><td>よ</td><td>telling new info / emphasis</td><td>あした やすみ です<b>よ</b>。 = It's a day off tomorrow (you may not know).</td></tr>
           </table>` },
        { heading: "ね vs よ", html:
          `<p>Use <b>ね</b> when you expect the listener already agrees; use <b>よ</b> when you're giving them something they don't know. Combined <b>よね</b> = "…right? (I think so but checking)".</p>
           <table class="ex-table">
             <tr><td>おいしい です<b>ね</b>。</td><td>(we both taste it) Delicious, right?</td></tr>
             <tr><td>これ、おいしい です<b>よ</b>。</td><td>(recommending) This is delicious, you know.</td></tr>
           </table>` },
        { heading: "Don't overdo よ", html:
          `<div class="lesson-key"><b>Tip:</b> よ adds force — overusing it with strangers or superiors can sound pushy. When in doubt, plain です／ます or a soft ね is safer.</div>` },
      ],
      practice: [
        { label: "📖 Particles", type: "study", sel: "n5particles" },
        { label: "📖 All N5 Grammar", type: "study", sel: "n5gramall" },
        { label: "🎮 Play N5 Vocabulary", type: "game", game: "n5vocab" },
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
      id: "frequency", stage: "Beginner · N5", title: "Frequency & Degree: よく・ときどき・あまり",
      summary: "Adverbs that say how often or how much — including the ones that force a negative verb.",
      sections: [
        { heading: "How often", html:
          `<table class="ex-table">
             <tr><td>いつも</td><td>always</td></tr>
             <tr><td>よく</td><td>often</td></tr>
             <tr><td>ときどき</td><td>sometimes</td></tr>
             <tr><td>あまり〜ない</td><td>not often</td></tr>
             <tr><td>ぜんぜん〜ない</td><td>never / not at all</td></tr>
           </table>
           <p><b>あまり</b> and <b>ぜんぜん</b> require a negative verb: あまり たべません = I don't eat much.</p>` },
        { heading: "How much (degree)", html:
          `<table class="ex-table">
             <tr><td>とても／すごく</td><td>very</td></tr>
             <tr><td>ちょっと／すこし</td><td>a little</td></tr>
             <tr><td>たくさん</td><td>a lot</td></tr>
             <tr><td>もっと</td><td>more</td></tr>
             <tr><td>あまり〜ない</td><td>not very</td></tr>
           </table>` },
        { heading: "Where they go", html:
          `<p>An adverb sits right before the verb or adjective it modifies:</p>
           <table class="ex-table">
             <tr><td>まいにち よく あるきます。</td><td>I walk a lot every day.</td></tr>
             <tr><td>この えいが は とても おもしろい。</td><td>This movie is very interesting.</td></tr>
           </table>
           <div class="lesson-key"><b>Test tip:</b> casual speech is starting to use ぜんぜん positively (ぜんぜん大丈夫), but for the JLPT keep ぜんぜん with a negative.</div>` },
      ],
      practice: [
        { label: "📖 Adverbs", type: "study", sel: "n5adverbs" },
        { label: "📖 Negative forms", type: "study", sel: "n5gramneg" },
        { label: "🎮 Play N5 Vocabulary", type: "game", game: "n5vocab" },
      ],
    },
    {
      id: "requests", stage: "Beginner · N5", title: "Requests: 〜てください・〜ないでください",
      summary: "Ask someone politely to do — or not do — something, using the て-form.",
      sections: [
        { heading: "〜てください — please do", html:
          `<p>Add ください to the て-form of a verb:</p>
           <table class="ex-table">
             <tr><td>みる → みて</td><td>みて<b>ください</b> = please look</td></tr>
             <tr><td>まつ → まって</td><td>まって<b>ください</b> = please wait</td></tr>
             <tr><td>よむ → よんで</td><td>よんで<b>ください</b> = please read</td></tr>
           </table>
           <p>Casually, drop ください and just use the て-form: みて = "look".</p>` },
        { heading: "〜ないでください — please don't", html:
          `<p>Add でください to the ない-form:</p>
           <table class="ex-table">
             <tr><td>たべる → たべない</td><td>たべない<b>でください</b> = please don't eat</td></tr>
             <tr><td>はいる → はいらない</td><td>はいらない<b>でください</b> = please don't enter</td></tr>
           </table>` },
        { heading: "Levels of politeness", html:
          `<table class="ex-table">
             <tr><td>〜て</td><td>casual</td></tr>
             <tr><td>〜てください</td><td>standard polite</td></tr>
             <tr><td>〜ていただけますか</td><td>very polite (a favor)</td></tr>
           </table>
           <div class="lesson-key"><b>For things, not actions:</b> to ask for an object, use noun + を ください — みず を ください = water, please.</div>` },
      ],
      practice: [
        { label: "📖 All N5 Grammar", type: "study", sel: "n5gramall" },
        { label: "📖 Greetings & set phrases", type: "study", sel: "n5greetings" },
        { label: "🎮 Play N5 Vocabulary", type: "game", game: "n5vocab" },
      ],
    },
    {
      id: "body-health", stage: "Beginner · N5", title: "The Body, Health & How You Feel",
      summary: "Body-part words and the phrases for saying something hurts or you feel unwell.",
      sections: [
        { heading: "Parts of the body", html:
          `<table class="ex-table">
             <tr><td>あたま / かお / め</td><td>head / face / eye</td></tr>
             <tr><td>みみ / はな / くち</td><td>ear / nose / mouth</td></tr>
             <tr><td>て / あし / ゆび</td><td>hand / leg・foot / finger</td></tr>
             <tr><td>おなか / せなか / のど</td><td>stomach / back / throat</td></tr>
           </table>` },
        { heading: "Saying it hurts", html:
          `<p>Pattern: body-part が いたい (= ___ hurts):</p>
           <table class="ex-table">
             <tr><td>あたま が いたい です。</td><td>I have a headache.</td></tr>
             <tr><td>おなか が いたい。</td><td>My stomach hurts.</td></tr>
           </table>
           <table class="ex-table">
             <tr><td>ねつ が ある</td><td>have a fever</td></tr>
             <tr><td>かぜ を ひく</td><td>catch a cold</td></tr>
             <tr><td>つかれた</td><td>(I'm) tired</td></tr>
             <tr><td>きぶん が わるい</td><td>feel sick / unwell</td></tr>
           </table>` },
        { heading: "Caring phrases", html:
          `<div class="lesson-key"><b>Handy:</b> だいじょうぶ ですか？ = "Are you OK?" · おだいじに = "Take care / get well soon" (said to someone who's unwell).</div>` },
      ],
      practice: [
        { label: "📖 Core N5 Vocabulary", type: "study", sel: "n5vocab" },
        { label: "📖 N5 Nouns", type: "study", sel: "n5nouns" },
        { label: "🎮 Play N5 Vocabulary", type: "game", game: "n5vocab" },
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
      id: "permission-n5", stage: "Beginner · N5", title: "Permission & Prohibition: 〜てもいい・〜てはいけない",
      summary: "Ask if you may do something, give the go-ahead, and say what's not allowed — all from the て-form.",
      sections: [
        { heading: "〜てもいい — may / it's OK to", html:
          `<p>て-form + もいいです asks for or grants permission:</p>
           <table class="ex-table">
             <tr><td>ここ に すわっ<b>てもいいですか</b>。</td><td>May I sit here?</td></tr>
             <tr><td>しゃしん を とっ<b>てもいいです</b>。</td><td>You may take photos.</td></tr>
           </table>
           <p>Even softer: 〜てもかまいません = "I don't mind if you…".</p>` },
        { heading: "〜てはいけない — must not", html:
          `<p>て-form + はいけません forbids something:</p>
           <table class="ex-table">
             <tr><td>ここ で たばこ を すっ<b>てはいけません</b>。</td><td>You must not smoke here.</td></tr>
             <tr><td>(casual) はいっ<b>ちゃだめ</b>。</td><td>Don't go in.</td></tr>
           </table>` },
        { heading: "Answering a permission question", html:
          `<table class="ex-table">
             <tr><td>はい、いいです / どうぞ。</td><td>Yes, go ahead.</td></tr>
             <tr><td>すみません、ちょっと…</td><td>Sorry, that's a bit… (a soft "no")</td></tr>
           </table>
           <div class="lesson-key"><b>Tip:</b> a flat いけません can sound harsh; in real life Japanese often softens a refusal to ちょっと… and trails off.</div>` },
      ],
      practice: [
        { label: "📖 All N5 Grammar", type: "study", sel: "n5gramall" },
        { label: "📖 Sentence structure", type: "study", sel: "n5gramstruct" },
        { label: "🎮 Play N5 Vocabulary", type: "game", game: "n5vocab" },
      ],
    },
    {
      id: "time-duration", stage: "Beginner · N5", title: "Time & Duration: 〜じかん・〜かん・〜に〜かい",
      summary: "Say how long something takes and how often it happens — durations and frequency.",
      sections: [
        { heading: "How long: duration counters", html:
          `<p>Add 〜かん to a time span to mean "for that long":</p>
           <table class="ex-table">
             <tr><td>いちじ<b>かん</b></td><td>one hour (one o'clock = いちじ)</td></tr>
             <tr><td>みっか<b>かん</b> / いっしゅう<b>かん</b></td><td>for 3 days / for a week</td></tr>
             <tr><td>にねん<b>かん</b></td><td>for two years</td></tr>
           </table>
           <p>ぷん (minutes) and 〜じかん (hours) usually stand alone: 三十ぷん, 二じかん.</p>` },
        { heading: "How often: 〜に〜かい", html:
          `<p>Pattern: time period + に + number + かい (times):</p>
           <table class="ex-table">
             <tr><td>いっしゅうかん <b>に さんかい</b></td><td>three times a week</td></tr>
             <tr><td>いちにち <b>に いっかい</b></td><td>once a day</td></tr>
           </table>` },
        { heading: "Useful time adverbs", html:
          `<table class="ex-table">
             <tr><td>まいにち / まいしゅう / まいつき</td><td>every day / week / month</td></tr>
             <tr><td>〜ごろ</td><td>around (a time): 三じ<b>ごろ</b></td></tr>
             <tr><td>〜ぐらい / 〜くらい</td><td>about (a quantity/duration)</td></tr>
           </table>
           <div class="lesson-key"><b>Don't mix them up:</b> ごろ is for points in time (around 3:00); ぐらい is for amounts/durations (about 3 hours, about 10 people).</div>` },
      ],
      practice: [
        { label: "📖 Time & dates", type: "study", sel: "n5datetime" },
        { label: "📖 Counters", type: "study", sel: "n5counters" },
        { label: "🎮 Play N5 Vocabulary", type: "game", game: "n5vocab" },
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
      id: "mo-demo", stage: "Beginner · N5", title: "も & でも: Too / Even / Any",
      summary: "The particle も for 'also' and 'not any', plus でも for '…or something' and 'even'.",
      sections: [
        { heading: "も — also / too", html:
          `<table class="ex-table">
             <tr><td>わたし<b>も</b> がくせい です。</td><td>I'm a student too. (も replaces は/が)</td></tr>
             <tr><td>コーヒー<b>も</b> おちゃ<b>も</b> すき。</td><td>I like both coffee and tea.</td></tr>
           </table>` },
        { heading: "Question word + も — (not) any", html:
          `<table class="ex-table">
             <tr><td>なに<b>も</b> ない。</td><td>There's nothing.</td></tr>
             <tr><td>だれ<b>も</b> いない。</td><td>There's no one.</td></tr>
             <tr><td>どこ<b>へも</b> いかない。</td><td>I'm not going anywhere.</td></tr>
           </table>
           <p>This sense needs a negative verb.</p>` },
        { heading: "でも — …or something / even", html:
          `<table class="ex-table">
             <tr><td>おちゃ<b>でも</b> のみませんか。</td><td>Shall we have tea or something?</td></tr>
             <tr><td>こども<b>でも</b> できる。</td><td>Even a child can do it.</td></tr>
           </table>
           <div class="lesson-key"><b>Tip:</b> も attached to a question word + negative = "not any"; でも after a noun softens a suggestion ("…or the like") or means "even".</div>` },
      ],
      practice: [
        { label: "📖 Particles", type: "study", sel: "n5particles" },
        { label: "📖 All N5 Grammar", type: "study", sel: "n5gramall" },
        { label: "🎮 Play N5 Vocabulary", type: "game", game: "n5vocab" },
      ],
    },
    {
      id: "mou-mada", stage: "Beginner · N5", title: "もう & まだ: Already / Still / Not Yet",
      summary: "Two small adverbs that pin an action to its timeline — done, ongoing, or yet to come.",
      sections: [
        { heading: "もう — already / not anymore", html:
          `<table class="ex-table">
             <tr><td><b>もう</b> たべました。</td><td>I already ate.</td></tr>
             <tr><td><b>もう</b> ありません。</td><td>There's no more.</td></tr>
           </table>` },
        { heading: "まだ — still / not yet", html:
          `<table class="ex-table">
             <tr><td><b>まだ</b> たべています。</td><td>I'm still eating.</td></tr>
             <tr><td>「もう たべた？」「いいえ、<b>まだ</b> です。」</td><td>"Eaten yet?" "No, not yet."</td></tr>
           </table>` },
        { heading: "The four combinations", html:
          `<table class="ex-table">
             <tr><td>もう〜た</td><td>already did</td></tr>
             <tr><td>まだ〜ていない</td><td>haven't yet</td></tr>
             <tr><td>まだ〜ている</td><td>still doing</td></tr>
             <tr><td>もう〜ない</td><td>not anymore</td></tr>
           </table>
           <div class="lesson-key"><b>Note:</b> "not yet" is まだ〜<b>ていない</b> (まだ食べていない), never まだ〜なかった.</div>` },
      ],
      practice: [
        { label: "📖 All N5 Grammar", type: "study", sel: "n5gramall" },
        { label: "📖 Adverbs", type: "study", sel: "n5adverbs" },
        { label: "🎮 Play N5 Vocabulary", type: "game", game: "n5vocab" },
      ],
    },
    {
      id: "likes-abilities", stage: "Beginner · N5", title: "Likes & Abilities: 〜のが好き・〜ことができる",
      summary: "Turn a verb into a noun so you can say you like doing it — and that you can do it.",
      sections: [
        { heading: "〜のが好き / 上手 / 下手", html:
          `<p>Add の to a dictionary-form verb to make it a noun, then mark it with が:</p>
           <table class="ex-table">
             <tr><td>およぐ<b>のが</b> すき です。</td><td>I like swimming.</td></tr>
             <tr><td>りょうりする<b>のが</b> じょうず。</td><td>(They're) good at cooking.</td></tr>
           </table>` },
        { heading: "〜ことができる — can / be able to", html:
          `<table class="ex-table">
             <tr><td>にほんご を はなす<b>ことができる</b>。</td><td>I can speak Japanese.</td></tr>
             <tr><td>ピアノ<b>が できる</b>。</td><td>I can play piano. (noun + ができる)</td></tr>
           </table>` },
        { heading: "Two ways to say it", html:
          `<div class="lesson-key"><b>Shortcut:</b> 〜ことができる is the textbook form; the potential verb (はなす → はなせる) means the same and is far more common in speech. Learn both.</div>` },
      ],
      practice: [
        { label: "📖 All N5 Grammar", type: "study", sel: "n5gramall" },
        { label: "📖 Sentence structure", type: "study", sel: "n5gramstruct" },
        { label: "🎮 Play N5 Vocabulary", type: "game", game: "n5vocab" },
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
      id: "appearance-sou", stage: "Elementary · N4", title: "Looks & Hearsay: 〜そう",
      summary: "One little そう with two jobs — 'looks like' from what you see, and 'I hear that' from what you're told.",
      sections: [
        { heading: "〜そう = looks like (from appearance)", html:
          `<p>Attach そう to a verb stem or an adjective root to say something seems a certain way, judging by what you observe:</p>
           <table class="ex-table">
             <tr><td>おいしい → おいし<b>そう</b></td><td>looks delicious</td></tr>
             <tr><td>ふります → ふり<b>そう</b></td><td>looks like it'll rain</td></tr>
           </table>
           <p>It then works like a な-adjective: おいし<b>そうな</b>ケーキ、げんき<b>そうに</b>. Irregulars: いい → <b>よさそう</b>、ない → <b>なさそう</b>.</p>` },
        { heading: "〜そうだ = I hear that (hearsay)", html:
          `<p>Attach そうだ to the <b>plain form</b> to relay what you heard or read. This form does not conjugate:</p>
           <table class="ex-table">
             <tr><td>あした あめ が ふる<b>そうです</b>。</td><td>I hear it'll rain tomorrow.</td></tr>
             <tr><td>この えいが は おもしろい<b>そうです</b>。</td><td>They say this movie is good.</td></tr>
           </table>` },
        { heading: "Telling them apart", html:
          `<table class="ex-table">
             <tr><td>looks-like</td><td>attaches to the bare <b>stem / root</b></td><td>ふりそう</td></tr>
             <tr><td>hearsay</td><td>attaches to a full <b>plain clause</b></td><td>ふるそうだ</td></tr>
           </table>
           <div class="lesson-key"><b>Shortcut:</b> if a complete plain-form sentence sits before そう, it's "I hear"; if only a stem/root does, it's "looks".</div>` },
      ],
      practice: [
        { label: "📖 N4 Grammar", type: "study", sel: "n4gram" },
        { label: "📖 い-adjectives", type: "study", sel: "n4adji" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "conjecture", stage: "Elementary · N4", title: "Seems Like: 〜よう・〜みたい・〜らしい",
      summary: "Three ways to say something seems to be the case — and how confident each one sounds.",
      sections: [
        { heading: "〜ようだ / 〜みたいだ — it seems (your inference)", html:
          `<p>Based on your own reasoning or evidence. ようだ is more formal/written; みたいだ is its casual twin. Both attach to the plain form:</p>
           <table class="ex-table">
             <tr><td>あめ が やんだ<b>ようだ</b>／やんだ<b>みたい</b></td><td>looks like the rain stopped</td></tr>
             <tr><td>noun: こども<b>のよう</b>／こども<b>みたい</b></td><td>like a child</td></tr>
           </table>
           <p>Note ようだ takes の after a noun; みたい attaches straight to the noun.</p>` },
        { heading: "〜らしい — apparently / typical of", html:
          `<p>Two uses:</p>
           <ul>
             <li><b>apparently</b> (from what you heard): かれ は こない<b>らしい</b> = apparently he isn't coming.</li>
             <li><b>so very… / typical of</b>: おとこ<b>らしい</b> = manly; はる<b>らしい</b> ひ = a properly spring-like day.</li>
           </ul>` },
        { heading: "A rough certainty ladder", html:
          `<table class="ex-table">
             <tr><td>〜そうだ (hearsay)</td><td>just relaying a report</td></tr>
             <tr><td>〜らしい</td><td>apparently (a step removed)</td></tr>
             <tr><td>〜ようだ／みたい</td><td>I infer it myself</td></tr>
             <tr><td>〜だろう／かもしれない</td><td>probably / maybe</td></tr>
           </table>
           <div class="lesson-key"><b>Bonus:</b> 〜ように／〜ような also mean "so that / like a…": わすれない<b>ように</b> メモする = make a note so I don't forget.</div>` },
      ],
      practice: [
        { label: "📖 N4 Grammar", type: "study", sel: "n4gram" },
        { label: "📖 N4 Vocabulary", type: "study", sel: "n4vocab" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "verb-suffixes", stage: "Elementary · N4", title: "Handy Verb Endings: 〜やすい・〜にくい・〜すぎる・〜ながら",
      summary: "Four endings that bolt onto a verb stem to add 'easy to', 'hard to', 'too much', and 'while doing'.",
      sections: [
        { heading: "〜やすい / 〜にくい — easy / hard to do", html:
          `<p>Add やすい (easy) or にくい (hard) to the verb stem. The result conjugates like an い-adjective:</p>
           <table class="ex-table">
             <tr><td>よみ<b>やすい</b> ほん</td><td>an easy-to-read book</td></tr>
             <tr><td>この くすり は のみ<b>にくい</b></td><td>this medicine is hard to take</td></tr>
           </table>` },
        { heading: "〜すぎる — too much", html:
          `<p>Add すぎる (a る-verb) to a verb stem or an adjective root:</p>
           <table class="ex-table">
             <tr><td>たべ<b>すぎる</b></td><td>overeat</td></tr>
             <tr><td>この もんだい は むずかし<b>すぎる</b></td><td>this problem is too hard</td></tr>
           </table>
           <p>Irregulars: いい → <b>よすぎる</b>、ない → <b>なさすぎる</b>.</p>` },
        { heading: "〜ながら — while doing", html:
          `<p>Add ながら to the verb stem for two actions at once <i>by the same person</i>; the main action is the second clause:</p>
           <table class="ex-table">
             <tr><td>おんがく を きき<b>ながら</b> べんきょう する</td><td>study while listening to music</td></tr>
           </table>
           <div class="lesson-key"><b>Caution:</b> 〜ながら needs one subject doing both. For two different people acting at the same time, use 〜ているあいだに instead.</div>` },
      ],
      practice: [
        { label: "📖 N4 Grammar", type: "study", sel: "n4gram" },
        { label: "📖 て-form verbs", type: "study", sel: "n4verbte" },
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
      id: "when-cases", stage: "Elementary · N4", title: "When / In Case: 〜とき・〜場合",
      summary: "Pin down 'when' precisely — and how 〜場合 differs for hypothetical 'in the event that'.",
      sections: [
        { heading: "〜とき — when / at the time of", html:
          `<p>とき attaches like a noun-modifier. The verb tense before it sets the timing:</p>
           <table class="ex-table">
             <tr><td>いく<b>とき</b> (before/while going)</td><td>にほん へ いく とき、きっぷ を かう。</td></tr>
             <tr><td>いった<b>とき</b> (after arriving)</td><td>にほん へ いった とき、しゃしん を とった。</td></tr>
             <tr><td>noun: こども<b>のとき</b></td><td>when I was a child</td></tr>
           </table>
           <p>So the verb before とき is dictionary form for "before/as" and 〜た form for "after".</p>` },
        { heading: "〜場合 — in the case / event that", html:
          `<p>場合 (ばあい) is more formal and hypothetical — used for rules, instructions, and contingencies:</p>
           <table class="ex-table">
             <tr><td>おくれる <b>ばあい</b> は れんらく してください。</td><td>In case you'll be late, please contact us.</td></tr>
             <tr><td>かじ の <b>ばあい</b></td><td>in the event of a fire</td></tr>
           </table>` },
        { heading: "とき vs 場合", html:
          `<div class="lesson-key"><b>Feel:</b> とき = "when (it happens)", everyday and often factual. 場合 = "in the case that", hypothetical and formal — think signs, manuals, and policies.</div>` },
      ],
      practice: [
        { label: "📖 N4 Grammar", type: "study", sel: "n4gram" },
        { label: "📖 Compound particles", type: "study", sel: "n4partcomp" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "casual-must", stage: "Elementary · N4", title: "Casual Obligation: 〜なきゃ・〜なくちゃ・〜ないと",
      summary: "The contracted, everyday ways to say 'I have to' that you'll actually hear in conversation.",
      sections: [
        { heading: "From the textbook form to real speech", html:
          `<p>The full 〜なければならない / 〜なくてはいけない gets contracted in casual speech:</p>
           <table class="ex-table">
             <tr><td>〜なければ → <b>〜なきゃ</b></td><td>いかなきゃ = I gotta go</td></tr>
             <tr><td>〜なくては → <b>〜なくちゃ</b></td><td>たべなくちゃ = I've gotta eat</td></tr>
             <tr><td>〜ないと(いけない)</td><td>べんきょうしないと = I have to study</td></tr>
           </table>
           <p>Often the ending (いけない／だめ) is just dropped: もう ねなきゃ。 = "Gotta sleep now."</p>` },
        { heading: "Don't have to: 〜なくてもいい", html:
          `<table class="ex-table">
             <tr><td>こ<b>なくてもいい</b>です。</td><td>You don't have to come.</td></tr>
             <tr><td>(casual) しなくていいよ。</td><td>You don't need to do it.</td></tr>
           </table>` },
        { heading: "Register check", html:
          `<div class="lesson-key"><b>Watch the setting:</b> なきゃ／なくちゃ are casual — great with friends, too breezy for a boss or formal writing, where 〜なければなりません fits. ないと sits comfortably in the middle.</div>` },
      ],
      practice: [
        { label: "📖 N4 Grammar", type: "study", sel: "n4gram" },
        { label: "📖 Daily phrases", type: "study", sel: "n4phrdaily" },
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
      id: "garu-feelings", stage: "Elementary · N4", title: "Third-Person Feelings: 〜がる・〜がっている",
      summary: "Japanese avoids stating others' inner feelings flatly — 〜がる reports the outward signs instead.",
      sections: [
        { heading: "Why a plain adjective won't do", html:
          `<p>You can say あなた は さびしい? but not かれ は さびしい as a flat statement — you can't see inside someone else. Adjective root + がる reports the <i>visible</i> feeling:</p>
           <table class="ex-table">
             <tr><td>さびしい → さびし<b>がる</b></td><td>(acts) lonely</td></tr>
             <tr><td>ほしい → ほし<b>がる</b></td><td>wants (shows wanting)</td></tr>
             <tr><td>こわい → こわ<b>がる</b></td><td>is afraid</td></tr>
           </table>` },
        { heading: "〜がっている — showing it right now", html:
          `<table class="ex-table">
             <tr><td>こども が おもちゃ を ほし<b>がっている</b>。</td><td>The child wants the toy.</td></tr>
           </table>
           <p>Note the object takes を with がる, not が (ほしい→ほしがる: みず<b>を</b>ほしがる).</p>` },
        { heading: "〜たがる too", html:
          `<table class="ex-table">
             <tr><td>かれは いき<b>たがっている</b>。</td><td>He wants to go.</td></tr>
           </table>
           <div class="lesson-key"><b>Rule:</b> plain feeling words (さびしい・〜たい) for yourself; 〜がる / 〜たがる for other people.</div>` },
      ],
      practice: [
        { label: "📖 N4 Grammar", type: "study", sel: "n4gram" },
        { label: "📖 い-adjectives", type: "study", sel: "n4adji" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "as-pretend", stage: "Elementary · N4", title: "As / Pretending: 〜とおりに・〜ふりをする",
      summary: "Do something exactly the way described — or only act as if you are.",
      sections: [
        { heading: "〜とおり(に) — just as / the way", html:
          `<table class="ex-table">
             <tr><td>せつめいの<b>とおりに</b> やる。</td><td>Do it just as explained.</td></tr>
             <tr><td>おもった<b>とおり</b> だった。</td><td>It was just as I thought.</td></tr>
             <tr><td>よてい<b>どおり</b></td><td>as scheduled (noun + どおり)</td></tr>
           </table>` },
        { heading: "〜ふりをする — pretend to", html:
          `<table class="ex-table">
             <tr><td>しらない<b>ふりをする</b>。</td><td>Pretend not to know.</td></tr>
             <tr><td>ねた<b>ふり</b>。</td><td>pretending to be asleep</td></tr>
           </table>
           <div class="lesson-key"><b>Sound change:</b> after a noun, とおり voices to どおり (予定どおり, いつもどおり); after a verb or の it stays とおり.</div>` },
      ],
      practice: [
        { label: "📖 N4 Grammar", type: "study", sel: "n4gram" },
        { label: "📖 N4 Vocabulary", type: "study", sel: "n4vocab" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "should-suppose", stage: "Elementary · N4", title: "Should & Supposed To: 〜はずだ・〜べきだ",
      summary: "Two different 'should' — a logical expectation versus the right thing to do.",
      sections: [
        { heading: "〜はずだ — supposed to / ought to be", html:
          `<table class="ex-table">
             <tr><td>かれは くる<b>はずだ</b>。</td><td>He's supposed to come (I expect).</td></tr>
             <tr><td>そんな<b>はずがない</b>。</td><td>That can't possibly be.</td></tr>
           </table>
           <p>はず is about logic — what you reason must be true.</p>` },
        { heading: "〜べきだ — should (the right thing)", html:
          `<table class="ex-table">
             <tr><td>やくそく は まもる<b>べきだ</b>。</td><td>You should keep your promises.</td></tr>
             <tr><td>する → す<b>べき</b></td><td>(common irregular)</td></tr>
           </table>` },
        { heading: "Don't mix them up", html:
          `<div class="lesson-key"><b>Key:</b> はずだ = my reasoning says it's so (expectation); べきだ = it's morally/socially right (advice). べき can sound preachy toward superiors — soften with 〜たほうがいい.</div>` },
      ],
      practice: [
        { label: "📖 N4 Grammar", type: "study", sel: "n4gram" },
        { label: "📖 Conditional forms", type: "study", sel: "n4gramcond" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "only-shika-dake", stage: "Elementary · N4", title: "Only: 〜だけ・〜しか〜ない",
      summary: "Two words for 'only' — one neutral, one that stresses how little there is.",
      sections: [
        { heading: "〜だけ — only / just (neutral)", html:
          `<table class="ex-table">
             <tr><td>一つ<b>だけ</b> ください。</td><td>Just one, please.</td></tr>
             <tr><td>みる<b>だけ</b> です。</td><td>I'm only looking.</td></tr>
           </table>` },
        { heading: "〜しか〜ない — nothing but (emphatic)", html:
          `<table class="ex-table">
             <tr><td>千円<b>しか</b> ない。</td><td>I only have 1000 yen (and it's not enough).</td></tr>
             <tr><td>にほんご<b>しか</b> はなせ<b>ない</b>。</td><td>I can only speak Japanese.</td></tr>
           </table>
           <p>しか always pairs with a negative verb.</p>` },
        { heading: "だけ vs しか", html:
          `<div class="lesson-key"><b>Nuance:</b> だけ just states the limit; しか〜ない adds a feeling of "that's all / not much". しか replaces を/が (千円しかない, not 千円をしかない).</div>` },
      ],
      practice: [
        { label: "📖 N4 Grammar", type: "study", sel: "n4gram" },
        { label: "📖 Compound particles", type: "study", sel: "n4partcomp" },
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
    {
      id: "aspect-aux", stage: "Elementary · N4", title: "Aspect & Auxiliary Verbs (〜ておく・〜てしまう・〜てみる)",
      summary: "て-form helper verbs that add nuance — preparation, completion or regret, and trying things out.",
      sections: [
        { heading: "What 'aspect' adds", html:
          `<p>Past and non-past tell you <i>when</i>. <b>Aspect</b> tells you <i>how an action unfolds</i> — is it done in advance, finished off, just being tried, gradually changing? Japanese builds aspect by attaching a helper verb to the <b>て-form</b>. The base meaning stays; the helper layers nuance on top.</p>
           <p>掃除する = "clean". 掃除し<b>ておく</b> = "clean in advance (to be ready)". 掃除し<b>てしまう</b> = "clean it all up (and be done)". 掃除し<b>てみる</b> = "try cleaning and see". Same action, three different shades.</p>` },
        { heading: "〜ておく — do in advance / leave as-is", html:
          `<p><b>〜ておく</b> means doing something <b>ahead of time</b> as preparation, or leaving something in a useful state. In speech it often contracts to <b>〜とく</b>.</p>
           <table class="ex-table">
             <tr><td>予約しておく</td><td>book it in advance (so it's ready)</td></tr>
             <tr><td>窓を開けておく</td><td>leave the window open (deliberately)</td></tr>
             <tr><td>調べておきます</td><td>I'll look it up beforehand</td></tr>
             <tr><td>買っとくね (casual)</td><td>I'll go ahead and buy it</td></tr>
           </table>
           <p>Compare <b>〜てある</b>, which describes the <i>resulting state</i> someone set up: ドアが開け<b>てある</b> — "the door has been (left) open (on purpose)."</p>` },
        { heading: "〜てしまう — completion & regret", html:
          `<p><b>〜てしまう</b> has two flavours that share a feeling of <i>finality</i>:</p>
           <ul>
             <li><b>Completion</b> — doing something thoroughly / all the way: 宿題をやってしまった ("I finished the homework off").</li>
             <li><b>Regret / the unintended</b> — it happened and can't be undone: 財布を忘れてしまった ("I went and forgot my wallet").</li>
           </ul>
           <p>Casual speech contracts it: 〜てしまう → <b>〜ちゃう</b>, and 〜でしまう → <b>〜じゃう</b>. 食べちゃった ("ate it all up / oops, ate it"), 死んじゃう ("(it'll) die!").</p>` },
        { heading: "〜てみる, 〜ていく / 〜てくる", html:
          `<p>Three more high-frequency helpers:</p>
           <table class="ex-table">
             <tr><td>〜てみる</td><td>try doing and see what happens</td><td>着てみる = try on (and see)</td></tr>
             <tr><td>〜ていく</td><td>go on doing / change moving away</td><td>増えていく = keep increasing</td></tr>
             <tr><td>〜てくる</td><td>come to / change up to now</td><td>分かってきた = it's started to make sense</td></tr>
           </table>
           <p>〜ていく and 〜てくる carry the literal direction of 行く/来る (持っていく = take, 持ってくる = bring) <i>and</i> a figurative sense of change over time (寒くなってきた = "it's turned cold").</p>` },
        { heading: "Putting it together", html:
          `<div class="lesson-key"><b>One verb, many shades.</b> Attach a helper to the て-form to say <i>how</i> the action plays out: 〜ておく (prepare), 〜てしまう/〜ちゃう (finish off / oops), 〜てみる (try), 〜ていく・〜てくる (ongoing change or direction). These appear constantly in real Japanese — recognizing them is what makes natural speech click.</div>
           <p>明日のテストのために、単語を覚え<b>ておいて</b>、過去問をやっ<b>てみて</b>、分からない所は先生に聞い<b>てくる</b>つもりです。</p>` },
      ],
      practice: [
        { label: "📖 All N4 Grammar", type: "study", sel: "n4gram" },
        { label: "📖 N4 Te-form Patterns", type: "study", sel: "n4gramte" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "even-if", stage: "Elementary · N4", title: "Even If / Even Though: 〜ても・〜のに",
      summary: "Two ways to say 'despite' — 〜ても for hypothetical 'even if', 〜のに for real 'even though'.",
      sections: [
        { heading: "〜ても — even if / even though", html:
          `<p>Built on the て-form + も. It covers a concession, real or hypothetical:</p>
           <table class="ex-table">
             <tr><td>あめ が ふっ<b>ても</b> いきます。</td><td>I'll go even if it rains.</td></tr>
             <tr><td>たかく<b>ても</b> かいます。</td><td>Even if it's expensive, I'll buy it.</td></tr>
           </table>
           <p>Adjectives/nouns: たかい → たかく<b>ても</b>、しずか → しずか<b>でも</b>、あめ → あめ<b>でも</b>. Question word + ても = "no matter…": なに<b>を たべても</b> = no matter what I eat.</p>` },
        { heading: "〜のに — even though (and it's a letdown)", html:
          `<p>のに attaches to the plain form and marks a real situation that clashes with expectation, often with surprise or complaint:</p>
           <table class="ex-table">
             <tr><td>べんきょうした<b>のに</b>、おちた。</td><td>Even though I studied, I failed.</td></tr>
             <tr><td>こども<b>なのに</b>、よく しっている。</td><td>Even though they're a kid, they know a lot.</td></tr>
           </table>` },
        { heading: "ても vs のに", html:
          `<div class="lesson-key"><b>Key difference:</b> 〜ても is open/hypothetical ("even if, whatever happens"); 〜のに is about a real fact that went against expectation, and carries feeling (frustration, surprise). のに can't start a plain command or request after it.</div>` },
      ],
      practice: [
        { label: "📖 N4 Grammar", type: "study", sel: "n4gram" },
        { label: "📖 Conditional forms", type: "study", sel: "n4gramcond" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "plans-intentions", stage: "Elementary · N4", title: "Plans & Intentions: 〜つもり・予定・ことにする",
      summary: "Talk about what you intend, what's scheduled, and what you've decided to do.",
      sections: [
        { heading: "〜つもり — what you intend", html:
          `<p>Dictionary form + つもりだ = "I intend to"; ない-form + つもりだ = "I intend not to":</p>
           <table class="ex-table">
             <tr><td>らいねん にほん へ いく<b>つもり</b>です。</td><td>I plan to go to Japan next year.</td></tr>
             <tr><td>もう のま<b>ない つもり</b>です。</td><td>I intend not to drink anymore.</td></tr>
           </table>` },
        { heading: "〜予定 — what's scheduled", html:
          `<p>予定 (yotei) is a fixed arrangement, more concrete than つもり:</p>
           <table class="ex-table">
             <tr><td>かいぎ は 三じ の <b>よてい</b>です。</td><td>The meeting is scheduled for 3:00.</td></tr>
             <tr><td>しゅっぱつ する <b>よてい</b>です。</td><td>We're scheduled to depart.</td></tr>
           </table>` },
        { heading: "〜ことにする vs 〜ことになる", html:
          `<table class="ex-table">
             <tr><td>〜ことにする</td><td><b>I</b> decide to</td><td>まいあさ はしる ことにした = I decided to run each morning</td></tr>
             <tr><td>〜ことになる</td><td>it's been decided (by circumstances)</td><td>てんきん する ことになった = it's been decided I'll transfer</td></tr>
           </table>
           <div class="lesson-key"><b>Feel:</b> ことにする = your own choice; ことになる = the outcome arrived at (often by others), softer and very common in polite Japanese.</div>` },
      ],
      practice: [
        { label: "📖 N4 Grammar", type: "study", sel: "n4gram" },
        { label: "📖 N4 Vocabulary", type: "study", sel: "n4vocab" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "season-nature", stage: "Elementary · N4", title: "Seasons, Weather & Nature Idioms",
      summary: "The four seasons, seasonal words, and the nature-based set phrases woven through daily Japanese.",
      sections: [
        { heading: "四季 — a culture built on seasons", html:
          `<p>Japan's <b>four seasons (四季 しき)</b> shape food, festivals, greetings, and art. The sense that there's a "right" season for things is called <b>季節感 (きせつかん)</b>, and it runs deep:</p>
           <table class="ex-table">
             <tr><td>春 はる</td><td>spring</td><td>桜 (cherry blossom), 花見</td></tr>
             <tr><td>夏 なつ</td><td>summer</td><td>祭り, 花火, 海</td></tr>
             <tr><td>秋 あき</td><td>autumn</td><td>紅葉 (autumn leaves), 月見</td></tr>
             <tr><td>冬 ふゆ</td><td>winter</td><td>雪, 温泉, お正月</td></tr>
           </table>` },
        { heading: "Seasonal weather words", html:
          `<p>Beyond the four seasons, Japan has named weather periods you'll hear in forecasts and small talk:</p>
           <table class="ex-table">
             <tr><td>梅雨 つゆ</td><td>the rainy season (early summer)</td></tr>
             <tr><td>台風 たいふう</td><td>typhoon</td></tr>
             <tr><td>猛暑 もうしょ</td><td>fierce heat / heatwave</td></tr>
             <tr><td>紅葉 こうよう</td><td>the turning of the leaves</td></tr>
             <tr><td>初雪 はつゆき</td><td>the first snow of the year</td></tr>
           </table>` },
        { heading: "Talking about the weather", html:
          `<p>Weather (天気 てんき) is the safest small talk there is. Useful building blocks:</p>
           <ul>
             <li>晴れ (sunny) ・ 曇り (cloudy) ・ 雨 (rain) ・ 雪 (snow).</li>
             <li>Forecast verbs: 〜でしょう ("it'll probably ~"): 明日は雨<b>でしょう</b>.</li>
             <li>Degree adverbs: 蒸し暑い (humid-hot), 肌寒い (chilly), ぽかぽか (pleasantly warm).</li>
             <li>Opener: いい天気ですね ("nice weather, isn't it") — pure social glue.</li>
           </ul>` },
        { heading: "Nature in idioms", html:
          `<p>Nature words spill into everyday <b>idioms</b> whose meaning isn't literal — learn them whole:</p>
           <table class="ex-table">
             <tr><td>花より団子</td><td>"dumplings over flowers" = substance over show</td></tr>
             <tr><td>雨降って地固まる</td><td>"after rain, the ground hardens" = adversity strengthens bonds</td></tr>
             <tr><td>月とすっぽん</td><td>"the moon and a snapping turtle" = worlds apart</td></tr>
             <tr><td>水に流す</td><td>"let it flow with the water" = forgive and forget</td></tr>
             <tr><td>木漏れ日 こもれび</td><td>sunlight filtering through leaves (a word, not an idiom — but very Japanese)</td></tr>
           </table>` },
        { heading: "Why it pays off", html:
          `<div class="lesson-key"><b>Season-awareness is fluency.</b> Knowing 梅雨, 紅葉, and a couple of nature idioms lets you open any conversation, read a forecast, and understand why a menu or greeting changes with the calendar. Collect seasonal words as you meet them — they recur every year.</div>
           <p>もうすぐ梅雨ですね。雨が続くと気が重いですが、雨降って地固まると言いますから。</p>` },
      ],
      practice: [
        { label: "📖 Study N4 Vocabulary", type: "study", sel: "n4vocab" },
        { label: "📖 N4 Nouns", type: "study", sel: "n4nouns" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "wa-ga", stage: "Elementary · N4", title: "は vs が — Topic vs Subject, Properly",
      summary: "The single most-asked question in Japanese: when to use は and when to use が. Five reliable rules.",
      sections: [
        { heading: "They are not both 'the subject'", html:
          `<p>The trap is thinking は and が are two ways to mark the same thing. They aren't. <b>は</b> marks the <i>topic</i> — the frame the rest of the sentence comments on ("as for X…"). <b>が</b> marks the <i>grammatical subject</i> — the doer or the thing being described. A sentence can have both at once:</p>
           <p>象<u>は</u>鼻<u>が</u>長い — "As for elephants (topic), the nose (subject) is long." Neither particle is wrong; they're doing different jobs in different slots. Once you stop translating both as "subject", the choice gets far clearer.</p>` },
        { heading: "Rule 1 — new information takes が, known takes は", html:
          `<p>The oldest rule of thumb, and still the most useful. Brand-<b>new</b> information — the thing you're introducing or pointing out — gets <b>が</b>. Once it's <b>known</b> and you comment further on it, it becomes the topic with <b>は</b>:</p>
           <table class="ex-table">
             <tr><td>昔々、おじいさん<u>が</u>いました。</td><td>Once there was an old man. (introduces him → が)</td></tr>
             <tr><td>おじいさん<u>は</u>山へ行きました。</td><td>The old man went to the mountains. (now known → は)</td></tr>
           </table>
           <p>This is why question words split cleanly: 誰<u>が</u>来ましたか ("who came?" — the who is unknown → が), but その人<u>は</u>誰ですか ("who is that person?" — the person is known, their name is unknown → は).</p>` },
        { heading: "Rule 2 — answering 'which one?' uses が", html:
          `<p>When が singles one thing out from a set, it carries an <b>exhaustive</b> "it is X (and not the others)" force. This is why the answer to a が-question keeps が:</p>
           <ul>
             <li>誰<u>が</u>パーティーに来ますか。— 田中さん<u>が</u>来ます。("Tanaka is the one who's coming.")</li>
             <li>どれ<u>が</u>いいですか。— これ<u>が</u>いいです。("This one is the good one.")</li>
           </ul>
           <p>Swapping in は here (田中さんは来ます) subtly changes the meaning to "as for Tanaka, he's coming" — fine on its own, but it no longer answers "who?".</p>` },
        { heading: "Rule 3 — neutral description vs general statement", html:
          `<p>Reporting a one-time event or scene you simply <i>observe</i> — "neutral description" — takes <b>が</b>. Stating a general truth or habitual fact about a topic takes <b>は</b>:</p>
           <table class="ex-table">
             <tr><td>あ、雨<u>が</u>降っている。</td><td>Oh, it's raining. (observed event → が)</td></tr>
             <tr><td>日本<u>は</u>雨が多い。</td><td>Japan gets a lot of rain. (general fact → は)</td></tr>
             <tr><td>子供<u>が</u>泣いている。</td><td>A child is crying. (I notice it → が)</td></tr>
           </table>` },
        { heading: "Rule 4 — inside a clause it's が; は ranges over the whole sentence", html:
          `<p><b>は</b> belongs to the main sentence, so it can't live inside a relative clause or a subordinate clause. The subject buried in a modifying clause must use <b>が</b> (or sometimes の):</p>
           <ul>
             <li>私<u>が</u>作ったケーキ — "the cake that <u>I</u> made" (が inside the clause; は is impossible here).</li>
             <li>母<u>が</u>帰る前に — "before <u>mother</u> comes home" (subordinate clause → が).</li>
           </ul>
           <div class="lesson-key"><b>Contrast is は's other job.</b> Beyond topic, は marks a <i>contrast</i>: コーヒー<u>は</u>飲むが、お酒<u>は</u>飲まない ("I drink coffee, but not alcohol"). Two は's pitted against each other almost always signal contrast.</div>` },
        { heading: "A decision shortcut", html:
          `<div class="lesson-key"><b>Quick test:</b> could you start the clause with "as for…"? Then it's a topic → <b>は</b>. Are you pointing something <i>out</i>, answering "who/which?", describing a scene, or sitting inside a clause? Then it's <b>が</b>. The feel comes from exposure — but these five rules resolve the vast majority of real cases.</div>
           <p>私<u>は</u>日本語を勉強しています。難しい漢字<u>が</u>たくさんありますが、覚えるの<u>は</u>楽しいです。</p>` },
      ],
      practice: [
        { label: "📖 All N4 Grammar", type: "study", sel: "n4gram" },
        { label: "📖 Study N5 Particles", type: "study", sel: "n5particles" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "explanatory-no", stage: "Elementary · N4", title: "The Explanatory のだ / んです",
      summary: "Why natural Japanese is full of んです — the mood that frames a statement as an explanation, reason or realization.",
      sections: [
        { heading: "What んです actually does", html:
          `<p><b>のだ</b> (polite <b>んです</b>) is one of the most common things in spoken Japanese, and one of the last things textbooks explain well. It doesn't add new facts — it reframes a statement as <i>the explanation behind a situation</i>: "the thing is…", "(that's) because…", "it turns out that…". Compare:</p>
           <table class="ex-table">
             <tr><td>頭が痛いです。</td><td>My head hurts. (a plain report)</td></tr>
             <tr><td>頭が痛い<u>んです</u>。</td><td>(The reason I'm acting like this is that) my head hurts.</td></tr>
           </table>
           <p>The second invites the listener to connect it to the context — that's why it feels warmer and more natural in conversation.</p>` },
        { heading: "How to form it", html:
          `<p>Attach <b>ん(=の) + です／だ</b> to the <b>plain form</b>. The only catch is nouns and な-adjectives, which need a linking <b>な</b>:</p>
           <table class="ex-table">
             <tr><td>verb</td><td>行く → 行く<u>んです</u></td></tr>
             <tr><td>い-adjective</td><td>高い → 高い<u>んです</u></td></tr>
             <tr><td>な-adjective</td><td>静か → 静か<u>な</u>んです</td></tr>
             <tr><td>noun</td><td>学生 → 学生<u>な</u>んです</td></tr>
           </table>
           <p>In writing and formal speech it appears as <b>のだ／のである</b>; in casual speech it shrinks to <b>〜んだ</b> or just <b>〜の</b> (どうした<u>の</u>？ = "what's up?").</p>` },
        { heading: "The four everyday uses", html:
          `<ul>
             <li><b>Asking for an explanation</b>: どうして遅れた<u>んですか</u>。("Why (is it that) you're late?") — softer and more natural than a bare どうして遅れましたか.</li>
             <li><b>Giving a reason</b>: バス<u>が</u>来なかった<u>んです</u>。("It's that the bus didn't come.")</li>
             <li><b>A realization / discovery</b>: あ、ここにあった<u>んだ</u>。("Oh, so it was here!")</li>
             <li><b>Emphasis / insistence</b>: 本当に知らない<u>んです</u>。("I really <i>don't</i> know.")</li>
           </ul>` },
        { heading: "When NOT to use it — and the request frame", html:
          `<p>Because んです points at a reason or context, a flat, out-of-the-blue statement of fact should stay plain. Introducing yourself with 田中なんです sounds like you're explaining away some mystery; 田中です is correct. Use んです when there's a situation to account for, not for neutral facts.</p>
           <div class="lesson-key"><b>The workhorse softener:</b> <b>〜んですが／〜んですけど</b> sets up a request or problem and hands the conversation over — チケットを買いたい<u>んですが</u>…("I'd like to buy a ticket, so…"), すみません、道に迷った<u>んですけど</u>…("Excuse me, I'm lost, you see…"). The trailing が／けど leaves the ask unsaid and polite.</div>` },
        { heading: "Why it matters", html:
          `<div class="lesson-key"><b>んです is the texture of natural speech.</b> Learners who never use it sound stiff; learners who overuse it sound like everything needs justifying. The rule of thumb: reach for んです when you're <i>explaining, asking why, realizing, or leading into a request</i> — and drop it for plain neutral statements.</div>
           <p>顔色が悪い<u>ですね</u>。— ええ、ゆうべ全然眠れなかった<u>んです</u>。早く帰りたい<u>んですが</u>…。</p>` },
      ],
      practice: [
        { label: "📖 All N4 Grammar", type: "study", sel: "n4gram" },
        { label: "📖 N4 Daily Conversation", type: "study", sel: "n4phrdaily" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "te-iru", stage: "Elementary · N4", title: "〜ている — The Four Meanings (and the 知っている Trap)",
      summary: "〜ている is not just '-ing'. It marks ongoing actions, resulting states, habits and life-record — and getting them apart is what makes verbs click.",
      sections: [
        { heading: "One form, four jobs", html:
          `<p>Beginners learn 〜ている as the "-ing" progressive and stop there. In reality it does <b>four</b> different jobs, and which one applies depends on the verb. Mixing them up is behind a huge share of intermediate mistakes — so it's worth pulling them apart deliberately.</p>
           <table class="ex-table">
             <tr><td>1. ongoing action</td><td>食べている</td><td>is eating (right now)</td></tr>
             <tr><td>2. resulting state</td><td>結婚している</td><td>is married (not "getting married")</td></tr>
             <tr><td>3. habit / repetition</td><td>毎朝走っている</td><td>runs every morning</td></tr>
             <tr><td>4. record / experience</td><td>二回行っている</td><td>has gone twice</td></tr>
           </table>` },
        { heading: "Ongoing action — the progressive you already know", html:
          `<p>With <b>durative</b> verbs (actions that take time — eat, read, wait, rain), 〜ている is the live, in-progress "-ing":</p>
           <ul>
             <li>今、本を読ん<b>でいる</b> — "I'm reading a book right now."</li>
             <li>雨が降っ<b>ている</b> — "It's raining."</li>
             <li>子供が公園で遊ん<b>でいる</b> — "The kids are playing in the park."</li>
           </ul>
           <p>This is the use that matches English most cleanly, which is exactly why the next one ambushes people.</p>` },
        { heading: "Resulting state — the one that trips everyone up", html:
          `<p>With <b>change-of-state / instantaneous</b> verbs (marry, die, know, arrive, stand up, wear), the change happens in an instant, so 〜ている can't mean "in the middle of it." Instead it marks the <b>state that remains afterward</b>:</p>
           <table class="ex-table">
             <tr><td>結婚している</td><td>is married</td><td>NOT "is getting married"</td></tr>
             <tr><td>死んでいる</td><td>is dead</td><td>NOT "is dying"</td></tr>
             <tr><td>知っている</td><td>knows</td><td>NOT "is knowing"</td></tr>
             <tr><td>持っている</td><td>has / owns</td><td>holds it as a state</td></tr>
             <tr><td>めがねをかけている</td><td>wears glasses</td><td>the resulting look</td></tr>
           </table>
           <div class="lesson-key"><b>The famous 知っている trap:</b> "I know" is 知っ<b>ている</b> — but "I don't know" is <b>知らない</b>, never 知っていない. The positive is a state; the negative drops back to the plain form. 知っていますか → いいえ、<b>知りません</b>.</div>` },
        { heading: "Habit and life-record", html:
          `<p>Two more everyday uses ride on the same form:</p>
           <ul>
             <li><b>Habit / repeated action</b> — something done regularly over a span of time: 毎日日本語を勉強し<b>ている</b> ("I study Japanese every day"); 兄は銀行で働い<b>ている</b> ("my brother works at a bank").</li>
             <li><b>Record / experience</b> — a past event still "on the books," often with a count: 彼は富士山に三回登っ<b>ている</b> ("he has climbed Mt. Fuji three times"); この作家はもう亡くなっ<b>ている</b> ("this author has [already] died").</li>
           </ul>` },
        { heading: "〜ている vs 〜てある (and casual 〜てる)", html:
          `<p>Both describe a <i>state</i>, but from different angles — this pairs directly with the transitive/intransitive lesson:</p>
           <table class="ex-table">
             <tr><th>〜ている (intransitive)</th><th>〜てある (transitive)</th></tr>
             <tr><td>窓が開い<b>ている</b></td><td>窓が開け<b>てある</b></td></tr>
             <tr><td>"the window is open" (just the state)</td><td>"the window has been opened" (someone did it on purpose, for a reason)</td></tr>
           </table>
           <p>〜てある always implies a person prepared the state deliberately. In casual speech, 〜ている contracts to <b>〜てる</b> (食べてる, 知ってる, 何してる?) — recognizing it is essential for listening.</p>
           <div class="lesson-key"><b>Decide by the verb:</b> durative verb → 〜ている is "-ing"; change-of-state verb → 〜ている is the lingering result. When in doubt, ask "could this finish in an instant?" If yes, you're looking at a state, not an action in progress.</div>` },
      ],
      practice: [
        { label: "📖 All N4 Grammar", type: "study", sel: "n4gram" },
        { label: "📖 N4 Te-form Patterns", type: "study", sel: "n4gramte" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },

    // ============================ Intermediate · N3 ============================
    {
      id: "tari", stage: "Elementary · N4", title: "Listing Actions: 〜たり〜たり",
      summary: "List a few representative actions — examples, not a fixed sequence — with the 〜たり form.",
      sections: [
        { heading: "Form: plain-past + り", html:
          `<p>Take the plain past (た／だ) form, add り — usually twice — and close with する:</p>
           <table class="ex-table">
             <tr><td>たべる → たべた → たべ<b>たり</b></td><td></td></tr>
             <tr><td>よむ → よんだ → よん<b>だり</b></td><td></td></tr>
           </table>
           <p>えいが を み<b>たり</b>、ほん を よん<b>だり</b> <b>します</b>。 = I do things like watch movies and read books.</p>` },
        { heading: "Examples vs sequence", html:
          `<p>〜たり gives <i>examples</i> in no particular order ("things like A and B"). The て-form, by contrast, lists actions in the order they happen.</p>
           <table class="ex-table">
             <tr><td>て-form</td><td>おきて、たべて、いく</td><td>get up, eat, then go (in order)</td></tr>
             <tr><td>〜たり</td><td>たべたり のんだり する</td><td>eat, drink, and the like</td></tr>
           </table>` },
        { heading: "Alternation & tense", html:
          `<p>Repeating opposites shows back-and-forth: ふっ<b>たり</b> やん<b>だり</b> = raining on and off.</p>
           <div class="lesson-key"><b>Where the grammar lives:</b> tense and politeness sit on the final する — 〜たり〜たり しました (past), 〜たり〜たり したい (want to).</div>` },
      ],
      practice: [
        { label: "📖 N4 Grammar", type: "study", sel: "n4gram" },
        { label: "📖 た-form verbs", type: "study", sel: "n4verbta" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "experience-koto", stage: "Elementary · N4", title: "Experience: 〜たことがある",
      summary: "Say whether you've ever done something — life experience, not a specific past event.",
      sections: [
        { heading: "Form", html:
          `<p>plain past + ことがある = "have (ever) done":</p>
           <table class="ex-table">
             <tr><td>にほん へ いった ことが ある</td><td>I've been to Japan</td></tr>
             <tr><td>すし を たべた ことが ある</td><td>I've eaten sushi</td></tr>
           </table>
           <p>Negative: 〜た ことが ない = have never…</p>` },
        { heading: "Asking", html:
          `<table class="ex-table">
             <tr><td>〜た ことが ありますか？</td><td>Have you ever…?</td></tr>
             <tr><td>はい、あります。／いいえ、ありません。</td><td>Yes, I have. / No, I haven't.</td></tr>
           </table>` },
        { heading: "Don't mix it up", html:
          `<div class="lesson-key"><b>Experience vs past:</b> 〜たことがある = "ever, in your life". For a specific finished action ("I ate it"), just use the past: たべました. And note 〜<b>る</b>ことがある (dictionary form) means "there are times when…" — a different pattern.</div>` },
      ],
      practice: [
        { label: "📖 N4 Grammar", type: "study", sel: "n4gram" },
        { label: "📖 た-form verbs", type: "study", sel: "n4verbta" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
    {
      id: "connectors-n4", stage: "Elementary · N4", title: "Sentence Connectors: だから・でも・それから",
      summary: "Words that begin a new sentence to tie it to the last one — so, but, and then.",
      sections: [
        { heading: "Cause → result", html:
          `<table class="ex-table">
             <tr><td>だから</td><td>so / therefore</td></tr>
             <tr><td>それで</td><td>and so (result)</td></tr>
             <tr><td>そのため</td><td>for that reason (formal)</td></tr>
           </table>` },
        { heading: "Contrast", html:
          `<table class="ex-table">
             <tr><td>でも</td><td>but (casual, sentence start)</td></tr>
             <tr><td>しかし</td><td>however (formal / written)</td></tr>
             <tr><td>それでも</td><td>even so</td></tr>
             <tr><td>ところが</td><td>but unexpectedly</td></tr>
           </table>` },
        { heading: "Adding & sequencing", html:
          `<table class="ex-table">
             <tr><td>それから</td><td>after that / and then</td></tr>
             <tr><td>そして</td><td>and / and then</td></tr>
             <tr><td>それに</td><td>moreover / besides</td></tr>
           </table>
           <p>These join whole sentences. <i>Inside</i> one sentence, use 〜から／〜ので (because) and 〜が／〜けど (but) instead.</p>
           <div class="lesson-key"><b>Register:</b> だから can sound blunt with superiors — ですから or そのため are safer in formal speech.</div>` },
      ],
      practice: [
        { label: "📖 N4 Grammar", type: "study", sel: "n4gram" },
        { label: "📖 Opinion phrases", type: "study", sel: "n4phropinion" },
        { label: "🎮 Play N4 Vocabulary", type: "game", game: "n4vocab" },
      ],
    },
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
      id: "youni-grammar", stage: "Intermediate · N3", title: "〜ように・〜ようになる・〜ようにする",
      summary: "Express purpose, a change of state you reached, and an effort you keep up — all with よう.",
      sections: [
        { heading: "〜ようになる — came to / now (a change)", html:
          `<table class="ex-table">
             <tr><td>かんじ が よめる<b>ようになった</b>。</td><td>I've become able to read kanji.</td></tr>
             <tr><td>やさい を たべる<b>ようになった</b>。</td><td>I've started eating vegetables (didn't before).</td></tr>
           </table>` },
        { heading: "〜ようにする — make a point of", html:
          `<table class="ex-table">
             <tr><td>まいにち あるく<b>ようにしている</b>。</td><td>I make a point of walking every day.</td></tr>
             <tr><td>わすれない<b>ように</b> メモする。</td><td>I take notes so I won't forget.</td></tr>
           </table>` },
        { heading: "〜ように — so that / so as to", html:
          `<table class="ex-table">
             <tr><td>みんなに きこえる<b>ように</b> おおきな こえで。</td><td>Loudly, so everyone can hear.</td></tr>
             <tr><td>はやく なおる<b>ように</b> いのる。</td><td>I pray you get better soon.</td></tr>
           </table>
           <div class="lesson-key"><b>ように vs ために:</b> ように takes a potential / non-volitional / negative verb (an outcome you hope for); ために takes a volitional verb or noun (a goal you act for).</div>` },
      ],
      practice: [
        { label: "📖 N3 Grammar", type: "study", sel: "n3gram" },
        { label: "📖 Compound grammar", type: "study", sel: "n3gramcompound" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },
    {
      id: "as-change", stage: "Intermediate · N3", title: "As X Changes: 〜につれて・〜にしたがって・〜とともに",
      summary: "Link two changes that move together — as one shifts, so does the other.",
      sections: [
        { heading: "〜につれて / 〜にしたがって — as (gradual parallel change)", html:
          `<table class="ex-table">
             <tr><td>じかん が たつ<b>につれて</b>、いたみ が ひいた。</td><td>As time passed, the pain faded.</td></tr>
             <tr><td>こうれいか が すすむ<b>にしたがって</b>…</td><td>As ageing advances…</td></tr>
           </table>` },
        { heading: "〜とともに — along with / at the same time as", html:
          `<table class="ex-table">
             <tr><td>けいざい の はってん<b>とともに</b> せいかつ が かわった。</td><td>Life changed along with economic growth.</td></tr>
             <tr><td>かぞく<b>とともに</b> くらす。</td><td>To live together with family.</td></tr>
           </table>` },
        { heading: "When to use them", html:
          `<div class="lesson-key"><b>Both sides must move:</b> these link two <i>changes</i> ("the more A progresses, the more B happens"). For a simple one-off "when", use 〜とき; for "the more…the more", use 〜ば〜ほど.</div>` },
      ],
      practice: [
        { label: "📖 N3 Grammar", type: "study", sel: "n3gram" },
        { label: "📖 Compound grammar", type: "study", sel: "n3gramcompound" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },
    {
      id: "extent-n3", stage: "Intermediate · N3", title: "Degree & Extent: 〜ほど・〜くらい・〜ば〜ほど",
      summary: "Express 'to the point that', 'the more…the more', and 'not as…as'.",
      sections: [
        { heading: "〜ほど / 〜くらい — to the extent that", html:
          `<table class="ex-table">
             <tr><td>しぬ<b>ほど</b> つかれた。</td><td>I'm dead tired (tired to the point of dying).</td></tr>
             <tr><td>ねむれない<b>くらい</b> こうふんした。</td><td>So excited I couldn't sleep.</td></tr>
           </table>` },
        { heading: "〜ば〜ほど — the more…the more", html:
          `<table class="ex-table">
             <tr><td>れんしゅうすれ<b>ば</b>する<b>ほど</b> うまくなる。</td><td>The more you practice, the better you get.</td></tr>
             <tr><td>たかけれ<b>ば</b>たかい<b>ほど</b> いい。</td><td>The higher, the better.</td></tr>
           </table>` },
        { heading: "〜ほど in comparisons", html:
          `<table class="ex-table">
             <tr><td>きょう は きのう<b>ほど</b> さむく ない。</td><td>Today isn't as cold as yesterday.</td></tr>
           </table>
           <div class="lesson-key"><b>Note:</b> A は B ほど〜ない = "A is not as … as B". And both ほど/くらい still double as "approximately" with amounts (十人くらい).</div>` },
      ],
      practice: [
        { label: "📖 N3 Grammar", type: "study", sel: "n3gram" },
        { label: "📖 Nuance grammar", type: "study", sel: "n3gramnuance" },
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
      id: "compound-verbs", stage: "Intermediate · N3", title: "Compound Verb Endings: 〜きる・〜かける・〜だす・〜つづける",
      summary: "Stack a second verb onto the stem to add 'finish', 'start', 'half-way', and 'keep going'.",
      sections: [
        { heading: "〜きる / 〜きれない — do completely / can't finish", html:
          `<table class="ex-table">
             <tr><td>ぜんぶ たべ<b>きる</b>。</td><td>eat it all up</td></tr>
             <tr><td>かぞえ<b>きれない</b> ほど。</td><td>too many to count</td></tr>
           </table>` },
        { heading: "〜だす / 〜かける — start / half-done", html:
          `<table class="ex-table">
             <tr><td>きゅうに なき<b>だした</b>。</td><td>suddenly burst out crying</td></tr>
             <tr><td>いい<b>かけて</b> やめた。</td><td>started to say something, then stopped</td></tr>
             <tr><td>たべ<b>かけ</b> の パン</td><td>a half-eaten piece of bread</td></tr>
           </table>` },
        { heading: "〜つづける / 〜おわる — keep on / finish", html:
          `<table class="ex-table">
             <tr><td>あめ が ふり<b>つづける</b>。</td><td>it keeps raining</td></tr>
             <tr><td>よみ<b>おわる</b>。</td><td>finish reading</td></tr>
           </table>
           <div class="lesson-key"><b>〜だす vs 〜はじめる:</b> 〜だす is sudden/unexpected ("burst into"); 〜はじめる is a neutral "begin to".</div>` },
      ],
      practice: [
        { label: "📖 N3 Grammar", type: "study", sel: "n3gram" },
        { label: "📖 Compound grammar", type: "study", sel: "n3gramcompound" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },
    {
      id: "toka-yara", stage: "Intermediate · N3", title: "Vague Listing: 〜とか・〜やら・〜なんか・〜なんて",
      summary: "Casual ways to give examples loosely — and to wave a thing off or play it up.",
      sections: [
        { heading: "〜とか / 〜やら — examples (loose, casual)", html:
          `<table class="ex-table">
             <tr><td>すし<b>とか</b> てんぷら<b>とか</b> たべた。</td><td>ate sushi, tempura, and such</td></tr>
             <tr><td>なに<b>やら</b> こまっている みたい。</td><td>seems troubled by something or other</td></tr>
           </table>` },
        { heading: "〜なんか / 〜など — things like / belittling", html:
          `<table class="ex-table">
             <tr><td>えいが<b>なんか</b> どう？</td><td>how about (something like) a movie?</td></tr>
             <tr><td>わたし<b>なんか</b> むり だよ。</td><td>someone like me could never…</td></tr>
           </table>` },
        { heading: "〜なんて — the very idea of (surprise/scorn)", html:
          `<table class="ex-table">
             <tr><td>まける<b>なんて</b> しんじられない。</td><td>I can't believe (the idea of) losing.</td></tr>
           </table>
           <div class="lesson-key"><b>Tone:</b> なんか/なんて add feeling — modesty, dismissal, or shock — on top of "things like". など is the neutral, more formal version.</div>` },
      ],
      practice: [
        { label: "📖 N3 Grammar", type: "study", sel: "n3gram" },
        { label: "📖 Nuance grammar", type: "study", sel: "n3gramnuance" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },
    {
      id: "regret-grammar", stage: "Intermediate · N3", title: "Regret & Unmet Plans: 〜ばよかった・〜はずだった",
      summary: "Look back on what you wish you'd done and what was supposed to happen.",
      sections: [
        { heading: "〜ばよかった / 〜たらよかった — I wish I'd…", html:
          `<table class="ex-table">
             <tr><td>もっと べんきょうすれ<b>ばよかった</b>。</td><td>I should have studied more.</td></tr>
             <tr><td>いか<b>なければよかった</b>。</td><td>I wish I hadn't gone.</td></tr>
           </table>` },
        { heading: "〜はずだった — was supposed to (but didn't)", html:
          `<table class="ex-table">
             <tr><td>三じに つく<b>はずだった</b>。</td><td>It was supposed to arrive at 3:00.</td></tr>
           </table>` },
        { heading: "〜つもりだった — had intended to", html:
          `<table class="ex-table">
             <tr><td>いく<b>つもりだった</b> が、いけなかった。</td><td>I'd meant to go, but couldn't.</td></tr>
           </table>
           <div class="lesson-key"><b>Shades of "should have":</b> 〜ばよかった = personal regret; 〜はずだった = an expectation that fell through; 〜つもりだった = an intention that didn't pan out.</div>` },
      ],
      practice: [
        { label: "📖 N3 Grammar", type: "study", sel: "n3gram" },
        { label: "📖 Nuance grammar", type: "study", sel: "n3gramnuance" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
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
      id: "te-kuru-iku", stage: "Intermediate · N3", title: "Direction & Change: 〜てくる・〜ていく",
      summary: "Attach くる / いく to the て-form to show motion toward or away — in space and in time.",
      sections: [
        { heading: "Physical direction", html:
          `<table class="ex-table">
             <tr><td>もって<b>くる</b> / もって<b>いく</b></td><td>bring (here) / take (away)</td></tr>
             <tr><td>あるいて<b>きた</b>。</td><td>came on foot</td></tr>
           </table>` },
        { heading: "Change over time", html:
          `<table class="ex-table">
             <tr><td>〜てくる</td><td>up to now / starting to</td><td>さむく なって<b>きた</b> = it's gotten cold</td></tr>
             <tr><td>〜ていく</td><td>from now on</td><td>これから ふえて<b>いく</b> = will keep rising</td></tr>
           </table>` },
        { heading: "Appearing & fading", html:
          `<table class="ex-table">
             <tr><td>でて<b>くる</b></td><td>appear / come out</td></tr>
             <tr><td>きえて<b>いく</b></td><td>fade away</td></tr>
           </table>
           <div class="lesson-key"><b>Compass:</b> くる = toward the speaker / toward now; いく = away / into the future.</div>` },
      ],
      practice: [
        { label: "📖 N3 Grammar", type: "study", sel: "n3gram" },
        { label: "📖 Compound grammar", type: "study", sel: "n3gramcompound" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },
    {
      id: "te-aru", stage: "Intermediate · N3", title: "Resultant States: 〜てある vs 〜ている",
      summary: "Tell apart a state someone set up on purpose from one you're simply describing.",
      sections: [
        { heading: "〜てある — left in a prepared state", html:
          `<p>Transitive verb + てある: someone did it deliberately, and the result remains:</p>
           <table class="ex-table">
             <tr><td>まど が あけ<b>てある</b>。</td><td>The window has been (purposely) opened.</td></tr>
             <tr><td>よやく が して<b>ある</b>。</td><td>A reservation has been made (and stands).</td></tr>
           </table>` },
        { heading: "〜ている — simply a state", html:
          `<table class="ex-table">
             <tr><td>まど が あい<b>ている</b>。</td><td>The window is open. (just describing)</td></tr>
           </table>
           <p>Here the verb is intransitive (あく); no agent or intent is implied.</p>` },
        { heading: "Side by side", html:
          `<table class="ex-table">
             <tr><td>ドアが しめ<b>てある</b></td><td>someone shut it, on purpose</td></tr>
             <tr><td>ドアが しまっ<b>ている</b></td><td>it's (just) closed</td></tr>
           </table>
           <div class="lesson-key"><b>Test trap:</b> てある needs a transitive verb + implies intent/preparation; intransitive + ている is a plain state report.</div>` },
      ],
      practice: [
        { label: "📖 N3 Grammar", type: "study", sel: "n3gram" },
        { label: "📖 Compound grammar", type: "study", sel: "n3gramcompound" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },
    {
      id: "try-about-to", stage: "Intermediate · N3", title: "Trying & Almost: 〜ようとする・〜ところだった",
      summary: "Be on the verge of an action — attempting it, or nearly having it happen.",
      sections: [
        { heading: "〜ようとする — try to / be about to", html:
          `<table class="ex-table">
             <tr><td>でかけ<b>ようとした</b> とき、でんわ が なった。</td><td>Just as I was about to leave, the phone rang.</td></tr>
             <tr><td>ねむ<b>ろうとした</b> が、ねむれない。</td><td>I tried to sleep, but couldn't.</td></tr>
           </table>
           <p>Built on the volitional form (〜よう / 〜おう) + とする.</p>` },
        { heading: "〜ところだった — almost (but didn't)", html:
          `<table class="ex-table">
             <tr><td>わすれる<b>ところだった</b>。</td><td>I almost forgot.</td></tr>
             <tr><td>あやうく ころぶ<b>ところだった</b>。</td><td>I nearly fell.</td></tr>
           </table>` },
        { heading: "Don't confuse them", html:
          `<div class="lesson-key"><b>Key:</b> 〜ようとする = attempting / on the verge of acting; 〜ところだった = a near-miss that did <i>not</i> happen (often with あやうく / もう少しで).</div>` },
      ],
      practice: [
        { label: "📖 N3 Grammar", type: "study", sel: "n3gram" },
        { label: "📖 Nuance grammar", type: "study", sel: "n3gramnuance" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
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
      id: "until-by", stage: "Intermediate · N3", title: "Until vs By: 〜まで・〜までに",
      summary: "A classic mix-up — まで for a span that continues, までに for a one-time deadline.",
      sections: [
        { heading: "〜まで — up until (continuous)", html:
          `<table class="ex-table">
             <tr><td>五じ<b>まで</b> はたらく。</td><td>I work until 5:00. (the action lasts to then)</td></tr>
             <tr><td>あめ が やむ<b>まで</b> まつ。</td><td>Wait until the rain stops.</td></tr>
           </table>` },
        { heading: "〜までに — by (deadline)", html:
          `<table class="ex-table">
             <tr><td>五じ<b>までに</b> おわらせる。</td><td>Finish it by 5:00.</td></tr>
             <tr><td>あした<b>までに</b> だす。</td><td>Submit it by tomorrow.</td></tr>
           </table>` },
        { heading: "How to choose", html:
          `<div class="lesson-key"><b>Test:</b> if the verb keeps going up to the point (待つ・働く・いる) → まで. If it's a one-shot action with a deadline (出す・着く・終わる) → までに.</div>` },
      ],
      practice: [
        { label: "📖 N3 Grammar", type: "study", sel: "n3gram" },
        { label: "📖 Compound grammar", type: "study", sel: "n3gramcompound" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },
    {
      id: "rules-instructions", stage: "Intermediate · N3", title: "Rules & Reported Commands: 〜ことになっている・〜ように言う",
      summary: "State a standing rule, your own policy, and relay what someone was told to do.",
      sections: [
        { heading: "〜ことになっている — an established rule", html:
          `<table class="ex-table">
             <tr><td>ここでは くつ を ぬぐ<b>ことになっている</b>。</td><td>The rule here is to take your shoes off.</td></tr>
           </table>` },
        { heading: "〜ことにしている — your own habit/policy", html:
          `<table class="ex-table">
             <tr><td>まいあさ はしる<b>ことにしている</b>。</td><td>I make it a rule to run every morning.</td></tr>
           </table>` },
        { heading: "〜ように言う/たのむ — tell/ask someone to", html:
          `<table class="ex-table">
             <tr><td>しずかにする<b>ように いわれた</b>。</td><td>I was told to be quiet.</td></tr>
           </table>
           <div class="lesson-key"><b>Split:</b> ことになっている = a rule set by others/society; ことにしている = a habit <i>you</i> resolved on; ように言う = relaying a command or request.</div>` },
      ],
      practice: [
        { label: "📖 N3 Grammar", type: "study", sel: "n3gram" },
        { label: "📖 Compound grammar", type: "study", sel: "n3gramcompound" },
        { label: "🎮 Play N3 Vocabulary", type: "game", game: "n3vocab" },
      ],
    },
    {
      id: "casual-tte", stage: "Intermediate · N3", title: "Casual って: Quoting, Topics & Hearsay",
      summary: "The all-purpose spoken って — standing in for という, は, and 'I hear that'.",
      sections: [
        { heading: "って = casual と / という (quoting)", html:
          `<table class="ex-table">
             <tr><td>「あした くる」<b>って</b> いってた。</td><td>He said he'd come tomorrow.</td></tr>
             <tr><td>たなか さん<b>って</b> ひと</td><td>a person called Tanaka</td></tr>
           </table>` },
        { heading: "って as a casual topic marker (= は)", html:
          `<table class="ex-table">
             <tr><td>にほんご<b>って</b> むずかしい ね。</td><td>Japanese sure is hard, huh.</td></tr>
           </table>` },
        { heading: "〜だって — I hear / they say", html:
          `<table class="ex-table">
             <tr><td>あした やすみ<b>だって</b>。</td><td>I hear tomorrow's a day off.</td></tr>
           </table>
           <div class="lesson-key"><b>Register:</b> って is conversational — perfect for friends, but write out という / は / そうだ in anything formal.</div>` },
      ],
      practice: [
        { label: "📖 N3 Grammar", type: "study", sel: "n3gram" },
        { label: "📖 Nuance grammar", type: "study", sel: "n3gramnuance" },
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
    {
      id: "tokoro", stage: "Intermediate · N3", title: "〜ところ — The Phases of an Action (about to / mid / just did)",
      summary: "One little word, ところ, pins down exactly when you are in an action — on the verge, in the thick of it, or just finished.",
      sections: [
        { heading: "ところ = the 'point' you're at", html:
          `<p><b>ところ</b> literally means "place," but attached to a verb it marks a <i>point in time</i> — precisely which phase of an action you're in. The phase is set by the form of the verb in front of it. Three core patterns cover the timeline:</p>
           <table class="ex-table">
             <tr><td>dictionary + ところ</td><td>出かける<b>ところ</b></td><td>about to leave</td></tr>
             <tr><td>〜ている + ところ</td><td>出かけている<b>ところ</b></td><td>in the middle of leaving</td></tr>
             <tr><td>〜た + ところ</td><td>出かけた<b>ところ</b></td><td>just left</td></tr>
           </table>` },
        { heading: "〜るところ — right about to", html:
          `<p>Dictionary form + ところ catches an action <b>on the verge</b> of happening — nothing has started yet:</p>
           <ul>
             <li>今から<b>食べるところ</b>です — "I'm just about to eat."</li>
             <li>ちょうど<b>出かけるところ</b>だった — "I was just about to head out."</li>
           </ul>
           <p>Pair it with ちょうど ("just/exactly") or 今から ("from now") to sharpen the "any second now" feel.</p>` },
        { heading: "〜ているところ — in the thick of it", html:
          `<p>〜ている + ところ zooms in on an action <b>in progress at this very moment</b> — stronger and more "right now" than 〜ている alone:</p>
           <ul>
             <li>今、晩ご飯を<b>作っているところ</b>です — "I'm in the middle of making dinner right now."</li>
             <li>原因を<b>調べているところ</b>です — "We're currently looking into the cause."</li>
           </ul>
           <p>It's the natural answer to "is it done yet?" — まだ<b>やっているところ</b>です ("still working on it").</p>` },
        { heading: "〜たところ — just finished", html:
          `<p>Past form + ところ marks an action that <b>finished a moment ago</b> — the result is fresh:</p>
           <ul>
             <li>今<b>着いたところ</b>です — "I just got here."</li>
             <li>会議が<b>終わったところ</b>だ — "The meeting just ended."</li>
           </ul>` },
        { heading: "〜たところ vs 〜たばかり", html:
          `<p>Both translate as "just did," and they overlap — but the feel differs, and N-tests love the contrast:</p>
           <table class="ex-table">
             <tr><th>〜たところ</th><th>〜たばかり</th></tr>
             <tr><td>objective: literally moments ago, the action sits at this point on the clock</td><td>subjective: feels recent / brand-new, even if some time has passed</td></tr>
             <tr><td>食べたところだ — "I just ate (a moment ago)."</td><td>日本に来たばかりだ — "I just came to Japan." (could be weeks)</td></tr>
           </table>
           <div class="lesson-key"><b>The timeline in one breath:</b> 〜るところ (about to) → 〜ているところ (in the middle) → 〜たところ (just did). Use 〜たばかり instead of 〜たところ when you mean "newly / freshly," not strictly "seconds ago."</div>
           <p>電話しようと思っていた<b>ところ</b>に、ちょうど君から連絡が来た。今、家に着いた<b>ばかり</b>だよ。</p>` },
      ],
      practice: [
        { label: "📖 All N3 Grammar", type: "study", sel: "n3gram" },
        { label: "📖 N3 Expressing Nuance", type: "study", sel: "n3gramnuance" },
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
      id: "mono-grammar", stage: "Upper-Intermediate · N2", title: "The 〜ものだ Family",
      summary: "One ending, several jobs — stating how things are, reminiscing, and giving a soft excuse.",
      sections: [
        { heading: "General truth / the way things are", html:
          `<p>Plain form + ものだ states a general truth or social norm:</p>
           <table class="ex-table">
             <tr><td>としを とると わすれっぽく なる<b>ものだ</b>。</td><td>People do get forgetful with age.</td></tr>
             <tr><td>そんなこと を いう<b>ものではない</b>。</td><td>You shouldn't say such things.</td></tr>
           </table>` },
        { heading: "Nostalgia: 〜たものだ", html:
          `<p>Past form + ものだ looks back on a habit fondly:</p>
           <table class="ex-table">
             <tr><td>こどものころ、よく ここで あそんだ<b>ものだ</b>。</td><td>As a kid, I used to play here a lot.</td></tr>
           </table>` },
        { heading: "Soft reason: 〜ものだから / 〜もので", html:
          `<p>Gives a reason with a nuance of "it couldn't be helped":</p>
           <table class="ex-table">
             <tr><td>いそがしかった<b>ものだから</b>、れんらく できなかった。</td><td>I was so busy I couldn't get in touch.</td></tr>
           </table>
           <div class="lesson-key"><b>Don't confuse:</b> 〜ものの = "although" (contrast), and 〜もの at the end of casual speech = a pouty "but / because". Context and what precedes ものだ tell them apart.</div>` },
      ],
      practice: [
        { label: "📖 N2 Grammar", type: "study", sel: "n2gram" },
        { label: "📖 Complex grammar", type: "study", sel: "n2gramcomplex" },
        { label: "🎮 Play N2 Vocabulary", type: "game", game: "n2vocab" },
      ],
    },
    {
      id: "uchi-mama", stage: "Upper-Intermediate · N2", title: "While & Unchanged: 〜うちに・〜まま",
      summary: "〜うちに for a window of time that won't last, and 〜まま for leaving a state untouched.",
      sections: [
        { heading: "〜うちに — while / before (a state lasts)", html:
          `<table class="ex-table">
             <tr><td>あつい<b>うちに</b> めしあがってください。</td><td>Please eat while it's hot.</td></tr>
             <tr><td>しらない<b>うちに</b> なつ が おわった。</td><td>Summer ended before I knew it.</td></tr>
             <tr><td>くらく ならない<b>うちに</b> かえろう。</td><td>Let's head back before it gets dark.</td></tr>
           </table>` },
        { heading: "〜まま — leaving a state as-is", html:
          `<table class="ex-table">
             <tr><td>でんき を つけた<b>まま</b> ねた。</td><td>I slept with the light left on.</td></tr>
             <tr><td>くつ の<b>まま</b> はいらないで。</td><td>Don't come in with your shoes on.</td></tr>
           </table>` },
        { heading: "うちに vs あいだに", html:
          `<div class="lesson-key"><b>Nuance:</b> 〜うちに stresses a window that will close ("while you still can"); 〜あいだに just marks "during" a span. るす の あいだに = (simply) while away; わかい うちに = while you're still young.</div>` },
      ],
      practice: [
        { label: "📖 N2 Grammar", type: "study", sel: "n2gram" },
        { label: "📖 Formal grammar", type: "study", sel: "n2gramformal" },
        { label: "🎮 Play N2 Vocabulary", type: "game", game: "n2vocab" },
      ],
    },
    {
      id: "ish-grammar", stage: "Upper-Intermediate · N2", title: "Looks & Tendencies: 〜っぽい・〜がち・〜ぎみ・〜げ",
      summary: "Four suffixes for impressions and tendencies — -ish, prone to, a touch of, and an air of.",
      sections: [
        { heading: "〜っぽい — -ish / tends to", html:
          `<table class="ex-table">
             <tr><td>こども<b>っぽい</b></td><td>childish</td></tr>
             <tr><td>わすれ<b>っぽい</b></td><td>forgetful</td></tr>
           </table>` },
        { heading: "〜がち & 〜ぎみ — prone to / a touch of", html:
          `<table class="ex-table">
             <tr><td>〜がち</td><td>tends to (often unwanted)</td><td>くもり<b>がち</b>、やすみ<b>がち</b></td></tr>
             <tr><td>〜ぎみ</td><td>a slight touch of</td><td>かぜ<b>ぎみ</b>、つかれ<b>ぎみ</b></td></tr>
           </table>` },
        { heading: "〜げ — an air of", html:
          `<table class="ex-table">
             <tr><td>うれし<b>げ</b>・さびし<b>げ</b></td><td>seeming happy / lonely</td></tr>
           </table>
           <div class="lesson-key"><b>Pick by nuance:</b> っぽい = subjective impression; がち = frequency/tendency; ぎみ = slight degree; げ = a visible air someone gives off.</div>` },
      ],
      practice: [
        { label: "📖 N2 Grammar", type: "study", sel: "n2gram" },
        { label: "📖 N2 い-adjectives", type: "study", sel: "n2adji" },
        { label: "🎮 Play N2 Vocabulary", type: "game", game: "n2vocab" },
      ],
    },
    {
      id: "considering", stage: "Upper-Intermediate · N2", title: "Considering / For: 〜にしては・〜わりに・〜だけあって",
      summary: "Compare a result against an expectation — whether it defies it or lives up to it.",
      sections: [
        { heading: "〜にしては — for / considering (defies expectation)", html:
          `<table class="ex-table">
             <tr><td>はじめて<b>にしては</b> じょうず だ。</td><td>Good, for a first try.</td></tr>
             <tr><td>こども<b>にしては</b> しっかり している。</td><td>Mature, for a child.</td></tr>
           </table>` },
        { heading: "〜わりに(は) — relatively, considering", html:
          `<table class="ex-table">
             <tr><td>ねだん の<b>わりに</b> おいしい。</td><td>Tasty for the price.</td></tr>
             <tr><td>べんきょうした<b>わりに</b> てんが わるい。</td><td>Poor marks, considering how much I studied.</td></tr>
           </table>` },
        { heading: "〜だけあって — precisely because (lives up to it)", html:
          `<table class="ex-table">
             <tr><td>プロ<b>だけあって</b>、うまい。</td><td>Skilled — as you'd expect from a pro.</td></tr>
           </table>
           <div class="lesson-key"><b>Key split:</b> にしては / わりに = the result is <i>surprising</i> given the cause; だけあって / だけに = the result <i>fits</i> an impressive cause.</div>` },
      ],
      practice: [
        { label: "📖 N2 Grammar", type: "study", sel: "n2gram" },
        { label: "📖 Complex grammar", type: "study", sel: "n2gramcomplex" },
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
      id: "bakari-grammar", stage: "Upper-Intermediate · N2", title: "The 〜ばかり Family",
      summary: "Four faces of ばかり — just did, nothing but, not only, and simply because.",
      sections: [
        { heading: "〜たばかり — just did (recently)", html:
          `<table class="ex-table">
             <tr><td>たべた<b>ばかり</b> です。</td><td>I just ate.</td></tr>
           </table>
           <p>Feels "recently" — wider than 〜たところ, which is "this very moment".</p>` },
        { heading: "〜てばかり / 〜ばかり — nothing but", html:
          `<table class="ex-table">
             <tr><td>あそんで<b>ばかりいる</b>。</td><td>Does nothing but play.</td></tr>
             <tr><td>マンガ<b>ばかり</b> よむ。</td><td>Reads only manga.</td></tr>
           </table>` },
        { heading: "〜ばかりか & 〜ばかりに", html:
          `<table class="ex-table">
             <tr><td>〜ばかりか / ばかりでなく</td><td>not only…but also</td><td>あたまがいい<b>ばかりか</b>、やさしい</td></tr>
             <tr><td>〜ばかりに</td><td>simply because (bad result)</td><td>おかねがない<b>ばかりに</b> あきらめた</td></tr>
           </table>
           <div class="lesson-key"><b>Heads up:</b> ばかりに carries regret — the result is unfortunate. ばかりか just escalates ("and on top of that").</div>` },
      ],
      practice: [
        { label: "📖 N2 Grammar", type: "study", sel: "n2gram" },
        { label: "📖 Complex grammar", type: "study", sel: "n2gramcomplex" },
        { label: "🎮 Play N2 Vocabulary", type: "game", game: "n2vocab" },
      ],
    },
    {
      id: "kagiri-grammar", stage: "Upper-Intermediate · N2", title: "〜限り: As Long As / As Far As / Unless",
      summary: "Set the boundary of a statement — while a condition holds, to the limit of what you know, or unless.",
      sections: [
        { heading: "〜限り(は) — as long as / so long as", html:
          `<table class="ex-table">
             <tr><td>いきている<b>かぎり</b>、わすれない。</td><td>As long as I live, I won't forget.</td></tr>
             <tr><td>やくそく した<b>かぎり</b> は まもる。</td><td>So long as I promised, I'll keep it.</td></tr>
           </table>` },
        { heading: "〜ない限り — unless", html:
          `<table class="ex-table">
             <tr><td>あやまら<b>ないかぎり</b> ゆるさない。</td><td>I won't forgive you unless you apologize.</td></tr>
           </table>` },
        { heading: "〜限りでは — as far as (I know / can tell)", html:
          `<table class="ex-table">
             <tr><td>わたしの しっている<b>かぎりでは</b>…</td><td>As far as I know…</td></tr>
             <tr><td>みた<b>かぎりでは</b> もんだい ない。</td><td>From what I saw, no problems.</td></tr>
           </table>
           <div class="lesson-key"><b>Tip:</b> 限りでは limits a claim to your information ("as far as I'm aware"); 限り(は)/ない限り set a real condition for the main clause.</div>` },
      ],
      practice: [
        { label: "📖 N2 Grammar", type: "study", sel: "n2gram" },
        { label: "📖 Formal grammar", type: "study", sel: "n2gramformal" },
        { label: "🎮 Play N2 Vocabulary", type: "game", game: "n2vocab" },
      ],
    },
    {
      id: "n2-emphatic-neg", stage: "Upper-Intermediate · N2", title: "Emphatic Denial: 〜どころか・〜ものか・〜っこない",
      summary: "Three punchy ways to shoot something down — far from it, as if!, and no way.",
      sections: [
        { heading: "〜どころか — far from / let alone", html:
          `<table class="ex-table">
             <tr><td>やすむ<b>どころか</b>、ますます いそがしい。</td><td>Far from resting, I'm even busier.</td></tr>
             <tr><td>かんじ<b>どころか</b> ひらがな も よめない。</td><td>Can't read hiragana, let alone kanji.</td></tr>
           </table>` },
        { heading: "〜ものか / 〜もんか — as if! (strong refusal)", html:
          `<table class="ex-table">
             <tr><td>まける<b>ものか</b>。</td><td>No way I'll lose!</td></tr>
             <tr><td>あんな みせ、二度と いく<b>もんか</b>。</td><td>As if I'd ever go to that shop again.</td></tr>
           </table>` },
        { heading: "〜っこない — there's no way (casual)", html:
          `<table class="ex-table">
             <tr><td>そんなの できる<b>っこない</b>。</td><td>There's no way that's doable.</td></tr>
           </table>
           <div class="lesson-key"><b>Register:</b> ものか/もんか and っこない are emphatic and conversational — vivid in speech, too informal for formal writing.</div>` },
      ],
      practice: [
        { label: "📖 N2 Grammar", type: "study", sel: "n2gram" },
        { label: "📖 Complex grammar", type: "study", sel: "n2gramcomplex" },
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
      id: "koto-grammar", stage: "Upper-Intermediate · N2", title: "The 〜こと Family: Advice, No-Need, How!",
      summary: "こと turns a verb into advice you should take, a worry you can drop, or an exclamation.",
      sections: [
        { heading: "〜ことだ — you should / the thing to do is", html:
          `<table class="ex-table">
             <tr><td>ごうかくしたければ、まいにち べんきょうする<b>ことだ</b>。</td><td>If you want to pass, you should study daily.</td></tr>
           </table>` },
        { heading: "〜ことはない & 〜ことか", html:
          `<table class="ex-table">
             <tr><td>〜ことはない</td><td>there's no need to</td><td>しんぱいする<b>ことはない</b></td></tr>
             <tr><td>〜ことか</td><td>how …! (exclaim)</td><td>どんなに うれしかった<b>ことか</b></td></tr>
           </table>` },
        { heading: "〜ないことには — unless / without", html:
          `<table class="ex-table">
             <tr><td>やってみ<b>ないことには</b> わからない。</td><td>You won't know unless you try.</td></tr>
           </table>
           <div class="lesson-key"><b>Don't confuse:</b> ことだ (advice) vs ことになる/ことにする (decisions, covered earlier). Here こと turns the verb into a piece of counsel or feeling.</div>` },
      ],
      practice: [
        { label: "📖 N2 Grammar", type: "study", sel: "n2gram" },
        { label: "📖 Complex grammar", type: "study", sel: "n2gramcomplex" },
        { label: "🎮 Play N2 Vocabulary", type: "game", game: "n2vocab" },
      ],
    },
    {
      id: "shidai-ue", stage: "Upper-Intermediate · N2", title: "Upon / As Soon As: 〜次第・〜上で・〜上は",
      summary: "Three formal patterns for sequencing: the trigger, the prerequisite, and the resolve.",
      sections: [
        { heading: "〜次第 — as soon as (then act)", html:
          `<table class="ex-table">
             <tr><td>けってい<b>しだい</b> おしらせします。</td><td>I'll let you know as soon as it's decided.</td></tr>
           </table>
           <p>Attaches to the verb stem; the second clause is something you'll do, not a past event.</p>` },
        { heading: "〜上で — upon / after doing", html:
          `<table class="ex-table">
             <tr><td>そうだんした<b>うえで</b> きめます。</td><td>I'll decide after consulting.</td></tr>
           </table>` },
        { heading: "〜上は — now that (given it's so)", html:
          `<table class="ex-table">
             <tr><td>やくそく した<b>うえは</b>、まもる。</td><td>Now that I've promised, I'll keep it.</td></tr>
           </table>
           <div class="lesson-key"><b>Quick map:</b> 次第 = timing trigger; 上で = a required prior step; 上は = a resolve that follows from a fact (often with もう / 以上).</div>` },
      ],
      practice: [
        { label: "📖 N2 Grammar", type: "study", sel: "n2gram" },
        { label: "📖 Formal grammar", type: "study", sel: "n2gramformal" },
        { label: "🎮 Play N2 Vocabulary", type: "game", game: "n2vocab" },
      ],
    },
    {
      id: "without-doing", stage: "Upper-Intermediate · N2", title: "Without Doing: 〜ず(に)・〜ことなく・〜抜きで",
      summary: "Formal and literary ways to say something happened with one action left out.",
      sections: [
        { heading: "〜ず(に) — without doing (literary 〜ないで)", html:
          `<table class="ex-table">
             <tr><td>なに も いわ<b>ずに</b> でていった。</td><td>Left without saying anything.</td></tr>
           </table>
           <p>する becomes せ<b>ず(に)</b> (irregular).</p>` },
        { heading: "〜ことなく — without ever (formal)", html:
          `<table class="ex-table">
             <tr><td>やすむ<b>ことなく</b> はたらきつづけた。</td><td>Kept working without (ever) resting.</td></tr>
           </table>` },
        { heading: "〜抜きで / 〜抜きに — leaving out / minus", html:
          `<table class="ex-table">
             <tr><td>じょうだん<b>ぬきで</b></td><td>joking aside</td></tr>
             <tr><td>あさごはん<b>ぬきで</b> でかけた。</td><td>Went out without breakfast.</td></tr>
           </table>
           <div class="lesson-key"><b>Register:</b> ず(に) and ことなく are written/formal; 〜ないで is the everyday spoken equivalent. 抜きで is more concrete ("minus that item").</div>` },
      ],
      practice: [
        { label: "📖 N2 Grammar", type: "study", sel: "n2gram" },
        { label: "📖 Formal grammar", type: "study", sel: "n2gramformal" },
        { label: "🎮 Play N2 Vocabulary", type: "game", game: "n2vocab" },
      ],
    },
    {
      id: "result-end", stage: "Upper-Intermediate · N2", title: "Ending Up: 〜あげく・〜末に・〜きり",
      summary: "Frame a final result after a long process — and a state that's stuck since the last time.",
      sections: [
        { heading: "〜あげく(に) — after all that, (bad) end", html:
          `<table class="ex-table">
             <tr><td>さんざん なやんだ<b>あげく</b>、やめた。</td><td>After agonizing endlessly, I quit.</td></tr>
           </table>
           <p>The result is usually negative or a letdown.</p>` },
        { heading: "〜末(に) — after much …, finally", html:
          `<table class="ex-table">
             <tr><td>ながい こうしょう の<b>すえに</b> ごういした。</td><td>After long negotiations, they finally agreed.</td></tr>
           </table>
           <p>More neutral than あげく — the outcome can be good or bad, reached after effort.</p>` },
        { heading: "〜きり — since (and no change)", html:
          `<table class="ex-table">
             <tr><td>かれとは あの ひ あった<b>きり</b> だ。</td><td>I haven't seen him since that day.</td></tr>
             <tr><td>ねた<b>きり</b> の せいかつ</td><td>a bedridden life</td></tr>
           </table>
           <div class="lesson-key"><b>Pick by feel:</b> あげく = exasperating end; 末に = hard-won conclusion; 〜たきり = a state frozen since one last action.</div>` },
      ],
      practice: [
        { label: "📖 N2 Grammar", type: "study", sel: "n2gram" },
        { label: "📖 Complex grammar", type: "study", sel: "n2gramcomplex" },
        { label: "🎮 Play N2 Vocabulary", type: "game", game: "n2vocab" },
      ],
    },
    {
      id: "sudden-timing", stage: "Upper-Intermediate · N2", title: "The Instant: 〜とたんに・〜かと思うと",
      summary: "Mark a sharp, often surprising turn the moment one thing happens.",
      sections: [
        { heading: "〜たとたん(に) — the moment that (surprise)", html:
          `<table class="ex-table">
             <tr><td>ドア を あけた<b>とたん</b>、ねこ が とびだした。</td><td>The moment I opened the door, the cat shot out.</td></tr>
           </table>
           <p>Always past + とたん; the second clause is an unexpected, instantaneous result.</p>` },
        { heading: "〜かと思うと / 〜かと思ったら — no sooner…than", html:
          `<table class="ex-table">
             <tr><td>ないている<b>かと思うと</b>、もう わらっている。</td><td>One second crying, the next already laughing.</td></tr>
           </table>` },
        { heading: "Contrast with neutral timing", html:
          `<div class="lesson-key"><b>Surprise vs schedule:</b> とたん / かと思うと carry a jolt of surprise about something already happened. For a planned "as soon as X, I'll do Y", use 〜次第 or 〜たら instead.</div>` },
      ],
      practice: [
        { label: "📖 N2 Grammar", type: "study", sel: "n2gram" },
        { label: "📖 Complex grammar", type: "study", sel: "n2gramcomplex" },
        { label: "🎮 Play N2 Vocabulary", type: "game", game: "n2vocab" },
      ],
    },
    {
      id: "assertion-n2", stage: "Upper-Intermediate · N2", title: "Assertion: 〜にすぎない・〜にほかならない・〜というものだ",
      summary: "Pin a claim down firmly — it's nothing more than, nothing other than, or simply what something is.",
      sections: [
        { heading: "〜にすぎない — nothing more than", html:
          `<table class="ex-table">
             <tr><td>それは いいわけ<b>にすぎない</b>。</td><td>That's nothing more than an excuse.</td></tr>
           </table>` },
        { heading: "〜にほかならない — nothing other than", html:
          `<table class="ex-table">
             <tr><td>せいこう は どりょく の けっか<b>にほかならない</b>。</td><td>Success is nothing other than the result of effort.</td></tr>
           </table>` },
        { heading: "〜というものだ — that's what … really is", html:
          `<table class="ex-table">
             <tr><td>それ が しんゆう<b>というものだ</b>。</td><td>That's what a true friend is.</td></tr>
           </table>
           <div class="lesson-key"><b>Map:</b> にすぎない downplays ("merely"); にほかならない asserts the one true cause ("none other than"); というものだ delivers a definition or verdict.</div>` },
      ],
      practice: [
        { label: "📖 N2 Grammar", type: "study", sel: "n2gram" },
        { label: "📖 Formal grammar", type: "study", sel: "n2gramformal" },
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
      id: "partial-negation", stage: "Upper-Intermediate · N2", title: "Not Necessarily: 〜とは限らない・〜ないとも限らない",
      summary: "Hedge against absolutes — say something isn't always so, or isn't out of the question.",
      sections: [
        { heading: "〜とは限らない — not necessarily", html:
          `<table class="ex-table">
             <tr><td>たかい もの が いい<b>とはかぎらない</b>。</td><td>Expensive doesn't necessarily mean good.</td></tr>
             <tr><td>にほんじん が みな すしずき<b>とはかぎらない</b>。</td><td>Not all Japanese people like sushi.</td></tr>
           </table>` },
        { heading: "〜ないとも限らない — it's not impossible that", html:
          `<table class="ex-table">
             <tr><td>じこ が おき<b>ないとも限らない</b>。</td><td>An accident isn't out of the question.</td></tr>
           </table>
           <p>A double negative — "not the case that it won't" = it just might.</p>` },
        { heading: "〜とは言えない — can't really say", html:
          `<table class="ex-table">
             <tr><td>これで あんぜん<b>とはいえない</b>。</td><td>I can't call this safe.</td></tr>
           </table>
           <div class="lesson-key"><b>Use:</b> all three soften a claim. とは限らない denies "always"; ないとも限らない admits a faint possibility; とは言えない withholds a firm verdict.</div>` },
      ],
      practice: [
        { label: "📖 N2 Grammar", type: "study", sel: "n2gram" },
        { label: "📖 Complex grammar", type: "study", sel: "n2gramcomplex" },
        { label: "🎮 Play N2 Vocabulary", type: "game", game: "n2vocab" },
      ],
    },
    {
      id: "emphatic-conditional", stage: "Upper-Intermediate · N2", title: "Precisely Because / If You Dare: 〜ばこそ・〜ものなら",
      summary: "Emphatic conditionals — the sole positive reason, a dire what-if, and a challenge.",
      sections: [
        { heading: "〜ばこそ — precisely because", html:
          `<table class="ex-table">
             <tr><td>あいしている<b>ばこそ</b>、しかる。</td><td>I scold you precisely because I love you.</td></tr>
           </table>
           <p>Stresses the one real (positive) reason; formal in tone.</p>` },
        { heading: "〜(よ)うものなら — if such a thing were to happen", html:
          `<table class="ex-table">
             <tr><td>おくれ<b>ようものなら</b>、おおごと だ。</td><td>If I were so much as late, it'd be a big deal.</td></tr>
           </table>
           <p>Warns of a serious/bad consequence from even a small slip.</p>` },
        { heading: "〜ものなら — if you can / if you dare", html:
          `<table class="ex-table">
             <tr><td>できる<b>ものなら</b> やってみろ。</td><td>Do it, if you can!</td></tr>
           </table>
           <div class="lesson-key"><b>Three feels:</b> ばこそ = emphatic positive cause; (よ)うものなら = dire hypothetical; できるものなら = wish or dare.</div>` },
      ],
      practice: [
        { label: "📖 N2 Grammar", type: "study", sel: "n2gram" },
        { label: "📖 Formal grammar", type: "study", sel: "n2gramformal" },
        { label: "🎮 Play N2 Vocabulary", type: "game", game: "n2vocab" },
      ],
    },
    {
      id: "for-toward", stage: "Upper-Intermediate · N2", title: "For / In Response To: 〜向け・〜にこたえて・〜をこめて",
      summary: "Aim something at an audience, answer expectations, and pour feeling into an act.",
      sections: [
        { heading: "〜向け vs 〜向き", html:
          `<table class="ex-table">
             <tr><td>〜向け(の/に)</td><td>aimed at (target)</td><td>しょしんしゃ<b>むけ</b> の ほん</td></tr>
             <tr><td>〜向き(の/に)</td><td>suited to / facing</td><td>こども<b>むき</b> の ばんぐみ、みなみ<b>むき</b> の へや</td></tr>
           </table>` },
        { heading: "〜にこたえて — in response to", html:
          `<table class="ex-table">
             <tr><td>きたい<b>にこたえて</b> がんばる。</td><td>I'll do my best to live up to your hopes.</td></tr>
           </table>` },
        { heading: "〜をこめて — putting (feeling) into", html:
          `<table class="ex-table">
             <tr><td>こころ<b>をこめて</b> つくった。</td><td>I made it with all my heart.</td></tr>
           </table>
           <div class="lesson-key"><b>Classic trap:</b> 向け = intended <i>for</i> (made with that audience in mind); 向き = suited <i>to</i> / facing. Don't swap them.</div>` },
      ],
      practice: [
        { label: "📖 N2 Grammar", type: "study", sel: "n2gram" },
        { label: "📖 Formal grammar", type: "study", sel: "n2gramformal" },
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
    {
      id: "koto-reasoning", stage: "Upper-Intermediate · N2", title: "Emotive & Reasoning こと: 〜ことに・〜ことだから・〜ことから",
      summary: "Three more jobs for こと — front an emotion, reason from character, and reason from evidence.",
      sections: [
        { heading: "〜ことに(は) — to my (emotion)", html:
          `<table class="ex-table">
             <tr><td>うれしい<b>ことに</b>、ごうかくした。</td><td>To my delight, I passed.</td></tr>
             <tr><td>おどろいた<b>ことに</b>…</td><td>To my surprise…</td></tr>
           </table>
           <p>Fronts a feeling before the fact that caused it; uses emotion words (うれしい・残念・困った).</p>` },
        { heading: "〜ことだから — since it's (knowing them)", html:
          `<table class="ex-table">
             <tr><td>かれの<b>ことだから</b>、また おくれるだろう。</td><td>Knowing him, he'll be late again.</td></tr>
           </table>` },
        { heading: "〜ことから — from the fact that", html:
          `<table class="ex-table">
             <tr><td>まど が われている<b>ことから</b>、どろぼう と わかった。</td><td>From the broken window, we knew it was a burglar.</td></tr>
           </table>
           <div class="lesson-key"><b>Split:</b> ことに = emotional reaction; ことだから = inference from someone's known character; ことから = a conclusion drawn from evidence or an origin.</div>` },
      ],
      practice: [
        { label: "📖 N2 Grammar", type: "study", sel: "n2gram" },
        { label: "📖 Complex grammar", type: "study", sel: "n2gramcomplex" },
        { label: "🎮 Play N2 Vocabulary", type: "game", game: "n2vocab" },
      ],
    },
    {
      id: "amari-result", stage: "Upper-Intermediate · N2", title: "Out of Too Much: 〜あまり・〜のあまり",
      summary: "An excess of feeling or degree that drives an unusual result.",
      sections: [
        { heading: "〜のあまり / 〜あまり(に) — out of excessive…", html:
          `<table class="ex-table">
             <tr><td>うれしさ<b>のあまり</b> ないて しまった。</td><td>I cried out of sheer joy.</td></tr>
             <tr><td>しんぱいする<b>あまり</b>、ねむれなかった。</td><td>I worried so much I couldn't sleep.</td></tr>
           </table>` },
        { heading: "Noun vs verb form", html:
          `<table class="ex-table">
             <tr><td>noun + のあまり</td><td>かなしみ<b>のあまり</b></td></tr>
             <tr><td>verb + あまり</td><td>かんがえすぎた<b>あまり</b></td></tr>
           </table>
           <div class="lesson-key"><b>Note:</b> this is the "excess → consequence" あまり; don't confuse it with the everyday あまり〜ない ("not very"), a different word entirely.</div>` },
      ],
      practice: [
        { label: "📖 N2 Grammar", type: "study", sel: "n2gram" },
        { label: "📖 Formal grammar", type: "study", sel: "n2gramformal" },
        { label: "🎮 Play N2 Vocabulary", type: "game", game: "n2vocab" },
      ],
    },
    {
      id: "formal-occasion", stage: "Upper-Intermediate · N2", title: "Formal When / At: 〜際・〜にて",
      summary: "The stiff, written equivalents of とき (when) and で (at / by).",
      sections: [
        { heading: "〜際(に) — on the occasion of", html:
          `<table class="ex-table">
             <tr><td>ごりよう の<b>さいは</b> ごちゅうい ください。</td><td>Please take care when using it.</td></tr>
             <tr><td>ひじょう の<b>さい</b></td><td>in an emergency</td></tr>
           </table>
           <p>際 is the formal とき — common on signs, notices, and in business.</p>` },
        { heading: "〜にて — at / by (formal で)", html:
          `<table class="ex-table">
             <tr><td>とうきょう<b>にて</b> かいさい いたします。</td><td>To be held in Tokyo.</td></tr>
             <tr><td>メール<b>にて</b> ごれんらく ください。</td><td>Please contact us by email.</td></tr>
           </table>
           <div class="lesson-key"><b>Register:</b> both are written/formal. In speech you'd just say とき and で — save 際 / にて for announcements and documents.</div>` },
      ],
      practice: [
        { label: "📖 N2 Grammar", type: "study", sel: "n2gram" },
        { label: "📖 Formal grammar", type: "study", sel: "n2gramformal" },
        { label: "🎮 Play N2 Vocabulary", type: "game", game: "n2vocab" },
      ],
    },
    {
      id: "nishiro", stage: "Upper-Intermediate · N2", title: "Whether / Even If: 〜にしろ・〜にせよ・〜にしても",
      summary: "Concede across options — whether one or the other, it makes no difference.",
      sections: [
        { heading: "〜にしろ〜にしろ / 〜にせよ〜にせよ — whether…or", html:
          `<table class="ex-table">
             <tr><td>いく<b>にしろ</b> いかない<b>にしろ</b>、れんらく して。</td><td>Whether you go or not, let me know.</td></tr>
           </table>
           <p>にせよ is the slightly more formal twin of にしろ.</p>` },
        { heading: "〜にしても — even if / even granting", html:
          `<table class="ex-table">
             <tr><td>むずかしい<b>にしても</b>、やる しかない。</td><td>Even if it's hard, we have no choice but to do it.</td></tr>
             <tr><td>いそがしい<b>にしても</b>、れんらく ぐらい して。</td><td>Busy or not, at least get in touch.</td></tr>
           </table>
           <div class="lesson-key"><b>Use:</b> paired にしろ〜にしろ covers both alternatives; single にしても concedes one point ("even granting that…").</div>` },
      ],
      practice: [
        { label: "📖 N2 Grammar", type: "study", sel: "n2gram" },
        { label: "📖 Complex grammar", type: "study", sel: "n2gramcomplex" },
        { label: "🎮 Play N2 Vocabulary", type: "game", game: "n2vocab" },
      ],
    },
    {
      id: "debate", stage: "Upper-Intermediate · N2", title: "Debate & Persuasion Language",
      summary: "Stating a position, backing it up, conceding a point, and rebutting — the grammar of argument.",
      sections: [
        { heading: "Stating your position", html:
          `<p>Persuasion starts with a clear claim. N2 gives you firmer, more formal ways to assert one than plain 〜と思う:</p>
           <table class="ex-table">
             <tr><td>〜と考える</td><td>I hold / take the view that ~ (measured, written)</td></tr>
             <tr><td>〜べきだ</td><td>ought to / should (as a matter of principle)</td></tr>
             <tr><td>〜に違いない</td><td>there's no doubt that ~</td></tr>
             <tr><td>〜と主張する</td><td>to assert / claim ~</td></tr>
           </table>
           <p>私は、在宅勤務をもっと認める<b>べきだと考えます</b>。</p>` },
        { heading: "Building the argument", html:
          `<p>An argument persuades through structure. Signpost your reasons so the listener can follow:</p>
           <ul>
             <li>Order: <b>第一に〜、第二に〜、さらに〜</b> ("first…, second…, furthermore…").</li>
             <li>Cause: <b>なぜなら〜からだ</b> ("the reason being that ~").</li>
             <li>Evidence: <b>〜という事実から</b> ("from the fact that ~"), データによると ("according to the data").</li>
             <li>Result: <b>したがって / その結果</b> ("therefore / as a result").</li>
           </ul>` },
        { heading: "Conceding & rebutting", html:
          `<p>Strong persuasion acknowledges the other side, then turns it. This <b>concession → rebuttal</b> move is the heart of debate:</p>
           <table class="ex-table">
             <tr><td>確かに〜が、</td><td>admittedly ~, but… (concede, then pivot)</td></tr>
             <tr><td>とはいえ / とはいうものの</td><td>that said / having said that</td></tr>
             <tr><td>〜に対して</td><td>in contrast to / as against ~</td></tr>
             <tr><td>〜とは限らない</td><td>it isn't necessarily the case that ~</td></tr>
             <tr><td>〜わけではない</td><td>it's not that ~ (softens an overstatement)</td></tr>
           </table>
           <p><b>確かに</b>コストはかかります<b>が</b>、長期的に見れば利益のほうが大きいの<b>ではないでしょうか</b>。</p>` },
        { heading: "Softening to win people over", html:
          `<p>Japanese argument prizes not <i>winning</i> but bringing the other side along. Blunt assertions backfire; hedged ones persuade:</p>
           <ul>
             <li><b>〜のではないでしょうか</b> — "might it not be that ~?" (a claim dressed as a gentle question).</li>
             <li><b>〜と言えるでしょう</b> — "one could say that ~" (confident but not absolute).</li>
             <li>Invite agreement: 〜と思いませんか, 〜ではないかと思います.</li>
           </ul>
           <div class="lesson-key"><b>The shape of a persuasive turn:</b> state the claim (〜べきだ) → give ordered reasons (第一に〜、なぜなら〜からだ) → concede the counter (確かに〜が) → rebut and soft-land (〜のではないでしょうか). Master that arc and you can argue a point in Japanese without sounding aggressive.</div>` },
      ],
      practice: [
        { label: "📖 N2 Formal Expressions", type: "study", sel: "n2gramformal" },
        { label: "📖 N2 Written Expression", type: "study", sel: "n2phrwritten" },
        { label: "🎮 Play N2 Vocabulary", type: "game", game: "n2vocab" },
      ],
    },
    {
      id: "wake-grammar", stage: "Upper-Intermediate · N2", title: "The わけ Family: Logic, Conclusions & Limits",
      summary: "わけだ, わけではない, わけがない, わけにはいかない — four high-frequency patterns built on one idea, endlessly confused.",
      sections: [
        { heading: "One word, one core idea", html:
          `<p><b>わけ (訳)</b> literally means "reason / the logic of things". Every pattern below is that core meaning bent in a different direction — so once you feel the base, the four stop blurring together. They are among the most-tested N2 grammar points and recur constantly in writing and speech.</p>
           <p>Grammatically, わけ is a noun, so it attaches to the <b>plain form</b> the way a noun-modifier does: 高い<b>わけ</b>, 行く<b>わけ</b>, 学生な<b>わけ</b>, 静かな<b>わけ</b>.</p>` },
        { heading: "〜わけだ — 'that means / no wonder'", html:
          `<p><b>〜わけだ</b> presents something as a <b>natural conclusion</b> that follows from the facts. Two flavours:</p>
           <ul>
             <li><b>Drawing the logical consequence</b>: 三時間も歩いた。疲れる<b>わけだ</b>。("Walked three hours — no wonder I'm tired.")</li>
             <li><b>Restating / making sense of something</b>: つまり、君は反対という<b>わけだ</b>ね。("So what you mean is you're against it.")</li>
           </ul>
           <p>Often paired with <b>道理で</b> or <b>どうりで</b> ("no wonder"): どうりで寒い<b>わけだ</b>、窓が開いている。</p>` },
        { heading: "〜わけではない — 'it's not (necessarily) that'", html:
          `<p><b>〜わけではない</b> is a <b>partial negation</b>. It walks back an overstatement the listener might have inferred — "I'm not saying it's totally the case". It denies a <i>conclusion</i>, not a fact:</p>
           <table class="ex-table">
             <tr><td>嫌いな<b>わけではない</b>。</td><td>It's not that I dislike it (I just…).</td></tr>
             <tr><td>全部できない<b>わけではない</b>。</td><td>It's not that I can't do any of it.</td></tr>
           </table>
           <p>Compare flat 嫌いではない ("I don't dislike it") — わけではない specifically heads off a wrong conclusion. The casual form is <b>〜わけじゃない</b>.</p>` },
        { heading: "〜わけがない vs 〜わけにはいかない", html:
          `<p>These two look alike but mean opposite kinds of "can't". Keeping them apart is the whole game:</p>
           <table class="ex-table">
             <tr><th>pattern</th><th>meaning</th><th>example</th></tr>
             <tr><td>〜わけがない</td><td>there's <b>no way</b> it could be — logical impossibility / strong denial</td><td>彼が知らない<b>わけがない</b>。("No way he doesn't know.")</td></tr>
             <tr><td>〜わけにはいかない</td><td><b>can't</b> (bring myself to) — blocked by duty, morals or circumstance, not by ability</td><td>約束したから、行かない<b>わけにはいかない</b>。("I promised, so I can't just not go.")</td></tr>
           </table>
           <p>わけがない is about what's <i>possible</i>; わけにはいかない is about what's <i>permissible</i>. Note the double-negative trick: 〜ない<b>わけにはいかない</b> = "have no choice but to do it".</p>` },
        { heading: "Pulling the family together", html:
          `<div class="lesson-key"><b>The four at a glance:</b> 〜わけだ = "so that's why / it follows"; 〜わけではない = "it's not (entirely) that"; 〜わけがない = "no way / impossible"; 〜わけにはいかない = "can't, for reasons beyond ability". All four flow from わけ = the logic of the situation.</div>
           <p>そんなに簡単に成功する<b>わけがない</b>。でも、努力が無駄だった<b>わけではない</b>。ここで諦める<b>わけにはいかない</b>のだ。</p>` },
      ],
      practice: [
        { label: "📖 All N2 Grammar", type: "study", sel: "n2gram" },
        { label: "📖 N2 Complex Structures", type: "study", sel: "n2gramcomplex" },
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
      id: "n1-negative-outcome", stage: "Advanced · N1", title: "Unfortunate Outcomes: 〜きらいがある・〜しまつだ・〜ずじまい",
      summary: "Patterns that frame a tendency or result as regrettable — a flaw, a mess, or a thing left undone.",
      sections: [
        { heading: "〜きらいがある — has a (bad) tendency to", html:
          `<table class="ex-table">
             <tr><td>かれは おおげさに いう<b>きらいがある</b>。</td><td>He has a tendency to exaggerate.</td></tr>
           </table>` },
        { heading: "〜しまつだ — end up (badly)", html:
          `<table class="ex-table">
             <tr><td>けんかして、けがを する<b>しまつだ</b>。</td><td>They fought and ended up getting hurt.</td></tr>
           </table>
           <p>Caps off a string of bad developments — "and in the end, it came to this".</p>` },
        { heading: "〜ずじまい — ended without doing", html:
          `<table class="ex-table">
             <tr><td>けっきょく あえ<b>ずじまい</b>だった。</td><td>In the end, I never got to meet them.</td></tr>
           </table>
           <div class="lesson-key"><b>Feel:</b> all three carry regret/criticism. ずじまい specifically marks an intention that quietly went unrealized (often with けっきょく).</div>` },
      ],
      practice: [
        { label: "📖 N1 Grammar", type: "study", sel: "n1gram" },
        { label: "📖 Advanced structures", type: "study", sel: "n1gramadvanced" },
        { label: "🎮 Play N1 Vocabulary", type: "game", game: "n1vocab" },
      ],
    },
    {
      id: "n1-judgment", stage: "Advanced · N1", title: "Judgment & Negation: 〜にあたらない・〜にたえない・〜まい",
      summary: "Weigh in on what's warranted, what's unbearable, and what surely won't happen.",
      sections: [
        { heading: "〜には当たらない — no need to / not worth", html:
          `<table class="ex-table">
             <tr><td>おどろく<b>にはあたらない</b>。</td><td>It's nothing to be surprised at.</td></tr>
           </table>` },
        { heading: "〜にたえない — can't bear to / unbearable", html:
          `<table class="ex-table">
             <tr><td>みる<b>にたえない</b>。</td><td>I can't bear to watch.</td></tr>
             <tr><td>(opposite) よむ<b>にたえる</b> さくひん</td><td>a work worth reading</td></tr>
           </table>` },
        { heading: "〜まい — won't / surely not", html:
          `<table class="ex-table">
             <tr><td>二度と する<b>まい</b>。</td><td>I'll never do it again. (negative will)</td></tr>
             <tr><td>かれは こ<b>まい</b>。</td><td>He surely won't come. (negative guess)</td></tr>
           </table>
           <div class="lesson-key"><b>Two senses of まい:</b> after one's own action = firm refusal/resolve; about someone/something else = "probably not". Formal/literary either way.</div>` },
      ],
      practice: [
        { label: "📖 N1 Grammar", type: "study", sel: "n1gram" },
        { label: "📖 Advanced structures", type: "study", sel: "n1gramadvanced" },
        { label: "🎮 Play N1 Vocabulary", type: "game", game: "n1vocab" },
      ],
    },
    {
      id: "n1-status", stage: "Advanced · N1", title: "Befitting a Position: 〜ともなると・〜ともあろう・〜たる",
      summary: "Talk about what a certain rank or role naturally entails — or fails to live up to.",
      sections: [
        { heading: "〜ともなると / ともなれば — once it reaches (that level)", html:
          `<table class="ex-table">
             <tr><td>しゃちょう<b>ともなると</b>、せきにん が おもい。</td><td>Once you're company president, the responsibility is heavy.</td></tr>
           </table>` },
        { heading: "〜ともあろう — someone as (expected better)", html:
          `<table class="ex-table">
             <tr><td>きょうし<b>ともあろう</b> もの が…</td><td>A teacher, of all people, doing that…</td></tr>
           </table>
           <p>Carries reproach — "a person in that position should know better".</p>` },
        { heading: "〜たる — in the position of (formal)", html:
          `<table class="ex-table">
             <tr><td>しどうしゃ<b>たる</b> もの は…</td><td>One who is a leader must…</td></tr>
           </table>
           <div class="lesson-key"><b>Register:</b> all three are formal/written and attach to nouns of role or rank. ともあろう adds disappointment; たる is stiff and declarative.</div>` },
      ],
      practice: [
        { label: "📖 N1 Grammar", type: "study", sel: "n1gram" },
        { label: "📖 Literary grammar", type: "study", sel: "n1gramliterary" },
        { label: "🎮 Play N1 Vocabulary", type: "game", game: "n1vocab" },
      ],
    },
    {
      id: "n1-pairs", stage: "Advanced · N1", title: "Whether & Both: 〜なり〜なり・〜といい〜といい・〜であれ〜であれ",
      summary: "Paired patterns offering a choice, praising two things at once, or covering all cases.",
      sections: [
        { heading: "〜なり〜なり — whether…or (do one)", html:
          `<table class="ex-table">
             <tr><td>でんわ<b>なり</b> メール<b>なり</b> で れんらく して。</td><td>Get in touch by phone or email — either's fine.</td></tr>
           </table>` },
        { heading: "〜といい〜といい — both…and (evaluation)", html:
          `<table class="ex-table">
             <tr><td>いろ<b>といい</b> かたち<b>といい</b>、すばらしい。</td><td>The color, the shape — it's wonderful all round.</td></tr>
           </table>` },
        { heading: "〜であれ〜であれ — whether X or Y (no matter)", html:
          `<table class="ex-table">
             <tr><td>おとな<b>であれ</b> こども<b>であれ</b>、ルール は おなじ。</td><td>Adult or child, the rules are the same.</td></tr>
           </table>
           <div class="lesson-key"><b>Don't mix:</b> なり〜なり = pick one of the options; といい〜といい = "in every respect"; であれ〜であれ = "in all cases" (concessive).</div>` },
      ],
      practice: [
        { label: "📖 N1 Grammar", type: "study", sel: "n1gram" },
        { label: "📖 Advanced structures", type: "study", sel: "n1gramadvanced" },
        { label: "🎮 Play N1 Vocabulary", type: "game", game: "n1vocab" },
      ],
    },
    {
      id: "n1-covered", stage: "Advanced · N1", title: "Covered In / Nothing But: 〜まみれ・〜だらけ・〜ずくめ",
      summary: "Three suffixes for 'absolutely full of' — grime, faults, or (with ずくめ) good things.",
      sections: [
        { heading: "〜まみれ — coated in (physical mess)", html:
          `<table class="ex-table">
             <tr><td>どろ<b>まみれ</b>・あせ<b>まみれ</b></td><td>covered in mud / sweat</td></tr>
           </table>
           <p>Used for substances physically smeared over a surface.</p>` },
        { heading: "〜だらけ — full of (mostly bad)", html:
          `<table class="ex-table">
             <tr><td>まちがい<b>だらけ</b>・きず<b>だらけ</b></td><td>full of mistakes / covered in scratches</td></tr>
           </table>` },
        { heading: "〜ずくめ — nothing but (often good)", html:
          `<table class="ex-table">
             <tr><td>いいこと<b>ずくめ</b>。</td><td>nothing but good things.</td></tr>
             <tr><td>くろ<b>ずくめ</b> の ふくそう</td><td>an all-black outfit</td></tr>
           </table>
           <div class="lesson-key"><b>Split:</b> まみれ = a physical coating; だらけ = strewn with (usually unwanted) things; ずくめ = entirely composed of (often positive).</div>` },
      ],
      practice: [
        { label: "📖 N1 Grammar", type: "study", sel: "n1gram" },
        { label: "📖 Literary grammar", type: "study", sel: "n1gramliterary" },
        { label: "🎮 Play N1 Vocabulary", type: "game", game: "n1vocab" },
      ],
    },
    {
      id: "n1-concessive2", stage: "Advanced · N1", title: "Even So / If Only: 〜とはいえ・〜ものを・〜たところで",
      summary: "Three literary concessions — granting a point, voicing regret, and dismissing a futile effort.",
      sections: [
        { heading: "〜とはいえ — even so / although", html:
          `<table class="ex-table">
             <tr><td>はる<b>とはいえ</b>、まだ さむい。</td><td>It's spring, and yet it's still cold.</td></tr>
           </table>` },
        { heading: "〜ものを — if only…(but) / and yet", html:
          `<table class="ex-table">
             <tr><td>いって くれれば てつだった<b>ものを</b>。</td><td>If only you'd told me, I'd have helped…</td></tr>
           </table>
           <p>Carries reproach or regret that things didn't go the sensible way.</p>` },
        { heading: "〜たところで — even if (it's futile)", html:
          `<table class="ex-table">
             <tr><td>いまさら いそいだ<b>ところで</b> まにあわない。</td><td>Even if you hurry now, you won't make it.</td></tr>
           </table>
           <div class="lesson-key"><b>Feel:</b> とはいえ = a fair concession; ものを = "you should have…" regret; たところで = the effort changes nothing.</div>` },
      ],
      practice: [
        { label: "📖 N1 Grammar", type: "study", sel: "n1gram" },
        { label: "📖 Advanced structures", type: "study", sel: "n1gramadvanced" },
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
      id: "compound-particles1", stage: "Advanced · N1", title: "Formal Particles I: 〜をはじめ・〜をめぐって・〜にあたって",
      summary: "Heavy-duty compound particles you meet in news and formal writing.",
      sections: [
        { heading: "〜をはじめ(として) — starting with / including", html:
          `<p>Names a prime example that leads a larger group:</p>
           <table class="ex-table">
             <tr><td>とうきょう<b>をはじめ</b>、ぜんこく で。</td><td>Nationwide, starting with Tokyo.</td></tr>
           </table>` },
        { heading: "〜をめぐって — over / concerning (a dispute)", html:
          `<table class="ex-table">
             <tr><td>いさん<b>をめぐって</b> あらそう。</td><td>To quarrel over the inheritance.</td></tr>
             <tr><td>その けっていを<b>めぐる</b> ぎろん。</td><td>The debate surrounding that decision.</td></tr>
           </table>` },
        { heading: "〜にあたって / にあたり — on the occasion of", html:
          `<table class="ex-table">
             <tr><td>かいかい<b>にあたって</b> ひとこと。</td><td>A word on the occasion of the opening.</td></tr>
           </table>
           <div class="lesson-key"><b>Register:</b> all three are written/formal. にあたって marks an important juncture (ceremonies, launches); for ordinary "when", stick with 〜とき.</div>` },
      ],
      practice: [
        { label: "📖 N1 Grammar", type: "study", sel: "n1gram" },
        { label: "📖 Advanced structures", type: "study", sel: "n1gramadvanced" },
        { label: "🎮 Play N1 Vocabulary", type: "game", game: "n1vocab" },
      ],
    },
    {
      id: "n1-emotive", stage: "Advanced · N1", title: "Can't Help But: 〜ずにはいられない・〜てやまない",
      summary: "Forceful, heartfelt expressions for feelings you can't hold back.",
      sections: [
        { heading: "〜ずにはいられない — can't help doing", html:
          `<table class="ex-table">
             <tr><td>わらわ<b>ずにはいられない</b>。</td><td>I can't help laughing.</td></tr>
             <tr><td>(also) 〜ないではいられない</td><td>same meaning, slightly softer</td></tr>
           </table>
           <p>する → せ<b>ずにはいられない</b> (irregular stem).</p>` },
        { heading: "〜てやまない — sincerely, endlessly", html:
          `<table class="ex-table">
             <tr><td>ごせいこう を ねがっ<b>てやまない</b>。</td><td>I sincerely wish you every success.</td></tr>
           </table>
           <p>Reserved for strong, heartfelt wishes (願う, 期待する, 愛する).</p>` },
        { heading: "〜を禁じ得ない — can't suppress (formal)", html:
          `<table class="ex-table">
             <tr><td>どうじょう<b>を きんじえない</b>。</td><td>I can't suppress my sympathy.</td></tr>
           </table>
           <div class="lesson-key"><b>Tone:</b> these are emphatic and literary — powerful in writing or speeches, too heavy for casual chat.</div>` },
      ],
      practice: [
        { label: "📖 N1 Grammar", type: "study", sel: "n1gram" },
        { label: "📖 Literary grammar", type: "study", sel: "n1gramliterary" },
        { label: "🎮 Play N1 Vocabulary", type: "game", game: "n1vocab" },
      ],
    },
    {
      id: "regardless-grammar", stage: "Advanced · N1", title: "Regardless / Depending: 〜にかかわらず・〜を問わず・〜いかん",
      summary: "Say something holds no matter the conditions — or hinges entirely on them.",
      sections: [
        { heading: "〜にかかわらず — regardless of", html:
          `<table class="ex-table">
             <tr><td>てんき<b>にかかわらず</b> けっこうします。</td><td>It will be held regardless of the weather.</td></tr>
             <tr><td>ねんれい の いかん<b>にかかわらず</b></td><td>irrespective of age</td></tr>
           </table>` },
        { heading: "〜を問わず — irrespective of", html:
          `<table class="ex-table">
             <tr><td>けいけん<b>を とわず</b> ぼしゅう。</td><td>Now hiring — experience not required.</td></tr>
             <tr><td>だんじょ<b>を とわず</b></td><td>regardless of gender</td></tr>
           </table>` },
        { heading: "〜いかんで(は) / いかんによらず — depending on / regardless", html:
          `<table class="ex-table">
             <tr><td>けっか<b>いかんで</b> たいおう が かわる。</td><td>The response changes depending on the result.</td></tr>
             <tr><td>りゆう の<b>いかんによらず</b></td><td>regardless of the reason</td></tr>
           </table>
           <div class="lesson-key"><b>Split:</b> にかかわらず・を問わず = it doesn't matter; いかんで = it entirely depends; いかんによらず = back to "doesn't matter".</div>` },
      ],
      practice: [
        { label: "📖 N1 Grammar", type: "study", sel: "n1gram" },
        { label: "📖 Advanced structures", type: "study", sel: "n1gramadvanced" },
        { label: "🎮 Play N1 Vocabulary", type: "game", game: "n1vocab" },
      ],
    },
    {
      id: "n1-concession", stage: "Advanced · N1", title: "Though / While: 〜ながらも・〜つつ(も)・〜ものの",
      summary: "Literary ways to grant a point and then turn against it.",
      sections: [
        { heading: "〜ながら(も) — although, despite", html:
          `<table class="ex-table">
             <tr><td>せまい<b>ながらも</b> たのしい わが家。</td><td>A humble but happy home.</td></tr>
             <tr><td>ざんねん<b>ながら</b></td><td>regrettably (set phrase)</td></tr>
           </table>` },
        { heading: "〜つつ(も) — even while / even though", html:
          `<table class="ex-table">
             <tr><td>わるい と しり<b>つつも</b>、やめられない。</td><td>Even knowing it's wrong, I can't stop.</td></tr>
             <tr><td>〜つつある</td><td>in the process of (different sense): かいふくし<b>つつある</b></td></tr>
           </table>` },
        { heading: "〜ものの — although (but it didn't pan out)", html:
          `<table class="ex-table">
             <tr><td>やる と いった<b>ものの</b>、できなかった。</td><td>I said I'd do it, but couldn't.</td></tr>
           </table>
           <div class="lesson-key"><b>Note:</b> ながら/つつ attach to the verb stem; ものの follows a full plain clause. つつ also has the unrelated 〜つつある = "is gradually …-ing".</div>` },
      ],
      practice: [
        { label: "📖 N1 Grammar", type: "study", sel: "n1gram" },
        { label: "📖 Literary grammar", type: "study", sel: "n1gramliterary" },
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
      id: "as-if", stage: "Advanced · N1", title: "As If: 〜んばかり・〜とばかりに・〜(が)ごとく",
      summary: "Three literary ways to say 'as if' — visibly almost, an unspoken attitude, and bungo 'like'.",
      sections: [
        { heading: "〜んばかり(に) — almost, as if about to", html:
          `<table class="ex-table">
             <tr><td>なきださ<b>んばかり</b> の かお。</td><td>A face on the verge of bursting into tears.</td></tr>
           </table>
           <p>する becomes せ<b>んばかり</b>. Describes something that looks all but about to happen.</p>` },
        { heading: "〜とばかりに — as if to say", html:
          `<table class="ex-table">
             <tr><td>もう かえれ<b>とばかりに</b> ドアを あけた。</td><td>He opened the door as if to say "get out".</td></tr>
           </table>` },
        { heading: "〜(が)ごとく / ごとき — like (literary)", html:
          `<table class="ex-table">
             <tr><td>ゆめ の<b>ごとく</b> すぎさった。</td><td>It passed like a dream.</td></tr>
             <tr><td>わたし<b>ごとき</b> が…</td><td>Someone like me… (humble)</td></tr>
           </table>
           <div class="lesson-key"><b>Notes:</b> んばかり = visibly on the brink; とばかりに = an attitude conveyed without words; ごとし is the classical ancestor of 〜ようだ.</div>` },
      ],
      practice: [
        { label: "📖 N1 Grammar", type: "study", sel: "n1gram" },
        { label: "📖 Literary grammar", type: "study", sel: "n1gramliterary" },
        { label: "🎮 Play N1 Vocabulary", type: "game", game: "n1vocab" },
      ],
    },
    {
      id: "extreme-n1", stage: "Advanced · N1", title: "Utmost Degree: 〜極まりない・〜の極み・〜の至り",
      summary: "Dial a quality up to its absolute peak, for strong written emphasis.",
      sections: [
        { heading: "〜極まりない / 〜極まる — extremely", html:
          `<table class="ex-table">
             <tr><td>しつれい<b>きわまりない</b>。</td><td>Extremely rude.</td></tr>
             <tr><td>きんちょう<b>きわまる</b> ばめん。</td><td>An intensely tense scene.</td></tr>
           </table>` },
        { heading: "〜の極み — the height of", html:
          `<table class="ex-table">
             <tr><td>ぜいたく<b>のきわみ</b>。</td><td>The height of luxury.</td></tr>
           </table>` },
        { heading: "〜の至り — nothing short of (emotion)", html:
          `<table class="ex-table">
             <tr><td>こうえい<b>のいたり</b> です。</td><td>I'm deeply honored.</td></tr>
             <tr><td>わかげ<b>のいたり</b>。</td><td>The folly of youth.</td></tr>
           </table>
           <div class="lesson-key"><b>Attach points:</b> 極まりない/極まる take a な-adjective-like root; の極み・の至り take a noun. の至り pairs with set nouns (光栄・赤面・若気).</div>` },
      ],
      practice: [
        { label: "📖 N1 Grammar", type: "study", sel: "n1gram" },
        { label: "📖 Literary grammar", type: "study", sel: "n1gramliterary" },
        { label: "🎮 Play N1 Vocabulary", type: "game", game: "n1vocab" },
      ],
    },
    {
      id: "forced-noway", stage: "Advanced · N1", title: "Forced / No Way / Easy to See: 〜を余儀なくされる・〜べくもない・〜にかたくない",
      summary: "Three formal patterns: compelled by circumstances, utterly impossible, and easy to infer.",
      sections: [
        { heading: "〜を余儀なくされる — be forced to", html:
          `<table class="ex-table">
             <tr><td>たいかい は ちゅうし<b>を よぎなくされた</b>。</td><td>The event was forced to be cancelled.</td></tr>
           </table>
           <p>Flip side: 〜を余儀なく<b>させる</b> = (something) forces someone into it.</p>` },
        { heading: "〜べくもない — there's no way to", html:
          `<table class="ex-table">
             <tr><td>しんじつ は しる<b>べくもない</b>。</td><td>There's simply no way to know the truth.</td></tr>
           </table>` },
        { heading: "〜にかたくない — not hard to (imagine)", html:
          `<table class="ex-table">
             <tr><td>かのじょの きもち は そうぞう<b>にかたくない</b>。</td><td>Her feelings aren't hard to imagine.</td></tr>
           </table>
           <div class="lesson-key"><b>Pairings:</b> 余儀なくされる = circumstances compel; べくもない = no means whatsoever; にかたくない nearly always pairs with 想像する / 察する.</div>` },
      ],
      practice: [
        { label: "📖 N1 Grammar", type: "study", sel: "n1gram" },
        { label: "📖 Advanced structures", type: "study", sel: "n1gramadvanced" },
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
      id: "tokoro-wo", stage: "Advanced · N1", title: "〜ところ(を): At a Time When",
      summary: "Mark the very moment or situation an action interrupts — often as a polite apology.",
      sections: [
        { heading: "〜ところを — interrupting a (busy) moment", html:
          `<table class="ex-table">
             <tr><td>おいそがしい<b>ところを</b> すみません。</td><td>Sorry to trouble you when you're busy.</td></tr>
             <tr><td>おやすみ の<b>ところを</b> しつれいします。</td><td>Forgive me for intruding on your day off.</td></tr>
           </table>` },
        { heading: "Caught in the act", html:
          `<table class="ex-table">
             <tr><td>ねている<b>ところを</b> おこされた。</td><td>I was woken up while sleeping.</td></tr>
             <tr><td>にげる<b>ところを</b> つかまった。</td><td>He was caught (just) as he tried to flee.</td></tr>
           </table>
           <div class="lesson-key"><b>Don't confuse:</b> this ところを marks a <i>situation being interrupted</i> — different from 〜るところ (about to / mid-action) covered earlier.</div>` },
      ],
      practice: [
        { label: "📖 N1 Grammar", type: "study", sel: "n1gram" },
        { label: "📖 Advanced structures", type: "study", sel: "n1gramadvanced" },
        { label: "🎮 Play N1 Vocabulary", type: "game", game: "n1vocab" },
      ],
    },
    {
      id: "nishite", stage: "Advanced · N1", title: "〜にして: Only / Even / In an Instant",
      summary: "A compact literary にして — even at a point, all at once, or being two things together.",
      sections: [
        { heading: "even at / not until (a point)", html:
          `<table class="ex-table">
             <tr><td>六十さい<b>にして</b> えいご を はじめた。</td><td>He took up English even at sixty.</td></tr>
             <tr><td>いま<b>にして</b> おもえば</td><td>now that I think of it (only now)</td></tr>
           </table>` },
        { heading: "in an instant", html:
          `<table class="ex-table">
             <tr><td>いっしゅん<b>にして</b> きえた。</td><td>It vanished in an instant.</td></tr>
           </table>` },
        { heading: "being both / at once", html:
          `<table class="ex-table">
             <tr><td>かれは がくしゃ<b>にして</b> しじん だ。</td><td>He is a scholar and a poet.</td></tr>
           </table>
           <div class="lesson-key"><b>Read by context:</b> after a number/age = "even at"; after 一瞬・一夜 = "in (that span)"; between two nouns = "and also".</div>` },
      ],
      practice: [
        { label: "📖 N1 Grammar", type: "study", sel: "n1gram" },
        { label: "📖 Literary grammar", type: "study", sel: "n1gramliterary" },
        { label: "🎮 Play N1 Vocabulary", type: "game", game: "n1vocab" },
      ],
    },
    {
      id: "unique-naradeha", stage: "Advanced · N1", title: "None Other Than / Uniquely: 〜をおいて・〜ならでは",
      summary: "Single something out as the sole option, or as a quality only it can offer.",
      sections: [
        { heading: "〜をおいて(…ない) — none but", html:
          `<table class="ex-table">
             <tr><td>きみ<b>をおいて</b> てきにんしゃ は いない。</td><td>There's no one fit for it but you.</td></tr>
           </table>
           <p>Almost always closes with a negative (ない / 考えられない).</p>` },
        { heading: "〜ならでは(の) — distinctive to / only possible for", html:
          `<table class="ex-table">
             <tr><td>この みせ<b>ならでは</b> の あじ。</td><td>A flavor only this shop can offer.</td></tr>
             <tr><td>プロ<b>ならでは</b> の しごと。</td><td>Work only a pro could do.</td></tr>
           </table>
           <div class="lesson-key"><b>Tone:</b> both are praising. をおいて picks the one and only candidate; ならでは highlights a virtue unique to that thing.</div>` },
      ],
      practice: [
        { label: "📖 N1 Grammar", type: "study", sel: "n1gram" },
        { label: "📖 Advanced structures", type: "study", sel: "n1gramadvanced" },
        { label: "🎮 Play N1 Vocabulary", type: "game", game: "n1vocab" },
      ],
    },
    {
      id: "innate-foremost", stage: "Advanced · N1", title: "Innate / The Very Best: 〜ながらに・〜きっての",
      summary: "Describe a quality held from birth or while staying put — and the foremost of its kind.",
      sections: [
        { heading: "〜ながらに(して) — while remaining / innately", html:
          `<table class="ex-table">
             <tr><td>うまれ<b>ながらに</b> の さいのう。</td><td>an inborn talent</td></tr>
             <tr><td>いえ に い<b>ながらにして</b> はたらく。</td><td>work without ever leaving home</td></tr>
           </table>
           <p>Note this fixed 〜ながらに ("while staying in a state") differs from the 〜ながら = "while doing two things".</p>` },
        { heading: "〜きっての — the foremost in", html:
          `<table class="ex-table">
             <tr><td>にほん<b>きっての</b> がか。</td><td>Japan's foremost painter.</td></tr>
             <tr><td>とうしゃ<b>きっての</b> えいぎょうマン。</td><td>our company's top salesperson.</td></tr>
           </table>
           <div class="lesson-key"><b>Frame:</b> place + きっての + noun = "the very best ___ in (that place/group)". Always superlative, always positive.</div>` },
      ],
      practice: [
        { label: "📖 N1 Grammar", type: "study", sel: "n1gram" },
        { label: "📖 Literary grammar", type: "study", sel: "n1gramliterary" },
        { label: "🎮 Play N1 Vocabulary", type: "game", game: "n1vocab" },
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
      id: "kotowaza-vol2", stage: "Advanced · N1", title: "Kotowaza & Yojijukugo, vol. 2",
      summary: "A second harvest of proverbs, four-character idioms, and set phrases — deeper cultural shorthand.",
      sections: [
        { heading: "More ことわざ", html:
          `<p>Building on the first proverb set, here are five more that earn knowing nods in conversation and writing:</p>
           <table class="ex-table">
             <tr><td>案ずるより産むが易し</td><td>doing is easier than worrying about it</td></tr>
             <tr><td>二兎を追う者は一兎をも得ず</td><td>chase two hares, catch neither</td></tr>
             <tr><td>出る杭は打たれる</td><td>the nail that sticks out gets hammered down</td></tr>
             <tr><td>知らぬが仏</td><td>"not knowing is Buddha" = ignorance is bliss</td></tr>
             <tr><td>塵も積もれば山となる</td><td>even dust, piled up, becomes a mountain</td></tr>
           </table>` },
        { heading: "More 四字熟語", html:
          `<p>A second set of <b>yojijukugo</b> — four-kanji idioms that condense a whole idea, common in essays and speeches:</p>
           <table class="ex-table">
             <tr><td>温故知新 おんこちしん</td><td>learn the new by studying the old</td></tr>
             <tr><td>一日千秋 いちじつせんしゅう</td><td>a day feels like a thousand years (longing)</td></tr>
             <tr><td>因果応報 いんがおうほう</td><td>cause and effect; you reap what you sow</td></tr>
             <tr><td>切磋琢磨 せっさたくま</td><td>improving through friendly rivalry</td></tr>
             <tr><td>我田引水 がでんいんすい</td><td>"drawing water to one's own field" = self-serving spin</td></tr>
           </table>` },
        { heading: "More 慣用句 (set idioms)", html:
          `<p>Another round of everyday idioms — their literal reading is a trap, so memorize each whole:</p>
           <table class="ex-table">
             <tr><td>油を売る あぶらをうる</td><td>"sell oil" = slack off / waste time chatting</td></tr>
             <tr><td>猫の手も借りたい</td><td>"want to borrow even a cat's paw" = swamped, desperate for help</td></tr>
             <tr><td>目が高い めがたかい</td><td>"high eyes" = have a discerning eye for quality</td></tr>
             <tr><td>耳が痛い みみがいたい</td><td>"ears hurt" = the criticism hits home</td></tr>
             <tr><td>釘を刺す くぎをさす</td><td>"drive in a nail" = warn someone in advance, pin them down</td></tr>
           </table>` },
        { heading: "Deploying them well", html:
          `<div class="lesson-key"><b>Right phrase, right moment.</b> These signal cultural depth — but a misfired proverb sounds stiff or preachy. Lead with <b>recognition</b> (you'll meet them in editorials, novels, and speeches far more than you'll produce them), and when you do use one, keep it apt and light. A single well-placed 四字熟語 in a toast or essay lands as unmistakably fluent.</div>
           <p>彼は出る杭は打たれると言われても、温故知新の精神で挑戦を続けた。</p>` },
      ],
      practice: [
        { label: "📖 All N1 Grammar", type: "study", sel: "n1gram" },
        { label: "📖 N1 Formal & Literary Expression", type: "study", sel: "n1phrformal" },
        { label: "🎮 Play N1 Vocabulary", type: "game", game: "n1vocab" },
      ],
    },
    {
      id: "compound-particles2", stage: "Advanced · N1", title: "Formal Particles II: 〜にかけては・〜をもって・〜をよそに",
      summary: "More heavyweight compound particles from formal speech, notices, and writing.",
      sections: [
        { heading: "〜にかけては — when it comes to (a strength)", html:
          `<table class="ex-table">
             <tr><td>りょうり<b>にかけては</b> だれにも まけない。</td><td>When it comes to cooking, I'm second to none.</td></tr>
           </table>
           <p>Always introduces something the subject excels at.</p>` },
        { heading: "〜をもって — by means of / as of (formal)", html:
          `<table class="ex-table">
             <tr><td>本日<b>をもって</b> へいてん いたします。</td><td>We close for good as of today.</td></tr>
             <tr><td>しょるい<b>をもって</b> つうち する。</td><td>To notify by document.</td></tr>
           </table>` },
        { heading: "〜をよそに — ignoring / in defiance of", html:
          `<table class="ex-table">
             <tr><td>しゅういの しんぱい<b>をよそに</b>、でかけた。</td><td>Ignoring everyone's worry, he went out.</td></tr>
           </table>
           <div class="lesson-key"><b>Register:</b> all three are formal/written. をもって is common in announcements; をよそに carries a faint note of criticism.</div>` },
      ],
      practice: [
        { label: "📖 N1 Grammar", type: "study", sel: "n1gram" },
        { label: "📖 Advanced structures", type: "study", sel: "n1gramadvanced" },
        { label: "🎮 Play N1 Vocabulary", type: "game", game: "n1vocab" },
      ],
    },
    {
      id: "n1-immediacy", stage: "Advanced · N1", title: "The Moment That: 〜が早いか・〜や否や・〜なり",
      summary: "Literary patterns for 'the instant one thing happened, the next did'.",
      sections: [
        { heading: "〜が早いか — no sooner than", html:
          `<table class="ex-table">
             <tr><td>ベル が なる<b>がはやいか</b>、はしりだした。</td><td>No sooner had the bell rung than he bolted.</td></tr>
           </table>` },
        { heading: "〜や(否や) & 〜なり — the instant / right after", html:
          `<table class="ex-table">
             <tr><td>すわる<b>や いなや</b> ねむった。</td><td>The moment he sat, he fell asleep.</td></tr>
             <tr><td>へやに はいる<b>なり</b> どなった。</td><td>The instant he entered, he shouted.</td></tr>
           </table>` },
        { heading: "〜そばから — as fast as (undone again)", html:
          `<table class="ex-table">
             <tr><td>ならう<b>そばから</b> わすれる。</td><td>I forget things as fast as I learn them.</td></tr>
           </table>
           <div class="lesson-key"><b>Nuance:</b> が早いか・や否や・なり = one-time, immediate sequence (often with surprise); そばから = a repeated, futile cycle.</div>` },
      ],
      practice: [
        { label: "📖 N1 Grammar", type: "study", sel: "n1gram" },
        { label: "📖 Literary grammar", type: "study", sel: "n1gramliterary" },
        { label: "🎮 Play N1 Vocabulary", type: "game", game: "n1vocab" },
      ],
    },
    {
      id: "n1-circumstance", stage: "Advanced · N1", title: "Concession & Circumstance: 〜ないまでも・〜ならいざしらず・〜とあって",
      summary: "Granting a partial point, setting an exception aside, and citing a special circumstance.",
      sections: [
        { heading: "〜ないまでも — even if not…, at least", html:
          `<table class="ex-table">
             <tr><td>かんぺき<b>ではないまでも</b>、ごうかく は できる。</td><td>Even if not perfect, you can still pass.</td></tr>
           </table>` },
        { heading: "〜ならいざしらず — that's one thing, but…", html:
          `<table class="ex-table">
             <tr><td>こども<b>ならいざしらず</b>、おとな が なくとは。</td><td>A child would be one thing, but a grown-up crying…</td></tr>
           </table>` },
        { heading: "〜とあって — given that (special situation)", html:
          `<table class="ex-table">
             <tr><td>れんきゅう<b>とあって</b>、どこも こんでいる。</td><td>It being a long weekend, everywhere's packed.</td></tr>
           </table>
           <div class="lesson-key"><b>Feel:</b> とあって presents a cause as a notable, almost newsworthy circumstance — common in reportage ("with X being the case, naturally Y").</div>` },
      ],
      practice: [
        { label: "📖 N1 Grammar", type: "study", sel: "n1gram" },
        { label: "📖 Advanced structures", type: "study", sel: "n1gramadvanced" },
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
    { id: "scripts", place: "Yonaguni", pref: "Okinawa", region: "Okinawa" },
    { id: "hiragana-basic", place: "Ishigaki", pref: "Okinawa", region: "Okinawa" },
    { id: "hiragana-dakuten", place: "Ishigaki", pref: "Okinawa", region: "Okinawa" },
    { id: "hiragana-yoon", place: "Miyakojima", pref: "Okinawa", region: "Okinawa" },
    { id: "kana-extras", place: "Miyakojima", pref: "Okinawa", region: "Okinawa" },
    { id: "katakana", place: "Itoman", pref: "Okinawa", region: "Okinawa" },
    { id: "pronunciation", place: "Naha", pref: "Okinawa", region: "Okinawa" },
    { id: "long-sounds", place: "Nago", pref: "Okinawa", region: "Okinawa" },
    { id: "reading-quirks", place: "Nago", pref: "Okinawa", region: "Okinawa" },
    { id: "stroke-order", place: "Amami Ōshima", pref: "Kagoshima", region: "Kyūshū" },
    { id: "kanji-readings", place: "Amami Ōshima", pref: "Kagoshima", region: "Kyūshū" },
    { id: "names-titles", place: "Amami Ōshima", pref: "Kagoshima", region: "Kyūshū" },
    { id: "rendaku", place: "Yakushima", pref: "Kagoshima", region: "Kyūshū" },
    { id: "how-to-study", place: "Makurazaki", pref: "Kagoshima", region: "Kyūshū" },
    { id: "pitch-accent", place: "Kagoshima", pref: "Kagoshima", region: "Kyūshū" },
    { id: "n5-kanji", place: "Kanoya", pref: "Kagoshima", region: "Kyūshū" },
    { id: "n5-numbers", place: "Miyakonojō", pref: "Miyazaki", region: "Kyūshū" },
    { id: "n5-vocab", place: "Miyazaki", pref: "Miyazaki", region: "Kyūshū" },
    { id: "n5-particles", place: "Miyazaki", pref: "Miyazaki", region: "Kyūshū" },
    { id: "n5-grammar", place: "Nobeoka", pref: "Miyazaki", region: "Kyūshū" },
    { id: "n5-phrases", place: "Takachiho", pref: "Miyazaki", region: "Kyūshū" },
    { id: "verb-groups", place: "Kumamoto", pref: "Kumamoto", region: "Kyūshū" },
    { id: "adjectives", place: "Kumamoto", pref: "Kumamoto", region: "Kyūshū" },
    { id: "kosoado", place: "Mount Aso", pref: "Kumamoto", region: "Kyūshū" },
    { id: "question-words", place: "Ōita", pref: "Ōita", region: "Kyūshū" },
    { id: "existence", place: "Beppu", pref: "Ōita", region: "Kyūshū" },
    { id: "wants-invites", place: "Hita", pref: "Ōita", region: "Kyūshū" },
    { id: "counters", place: "Hita", pref: "Ōita", region: "Kyūshū" },
    { id: "time-dates", place: "Fukuoka", pref: "Fukuoka", region: "Kyūshū" },
    { id: "big-numbers", place: "Fukuoka", pref: "Fukuoka", region: "Kyūshū" },
    { id: "comparisons", place: "Nagasaki", pref: "Nagasaki", region: "Kyūshū" },
    { id: "te-form", place: "Nagasaki", pref: "Nagasaki", region: "Kyūshū" },
    { id: "because-kara", place: "Saga", pref: "Saga", region: "Kyūshū" },
    { id: "final-particles", place: "Saga", pref: "Saga", region: "Kyūshū" },
    { id: "family-terms", place: "Kitakyūshū", pref: "Fukuoka", region: "Kyūshū" },
    { id: "adverbs", place: "Kitakyūshū", pref: "Fukuoka", region: "Kyūshū" },
    { id: "frequency", place: "Kitakyūshū", pref: "Fukuoka", region: "Kyūshū" },
    { id: "requests", place: "Kitakyūshū", pref: "Fukuoka", region: "Kyūshū" },
    { id: "body-health", place: "Yawatahama", pref: "Ehime", region: "Shikoku" },
    { id: "restaurant", place: "Yawatahama", pref: "Ehime", region: "Shikoku" },
    { id: "shopping", place: "Uwajima", pref: "Ehime", region: "Shikoku" },
    { id: "directions", place: "Uwajima", pref: "Ehime", region: "Shikoku" },
    { id: "permission-n5", place: "Matsuyama", pref: "Ehime", region: "Shikoku" },
    { id: "time-duration", place: "Imabari", pref: "Ehime", region: "Shikoku" },
    { id: "weather", place: "Susaki", pref: "Kōchi", region: "Shikoku" },
    { id: "mo-demo", place: "Kōchi", pref: "Kōchi", region: "Shikoku" },
    { id: "mou-mada", place: "Kōchi", pref: "Kōchi", region: "Shikoku" },
    { id: "likes-abilities", place: "Aki", pref: "Kōchi", region: "Shikoku" },
    { id: "food", place: "Tokushima", pref: "Tokushima", region: "Shikoku" },
    { id: "hobbies-routine", place: "Tokushima", pref: "Tokushima", region: "Shikoku" },
    { id: "home-objects", place: "Naruto", pref: "Tokushima", region: "Shikoku" },
    { id: "greetings-intro", place: "Takamatsu", pref: "Kagawa", region: "Shikoku" },
    { id: "colors", place: "Marugame", pref: "Kagawa", region: "Shikoku" },
    { id: "annual-events", place: "Kurashiki", pref: "Okayama", region: "Chūgoku" },
    { id: "n4-kanji", place: "Fukuyama", pref: "Hiroshima", region: "Chūgoku" },
    { id: "n4-vocab", place: "Mihara", pref: "Hiroshima", region: "Chūgoku" },
    { id: "n4-teform", place: "Mihara", pref: "Hiroshima", region: "Chūgoku" },
    { id: "n4-grammar", place: "Kure", pref: "Hiroshima", region: "Chūgoku" },
    { id: "appearance-sou", place: "Hiroshima", pref: "Hiroshima", region: "Chūgoku" },
    { id: "conjecture", place: "Iwakuni", pref: "Yamaguchi", region: "Chūgoku" },
    { id: "verb-suffixes", place: "Yamaguchi", pref: "Yamaguchi", region: "Chūgoku" },
    { id: "giving-receiving", place: "Yamaguchi", pref: "Yamaguchi", region: "Chūgoku" },
    { id: "transitivity", place: "Yamaguchi", pref: "Yamaguchi", region: "Chūgoku" },
    { id: "potential-volitional", place: "Shimonoseki", pref: "Yamaguchi", region: "Chūgoku" },
    { id: "quoting", place: "Shimonoseki", pref: "Yamaguchi", region: "Chūgoku" },
    { id: "time-clauses", place: "Hagi", pref: "Yamaguchi", region: "Chūgoku" },
    { id: "permission-obligation", place: "Hagi", pref: "Yamaguchi", region: "Chūgoku" },
    { id: "when-cases", place: "Masuda", pref: "Shimane", region: "Chūgoku" },
    { id: "casual-must", place: "Masuda", pref: "Shimane", region: "Chūgoku" },
    { id: "doctor", place: "Masuda", pref: "Shimane", region: "Chūgoku" },
    { id: "admin", place: "Masuda", pref: "Shimane", region: "Chūgoku" },
    { id: "phone-emergency", place: "Matsue", pref: "Shimane", region: "Chūgoku" },
    { id: "technology", place: "Matsue", pref: "Shimane", region: "Chūgoku" },
    { id: "work-school", place: "Yonago", pref: "Tottori", region: "Chūgoku" },
    { id: "emotions", place: "Yonago", pref: "Tottori", region: "Chūgoku" },
    { id: "travel", place: "Tottori", pref: "Tottori", region: "Chūgoku" },
    { id: "common-mistakes", place: "Tottori", pref: "Tottori", region: "Chūgoku" },
    { id: "numbers-life", place: "Tottori", pref: "Tottori", region: "Chūgoku" },
    { id: "conditionals", place: "Himeji", pref: "Hyōgo", region: "Kansai" },
    { id: "leisure", place: "Himeji", pref: "Hyōgo", region: "Kansai" },
    { id: "garu-feelings", place: "Akashi", pref: "Hyōgo", region: "Kansai" },
    { id: "as-pretend", place: "Kobe", pref: "Hyōgo", region: "Kansai" },
    { id: "should-suppose", place: "Osaka", pref: "Osaka", region: "Kansai" },
    { id: "only-shika-dake", place: "Wakayama", pref: "Wakayama", region: "Kansai" },
    { id: "change-becoming", place: "Wakayama", pref: "Wakayama", region: "Kansai" },
    { id: "clarifying", place: "Wakayama", pref: "Wakayama", region: "Kansai" },
    { id: "apolog-thanks", place: "Nachikatsuura", pref: "Wakayama", region: "Kansai" },
    { id: "music-pop", place: "Nachikatsuura", pref: "Wakayama", region: "Kansai" },
    { id: "eating-out", place: "Owase", pref: "Mie", region: "Kansai" },
    { id: "transportation", place: "Owase", pref: "Mie", region: "Kansai" },
    { id: "how-to", place: "Ise", pref: "Mie", region: "Kansai" },
    { id: "aspect-aux", place: "Tsu", pref: "Mie", region: "Kansai" },
    { id: "even-if", place: "Tsu", pref: "Mie", region: "Kansai" },
    { id: "plans-intentions", place: "Kyoto", pref: "Kyoto", region: "Kansai" },
    { id: "season-nature", place: "Ōtsu", pref: "Shiga", region: "Kansai" },
    { id: "wa-ga", place: "Nagahama", pref: "Shiga", region: "Kansai" },
    { id: "explanatory-no", place: "Nagahama", pref: "Shiga", region: "Kansai" },
    { id: "te-iru", place: "Gifu", pref: "Gifu", region: "Chūbu" },
    { id: "tari", place: "Nagoya", pref: "Aichi", region: "Chūbu" },
    { id: "experience-koto", place: "Toyohashi", pref: "Aichi", region: "Chūbu" },
    { id: "connectors-n4", place: "Toyohashi", pref: "Aichi", region: "Chūbu" },
    { id: "n3-kanji", place: "Hamamatsu", pref: "Shizuoka", region: "Chūbu" },
    { id: "n3-vocab", place: "Shizuoka", pref: "Shizuoka", region: "Chūbu" },
    { id: "n3-grammar", place: "Shizuoka", pref: "Shizuoka", region: "Chūbu" },
    { id: "youni-grammar", place: "Fuji", pref: "Shizuoka", region: "Chūbu" },
    { id: "as-change", place: "Fuji", pref: "Shizuoka", region: "Chūbu" },
    { id: "extent-n3", place: "Mount Fuji", pref: "Yamanashi", region: "Chūbu" },
    { id: "keigo-levels", place: "Mount Fuji", pref: "Yamanashi", region: "Chūbu" },
    { id: "compound-verbs", place: "Kōfu", pref: "Yamanashi", region: "Chūbu" },
    { id: "toka-yara", place: "Suwa", pref: "Nagano", region: "Chūbu" },
    { id: "regret-grammar", place: "Suwa", pref: "Nagano", region: "Chūbu" },
    { id: "passive-causative", place: "Iida", pref: "Nagano", region: "Chūbu" },
    { id: "te-kuru-iku", place: "Iida", pref: "Nagano", region: "Chūbu" },
    { id: "te-aru", place: "Iida", pref: "Nagano", region: "Chūbu" },
    { id: "try-about-to", place: "Matsumoto", pref: "Nagano", region: "Chūbu" },
    { id: "nominalization", place: "Matsumoto", pref: "Nagano", region: "Chūbu" },
    { id: "onomatopoeia", place: "Takayama", pref: "Gifu", region: "Chūbu" },
    { id: "conjunctions", place: "Takayama", pref: "Gifu", region: "Chūbu" },
    { id: "reading-strategy", place: "Shirakawa-gō", pref: "Gifu", region: "Chūbu" },
    { id: "until-by", place: "Shirakawa-gō", pref: "Gifu", region: "Chūbu" },
    { id: "rules-instructions", place: "Toyama", pref: "Toyama", region: "Chūbu" },
    { id: "casual-tte", place: "Kanazawa", pref: "Ishikawa", region: "Chūbu" },
    { id: "dialects", place: "Kanazawa", pref: "Ishikawa", region: "Chūbu" },
    { id: "nature", place: "Kanazawa", pref: "Ishikawa", region: "Chūbu" },
    { id: "particle-combos", place: "Fukui", pref: "Fukui", region: "Chūbu" },
    { id: "relationships", place: "Fukui", pref: "Fukui", region: "Chūbu" },
    { id: "health", place: "Fukui", pref: "Fukui", region: "Chūbu" },
    { id: "certainty", place: "Noto", pref: "Ishikawa", region: "Chūbu" },
    { id: "news", place: "Noto", pref: "Ishikawa", region: "Chūbu" },
    { id: "cause-reason", place: "Noto", pref: "Ishikawa", region: "Chūbu" },
    { id: "opinions", place: "Noto", pref: "Ishikawa", region: "Chūbu" },
    { id: "hypotheticals", place: "Noto", pref: "Ishikawa", region: "Chūbu" },
    { id: "business", place: "Nagano", pref: "Nagano", region: "Chūbu" },
    { id: "quantity", place: "Nagano", pref: "Nagano", region: "Chūbu" },
    { id: "tokoro", place: "Karuizawa", pref: "Nagano", region: "Chūbu" },
    { id: "n2-kanji", place: "Maebashi", pref: "Gunma", region: "Kantō" },
    { id: "n2-vocab", place: "Kusatsu Onsen", pref: "Gunma", region: "Kantō" },
    { id: "n2-grammar", place: "Kusatsu Onsen", pref: "Gunma", region: "Kantō" },
    { id: "mono-grammar", place: "Kusatsu Onsen", pref: "Gunma", region: "Kantō" },
    { id: "uchi-mama", place: "Nikkō", pref: "Tochigi", region: "Kantō" },
    { id: "ish-grammar", place: "Nikkō", pref: "Tochigi", region: "Kantō" },
    { id: "considering", place: "Nikkō", pref: "Tochigi", region: "Kantō" },
    { id: "written-style", place: "Utsunomiya", pref: "Tochigi", region: "Kantō" },
    { id: "sentence-particles", place: "Utsunomiya", pref: "Tochigi", region: "Kantō" },
    { id: "near-synonyms", place: "Kawagoe", pref: "Saitama", region: "Kantō" },
    { id: "bakari-grammar", place: "Saitama", pref: "Saitama", region: "Kantō" },
    { id: "kagiri-grammar", place: "Tokyo", pref: "Tokyo", region: "Kantō" },
    { id: "n2-emphatic-neg", place: "Yokohama", pref: "Kanagawa", region: "Kantō" },
    { id: "formal-writing", place: "Chiba", pref: "Chiba", region: "Kantō" },
    { id: "idioms", place: "Chiba", pref: "Chiba", region: "Kantō" },
    { id: "koto-grammar", place: "Tsukuba", pref: "Ibaraki", region: "Kantō" },
    { id: "shidai-ue", place: "Mito", pref: "Ibaraki", region: "Kantō" },
    { id: "without-doing", place: "Mito", pref: "Ibaraki", region: "Kantō" },
    { id: "result-end", place: "Hitachi", pref: "Ibaraki", region: "Kantō" },
    { id: "sudden-timing", place: "Hitachi", pref: "Ibaraki", region: "Kantō" },
    { id: "assertion-n2", place: "Aizu-Wakamatsu", pref: "Fukushima", region: "Tōhoku" },
    { id: "science-tech", place: "Aizu-Wakamatsu", pref: "Fukushima", region: "Tōhoku" },
    { id: "partial-negation", place: "Aizu-Wakamatsu", pref: "Fukushima", region: "Tōhoku" },
    { id: "emphatic-conditional", place: "Kōriyama", pref: "Fukushima", region: "Tōhoku" },
    { id: "for-toward", place: "Kōriyama", pref: "Fukushima", region: "Tōhoku" },
    { id: "service-keigo", place: "Iwaki", pref: "Fukushima", region: "Tōhoku" },
    { id: "koto-reasoning", place: "Iwaki", pref: "Fukushima", region: "Tōhoku" },
    { id: "amari-result", place: "Iwaki", pref: "Fukushima", region: "Tōhoku" },
    { id: "formal-occasion", place: "Fukushima", pref: "Fukushima", region: "Tōhoku" },
    { id: "nishiro", place: "Fukushima", pref: "Fukushima", region: "Tōhoku" },
    { id: "debate", place: "Sendai", pref: "Miyagi", region: "Tōhoku" },
    { id: "wake-grammar", place: "Sendai", pref: "Miyagi", region: "Tōhoku" },
    { id: "n1-kanji", place: "Yamagata", pref: "Yamagata", region: "Tōhoku" },
    { id: "n1-vocab", place: "Yamadera", pref: "Yamagata", region: "Tōhoku" },
    { id: "casual-speech", place: "Sakata", pref: "Yamagata", region: "Tōhoku" },
    { id: "loanwords", place: "Sakata", pref: "Yamagata", region: "Tōhoku" },
    { id: "aizuchi", place: "Akita", pref: "Akita", region: "Tōhoku" },
    { id: "proverbs", place: "Kakunodate", pref: "Akita", region: "Tōhoku" },
    { id: "n1-negative-outcome", place: "Hiraizumi", pref: "Iwate", region: "Tōhoku" },
    { id: "n1-judgment", place: "Morioka", pref: "Iwate", region: "Tōhoku" },
    { id: "n1-status", place: "Morioka", pref: "Iwate", region: "Tōhoku" },
    { id: "n1-pairs", place: "Hachinohe", pref: "Aomori", region: "Tōhoku" },
    { id: "n1-covered", place: "Towada", pref: "Aomori", region: "Tōhoku" },
    { id: "n1-concessive2", place: "Aomori", pref: "Aomori", region: "Tōhoku" },
    { id: "academic-vocab", place: "Hirosaki", pref: "Aomori", region: "Tōhoku" },
    { id: "compound-particles1", place: "Hakodate", pref: "Hokkaidō", region: "Hokkaidō" },
    { id: "n1-emotive", place: "Hakodate", pref: "Hokkaidō", region: "Hokkaidō" },
    { id: "regardless-grammar", place: "Muroran", pref: "Hokkaidō", region: "Hokkaidō" },
    { id: "n1-concession", place: "Otaru", pref: "Hokkaidō", region: "Hokkaidō" },
    { id: "reading-genres", place: "Sapporo", pref: "Hokkaidō", region: "Hokkaidō" },
    { id: "as-if", place: "Sapporo", pref: "Hokkaidō", region: "Hokkaidō" },
    { id: "extreme-n1", place: "Furano", pref: "Hokkaidō", region: "Hokkaidō" },
    { id: "forced-noway", place: "Asahikawa", pref: "Hokkaidō", region: "Hokkaidō" },
    { id: "advanced-kanji", place: "Asahikawa", pref: "Hokkaidō", region: "Hokkaidō" },
    { id: "classical-grammar", place: "Obihiro", pref: "Hokkaidō", region: "Hokkaidō" },
    { id: "tokoro-wo", place: "Obihiro", pref: "Hokkaidō", region: "Hokkaidō" },
    { id: "nishite", place: "Kushiro", pref: "Hokkaidō", region: "Hokkaidō" },
    { id: "unique-naradeha", place: "Kushiro", pref: "Hokkaidō", region: "Hokkaidō" },
    { id: "innate-foremost", place: "Abashiri", pref: "Hokkaidō", region: "Hokkaidō" },
    { id: "ceremonies", place: "Abashiri", pref: "Hokkaidō", region: "Hokkaidō" },
    { id: "rhetoric", place: "Abashiri", pref: "Hokkaidō", region: "Hokkaidō" },
    { id: "kotowaza-vol2", place: "Nayoro", pref: "Hokkaidō", region: "Hokkaidō" },
    { id: "compound-particles2", place: "Nayoro", pref: "Hokkaidō", region: "Hokkaidō" },
    { id: "n1-immediacy", place: "Nayoro", pref: "Hokkaidō", region: "Hokkaidō" },
    { id: "n1-circumstance", place: "Cape Sōya (Wakkanai)", pref: "Hokkaidō", region: "Hokkaidō" },
    { id: "n1-grammar", place: "Cape Sōya (Wakkanai)", pref: "Hokkaidō", region: "Hokkaidō" },
  ],
};

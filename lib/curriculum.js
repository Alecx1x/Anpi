/* lib/curriculum.js — guided learning path data.
 *
 * A linear list of UNITS grouped into STAGES. Each unit teaches a concept
 * (sections of prose) and links to existing decks for practice (study or game).
 * LEVELS let a learner place themselves; `start` is the unit their path begins
 * at (earlier units are shown as optional review). This is plain data so new
 * units/stages can be added without touching the renderer in app.js.
 *
 * practice item shape:
 *   { label, type:"study", sel:"<selKey>" }   → opens that study deck/set
 *   { label, type:"game",  game:"<deckKey>" } → launches the game on that deck
 */
window.CURRICULUM = {
  levels: [
    { id: "zero",    label: "Absolute beginner",   desc: "I've never studied Japanese", start: "scripts" },
    { id: "kana",    label: "I can read kana",      desc: "Hiragana & katakana are comfortable", start: "n5-kanji" },
    { id: "n5",      label: "Around N5",            desc: "Basic kanji, vocab & grammar already", start: "n5-vocab" },
    { id: "explore", label: "Just let me explore",  desc: "Skip the guided path — I'll navigate myself", start: null },
  ],

  units: [
    // ---------------- STAGE: Foundations ----------------
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
        { heading: "What is rōmaji?", html:
          `<p><b>Rōmaji</b> is Japanese written with the Latin alphabet you already know — <i>konnichiwa</i> instead of こんにちは. It's a helpful bridge for your first days, and it's shown on the back of the flashcards.</p>
           <p>Treat it as training wheels: the goal is to read the kana directly. Lean on rōmaji to check yourself, not to avoid the kana.</p>` },
        { heading: "How reading actually works", html:
          `<p>Japanese isn't spelled letter-by-letter. It's built from <b>syllable-sized sounds</b> (called <i>mora</i>). Each hiragana/katakana character is one of those sounds:</p>
           <p style="font-size:1.4rem;letter-spacing:2px">か = "ka" &nbsp;・&nbsp; さ = "sa" &nbsp;・&nbsp; き = "ki"</p>
           <p>So こ + ん + に + ち + は reads <i>ko‑n‑ni‑chi‑wa</i>. Once you know the ~46 basic hiragana, you can sound out any Japanese word — even before you know what it means.</p>` },
        { heading: "Your first move", html:
          `<p>Start with <b>hiragana</b>. Use the flashcards to learn each character's sound, then the game to drill recognition speed. The two practice buttons below jump straight in.</p>` },
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
           <p>Get these five steady and the rest of hiragana is just a consonant placed in front of them.</p>` },
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
             <li><b>を</b> sounds like <i>o</i> — it's only used as a grammar particle.</li>
           </ul>
           <p>Drill the whole set below until reading them feels automatic.</p>` },
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
             <li><b>Dakuten</b> (゛, two ticks): voices a consonant. か <i>ka</i> → が <i>ga</i>, さ <i>sa</i> → ざ <i>za</i>, た <i>ta</i> → だ <i>da</i>, は <i>ha</i> → ば <i>ba</i>.</li>
             <li><b>Handakuten</b> (゜, a small circle): only on the h-row, making a "p" sound. は <i>ha</i> → ぱ <i>pa</i>.</li>
           </ul>
           <p>That's another ~25 sounds for almost no new memorization. Practice them below.</p>` },
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
          `<p>Take an <i>i</i>-row character (き, し, ち…) and add a <b>small</b> や, ゆ, or よ to glide into a single sound:</p>
           <p style="font-size:1.3rem">き + ゃ = きゃ <i>kya</i> ・ し + ゅ = しゅ <i>shu</i> ・ ち + ょ = ちょ <i>cho</i></p>
           <p>The small kana is written half-size. These <b>yōon</b> show up constantly in real words (東京 = とうきょう, Tōkyō). Drill them below.</p>` },
      ],
      practice: [
        { label: "📖 Study Hiragana (Combos)", type: "study", sel: "hiragana#yoon" },
        { label: "🎮 Play the Hiragana game", type: "game", game: "hiragana" },
      ],
    },
    {
      id: "katakana", stage: "Foundations", title: "Katakana: the Second Alphabet",
      summary: "Same sounds as hiragana, sharper shapes, used for loanwords.",
      sections: [
        { heading: "Same sounds, different costume", html:
          `<p>Katakana maps to the <b>exact same sound system</b> as hiragana — あ/ア are both <i>a</i>, か/カ both <i>ka</i>. Only the shapes differ: katakana is angular and sharp.</p>
           <p>It's used for words borrowed from other languages, foreign names, onomatopoeia, and emphasis (like italics). コーヒー = <i>kōhī</i> (coffee), アメリカ = <i>Amerika</i>.</p>
           <p>Because you already know the sounds, this is recognition practice, not new theory. Drill it below.</p>` },
      ],
      practice: [
        { label: "📖 Study Katakana", type: "study", sel: "katakana" },
        { label: "🎮 Play the Katakana game", type: "game", game: "katakana" },
      ],
    },

    // ---------------- STAGE: Beginner (N5) ----------------
    {
      id: "n5-kanji", stage: "Beginner · N5", title: "Your First Kanji",
      summary: "Meaning-carrying characters, readings, and how to study them.",
      sections: [
        { heading: "Kanji carry meaning", html:
          `<p>Unlike kana, each <b>kanji</b> stands for an idea: 山 = mountain, 水 = water, 人 = person. They make text compact and readable once you know them.</p>` },
        { heading: "On'yomi and kun'yomi", html:
          `<p>Most kanji have <b>two kinds of readings</b>:</p>
           <ul>
             <li><b>Kun'yomi</b> — the native Japanese reading, often used alone (山 = <i>yama</i>).</li>
             <li><b>On'yomi</b> — the reading borrowed from Chinese, used in compounds (富士山 = Fuji<i>san</i>).</li>
           </ul>
           <p>Don't force-memorize every reading up front — learn them through the words they appear in. The N5 set (~80 kanji) is the standard starting point.</p>` },
      ],
      practice: [
        { label: "📖 Study N5 Kanji", type: "study", sel: "n5" },
        { label: "🎮 Play the N5 Kanji game", type: "game", game: "n5" },
      ],
    },
    {
      id: "n5-vocab", stage: "Beginner · N5", title: "N5 Vocabulary & Particles",
      summary: "Build a starter vocabulary and meet the little grammar words.",
      sections: [
        { heading: "Words are where it clicks", html:
          `<p>With kana and a few kanji, you can start stacking <b>vocabulary</b>. The N5 vocab set covers the most common everyday nouns, verbs, and adjectives.</p>` },
        { heading: "Particles: Japanese's glue", html:
          `<p>Tiny hiragana words called <b>particles</b> mark the role of each word in a sentence:</p>
           <ul>
             <li><b>は</b> (read <i>wa</i>) marks the topic: 私<u>は</u>… = "as for me…".</li>
             <li><b>を</b> (read <i>o</i>) marks the object of a verb.</li>
             <li><b>に</b> / <b>へ</b> mark direction and destination; <b>の</b> shows possession (私<u>の</u>本 = my book).</li>
           </ul>
           <p>You'll absorb these naturally as you study vocab in real phrases. Start the N5 vocab deck below.</p>` },
      ],
      practice: [
        { label: "📖 Study N5 Vocabulary", type: "study", sel: "n5vocab" },
        { label: "🎮 Play the N5 Vocabulary game", type: "game", game: "n5vocab" },
      ],
    },
  ],
};

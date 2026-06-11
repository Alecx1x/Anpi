# Agent prompts (paste-ready)

Open a **⑂ Parallel** worktree tab named for the lane (`lessons` / `game` / `badges` / `security` → branch
`wt/<lane>`), start `claude`, and paste the matching block. Each prompt is self-contained: read `CLAUDE.md`
first, stay in lane, self-review with skills, commit to your branch — **never deploy** (the lead does that
once from `main` after ⇊ Gather).

**Wave 1 plan:** start with the **lessons pilot** alone to prove the loop (spawn → work → Gather → lead
reviews → deploy). Once that round-trips cleanly, fan out game / badges / security. TASK lines below are
pre-filled for Wave 1.

---

## 📚 Lessons agent — WAVE 1 PILOT (do this one first)
```
You're a lane agent in the Anpi repo (vanilla-JS Japanese-learning web app), in your own git worktree.
STEP 1: Read CLAUDE.md fully, especially "Learn curriculum" and "The journey map".

Your lane: add Learn-path lessons.
OWN (edit freely): lib/curriculum.js (units + the `journey` array).
SHARED, APPEND-ONLY: the JOURNEY_XY block in app.js — only ADD new `id:[lng,lat]` lines; touch nothing else
  in app.js.
DO NOT TOUCH: game code, leaderboard, functions/, lib/badges.js, build-*.js.
Every new lesson MUST have all three: (a) a unit in CURRICULUM.units (kept adjacent to its stage-mates),
  (b) a `journey` entry {id,place,pref,region}, (c) a JOURNEY_XY coord placed in that stage's geographic
  band (see CLAUDE.md). Section `html` is a backtick template literal — NO backticks or ${} inside; use HTML
  entities + helper classes (ex-table, kana-grid, lesson-key).
Before committing: validate with
  `node -e "global.window={};require('./lib/curriculum.js');console.log(window.CURRICULUM.units.length)"`
  and confirm every new unit id has a matching journey entry AND JOURNEY_XY coord; then run /code-review on
  your diff and fix what it flags. DO NOT deploy.
Commit to your branch and summarize (lessons added, stages, validation output).

TASK: Add 4 new, detailed lessons on currently-untouched topics, band-placed:
  - N4: "Aspect & auxiliary verbs (〜ておく/〜てしまう/〜てみる…)"  (Chūbu band)
  - N4: "Seasons, weather & nature idioms"                          (Chūbu band)
  - N2: "Debate & persuasion language"                             (Kantō/Tōhoku band)
  - N1: "Kotowaza & yojijukugo, vol. 2"                            (Tōhoku/Hokkaidō band)
  Match the depth/structure of existing N4–N1 units; link each to the most relevant existing deck(s) via
  practice `sel`/`game` where one fits.
```

## 🎮 Game agent — Wave 1
```
You're a lane agent in the Anpi repo (vanilla-JS Japanese-learning web app), in your own git worktree.
STEP 1: Read CLAUDE.md fully, then the "Agent charters" + "Lead session" sections.

Your lane: the Space Invaders typing game.
OWN: the `// === Space Invaders mini-game ===` region of app.js (≈1175–2009) + its event-wiring; game styles
  in style.css.
DO NOT TOUCH: lib/curriculum.js, the leaderboard region (app.js ~2014–2134), functions/, supabase-*.sql,
  lib/supabase-sync.js, lib/badges.js, build-*.js. Don't relocate functions across files. Keep edits inside
  your region so the merge is clean. Don't break mobile — gate device-specific changes (body.pc / isMobile).
Before committing: run /run (or open index.html) and play a round on Easy + one harder mode — confirm
  scoring, lives, leaderboard submit, difficulty picker; then /code-review your diff and fix findings.
  DO NOT deploy. Commit + summarize (what changed + how to verify).

TASK: Add a "pause when the tab/window loses focus" (auto-resume on return) and show each deck's personal
  best score on the deck/set picker (read it from the same place the end screen does). Keep it subtle and
  mobile-safe.
```

## 🏅 Badge agent — Wave 1
```
You're a lane agent in the Anpi repo (vanilla-JS Japanese-learning web app), in your own git worktree.
STEP 1: Read CLAUDE.md fully, then read .agents/BADGE-SPEC.md (your spec) AND lib/badges.js (your scaffold)
  top to bottom.

Your lane: the badge / achievement system.
OWN: lib/badges.js (whole file) + a clearly-fenced badge CSS block at the END of style.css. If you need a
  render target, add ONE container to index.html.
READ/HOOK ONLY: the `// === Stats & Achievements ===` region of app.js (~2135–2235) — reconcile with the
  existing achievements; migrate them into your catalogue; do NOT duplicate tracking. Persist unlocks under
  "anpiBadges"; never clobber "anpiStats". At most ONE hook line in app.js — coordinate with the lead first.
DO NOT TOUCH: game logic, curriculum, backend.
Use the frontend-design skill for the wall's look (readable, larger text, clear locked/earned states).
Before committing: confirm badges earn from real stats/lesson state, persist across reload, render cleanly
  on mobile + PC; run /code-review and fix findings. DO NOT deploy. Commit + summarize (taxonomy, render
  location, anything descoped for missing data).

TASK: Implement everything in .agents/BADGE-SPEC.md that has a confirmed data source (onboarding, streak,
  lessons, stage-completion, map-region, game tiers, meta). Flag — don't fake — any badge whose data source
  is missing.
```

## 🔒 Security / backend agent — Wave 1
```
You're a lane agent in the Anpi repo (vanilla-JS Japanese-learning web app), in your own git worktree.
STEP 1: Read CLAUDE.md fully, especially Deploy, the TTS function, and Supabase notes.

Your lane: backend + data layer hardening.
OWN: functions/ (esp. functions/api/tts.js), supabase-schema.sql, supabase-leaderboard.sql,
  lib/supabase-sync.js.
DO NOT TOUCH: app.js UI/game/lesson code, style.css, lib/curriculum.js, lib/badges.js.
SQL changes are handed to the USER to run in the Supabase SQL editor — don't expect to apply them; avoid
  `$$` dollar-quoting. GOOGLE_TTS_KEY must never reach client code.
Before committing: run /security-review and /code-review on your diff and address findings. DO NOT deploy.
  Commit + summarize each change and EXACTLY how the user verifies it (incl. any SQL to run).

TASK: Add per-IP rate limiting to GET /api/tts (protect the Google TTS key + quota) and review/ tighten
  Supabase RLS on profiles / high_scores / progress / reports for least-privilege. Confirm no secret leaks
  to the client. Provide any SQL the user must run.
```

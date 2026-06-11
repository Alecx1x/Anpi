# Agent prompts (paste-ready)

Open a **⑂ Parallel** worktree tab in Terminal Bridge for the lane, then paste the matching block as the
first message. Each prompt is self-contained; it tells the agent to read `CLAUDE.md` first and stay in its
lane. Fill the `TASK:` line per wave (see `.agents/ROADMAP.md`). The lead reviews + Gathers + deploys — agents
never deploy.

---

## 🎮 Game agent (Space Invaders typing game)
```
You're a lane agent in the Anpi repo (vanilla-JS Japanese-learning web app), working in your own git worktree.
STEP 1: Read CLAUDE.md in the repo root completely, then the "Agent charters" + "Lead session" sections.

Your lane: the Space Invaders typing game.
OWN (edit freely): the `// === Space Invaders mini-game ===` region of app.js (≈ lines 1175–2009) and its
  event-wiring in the Events section; game-related styles in style.css.
DO NOT TOUCH: lib/curriculum.js, the leaderboard region (app.js ~2014–2134), functions/, supabase-*.sql,
  lib/supabase-sync.js, lib/badges.js, build-*.js. Do not relocate functions across files.
Rules: small surgical edits; re-read a file right before editing; keep changes inside your region so the
  merge is clean. DO NOT run `wrangler pages deploy`. Don't break mobile — gate device-specific changes.
Validate: open index.html, play a round on at least Easy + one harder mode; confirm scoring, lives,
  leaderboard submit, and the difficulty picker still work.
When done: commit to your branch and output a summary (files changed + exactly what to verify).

TASK: <fill from ROADMAP>
```

## 📚 Lessons agent (Learn path content)
```
You're a lane agent in the Anpi repo (vanilla-JS Japanese-learning web app), working in your own git worktree.
STEP 1: Read CLAUDE.md fully, especially "Learn curriculum" and "The journey map".

Your lane: add/improve Learn-path lessons.
OWN (edit freely): lib/curriculum.js (units + the `journey` array).
SHARED, APPEND-ONLY: the JOURNEY_XY block in app.js — only ADD new `id:[lng,lat]` lines; never edit existing
  ones or anything else in app.js.
DO NOT TOUCH: game code, leaderboard, functions/, lib/badges.js, build-*.js.
Every new lesson MUST have all three: (a) a unit in CURRICULUM.units, (b) a `journey` entry
  {id,place,pref,region}, (c) a JOURNEY_XY coord placed in that stage's geographic band (see CLAUDE.md).
  Section `html` is a backtick template literal — NO backticks or ${} inside; use HTML entities + helper
  classes (ex-table, kana-grid, lesson-key). Keep new units adjacent to their stage-mates (contiguous stage).
Rules: small surgical edits; DO NOT deploy.
Validate: `node -e "global.window={};require('./lib/curriculum.js');console.log(window.CURRICULUM.units.length)"`
  and confirm every unit id has a matching journey entry AND a JOURNEY_XY coord.
When done: commit + summarize (lessons added, stages, and the validation output).

TASK: <fill from ROADMAP>
```

## 🏅 Badge agent (achievements)
```
You're a lane agent in the Anpi repo (vanilla-JS Japanese-learning web app), working in your own git worktree.
STEP 1: Read CLAUDE.md fully, then read lib/badges.js (your scaffold) top to bottom.

Your lane: the badge / achievement system.
OWN (edit freely): lib/badges.js (the whole file) and a clearly-fenced badge CSS block at the END of style.css.
  If you need a render target, add ONE container to index.html.
READ/HOOK ONLY: the `// === Stats & Achievements ===` region of app.js (~2135–2235) — it already tracks
  activity under localStorage "anpiStats" (loadStats/saveStats, streak, totals) and renders a basic
  achievements wall. Reconcile with it; do NOT duplicate tracking. Persist unlock state under "anpiBadges" —
  never clobber "anpiStats".
DO NOT TOUCH: game logic, curriculum, backend. Keep your app.js footprint to at most a single hook line
  (coordinate with the lead first if you need even that).
Rules: small surgical edits; DO NOT deploy; don't break mobile.
Validate: badges evaluate from real stats, unlock on the right triggers, persist across reload, render cleanly
  on mobile + PC.
When done: commit + summarize (badge taxonomy, triggers, where they render).

TASK: <fill from ROADMAP>
```

## 🔒 Security / backend agent
```
You're a lane agent in the Anpi repo (vanilla-JS Japanese-learning web app), working in your own git worktree.
STEP 1: Read CLAUDE.md fully, especially Deploy, the TTS function, and Supabase notes.

Your lane: backend + data layer hardening.
OWN (edit freely): functions/ (esp. functions/api/tts.js), supabase-schema.sql, supabase-leaderboard.sql,
  lib/supabase-sync.js.
DO NOT TOUCH: app.js UI/game/lesson code, style.css, lib/curriculum.js, lib/badges.js.
Tasks generally: review Supabase RLS, validate/escape inputs in Pages Functions, rate-limit /api/tts, audit
  secret handling (GOOGLE_TTS_KEY must never reach client code), review auth flows. SQL changes are handed to
  the USER to run in the Supabase SQL editor — don't expect to apply them; avoid `$$` dollar-quoting.
Rules: small surgical edits; DO NOT deploy; never expose keys.
When done: commit + summarize each change and exactly how the user verifies it (incl. any SQL to run).

TASK: <fill from ROADMAP>
```

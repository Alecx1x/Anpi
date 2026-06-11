# CLAUDE.md — Anpi (Japanese-learning web app)

Guidance for Claude Code (and agents) working in this repo. Read this first.

**Harness:** this project is driven inside Terminal Bridge; its always-current guide is auto-loaded next.
@../terminal-bridge/CLAUDE.md

## What this is
**Anpi** (folder name `kana-flashcards`) — a **vanilla JS / HTML / CSS single-page app** for learning Japanese.
No framework, no bundler, no build step for the app itself. `index.html` loads plain `<script>`/`<link>` files.
It runs directly from `file://` (with `.js` deck fallbacks) and is deployed to **Cloudflare Pages**.

Features: flashcards (kana / kanji / vocab + grammar / keigo / phrases / particles decks, N5–N1), a
Space-Invaders-style typing game with global leaderboards, a guided **Learn** curriculum rendered as an
interactive **satellite map of Japan** (journey path), Supabase auth + cross-device sync, and TTS pronunciation.

- **Production:** https://anpi-learning.pages.dev (Cloudflare Pages project `anpi-learning`). The old
  `anpi` project / anpi.pages.dev is retired after the "Anpi Learning" rename.
- **Platform:** Windows. Shell is **PowerShell** — use `npx.cmd` not `npx`.
- This IS a git repo. Commit only when asked.

## Run / preview
- Just open `index.html` in a browser, or serve the folder statically. No install, no `npm`.
- There is **no `package.json`**. The Node scripts in the root (`build-*.js`) are standalone content
  generators run ad-hoc with `node build-xyz.js`; they only need Node's stdlib.

## Deploy (push live)
```
npx.cmd wrangler pages deploy . --project-name anpi-learning --commit-dirty=true
```
- Deploys the **whole folder** (`.`) as a **Direct Upload** to Pages project `anpi`. Direct Uploads do
  NOT count against Cloudflare's 500 Git-builds/month cap, so deploying often is fine.
- `npx.cmd` (not `npx`) avoids the PowerShell `.ps1` execution-policy block.
- `--commit-dirty=true` skips wrangler's "uncommitted git changes" prompt (this is a git repo; the prompt
  would otherwise hang a non-interactive shell).
- **Auth:** wrangler is normally already authenticated. If a deploy fails with *"set a
  CLOUDFLARE_API_TOKEN"*, the cached OAuth token expired — a human must run `npx wrangler login`
  (interactive browser) before deploys work again. An agent cannot do this step.
- **User preference: auto-deploy after each ready change without asking.**

## Architecture & key files
- `index.html` — single page; all screens are sections toggled by JS. Loads (order matters):
  `lib/kanji.js`, `lib/curriculum.js`, `lib/japan-map.js`, `app.js`, `lib/supabase-sync.js`, `lib/badges.js`.
  Third-party via CDN in `<head>`: `@supabase/supabase-js`, **Leaflet 1.9.4** (css+js).
- `app.js` — the whole app (~170KB): routing/screens, flashcards, the typing game, Learn path + map,
  stats/leaderboards, auth glue. `DECK_DEFS` registry maps `deckKey → {file, type, label, [noGame]}`.
- `style.css` — all styles (one file).
- `lib/` — `curriculum.js` (`window.CURRICULUM`, the Learn lessons — plain data), `japan-map.js`
  (`window.JAPAN_MAP`, simplified prefecture outline for the SVG fallback map), `kanji.js`,
  `supabase-sync.js`.
- `data/` — generated deck JSON (vocab schema) + per-deck `.js` fallbacks (so decks load on `file://`).
- `functions/` — Cloudflare Pages Functions. `functions/api/tts.js` = `GET /api/tts?q=` proxy to Google
  Cloud TTS (needs Pages env var `GOOGLE_TTS_KEY`).
- `build-*.js` — Node generators that (re)write decks into `data/`. See "Content" below.
- `supabase-schema.sql` / `supabase-leaderboard.sql` — DB setup, run by the user in the Supabase SQL editor.

## Deck data
Vocab schema per entry: `{word, reading, romaji, meaning, partOfSpeech, exampleSentence,
exampleReading, exampleMeaning, level}`. Each deck has a JSON file in `data/` AND a `.js` fallback that
sets `window.DECKS[key]` (the `.js` is what lets decks work from `file://`). When you add/regenerate a
deck, write both, and register it in `DECK_DEFS` (app.js).

## Content build scripts (Node)
Decks are generated, not hand-edited in `data/`. Pattern to copy: an `E` row-mapper + a `SETS`/`DECKS`
object of hand-authored rows + a writer loop. Families:
- `build-grammar-n5..n1.js` (themed) and `build-grammar-n5-all..n1-all.js` (the complete JLPT master lists).
- `build-verbs-forms.js` — conjugation decks; includes a **conjugation engine** (Hepburn romanizer +
  godan/ichidan/する/来る) so generated Japanese is guaranteed correct (only meanings/examples are authored).
- `build-keigo.js`, `build-phrases.js` (phrases + particles), plus `build-*-extra.js` vocab top-ups.
- `build-japan-map.js` — regenerates `lib/japan-map.js` from `data/_japan_raw.geojson` (do NOT commit the
  ~13MB raw geojson). Uses Douglas–Peucker; `simplifyRing` splits closed rings first (else they collapse).

## Learn curriculum (`lib/curriculum.js`)
- `window.CURRICULUM.units` — array of `{id, stage, title, summary, sections:[{heading, html}],
  practice:[{label, type:"study"|"game", sel|game}]}`. Add units WITHOUT touching app.js.
- `app.js renderLearnPath()` groups units by **contiguous** `stage` — keep new units next to stage-mates.
- Section `html` is a **backtick template literal** → **never use backticks or `${}` inside it**; use HTML
  entities and helper classes (`ex-table`, `kana-grid`, `lesson-key`).
- `practice.sel` = a deckKey (e.g. `"n5godan"`) or `deck#set`; `practice.game` = a deckKey.
- Validate after edits: `node -e "global.window={};require('./lib/curriculum.js');console.log(window.CURRICULUM.units.length)"`

## The journey map (Learn path = real satellite map of Japan)
- Rendered with **Leaflet** (plain `<img>` tiles, **no WebGL**) over **Esri World Imagery** satellite tiles
  + an Esri place-labels overlay (free, no API key). `app.js renderLearnMapGL()` builds it;
  `renderLearnMap()` falls back to the old SVG renderer (`renderLearnMapSVG`) if `window.L` is missing.
  **Do NOT switch back to MapLibre/WebGL** — it rendered blank on a real device; Leaflet is deliberate.
- Each lesson has a pin at real coords in `app.js JOURNEY_XY` (`{lessonId:[lng,lat]}`). Pins are
  `L.circleMarker`s (status/region colored, tap → openLesson); a gold `L.polyline` "trail" (smoothed by
  `geoSpline`) threads the stops in order, lit up to the current stop. Cinematic intro: animated CSS sea
  (`.jmap-sea`) fades, then `flyTo` zooms to the user's current stop.
- **Coords are `[lng,lat]` everywhere in our data, but Leaflet wants `[lat,lng]` — swap (`toLatLngs`).**
- **When adding a lesson you MUST also add:** a `CURRICULUM.journey` entry `{id, place, pref, region}`
  (curriculum.js) AND a `JOURNEY_XY[id]=[lng,lat]` (app.js), or the lesson gets no map dot. Place the pin in
  its stage's geographic band so the trail stays clean (Foundations/early-N5 ≈ Okinawa/Kyūshū lat 24–33 →
  … → N1 ≈ Tōhoku/Hokkaidō 40–45). The map edges are intentionally feathered (CSS mask) to fade into the bg.

## Multi-agent / concurrent work
This repo is sometimes worked on by several agents at once (via the user's "Terminal Bridge" tool). To
avoid stepping on each other:
- **Serialize deploys.** Never run two `wrangler pages deploy` at the same time — a Direct Upload pushes
  the *entire* current folder state, so a concurrent deploy can publish another agent's half-finished work.
  Finish + verify your change, then deploy as a single atomic step. If unsure whether another deploy is in
  flight, wait and re-run rather than racing.
- **Shared wrangler auth is global to the machine.** One `npx wrangler login` covers everyone; if you hit
  *"set a CLOUDFLARE_API_TOKEN"*, don't loop-retry — surface it to the user (only a human can re-login).
- **`app.js`, `index.html`, `style.css`, `lib/curriculum.js` are the hot files** — most edits touch them.
  Prefer small, surgical edits (don't rewrite whole files) so concurrent changes are easier to reconcile,
  and re-read a file right before editing in case another agent just changed it.
- **Regenerated `data/` decks:** if two agents run different `build-*.js` scripts, each overwrites only its
  own deck files, but committing/deploying mid-run can mix states — coordinate or sequence deck rebuilds.
- **One source of truth per concern.** A deck's content lives in its `build-*.js` (regenerate, don't
  hand-edit `data/`); a lesson lives in `lib/curriculum.js` + its `JOURNEY_XY`/`journey` entry. Edit the
  source, not the generated artifact, so another agent's regen doesn't silently revert you.
- **Commit messages / git:** the user drives commits. Don't auto-commit or force-push; if you must commit,
  make a new commit (don't amend someone else's) and keep it scoped to your change.

## Agent charters (parallel work lanes)
Each agent stays in its lane. `lib/badges.js`, `lib/curriculum.js`, `functions/`, and the SQL files are
clean single-owner files. `app.js` is **monolithic and NOT safely splittable** — game logic, core
navigation (`setMainView`, `backToStudy`), the game state object, and the shared leaderboard subsystem are
interleaved. **Do NOT relocate functions across files.** Instead, agents that must edit `app.js` keep their
changes inside their **labeled banner region** so git merges non-overlapping edits cleanly (worktree model).

| Agent | Owns (edit freely) | Shared — append-only / by-region | Do NOT touch |
|---|---|---|---|
| 🎮 **Game** | the `// === Space Invaders mini-game ===` region of `app.js` (≈ lines 1175–2009) + its event-wiring block in the Events section; game styles in `style.css` | — | `lib/curriculum.js`, `functions/`, `supabase-*.sql`, `lib/supabase-sync.js`, `lib/badges.js`, `build-*.js`, the leaderboard region (2014–2134) |
| 📚 **Lessons** | `lib/curriculum.js` (units + the `journey` array) | the `JOURNEY_XY` block in `app.js` — **ADD new `id:[lng,lat]` lines only** | game region, leaderboard, `functions/`, `lib/badges.js`, `build-*.js` |
| 🏅 **Badges** | `lib/badges.js` (whole file) + a clearly-fenced badge CSS block at the **end** of `style.css` | the `// === Stats & Achievements ===` region of `app.js` (≈ 2135–2235) — read/hook only; persist under key `anpiBadges`, never clobber `anpiStats` | game logic, curriculum, backend |
| 🔒 **Security / backend** | `functions/` (esp. `api/tts.js`), `supabase-schema.sql`, `supabase-leaderboard.sql`, `lib/supabase-sync.js` | — | `app.js` UI/game/lesson code, `style.css`, `lib/curriculum.js` |

Cross-cutting rules for every agent: read this file first; make **small surgical edits** and re-read a file
right before editing; **never run `wrangler pages deploy`** (deploys happen once from `main` after gather);
validate before finishing and report files-changed + how to verify. `lib/badges.js` is a ready scaffold
(self-inits on DOMContentLoaded, exposes `window.Badges`) — the badge agent builds it out there.

## Lead session & orchestration
Work is run as **one lead session + several lane agents** (Terminal Bridge worktrees). The split:
- **Lane agents** work inside `wt/<name>` git worktrees, each confined to its charter lane. They build, validate,
  commit to their branch, and **never deploy**. (⇊ Gather now auto-commits each agent's working tree + the main
  tab's before merging, so a missed commit won't lose work — but make intentional commits anyway for clean history.)
- **The lead session** is the architect/integrator/reviewer and the **only thing that deploys**. Its loop:
  *plan wave → write each agent's prompt → agents build in worktrees → lead reviews each diff → **⇊ Gather** →
  lead reconciles conflicts + validates on `main` → **deploy once from `main`** → update CLAUDE.md + the
  `.agents/` log → next wave.*
- **Deploy gate:** deploy ONLY from `main`, ONLY after review + validation, and never from a `wt/*` tab (a Direct
  Upload pushes that worktree's whole state — deploying a branch would publish work missing everyone else's).
- **Conflict authority:** the lead reconciles shared files (`app.js`, `style.css`, `index.html`) because it
  understands the whole app (e.g. the `setMainView`/leaderboard interleaving that makes `app.js` un-splittable).

The lead's control center is **`.agents/`** (a dotfolder — in git, excluded from the public deploy):
- `.agents/PROMPTS.md` — ready-to-paste agent briefs (one per lane), derived from the charters above.
- `.agents/ROADMAP.md` — prioritized backlog / waves and the cross-cutting tasks the lead owns.
- `.agents/WAVELOG.md` — running record of what each agent is doing, what's merged, what's deployed.
  **The lead reads `.agents/` + this file at the start of every session** (its memory across context resets).

## Conventions & gotchas
- PowerShell: `npx.cmd`, `$null` not `/dev/null`, backtick line-continuation. Don't chain
  `git add -A; git commit -m @'...'@` — run the here-string commit as its own call.
- Leaflet map must init with a non-zero-size container — `renderLearnPath` shows the screen BEFORE building
  the map, and a `ResizeObserver` calls `invalidateSize`. If the map ever looks blank, suspect size/timing.
- TTS: Cloudflare Workers AI MeloTTS returns silent Japanese audio — dead end; we use Google Cloud TTS.
- Supabase: email confirmation is OFF; avoid `$$` dollar-quoting in SQL handed to the user (use `$func$`).
- Headless screenshots in a sandbox can't load CDN/tiles — verify map visuals on the live site / real browser.

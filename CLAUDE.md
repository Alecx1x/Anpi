# CLAUDE.md — Anpi (Japanese-learning web app)

Guidance for Claude Code (and agents) working in this repo. Read this first.

**Harness:** this project is driven inside Terminal Bridge; its always-current guide is auto-loaded next.
@../terminal-bridge/CLAUDE.md

---

## What this is
**Anpi** (folder name `kana-flashcards`) — a **vanilla JS / HTML / CSS single-page app** for learning Japanese.
No framework, no bundler, no build step for the app itself. `index.html` loads plain `<script>`/`<link>` files.
It runs directly from `file://` (with `.js` deck fallbacks) and is deployed to **Cloudflare Pages**.

Core features:
- **Flashcards** — kana / kanji / vocab + grammar / keigo / phrases / particles decks, N5–N1.
- **Kana Invader** — a Space-Invaders-style typing game with global leaderboards.
- **Guided Learning** — a single guided curriculum (kana → N1, ~201 units) rendered as an interactive
  **satellite map of Japan** (a south→north journey path). *Direction: re-themed into a "Skill Tree" — see below.*
- **Kanji Road (漢字ロード, WIP)** — a SECOND learning pillar: rich English profiles of real Japanese towns
  with embedded learnable kanji, earned by reading → knowledge check → **handwriting (graded)** → collect.
- **Stroke practice** — a client-side calligraphy **stroke-grading engine** (KanjiVG-based, no ML).
- **Supabase** auth + cross-device sync (flashcard progress, leaderboards, learn-path progress).
- **TTS** pronunciation (free, server-proxied).

- **Production:** https://anpi-learning.pages.dev (Cloudflare Pages project `anpi-learning`). The old
  `anpi` project / anpi.pages.dev is retired after the "Anpi Learning" rename. A one-time localStorage
  migration bridge moved guest data over (see "Data migration" below).
- **Platform:** Windows. Shell is **PowerShell** — use `npx.cmd` not `npx`.
- This IS a git repo. Commit only when asked.

## The two-pillar architecture (read this for context)
The app is converging on **two parallel learning tracks**, reachable from the sidebar:
1. **🗾 Kanji Road** — the **KANJI pillar**. Keeps the *geographic journey* (south→north up Japan) and
   teaches real kanji in the context of real places, each kanji "earned" (read → check → **write & grade**).
2. **🎓 Guided Learning** — the **LANGUAGE pillar** (grammar / vocab / comprehension). Being re-themed from
   a Japan map into a **Skill Tree (RPG mastery)** — branching unlockable nodes, prerequisites, XP, mastery
   stars. (Rejected themes en route: dojo/belts = overused; sumo/banzuke = disrespectful to the sport.)

Decision history worth keeping: the two sections should NOT *both* be south→north Japan journeys, so the
map stays with Kanji Road and Guided Learning becomes the skill tree. The Japan-map system is **earmarked
to migrate from Guided Learning into Kanji Road** once Kanji Road is a real in-app view (deferred; "don't
plot points yet"). The calligraphy stroke-grading also belongs to **Kanji Road**.

Status: both pillars currently live as **standalone pages + landing pages** wired into the sidebar; the
in-app Guided **Learn** view (map) still exists in `index.html`. Kanji Road is a validated **demo**, not yet
folded into the SPA. Labels: Kanji Road = **WIP** badge; Guided Learning = **v0.1** badge.

---

## Run / preview
- Just open `index.html` in a browser, or serve the folder statically. No install, no `npm`.
- There is **no `package.json`**. The Node scripts in the root (`build-*.js`) are standalone content
  generators run ad-hoc with `node build-xyz.js`; they only need Node's stdlib.

## Deploy (push live)
```
npx.cmd wrangler pages deploy . --project-name anpi-learning --commit-dirty=true
```
- Deploys the **whole folder** (`.`) as a **Direct Upload** to Pages project `anpi-learning`. Direct Uploads
  do NOT count against Cloudflare's 500 Git-builds/month cap, so deploying often is fine.
- `npx.cmd` (not `npx`) avoids the PowerShell `.ps1` execution-policy block.
- `--commit-dirty=true` skips wrangler's "uncommitted git changes" prompt (this is a git repo; the prompt
  would otherwise hang a non-interactive shell).
- **Auth:** wrangler is normally already authenticated. If a deploy fails with *"set a
  CLOUDFLARE_API_TOKEN"*, the cached OAuth token expired — a human must run `npx wrangler login`
  (interactive browser) before deploys work again. An agent cannot do this step.
- **User preference: auto-deploy after each ready change without asking.**
- **Edge propagation:** after "Deployment complete", the main domain can serve a **stale cached copy for a
  few seconds**. When verifying, append a cache-buster (`?cb=<random>`) AND wait ~5s; if a check shows old
  content, re-fetch before concluding the deploy "didn't work." (`curl -s ".../page?z=$RANDOM" | grep <new-marker>`.)

## URL routes & clean URLs
Cloudflare Pages **strips `.html` via a 308 redirect**, so every page has a clean URL:
| Clean URL | File | What |
|---|---|---|
| `/` | `index.html` | the SPA (all in-app screens) |
| `/guided-learning` | `guided-learning.html` | Guided Learning landing (purple/あ, v0.1) |
| `/kanji-road` | `kanji-road.html` | Kanji Road landing (ocean/Kabira-Bay, WIP) |
| `/kanji-road-demo` | `kanji-road-demo.html` | the working Kanji Road lesson demo |
| `/stroke-practice` | `stroke-practice.html` | the calligraphy stroke-grading pilot (川) |
| `/skill-tree` | `skill-tree.html` | Guided Learning skill-tree prototype |

**Deep links into the SPA** (handled in `app.js`, ~line 3830, a `setTimeout` after boot that reads
`location.search` then `history.replaceState`s the query away):
- `/?go=learn` → opens the in-app Learn (map) view (`showLearnView()`).
- `/?go=study` → opens flashcards (`selectSet("hiragana")`).
- `/?go=game` → opens Kana Invader (`launchGame()`).
- `/?go=tour` → starts the onboarding tour (`startTour()`).
- `/?deck=<deckKey>` → opens that flashcard deck (`selectSet(key)`).

These exist so the **standalone pages' shared nav** (which has no `app.js`) can route into the app.

---

## Architecture & key files
**`index.html`** — the SPA. All screens are `<div>` sections toggled by JS (`setMainView`). Loads, in order
(order matters): `lib/kanji.js`, `lib/curriculum.js`, `lib/japan-map.js`, `app.js`, `lib/supabase-sync.js`,
`lib/badges.js`. Third-party via CDN in `<head>`: `@supabase/supabase-js`, **Leaflet 1.9.4** (css+js). The
`<head>` also has a **data-migration** inline script and favicon links. The sidebar nav lives here (see
"Sidebar nav structure").

**`app.js`** — the whole app (~170 KB, monolithic, **not safely splittable**): routing/screens
(`setMainView`, `backToStudy`, `showHome`/`showLearnView`/`showGameView`/`showStatsView`/`showLeaderboardView`),
flashcards, the typing game, Learn path + Leaflet map, stats/leaderboards, auth glue, deep-link handlers.
- `DECK_DEFS` — registry mapping `deckKey → {file, type, label, [noGame]}`.
- `JOURNEY_XY` — `{lessonId:[lng,lat]}` map pin coords.
- `tourActive` (~line 3604) — guards nav behavior during the onboarding tour. **Keep this guard.**

**`style.css`** — all SPA styles (one file). Key nav classes: `.sidebar`(256px `#12162a` drawer; `.collapsed`
→ width 0), `.sidebar-toggle` (fixed ☰ top-left), `.side-brand`, `.learn-nav`/`.learn-nav.nav-kr`,
`.nav-badge.wip`/`.nav-badge.v01`, `.tree`/`.root`/`.cat`/`.sub`/`.deck`. CSS vars on `:root`: `--bg #0f1220`,
`--card-bg #1c2138`, `--accent #ff6b9d`, `--accent2 #7c9cff`, `--text #eef1ff`, `--muted #9aa3c7`.

**`lib/`**
- `curriculum.js` — `window.CURRICULUM` (Learn lessons + `journey` array). Plain data.
- `japan-map.js` — `window.JAPAN_MAP`, simplified prefecture outline for the SVG fallback map.
- `kanji.js` — `window.KanjiStrokes`, the KanjiVG stroke renderer (see "KanjiVG / lib/kanji.js").
- `supabase-sync.js` — auth + cloud sync (flashcards, leaderboard, **learn-state**).
- `badges.js` — achievements scaffold (`window.Badges`, self-inits on DOMContentLoaded, persists `anpiBadges`).
- `appnav.js` — the shared collapsible sidebar for standalone pages (see "Shared standalone-page nav").

**`data/`** — generated deck JSON (vocab schema) + per-deck `.js` fallbacks (so decks load on `file://`).

**`functions/`** — Cloudflare Pages Functions. `functions/api/tts.js` = `GET /api/tts?q=` proxy to the FREE
Google Translate `translate_tts` endpoint (no API key / account). Edge-cached + per-IP throttled so it
doesn't hit the per-IP rate-limit the browser does. **Do NOT reintroduce the paid Google Cloud TTS key.**

**Standalone pages** — `guided-learning.html`, `kanji-road.html`, `kanji-road-demo.html`,
`stroke-practice.html`, `skill-tree.html`. Each is self-contained (own `<style>`) and includes
`<script defer src="/lib/appnav.js">` for the shared nav.

**`build-*.js`** — Node deck generators (see "Content build scripts").

**SQL** — `supabase-schema.sql`, `supabase-leaderboard.sql`, `supabase-learn.sql` — DB setup, run by the
user in the Supabase SQL editor.

**Other** — `favicon.svg` (gold あ on dark purple), `_headers` (Cloudflare headers; see "CSP & headers"),
`KANJI-ROAD.md` (Kanji Road design spec). `assets/kanjivg/` may hold local KanjiVG SVGs (CDN fallback otherwise).

---

## Sidebar nav structure (`index.html`)
Top-to-bottom inside `<aside class="sidebar" id="sidebar">`:
1. `.side-brand` "Anpi Learning" → home.
2. `🗾 漢字ロード · Kanji Road` — `<a class="learn-nav nav-kr" href="/kanji-road">` + `WIP` badge.
3. `🎓 Guided Learning` — `<button class="learn-nav" id="learnNav">` + `v0.1` badge. Click → `/guided-learning`
   **except during the onboarding tour** (`tourActive`), where it opens the in-app Learn view. Keep that branch.
4. `<nav class="tree">`:
   - **📚 Flashcards** → a single umbrella dropdown **"JLPT specific"** containing the N5→N1 deck tree
     (`.deck[data-deck=…]` buttons). *(Planned: add a sibling **"Misc (v0.1)"** group for non-JLPT extras —
     not built yet.)*
   - **🎮 Games** → a single **`👾 Kana Invader`** item (`<button class="deck game-launch" data-game="">`).
     The whole old per-deck game hierarchy was removed — the in-game picker (`gameDeckSelect`, built from all
     ~51 gameable decks) handles deck/set choice, so one launch entry is enough. Ready to hold more games.
   - **Story Mode** → "soon" placeholder.
5. `✨ Take the tour` (`#tutorialReplay`).

Outside the sidebar: `#sidebarToggle` (☰, collapses `.sidebar`), `.topbar-right` (account button + voiced-mark
`あ゛` button). On mobile (≤720px) the sidebar is a fixed overlay; `openNav`/`closeNav` toggle `.collapsed`.

Deck buttons are delegated in `app.js`: `.deck[data-deck|data-sel]` → `selectSet(key)`; `.deck[data-game]` →
`launchGame(key)` (empty `data-game=""` falls back to the saved/default deck).

---

## Flashcards & deck data
Vocab schema per entry: `{word, reading, romaji, meaning, partOfSpeech, exampleSentence,
exampleReading, exampleMeaning, level}`. Each deck has a JSON file in `data/` AND a `.js` fallback that
sets `window.DECKS[key]` (the `.js` is what lets decks work from `file://`). When you add/regenerate a
deck, write both, and register it in `DECK_DEFS` (app.js). `noGame:true` excludes a deck from Kana Invader.

## Content build scripts (Node)
Decks are generated, not hand-edited in `data/`. Pattern to copy: an `E` row-mapper + a `SETS`/`DECKS`
object of hand-authored rows + a writer loop. Families:
- `build-grammar-n5..n1.js` (themed) and `build-grammar-n5-all..n1-all.js` (the complete JLPT master lists).
- `build-verbs-forms.js` — conjugation decks; includes a **conjugation engine** (Hepburn romanizer +
  godan/ichidan/する/来る) so generated Japanese is guaranteed correct (only meanings/examples are authored).
- `build-keigo.js`, `build-phrases.js` (phrases + particles), plus `build-*-extra.js` vocab top-ups.
- `build-japan-map.js` — regenerates `lib/japan-map.js` from `data/_japan_raw.geojson` (do NOT commit the
  ~13MB raw geojson). Uses Douglas–Peucker; `simplifyRing` splits closed rings first (else they collapse).

## The typing game (Kana Invader)
In the `// === Space Invaders mini-game ===` region of `app.js` (≈ 1175–2009). Flow: `launchGame(deckKey)` →
deck picker (`showDeckPicker`, `gameDeckSelect`/`gameSetSelect`) → `gamePickerContinue()` → mode select →
`startGame(mode)` → `gameLoop`. Highs persist per deck/mode (`kanaGameHigh_*`); leaderboard region ≈ 2014–2134.

---

## Guided Learning curriculum (`lib/curriculum.js`)
- `window.CURRICULUM.units` — array of `{id, stage, title, summary, sections:[{heading, html}],
  practice:[{label, type:"study"|"game", sel|game}]}`. ~201 units, kana → N1. Add units WITHOUT touching app.js.
- `app.js renderLearnPath()` groups units by **contiguous** `stage` — keep new units next to stage-mates.
- Section `html` is a **backtick template literal** → **never use backticks or `${}` inside it**; use HTML
  entities and helper classes (`ex-table`, `kana-grid`, `lesson-key`).
- `practice.sel` = a deckKey (e.g. `"n5godan"`) or `deck#set`; `practice.game` = a deckKey.
- Validate after edits: `node -e "global.window={};require('./lib/curriculum.js');console.log(window.CURRICULUM.units.length)"`
- `showLearnView()` defaults the level to N5 if none is set (avoids a placement dead-end).

### The journey map (Learn path = real satellite map of Japan)
- Rendered with **Leaflet** (plain `<img>` tiles, **no WebGL**) over **Esri World Imagery** satellite tiles
  + an Esri place-labels overlay (free, no API key). `app.js renderLearnMapGL()` builds it;
  `renderLearnMap()` falls back to the old SVG renderer (`renderLearnMapSVG`) if `window.L` is missing.
  **Do NOT switch back to MapLibre/WebGL** — it rendered blank on a real device; Leaflet is deliberate.
- Each lesson has a pin at real coords in `app.js JOURNEY_XY` (`{lessonId:[lng,lat]}`). Pins are
  `L.circleMarker`s (status/region colored, tap → openLesson); a gold `L.polyline` "trail" (smoothed by
  `geoSpline`) threads the stops in order, lit up to the current stop. Cinematic intro: animated CSS sea
  (`.jmap-sea`) fades, then `flyTo` zooms to the user's current stop.
- The route was regenerated into one **continuous south→north path** (Okinawa→Wakkanai) weaving ~110 real
  cities region by region (max consecutive gap ~0.85°, no southward backtracks). The visible area is a
  narrow portrait canvas with a **Japan-only sea-mask** (non-Japan landmasses hidden via a world-rect polygon
  with island holes, evenodd fill); big renderer padding stops it flashing on pan/zoom; min-zoom is capped so
  you can *just* see all the dots. Edges are feathered via a CSS mask.
- **Coords are `[lng,lat]` everywhere in our data, but Leaflet wants `[lat,lng]` — swap (`toLatLngs`).**
- **When adding a lesson you MUST also add:** a `CURRICULUM.journey` entry `{id, place, pref, region}`
  (curriculum.js) AND a `JOURNEY_XY[id]=[lng,lat]` (app.js), or the lesson gets no map dot. Place the pin in
  its stage's geographic band so the trail stays clean (Foundations/early-N5 ≈ Okinawa/Kyūshū lat 24–33 →
  … → N1 ≈ Tōhoku/Hokkaidō 40–45).
- Leaflet must init with a non-zero-size container — `renderLearnPath` shows the screen BEFORE building the
  map, and a `ResizeObserver` calls `invalidateSize`. If the map ever looks blank, suspect size/timing.

---

## Kanji Road (漢字ロード) — the kanji pillar
**Design spec:** `KANJI-ROAD.md`. **Working demo:** `kanji-road-demo.html` (`/kanji-road-demo`).
**Landing:** `kanji-road.html` (`/kanji-road`, ocean/Kabira-Bay hero, WIP banner, "The Journey North ·
Chapter 1: The Ryukyu Arc", CTA → `/kanji-road-demo`).

Concept: a self-contained reading track of **real Japanese towns/sites**, profiled in English, with the
place's actual Japanese terms embedded and learned in context. **教育漢字 Grade 1→6 / 1,026** kanji order;
~3–6 new kanji per lesson are **collectible "badges."** Self-contained = never uses a kanji it hasn't taught
(except current-lesson ones, shown with furigana).

The demo (`kanji-road-demo.html`) is a continuous south→north sequence (`LESSONS` array; `?lesson=N` is the
0-based index; `KR_ROUTE` in `kanji-road.html` maps each stop to that index + lat/lng; `KR_PTS` in the demo
holds the same coords for the walk cutscene). **20 lessons**, Okinawa → Kyūshū → Chūgoku → Kansai → Chūbu →
Kantō → Tōhoku → Hokkaidō:
1. **波照間島 Hateruma** — 島/南/星. 2. **石垣島 Ishigaki** — 石/牛/川. 3. **那覇 Naha** — 海/王/市.
4. **屋久島 Yakushima** — 雨/谷/緑. 5. **鹿児島 Kagoshima** — 黒/岩/港. 6. **熊本 Kumamoto** — 熊/馬/国.
7. **福岡 Fukuoka** — 福/岡/神. 8. **広島 Hiroshima** — 和/宮/電. 9. **岡山 Okayama** — 橋/庭/楽 (Kōraku-en garden,
Crow Castle, Momotarō, Great Seto Bridge). 10. **姫路 Himeji** — 路/宝/世 (White Heron Castle, finest original
keep, UNESCO). 11. **神戸 Kobe** — 戸/船/地 (early foreign port, Kobe beef, Rokkō, 1995 quake). 12. **大阪 Osaka**
— 食/商/通 (Osaka Castle/Hideyoshi, merchant city, kuidaore, Dōtonbori). 13. **京都 Kyoto** — 都/寺/茶/祭/城/鳥
(6; the depth model). 14. **奈良 Nara** — 公/園/仏/鹿 (4; 3 sections — lighter). 15. **名古屋 Nagoya** — 古/車/鉄
(golden-dolphin castle, Atsuta Shrine, manufacturing). 16. **箱根 Hakone** — 温/富/関 (onsen, Mt. Fuji/Lake Ashi,
Tōkaidō checkpoint). 17. **東京 Tokyo** — 京/皇/駅 (Edo→Tokyo, Imperial Palace, Sensō-ji, busiest stations).
18. **日光 Nikkō** — 光/照/家 (Tōshō-gū / Tokugawa Ieyasu, three monkeys, sleeping cat). 19. **仙台 Sendai** —
青/政/夕 (Date Masamune the One-Eyed Dragon, Aoba Castle, Tanabata). 20. **函館 Hakodate** — 館/夜/開 (Goryōkaku
star fort, night view, port opening, morning market).
**No collectible-kanji collisions** — verified all 64 collectibles unique vs each other + the base grade-1
`known` set (0 collisions). Each new lesson = 5 sections + 3 collectibles + 4-question check; Kyoto(6)/Nara(4,3
sections) are the older previews. When adding more north (next: Aomori → Sapporo), verify against this list.

Per-lesson loop & features (all proven in the demo):
- **5–6 consistent sections** (History / Setting / Food / Sights / Festivals / People) — full, varied prose.
- **Per-place backdrop photo** (`#bg`) from the **Wikipedia pageimages API** (`upload.wikimedia.org`, freely
  licensed, stable hotlinks), under a dark overlay for readability.
- **Tap-to-gloss** popup (`#gloss`) with a 🔊 button; **click-to-pronounce** any term via `/api/tts`.
- **Per-kanji popup** (`#kpop`): basic meaning (kanjiapi.dev `heisig_en`) + a **looping KanjiVG stroke-order
  animation** (via `lib/kanji.js`). Closes on outside `pointerdown`.
- Toggles: **Audio on/off**, **Furigana** (auto-thins via a growing known-kanji set, word-level), **Kanji
  color** (large gold `#ffd24a` kanji — the dakuten emphasis colour).
- **Knowledge-check gate** (`#check`/`#grade`): 3 MC + 1 open (keyword-graded) → must pass to "Collect" the kanji.
- **Remediation flashcard drill** (`#reviewPanel`): on a failed check, drills ONLY the collectible kanji;
  a flip is required before Next. These per-lesson decks are separate from the JLPT flashcard decks.

**Authoring rules (the writing quality bar):**
- State the concept in **English**, give the name in **Japanese** — embed terms as clean NAMES, **no inline
  glosses / appended English** (that's what tap-gloss/audio are for) and **no extra articles of speech bolted
  onto a kanji** (no "turquoise 海", no "premium 牛").
- **Bold every fact that a knowledge-check answer depends on** (e.g. "**Japan's southernmost inhabited
  island**", "**the highest peak in Okinawa**").
- Vary wording/sentence patterns across places — the failure mode the user watches for is repetitive,
  obviously-AI prose. Differentiate each place.
- Keep entry lessons gentle (few, simple collectibles); don't make beginners drill ~20 advanced terms.

Demo internals: helper `w(jp, rd, en, kanji)`; `isKanji(ch)` = `/[一-龯㐀-䶿]/`; `fmt(s)` converts
`**bold**`→`<b>`; `esc(s)` HTML-escapes; a lesson = `{place, placeRd, sub, bg, sections:[{ic,en,jp,bd:[…]}],
newKanji:[{k,on,kun,meaning,ex}], check:{mc:[{q,choices,a}], open:{q,keywords,model}}}`.

**Real build (future):** (1) build the 教育漢字 dataset backbone; (2) move the engine in-app as a proper
view — note inline scripts would break under enforced CSP; img-src would need `upload.wikimedia.org`; add
image attribution; (3) author towns to Kyoto depth one at a time; (4) wire the stroke-grader into the collect
loop (read → check → **write & grade ≥ C** → collect); (5) migrate the Japan map here.

---

## Stroke-practice — the calligraphy grading engine (`stroke-practice.html`, `/stroke-practice`)
A standalone pilot for **kanji 川** that grades handwriting client-side against **KanjiVG** reference strokes
(no ML). This is the prototype for Kanji Road's "write to collect" step.

**Two-pass flow:** Pass 1 **Trace** (faint KanjiVG reference shown + numbered stroke starts) → Pass 2
**Write from memory** (reference hidden, blank canvas) → **Result** (graded). Drawing is via pointer events
into `userStrokes` (each stroke = array of `{x,y}` in 109-space, plus `_t0`/`_t1` timestamps from
pointerdown/pointerup). The reference SVG is fetched via `KanjiStrokes.fetchSVG`, each `<path>` sampled to
`SAMPLES=24` points in the `0 0 109 109` viewBox space.

**Grade scale (academic):** A ≥90 · B ≥80 · C ≥70 · D ≥60 · **F <60**. **Pass gate = C (`CFG.passMark` 0.70)**
— must score ≥ C *and* pass the knowledge check to collect the kanji. The report shows a ✓/✗ pass banner;
letter is colored green (B/A) / amber (C) / red (D/F).

**Scoring model** — `overall = clamp01(base · dirFactor · countFactor · fluidityFactor)`:
- **base** = `CFG.orderWeight·order + CFG.spacingWeight·spacing` (the non-multiplier quality of the strokes).
  - **order** — each stroke's *normalized-centroid* position nearest to the matching reference slot
    (scale/position invariant).
  - **spacing/balance** — size-normalized stroke-centroid layout deviation: judges the *negative space /
    gaps between strokes*, NOT a pixel-match. `spacing = clamp01(1 − devAvg / CFG.spacingTol)` (tolerance,
    higher = more lenient — NOT a multiplier).
- **dirFactor** = `direction ^ CFG.dirExp` — **HARSH multiplier.** `direction` = fraction of strokes drawn
  the right way (start→end endpoint-vector dot vs reference). One backwards stroke craters the grade (e.g.
  1 of 3 wrong → ~F); scales with stroke count.
- **countFactor** = `max(0.15, 1 − CFG.countPenalty·|userStrokes − refStrokes|)` — harsh multiplier on wrong
  stroke count.
- **fluidityFactor** = `smoothFactor · speedFactor · straightFactor` — three sub-qualities, each its **own
  multiplier (an AND, not a trade-off)**, so a *fast scribble still fails* on smoothness and a *slow clean
  stroke still fails* on speed:
  - **smoothness** — wobble via a **cubic least-squares fit** to the stroke (`strokeDev` = mean point
    deviation from the best-fit cubic; a clean line/arc/S-curve fits ~perfectly, only real wobble leaves a
    residual, amplitude-sensitive). `smooth = clamp01(1 − dev/CFG.smoothDevFull)`;
    `smoothFactor = clamp01(1 − CFG.smoothCoef·(1−smooth)^CFG.smoothExp)`.
  - **speed** — **raw per-stroke TIME** (pointerdown→pointerup only; **gaps between strokes are never
    counted**). Size-independent (graded in seconds, not length/sec, after a bug where small fast strokes
    read as slow). `speed = clamp01((CFG.speedZero − durSec)/(CFG.speedZero − CFG.speedFull))`;
    `speedFactor = clamp01(CFG.speedFloor + (1−CFG.speedFloor)·speed)`. No timestamps (test hook) → speed = 1.
  - **straightness** — curvature-AWARE: penalizes wandering MORE than the reference stroke's own
    pathLen/chord ratio needs. `straight = clamp01(1 − max(0, uR − rR)/CFG.straightTol)`;
    `straightFactor = clamp01(CFG.straightFloor + (1−CFG.straightFloor)·straight)`.
- Strokes are recolored on the result: **red** = wrong direction, **amber** = shaky, **green** = clean.

**All tunable knobs live in one `CFG` object** (defaults in `DEFAULTS`), persisted to `localStorage strokeCfg`,
exposed as `window.__cfg`:
`speedFull`(0.9) `speedZero`(3.0) `speedFloor`(0.55) · `smoothDevFull`(3.0) `smoothCoef`(0.8) `smoothExp`(2.0)
· `straightTol`(0.5) `straightFloor`(0.7) · `spacingTol`(0.40) `orderWeight`(0.55) `spacingWeight`(0.45) ·
`dirExp`(2.5) `countPenalty`(0.3) · `passMark`(0.70).

**Calibration tools** (the workflow for tuning the feel — the numbers are taste, not truth):
- **`?tune`** — renders a live **`.tuner`** panel (14 number inputs grouped by Speed / Smoothness /
  Straightness / Spacing & layout / Direction & count / Pass gate). Editing any value updates `CFG`, saves to
  localStorage, and **live re-grades the last attempt** (`regrade()`, gated by the `graded` flag set in
  `grade()` / cleared in `setStage`). Buttons: **Reset defaults**, **Copy config** (JSON → clipboard).
- **`?debug`** (also on with `?tune`) — a `.dbg` readout under the grade showing **raw values** per stroke
  (time→speed%, raw wobble→smooth%, straight uR/rR ratios, posErr, dir/order) + aggregate (each sub-score →
  its multiplier, fluidityFactor, dirFactor, countFactor, order, spacing devAvg, base, overall). Also on
  `window.__debug`. Hidden for normal users.
- **Shipping tuned values:** the user tunes live, clicks **Copy config**, pastes the JSON → **bake those
  numbers into `DEFAULTS`** to make them the default for everyone (localStorage only affects that browser).
- **Test hook:** `window.__simulate(mode)` builds synthetic strokes from the reference and grades them.
  Modes: *(none/"perfect")*, `reversed`, `rev1` (first stroke backwards), `noisy` (scribble), `dropone`
  (missing stroke), `bunch` (uneven spacing). Returns `{overall, crit[]}`.

---

## Skill Tree prototype (`skill-tree.html`, `/skill-tree`)
A prototype of Guided Learning's planned RPG mechanic. Loads the real `CURRICULUM.units` (~201) into 6 stage
tiers (Foundations → N1); each lesson is a node **locked → available (glowing) → ★ mastered**, unlocking
sequentially, with an XP bar + level and lesson tooltips. Persists to `localStorage skillTreeProto`.
**Prototype only — not yet wired to real lesson progress.** When built for real, reskin the `/guided-learning`
landing from the map theme to the skill tree.

---

## Shared standalone-page nav (`lib/appnav.js`)
The standalone pages live outside `index.html` and would otherwise lose the app menu. `lib/appnav.js`
**injects the REAL sidebar, not a lookalike**: it `fetch`es `/` and `/style.css`, extracts the actual
`#sidebar` + `#sidebarToggle`, and mounts them inside a **Shadow DOM** host (`#anpiNavHost`) with `style.css`
injected *inside* the shadow. Result: pixel-identical to the main app (full deck tree, Games, Story Mode,
badges) AND fully isolated — `style.css` can't clobber each page's bespoke design, and page CSS can't leak in.
- `:root` vars are re-exposed on `:host`; the sidebar's flex/sticky layout is neutralised; collapse is driven
  by host width.
- **Default expanded on desktop** (>720px → `body.marginLeft = 256px` push), **collapsed on mobile**
  (overlay + backdrop). State persists in `localStorage anpiNavCollapsed`.
- The sidebar's real click handlers live in `app.js` (absent here), so clicks are routed to deep links:
  deck → `/?deck=<key>`, game → `/?go=game`, Guided Learning (`#learnNav`) → `/guided-learning`, brand → `/`,
  tour (`#tutorialReplay`) → `/?go=tour`; the Kanji Road `<a>` navigates natively; `<summary>` is left alone
  for native `<details>` toggling.
- Include on a page with `<script defer src="/lib/appnav.js"></script>`. (History: tried a fixed top bar, then
  a hand-built left sidebar — both rejected as "not exact." The shadow-DOM real-sidebar is the answer.)

---

## KanjiVG / `lib/kanji.js`
`window.KanjiStrokes = { render(container, ch), fetchSVG(ch), codepoint(ch), isSupported, stop, getCycles }`.
- `codepoint(ch)` = `ch.codePointAt(0).toString(16).padStart(5,"0")`.
- Loads local `assets/kanjivg/<hex>.svg` first, falls back to
  `https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@master/kanji/<hex>.svg`.
- SVG viewBox is `0 0 109 109`; one ordered `<path>` per stroke. `render` animates each stroke via
  `stroke-dashoffset` and loops. Used by Kanji Road (`#kpop`) and the stroke grader (raw geometry).

## External APIs (all free, no keys)
- **kanjiapi.dev** — `GET https://kanjiapi.dev/v1/kanji/<kanji>` → JSON with `heisig_en` (single clean
  keyword, **preferred** over `meanings[]` which can be noisy), `on_readings[]`, `kun_readings[]`, `grade`,
  `stroke_count`.
- **KanjiVG** stroke SVGs via the jsDelivr CDN (above).
- **Wikipedia pageimages** — `https://en.wikipedia.org/w/api.php?action=query&titles=<T>&prop=pageimages&
  pithumbsize=1600&format=json&redirects=1` → `upload.wikimedia.org` URLs (Kanji Road place backdrops).
- **Google Translate `translate_tts`** — proxied via `/api/tts` (never call it directly client-side; the proxy
  edge-caches and dodges the per-IP browser rate-limit).

---

## Backend (Supabase + Pages Functions)
- **TTS** — `functions/api/tts.js`, `GET /api/tts?q=<text>`. History: Workers AI MeloTTS = silent (dead end);
  paid Google Cloud TTS = needs a key (removed). We use the **FREE** Google Translate `translate_tts`, proxied
  + edge-cached. **No key — don't add one back.**
- **Auth + sync** — `lib/supabase-sync.js` (`window.KanaSync`). Email confirmation is OFF. Hydrates from cloud
  on sign-in.
- **Learn-state sync** — `pushLearnState()` / `hydrateLearnState()` (key `LEARN_KEY = "anpiLearn"`; unions the
  done-lessons set, the more-advanced side's level wins), `KanaSync.onLearnChange` hook, dispatches a window
  `anpi-learn-synced` event. Requires the **`learn_state`** table — **the user must run `supabase-learn.sql`
  once** in the Supabase SQL editor or sync silently no-ops (local still works).
- **SQL files** — `supabase-schema.sql`, `supabase-leaderboard.sql`, `supabase-learn.sql`. Avoid `$$`
  dollar-quoting in SQL handed to the user (use `$func$`). The user runs these in the SQL editor.

## CSP & headers (`_headers`)
- CSP is **`Content-Security-Policy-Report-Only`** — it does **NOT block**, only reports. So external images
  / inline scripts work today. **If/when CSP is enforced**, `img-src` must add `upload.wikimedia.org`, and
  inline `<script>` in the standalone pages would need to move to external files.
- `_headers` sets `/favicon.svg` → `Content-Type: image/svg+xml` (Cloudflare Pages otherwise mislabels it
  `text/html`, which `nosniff` then blocks).

## Data migration (one-time, from the retired origin)
`index.html`'s `<head>` has an inline script: the old `anpi.pages.dev` "Move my progress" page bounces here
with the data in the URL **hash** (`#anpimigrate=…`, kept in the fragment so it never hits a server). It
writes the values into this origin's localStorage *before* the app boots (skipping `sb-` Supabase auth keys),
cleans the URL, and shows a welcome toast. `window.anpiImportData(json)` is a manual paste fallback.

---

## Multi-agent / concurrent work
This repo is sometimes worked on by several agents at once (via the user's "Terminal Bridge" tool). To
avoid stepping on each other:
- **Serialize deploys.** Never run two `wrangler pages deploy` at the same time — a Direct Upload pushes
  the *entire* current folder state, so a concurrent deploy can publish another agent's half-finished work.
  Finish + verify your change, then deploy as a single atomic step. If unsure whether another deploy is in
  flight, wait and re-run rather than racing.
- **Shared wrangler auth is global to the machine.** One `npx wrangler login` covers everyone; if you hit
  *"set a CLOUDFLARE_API_TOKEN"*, don't loop-retry — surface it to the user (only a human can re-login).
- **Hot files** — `app.js`, `index.html`, `style.css`, `lib/curriculum.js`. Prefer small, surgical edits
  (don't rewrite whole files) so concurrent changes reconcile, and re-read a file right before editing in
  case another agent just changed it.
- **Regenerated `data/` decks:** if two agents run different `build-*.js` scripts, each overwrites only its
  own deck files, but committing/deploying mid-run can mix states — coordinate or sequence deck rebuilds.
- **One source of truth per concern.** A deck's content lives in its `build-*.js` (regenerate, don't
  hand-edit `data/`); a lesson lives in `lib/curriculum.js` + its `JOURNEY_XY`/`journey` entry. Edit the
  source, not the generated artifact.
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
| 🔒 **Security / backend** | `functions/` (esp. `api/tts.js`), `supabase-schema.sql`, `supabase-leaderboard.sql`, `supabase-learn.sql`, `lib/supabase-sync.js` | — | `app.js` UI/game/lesson code, `style.css`, `lib/curriculum.js` |
| 🗾 **Kanji Road / writing** | `kanji-road*.html`, `stroke-practice.html`, `KANJI-ROAD.md`, `lib/kanji.js` | `lib/appnav.js`, `favicon.svg`, `_headers` | `app.js` game/leaderboard, `build-*.js` |

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
  *plan wave → **dispatch each agent's brief into its tab via `tb.mjs send` (launch with
  `claude --permission-mode acceptEdits`)** → agents build in worktrees → lead reviews each diff → **⇊ Gather** →
  lead reconciles conflicts + validates on `main` → **deploy once from `main`** → update CLAUDE.md + the
  `.agents/` log → next wave.* (The lead can drive agent tabs directly — `tb.mjs list`/`send`/`key`, see the
  auto-loaded Terminal Bridge guide — so it no longer asks the user to copy/paste prompts.)
- **Deploy gate:** deploy ONLY from `main`, ONLY after review + validation, and never from a `wt/*` tab (a Direct
  Upload pushes that worktree's whole state — deploying a branch would publish work missing everyone else's).
- **Conflict authority:** the lead reconciles shared files (`app.js`, `style.css`, `index.html`) because it
  understands the whole app (e.g. the `setMainView`/leaderboard interleaving that makes `app.js` un-splittable).

The lead's control center is **`.agents/`** (a dotfolder — in git, excluded from the public deploy):
- `.agents/PROMPTS.md` — ready-to-paste agent briefs (one per lane), derived from the charters above.
- `.agents/ROADMAP.md` — prioritized backlog / waves and the cross-cutting tasks the lead owns.
- `.agents/WAVELOG.md` — running record of what each agent is doing, what's merged, what's deployed.
  **The lead reads `.agents/` + this file at the start of every session** (its memory across context resets).

---

## Testing (Playwright)
Chromium + Playwright are installed (via the `webapp-testing` skill). Pattern: write a throwaway `.cjs`,
`require` Playwright from the npx cache, run with `node`, then `rm -f`:
```js
const { chromium } = require("C:/Users/socia/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright");
```
- Hit the live site with a cache-buster: `await p.goto("https://anpi-learning.pages.dev/<path>?cb="+Date.now())`.
- Capture `pageerror` to assert no console errors.
- For the stroke grader, drive `window.__simulate(mode)` or set `userStrokes` + `_t0/_t1` directly then call
  `grade()`; read `window.__debug` / the `#grade` DOM. For nav, the standalone sidebar is in
  `document.getElementById("anpiNavHost").shadowRoot`.
- **Headless can't load CDN tiles / external images** — verify map & photo visuals on the live site / a real
  browser, not from screenshots in the sandbox.
- Playwright sometimes reports the sidebar `.deck` click intercepted by `<main>` on desktop — click via
  `el.click()` in `page.evaluate` instead of `page.click`.

## Conventions & gotchas (quick list)
- PowerShell: `npx.cmd`, `$null` not `/dev/null`, backtick line-continuation. Don't chain
  `git add -A; git commit -m @'...'@` — run the here-string commit as its own call.
- Section `html` in `curriculum.js` is a backtick template literal — **no backticks / `${}` inside**.
- Validate `curriculum.js` after edits (the `node -e` one-liner above); a stray quote breaks the whole array.
- Coords are `[lng,lat]` in our data; Leaflet wants `[lat,lng]`.
- After deploying, expect a few seconds of edge-cache lag before the main domain shows new content.
- Keep the `tourActive` guard on `#learnNav`; keep the in-app Learn view's `showLearnView()` N5 default.

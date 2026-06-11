# Badge system — spec (locked by lead)

For the 🏅 badge agent. Build this in `lib/badges.js` (+ a fenced CSS block at the end of `style.css`).
Reconcile with the EXISTING small achievements system in app.js (the `ACHIEVEMENTS` array in the
`// === Stats & Achievements ===` section, ~line 2181, + `renderStats`). Goal: a richer, categorised
"flex wall" that celebrates real progress.

## Data sources (confirmed — read these; don't invent fields)
- `localStorage["anpiStats"]` (JSON): `days` = `{ "YYYY-MM-DD": true }` (→ current/longest **streak**),
  `gamesPlayed` (int), `bestGameScore` (string BigInt), `bestGameStreak` (int).
- `localStorage["anpiLearn"]` (JSON): `done` = `{ "<unitId>": true }` (**lesson completion**), `level`.
- `window.CURRICULUM`: `units` (each `{id, stage, ...}`) and `journey` (each `{id, place, pref, region}`)
  → use to compute **stage completion** and **map-region** badges. Region order S→N: Okinawa, Kyūshū,
  Shikoku, Chūgoku, Kansai, Chūbu, Kantō, Tōhoku, Hokkaidō.
- Persist your own UNLOCK history under `localStorage["anpiBadges"]` (so you can detect *newly* earned
  badges for a celebration toast). NEVER write to `anpiStats`.

## Taxonomy (Wave 1 = build all that have a confirmed data source)
**Onboarding** 🌱 — first lesson done; first game played (`gamesPlayed>=1`).
**Streak** 🔥 — 3 / 7 / 14 / 30 / 100 consecutive days (compute from `days`; app.js already has a streak calc to mirror).
**Lessons** 📚 — 5 / 10 / 25 / 50 / 100 lessons done; **complete a stage** (all units of Foundations / N5 / N4 / N3 / N2 / N1 done); **Journey complete** (all units done → "Reached Hokkaidō 🏁").
**Map regions** 🗾 — one badge per region reached (≥1 done lesson whose `journey.region` = that region). Nine badges; ties the wall to the satellite map.
**Game** 🎮 — games 10 / 50 / 100; combo 50 / 100 (`bestGameStreak`); score 100K / 500K / 1M / 10M (`bestGameScore`, BigInt-compare). (Migrate the existing 5 game achievements into the catalogue.)
**Meta** 🏅 — earn 10 / 25 badges total.

## Needs a data source first (DON'T fake — flag to lead, descope from Wave 1 if absent)
- **Study volume / "cards reviewed" / deck mastery / all-kana**: there is no confirmed per-card "known"
  counter or total-reviews field in `anpiStats` today. If you want these, propose a tiny tracking hook in
  the study flow (app.js) and **coordinate with the lead** (shared file) — or skip for Wave 1.

## Integration (keep app.js footprint ~zero)
- Own the full catalogue + `evaluate()` (live-compute earned from the data sources) + `renderInto(el)` in
  `lib/badges.js`. Render the wall into a container in the **Stats view**. Either reuse the existing
  achievements container or add ONE new container to `index.html`; if you need a single hook line in
  `renderStats`, ask the lead (it's the shared file).
- Use the `frontend-design` skill for the wall's look — keep it readable (the user has one weaker eye + a
  TV; larger text, clear locked/earned states, don't shrink). Locked badges shown greyed with their unlock
  condition; earned badges colored with earned-date tooltip.
- A subtle "new badge!" toast when `evaluate()` finds an id not in `anpiBadges` is a nice touch (optional).

## Done = 
catalogue covers every confirmed-data badge above; earns correctly from real stats/lesson state; persists;
renders cleanly on mobile + PC; existing game achievements migrated (no duplicates); report the taxonomy +
where it renders + anything descoped for missing data.

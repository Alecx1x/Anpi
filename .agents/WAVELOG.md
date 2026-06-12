# Wave log

The lead's running record of what's in flight — **read this + CLAUDE.md + .agents/ first each session** to
reload state. One row per dispatched agent task; update on dispatch / review / gather / deploy.

| Date | Lane | Branch (wt/*) | Task | Status | Merged→main | Deployed |
|---|---|---|---|---|---|---|
| 2026-06-11 | — (lead) | main | Leaflet/Esri satellite map, badges scaffold, CLAUDE.md, `.agents/` control center, committed clean main (767837d) | done | n/a | ✅ anpi.pages.dev |
| 2026-06-11 | — (lead) | main | Wave-1 kit: BADGE-SPEC, filled PROMPTS, skill-based quality gates | done | n/a | n/a (docs) |
| 2026-06-11 | 📚 lessons | wt/lessons | +4 Learn units (N4 aspect-aux, N4 season-nature, N2 debate, N1 kotowaza v2) — ff-merge d32b495, 113/113 units, all wired+band-placed | **deployed** | ✅ b298ed7→d32b495 | ✅ anpi-learning.pages.dev (972f2c42, 2026-06-11) |
| 2026-06-11 | 🎮🏅🔒 wave-1 | wt/game, wt/badges, wt/security | game pause-on-blur + per-deck best; badges wall (Option-2 hook, supersedes legacy ACHIEVEMENTS); /api/tts per-IP rate-limit + least-privilege RLS/grants | **deployed** | ✅ Gather → main 16eeab4 | ✅ anpi-learning.pages.dev (11d2bf2e, 2026-06-11) + SQL run in Supabase by user |

## Wave 1 — DONE (all 4 lanes shipped 2026-06-11)
| Lane | Branch | Task | Status |
|---|---|---|---|
| 📚 lessons | wt/lessons | +4 lessons (pilot) | ✅ deployed (loop proven end-to-end) |
| 🎮 game | wt/game | pause-on-blur + per-deck best score on picker | ✅ deployed |
| 🏅 badges | wt/badges | badge wall (Option-2 renderStats hook; full superset of old 12 ACHIEVEMENTS) | ✅ deployed |
| 🔒 security | wt/security | rate-limit /api/tts + per-command RLS least-privilege + revoke default PUBLIC grants | ✅ deployed (SQL run in Supabase) |

## Wave 2 — DISPATCHED 2026-06-12 (all 4 lanes, worktrees ff'd to main 6e8c091)
| Lane | Branch | Task | Status |
|---|---|---|---|
| 📚 lessons | wt/lessons | small batch of high-value crucial-Japanese units (no filler) + journey/JOURNEY_XY | dispatched |
| 🎮 game | wt/game | extensible special-asteroid system; first type = FROZEN (stalls all asteroids + pauses spawns ~5s) | dispatched |
| 🏅 badges | wt/badges | expand catalogue to LEARNING badges (lesson/stage/journey milestones + flashcard-set/deck mastery) | dispatched |
| 🔒 security | wt/security | keep hardening: tts.js abuse/SSRF/rate-limit, RLS least-privilege gaps, supabase-sync path (keep free translate_tts, no key) | dispatched |

Status values: `ready` → `dispatched` → `in-review` → `gathered` → `deployed` (or `blocked`/`abandoned`).

## Current state of `main` (keep this 1-liner fresh)
- **"Anpi Learning" @ https://anpi-learning.pages.dev**, HEAD `16eeab4`. Learn = Leaflet/Esri satellite map.
  **113 lessons.** Wave-1 LIVE: real **badge wall** (lib/badges.js, supersedes legacy ACHIEVEMENTS via a
  guarded Badges.renderInto hook in renderStats), game **auto-pause on blur** + **per-deck best** on picker,
  **/api/tts per-IP rate-limit**, and **hardened Supabase RLS/grants** (SQL was run in the project on
  2026-06-11). **TTS now uses the FREE Google Translate `translate_tts` proxy — no key needed** (the paid
  Google Cloud TTS key requirement was removed 2026-06-12; audio verified 200 on live). **Old duplicate
  `anpi` Pages project DELETED 2026-06-12 — `anpi-learning` is the sole URL.** Remaining USER TODO: add
  `https://anpi-learning.pages.dev` to Supabase Auth Site-URL/redirect allow-list (sign-in). TB 🚀 Deploy
  button still targets old `anpi` — must change to `--project-name=anpi-learning` before using it (or it
  will error now that `anpi` is gone).

## Lead deploy checklist (run before every deploy)
1. On `main`, tree clean after ⇊ Gather (or intended changes only).
2. Review the gathered diff: **/code-review** (and **/security-review** if functions/ or SQL changed).
3. Validate: `node --check app.js && node --check lib/badges.js` (+ any edited build/lib JS).
4. If lessons changed: units count + every unit has journey + JOURNEY_XY; if game/UI changed: **/verify** or
   **/run** a quick smoke test (incl. mobile layout).
5. `npx.cmd wrangler pages deploy . --project-name anpi-learning --commit-dirty=true`
6. Log the deployment URL + what shipped; refresh the "Current state" line above.

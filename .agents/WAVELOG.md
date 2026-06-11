# Wave log

The lead's running record of what's in flight — **read this + CLAUDE.md + .agents/ first each session** to
reload state. One row per dispatched agent task; update on dispatch / review / gather / deploy.

| Date | Lane | Branch (wt/*) | Task | Status | Merged→main | Deployed |
|---|---|---|---|---|---|---|
| 2026-06-11 | — (lead) | main | Leaflet/Esri satellite map, badges scaffold, CLAUDE.md, `.agents/` control center, committed clean main (767837d) | done | n/a | ✅ anpi.pages.dev |
| 2026-06-11 | — (lead) | main | Wave-1 kit: BADGE-SPEC, filled PROMPTS, skill-based quality gates | done | n/a | n/a (docs) |

## Wave 1 (planned — not yet dispatched)
Pilot FIRST with lessons to prove the loop, then fan out.
| Lane | Branch | Task (see .agents/PROMPTS.md for full brief) | Status |
|---|---|---|---|
| 📚 lessons | wt/lessons | +4 lessons (N4 aspect-aux, N4 weather idioms, N2 debate, N1 kotowaza v2) | ready — PILOT |
| 🎮 game | wt/game | pause-on-blur + per-deck best score on picker | ready (after pilot) |
| 🏅 badges | wt/badges | build BADGE-SPEC (streak/lessons/stage/region/game/meta) | ready (after pilot) |
| 🔒 security | wt/security | rate-limit /api/tts + tighten Supabase RLS | ready (after pilot) |

Status values: `ready` → `dispatched` → `in-review` → `gathered` → `deployed` (or `blocked`/`abandoned`).

## Current state of `main` (keep this 1-liner fresh)
- **Renamed to "Anpi Learning"; new URL https://anpi-learning.pages.dev** (old anpi.pages.dev retired).
  Learn = Leaflet/Esri satellite map (cinematic intro, feathered edges). Badges = scaffold only. 109 lessons.
  No lane agents dispatched yet. USER TODO on the new Pages project: set `GOOGLE_TTS_KEY` (TTS) + add the new
  domain to Supabase Auth Site-URL/redirect allow-list (sign-in).

## Lead deploy checklist (run before every deploy)
1. On `main`, tree clean after ⇊ Gather (or intended changes only).
2. Review the gathered diff: **/code-review** (and **/security-review** if functions/ or SQL changed).
3. Validate: `node --check app.js && node --check lib/badges.js` (+ any edited build/lib JS).
4. If lessons changed: units count + every unit has journey + JOURNEY_XY; if game/UI changed: **/verify** or
   **/run** a quick smoke test (incl. mobile layout).
5. `npx.cmd wrangler pages deploy . --project-name anpi-learning --commit-dirty=true`
6. Log the deployment URL + what shipped; refresh the "Current state" line above.

# Wave log

The lead's running record of what's in flight — **read this first each session** to know current state.
One row per dispatched agent task. Update when you dispatch, review, gather, and deploy.

| Date | Lane | Branch (wt/*) | Task | Status | Merged→main | Deployed |
|---|---|---|---|---|---|---|
| 2026-06-11 | — (lead) | main | Set up satellite Leaflet map, badges scaffold, CLAUDE.md, `.agents/` control center | done | n/a | ✅ anpi.pages.dev |

Status values: `dispatched` → `in-review` → `gathered` → `deployed` (or `blocked` / `abandoned`).

## Current state of `main` (keep this 1-liner fresh)
- Live at https://anpi.pages.dev. Learn path = Leaflet/Esri satellite map (cinematic sea→zoom intro,
  feathered edges). Badge system = scaffold only (`lib/badges.js`, no UI yet). 109 lessons. No lane agents
  dispatched yet.

## Deploy checklist (lead runs this before every deploy)
1. On `main`, working tree clean after Gather (or intended changes only).
2. `node --check app.js && node --check lib/badges.js` (+ any edited build/lib JS).
3. Curriculum sanity if lessons changed: units count + every unit has journey + JOURNEY_XY.
4. `npx.cmd wrangler pages deploy . --project-name anpi --commit-dirty=true`
5. Log the deployment URL + what shipped here; update the "Current state" line above.

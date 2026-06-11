# Roadmap / backlog

Prioritized work, grouped by lane. The lead picks items into a "wave", fills the `TASK:` in the matching
prompt (`.agents/PROMPTS.md`), and logs dispatch in `.agents/WAVELOG.md`. Statuses: `todo` / `in-wave` /
`done`. Keep this current — it's the shared plan.

## Lead-owned (cross-cutting — do these in the main session, not a lane agent)
- [ ] **Rename to "Anpi Learning"** — copy/branding pass across index.html (title, headings, home page),
      manifest/meta, and any in-app name strings. OPEN DECISION before starting: keep the Cloudflare Pages
      project (`anpi`) + URL `anpi.pages.dev`, or move to a new project/domain? (URL change has external
      impact — confirm with the user; default = keep `anpi` project, just change displayed name.)
      Best done BEFORE spawning content agents, to avoid merge churn.
- [ ] Keep CLAUDE.md + `.agents/` current after every wave.

## 🎮 Game
- [ ] (carry over) any difficulty-curve / power-up / mobile-control polish the user requested.
- [ ] Idea: per-deck high-score display on the picker; combo/streak juice; pause on blur.

## 📚 Lessons (the standing "keep building lessons" track)
- [ ] Continue adding units across stages, each with journey + JOURNEY_XY (band-placed). Candidate untouched
      topics: Aspect auxiliaries deep-dive, Seasonal/weather idioms (N4); Abstract feelings & psychology,
      Debate & persuasion (N2); kotowaza/yojijukugo vol. 2, classical-excerpt reading (N1).
- [ ] Use authoritative JLPT lists as the source of truth for any "complete coverage" claim (don't invent).

## 🏅 Badges
- [ ] Define the badge taxonomy (the lead should lock this spec before the agent builds): streak milestones,
      decks mastered, game scores/modes, lessons/stages completed, perfect rounds, first-time actions.
- [ ] Build out lib/badges.js (catalogue + evaluate + renderInto) + fenced CSS; reconcile with the existing
      "Stats & Achievements" wall (extend it vs. new container — decide).

## 🔒 Security / backend
- [ ] Rate-limit `/api/tts` (per-IP / per-minute) to protect the Google TTS key + quota.
- [ ] Review Supabase RLS on profiles / high_scores / progress / reports; confirm least-privilege.
- [ ] Input validation/escaping in all Pages Functions; confirm GOOGLE_TTS_KEY never reaches the client.

## Notes / open decisions
- Rename URL scope (above) — needs user confirmation.
- Whether the badge system extends the existing achievements wall or stands alone.

-- ============================================================================
-- Anpi — Global leaderboards add-on.
-- Run ONCE in Supabase → SQL Editor (after supabase-schema.sql). Safe to re-run.
-- ============================================================================

-- A PUBLIC display name. The existing profiles.username defaults to the user's
-- email (set by the sign-up trigger), which must NEVER be shown publicly, so
-- leaderboards use this separate, user-chosen field instead.
alter table public.profiles add column if not exists display_name text;

-- Best combo/streak achieved on the run that set each high score.
alter table public.high_scores add column if not exists best_streak int default 0;

-- ---------- Leaderboard: top scores for a deck + difficulty -----------------
-- SECURITY DEFINER so it can read EVERY user's high_scores (bypassing the
-- per-user RLS) while exposing ONLY a display name + score — never emails.
-- Granted to anon as well so signed-out visitors can still view leaderboards.
-- Scores are stored as text (they can exceed bigint), so we cast to numeric for
-- correct ordering.
create or replace function public.get_leaderboard(p_deck text, p_diff text, p_limit int default 10)
returns table (user_id uuid, name text, score text, achieved_at timestamptz, rank bigint)
language sql
security definer
set search_path = public
as $$
  select hs.user_id,
         coalesce(nullif(btrim(p.display_name), ''), 'Anonymous') as name,
         hs.score,
         hs.achieved_at,
         row_number() over (order by hs.score::numeric desc, hs.achieved_at asc) as rank
  from public.high_scores hs
  left join public.profiles p on p.id = hs.user_id
  where hs.deck_id = p_deck and hs.difficulty = p_diff
  order by hs.score::numeric desc, hs.achieved_at asc
  limit greatest(1, least(coalesce(p_limit, 10), 100));
$$;

-- ---------- The signed-in caller's own rank (even if outside the top N) ------
create or replace function public.get_my_rank(p_deck text, p_diff text)
returns table (rank bigint, total bigint, score text)
language sql
security definer
set search_path = public
as $$
  with ranked as (
    select user_id, score,
           row_number() over (order by score::numeric desc, achieved_at asc) as rank
    from public.high_scores
    where deck_id = p_deck and difficulty = p_diff
  )
  select r.rank,
         (select count(*) from public.high_scores
            where deck_id = p_deck and difficulty = p_diff) as total,
         r.score
  from ranked r
  where r.user_id = auth.uid();
$$;

grant execute on function public.get_leaderboard(text, text, int) to anon, authenticated;
grant execute on function public.get_my_rank(text, text)          to authenticated;

-- ---------- GLOBAL leaderboard: every score across all decks -----------------
-- Ranks every saved high score together (optionally filtered to one difficulty).
-- Returns the deck + difficulty per row so the UI can show a coloured column.
-- Drop the old 2-arg signature before recreating with an added deck/set filter.
drop function if exists public.get_global_leaderboard(text, int);
create or replace function public.get_global_leaderboard(p_diff text default null, p_deck text default null, p_limit int default 50)
returns table (user_id uuid, name text, deck_id text, difficulty text, score text, best_streak int, achieved_at timestamptz, rank bigint)
language sql
security definer
set search_path = public
as $$
  select hs.user_id,
         coalesce(nullif(btrim(p.display_name), ''), 'Anonymous') as name,
         hs.deck_id, hs.difficulty, hs.score, coalesce(hs.best_streak, 0) as best_streak, hs.achieved_at,
         row_number() over (order by hs.score::numeric desc, hs.achieved_at asc) as rank
  from public.high_scores hs
  left join public.profiles p on p.id = hs.user_id
  where (p_diff is null or p_diff = '' or hs.difficulty = p_diff)
    and (p_deck is null or p_deck = '' or hs.deck_id = p_deck)
  order by hs.score::numeric desc, hs.achieved_at asc
  limit greatest(1, least(coalesce(p_limit, 50), 200));
$$;

-- ---------- Podiums: the caller's top-3 finishes (for profile badges) --------
-- For every deck + difficulty the user has a score in, their rank within that
-- group; returns only the ones where they're 1st–3rd.
create or replace function public.get_my_podiums()
returns table (deck_id text, difficulty text, rank bigint, score text)
language sql
security definer
set search_path = public
as $$
  with ranked as (
    select user_id, deck_id, difficulty, score,
           row_number() over (partition by deck_id, difficulty
                              order by score::numeric desc, achieved_at asc) as rank
    from public.high_scores
  )
  select deck_id, difficulty, rank, score
  from ranked
  where user_id = auth.uid() and rank <= 3
  order by rank asc, deck_id asc;
$$;

grant execute on function public.get_global_leaderboard(text, text, int) to anon, authenticated;
grant execute on function public.get_my_podiums()                  to authenticated;

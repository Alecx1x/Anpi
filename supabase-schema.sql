-- ============================================================================
-- Kana Flashcards — Supabase schema, RLS policies, and profile trigger.
-- Run this ONCE in your project's SQL editor:
--   Supabase Dashboard → SQL Editor → New query → paste → Run.
-- Safe to re-run (uses IF NOT EXISTS / drop-and-recreate for policies).
-- ============================================================================

-- ---------- Tables ----------------------------------------------------------

-- User profiles
create table if not exists public.profiles (
  id uuid references auth.users primary key,
  username text unique,
  created_at timestamp with time zone default now()
);

-- Study progress per deck (one row per user + deck + card)
create table if not exists public.progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  deck_id text not null,
  card_id text not null,
  correct_count integer default 0,
  incorrect_count integer default 0,
  last_studied timestamp with time zone default now()
);

-- Game high scores
create table if not exists public.high_scores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  deck_id text not null,
  difficulty text not null,
  score text not null,
  achieved_at timestamp with time zone default now()
);

-- Study session reports
create table if not exists public.reports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  deck_id text not null,
  session_date timestamp with time zone default now(),
  total_cards integer,
  correct_count integer,
  incorrect_count integer,
  report_data jsonb
);

-- Helpful indexes for the per-user lookups the app does.
create index if not exists progress_user_deck_idx   on public.progress    (user_id, deck_id);
create index if not exists high_scores_user_idx      on public.high_scores (user_id, deck_id, difficulty);
create index if not exists reports_user_date_idx     on public.reports     (user_id, session_date);

-- ---------- Row Level Security ----------------------------------------------
-- Least privilege: every policy is scoped to the `authenticated` role and to
-- the caller's OWN rows only. `anon` (signed-out) gets NO direct table access —
-- public leaderboards are served exclusively through the SECURITY DEFINER
-- functions in supabase-leaderboard.sql, which expose only display_name+score
-- (never emails). We also grant ONLY the commands the app actually issues
-- (no DELETE anywhere; reports are insert+select only) so a stolen anon key
-- can't be used to wipe or tamper with another user's data.

alter table public.profiles    enable row level security;
alter table public.progress    enable row level security;
alter table public.high_scores enable row level security;
alter table public.reports     enable row level security;

-- Drop any prior policies (old single "for all" names + the new per-command ones).
drop policy if exists "profiles: own row"        on public.profiles;
drop policy if exists "progress: own rows"       on public.progress;
drop policy if exists "high_scores: own rows"    on public.high_scores;
drop policy if exists "reports: own rows"        on public.reports;
drop policy if exists "profiles: select own"     on public.profiles;
drop policy if exists "profiles: insert own"     on public.profiles;
drop policy if exists "profiles: update own"     on public.profiles;
drop policy if exists "progress: select own"     on public.progress;
drop policy if exists "progress: insert own"     on public.progress;
drop policy if exists "progress: update own"     on public.progress;
drop policy if exists "high_scores: select own"  on public.high_scores;
drop policy if exists "high_scores: insert own"  on public.high_scores;
drop policy if exists "high_scores: update own"  on public.high_scores;
drop policy if exists "reports: select own"      on public.reports;
drop policy if exists "reports: insert own"      on public.reports;

-- profiles: read/create/update only your own row (display_name lives here).
create policy "profiles: select own" on public.profiles
  for select to authenticated using (auth.uid() = id);
create policy "profiles: insert own" on public.profiles
  for insert to authenticated with check (auth.uid() = id);
create policy "profiles: update own" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- progress: per-card study counts — read/insert/update your own rows.
create policy "progress: select own" on public.progress
  for select to authenticated using (auth.uid() = user_id);
create policy "progress: insert own" on public.progress
  for insert to authenticated with check (auth.uid() = user_id);
create policy "progress: update own" on public.progress
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- high_scores: read/insert/update your own scores (leaderboards read via RPC).
create policy "high_scores: select own" on public.high_scores
  for select to authenticated using (auth.uid() = user_id);
create policy "high_scores: insert own" on public.high_scores
  for insert to authenticated with check (auth.uid() = user_id);
create policy "high_scores: update own" on public.high_scores
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- reports: session history — insert + read your own (the app never edits them).
create policy "reports: select own" on public.reports
  for select to authenticated using (auth.uid() = user_id);
create policy "reports: insert own" on public.reports
  for insert to authenticated with check (auth.uid() = user_id);

-- ---------- Auto-create a profile row on sign-up ----------------------------
-- So every new auth user immediately has a matching profiles row (used as the
-- foreign-key target for progress / high_scores / reports).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $func$
begin
  insert into public.profiles (id, username)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$func$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

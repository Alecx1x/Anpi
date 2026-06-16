-- Anpi — Learn-path progress sync.
-- Run ONCE in the Supabase SQL editor (Dashboard → SQL → New query → paste → Run).
-- Stores each signed-in user's guided-path level + completed lessons so they
-- follow the account across devices and domains. Mirrors the least-privilege RLS
-- of the main schema: authenticated users can only touch their OWN row; anon gets
-- nothing. Safe to re-run (idempotent).

create table if not exists public.learn_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  level      text,
  done       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.learn_state enable row level security;

drop policy if exists "learn_state: select own" on public.learn_state;
drop policy if exists "learn_state: insert own" on public.learn_state;
drop policy if exists "learn_state: update own" on public.learn_state;

create policy "learn_state: select own" on public.learn_state
  for select to authenticated using (auth.uid() = user_id);
create policy "learn_state: insert own" on public.learn_state
  for insert to authenticated with check (auth.uid() = user_id);
create policy "learn_state: update own" on public.learn_state
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

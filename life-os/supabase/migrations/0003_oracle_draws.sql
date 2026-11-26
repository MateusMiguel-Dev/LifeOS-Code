-- LIFE OS · synchronized daily oracle draws
create table if not exists public.oracle_draws (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  draw_date date not null,
  card_id text not null check (card_id in ('moon','sky','sun','earth','ocean','stars')),
  created_at timestamptz not null default now(),
  unique (user_id, draw_date)
);
alter table public.oracle_draws enable row level security;
drop policy if exists "Users manage own oracle draws" on public.oracle_draws;
create policy "Users manage own oracle draws" on public.oracle_draws
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists oracle_draws_user_date_idx on public.oracle_draws(user_id, draw_date desc);

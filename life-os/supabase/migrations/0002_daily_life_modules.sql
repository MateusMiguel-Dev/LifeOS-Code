-- LIFE OS · daily-life modules
create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null check (char_length(title) between 1 and 180),
  details text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  all_day boolean not null default false,
  category text not null default 'personal',
  reminder_minutes integer,
  created_at timestamptz not null default now(),
  check (ends_at is null or ends_at >= starts_at)
);
create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null check (char_length(title) between 1 and 180),
  details text,
  remind_at timestamptz not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null check (char_length(title) between 1 and 160),
  amount numeric(12,2) not null check (amount >= 0),
  due_date date not null,
  category text not null default 'outro',
  recurrence text not null default 'none' check (recurrence in ('none','monthly','yearly')),
  paid_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  description text not null check (char_length(description) between 1 and 180),
  amount numeric(12,2) not null check (amount > 0),
  kind text not null check (kind in ('income','expense')),
  category text not null default 'outro',
  occurred_on date not null default current_date,
  created_at timestamptz not null default now()
);
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null default 'Sem título',
  content text not null default '',
  pinned boolean not null default false,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create table if not exists public.weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  week_start date not null,
  wins text,
  challenges text,
  next_week text,
  created_at timestamptz not null default now(),
  unique(user_id, week_start)
);
do $$
declare t text;
begin
  foreach t in array array['calendar_events','reminders','payments','transactions','notes','weekly_reviews'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %I on public.%I', 'Users manage own '||t, t);
    execute format('create policy %I on public.%I for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)', 'Users manage own '||t, t);
  end loop;
end $$;
create index if not exists calendar_events_user_start_idx on public.calendar_events(user_id, starts_at);
create index if not exists reminders_user_time_idx on public.reminders(user_id, remind_at) where completed = false;
create index if not exists payments_user_due_idx on public.payments(user_id, due_date) where paid_at is null;
create index if not exists transactions_user_date_idx on public.transactions(user_id, occurred_on desc);
create index if not exists notes_user_updated_idx on public.notes(user_id, updated_at desc);

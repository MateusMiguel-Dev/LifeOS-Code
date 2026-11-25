-- LIFE OS · initial schema
create extension if not exists pgcrypto;

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null check (char_length(title) between 1 and 240),
  description text,
  due_date date,
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name text not null check (char_length(name) between 1 and 120),
  color text not null default '#9b82f6',
  frequency text not null default 'daily' check (frequency in ('daily','weekdays','weekly')),
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.habit_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  completed_on date not null default current_date,
  created_at timestamptz not null default now(),
  unique (habit_id, completed_on)
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null check (char_length(title) between 1 and 180),
  description text,
  target_date date,
  progress smallint not null default 0 check (progress between 0 and 100),
  status text not null default 'active' check (status in ('active','completed','paused')),
  created_at timestamptz not null default now()
);

alter table public.tasks enable row level security;
alter table public.habits enable row level security;
alter table public.habit_entries enable row level security;
alter table public.goals enable row level security;

create policy "Users manage their own tasks" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their own habits" on public.habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their own habit entries" on public.habit_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their own goals" on public.goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists tasks_user_created_idx on public.tasks(user_id, created_at desc);
create index if not exists tasks_user_due_idx on public.tasks(user_id, due_date);
create index if not exists habits_user_idx on public.habits(user_id);
create index if not exists habit_entries_user_date_idx on public.habit_entries(user_id, completed_on desc);
create index if not exists goals_user_status_idx on public.goals(user_id, status);

-- LIFE OS · avoid sending the same reminder more than once
alter table public.reminders
  add column if not exists notification_sent_at timestamptz;
create index if not exists reminders_due_push_idx
  on public.reminders(remind_at)
  where completed = false and notification_sent_at is null;

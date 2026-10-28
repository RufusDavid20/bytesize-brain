-- Run this SQL in your Supabase project's SQL Editor.
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  subscribed_at timestamptz not null default now(),
  source text not null default 'website'
);

alter table public.newsletter_subscribers enable row level security;

-- Subscriber records must never be readable/writable directly by website visitors.
revoke all on table public.newsletter_subscribers from anon, authenticated;
grant all on table public.newsletter_subscribers to service_role;

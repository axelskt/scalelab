-- ScaleLab — Table users (plan management)
-- À exécuter dans Supabase → SQL Editor (après supabase-schema.sql)

create table if not exists users (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  name text,
  image text,
  plan text not null default 'free' check (plan in ('free', 'starter', 'pro', 'business', 'student')),
  plan_expires_at timestamptz,
  onboarded boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists users_email_idx on users(email);

alter table users enable row level security;
create policy "Service manage users" on users for all using (true);

-- ScaleLab — Supabase Schema
-- À exécuter dans Supabase → SQL Editor

-- ─── Table creators ──────────────────────────────────────────────────────────
create table if not exists creators (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  page_url text not null unique,
  source text not null check (source in ('facebook', 'tiktok')),
  niche text not null default 'Marketing digital',
  ads_count integer default 0,
  first_seen date,
  last_seen date,
  thumbnail_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ─── Table ads ───────────────────────────────────────────────────────────────
create table if not exists ads (
  id text primary key,
  creator_name text not null,
  creator_page_url text,
  source text not null check (source in ('facebook', 'tiktok')),
  country text default 'FR',
  language text default 'fr',
  start_date date,
  run_days integer default 0,
  ad_text text,
  thumbnail_url text,
  video_url text,
  ad_url text,
  niche text[],
  keywords text[],
  product_type text,
  price text,
  detected_niche text,
  offer text,
  analysis jsonb,
  score integer default 0,
  scraped_at timestamptz default now()
);

-- ─── Index pour les requêtes fréquentes ──────────────────────────────────────
create index if not exists ads_score_idx on ads(score desc);
create index if not exists ads_source_idx on ads(source);
create index if not exists ads_run_days_idx on ads(run_days desc);
create index if not exists ads_scraped_at_idx on ads(scraped_at desc);
create index if not exists creators_source_idx on creators(source);
create index if not exists creators_niche_idx on creators(niche);

-- ─── Row Level Security (lecture publique, écriture service role) ─────────────
alter table ads enable row level security;
alter table creators enable row level security;

create policy "Public read ads" on ads for select using (true);
create policy "Service write ads" on ads for insert with check (true);
create policy "Service update ads" on ads for update using (true);

create policy "Public read creators" on creators for select using (true);
create policy "Service write creators" on creators for insert with check (true);
create policy "Service update creators" on creators for update using (true);

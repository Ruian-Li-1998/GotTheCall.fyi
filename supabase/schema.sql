-- Got the Call — Supabase schema
-- Run this once in the Supabase SQL editor, then `npm run seed` to load data.

create extension if not exists "pgcrypto";

-- Enums -------------------------------------------------------------
do $$ begin
  if not exists (select 1 from pg_type where typname = 'dealer_type') then
    create type dealer_type as enum ('AD', 'Boutique', 'Online', 'Other');
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'datapoint_status') then
    create type datapoint_status as enum ('approved', 'pending');
  end if;
end $$;

-- Tables ------------------------------------------------------------
create table if not exists watch_models (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  model text not null,
  reference text not null,
  nickname text,
  slug text not null unique,
  retail_price_usd integer not null default 0,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists datapoints (
  id uuid primary key default gen_random_uuid(),
  model_slug text references watch_models (slug) on delete set null,
  brand text not null,
  model text not null,
  reference text not null,
  nickname text,
  wait_months integer not null,
  spend_before_usd integer not null default 0,
  paid_price_usd integer,
  dealer_type dealer_type not null default 'AD',
  dealer_name text,
  country text not null,
  city text,
  region text not null default 'Other',
  was_existing_client boolean not null default false,
  got_call_date date not null,
  notes text,
  status datapoint_status not null default 'approved',
  is_sample boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists datapoints_model_slug_idx on datapoints (model_slug);
create index if not exists datapoints_status_idx on datapoints (status);
create index if not exists datapoints_got_call_date_idx on datapoints (got_call_date desc);

-- Row Level Security ------------------------------------------------
-- Reads are public (anon key). Writes go through the service-role key
-- on the server, which bypasses RLS — so no public insert policy here.
alter table watch_models enable row level security;
alter table datapoints enable row level security;

drop policy if exists "public read watch_models" on watch_models;
create policy "public read watch_models" on watch_models
  for select using (true);

drop policy if exists "public read approved datapoints" on datapoints;
create policy "public read approved datapoints" on datapoints
  for select using (status = 'approved');

-- ============================================================================
-- Migration: locations_cache
-- Module:    prayer-times
-- Purpose:   Persistent (L2) cache of normalized Aladhan prayer timings,
--            keyed by rounded coordinates + gregorian date.
--
-- Run this in the Supabase SQL editor (or via the CLI: `supabase db push`).
-- ============================================================================

create extension if not exists "pgcrypto";   -- provides gen_random_uuid()

create table if not exists public.locations_cache (
  id          uuid          primary key default gen_random_uuid(),
  latitude    numeric(9, 6) not null,        -- rounded to ~0.0001 precision by the app
  longitude   numeric(9, 6) not null,
  date        date          not null,        -- gregorian calendar date the timings apply to
  timezone    text          not null,        -- IANA tz returned by Aladhan, e.g. "Asia/Dhaka"
  timings     jsonb         not null,        -- normalized { Fajr, Sunrise, Dhuhr, ... } map
  created_at  timestamptz   not null default now()
);

-- One cached row per coordinate+date. The service rounds lat/lng before lookup
-- and insert, so this uniqueness is what makes the cache actually hit.
create unique index if not exists locations_cache_lat_lng_date_uq
  on public.locations_cache (latitude, longitude, date);

-- Supports the cache-eviction sweep ( delete ... where date < cutoff ).
create index if not exists locations_cache_date_idx
  on public.locations_cache (date);

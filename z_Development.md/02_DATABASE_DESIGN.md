# 🗄️ Phase 1 — Database Design (Supabase)

> **Stack:** Supabase (PostgreSQL)  
> **Rule:** সব table-এ `user_id` এবং `date` index থাকবে।  
> **Auth:** Supabase Auth — `auth.users` table automatically managed।

---

## 📊 Entity Relationship Overview

```
auth.users (Supabase managed)
    │
    ├──► users (public profile)
    ├──► fasting_logs
    └──► zakat_records

daily_content (cron-managed, no user_id)
locations_cache (server-managed cache)
```

---

## 📋 Table Definitions

---

### Table: `users`
> Supabase `auth.users`-এর public profile extension।

```sql
CREATE TABLE public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Notes:**
- `id` is the same as `auth.users.id`
- Trigger দিয়ে auto-populate on signup
- কোনো password এখানে নেই (Supabase Auth handle করে)

---

### Table: `fasting_logs`
> User প্রতিদিন রোজা রাখলে একটা record।

```sql
CREATE TABLE public.fasting_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  status      BOOLEAN NOT NULL DEFAULT TRUE,
  note        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, date)  -- একদিনে একটাই log
);

CREATE INDEX idx_fasting_logs_user_id ON public.fasting_logs(user_id);
CREATE INDEX idx_fasting_logs_date    ON public.fasting_logs(date);
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK → users |
| `date` | DATE | রোজার তারিখ (YYYY-MM-DD) |
| `status` | BOOLEAN | `true` = রোজা রেখেছি, `false` = রাখিনি |
| `note` | TEXT | Optional (শিফা পেয়েছিলাম, etc.) |

---

### Table: `daily_content`
> Cron job প্রতিদিন নতুন row insert করবে।  
> **API Source:** [alquran-api.pages.dev](https://alquran-api.pages.dev/) — free, no key, multilingual (bn/en)

```sql
CREATE TABLE public.daily_content (
  id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  date         DATE    NOT NULL UNIQUE,
  surah_number INT     NOT NULL,
  ayah_number  INT     NOT NULL,
  arabic       TEXT    NOT NULL,
  translation  TEXT    NOT NULL,
  source_api   TEXT    NOT NULL DEFAULT 'alquran-api.pages.dev',
  lang         TEXT    NOT NULL DEFAULT 'bn'
                       CHECK (lang IN ('bn', 'en')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_daily_content_date ON public.daily_content(date);
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `date` | DATE | Unique — প্রতিদিন একটা |
| `surah_number` | INT | Surah ID (1–114) |
| `ayah_number` | INT | Verse number |
| `arabic` | TEXT | আরবি টেক্সট |
| `translation` | TEXT | বাংলা (default) বা ইংরেজি অনুবাদ |
| `source_api` | TEXT | `'alquran-api.pages.dev'` |
| `lang` | TEXT | `'bn'` বা `'en'` |

**API Call Example:**
```
GET https://alquran-api.pages.dev/api/quran/surah/2/verse/185?lang=bn
```

**Response mapping:**
```
response.arabic      → arabic column
response.translation → translation column
response.surahId     → surah_number column
response.verseId     → ayah_number column
```

---

### Table: `zakat_records`
> User-এর Zakat calculation history।

```sql
CREATE TABLE public.zakat_records (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  gold_value      NUMERIC(12,2) NOT NULL DEFAULT 0,
  silver_value    NUMERIC(12,2) NOT NULL DEFAULT 0,
  cash_savings    NUMERIC(12,2) NOT NULL DEFAULT 0,
  business_assets NUMERIC(12,2) NOT NULL DEFAULT 0,
  debts           NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_zakatable NUMERIC(12,2) NOT NULL,
  zakat_amount    NUMERIC(12,2) NOT NULL,
  nisab_threshold NUMERIC(12,2) NOT NULL,
  is_liable       BOOLEAN NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_zakat_records_user_id ON public.zakat_records(user_id);
```

**Calculation Logic (Backend করবে):**
```
total_zakatable = gold + silver + cash + business_assets - debts
is_liable       = total_zakatable >= nisab_threshold
zakat_amount    = is_liable ? total_zakatable * 0.025 : 0
```

---

### Table: `locations_cache`
> Prayer time API call কমাতে cache।

```sql
CREATE TABLE public.locations_cache (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city         TEXT NOT NULL,
  country      TEXT NOT NULL DEFAULT 'BD',
  lat          NUMERIC(9,6),
  lng          NUMERIC(9,6),
  prayer_times JSONB NOT NULL,
  date         DATE NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(city, country, date)
);

CREATE INDEX idx_locations_cache_city_date ON public.locations_cache(city, date);
```

**`prayer_times` JSONB Structure:**
```json
{
  "Fajr":    "04:32",
  "Sunrise": "05:55",
  "Dhuhr":   "12:10",
  "Asr":     "15:45",
  "Maghrib": "18:20",
  "Isha":    "19:35"
}
```

---

## 🔐 Row Level Security (RLS) Policies

```sql
-- fasting_logs: শুধু নিজের data দেখতে পারবে
ALTER TABLE public.fasting_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own fasting logs"
  ON public.fasting_logs
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- zakat_records: শুধু নিজের data
ALTER TABLE public.zakat_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own zakat records"
  ON public.zakat_records
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- daily_content: সবাই read করতে পারবে (public)
ALTER TABLE public.daily_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read daily content"
  ON public.daily_content
  FOR SELECT
  USING (true);

-- locations_cache: server-only write, public read
ALTER TABLE public.locations_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read locations cache"
  ON public.locations_cache
  FOR SELECT
  USING (true);
```

---

## 🔁 Auto-create User Profile Trigger

```sql
-- auth.users-এ signup হলে public.users-এ auto insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 📌 Index Summary

| Table | Index Columns | কেন |
|-------|--------------|-----|
| `fasting_logs` | `user_id`, `date` | User-এর date range query |
| `daily_content` | `date` | আজকের content fetch |
| `zakat_records` | `user_id` | User history |
| `locations_cache` | `city, date` | Cache hit check |

---

## 🧹 Cron Cleanup Jobs

```sql
-- রাত ১২টায় পুরনো location cache delete (midnight UTC)
-- NestJS Cron করবে:
DELETE FROM public.locations_cache
WHERE date < CURRENT_DATE - INTERVAL '3 days';
```

---

## ✅ Setup Checklist

- [ ] Supabase project create করো
- [ ] SQL Editor-এ সব CREATE TABLE run করো
- [ ] RLS policies enable করো
- [ ] Trigger function add করো
- [ ] Test: signup করে `public.users`-এ row আসছে কিনা দেখো
- [ ] `SUPABASE_URL` এবং `SUPABASE_ANON_KEY` note করো

---

*পরের phase: Backend API design → `03_BACKEND_ARCHITECTURE.md`*

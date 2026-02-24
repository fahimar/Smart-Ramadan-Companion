# 📚 Smart Ramadan Companion (Lite) — Development Documentation

> **Purpose:** এই ফোল্ডারে Smart Ramadan Companion প্রজেক্টের সম্পূর্ণ ডেভেলপমেন্ট গাইড রয়েছে।  
> প্রতিটা ফাইল একটা নির্দিষ্ট phase বা topic কভার করে।

---

## 🗺️ Document Map

| # | File | কী আছে |
|---|------|---------|
| 00 | `00_INDEX.md` | এই ফাইল — Master index |
| 01 | `01_PRODUCT_DEFINITION.md` | MVP features, scope, non-goals |
| 02 | `02_DATABASE_DESIGN.md` | Supabase schema, SQL, indexes, RLS |
| 03 | `03_BACKEND_ARCHITECTURE.md` | NestJS modules, API contracts, patterns |
| 04 | `04_FRONTEND_ARCHITECTURE.md` | Next.js pages, components, data flow |
| 05 | `05_ENGINEERING_RULES.md` | SOLID, DRY, coding standards |
| 06 | `06_DEPLOYMENT_AND_DEMO.md` | Deploy checklist, demo script |

---

## 🏗️ System Architecture (One-Liner)

```
Next.js (UI) ──► NestJS API ──► Supabase (Postgres + Auth)
                     │
                     └─ Cron Jobs (daily ayah, prayer sync)
```

- **Next.js** = UI only. Zero business logic.
- **NestJS** = Single source of truth for all business logic.
- **Supabase** = Database + Auth + Storage.
- **Mobile App** = Later. Same NestJS API. No new backend.

---

## 🚀 Development Order

```
Phase 0 → Product Lock
Phase 1 → Database Design
Phase 2 → NestJS Backend
Phase 3 → Cron Jobs
Phase 4 → Next.js Frontend
Phase 5 → Mobile (post-MVP)
Phase 6 → Deployment
Phase 7 → Demo Prep
```

> **Golden Rule:** DB → API → UI।  
> UI কখনো DB-এর সাথে সরাসরি কথা বলবে না।  
> সব কিছু NestJS API-এর মাধ্যমে।

---

## ✅ MVP Feature Checklist

- [ ] Prayer time + next prayer countdown (location-based)
- [ ] Sehri / Iftar times (location-based)
- [ ] Daily Ayah / Hadith (auto-rotated via cron)
- [ ] Fasting tracker (log per day)
- [ ] Zakat calculator

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14+ (App Router) |
| Backend | NestJS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth + JWT |
| Styling | Tailwind CSS + shadcn/ui |
| Language | TypeScript (strict) |
| Deployment | Vercel (FE) + Railway/Fly.io (BE) |

---

## 📁 Workspace Folder Structure

```
Smart Ramadan Companion/
├── z_Development.md/        ← You are here (docs)
├── backend/                 ← NestJS backend (to be created)
└── frontend/                ← Next.js frontend (to be created)
```

---

*Last Updated: February 2026*

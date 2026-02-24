# 🚀 Phase 6 & 7 — Deployment + Demo Preparation

---

# 🌐 Phase 6 — Deployment

## Architecture Overview

```
Internet
   │
   ├── Vercel ─────────────────► Next.js Frontend
   │         (auto CI/CD from GitHub)
   │
   ├── Railway / Fly.io ────────► NestJS Backend API
   │         (Docker or Nixpacks)
   │
   └── Supabase ────────────────► PostgreSQL + Auth
             (managed, always free tier available)
```

---

## 🗄️ Supabase Setup

### Step 1: Project Create
1. [supabase.com](https://supabase.com) → New Project
2. Region: Singapore (BD-এর কাছে)
3. Password note করো (DB password)

### Step 2: Database Setup
```bash
# SQL Editor-এ এই order-এ run করো:
1. 02_DATABASE_DESIGN.md থেকে সব CREATE TABLE
2. RLS policies
3. Trigger function
```

### Step 3: Keys Note করো
```
Settings → API:
  - Project URL: https://xxxx.supabase.co
  - anon/public key: eyJ...
  - service_role key: eyJ... (backend-only!)

Settings → Auth → JWT Settings:
  - JWT Secret: (copy করো)
```

### Step 4: Auth Settings
```
Authentication → Providers:
  ✅ Email (enable করো)
  ✅ Google OAuth (optional)

Authentication → URL Configuration:
  Site URL: https://your-app.vercel.app
  Redirect URLs: https://your-app.vercel.app/**
```

---

## ⚙️ NestJS Backend Deployment (Railway)

### Step 1: Railway Project
1. [railway.app](https://railway.app) → New Project
2. "Deploy from GitHub repo" select করো
3. `backend/` folder select করো

### Step 2: Environment Variables
Railway dashboard → Variables:
```
PORT=3001
NODE_ENV=production
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
SUPABASE_JWT_SECRET=your_jwt_secret
ALADHAN_API_BASE=https://api.aladhan.com/v1
ALQURAN_API_BASE=https://api.alquran.cloud/v1
```

### Step 3: Dockerfile (যদি লাগে)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/main.js"]
```

### Step 4: Verify
```
https://your-api.railway.app/health
→ { "status": "ok", "timestamp": "..." }
```

---

## 🖥️ Next.js Frontend Deployment (Vercel)

### Step 1: Vercel Project
1. [vercel.com](https://vercel.com) → New Project
2. GitHub repo connect করো
3. Framework: Next.js (auto-detect)
4. Root Directory: `frontend/`

### Step 2: Environment Variables
Vercel dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_API_URL=https://your-api.railway.app
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Step 3: Deploy
```bash
# Local test আগে
cd frontend
npm run build
npm run start

# Git push করলেই auto-deploy
git push origin main
```

### Step 4: Custom Domain (optional)
- Vercel dashboard → Domains
- `ramadan.yourdomain.com` add করো

---

## ✅ Deployment Checklist

### Pre-deploy
- [ ] সব env variables set হয়েছে
- [ ] `npm run build` locally pass হচ্ছে
- [ ] API health check endpoint কাজ করছে
- [ ] Supabase tables তৈরি হয়েছে
- [ ] RLS policies active আছে

### Post-deploy
- [ ] Frontend URL থেকে backend API call হচ্ছে
- [ ] Register + Login কাজ করছে
- [ ] Prayer times fetch হচ্ছে
- [ ] Daily content দেখাচ্ছে
- [ ] Fasting toggle save হচ্ছে
- [ ] Zakat calculation কাজ করছে

---
---

# 🎬 Phase 7 — Demo Preparation

## 🏆 What Judges Look For

> "Don't try to impress with features. Impress with a working demo."

```
✅ Dashboard loads fast
✅ Prayer times accurate (location-based)
✅ Fasting toggle works
✅ Ayah changes daily
✅ Zakat calculator gives correct result
✅ Clean Islamic UI
✅ Mobile responsive
```

---

## 📋 Demo Script (5 Minutes)

```
[0:00 - 0:30] Opening
"Smart Ramadan Companion — Muslims-দের Ramadan আরও মনযোগ দিয়ে observe করতে সাহায্য করে।"

[0:30 - 1:30] Dashboard
- Browser খোলো → dashboard দেখাও
- "এখানে দেখুন — আজকের Sehri ছিল ৪:৩২, Iftar ৬:২০"
- Countdown timer live দেখাও
- "পরের নামাজ Asr, ২ ঘন্টা ৪৫ মিনিট বাকি"

[1:30 - 2:30] Daily Ayah
- AyahBox দেখাও
- "প্রতিদিন সকালে একটা নতুন আয়াত — আজকে সূরা বাকারার ১৮৫ নম্বর আয়াত"
- "রমজান মাস, যাতে নাযিল করা হয়েছে কুরআন..."

[2:30 - 3:30] Fasting Tracker
- /fasting page এ যাও
- ৩০ দিনের calendar দেখাও
- "আমি ২৮ দিন রোজা রেখেছি, ২ দিন মিস হয়েছে"
- Toggle click করে দেখাও

[3:30 - 4:30] Zakat Calculator
- /zakat page এ যাও
- Numbers fill করো (live)
- "হিসাব করুন" click করো
- Result দেখাও: "আপনার Zakat ফরজ হয়েছে — ৳ ১২,৫০০"

[4:30 - 5:00] Technical Closing
- "Next.js + NestJS + Supabase"
- "Clean architecture, SOLID principles"
- "Mobile app? Same API — Phase 2"
- "Thank you"
```

---

## 🎯 Demo Day Preparation

### Technical Prep
- [ ] Production URL test করো (দিন আগে)
- [ ] Mobile phone-এ demo URL খোলো
- [ ] Location permission pre-grant করো
- [ ] Test user account তৈরি রাখো
- [ ] Pre-filled fasting data থাকবে (28/30 দেখাবে)
- [ ] Backup: screen recording রাখো

### Talking Points
- **Problem:** Muslims manually prayer time check করে, fasting track রাখা কঠিন
- **Solution:** একটা app-এ সব — prayer, fasting, Quran, Zakat
- **Tech:** Modern stack, scalable, mobile-ready
- **Impact:** ৩০ দিনের Ramadan আরও consistent হবে

---

## 🔍 Potential Judge Questions & Answers

| প্রশ্ন | উত্তর |
|-------|-------|
| "Prayer time accurate কিভাবে?" | Aladhan API — globally trusted Islamic prayer time calculation |
| "Location privacy?" | Browser permission নিই, server-এ store করি না |
| "Offline কাজ করে?" | Phase 2 — PWA plan আছে |
| "Mobile app?" | Same NestJS API reuse — React Native Phase 5 |
| "Scale করবে?" | Supabase (managed Postgres) + Railway autoscale |
| "Multiple users?" | Supabase Auth + RLS — production-ready |

---

## 📱 Screenshots to Prepare

- [ ] Dashboard (desktop + mobile)
- [ ] Prayer times page
- [ ] Fasting calendar (with data filled)
- [ ] Zakat calculator (with result)
- [ ] Dark mode (if implemented)

---

## 🌙 Final Words

> **"Clean architecture, working demo, clear Islamic purpose, stability."**  
> এটাই জেতায়। Feature দিয়ে না।

---

*এই document-এর সব phase complete হলে project ready।*  
*Good luck। Ramadan Mubarak। 🌙*

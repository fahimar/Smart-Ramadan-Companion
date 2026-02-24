# 📋 Phase 0 — Product Definition

> **Objective:** MVP feature lock। এখানে যা আছে শুধু সেটাই বানাবো।  
> No feature creep. Ship করো আগে।

---

## 🎯 Product Vision

**Smart Ramadan Companion (Lite)** হলো একটা lightweight Islamic web app যা Muslims-দের Ramadan আরও মনযোগ দিয়ে, consistently observe করতে সাহায্য করবে।

- Simple, distraction-free
- Spiritually purposeful
- Location-aware
- Works on any device

---

## ✅ MVP Core Features (Phase 1 scope)

### 1. 🕌 Prayer Times + Next Prayer Countdown
- User-এর location detect করে (browser geolocation)
- 5 ওয়াক্তের নামাজের সময় দেখাবে
- পরবর্তী নামাজের live countdown timer
- External API: [Aladhan API](https://aladhan.com/prayer-times-api) (free, no key needed)

**User Story:**  
> "আমি dashboard খুলতেই দেখতে চাই এখন কোন ওয়াক্ত চলছে এবং পরের নামাজ কতক্ষণ পরে।"

---

### 2. 🌙 Sehri / Iftar Times (Location-Based)
- Sehri (Fajr time) এবং Iftar (Maghrib time) prominently দেখাবে
- Location পারমিশন দিলে automatically calculate করবে
- Fallback: শহরের নাম দিয়ে manual search

**User Story:**  
> "আমি জানতে চাই আজকে আমার এলাকায় সেহরি কখন শেষ এবং ইফতার কখন।"

---

### 3. 📿 Daily Ayah / Hadith
- প্রতিদিন একটা নতুন Quran ayah অথবা Hadith দেখাবে
- Arabic text + Bangla/English translation
- Cron job রাত ৩টায় (UTC) নতুন content pull করবে
- Source: [Al-Quran Cloud API](https://alquran.cloud/api) (free)

**User Story:**  
> "প্রতিদিন সকালে app খুলে একটা অনুপ্রেরণামূলক আয়াত বা হাদিস দেখতে চাই।"

---

### 4. 📅 Fasting Tracker
- User প্রতিদিন "আমি রোজা রেখেছি" toggle করতে পারবে
- Ramadan-এর ৩০ দিনের ক্যালেন্ডার view
- Color-coded: ✅ রোজা রাখা, ❌ মিস, ⬜ আসেনি

**User Story:**  
> "আমি track রাখতে চাই এই Ramadan-এ কতটা রোজা রেখেছি।"

---

### 5. 🧮 Zakat Calculator
- Nisab threshold automatically calculate করবে
- User input: সোনা/রূপার মূল্য, সঞ্চয়, ব্যবসায়িক পণ্য, ঋণ
- Output: মোট Zakat amount (2.5%)
- Record save করার option

**User Story:**  
> "আমি জানতে চাই আমার উপর Zakat ফরজ হয়েছে কিনা এবং কত দিতে হবে।"

---

## ❌ Non-Goals (MVP-তে নেই)

| Feature | কেন নেই |
|---------|---------|
| Push notifications | Complexity বাড়ায়, MVP নয় |
| Social sharing | Distraction |
| Tasbih counter | Phase 2 |
| Full Quran reader | Scope creep |
| Community features | Out of scope |
| Offline mode (PWA) | Phase 2 |
| Mobile app (React Native) | Phase 5 |

---

## 👤 Target User

- Muslim, Ramadan observe করে
- Smartphone বা desktop ব্যবহার করে
- Daily reminder দরকার
- Simple এবং fast experience চায়

---

## 📐 User Flow (Happy Path)

```
1. App খোলো
   ↓
2. Location permission দাও (একবার)
   ↓
3. Dashboard দেখো:
   - আজকের Sehri/Iftar time
   - পরের নামাজের countdown
   - আজকের Ayah/Hadith
   ↓
4. রোজার toggle করো (logged in হলে)
   ↓
5. Zakat calculate করো (optional)
```

---

## 🔐 Authentication Strategy

- **Guest mode:** Prayer times + Ayah দেখা যাবে (no login needed)
- **Logged in:** Fast tracker + Zakat records save হবে
- **Auth provider:** Supabase Auth (email + password, Google OAuth optional)

---

## 🗓️ Sprint Plan

| Sprint | কী বানাবো | সময় |
|--------|----------|------|
| Sprint 1 | DB setup + Auth + Prayer times API | Day 1-2 |
| Sprint 2 | Fasting tracker + Daily content cron | Day 3-4 |
| Sprint 3 | Zakat calculator + Frontend polish | Day 5-6 |
| Sprint 4 | Testing + Deploy + Demo prep | Day 7 |

---

*এই document lock হলে পরের phase শুরু হবে।*  
*Feature change করতে হলে এখানে আগে লিখতে হবে।*

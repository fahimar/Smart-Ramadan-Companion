# 🎨 Phase 3 & 4 — Cron Jobs + Next.js Frontend Architecture

---

# ⏰ Phase 3 — Cron Jobs

> **Framework:** `@nestjs/schedule`  
> **Location:** `src/modules/content/content.cron.ts`

---

## Cron Job 1 — Daily Content Fetch
**Schedule:** প্রতিদিন রাত ৩টায় (UTC) → বাংলাদেশে সকাল ৯টা

```typescript
@Cron('0 3 * * *', { name: 'daily-content' })
async fetchAndStoreDailyContent(): Promise<void> {
  const today = new Date().toISOString().split('T')[0];

  // Already exists? Skip.
  const exists = await this.contentRepository.findByDate(today);
  if (exists) return;

  // Randomly pick ayah or hadith (alternating)
  const type = this.getContentType();

  if (type === 'ayah') {
    // Al-Quran Cloud API: random ayah
    const ayahNumber = Math.floor(Math.random() * 6236) + 1;
    const response = await axios.get(
      `https://api.alquran.cloud/v1/ayah/${ayahNumber}/editions/quran-uthmani,en.asad`
    );
    await this.contentRepository.save({ type: 'ayah', ...mapped, date: today });
  }
}
```

---

## Cron Job 2 — Location Cache Cleanup
**Schedule:** প্রতিদিন রাত ১২টায় (UTC)

```typescript
@Cron('0 0 * * *', { name: 'cache-cleanup' })
async cleanupOldLocationCache(): Promise<void> {
  await this.prayerRepository.deleteOldCache(3); // 3 days পুরনো delete
}
```

---

## External APIs Used

| API | URL | Key লাগবে? | কী কাজে |
|-----|-----|-----------|---------|
| Aladhan | `api.aladhan.com/v1` | ❌ | Prayer times |
| Al-Quran Cloud | `api.alquran.cloud/v1` | ❌ | Daily ayah |

---
---

# 🖥️ Phase 4 — Next.js Frontend Architecture

> **Framework:** Next.js 14+ (App Router)  
> **Styling:** Tailwind CSS + shadcn/ui  
> **Rule:** ❌ No business logic in React। ✅ সব API call-এর মাধ্যমে।  
> **Data Fetching:** Server Components যেখানে সম্ভব।

---

## 📁 Folder Structure

```
frontend/
├── app/
│   ├── layout.tsx              ← Root layout (fonts, providers)
│   ├── page.tsx                ← Landing / redirect to /dashboard
│   ├── globals.css
│   │
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   │
│   ├── dashboard/
│   │   └── page.tsx            ← Main dashboard (prayer + ayah + fasting)
│   │
│   ├── prayer/
│   │   └── page.tsx            ← Full prayer schedule
│   │
│   ├── fasting/
│   │   └── page.tsx            ← 30-day Ramadan calendar
│   │
│   └── zakat/
│       └── page.tsx            ← Zakat calculator form
│
├── components/
│   ├── prayer/
│   │   ├── PrayerCard.tsx
│   │   ├── CountdownTimer.tsx
│   │   └── SehriIftarBanner.tsx
│   │
│   ├── fasting/
│   │   ├── FastingToggle.tsx
│   │   ├── RamadanCalendar.tsx
│   │   └── FastingStats.tsx
│   │
│   ├── content/
│   │   └── AyahBox.tsx
│   │
│   ├── zakat/
│   │   ├── ZakatForm.tsx
│   │   └── ZakatResult.tsx
│   │
│   └── ui/                     ← shadcn/ui components
│
├── lib/
│   ├── api.ts                  ← All API calls (typed)
│   └── utils.ts
│
├── contexts/
│   └── auth-context.tsx        ← Auth state (Supabase client)
│
└── hooks/
    ├── usePrayerTimes.ts
    ├── useCountdown.ts
    └── useFasting.ts
```

---

## 📄 Page Breakdown

---

### `/dashboard` — Main Dashboard
> সবচেয়ে important page।

**Layout:**
```
┌─────────────────────────────────────┐
│  🌙 Sehri 04:32  |  🌅 Iftar 18:20 │  ← SehriIftarBanner
├─────────────────────────────────────┤
│  Next Prayer: Asr in 02:45:30       │  ← CountdownTimer
│  ════ ════ ════ ════ ════           │  ← PrayerCard (5 prayers)
├─────────────────────────────────────┤
│  📿 আজকের আয়াত                     │  ← AyahBox
│  "রমযান মাস, যাতে নাযিল করা হয়..."  │
├─────────────────────────────────────┤
│  🗓️ আজকের রোজা  [রেখেছি ✅]         │  ← FastingToggle
└─────────────────────────────────────┘
```

**Data fetching:**
```typescript
// Server Component — SSR
async function DashboardPage() {
  const city = getUserCity(); // from cookie or default "Dhaka"
  const [prayerTimes, dailyContent] = await Promise.all([
    api.getPrayerTimes({ city }),
    api.getDailyContent(),
  ]);
  // ...
}
```

---

### `/fasting` — Ramadan Calendar
> ৩০ দিনের visual tracker।

**Layout:**
```
Ramadan 1446 AH — Progress: 28/30 ████████░░ 93%

[1✅][2✅][3✅][4❌][5✅]...[30⬜]
```

**Components:** `RamadanCalendar`, `FastingStats`

---

### `/zakat` — Zakat Calculator

**Layout:**
```
💰 Zakat Calculator

সোনার মূল্য:        [________]
রূপার মূল্য:         [________]
নগদ সঞ্চয়:         [________]
ব্যবসায়িক পণ্য:    [________]
ঋণ:                [________]

              [হিসাব করুন]

━━━━━━━━━━━━━━━━━━━━
✅ Zakat ফরজ হয়েছে
মোট Zakat: ৳ 12,500
(Nisab: ৳ 500,000)
```

---

## 🧩 Key Components

---

### `CountdownTimer.tsx` (Client Component)
```typescript
'use client';

interface Props {
  targetTime: string;  // "15:45"
  prayerName: string;  // "Asr"
}

export function CountdownTimer({ targetTime, prayerName }: Props) {
  const remaining = useCountdown(targetTime);
  // HH:MM:SS format এ দেখাবে
  // Real-time update (setInterval)
}
```

---

### `FastingToggle.tsx` (Client Component)
```typescript
'use client';

export function FastingToggle({ date, initialStatus }: Props) {
  const [status, setStatus] = useState(initialStatus);

  async function handleToggle() {
    const newStatus = !status;
    setStatus(newStatus); // Optimistic update
    await api.logFast({ date, status: newStatus });
  }
  // Toggle button + label
}
```

---

### `AyahBox.tsx` (Server Component)
```typescript
// No 'use client' — Server Component
export async function AyahBox() {
  const content = await api.getDailyContent();
  return (
    <div>
      <p className="arabic text-right text-2xl">{content.arabic}</p>
      <p className="translation mt-2">{content.translation}</p>
      <small>{content.source}</small>
    </div>
  );
}
```

---

## 📡 `lib/api.ts` — Typed API Client

```typescript
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  // Prayer
  getPrayerTimes: (params: { city: string; country?: string }) =>
    fetch(`${BASE_URL}/prayer/times?city=${params.city}`).then(r => r.json()),

  // Fasting
  logFast: (body: { date: string; status: boolean }) =>
    fetch(`${BASE_URL}/fasting/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(body),
    }).then(r => r.json()),

  getFastingHistory: () =>
    fetch(`${BASE_URL}/fasting/history`, { headers: authHeader() }).then(r => r.json()),

  // Content
  getDailyContent: () =>
    fetch(`${BASE_URL}/content/daily`).then(r => r.json()),

  // Zakat
  calculateZakat: (body: CalculateZakatDto) =>
    fetch(`${BASE_URL}/zakat/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(body),
    }).then(r => r.json()),
};
```

---

## 🎨 Design Tokens (Tailwind)

```javascript
// tailwind.config.ts
colors: {
  ramadan: {
    green:  '#1B5E20',   // Primary Islamic green
    gold:   '#F59E0B',   // Accents
    cream:  '#FEFCE8',   // Background
    night:  '#0F172A',   // Dark mode bg
  }
}
```

**Islamic Color Palette:**
- 🟢 Primary: Deep green (`#1B5E20`)
- 🌙 Accent: Gold/amber (`#F59E0B`)
- ⬜ Background: Warm cream (light) / Night blue (dark)
- ✍️ Arabic font: `Amiri` বা `Noto Naskh Arabic`

---

## 🌐 Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## 📦 Key Dependencies

```json
{
  "next": "^14",
  "react": "^18",
  "typescript": "^5",
  "tailwindcss": "^3",
  "@supabase/supabase-js": "^2",
  "date-fns": "^3",
  "lucide-react": "latest"
}
```

---

## ✅ Frontend Checklist

- [ ] `next create app` with App Router + TypeScript + Tailwind
- [ ] shadcn/ui install করো
- [ ] Arabic font (Amiri/Noto) add করো Google Fonts থেকে
- [ ] Auth context setup করো (Supabase client)
- [ ] `lib/api.ts` typed client তৈরি করো
- [ ] Dashboard page — Prayer times + Ayah + Fasting toggle
- [ ] Fasting page — Calendar view
- [ ] Zakat page — Form + result
- [ ] Responsive করো (mobile first)
- [ ] Dark mode support (optional but nice)

---

*পরের step: Engineering Rules → `05_ENGINEERING_RULES.md`*

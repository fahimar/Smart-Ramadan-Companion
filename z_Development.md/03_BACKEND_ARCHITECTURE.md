# ⚙️ Phase 2 — NestJS Backend Architecture

> **Framework:** NestJS (TypeScript)  
> **Pattern:** Controller → Service → Repository  
> **Rule:** Controller thin। Business logic শুধু Service-এ। DB access শুধু Repository-তে।

---

## 📁 Folder Structure

```
backend/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.repository.ts
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── register.dto.ts
│   │   │   └── guards/
│   │   │       └── jwt-auth.guard.ts
│   │   │
│   │   ├── prayer/
│   │   │   ├── prayer.module.ts
│   │   │   ├── prayer.controller.ts
│   │   │   ├── prayer.service.ts
│   │   │   ├── prayer.repository.ts
│   │   │   └── dto/
│   │   │       └── get-prayer-times.dto.ts
│   │   │
│   │   ├── fasting/
│   │   │   ├── fasting.module.ts
│   │   │   ├── fasting.controller.ts
│   │   │   ├── fasting.service.ts
│   │   │   ├── fasting.repository.ts
│   │   │   └── dto/
│   │   │       ├── log-fast.dto.ts
│   │   │       └── fasting-log.response.dto.ts
│   │   │
│   │   ├── daily-content/
│   │   │   ├── daily-content.module.ts
│   │   │   ├── daily-content.controller.ts
│   │   │   ├── daily-content.service.ts
│   │   │   ├── daily-content.repository.ts
│   │   │   ├── daily-content.cron.ts
│   │   │   └── dto/
│   │   │       └── daily-content-response.dto.ts
│   │   │
│   │   └── zakat/
│   │       ├── zakat.module.ts
│   │       ├── zakat.controller.ts
│   │       ├── zakat.service.ts
│   │       ├── zakat.repository.ts
│   │       ├── strategies/
│   │       │   └── zakat-calculation.strategy.ts
│   │       └── dto/
│   │           ├── calculate-zakat.dto.ts
│   │           └── zakat-result.dto.ts
│   │
│   └── common/
│       ├── guards/
│       │   └── jwt-auth.guard.ts
│       ├── filters/
│       │   └── http-exception.filter.ts
│       ├── interceptors/
│       │   └── response-transform.interceptor.ts
│       ├── decorators/
│       │   └── current-user.decorator.ts
│       └── supabase/
│           └── supabase.service.ts
│
├── test/
├── .env
├── package.json
└── tsconfig.json
```

---

## 🔌 Module Details

---

### 🔐 Auth Module

**Responsibilities:**
- Supabase Auth দিয়ে login/register
- JWT token validate করা
- `public.users` profile sync

**Endpoints:**
```
POST /auth/register   → নতুন user তৈরি
POST /auth/login      → token return করে
GET  /auth/me         → current user info
POST /auth/logout     → session invalidate
```

**Flow:**
```
POST /auth/login
  → AuthController.login(dto)
  → AuthService.login(dto)
    → supabase.auth.signInWithPassword()
    → return { access_token, user }
```

---

### 🕌 Prayer Module

**Responsibilities:**
- Location (lat/lng বা city) নিয়ে prayer times fetch করা
- Aladhan API call করা
- Cache check → miss হলে API call → DB-তে save
- Clean DTO return করা

**Endpoints:**
```
GET /prayer/times?city=Dhaka&country=BD
GET /prayer/times?lat=23.8103&lng=90.4125
GET /prayer/today?city=Dhaka
```

**Response DTO:**
```typescript
export class PrayerTimesResponseDto {
  date: string;        // "2026-03-01"
  city: string;
  timings: {
    Fajr:    string;   // "04:32 (BST)"
    Sunrise: string;
    Dhuhr:   string;
    Asr:     string;
    Maghrib: string;   // = Iftar time
    Isha:    string;
  };
  sehriTime:  string;  // = Fajr
  iftarTime:  string;  // = Maghrib
  nextPrayer: {
    name: string;
    time: string;
    remainingSeconds: number;
  };
}
```

**Caching Strategy:**
```
1. Check locations_cache for (city, date)
2. Cache hit → return cached data
3. Cache miss → call Aladhan API
4. Save to cache
5. Return data
```

**External API:** `https://api.aladhan.com/v1/timingsByCity?city={city}&country={country}&method=1`

---

### 📅 Fasting Module

**Responsibilities:**
- User-এর daily fasting log manage করা
- Ramadan-এর ৩০ দিনের history দেখানো

**Endpoints:**
```
POST /fasting/log          → রোজা log করো
PATCH /fasting/log/:date   → update status
GET  /fasting/history      → সব logs (Ramadan month)
GET  /fasting/today        → আজকের status
GET  /fasting/stats        → কতটা রেখেছি summary
```

**Log Fast DTO:**
```typescript
export class LogFastDto {
  @IsDateString()
  date: string;          // "2026-03-15"

  @IsBoolean()
  status: boolean;       // true = রোজা রেখেছি

  @IsOptional()
  @IsString()
  note?: string;
}
```

**Stats Response:**
```typescript
export class FastingStatsDto {
  totalDays:   number;   // 30
  keptDays:    number;   // 28
  missedDays:  number;   // 2
  pendingDays: number;   // 0 (আসেনি এমন দিন)
  percentage:  number;   // 93.3
}
```

---

### 📿 Daily Content Module (`dailyContent`)

**Responsibilities:**
- আজকের Quran Ayah return করা
- Cron job দিয়ে প্রতিরাতে নতুন verse fetch এবং Supabase-এ save

**External API:** [alquran-api.pages.dev](https://alquran-api.pages.dev/) — free, open-source, no API key, supports `bn` and `en`
```
GET all surahs:    https://alquran-api.pages.dev/api/quran?lang=bn
GET specific verse: https://alquran-api.pages.dev/api/quran/surah/{surahId}/verse/{verseId}?lang=bn
```

**Endpoints:**
```
GET /daily-content           → আজকের ayah (public — no auth needed)
GET /daily-content/history?days=7 → গত ৭ দিনের content
```

**Response DTO:**
```typescript
export class DailyContentResponseDto {
  id:           string;
  date:         string;    // "2026-03-15"
  surahNumber:  number;    // 2
  ayahNumber:   number;    // 185
  arabic:       string;    // "شَهْرُ رَمَضَانَ..."
  translation:  string;    // "রমযান মাস..."
  sourceApi:    string;    // "alquran-api.pages.dev"
  lang:         string;    // "bn"
}
```

**Cron Job (Phase 3 detail):**
```typescript
// প্রতিদিন রাত ৩টায় (UTC) run হবে
@Cron('0 3 * * *')
async fetchAndStoreDailyContent(): Promise<void> {
  const today = new Date().toISOString().split('T')[0];

  // Already stored today? Skip.
  const exists = await this.dailyContentRepository.findByDate(today);
  if (exists) return;

  // Random surah (1–114) + verse
  const surahId = Math.floor(Math.random() * 114) + 1;
  const surahMeta = await axios.get(
    `https://alquran-api.pages.dev/api/quran?lang=bn`
  );
  const surah = surahMeta.data.find((s: any) => s.id === surahId);
  const verseId = Math.floor(Math.random() * surah.totalVerses) + 1;

  const verse = await axios.get(
    `https://alquran-api.pages.dev/api/quran/surah/${surahId}/verse/${verseId}?lang=bn`
  );

  await this.dailyContentRepository.save({
    date:        today,
    surahNumber: surahId,
    ayahNumber:  verseId,
    arabic:      verse.data.arabic,
    translation: verse.data.translation,
    sourceApi:   'alquran-api.pages.dev',
    lang:        'bn',
  });
}
```

---

### 🧮 Zakat Module

**Responsibilities:**
- Zakat calculation করা (Strategy Pattern)
- Result save করা
- History দেখানো

**Endpoints:**
```
POST /zakat/calculate      → calculate + save
GET  /zakat/history        → past calculations
GET  /zakat/nisab          → current nisab threshold
```

**Calculate DTO:**
```typescript
export class CalculateZakatDto {
  @IsNumber()
  @Min(0)
  goldValue: number;

  @IsNumber()
  @Min(0)
  silverValue: number;

  @IsNumber()
  @Min(0)
  cashSavings: number;

  @IsNumber()
  @Min(0)
  businessAssets: number;

  @IsNumber()
  @Min(0)
  debts: number;
}
```

**Result DTO:**
```typescript
export class ZakatResultDto {
  totalZakatable:  number;
  nisabThreshold:  number;
  isLiable:        boolean;
  zakatAmount:     number;    // 0 if not liable
  breakdown: {
    gold:     number;
    silver:   number;
    cash:     number;
    business: number;
    debtDeduction: number;
  };
}
```

**Strategy Pattern (কেন?):**
- Nisab calculation পদ্ধতি vary করে (gold-based vs silver-based)
- Strategy inject করলে easily swap করা যায়

```typescript
interface ZakatCalculationStrategy {
  getNisabThreshold(): Promise<number>;
  calculate(dto: CalculateZakatDto): ZakatResultDto;
}
```

---

## 🔄 Request/Response Flow

```
HTTP Request
    ↓
[JWT Guard] → token validate
    ↓
Controller → DTO validate (class-validator)
    ↓
Service → business logic
    ↓
Repository → Supabase query
    ↓
Response Transform Interceptor → standard format
    ↓
HTTP Response: { success: true, data: {...}, timestamp: "..." }
```

---

## 📦 Standard Response Format

```typescript
// সব API এই format-এ return করবে
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-03-01T10:30:00Z"
}

// Error হলে
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  },
  "timestamp": "2026-03-01T10:30:00Z"
}
```

---

## 🌍 Environment Variables

```env
# .env
PORT=3001
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
SUPABASE_JWT_SECRET=your_jwt_secret

# External APIs (no key needed)
ALADHAN_API_BASE=https://api.aladhan.com/v1
ALQURAN_API_BASE=https://alquran-api.pages.dev/api/quran
```

---

## 📦 Key Dependencies

```json
{
  "@nestjs/common": "^10",
  "@nestjs/core": "^10",
  "@nestjs/jwt": "^10",
  "@nestjs/schedule": "^4",
  "@supabase/supabase-js": "^2",
  "class-validator": "^0.14",
  "class-transformer": "^0.5",
  "axios": "^1"
}
```

---

## 🚀 Start Command

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

---

*পরের phase: Frontend → `04_FRONTEND_ARCHITECTURE.md`*

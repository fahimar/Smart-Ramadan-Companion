# 🧠 Engineering Rules & Coding Standards

> এই document-এর rules সব সময় follow করতে হবে।  
> AI (Copilot/Cursor) দিয়ে code generate করার সময় এই rules system prompt হিসেবে দাও।

---

## 🏛️ Architecture Principles

### The One Rule
```
Controller → Service → Repository
```
- **Controller:** HTTP এ কথা বলে। Validate করে। Delegate করে। ব্যস।
- **Service:** Business logic। Calculation। Decision।
- **Repository:** Database access। Query। CRUD।

```typescript
// ✅ CORRECT
@Post('log')
async logFast(@Body() dto: LogFastDto, @CurrentUser() user: User) {
  return this.fastingService.logFast(user.id, dto);
}

// ❌ WRONG — business logic in controller
@Post('log')
async logFast(@Body() dto: LogFastDto) {
  const existing = await this.supabase.from('fasting_logs')...
  if (existing) throw new ConflictException(...);
  // আর নয়!
}
```

---

## 📐 SOLID Principles

### S — Single Responsibility Principle
> প্রতিটা class/function একটাই কাজ করবে।

```typescript
// ✅ CORRECT — প্রতিটা class এর একটাই reason to change
class ZakatCalculationService {
  calculate(dto: CalculateZakatDto): ZakatResultDto { ... }
}

class ZakatRepository {
  save(record: ZakatRecord): Promise<ZakatRecord> { ... }
}

// ❌ WRONG — একটা class-এ সব
class ZakatService {
  async calculateAndSaveAndSendEmail(dto) { ... }
}
```

---

### O — Open/Closed Principle
> Extension-এর জন্য open, modification-এর জন্য closed।  
> নতুন Zakat method যোগ করতে হলে existing code ছুঁতে হবে না।

```typescript
// ✅ Strategy Pattern
interface ZakatCalculationStrategy {
  getNisabThreshold(): number;
}

class GoldBasedNisabStrategy implements ZakatCalculationStrategy {
  getNisabThreshold() { return GOLD_PRICE * 85; }
}

class SilverBasedNisabStrategy implements ZakatCalculationStrategy {
  getNisabThreshold() { return SILVER_PRICE * 595; }
}
```

---

### L — Liskov Substitution Principle
> Subclass parent-এর জায়গায় কাজ করতে পারবে।  
> Interface তৈরি করো, concrete class-এ depend করো না।

---

### I — Interface Segregation
> বড় interface না। ছোট ছোট specific interface।

```typescript
// ✅ CORRECT
interface Readable { findById(id: string): Promise<T>; }
interface Writable { save(entity: T): Promise<T>; }

// ❌ WRONG
interface GodRepository {
  findById, findAll, save, update, delete, search, export...
}
```

---

### D — Dependency Inversion
> High-level module → abstract interface।  
> Concrete implementation inject হবে।

```typescript
// ✅ CORRECT — NestJS DI
@Injectable()
class ZakatService {
  constructor(
    private readonly zakatRepo: ZakatRepository,  // injected
    private readonly strategy: ZakatCalculationStrategy  // injected
  ) {}
}
```

---

## 🔁 DRY — Don't Repeat Yourself

```typescript
// ✅ CORRECT — reusable utility
function formatPrayerTime(time: string): string {
  return time.split(' ')[0]; // "04:32 (BST)" → "04:32"
}

// ❌ WRONG — same logic copy-pasted in 5 places
const fajr = prayerData.Fajr.split(' ')[0];
const dhuhr = prayerData.Dhuhr.split(' ')[0];
// ...
```

---

## 💡 KISS — Keep It Simple, Stupid

```typescript
// ✅ CORRECT
function isZakatLiable(totalZakatable: number, nisab: number): boolean {
  return totalZakatable >= nisab;
}

// ❌ WRONG — over-engineered
function isZakatLiable(assets: AssetPortfolio, config: ZakatConfig): ZakatLiabilityResult {
  const engine = new ZakatLiabilityEngine(config);
  return engine.evaluate(assets).withThreshold(config.getNisab());
}
```

---

## 🚫 YAGNI — You Aren't Gonna Need It

> এখন দরকার নেই? বানাবে না।

- ❌ "পরে কাজে লাগতে পারে" বলে code লিখবে না
- ❌ Generic framework বানাবে না যখন specific solution দরকার
- ✅ Feature request আসলে তখন implement করো

---

## 📝 TypeScript Rules

```typescript
// ✅ সব জায়গায় type থাকবে
async function getPrayerTimes(city: string): Promise<PrayerTimesResponseDto> { ... }

// ❌ any নেই
async function getPrayerTimes(city: any): Promise<any> { ... }

// ✅ Interface/DTO explicitly define করো
interface PrayerTimings {
  Fajr:    string;
  Dhuhr:   string;
  Asr:     string;
  Maghrib: string;
  Isha:    string;
}

// ❌ Magic strings নেই
if (type === 'ayah') ...   // ❌

// ✅ Enum বা const ব্যবহার করো
enum ContentType {
  AYAH   = 'ayah',
  HADITH = 'hadith',
}
if (type === ContentType.AYAH) ...  // ✅
```

---

## 🧩 Function Rules

```typescript
// ✅ Function < 40 lines
// ✅ একটা function একটাই কাজ
// ✅ Descriptive name (verb + noun)
//    calculateZakat, fetchPrayerTimes, logFastingDay

// ❌ দীর্ঘ function
async function doEverything() {
  // 100 lines of mixed logic
}

// ✅ Decompose করো
async function processZakatRequest(dto: CalculateZakatDto) {
  const total    = this.calculateTotal(dto);
  const nisab    = await this.getNisab();
  const liable   = this.isLiable(total, nisab);
  const amount   = this.calculateAmount(total, liable);
  return this.buildResult({ total, nisab, liable, amount });
}
```

---

## 🏷️ Naming Conventions

| কী | Convention | Example |
|----|-----------|---------|
| Class | PascalCase | `ZakatService` |
| Interface | PascalCase | `ZakatCalculationStrategy` |
| Function/Method | camelCase | `calculateZakat()` |
| Variable | camelCase | `totalZakatable` |
| Constant | SCREAMING_SNAKE | `ZAKAT_RATE = 0.025` |
| File (NestJS) | kebab-case | `zakat.service.ts` |
| File (Next.js) | PascalCase | `ZakatForm.tsx` |
| API route | kebab-case | `/prayer/times` |

---

## 🗂️ File Organization Rule

> **One Responsibility Per File**

```
✅
zakat.service.ts       ← ZakatService class only
zakat.repository.ts    ← ZakatRepository class only
zakat.controller.ts    ← ZakatController class only

❌
zakat.ts               ← everything thrown together
```

---

## 🔐 Error Handling

```typescript
// ✅ Typed errors, never swallow
try {
  const data = await this.prayerRepository.findByCity(city, date);
  if (!data) throw new NotFoundException(`Prayer times not found for ${city}`);
  return data;
} catch (error) {
  if (error instanceof NotFoundException) throw error;
  this.logger.error('Prayer fetch failed', error);
  throw new InternalServerErrorException('Failed to fetch prayer times');
}

// ❌ Silent failure
try {
  return await this.repo.find();
} catch (e) {
  return null; // নীরবে ব্যর্থ — কখনো না
}
```

---

## 🧪 Testing Mindset

> MVP-তে unit test সব না লিখলেও চলবে, কিন্তু:

```typescript
// ✅ Critical business logic test করো
describe('ZakatCalculationService', () => {
  it('should return not liable when below nisab', () => {
    const result = service.calculate({
      cashSavings: 100_000,
      nisabThreshold: 500_000,
      // ...
    });
    expect(result.isLiable).toBe(false);
    expect(result.zakatAmount).toBe(0);
  });
});
```

---

## 🔄 Git Workflow

```bash
# Branch naming
feature/prayer-times-api
feature/fasting-tracker
bugfix/countdown-timezone
chore/setup-supabase

# Commit message format
feat: add prayer times caching
fix: correct Iftar time calculation for Bangladesh
chore: add RLS policies to fasting_logs
docs: update API contract for zakat module
```

---

## 🚀 AI / Copilot Prompt Template

> যখন Copilot/Claude দিয়ে code বানাবে, এটা paste করো:

```
Act as a senior NestJS/Next.js engineer.

Architecture: Controller → Service → Repository (strict)
Language: TypeScript (strict mode, no any)
Patterns: Repository, Strategy, Dependency Injection
Principles: SOLID, DRY, KISS, YAGNI

Rules:
- Controllers are thin (validate + delegate only)
- Business logic only in Services
- DB access only in Repositories
- Functions < 40 lines
- One responsibility per file
- No magic strings (use enums/constants)
- Always return typed DTOs
- Handle errors explicitly
- Prefer composition over inheritance

For this project (Smart Ramadan Companion):
- Backend: NestJS + Supabase
- Frontend: Next.js 14 App Router + Tailwind + shadcn/ui
- No business logic in React components
- All data via NestJS API

Now implement: [feature description]
```

---

## 📋 Code Review Checklist

Before every PR/commit:

- [ ] Controller-এ business logic নেই?
- [ ] সব function < 40 lines?
- [ ] `any` type ব্যবহার করিনি?
- [ ] Error properly handled?
- [ ] Magic strings নেই?
- [ ] New feature YAGNI principle follow করে?
- [ ] DTO validation আছে?
- [ ] Response type declared?

---

*Rules মনে না থাকলে এই file খোলো।*  
*Copilot prompt হিসেবেও use করো।*

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrayerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
const prayer_repository_1 = require("./prayer.repository");
const PRAYER_ORDER = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
let PrayerService = class PrayerService {
    constructor(prayerRepository, config) {
        this.prayerRepository = prayerRepository;
        this.config = config;
        this.aladhanBase = this.config.get('ALADHAN_API_BASE', 'https://api.aladhan.com/v1');
    }
    async getPrayerTimes(dto) {
        if (!dto.city && (!dto.lat || !dto.lng)) {
            throw new common_1.BadRequestException('Provide either city or lat/lng coordinates');
        }
        const city = dto.city ?? 'Dhaka';
        const country = dto.country ?? 'BD';
        const today = new Date().toISOString().split('T')[0];
        const cached = await this.prayerRepository.findCache(city, country, today);
        if (cached)
            return this.buildResponse(cached, city, country, today);
        const url = dto.lat && dto.lng
            ? `${this.aladhanBase}/timings?latitude=${dto.lat}&longitude=${dto.lng}&method=1`
            : `${this.aladhanBase}/timingsByCity?city=${city}&country=${country}&method=1`;
        const { data } = await axios_1.default.get(url);
        const timings = data.data.timings;
        const cleaned = {
            Fajr: this.stripTimezone(timings.Fajr),
            Sunrise: this.stripTimezone(timings.Sunrise),
            Dhuhr: this.stripTimezone(timings.Dhuhr),
            Asr: this.stripTimezone(timings.Asr),
            Maghrib: this.stripTimezone(timings.Maghrib),
            Isha: this.stripTimezone(timings.Isha),
        };
        await this.prayerRepository.saveCache({ city, country, date: today, prayerTimes: cleaned });
        return this.buildResponse(cleaned, city, country, today);
    }
    buildResponse(timings, city, country, date) {
        return {
            date,
            city,
            country,
            timings: timings,
            sehriTime: timings.Fajr,
            iftarTime: timings.Maghrib,
            nextPrayer: this.findNextPrayer(timings),
        };
    }
    findNextPrayer(timings) {
        const now = new Date();
        for (const name of PRAYER_ORDER) {
            const [h, m] = timings[name].split(':').map(Number);
            const prayerTime = new Date();
            prayerTime.setHours(h, m, 0, 0);
            if (prayerTime > now) {
                const remainingSeconds = Math.floor((prayerTime.getTime() - now.getTime()) / 1000);
                return { name: name, time: timings[name], remainingSeconds };
            }
        }
        const [h, m] = timings.Fajr.split(':').map(Number);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(h, m, 0, 0);
        const remainingSeconds = Math.floor((tomorrow.getTime() - now.getTime()) / 1000);
        return { name: 'Fajr', time: timings.Fajr, remainingSeconds };
    }
    stripTimezone(time) {
        return time.split(' ')[0];
    }
};
exports.PrayerService = PrayerService;
exports.PrayerService = PrayerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prayer_repository_1.PrayerRepository,
        config_1.ConfigService])
], PrayerService);
//# sourceMappingURL=prayer.service.js.map
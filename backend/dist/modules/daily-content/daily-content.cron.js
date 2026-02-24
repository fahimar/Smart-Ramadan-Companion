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
var DailyContentCron_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyContentCron = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const daily_content_service_1 = require("./daily-content.service");
const daily_content_repository_1 = require("./daily-content.repository");
const prayer_repository_1 = require("../prayer/prayer.repository");
let DailyContentCron = DailyContentCron_1 = class DailyContentCron {
    constructor(dailyContentService, dailyContentRepository, prayerRepository) {
        this.dailyContentService = dailyContentService;
        this.dailyContentRepository = dailyContentRepository;
        this.prayerRepository = prayerRepository;
        this.logger = new common_1.Logger(DailyContentCron_1.name);
    }
    async fetchDailyContent() {
        const today = new Date().toISOString().split('T')[0];
        this.logger.log(`[Cron] Fetching daily content for ${today}`);
        const exists = await this.dailyContentRepository.findByDate(today);
        if (exists) {
            this.logger.log(`[Cron] Daily content already stored for ${today} — skipping`);
            return;
        }
        try {
            const content = await this.dailyContentService.fetchAndStore(today);
            this.logger.log(`[Cron] Stored Surah ${content.surahNumber}:${content.ayahNumber} for ${today}`);
        }
        catch (err) {
            this.logger.error(`[Cron] Failed to fetch daily content`, err.message);
        }
    }
    async cleanupLocationCache() {
        this.logger.log('[Cron] Running location cache cleanup');
        try {
            await this.prayerRepository.deleteOldCache(3);
            this.logger.log('[Cron] Location cache cleanup complete');
        }
        catch (err) {
            this.logger.error('[Cron] Cache cleanup failed', err.message);
        }
    }
};
exports.DailyContentCron = DailyContentCron;
__decorate([
    (0, schedule_1.Cron)('0 3 * * *', { name: 'daily-content-fetch' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DailyContentCron.prototype, "fetchDailyContent", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'cache-cleanup' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DailyContentCron.prototype, "cleanupLocationCache", null);
exports.DailyContentCron = DailyContentCron = DailyContentCron_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [daily_content_service_1.DailyContentService,
        daily_content_repository_1.DailyContentRepository,
        prayer_repository_1.PrayerRepository])
], DailyContentCron);
//# sourceMappingURL=daily-content.cron.js.map
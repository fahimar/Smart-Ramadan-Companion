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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastingService = void 0;
const common_1 = require("@nestjs/common");
const fasting_repository_1 = require("./fasting.repository");
const RAMADAN_DAYS = 30;
let FastingService = class FastingService {
    constructor(fastingRepository) {
        this.fastingRepository = fastingRepository;
    }
    async logFast(userId, dto) {
        const existing = await this.fastingRepository.findByUserAndDate(userId, dto.date);
        if (existing)
            throw new common_1.ConflictException(`Fast already logged for ${dto.date}`);
        return this.fastingRepository.create(userId, dto);
    }
    async updateFast(userId, date, dto) {
        const existing = await this.fastingRepository.findByUserAndDate(userId, date);
        if (!existing)
            throw new common_1.NotFoundException(`No fasting log found for ${date}`);
        return this.fastingRepository.update(existing.id, dto);
    }
    async getHistory(userId) {
        return this.fastingRepository.findAllByUser(userId);
    }
    async getToday(userId) {
        const today = new Date().toISOString().split('T')[0];
        return this.fastingRepository.findByUserAndDate(userId, today);
    }
    async getStats(userId) {
        const logs = await this.fastingRepository.findAllByUser(userId);
        const keptDays = logs.filter((l) => l.status).length;
        const missedDays = logs.filter((l) => !l.status).length;
        const pendingDays = RAMADAN_DAYS - logs.length;
        return {
            totalDays: RAMADAN_DAYS,
            keptDays,
            missedDays,
            pendingDays,
            percentage: Math.round((keptDays / RAMADAN_DAYS) * 100 * 10) / 10,
        };
    }
};
exports.FastingService = FastingService;
exports.FastingService = FastingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [fasting_repository_1.FastingRepository])
], FastingService);
//# sourceMappingURL=fasting.service.js.map
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
exports.ZakatService = void 0;
const common_1 = require("@nestjs/common");
const gold_based_nisab_strategy_1 = require("./strategies/gold-based-nisab.strategy");
const zakat_repository_1 = require("./zakat.repository");
const ZAKAT_RATE = 0.025;
let ZakatService = class ZakatService {
    constructor(zakatRepository, nisabStrategy) {
        this.zakatRepository = zakatRepository;
        this.nisabStrategy = nisabStrategy;
    }
    async calculate(userId, dto) {
        const nisabThreshold = this.nisabStrategy.getNisabThreshold();
        const result = this.computeZakat(dto, nisabThreshold);
        const saved = await this.zakatRepository.save(userId, { ...dto, ...result, nisabThreshold });
        return { ...result, id: saved.id, createdAt: saved.createdAt, nisabThreshold };
    }
    async getHistory(userId) {
        return this.zakatRepository.findAllByUser(userId);
    }
    getNisab() {
        return {
            nisabThreshold: this.nisabStrategy.getNisabThreshold(),
            method: 'Gold-based (85g)',
        };
    }
    computeZakat(dto, nisabThreshold) {
        const totalZakatable = dto.goldValue + dto.silverValue + dto.cashSavings + dto.businessAssets - dto.debts;
        const isLiable = totalZakatable >= nisabThreshold;
        const zakatAmount = isLiable ? Math.round(totalZakatable * ZAKAT_RATE * 100) / 100 : 0;
        return {
            totalZakatable,
            isLiable,
            zakatAmount,
            breakdown: {
                gold: dto.goldValue,
                silver: dto.silverValue,
                cash: dto.cashSavings,
                business: dto.businessAssets,
                debtDeduction: dto.debts,
            },
        };
    }
};
exports.ZakatService = ZakatService;
exports.ZakatService = ZakatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [zakat_repository_1.ZakatRepository,
        gold_based_nisab_strategy_1.GoldBasedNisabStrategy])
], ZakatService);
//# sourceMappingURL=zakat.service.js.map
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
exports.ZakatRepository = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../../common/supabase/supabase.service");
let ZakatRepository = class ZakatRepository {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async save(userId, params) {
        const { data, error } = await this.supabase
            .getClient()
            .from('zakat_records')
            .insert({
            user_id: userId,
            gold_value: params.goldValue,
            silver_value: params.silverValue,
            cash_savings: params.cashSavings,
            business_assets: params.businessAssets,
            debts: params.debts,
            total_zakatable: params.totalZakatable,
            zakat_amount: params.zakatAmount,
            nisab_threshold: params.nisabThreshold,
            is_liable: params.isLiable,
        })
            .select('id, created_at')
            .single();
        if (error)
            throw new Error(error.message);
        return { id: data.id, createdAt: data.created_at };
    }
    async findAllByUser(userId) {
        const { data } = await this.supabase
            .getClient()
            .from('zakat_records')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        return (data ?? []).map(this.mapRow);
    }
    mapRow(row) {
        return {
            id: row.id,
            totalZakatable: row.total_zakatable,
            nisabThreshold: row.nisab_threshold,
            isLiable: row.is_liable,
            zakatAmount: row.zakat_amount,
            breakdown: {
                gold: row.gold_value,
                silver: row.silver_value,
                cash: row.cash_savings,
                business: row.business_assets,
                debtDeduction: row.debts,
            },
            createdAt: row.created_at,
        };
    }
};
exports.ZakatRepository = ZakatRepository;
exports.ZakatRepository = ZakatRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], ZakatRepository);
//# sourceMappingURL=zakat.repository.js.map
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
exports.DailyContentRepository = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../../common/supabase/supabase.service");
let DailyContentRepository = class DailyContentRepository {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async findByDate(date) {
        const { data } = await this.supabase
            .getClient()
            .from('daily_content')
            .select('*')
            .eq('date', date)
            .maybeSingle();
        return data ? this.mapRow(data) : null;
    }
    async findRecent(days) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        const { data } = await this.supabase
            .getClient()
            .from('daily_content')
            .select('*')
            .gte('date', since.toISOString().split('T')[0])
            .order('date', { ascending: false });
        return (data ?? []).map(this.mapRow);
    }
    async save(params) {
        const { data, error } = await this.supabase
            .getClient()
            .from('daily_content')
            .upsert({
            date: params.date,
            surah_number: params.surahNumber,
            ayah_number: params.ayahNumber,
            arabic: params.arabic,
            translation: params.translation,
            source_api: params.sourceApi,
            lang: params.lang,
        })
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return this.mapRow(data);
    }
    mapRow(row) {
        return {
            id: row.id,
            date: row.date,
            surahNumber: row.surah_number,
            ayahNumber: row.ayah_number,
            arabic: row.arabic,
            translation: row.translation,
            sourceApi: row.source_api,
            lang: row.lang,
        };
    }
};
exports.DailyContentRepository = DailyContentRepository;
exports.DailyContentRepository = DailyContentRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], DailyContentRepository);
//# sourceMappingURL=daily-content.repository.js.map
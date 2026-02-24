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
exports.PrayerRepository = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../../common/supabase/supabase.service");
let PrayerRepository = class PrayerRepository {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async findCache(city, country, date) {
        const { data } = await this.supabase
            .getClient()
            .from('locations_cache')
            .select('prayer_times')
            .eq('city', city)
            .eq('country', country)
            .eq('date', date)
            .maybeSingle();
        return data?.prayer_times ?? null;
    }
    async saveCache(params) {
        await this.supabase
            .getClient()
            .from('locations_cache')
            .upsert({
            city: params.city,
            country: params.country,
            date: params.date,
            prayer_times: params.prayerTimes,
        });
    }
    async deleteOldCache(daysOld) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - daysOld);
        await this.supabase
            .getClient()
            .from('locations_cache')
            .delete()
            .lt('date', cutoff.toISOString().split('T')[0]);
    }
};
exports.PrayerRepository = PrayerRepository;
exports.PrayerRepository = PrayerRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], PrayerRepository);
//# sourceMappingURL=prayer.repository.js.map
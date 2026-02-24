"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const supabase_module_1 = require("./common/supabase/supabase.module");
const auth_module_1 = require("./modules/auth/auth.module");
const prayer_module_1 = require("./modules/prayer/prayer.module");
const fasting_module_1 = require("./modules/fasting/fasting.module");
const daily_content_module_1 = require("./modules/daily-content/daily-content.module");
const zakat_module_1 = require("./modules/zakat/zakat.module");
const health_controller_1 = require("./health.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            schedule_1.ScheduleModule.forRoot(),
            supabase_module_1.SupabaseModule,
            auth_module_1.AuthModule,
            prayer_module_1.PrayerModule,
            fasting_module_1.FastingModule,
            daily_content_module_1.DailyContentModule,
            zakat_module_1.ZakatModule,
        ],
        controllers: [health_controller_1.HealthController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
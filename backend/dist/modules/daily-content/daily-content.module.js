"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyContentModule = void 0;
const common_1 = require("@nestjs/common");
const daily_content_controller_1 = require("./daily-content.controller");
const daily_content_service_1 = require("./daily-content.service");
const daily_content_repository_1 = require("./daily-content.repository");
const daily_content_cron_1 = require("./daily-content.cron");
const prayer_module_1 = require("../prayer/prayer.module");
let DailyContentModule = class DailyContentModule {
};
exports.DailyContentModule = DailyContentModule;
exports.DailyContentModule = DailyContentModule = __decorate([
    (0, common_1.Module)({
        imports: [prayer_module_1.PrayerModule],
        controllers: [daily_content_controller_1.DailyContentController],
        providers: [daily_content_service_1.DailyContentService, daily_content_repository_1.DailyContentRepository, daily_content_cron_1.DailyContentCron],
    })
], DailyContentModule);
//# sourceMappingURL=daily-content.module.js.map
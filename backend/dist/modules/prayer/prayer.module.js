"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrayerModule = void 0;
const common_1 = require("@nestjs/common");
const prayer_controller_1 = require("./prayer.controller");
const prayer_service_1 = require("./prayer.service");
const prayer_repository_1 = require("./prayer.repository");
let PrayerModule = class PrayerModule {
};
exports.PrayerModule = PrayerModule;
exports.PrayerModule = PrayerModule = __decorate([
    (0, common_1.Module)({
        controllers: [prayer_controller_1.PrayerController],
        providers: [prayer_service_1.PrayerService, prayer_repository_1.PrayerRepository],
        exports: [prayer_repository_1.PrayerRepository],
    })
], PrayerModule);
//# sourceMappingURL=prayer.module.js.map
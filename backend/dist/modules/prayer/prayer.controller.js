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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrayerController = void 0;
const common_1 = require("@nestjs/common");
const prayer_service_1 = require("./prayer.service");
const get_prayer_times_dto_1 = require("./dto/get-prayer-times.dto");
let PrayerController = class PrayerController {
    constructor(prayerService) {
        this.prayerService = prayerService;
    }
    getPrayerTimes(query) {
        return this.prayerService.getPrayerTimes(query);
    }
};
exports.PrayerController = PrayerController;
__decorate([
    (0, common_1.Get)('times'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_prayer_times_dto_1.GetPrayerTimesDto]),
    __metadata("design:returntype", void 0)
], PrayerController.prototype, "getPrayerTimes", null);
exports.PrayerController = PrayerController = __decorate([
    (0, common_1.Controller)('prayer'),
    __metadata("design:paramtypes", [prayer_service_1.PrayerService])
], PrayerController);
//# sourceMappingURL=prayer.controller.js.map
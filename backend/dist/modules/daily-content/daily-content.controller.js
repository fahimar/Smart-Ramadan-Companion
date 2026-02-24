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
exports.DailyContentController = void 0;
const common_1 = require("@nestjs/common");
const daily_content_service_1 = require("./daily-content.service");
let DailyContentController = class DailyContentController {
    constructor(dailyContentService) {
        this.dailyContentService = dailyContentService;
    }
    getToday() {
        return this.dailyContentService.getTodayContent();
    }
    getHistory(days = '7') {
        return this.dailyContentService.getHistory(Number(days));
    }
};
exports.DailyContentController = DailyContentController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DailyContentController.prototype, "getToday", null);
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DailyContentController.prototype, "getHistory", null);
exports.DailyContentController = DailyContentController = __decorate([
    (0, common_1.Controller)('daily-content'),
    __metadata("design:paramtypes", [daily_content_service_1.DailyContentService])
], DailyContentController);
//# sourceMappingURL=daily-content.controller.js.map
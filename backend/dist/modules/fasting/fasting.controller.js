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
exports.FastingController = void 0;
const common_1 = require("@nestjs/common");
const fasting_service_1 = require("./fasting.service");
const log_fast_dto_1 = require("./dto/log-fast.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let FastingController = class FastingController {
    constructor(fastingService) {
        this.fastingService = fastingService;
    }
    logFast(dto, user) {
        return this.fastingService.logFast(user.id, dto);
    }
    updateFast(date, dto, user) {
        return this.fastingService.updateFast(user.id, date, dto);
    }
    getHistory(user) {
        return this.fastingService.getHistory(user.id);
    }
    getToday(user) {
        return this.fastingService.getToday(user.id);
    }
    getStats(user) {
        return this.fastingService.getStats(user.id);
    }
};
exports.FastingController = FastingController;
__decorate([
    (0, common_1.Post)('log'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [log_fast_dto_1.LogFastDto, Object]),
    __metadata("design:returntype", void 0)
], FastingController.prototype, "logFast", null);
__decorate([
    (0, common_1.Patch)('log/:date'),
    __param(0, (0, common_1.Param)('date')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], FastingController.prototype, "updateFast", null);
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FastingController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('today'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FastingController.prototype, "getToday", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FastingController.prototype, "getStats", null);
exports.FastingController = FastingController = __decorate([
    (0, common_1.Controller)('fasting'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [fasting_service_1.FastingService])
], FastingController);
//# sourceMappingURL=fasting.controller.js.map
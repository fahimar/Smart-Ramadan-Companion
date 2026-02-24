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
exports.AuthRepository = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../../common/supabase/supabase.service");
let AuthRepository = class AuthRepository {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async findByEmail(email) {
        const { data } = await this.supabase
            .getClient()
            .from('users')
            .select('id, email')
            .eq('email', email)
            .maybeSingle();
        return data ?? null;
    }
    async findById(id) {
        const { data } = await this.supabase
            .getClient()
            .from('users')
            .select('id, email')
            .eq('id', id)
            .maybeSingle();
        return data ?? null;
    }
    async createUser(dto) {
        const { data, error } = await this.supabase
            .getClient()
            .auth.signUp({
            email: dto.email,
            password: dto.password,
            options: { data: { full_name: dto.fullName } },
        });
        if (error || !data.session)
            throw new Error(error?.message ?? 'Registration failed');
        return {
            accessToken: data.session.access_token,
            user: { id: data.user.id, email: data.user.email },
        };
    }
    async signIn(dto) {
        const { data, error } = await this.supabase
            .getClient()
            .auth.signInWithPassword({ email: dto.email, password: dto.password });
        if (error || !data.session)
            return null;
        return {
            accessToken: data.session.access_token,
            user: { id: data.user.id, email: data.user.email },
        };
    }
};
exports.AuthRepository = AuthRepository;
exports.AuthRepository = AuthRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], AuthRepository);
//# sourceMappingURL=auth.repository.js.map
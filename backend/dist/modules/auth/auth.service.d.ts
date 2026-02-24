import { AuthRepository } from './auth.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export interface AuthUser {
    id: string;
    email: string;
}
export interface AuthResult {
    accessToken: string;
    user: AuthUser;
}
export declare class AuthService {
    private readonly authRepository;
    constructor(authRepository: AuthRepository);
    register(dto: RegisterDto): Promise<AuthResult>;
    login(dto: LoginDto): Promise<AuthResult>;
    getProfile(userId: string): Promise<AuthUser>;
}

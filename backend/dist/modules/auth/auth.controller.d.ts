import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<import("./auth.service").AuthResult>;
    login(dto: LoginDto): Promise<import("./auth.service").AuthResult>;
    getProfile(user: {
        id: string;
    }): Promise<import("./auth.service").AuthUser>;
}

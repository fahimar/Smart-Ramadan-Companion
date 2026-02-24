import { SupabaseService } from '../../common/supabase/supabase.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResult, AuthUser } from './auth.service';
export declare class AuthRepository {
    private readonly supabase;
    constructor(supabase: SupabaseService);
    findByEmail(email: string): Promise<AuthUser | null>;
    findById(id: string): Promise<AuthUser | null>;
    createUser(dto: RegisterDto): Promise<AuthResult>;
    signIn(dto: LoginDto): Promise<AuthResult | null>;
}

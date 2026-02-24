import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../common/supabase/supabase.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResult, AuthUser } from './auth.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async findByEmail(email: string): Promise<AuthUser | null> {
    const { data } = await this.supabase
      .getClient()
      .from('users')
      .select('id, email')
      .eq('email', email)
      .maybeSingle();
    return data ?? null;
  }

  async findById(id: string): Promise<AuthUser | null> {
    const { data } = await this.supabase
      .getClient()
      .from('users')
      .select('id, email')
      .eq('id', id)
      .maybeSingle();
    return data ?? null;
  }

  async createUser(dto: RegisterDto): Promise<AuthResult> {
    const { data, error } = await this.supabase
      .getClient()
      .auth.signUp({
        email:    dto.email,
        password: dto.password,
        options:  { data: { full_name: dto.fullName } },
      });

    if (error || !data.session) throw new Error(error?.message ?? 'Registration failed');

    return {
      accessToken: data.session.access_token,
      user:        { id: data.user!.id, email: data.user!.email! },
    };
  }

  async signIn(dto: LoginDto): Promise<AuthResult | null> {
    const { data, error } = await this.supabase
      .getClient()
      .auth.signInWithPassword({ email: dto.email, password: dto.password });

    if (error || !data.session) return null;

    return {
      accessToken: data.session.access_token,
      user:        { id: data.user.id, email: data.user.email! },
    };
  }
}

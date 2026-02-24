import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export interface AuthUser {
  id:    string;
  email: string;
}

export interface AuthResult {
  accessToken: string;
  user:        AuthUser;
}

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const existing = await this.authRepository.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered');

    return this.authRepository.createUser(dto);
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const result = await this.authRepository.signIn(dto);
    if (!result) throw new UnauthorizedException('Invalid email or password');
    return result;
  }

  async getProfile(userId: string): Promise<AuthUser> {
    const user = await this.authRepository.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }
}

import type { AuthUser } from '../entities/auth-user.entity';
import type { RegisterUserParams } from '../types/register-user.params';

export interface IAuthRepository {
  register(params: RegisterUserParams): Promise<AuthUser>;
  login(email: string, password: string): Promise<AuthUser>;
}

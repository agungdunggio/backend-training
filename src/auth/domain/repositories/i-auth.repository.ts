import type { AuthUser } from '../entities/auth-user.entity';

export interface IAuthRepository {
  register(email: string, password: string): Promise<AuthUser>;
  login(email: string, password: string): Promise<AuthUser>;
}

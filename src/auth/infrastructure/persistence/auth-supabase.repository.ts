import { Injectable } from '@nestjs/common';
import { AuthUser } from '../../domain/entities/auth-user.entity';
import {
  AuthProviderError,
  InvalidCredentialsError,
  UserAlreadyExistsError,
} from '../../domain/errors/auth.errors';
import type { IAuthRepository } from '../../domain/repositories/i-auth.repository';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthSupabaseRepository implements IAuthRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async register(email: string, password: string): Promise<AuthUser> {
    const client = this.supabase.getClient();

    const { error: createError } = await client.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      const message = createError.message?.toLowerCase() ?? '';
      const code = createError.code?.toLowerCase() ?? '';
      if (
        message.includes('already') ||
        message.includes('registered') ||
        message.includes('exists') ||
        code.includes('exists')
      ) {
        throw new UserAlreadyExistsError();
      }
      throw new AuthProviderError(createError.message);
    }

    const { data: signInData, error: signInError } =
      await client.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError || !signInData.user) {
      throw new AuthProviderError(
        signInError?.message ?? 'Gagal membuka sesi setelah pendaftaran',
      );
    }

    return new AuthUser(signInData.user.id, signInData.user.email ?? email);
  }

  async login(email: string, password: string): Promise<AuthUser> {
    const client = this.supabase.getClient();

    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      throw new InvalidCredentialsError();
    }

    return new AuthUser(data.user.id, data.user.email ?? email);
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import type { SignOptions } from 'jsonwebtoken';
import { AUTH_REPOSITORY, TOKEN_ISSUER } from './auth.tokens';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { AuthController } from './infrastructure/http/auth.controller';
import { AuthSupabaseRepository } from './infrastructure/persistence/auth-supabase.repository';
import { JwtAuthGuard } from './infrastructure/security/jwt-auth.guard';
import { JwtTokenIssuer } from './infrastructure/security/jwt-token-issuer';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { SupabaseService } from './infrastructure/supabase/supabase.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: (config.get<string>('JWT_EXPIRES_IN') ??
            '1d') as NonNullable<SignOptions['expiresIn']>,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    SupabaseService,
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthSupabaseRepository,
    },
    {
      provide: TOKEN_ISSUER,
      useClass: JwtTokenIssuer,
    },
    RegisterUserUseCase,
    LoginUserUseCase,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [JwtModule, PassportModule, JwtAuthGuard],
})
export class AuthModule {}

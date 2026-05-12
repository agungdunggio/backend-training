import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { AuthJwtPayload } from '../../domain/services/i-token-issuer';

export type JwtValidatedUser = {
  userId: string;
  email: string;
  username: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: AuthJwtPayload): JwtValidatedUser {
    return {
      userId: payload.sub,
      email: payload.email,
      username: payload.username ?? '',
    };
  }
}

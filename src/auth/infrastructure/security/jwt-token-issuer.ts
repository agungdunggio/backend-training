import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type {
  AuthJwtPayload,
  ITokenIssuer,
} from '../../domain/services/i-token-issuer';

@Injectable()
export class JwtTokenIssuer implements ITokenIssuer {
  constructor(private readonly jwtService: JwtService) {}

  signAccessToken(
    payload: AuthJwtPayload & { username: string},
  ): string {
    return this.jwtService.sign({
      sub: payload.sub,
      email: payload.email,
      username: payload.username,
    });
  }
}

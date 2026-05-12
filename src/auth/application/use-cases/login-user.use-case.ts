import { Inject, Injectable } from '@nestjs/common';
import { AUTH_REPOSITORY, TOKEN_ISSUER } from '../../auth.tokens';
import type { IAuthRepository } from '../../domain/repositories/i-auth.repository';
import type { ITokenIssuer } from '../../domain/services/i-token-issuer';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
    @Inject(TOKEN_ISSUER)
    private readonly tokenIssuer: ITokenIssuer,
  ) {}

  async execute(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.authRepository.login(email, password);
    const accessToken = this.tokenIssuer.signAccessToken({
      sub: user.id,
      email: user.email,
      username: user.username,
    });
    return { accessToken };
  }
}

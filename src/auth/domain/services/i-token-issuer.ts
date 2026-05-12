export interface AuthJwtPayload {
  sub: string;
  email: string;
}

export interface ITokenIssuer {
  signAccessToken(payload: AuthJwtPayload): string;
}

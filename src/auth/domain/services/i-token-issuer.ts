export interface AuthJwtPayload {
  sub: string;
  email: string;
  /** Opsional untuk kompatibilitas token yang diterbitkan sebelum ada klaim username */
  username?: string;
}

export interface ITokenIssuer {
  signAccessToken(payload: AuthJwtPayload & { username: string }): string;
}

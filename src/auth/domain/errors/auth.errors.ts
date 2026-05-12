export class UserAlreadyExistsError extends Error {
  constructor() {
    super('Email sudah terdaftar');
    this.name = 'UserAlreadyExistsError';
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Email atau kata sandi tidak valid');
    this.name = 'InvalidCredentialsError';
  }
}

export class AuthProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthProviderError';
  }
}

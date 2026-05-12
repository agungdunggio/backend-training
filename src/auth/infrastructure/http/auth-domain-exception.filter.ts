import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  AuthProviderError,
  InvalidCredentialsError,
  UserAlreadyExistsError,
} from '../../domain/errors/auth.errors';

@Catch(UserAlreadyExistsError, InvalidCredentialsError, AuthProviderError)
export class AuthDomainExceptionFilter implements ExceptionFilter {
  catch(
    exception:
      | UserAlreadyExistsError
      | InvalidCredentialsError
      | AuthProviderError,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof UserAlreadyExistsError) {
      response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: exception.message,
      });
      return;
    }

    if (exception instanceof InvalidCredentialsError) {
      response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: exception.message,
      });
      return;
    }

    response.status(HttpStatus.BAD_GATEWAY).json({
      statusCode: HttpStatus.BAD_GATEWAY,
      message: 'Layanan autentikasi tidak tersedia',
    });
  }
}

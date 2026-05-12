import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8, {
    message: 'password must be longer than or equal to 8 characters',
  })
  password!: string;
}

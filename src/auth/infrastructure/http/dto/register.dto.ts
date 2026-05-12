import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

function normalizeDisplayName(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  return value.trim().toLowerCase();
}

export class RegisterDto {
  @Transform(({ value }: { value: unknown }) => normalizeDisplayName(value))
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  @MaxLength(50, {
    message: 'Username must be less than or equal to 50 characters',
  })
  @Matches(/^[a-z0-9_-]+$/, {
    message:
      'Username may only contain lowercase letters, numbers, underscores and hyphens',
  })
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8, {
    message: 'password must be longer than or equal to 8 characters',
  })
  password!: string;
}

// src/email/dto/send-email.dto.ts
import { IsString, IsNotEmpty, IsEmail, IsIP } from 'class-validator';
import Platform from '../enum/platform';


export class UserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  id: string;

  @IsString()
  @IsIP()
  ip?: string;

  @IsString()
  platform?: Platform;
}
// src/email/dto/send-email.dto.ts
import { IsString, IsNotEmpty, IsEmail, IsIP } from 'class-validator';

export class SendEmailDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    to: string;

    @IsNotEmpty()
    @IsString()
    subject: string;

    @IsNotEmpty()
    @IsString()
    text: string;
}

export class UserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    @IsIP()
    ip: string;
}

export class SendEmailWithUserDto {
    @IsNotEmpty()
    data: SendEmailDto;

    @IsNotEmpty()
    user: UserDto;
}
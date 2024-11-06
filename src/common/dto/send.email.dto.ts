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
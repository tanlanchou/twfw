import { IsString, IsNotEmpty, IsEmail, IsIP, isString, isNumber } from 'class-validator';
import { sendType } from './sendType';
import { Send } from 'express';

export class sendCodeDto {
    @IsNotEmpty()
    @IsString()
    to: string;

    type: sendType;

    @IsNotEmpty()
    @IsString()
    userinfo: string;
}

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
    platform?: string;
}

export class SendCodeWithUserDto {

    @IsNotEmpty()
    config: sendCodeDto;

    @IsNotEmpty()
    user: UserDto;
}
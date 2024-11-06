import { IsString, IsNotEmpty, IsEmail, IsIP, isString, isNumber } from 'class-validator';
import { sendType } from '../enum/sendType';
import { UserDto } from './user.dto';

export class sendCodeDto {
    @IsNotEmpty()
    @IsString()
    to: string;

    type: sendType;
}

export class SendCodeWithUserDto {

    @IsNotEmpty()
    data: sendCodeDto;

    @IsNotEmpty()
    user: UserDto;
}
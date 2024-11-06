import { IsString, IsNotEmpty, IsEmail, IsIP, isString, isNumber } from 'class-validator';
import { UserDto } from './user.dto';

export class codeDto {
    @IsNotEmpty()
    @IsString()
    code: string;
}

export class codeWithUserDto {

    @IsNotEmpty()
    data: codeDto;

    @IsNotEmpty()
    user: UserDto;
}
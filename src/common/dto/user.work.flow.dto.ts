import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserDto } from './user.dto'
import { sendType, sendAction } from '../enum/sendType';
import Platform from '../enum/platform';

export class sendBaseModel {

    @IsNotEmpty()
    @IsString()
    to: string

    @IsNotEmpty()
    sendType: sendType

    @IsNotEmpty()
    action: sendAction
}

export class checkToBaseModel {
    @IsNotEmpty()
    @IsString()
    to: string
}

export class sendBaseModelWithUser {
    data: sendBaseModel
    user: UserDto
}

export class checkBaseModelWithUser {
    data: checkToBaseModel
    user: UserDto
}

export class RegisterDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    phone_number?: string;
    email?: string;

    @IsString()
    @IsNotEmpty()
    code: string;
}

export class RegisterDtoWithUser {
    data: RegisterDto
    user: UserDto
}


export class LoginDto {

    username?: string;

    phone_number?: string;
    email?: string;

    code?: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class LoginDtoWithUser {
    data: LoginDto
    user: UserDto
}

export class forgetDto {
    username?: string;
    phone_number?: string;
    email?: string;

    @IsString()
    @IsNotEmpty()
    code: string;
}

export class forgetDtoWithUser {
    data: forgetDto
    user: UserDto
}

export class changePasswordDto {

    @IsString()
    @IsNotEmpty()
    token: string

    username?: string;
    phone_number?: string;
    email?: string;

    @IsString()
    @IsNotEmpty()
    password: string
}

export class changePasswordDtoWithUser {
    data: changePasswordDto
    user: UserDto
}
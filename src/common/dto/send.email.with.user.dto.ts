import { UserDto } from "./user.dto";
import { SendEmailDto } from "./send.email.dto";
import { IsString, IsNotEmpty, IsEmail, IsIP } from 'class-validator';

export class SendEmailWithUserDto {
    @IsNotEmpty()
    data: SendEmailDto;

    @IsNotEmpty()
    user: UserDto;
}
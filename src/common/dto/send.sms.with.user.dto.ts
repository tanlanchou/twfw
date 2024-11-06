import { UserDto } from "./user.dto";
import { IsNotEmpty } from 'class-validator';
import { sendSMSDto } from "./send.sms.dto";

export class SendSMSWithUserDto {
    @IsNotEmpty()
    data: sendSMSDto;

    @IsNotEmpty()
    user: UserDto;
}
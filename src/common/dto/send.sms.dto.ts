import { IsString, IsNotEmpty } from 'class-validator';
import { SignNameALY } from '../enum/sign.name';
import { TemplateCodeALY } from '../enum/template.code';

export class sendSMSDto {

    @IsString()
    @IsNotEmpty()
    to: string;

    @IsString()
    @IsNotEmpty()
    signName: SignNameALY;

    @IsString()
    @IsNotEmpty()
    templateCode: TemplateCodeALY;

    @IsString()
    @IsNotEmpty()
    templateParam: string
}
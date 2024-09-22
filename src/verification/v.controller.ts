import {
    Controller,
    Get,
    Inject,
    Injectable,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { VService } from "./v.service";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "../config/config.service";
import { SendCodeWithUserDto } from "src/common/dto/send.verifcation.code.dto";
import { sendType } from "src/common/enum/sendType";
import { Action } from "src/common/enum/action";
import { resultCode, success, error } from "src/common/helper/result";
import { LogStatus } from "src/common/enum/log";
import { NetworkUtils } from "src/common/helper/ip";
import { codeWithUserDto } from "src/common/dto/verifcation.code.dto";

@Controller("sms")
@Injectable()
export class PhoneController {
    constructor(
        private readonly vService: VService,
        @Inject("MICROSERVICE_LOG_CLIENT") private readonly clientLog: ClientProxy,
        @Inject("MICROSERVICE_EMAIL_CLIENT") private readonly clientEmail: ClientProxy,
        @Inject("MICROSERVICE_PHONE_CLIENT") private readonly clientPhone: ClientProxy,
        private readonly configService: ConfigService
    ) { }

    @MessagePattern({ cmd: "sendRegisterCode" })
    @UsePipes(new ValidationPipe({ transform: true })) // 自动验证和转换数据
    async sendSMS(data: SendCodeWithUserDto) {
        let returnResult = {
            status: false,
            message: ""
        }

        try {
            const config = await this.configService.get("verification_code");
            const regConfig = config && config.codeConfig && config.codeConfig.reg;
            if (!regConfig) {
                throw new Error("注册验证码配置不存在");
            }

            const code = await this.vService.buildCode(data.user);
            let result;

            switch (data.config.type) {
                case sendType.EMAIL:
                    result = await firstValueFrom(this.clientEmail.send<object>({ cmd: "sendEmail" }, {
                        data: {
                            to: data.config.to,
                            subject: regConfig.email.subject,
                            text: regConfig.email.text.replace("{{code}}", code),
                        }
                    }));
                    break;
                case sendType.SMS:
                    result = await firstValueFrom(this.clientPhone.send<object>({ cmd: "sendSMS" }, {
                        to: data.config.to,
                        signName: regConfig.sms.signName,
                        templateCode: regConfig.sms.templateCode,
                        templateParam: regConfig.sms.templateParam.replace("{{code}}", code),
                    }));
                    break;
                default:
                    throw new Error("错误的发送类型");
            }

            if (result.code == resultCode.success) {
                return success(null);
            }
            else {
                throw new Error(result.message);
            }
        }
        catch (ex) {
            await firstValueFrom(
                this.clientLog.send<object>(
                    { cmd: 'addLog' },
                    {
                        operation: Action.SEND_VERIFCATION_CODE,
                        operator: data.user.name,
                        platform: data.user.platform,
                        details: `
                            ip: ${data.user.ip || NetworkUtils.getLocalIpAddress()}
                            message:${ex.message}
                        `,
                        status: LogStatus.ERROR,
                    },
                ),
            );
        }
    }

    @MessagePattern({ cmd: "verifyCode" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async verifyCode(data: codeWithUserDto) {
        this.vService.verify()
    }

}
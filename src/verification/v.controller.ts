import {
    Controller,
    Get,
    Inject,
    Injectable,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { VService } from "./v.service";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "src/common/config/config.service";
import { SendCodeWithUserDto } from "src/common/dto/send.verifcation.code.dto";
import { sendType } from "src/common/enum/sendType";
import { Action } from "src/common/enum/action";
import { resultCode, success, error, result } from "src/common/helper/result";
import { LogStatus } from "src/common/enum/log";
import { NetworkUtils } from "src/common/helper/ip";
import { codeWithUserDto } from "src/common/dto/verifcation.code.dto";
import { LogMethods } from "src/common/enum/methods";
import { getAbc } from "src/common/helper/access.verifiy";
import { AccessVerifyInterceptor } from "src/common/interceptor/access.verify.interceptor";
import { NotificationDto, NotificationType } from "src/common/dto/notification.dto";

@Controller("verification")
@Injectable()
export class VController {
    constructor(
        private readonly vService: VService,
        @Inject("MICROSERVICE_LOG_CLIENT") private readonly clientLog: ClientProxy,
        @Inject("MICROSERVICE_EMAIL_CLIENT") private readonly clientEmail: ClientProxy,
        @Inject("MICROSERVICE_PHONE_CLIENT") private readonly clientPhone: ClientProxy,
        private readonly configService: ConfigService
    ) { }

    @MessagePattern({ cmd: LogMethods.VERIFICATION_SEND_REGISTER_CODE })
    @UseInterceptors(AccessVerifyInterceptor)
    @UsePipes(new ValidationPipe({ transform: true })) // 自动验证和转换数据
    async sendRegisterCode(data: SendCodeWithUserDto): Promise<result> {

        try {
            const config = await this.configService.get("verification_code");
            const regConfig = config && config.codeConfig && config.codeConfig.reg && config.codeConfig.reg[data.user.platform];

            if (!regConfig) {
                return error("注册验证码配置不存在");
            }

            const r = await this.send(regConfig, data);
            return r;
        }
        catch (ex) {
            const [curTime, abc] = await getAbc(this.configService)
            await firstValueFrom(
                this.clientLog.send<object>(
                    { cmd: LogMethods.LOG_ADD },
                    {
                        curTime,
                        abc,
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
            return error(ex.message);
        }
    }

    @MessagePattern({ cmd: LogMethods.VERIFICATION_SEND_FORGET_CODE })
    @UseInterceptors(AccessVerifyInterceptor)
    @UsePipes(new ValidationPipe({ transform: true })) // 自动验证和转换数据
    async sendForgetCode(data: SendCodeWithUserDto) {

        try {
            const config = await this.configService.get("verification_code");
            const regConfig = config && config.codeConfig && config.codeConfig.forget && config.codeConfig.forget[data.user.platform];

            if (!regConfig) {
                throw new Error("忘记密码验证码配置不存在");
            }

            const r = await this.send(regConfig, data);
            return r;
        }
        catch (ex) {
            const [curTime, abc] = await getAbc(this.configService)
            await firstValueFrom(
                this.clientLog.send<object>(
                    { cmd: LogMethods.LOG_ADD },
                    {
                        curTime,
                        abc,
                        operation: Action.SEND_FORGET_CODE,
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
            return error(ex.message);
        }
    }

    async send(regConfig: any, data: SendCodeWithUserDto) {

        const code = await this.vService.buildCode(data.user);
        console.log(data.data.to, code);
        let result;
        const [curTime, abc] = await getAbc(this.configService)

        switch (data.data.type) {
            case sendType.EMAIL:
                result = await firstValueFrom(this.clientEmail.send<object>({ cmd: LogMethods.EMAIL_SEND }, {
                    curTime,
                    abc,
                    data: {
                        to: data.data.to,
                        subject: regConfig.email.subject,
                        text: regConfig.email.text.replace("{{code}}", code),
                    },
                    user: data.user
                }));
                break;
            case sendType.SMS:
                result = await firstValueFrom(this.clientPhone.send<object>({ cmd: LogMethods.SMS_SEND }, {
                    curTime,
                    abc,
                    data: {
                        to: data.data.to,
                        signName: regConfig.sms.signName,
                        templateCode: regConfig.sms.templateCode,
                        templateParam: regConfig.sms.templateParam.replace("{{code}}", code),
                    },
                    user: data.user
                }));
                break;
            default:
                throw new Error("错误的发送类型");
        }

        if (result.code == resultCode.success) {
            return success(null);
        }
        else {
            throw new Error(result.msg);
        }
    }

    @MessagePattern({ cmd: LogMethods.VERIFICATION_VERIFY_CODE })
    @UseInterceptors(AccessVerifyInterceptor)
    @UsePipes(new ValidationPipe({ transform: true }))
    async verifyCode(data: codeWithUserDto) {
        try {
            const result = await this.vService.verify(data.data.code, data.user);
            if (result) {
                return success(null);
            }
            else {
                return error("验证码错误");
            }
        }
        catch (ex) {
            const [curTime, abc] = await getAbc(this.configService)
            await firstValueFrom(
                this.clientLog.send<object>(
                    { cmd: LogMethods.LOG_ADD },
                    {
                        curTime,
                        abc,
                        operation: Action.VERIFICATION_CODE,
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
            return error(ex.message);
        }
    }

    @MessagePattern({ cmd: LogMethods.VERIFICATION_NOTIFICATION })
    @UseInterceptors(AccessVerifyInterceptor)
    @UsePipes(new ValidationPipe({ transform: true }))
    async notification(data: NotificationDto) {
        const [curTime, abc] = await getAbc(this.configService)
        let result;
        switch (data.type) {
            case NotificationType.EMAIL:
                result = await firstValueFrom(this.clientEmail.send<result>({ cmd: LogMethods.EMAIL_SEND }, {
                    curTime,
                    abc,
                    data: data.email,
                    user: data.user
                }));
                break;
            case NotificationType.SMS:
                result = await firstValueFrom(this.clientPhone.send<result>({ cmd: LogMethods.SMS_SEND }, {
                    curTime,
                    abc,
                    data: data.sms,
                    user: data.user
                }));
                break;
            default:
                return error("错误的消息类型");
        }

        return result;
    }
}

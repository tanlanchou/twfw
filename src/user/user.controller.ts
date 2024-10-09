import {
    Controller,
    Get,
    Inject,
    Injectable,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { UserService } from "./user.service";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "src/common/config/config.service";
import { Action } from "src/common/enum/action";
import { resultCode, success, error, result } from "src/common/helper/result";
import { LogStatus } from "src/common/enum/log";
import { NetworkUtils } from "src/common/helper/ip";
import { codeWithUserDto } from "src/common/dto/verifcation.code.dto";
import { UserDto } from "src/common/dto/user.dto";
import { LogMethods } from "src/common/enum/methods";
import { sendBaseModelWithUser, checkBaseModelWithUser } from "src/common/dto/userWorkFlow";
import * as _ from "lodash";
import { sendAction, sendType } from "src/common/enum/sendType";
import { generateID } from "src/common/helper/uuid";
import Platform from "src/common/enum/platform";


@Controller("user")
@Injectable()
export class UserController {
    constructor(
        private readonly userService: UserService,
        @Inject("MICROSERVICE_LOG_CLIENT") private readonly clientLog: ClientProxy,
        @Inject("MICROSERVICE_JWT_CLIENT") private readonly clientJwt: ClientProxy,
        @Inject("MICROSERVICE_VERIFICATION_CLIENT") private readonly clientVerification: ClientProxy,
        private readonly configService: ConfigService
    ) { }

    @MessagePattern({ cmd: "getCode" })
    @UsePipes(new ValidationPipe({ transform: true })) // 自动验证和转换数据
    async getCode(data: sendBaseModelWithUser) {

        const ip = _.get(data, "user.ip", NetworkUtils.getLocalIpAddress());
        const id = _.get(data, "user.id", generateID());
        const platform = _.get(data, "user.platform", Platform.SICIAL_CHECK);
        const to = _.get(data, "data.to");
        const name = _.get(data, "user.name", to);
        const type = _.get(data, "data.type");

        const action = _.get(data, "data.action");
        let cmd = "";


        switch (action) {
            case sendAction.REGISTER:
                cmd = "sendRegisterCode";
                break;
            case sendAction.FORGET:
                cmd = "sendForgetCode";
                break;
            default:
                return error("操作类型不正确");
        }

        if (type != sendType.EMAIL && type != sendType.SMS) {
            return error("发送类型不正确");
        }

        try {
            const result = await firstValueFrom(this.clientVerification.send<result>({ "cmd": cmd },
                {
                    "data": { "to": to, "type": type },
                    "user": {
                        "name": name,
                        "id": id,
                        "ip": ip,
                        "platform": platform
                    }
                }))

            if (result.code == 200) {
                return success(`发送成功`);
            }
            else {
                return result;
            }
        }
        catch (ex) {
            const message = _.get(ex, "message", "未知错误");
            await firstValueFrom(
                this.clientLog.send<object>(
                    { cmd: LogMethods.LOG_ADD },
                    {
                        operation: "getCode",
                        operator: name,
                        platform: platform,
                        details: `
                            ip: ${ip}
                            message:${message}
                        `,
                        status: LogStatus.ERROR,
                    },
                ),
            );
            return error(message);
        }
    }

    @MessagePattern({ cmd: "checkName" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async checkName(user: UserDto) {
        const name = _.get(user, "name");
        const ip = _.get(user, "ip", NetworkUtils.getLocalIpAddress());
        const platform = _.get(user, "platform", Platform.SICIAL_CHECK);
        try {
            if (_.isEmpty(name)) return error("参数错误");
            const result = await this.userService.findUserByName(name);
            return success(_.isNull(result));
        } catch (ex) {
            const message = _.get(ex, "message", "未知错误");
            this.clientLog.send<object>(
                { cmd: LogMethods.LOG_ADD },
                {
                    operation: "checkName",
                    operator: name,
                    platform: platform,
                    details: `
                        ip: ${ip}
                        message:${message}
                    `,
                    status: LogStatus.ERROR,
                },
            )
            return error(message);
        }
    }

    @MessagePattern({ cmd: "checkPhone" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async checkPhone(data: checkBaseModelWithUser) {
        const name = _.get(data, "user.name");
        const ip = _.get(data, "user.ip", NetworkUtils.getLocalIpAddress());
        const platform = _.get(data, "user.platform", Platform.SICIAL_CHECK);
        const phone = _.get(data, 'data.to');

        if (_.isEmpty(phone)) return error("参数错误");

        try {
            const result = await this.userService.findUserByPhone(phone);
            return success(_.isEmpty(result));
        }
        catch (ex) {
            const message = _.get(ex, "message", "未知错误");
            this.clientLog.send<object>(
                { cmd: LogMethods.LOG_ADD },
                {
                    operation: "checkPhone",
                    operator: name,
                    platform: platform,
                    details: `
                        ip: ${ip}
                        message:${message}
                    `,
                    status: LogStatus.ERROR,
                },
            )
            return error(message);
        }
    }

    async checkEmail(data: checkBaseModelWithUser) { 
        const name = _.get(data, "user.name");
        const ip = _.get(data, "user.ip", NetworkUtils.getLocalIpAddress());
        const platform = _.get(data, "user.platform", Platform.SICIAL_CHECK);
        const email = _.get(data, 'data.to');

        if (_.isEmpty(email)) return error("参数错误");

        try {
            const result = await this.userService.findUserByEmail(email);
            return success(_.isEmpty(result));
        }
        catch (ex) {
            const message = _.get(ex, "message", "未知错误");
            this.clientLog.send<object>(
                { cmd: LogMethods.LOG_ADD },
                {
                    operation: "checkEmail",
                    operator: name,
                    platform: platform,
                    details: `
                        ip: ${ip}
                        message:${message}
                    `,
                    status: LogStatus.ERROR,
                },
            )
            return error(message);
        }
    }

    async register(data) {}

    @MessagePattern({ cmd: "verificationCode" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async verificationCode(data: codeWithUserDto) {

        const code = _.get(data, "data.code", "00000");
        if (_.isEmpty(code) || code.length !== 6) {
            return error("验证码格式不正确");
        }

        const id = _.get(data, "user.id", generateID());
        const name = _.get(data, "user.name");
        if (_.isEmpty(name)) {
            return error("用户名不能为空");
        }
        const platform = data.user.platform || Platform.SICIAL_CHECK;


        const ip = data.user.ip || NetworkUtils.getLocalIpAddress();
        try {
            const result = await firstValueFrom(this.clientVerification.send<boolean>({ "cmd": "verifyCode" }, {
                data: { code },
                "user": {
                    "name": name,
                    "id": id,
                    "ip": ip,
                    "platform": platform
                }
            }));

            if (result === true) {
                return success("验证成功");
            }
            else {
                return error("验证失败");
            }
        }
        catch (ex) {
            await firstValueFrom(
                this.clientLog.send<object>(
                    { cmd: LogMethods.LOG_ADD },
                    {
                        operation: "verificationCode",
                        operator: data.user.name,
                        platform: data.user.platform,
                        details: `
                            ip: ${ip}
                            message:${_.get(ex, "message", "未知错误")}
                        `,
                        status: LogStatus.ERROR,
                    },
                ),
            );
            return error(_.get(ex, "message", "未知错误"));
        }
    }

}

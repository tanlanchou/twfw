import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
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
import { success, error, result } from "src/common/helper/result";
import { LogStatus } from "src/common/enum/log";
import { NetworkUtils } from "src/common/helper/ip";
import { codeWithUserDto } from "src/common/dto/verifcation.code.dto";
import { UserDto } from "src/common/dto/user.dto";
import { LogMethods } from "src/common/enum/methods";
import { sendBaseModelWithUser, checkBaseModelWithUser, RegisterDto, RegisterDtoWithUser, LoginDtoWithUser } from "src/common/dto/user.work.flow.dto";
import * as _ from "lodash";
import { sendAction, sendType } from "src/common/enum/sendType";
import { generateID } from "src/common/helper/uuid";
import Platform from "src/common/enum/platform";
import { UserEntity } from "src/common/entity/user.entity";
import { UserStatus } from "src/common/enum/userStatus";


@Controller("user")
@Injectable()
export class UserController {
    constructor(
        private readonly userService: UserService,
        @Inject("MICROSERVICE_LOG_CLIENT") private readonly clientLog: ClientProxy,
        @Inject("MICROSERVICE_JWT_CLIENT") private readonly clientJwt: ClientProxy,
        @Inject("MICROSERVICE_VERIFICATION_CLIENT") private readonly clientVerification:
            ClientProxy,
        @Inject("MICROSERVICE_MAIL_CLIENT") private readonly clientMail: ClientProxy,
        @Inject("MICROSERVICE_SMS_CLIENT") private readonly clientSms: ClientProxy,
        private readonly configService: ConfigService
    ) { }

    @Post("getCode")
    async getCode(@Body() data: sendBaseModelWithUser) {
        const ip = _.get(data, "user.ip", NetworkUtils.getLocalIpAddress());
        const id = _.get(data, "user.id", generateID());
        const platform = _.get(data, "user.platform", Platform.SICIAL_CHECK);
        const to = _.get(data, "data.to");
        const name = _.get(data, "user.name", to);
        const type = _.get(data, "data.sendType");

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

    @Get("checkName")
    async checkName(@Query("name") name: string, @Query("ip") ip: string, @Query("platform") platform: string) {
        ip = ip || NetworkUtils.getLocalIpAddress();
        platform = platform || Platform.SICIAL_CHECK;
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

    @Get("checkPhone")
    async checkPhone(@Query("phone") phone: string, @Query("ip") ip: string, @Query("platform") platform: string) {
        ip = ip || NetworkUtils.getLocalIpAddress();
        platform = platform || Platform.SICIAL_CHECK;

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
                    operator: phone,
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

    @Get("checkEmail")
    async checkEmail(@Query("email") email: string, string, @Query("ip") ip: string, @Query("platform") platform: string) {
        ip = ip || NetworkUtils.getLocalIpAddress();
        platform = platform || Platform.SICIAL_CHECK;

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
                    operator: email,
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

    @Post("register")
    async register(@Body() data: RegisterDtoWithUser) {
        const ip = _.get(data, "user.ip", NetworkUtils.getLocalIpAddress());
        const isEmail = _.isEmpty(_.get(data, "data.email"));
        const isPhone = _.isEmpty(_.get(data, "data.phone_number"));
        const platform = data.user.platform || Platform.SICIAL_CHECK;
        const name = _.get(data, "user.name");

        try {
            if (isEmail && isPhone)
                return error("参数错误, 邮箱或者手机号至少传入一个");

            if (isEmail) {
                const result = await this.userService.findUserByEmail(data.data.email);
                if (!_.isEmpty(result)) {
                    return error("该邮箱已被注册");
                }
            }
            else if (isPhone) {
                const result = await this.userService.findUserByPhone(data.data.phone_number);
                if (!_.isEmpty(result)) {
                    return error("该手机号已被注册");
                }
            }

            const code = _.get(data, "data.code", "00000");
            if (_.isEmpty(code) || code.length !== 6) {
                return error("验证码格式不正确");
            }

            const id = _.get(data, "user.id", generateID());

            if (_.isEmpty(name)) {
                return error("用户名不能为空");
            }

            const vResult = await firstValueFrom(this.clientVerification.send<result>({ "cmd": "verifyCode" }, {
                data: { code },
                "user": {
                    "name": name,
                    "id": id,
                    "ip": ip,
                    "platform": platform
                }
            }));

            if (vResult.code !== 200) {
                return error(vResult.msg);
            }

            const user = new UserEntity();
            user.email = _.get(data, "data.email");
            user.ip = ip;
            user.languagePreference = "ZH-CN";
            user.lastLoginTime = new Date();
            user.password = _.get(data, "data.password");
            user.phoneNumber = _.get(data, "data.phone_number");
            user.platform = platform;
            user.registrationTime = new Date();
            user.status = UserStatus.TOBEACTIVE;
            user.username = _.get(data, "data.name", name);

            this.userService.createUser(user);

            if (isEmail) {
                const email = _.get(data, "data.email");
                const mailConfig = await this.configService.get("mailConfig");
                const title = mailConfig.registerSuccessTitle.replace("{{name}}", user.username);
                const content = mailConfig.registerSuccessContent.replace("{{name}}", user.username);
                await firstValueFrom(this.clientMail.send<result>({ cmd: "sendEmail" }, {
                    data: { "to": email, "subject": title, "text": content },
                    user: _.get(data, "user")
                }));
            }
            else if (isPhone) {
                //暂不做处理, 因为还不支持除法验证码以外的短
            }

            return success("注册成功");
        }
        catch (ex) {
            await firstValueFrom(
                this.clientLog.send<object>(
                    { cmd: LogMethods.LOG_ADD },
                    {
                        operation: "register",
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

    @Post("login")
    async login(@Body() data: LoginDtoWithUser) {
        const ip = _.get(data, "user.ip", NetworkUtils.getLocalIpAddress());
        const email = _.get(data, "data.email");
        const phone = _.get(data, "data.phone_number")
        const isEmail = _.isEmpty(email);
        const isPhone = _.isEmpty(phone);
        const platform = data.user.platform || Platform.SICIAL_CHECK;
        const name = _.get(data, "user.name");

        try {
            let loginResult: UserEntity;
            if (!isEmail) {
                loginResult = await this.userService.login({ email }, data.data.password);
            } else if (!isPhone) {
                loginResult = await this.userService.login({ phone }, data.data.password);
            } else {
                return error("请提供邮箱或手机号进行登录");
            }

            await firstValueFrom(
                this.clientLog.send<object>(
                    { cmd: LogMethods.LOG_ADD },
                    {
                        operation: "login",
                        operator: name,
                        platform: platform,
                        details: `
                            ip: ${ip},
                            email: ${email},
                            phone: ${phone},
                            message: 登录成功
                        `,
                        status: LogStatus.SUCCESS,
                    },
                ),
            );
            const tempUserId = (new Date()).getTime() + name + ip + loginResult.id
            const getTokenResult = await firstValueFrom(this.clientJwt.send<result>({ cmd: "createToken" }, { "userId": tempUserId }));

            if (_.isEmpty(getTokenResult) || getTokenResult.code !== 200)
                return error("获取token失败");

            return success(getTokenResult.data);
        } catch (ex) {
            await firstValueFrom(
                this.clientLog.send<object>(
                    { cmd: LogMethods.LOG_ADD },
                    {
                        operation: "login",
                        operator: name,
                        platform: platform,
                        details: `
                            ip: ${ip}
                            message:${_.get(ex, "message", "未知错误")}
                        `,
                        status: LogStatus.ERROR,
                    },
                ),
            );
            return error(_.get(ex, "message", "登录失败"));
        }
    }

    @Post("loginWithCode")
    async loginWithCode(@Body() data: LoginDtoWithUser) {
        const ip = _.get(data, "user.ip", NetworkUtils.getLocalIpAddress());
        const email = _.get(data, "data.email");
        const phone = _.get(data, "data.phone_number");
        const code = _.get(data, "data.code");
        const platform = data.user.platform || Platform.SICIAL_CHECK;
        const name = _.get(data, "user.name");

        try {
            let user: UserEntity;

            if (!_.isEmpty(email)) {
                user = await this.userService.findUserByEmail(email);
            } else if (!_.isEmpty(phone)) {
                user = await this.userService.findUserByPhone(phone);
            } else {
                return error("请提供邮箱或手机号进行登录");
            }

            if (!user) {
                return error("用户不存在");
            }

            const verificationResult = await firstValueFrom(this.clientVerification.send<boolean>({ cmd: "verifyCode" }, {
                data: { code },
                user: {
                    name: user.username,
                    id: user.id,
                    ip: ip,
                    platform: platform
                }
            }));

            if (!verificationResult) {
                return error("验证码错误");
            }

            const tempUserId = (new Date()).getTime() + user.username + ip + user.id;
            const getTokenResult = await firstValueFrom(this.clientJwt.send<result>({ cmd: "createToken" }, { "userId": tempUserId }));

            if (_.isEmpty(getTokenResult) || getTokenResult.code !== 200) {
                return error("获取token失败");
            }

            await firstValueFrom(
                this.clientLog.send<object>(
                    { cmd: LogMethods.LOG_ADD },
                    {
                        operation: "loginWithCode",
                        operator: user.username,
                        platform: platform,
                        details: `
                            ip: ${ip},
                            email: ${email},
                            phone: ${phone},
                            message: 登录成功
                        `,
                        status: LogStatus.SUCCESS,
                    },
                ),
            );

            return success(getTokenResult.data);
        } catch (ex) {
            await firstValueFrom(
                this.clientLog.send<object>(
                    { cmd: LogMethods.LOG_ADD },
                    {
                        operation: "loginWithCode",
                        operator: name,
                        platform: platform,
                        details: `
                            ip: ${ip}
                            message:${_.get(ex, "message", "未知错误")}
                        `,
                        status: LogStatus.ERROR,
                    },
                ),
            );
            return error(_.get(ex, "message", "登录失败"));
        }
    }

    @Post("refreshToken")
    async refreshToken(@Body() data: { token: string }) {
        try {
            const { token } = data;
            if (_.isEmpty(token)) {
                return error("Token is required");
            }

            const refreshResult = await firstValueFrom(
                this.clientJwt.send<result>({ cmd: "refreshToken" }, { token })
            );

            if (_.isEmpty(refreshResult) || refreshResult.code !== 200) {
                return error("Failed to refresh token");
            }

            return success(refreshResult.data);
        } catch (ex) {
            const errorMessage = _.get(ex, "message", "Unknown error occurred while refreshing token");
            await firstValueFrom(
                this.clientLog.send<object>(
                    { cmd: LogMethods.LOG_ADD },
                    {
                        operation: "refreshToken",
                        operator: "System",
                        platform: Platform.SICIAL_CHECK,
                        details: `
                            message: ${errorMessage}
                        `,
                        status: LogStatus.ERROR,
                    },
                ),
            );
            return error(errorMessage);
        }
    }
}

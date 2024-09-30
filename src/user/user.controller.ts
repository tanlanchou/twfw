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
import { resultCode, success, error } from "src/common/helper/result";
import { LogStatus } from "src/common/enum/log";
import { NetworkUtils } from "src/common/helper/ip";
import { codeWithUserDto } from "src/common/dto/verifcation.code.dto";
import { LogMethods } from "src/common/enum/methods";
import { registerMail } from "src/common/dto/userWorkFlow";
import _ from "lodash";

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

    @MessagePattern({ cmd: "getCodeByEmail" })
    @UsePipes(new ValidationPipe({ transform: true })) // 自动验证和转换数据
    async getCodeByEmail(data: registerMail) {

        try {
            const ip = NetworkUtils.getLocalIpAddress();
            if(!_.isEmpty(ip)) {
                
            }
        }
        catch (ex) {
            await firstValueFrom(
                this.clientLog.send<object>(
                    { cmd: LogMethods.LOG_ADD },
                    {
                        operation: Action.GET_CODE_BY_EMAIL,
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



}

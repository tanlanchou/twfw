import { Controller, Get, Inject, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from "rxjs";
import { Action } from 'src/common/enum/action';
import { LogStatus } from 'src/common/enum/log';
import { LogMethods } from 'src/common/enum/methods';
import Platform from 'src/common/enum/platform';
import { NetworkUtils } from 'src/common/helper/ip';
import * as crypto from 'crypto';
import { ConfigService } from 'src/common/config/config.service';
import { Response } from 'express';
import { LogAddDTO, LogListDto } from 'src/common/dto/log.dto';

@Controller('test')
export class TestController {

    constructor(@Inject("MICROSERVICE_LOG_CLIENT") private readonly clientLog: ClientProxy, private readonly configService: ConfigService) { }

    async getAbc() {
        const commonOptions = await this.configService.get("common");
        const token = commonOptions.unsafeToken;

        // 获取当前时间
        const curTime = new Date().toISOString();

        // 生成MD5值
        const md5Hash = crypto
            .createHash("md5")
            .update(token + curTime)
            .digest("hex");

        return [curTime, md5Hash];
    }

    @Get("index")
    async myTest(@Res() res: Response): Promise<void> {
        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        res.write(`------------------------------------------------------- \n\n`)
        await this.sendLog(res);
        res.write(`------------------------------------------------------- \n\n`)
        await this.getLog(res);
        res.write(`------------------------------------------------------- \n\n`)
        res.end();
    }

    
    /* ----------------------jwt 测试开始--------------------------- */
    
    

    /* ----------------------jwt 测试结束--------------------------- */
    

    /* ----------------------日志条目测试开始--------------------------- */

    private async sendLog(res: Response): Promise<void> {
        const [curTime, abc] = await this.getAbc();

        const logAddDto = new LogAddDTO();
        logAddDto.operation = Action.CREATE_LOG;
        logAddDto.operator = `test_user_${new Date().getTime()}`;
        logAddDto.platform = Platform.SICIAL_CHECK;
        logAddDto.details = `
            ip: ${NetworkUtils.getLocalIpAddress()}
            message:这是一个测试的日志_${new Date().getTime()}
        `;
        logAddDto.status = LogStatus.ERROR;
        logAddDto.timestamp = new Date();

        try {
            const logResponse = await firstValueFrom(
                this.clientLog.send<object>(
                    { cmd: LogMethods.LOG_ADD },
                    { ...logAddDto, curTime, abc },
                ),
            );

            const logResponseObj = logResponse as any;

            if (logResponseObj.code === 200 && logResponseObj.msg === "Success" && logResponseObj.data && logResponseObj.data.id) {
                res.write("操作名称: 创建日志\n");
                res.write("操作结果: 成功\n");
                res.write("返回结果: \n");
                res.write(`${JSON.stringify(logResponseObj.data)}\n\n`);
            } else {
                res.write("操作名称: 创建日志\n");
                res.write("操作结果: 失败\n");
                res.write("返回结果: \n");
                res.write(`${JSON.stringify(logResponseObj)}\n\n`);
            }
        } catch (error) {
            res.write("操作名称: 创建日志\n");
            res.write("操作结果: 失败\n");
            res.write("错误信息: \n");
            res.write(`${error.message}\n\n`);

        }
    }

    private async getLog(res: Response): Promise<void> {
        const [curTime, abc] = await this.getAbc();

        const logListDto = new LogListDto();
        logListDto.operation = Action.CREATE_LOG; // Assuming CREATE_LOG is the correct action
        logListDto.page = 1;
        logListDto.limit = 10;

        try {
            const logResponse = await firstValueFrom(
                this.clientLog.send<object>(
                    { cmd: LogMethods.LOG_LIST },
                    { ...logListDto, curTime, abc },
                ),
            );

            const logResponseObj = logResponse as any;

            if (logResponseObj.code === 200 && logResponseObj.msg === "Success" && logResponseObj.data) {
                res.write("操作名称: 获取日志列表\n");
                res.write("操作结果: 成功\n");
                res.write("返回结果: \n");
                res.write(`${JSON.stringify(logResponseObj)}\n\n`);
            } else {
                res.write("操作名称: 获取日志列表\n");
                res.write("操作结果: 失败\n");
                res.write("返回结果: \n");
                res.write(`${JSON.stringify(logResponseObj)}\n\n`);
            }
        } catch (error) {
            res.write("操作名称: 获取日志列表\n");
            res.write("操作结果: 失败\n");
            res.write("错误信息: \n");
            res.write(`${error.message}\n\n`);
        }
    }

    /** ----------------------日志条目测试结束------------------------------------- */
}

import { Controller, Get, Post, Body, Query, Logger, UseInterceptors } from '@nestjs/common';
import { LogService } from './log.service';
import { GeneralLog } from './general-log.entity';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { error, result, resultCode, success } from '../common/helper/result';
import { LogAddDTO, LogListDto } from 'src/common/dto/log.dto';
import { LogMethods } from 'src/common/enum/methods';
import { AccessVerifyInterceptor } from 'src/common/interceptor/access.verify.interceptor';

@Controller('log')
export class LogController {
    private readonly logger = new Logger(LogController.name);

    constructor(private readonly logService: LogService) { }

    @Post()
    @UseInterceptors(AccessVerifyInterceptor)
    @MessagePattern({ cmd: LogMethods.LOG_ADD })
    async addLog(@Body() log: LogAddDTO): Promise<result> {
        try {

            const generalLog = new GeneralLog();
            generalLog.operation = log.operation;
            generalLog.operator = log.operator;
            generalLog.platform = log.platform;
            generalLog.timestamp = log.timestamp;
            generalLog.details = log.details;
            generalLog.status = log.status;

            const result = await this.logService.addLog(generalLog);
            return success(result);
        }
        catch (ex) {
            this.logger.error(`Failed to add log: ${ex.message}`, ex.stack);
            return error(`Failed to add log: ${ex.message}`)
        }
    }

    @Get()
    @UseInterceptors(AccessVerifyInterceptor)
    @MessagePattern({ cmd: LogMethods.LOG_LIST })
    async getLogs(@Payload() data: LogListDto): Promise<result> {
        try {
            const { operation,
                operator,
                platform,
                startTime,
                endTime,
                details,
                status,
                page,
                limit } = data;

            const result = await this.logService.getLogs(
                operation,
                operator,
                platform,
                startTime,
                endTime,
                details,
                status,
                page || 1,
                limit || 10,
            );
            return success(result);
        }
        catch (ex) {
            this.logger.error(`Failed to query log: ${ex.message}`, ex.stack);
            return error(`Failed to query log: ${ex.message}`)
        }

    }
}
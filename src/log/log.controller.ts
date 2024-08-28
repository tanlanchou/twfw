import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { LogService } from './log.service';
import { GeneralLog } from './general-log.entity';
import { MessagePattern } from '@nestjs/microservices';
import { error, result, resultCode, success } from '../common/helper/result';

@Controller('log')
export class LogController {
    constructor(private readonly logService: LogService) { }

    @Post()
    @MessagePattern({ cmd: 'addLog' })
    async addLog(@Body() log: GeneralLog): Promise<result> {
        try {
            const result = await this.logService.addLog(log);
            return success(result);
        }
        catch (ex) {
            console.error(ex);
            return error(`Failed to add log: ${ex.message}`)
        }
    }

    @Get()
    @MessagePattern({ cmd: 'getLogs' })
    async getLogs(
        @Query('operation') operation?: string,
        @Query('operator') operator?: string,
        @Query('platform') platform?: string,
        @Query('startTime') startTime?: Date,
        @Query('endTime') endTime?: Date,
        @Query('details') details?: string,
        @Query('status') status?: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ): Promise<result> {
        try {

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
            console.error(ex);
            return error(`Failed to query log: ${ex.message}`)
        }

    }
}
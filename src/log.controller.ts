import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { LogService } from './log.service';
import { GeneralLog } from './general-log.entity';
import { MessagePattern } from '@nestjs/microservices';

@Controller('log')
export class LogController {
    constructor(private readonly logService: LogService) { }

    @Post()
    @MessagePattern({ cmd: 'addLog' })
    async addLog(@Body() log: GeneralLog): Promise<GeneralLog> {
        return this.logService.addLog(log);
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
    ): Promise<[GeneralLog[], number]> {
        return this.logService.getLogs(
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
    }
}
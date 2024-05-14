import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeneralLog } from './general-log.entity';

@Injectable()
export class LogService {
    constructor(
        @InjectRepository(GeneralLog)
        private readonly logRepository: Repository<GeneralLog>,
    ) { }

    async addLog(log: GeneralLog): Promise<GeneralLog> {
        return this.logRepository.save(log);
    }

    async getLogs(
        operation?: string,
        operator?: string,
        platform?: string,
        startTime?: Date,
        endTime?: Date,
        details?: string,
        status?: string,
        page: number = 1,
        limit: number = 10,
    ): Promise<[GeneralLog[], number]> {
        const query = this.logRepository.createQueryBuilder('log');

        if (operation) {
            query.andWhere('log.operation LIKE :operation', { operation: `%${operation}%` });
        }

        if (operator) {
            query.andWhere('log.operator = :operator', { operator });
        }

        if (platform) {
            query.andWhere('log.platform = :platform', { platform });
        }

        if (startTime && endTime) {
            query.andWhere('log.timestamp BETWEEN :startTime AND :endTime', { startTime, endTime });
        }

        if (details) {
            query.andWhere('log.details LIKE :details', { details: `%${details}%` });
        }

        if (status) {
            query.andWhere('log.status = :status', { status });
        }

        // 分页逻辑
        query.skip((page - 1) * limit).take(limit);

        // 返回查询结果和总数
        return query.getManyAndCount();
    }


}
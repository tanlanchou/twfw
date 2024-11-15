// import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// @Entity('LogList')
// export class LogList {
//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column()
//     taskId: number;

//     @Column('text')
//     content: string;

//     @Column({ default: false })
//     isDuplicate: boolean;

//     @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//     scanTime: Date;
// }

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogList } from './entity';

@Injectable()
export class LogService {
    constructor(
        @InjectRepository(LogList)
        private logRepository: Repository<LogList>,
    ) {}

    // Create a new log entry
    async createLog(logData: Partial<LogList>): Promise<LogList> {
        const logEntry = this.logRepository.create(logData);
        return await this.logRepository.save(logEntry);
    }

    // Retrieve a log entry by ID
    async getLogById(id: number): Promise<LogList | undefined> {
        return await this.logRepository.findOne({ where: { id } }); // Updated to use the correct findOne syntax
    }

    // Update a log entry
    async updateLog(id: number, logData: Partial<LogList>): Promise<LogList | undefined> {
        await this.logRepository.update(id, logData);
        return this.getLogById(id);
    }

    // Delete logs older than a specified number of days
    async deleteLogsOlderThan(days: number): Promise<void> {
        const dateThreshold = new Date();
        dateThreshold.setDate(dateThreshold.getDate() - days);
        await this.logRepository.delete({ scanTime: dateThreshold }); // Updated to use the correct delete syntax
    }

    // Retrieve logs with pagination
    async getLogs(page: number, pageSize: number): Promise<[LogList[], number]> {
        const [result, total] = await this.logRepository.findAndCount({
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return [result, total];
    }
}

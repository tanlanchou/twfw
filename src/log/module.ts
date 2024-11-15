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

// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { LogList } from './entity';

// @Injectable()
// export class LogService {
//     constructor(
//         @InjectRepository(LogList)
//         private logRepository: Repository<LogList>,
//     ) {}

//     // Create a new log entry
//     async createLog(logData: Partial<LogList>): Promise<LogList> {
//         const logEntry = this.logRepository.create(logData);
//         return await this.logRepository.save(logEntry);
//     }

//     // Retrieve a log entry by ID
//     async getLogById(id: number): Promise<LogList | undefined> {
//         return await this.logRepository.findOne({ where: { id } }); // Updated to use the correct findOne syntax
//     }

//     // Update a log entry
//     async updateLog(id: number, logData: Partial<LogList>): Promise<LogList | undefined> {
//         await this.logRepository.update(id, logData);
//         return this.getLogById(id);
//     }

//     // Delete logs older than a specified number of days
//     async deleteLogsOlderThan(days: number): Promise<void> {
//         const dateThreshold = new Date();
//         dateThreshold.setDate(dateThreshold.getDate() - days);
//         await this.logRepository.delete({ scanTime: dateThreshold }); // Updated to use the correct delete syntax
//     }

//     // Retrieve logs with pagination
//     async getLogs(page: number, pageSize: number): Promise<[LogList[], number]> {
//         const [result, total] = await this.logRepository.findAndCount({
//             skip: (page - 1) * pageSize,
//             take: pageSize,
//         });
//         return [result, total];
//     }
// }

// import { Controller, Get, Param, Query } from '@nestjs/common';
// import { LogService } from './service';
// import { LogList } from './entity';

// @Controller('logs')
// export class LogController {
//     constructor(private readonly logService: LogService) { }

//     @Get(':id')
//     async getLogById(@Param('id') id: number): Promise<LogList | undefined> {
//         return this.logService.getLogById(id);
//     }

//     @Get()
//     async getLogs(@Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10): Promise<[LogList[], number]> {
//         return this.logService.getLogs(page, pageSize);
//     }
// }

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogService } from './service';
import { LogController } from './controller';
import { LogList } from './entity';
import { ConfigService } from 'src/common/config/config.service';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async (configService: ConfigService) => {
                const config = await configService.get('rss');
                return {
                    type: config.config.DB_TYPE,
                    host: config.config.DB_HOST,
                    port: config.config.DB_PORT,
                    username: config.config.DB_USERNAME,
                    password: config.config.DB_PASSWORD,
                    database: config.config.DB_DATABASE,
                    entities: [LogList],
                    synchronize: false, // 根据你的需求设置，通常在开发环境中设置为 true
                };
            },
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([LogList])
    ],
    providers: [LogService],
    controllers: [LogController],
    exports: [LogService], // Expose LogService to other modules
})
export class LogModule { }

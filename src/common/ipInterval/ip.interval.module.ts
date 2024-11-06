// src/config/config.module.ts
import { Module, Global } from '@nestjs/common';
import { IPIntervalService } from './ip.interval.service';
import { ConfigService } from '../config/config.service'
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpInterval } from './ip.interval.entity'


@Global()
@Module({
    imports: [TypeOrmModule.forRootAsync({
        useFactory: async (consulService: ConfigService) => {
            const config = await consulService.get('common');
            return {
                type: config.config.DB_TYPE,
                host: config.config.DB_HOST,
                port: config.config.DB_PORT,
                username: config.config.DB_USERNAME,
                password: config.config.DB_PASSWORD,
                database: config.config.DB_DATABASE,
                entities: [IpInterval],
                synchronize: false, // 根据你的需求设置，通常在开发环境中设置为 true
            };
        },
        inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([IpInterval])
    ],
    providers: [IPIntervalService],
    exports: [IPIntervalService],
})
export class IpIntervalModule { }

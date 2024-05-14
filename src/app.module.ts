import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsulService } from './consul.service';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { GeneralLog } from './general-log.entity';
import { ConsulModule } from './consul.module'; //
@Module({
  imports: [
    ConsulModule,
    TypeOrmModule.forRootAsync({
      useFactory: async (consulService: ConsulService) => {
        const config = await consulService.getConfig('log');
        return {
          type: config.config.DB_TYPE,
          host: config.config.DB_HOST,
          port: config.config.DB_PORT,
          username: config.config.DB_USERNAME,
          password: config.config.DB_PASSWORD,
          database: config.config.DB_DATABASE,
          entities: [GeneralLog],
          synchronize: false, // 根据你的需求设置，通常在开发环境中设置为 true
        };
      },
      inject: [ConsulService],
    }),
    TypeOrmModule.forFeature([GeneralLog]),
  ],
  controllers: [LogController],
  providers: [LogService],
})
export class AppModule { }
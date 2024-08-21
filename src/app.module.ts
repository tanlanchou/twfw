import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './common/config/config.service';
import { LogService } from './log/log.service';
import { LogController } from './log/log.controller';
import { GeneralLog } from './log/general-log.entity';
import { ConfigModule } from './common/config/config.module'; //
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const config = await configService.get('log');
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
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([GeneralLog]),
  ],
  controllers: [LogController],
  providers: [LogService],
})
export class AppModule { }
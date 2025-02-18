import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationCodeEntity } from "./verification.entity"
import { VService } from './v.service';
import { VController } from './v.controller';
import { ConfigService } from "../common/config/config.service";
import { ClientsModule, Transport } from '@nestjs/microservices';
import listen_microservice from 'src/common/helper/listenMicroservice';
import listen_local_microservice from 'src/common/helper/listenLocalMicroservice';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'MICROSERVICE_EMAIL_CLIENT',
        useFactory: () => listen_local_microservice("127.0.0.1", 8102),
      }, 
      {
        name: 'MICROSERVICE_PHONE_CLIENT',
        useFactory: () => listen_local_microservice("127.0.0.1", 8104),
      }
    ]),
    TypeOrmModule.forRootAsync({
      useFactory: async (consulService: ConfigService) => {
        const config = await consulService.get('verification_code');
        return {
          type: config.config.DB_TYPE,
          host: config.config.DB_HOST,
          port: config.config.DB_PORT,
          username: config.config.DB_USERNAME,
          password: config.config.DB_PASSWORD,
          database: config.config.DB_DATABASE,
          entities: [VerificationCodeEntity],
          synchronize: false, // 根据你的需求设置，通常在开发环境中设置为 true
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([VerificationCodeEntity]),
  ],
  providers: [VService],
  controllers: [VController],
  exports: [VService],
})
export class VModule { }
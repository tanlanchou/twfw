import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationCodeEntity } from "./verification.entity"
import { EmailController } from './email.controller';
import { VService } from './v.service';
import { ConfigService } from '../config/config.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import listen_microservice from 'src/common/helper/listenMicroservice';

//listen_microservice

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'MICROSERVICE_EMAIL_CLIENT',
        useFactory: listen_microservice("micMail"),
        inject: [ConfigService],
      }, {
        name: 'MICROSERVICE_PHONE_CLIENT',
        useFactory: listen_microservice("micSms"),
      },
      {
        name: "MICROSERVICE_LOG_CLIENT",
        useFactory: listen_microservice("micLog"),
        inject: [ConfigService],
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
  controllers: [EmailController],
  exports: [VService],
})
export class VModule { }
//src/email/email.module.ts
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ConfigService } from '../common/config/config.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'MICROSERVICE_LOG_CLIENT',
        useFactory: async (configService: ConfigService) => {
          const services = await configService.findService("log_v0.1.0_pro");
          if (!(services instanceof Array) || services.length === 0) {
            console.error("找不到 log_v0.1.0_pro 服务")
            return;
          }

          const service = services[0];
          return {
            transport: Transport.TCP,
            options: {
              host: service.ServiceAddress,
              port: service.ServicePort,
            },
          }
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [EmailService],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule { }

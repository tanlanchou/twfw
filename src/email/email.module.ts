//src/email/email.module.ts
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ConfigService } from '../config/config.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'MICROSERVICE_LOG_CLIENT',
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: (await configService.get('email')).log.host,
                        port: (await configService.get('email')).log.port,
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    providers: [EmailService],
    controllers: [EmailController],
    exports: [EmailService],
})
export class EmailModule { }
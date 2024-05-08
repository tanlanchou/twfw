//src/email/email.module.ts
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ConfigService } from '../config/config.service';

@Module({
    providers: [EmailService],
    controllers: [EmailController],
    exports: [EmailService],
})
export class EmailModule { }
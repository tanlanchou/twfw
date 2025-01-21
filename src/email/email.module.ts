//src/email/email.module.ts
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
// import { ConfigService } from '../common/config/config.service';
// import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [],
  providers: [EmailService],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule { }

import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module'; // Import the ConfigModule
import { EmailModule } from './email/email.module';
import { IpIntervalModule } from './common/ipInterval/ip.interval.module'
import { GlobalLogClientsModule } from './common/global/log';

@Module({
  imports: [ConfigModule, IpIntervalModule, EmailModule, GlobalLogClientsModule],
})
export class AppModule { }

import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module'; // Import the ConfigModule
import { IpIntervalModule } from './common/ipInterval/ip.interval.module'
import { GlobalJwtClientsModule } from './common/global/jwt';
import { GlobalLogClientsModule } from './common/global/log';
import { GlobalUserClientsModule } from './common/global/user';
import { TaskModule } from './task/module';
import { LogModule } from './log/module';

@Module({
  imports: [ConfigModule, GlobalJwtClientsModule, GlobalLogClientsModule, GlobalUserClientsModule, TaskModule, LogModule],
})
export class AppModule { }

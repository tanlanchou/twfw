import { Module } from '@nestjs/common';
import { ConfigModule } from "./common/config/config.module"; // Import the ConfigModule
import { VModule } from './verification/v.module'
import { GlobalModule } from './common/helper/global.module';
import { CronService } from './cron.service'
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    GlobalModule,
    ConfigModule,
    VModule,
    ScheduleModule.forRoot()
  ],
  providers: [CronService]
})
export class AppModule { }

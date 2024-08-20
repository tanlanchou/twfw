import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module'; // Import the ConfigModule
import { VModule } from './verification/v.module'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    ConfigModule,
    VModule,
    ScheduleModule.forRoot()
  ]
})
export class AppModule { }

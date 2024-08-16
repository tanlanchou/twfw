import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module'; // Import the ConfigModule
import { UserModule } from './user/user.module'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    ConfigModule,
    UserModule,
    ScheduleModule.forRoot()
  ]
})
export class AppModule { }

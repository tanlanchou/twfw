import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module'; 
import { GlobalLogClientsModule } from 'src/common/global/log';
import { TestController } from './test/test.controller';
@Module({
  imports: [
    ConfigModule,
    GlobalLogClientsModule
  ],
  controllers: [TestController],
})
export class AppModule { }
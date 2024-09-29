import { Module } from '@nestjs/common';
import { ConfigModule } from "./common/config/config.module"; // Import the ConfigModule
import { VModule } from './verification/v.module'
import { GlobalService } from './common/helper/global.service'

@Module({
  imports: [
    ConfigModule,
    VModule,
    GlobalService
  ],
  exports: [GlobalService]
})
export class AppModule { }

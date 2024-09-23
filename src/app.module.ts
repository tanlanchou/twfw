import { Module } from '@nestjs/common';
import { ConfigModule } from "./common/config/config.module"; // Import the ConfigModule
import { VModule } from './verification/v.module'

@Module({
  imports: [
    ConfigModule,
    VModule
  ]
})
export class AppModule { }

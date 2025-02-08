import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module'; // Import the ConfigModule
import { PhoneModule } from './phone/phone.module';
import { IpIntervalModule } from "src/common/ipInterval/ip.interval.module";
import { GlobalLogClientsModule } from './common/global/log';


@Module({
  imports: [
    ConfigModule,
    IpIntervalModule,
    GlobalLogClientsModule,
    PhoneModule
  ]
})
export class AppModule { }

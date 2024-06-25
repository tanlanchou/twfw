import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module'; // Import the ConfigModule
import { PhoneModule } from './phone/phone.module';


@Module({
  imports: [
    ConfigModule,
    PhoneModule
  ]
})
export class AppModule { }

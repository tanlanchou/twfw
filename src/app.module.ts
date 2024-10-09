import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/common/config/config.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ConfigModule,
    UserModule
  ]
})
export class AppModule { }

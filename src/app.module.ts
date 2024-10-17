import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/common/config/config.module';
import { UserModule } from 'src/user/user.module';
import { GlobalJwtClientsModule } from 'src/common/global/jwt'

@Module({
  imports: [
    ConfigModule,
    GlobalJwtClientsModule,
    UserModule
  ]
})
export class AppModule { }

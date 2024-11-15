import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/common/config/config.module';
import { UserModule } from 'src/user/user.module';
import { HealthModule } from 'src/common/global/health/health.module'
import { GlobalJwtClientsModule } from 'src/common/global/jwt'
import { GlobalLogClientsModule } from 'src/common/global/log';


@Module({
  imports: [
    ConfigModule,
    HealthModule,
    GlobalJwtClientsModule,
    GlobalLogClientsModule,
    UserModule
  ]
})
export class AppModule { }

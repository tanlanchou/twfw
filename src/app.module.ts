import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/common/config/config.module';
import { UserModule } from 'src/user/user.module';
import { HealthModule } from 'src/common/global/health/health.module'
import { GlobalJwtClientsModule } from 'src/common/global/jwt'


@Module({
  imports: [
    ConfigModule,
    HealthModule,
    GlobalJwtClientsModule,
    UserModule
  ]
})
export class AppModule { }

import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module'; // Import the ConfigModule
import { EmailModule } from './email/email.module';

@Module({
  imports: [ConfigModule, EmailModule],
})
export class AppModule {}

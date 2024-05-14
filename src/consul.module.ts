// src/config/config.module.ts
import { Module, Global } from '@nestjs/common';
import { ConsulService } from './consul.service';

@Global()
@Module({
  providers: [ConsulService],
  exports: [ConsulService],
})
export class ConsulModule {}
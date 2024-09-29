import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { VService } from './verification/v.service';


@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(private readonly vService: VService,) { }

  @Cron(CronExpression.EVERY_2_HOURS)
  handleCron() {
    this.vService.deleteExpireCode();
  }
}
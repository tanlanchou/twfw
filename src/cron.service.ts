import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { VerificationCodeEntity } from './verification/verification.entity';
import { GlobalService } from 'src/common/helper/global.service'

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(@InjectRepository(VerificationCodeEntity)
  private readonly VerificationCodeRepository: Repository<VerificationCodeEntity>, private readonly globalService: GlobalService) { }

  @Cron(CronExpression.EVERY_2_HOURS)
  handleCron() {
    const twoHoursAgo = new Date(Date.now() - this.globalService.getGlobalData().maxVerificationCode);

    this.VerificationCodeRepository.delete({
      created_at: LessThanOrEqual(twoHoursAgo)
    });
  }
}
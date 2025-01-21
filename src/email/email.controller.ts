// src/email/email.controller.ts
import {
  Controller,
  Get,
  Inject,
  Injectable,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EmailService } from './email.service';
import { SendEmailWithUserDto } from '../common/dto/send.email.with.user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NetworkUtils } from 'src/common/helper/ip';
import { error, result, success } from 'src/common/helper/result';
import * as _ from 'lodash';
import { IPIntervalService } from 'src/common/ipInterval/ip.interval.service';
import { Action } from 'src/common/enum/action';
import { AccessVerifyInterceptor } from 'src/common/interceptor/access.verify.interceptor';
import { LogMethods } from 'src/common/enum/methods';

@Controller('email')
@Injectable()
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    @Inject('MICROSERVICE_LOG_CLIENT') private readonly client: ClientProxy,
    private readonly ipIntervalService: IPIntervalService,
  ) { }

  @MessagePattern({ cmd: LogMethods.EMAIL_SEND })
  @UseInterceptors(AccessVerifyInterceptor)
  @UsePipes(new ValidationPipe({ transform: true })) // 自动验证和转换数据
  async sendMail(data: SendEmailWithUserDto): Promise<result> {
    let result: boolean;
    try {
      const ip = data.user.ip;

      if (_.isEmpty(ip)) {
        return error(`未知IP`);
      }

      const isEable = await this.ipIntervalService.IsEnable(ip);
      if (!isEable) {
        return error("间隔时间未到，不允许发送");
      }

      result = await this.emailService.sendMail(data);
      this.ipIntervalService.set(ip);
      return success(result);
    } catch (ex) {
      console.error(ex);
      return error(ex.message);
    } finally {
      //日志
      await firstValueFrom(
        this.client.send<object>(
          { cmd: 'addLog' },
          {
            operation: 'SEND_EMAIL',
            operator: data.user.name,
            platform: data.user.platform,
            details: `
          这封邮件是由${data.user.z}发出的, 
          标题是${data.data.subject}, 
          内容是${data.data.text}, 
          发送给${data.data.to},
          IP:${data.user.ip || NetworkUtils.getLocalIpAddress()}`,
            status: result ? 'success' : 'failure',
          },
        ),
      );
    }
  }
}

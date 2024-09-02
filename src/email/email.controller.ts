// src/email/email.controller.ts
import {
  Controller,
  Get,
  Inject,
  Injectable,
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

@Controller('email')
@Injectable()
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    @Inject('MICROSERVICE_LOG_CLIENT') private readonly client: ClientProxy,
  ) { }

  @MessagePattern({ cmd: 'sendEmail' })
  @UsePipes(new ValidationPipe({ transform: true })) // 自动验证和转换数据
  async sendMail(data: SendEmailWithUserDto): Promise<result> {
    let result: boolean;
    try {
      result = await this.emailService.sendMail(data);
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
          这封邮件是由${data.user.name}发出的, 
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

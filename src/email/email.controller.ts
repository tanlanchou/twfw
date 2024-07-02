// src/email/email.controller.ts
import {
  Controller,
  Get,
  Inject,
  Injectable,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EmailService } from './email.service';
import { SendEmailWithUserDto } from './send-email.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { title } from 'process';

@Controller('email')
@Injectable()
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    @Inject('MICROSERVICE_LOG_CLIENT') private readonly client: ClientProxy,
  ) {}

  @Get('test')
  async getHello(): Promise<string> {
    await firstValueFrom(
      this.client.send<object>(
        { cmd: 'addLog' },
        {
          operation: 'SEND_EMAIL',
          operator: 'test',
          platform: 'test',
          details: `test`,
          status: 'success',
        },
      ),
    );
    return 'hello';
  }

  @MessagePattern({ cmd: 'sendEmail' })
  @UsePipes(new ValidationPipe({ transform: true })) // 自动验证和转换数据
  async sendMail(data: SendEmailWithUserDto): Promise<boolean> {
    let result: boolean;
    try {
      result = await this.emailService.sendMail(data);
      return result;
    } catch (error) {
      return false;
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
          IP:${data.user.ip}`,
            status: result ? 'success' : 'failure',
          },
        ),
      );
      console.log('sendMail', data);
    }
  }
}

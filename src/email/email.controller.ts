// src/email/email.controller.ts
import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EmailService } from './email.service';
import { SendEmailWithUserDto } from './send-email.dto';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) { }

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
      console.log('sendMail', data);
    }
  }
}
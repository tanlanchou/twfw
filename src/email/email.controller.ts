import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EmailService } from './email.service';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @MessagePattern({ cmd: 'sendMail' })
  async sendMail(data: { to: string, text: string }): Promise<boolean> {
    return this.emailService.sendMail(data.to, data.text);
  }
}
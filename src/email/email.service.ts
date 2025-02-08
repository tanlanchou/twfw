import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '../common/config/config.service';
import { SendEmailWithUserDto } from '../common/dto/send.email.with.user.dto';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.configService.get('email').then((mailOptions) => {
      const mailConfigOptions = mailOptions.config;
      this.transporter = nodemailer.createTransport({
        service: mailConfigOptions.service,
        port: mailConfigOptions.port,
        secure: mailConfigOptions.secure,
        auth: {
          user: mailConfigOptions.user,
          pass: mailConfigOptions.pass,
        },
      });
    });
  }

  async sendMail(data: SendEmailWithUserDto): Promise<void> {
    const mailOptions = await this.configService.get('email');

    await this.transporter.sendMail({
      from: mailOptions.config.from,
      to: data.data.to,
      subject: data.data.subject,
      html: data.data.text,
    });
  }
}

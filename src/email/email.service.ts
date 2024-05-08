import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '../config/config.service';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: this.configService.get('email.service'),
      port: this.configService.get('email.port'),
      secure: this.configService.get('email.secure'),
      auth: {
        user: this.configService.get('email.user'),
        pass: this.configService.get('email.pass'),
      },
    });
  }

  async sendMail(to: string, subject: string, text: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get('email.from'),
        to,
        subject,
        text,
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
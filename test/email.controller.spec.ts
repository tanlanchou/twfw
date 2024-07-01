// src/email/email.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from '../src/email/email.controller';
import { EmailService } from '../src/email/email.service';
import { of } from 'rxjs';
import { SendEmailWithUserDto } from '../src/email/send-email.dto';

describe('EmailController', () => {
  let controller: EmailController;
  let emailService: EmailService;

  beforeEach(async () => {
    console.log(11111111111);
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [
        {
          provide: EmailService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        {
          provide: 'MICROSERVICE_LOG_CLIENT',
          useValue: {
            send: jest.fn(() => of({})),
          },
        },
      ],
    }).compile();

    controller = module.get<EmailController>(EmailController);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendMail', () => {
    it('should call sendMail method of EmailService', async () => {
      const sendMailDto: SendEmailWithUserDto = {
        user: {
          id: '1',
          name: 'Test User',
          platform: 'Test Platform',
          ip: '127.0.0.1',
        },
        data: {
          to: 'test@example.com',
          subject: 'Test Subject',
          text: 'Test Text',
        },
      };

      const sendMailSpy = jest
        .spyOn(emailService, 'sendMail')
        .mockResolvedValue(true);

      await controller.sendMail(sendMailDto);

      expect(sendMailSpy).toHaveBeenCalledWith(sendMailDto);
    });
  });
});

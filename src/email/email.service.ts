import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';

@Injectable()
export class EmailService {
  constructor(
    @InjectSendGrid() private sendGridClient: SendGridService,
    private configService: ConfigService,
  ) {}

  async sendVerifyEmail(email: string, verificationUrl: string) {
    return this.sendGridClient
      .send({
        to: email,
        from: {
          name: this.configService.get('EMAIL_NAME'),
          email: this.configService.get('FROM_EMAIL'),
        },
        templateId: this.configService.get('SENDGRID_VERIFY_EMAIL_TEMPLATE_ID'),
        dynamicTemplateData: { verificationUrl },
      })
      .then(() => {
        console.log('Send mail verify successfully!');
      })
      .catch((error) => {
        throw new ServiceUnavailableException(error.response);
      });
  }

  async sendForgetPasswordEmail(email: string, name: string, code: string) {
    return await this.sendGridClient
      .send({
        to: email,
        from: {
          name: process.env.EMAIL_NAME,
          email: process.env.FROM_EMAIL,
        },
        templateId: process.env.SENDGRID_RESET_PASSWORD_TEMPLATE_ID,
        dynamicTemplateData: { name, code },
      })
      .then(() => {
        console.log('Send email reset password successfully');
      })
      .catch((error) => {
        throw new ServiceUnavailableException(error);
      });
  }
}

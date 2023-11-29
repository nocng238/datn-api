import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private configService: ConfigService,
  ) {}
  private readonly logger = new Logger(EmailService.name);

  async sendMail(
    to: string,
    subject: string,
    html: string,
    context?: { [name: string]: unknown } | undefined,
  ): Promise<string> {
    const sender = process.env.SENDER;
    try {
      return await this.mailerService.sendMail({
        to,
        sender,
        subject,
        html,
        context,
      });
    } catch (e) {
      this.logger.error(e);
      throw new Error('Send email fail');
    }
  }

  async sendVerifyEmail(email: string, verificationUrl: string) {
    try {
      const sendMailResponse = await this.sendMail(
        email,
        'Petcare: Verify email',
        verificationUrl,
      );
      console.log(sendMailResponse);
      console.log('Send email reset password successfully');
    } catch (error) {
      console.log(error);
    }
  }

  async sendForgetPasswordEmail(email: string, name: string, code: string) {
    return this.sendMail(email, 'Petcare: Reset password', code);
  }
}

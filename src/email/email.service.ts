import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import {
  generateResetPasswordTemplate,
  generateVerifyEmailTemplate,
} from './templates';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private configService: ConfigService,
  ) {}
  private readonly logger = new Logger(EmailService.name);

  private async setTransport() {
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      this.configService.get('CLIENT_ID'),
      this.configService.get('CLIENT_SECRET'),
      'https://developers.google.com/oauthplayground',
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    const accessToken: string = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject('Failed to create access token');
        }
        resolve(token);
      });
    });

    const config = {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get('EMAIL'),
        clientId: this.configService.get('CLIENT_ID'),
        clientSecret: this.configService.get('CLIENT_SECRET'),
        accessToken,
      },
    };
    this.mailerService.addTransporter('gmail', config);
  }

  public async sendMail(to: string, subject: string, html: string) {
    await this.setTransport();
    this.mailerService
      .sendMail({
        transporterName: 'gmail',
        to,
        from: process.env.SENDER, // sender address
        subject,
        html,
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async sendVerifyEmail(email: string, verificationUrl: string) {
    try {
      const sendMailResponse = await this.sendMail(
        email,
        'Petcare: Verify email',
        generateVerifyEmailTemplate(verificationUrl),
      );
      console.log(sendMailResponse);
      console.log('Send email reset password successfully');
    } catch (error) {
      console.log(error);
    }
  }

  async sendForgetPasswordEmail(email: string, name: string, code: string) {
    return this.sendMail(
      email,
      'Petcare: Reset password',
      generateResetPasswordTemplate(name, code),
    );
  }
}

import * as aws from '@aws-sdk/client-ses';
import { SES } from '@aws-sdk/client-ses';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        return {
          transport: {
            SES: {
              ses: new SES({
                credentials: {
                  accessKeyId: process.env.ACCESS_KEY_ID,
                  secretAccessKey: process.env.SECRET_ACCESS_KEY,
                },
                region: process.env.REGION,
              }),
              aws,
            },
          },
        };
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}

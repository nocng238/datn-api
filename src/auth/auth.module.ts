import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/client/client.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { Doctor } from 'src/doctor/doctor.entity';
import { EmailModule } from 'src/email/email.module';
import { PaymentModule } from 'src/payment/payment.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { ImageModule } from 'src/image/image.module';

@Module({
  imports: [
    CloudinaryModule,
    TypeOrmModule.forFeature([Client, Doctor]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: parseInt(configService.get('JWT_TOKEN_EXPIRED_TIME')),
        },
      }),
    }),
    EmailModule,
    PaymentModule,
    ImageModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService],
  exports: [JwtStrategy],
})
export class AuthModule {}

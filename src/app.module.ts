import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment/appointment.entity';
import { AppointmentModule } from './appointment/appointment.module';
import { AuthModule } from './auth/auth.module';
import { Client } from './client/client.entity';
import { ClientModule } from './client/client.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ClientCreditCard } from './credit-card/client-credit-card.entity';
import { CreditCardModule } from './credit-card/credit-card.module';
import { DoctorCreditCard } from './credit-card/doctor-credit-card.entity';
import { DoctorAvailableTime } from './doctor-available-time/doctor-available-time.entity';
import { DoctorAvailableTimeModule } from './doctor-available-time/doctor-available-time.module';
import { Doctor } from './doctor/doctor.entity';
import { DoctorModule } from './doctor/doctor.module';
import { EmailModule } from './email/email.module';
import { Favorite } from './favorite/favorite.entity';
import { FavoriteModule } from './favorite/favorite.module';
import { PaymentModule } from './payment/payment.module';
import { Review } from './review/review.entity';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';
import { ImageModule } from './image/image.module';
import { dynamicImport } from './shared/utils/utils';

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
};

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          entities: [
            Appointment,
            Doctor,
            Client,
            DoctorAvailableTime,
            Favorite,
            Review,
            ClientCreditCard,
            DoctorCreditCard,
          ],
          synchronize: true,
          url: `${
            configService.get('DB_URL') || 'postgres'
          }://${configService.get('DB_USERNAME')}:${configService.get(
            'DB_PASSWORD',
          )}@${configService.get('DB_HOST')}:${configService.get(
            'DB_PORT',
          )}/${configService.get('DB_DATABASE')}`,
          keepConnectionAlive: true,
          logging: false,
        };
      },
    }),
    dynamicImport('@adminjs/nestjs').then(({ AdminModule }) =>
      AdminModule.createAdminAsync({
        useFactory: () => ({
          adminJsOptions: {
            rootPath: '/admin',
            resources: [
              Appointment,
              Doctor,
              Client,
              DoctorAvailableTime,
              Favorite,
              Review,
              ClientCreditCard,
              DoctorCreditCard,
            ],
          },
          auth: {
            authenticate,
            cookieName: 'adminjs',
            cookiePassword: 'secret',
          },
          sessionOptions: {
            resave: true,
            saveUninitialized: true,
            secret: 'secret',
          },
        }),
      }),
    ),
    ClientModule,
    DoctorModule,
    AppointmentModule,
    ReviewModule,
    DoctorAvailableTimeModule,
    FavoriteModule,
    AuthModule,
    UserModule,
    CreditCardModule,
    EmailModule,
    CloudinaryModule,
    PaymentModule,
    ImageModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment/appointment.entity';
import { AppointmentModule } from './appointment/appointment.module';
import { AuthModule } from './auth/auth.module';
import { Client } from './client/client.entity';
import { ClientModule } from './client/client.module';
import { DoctorAvailableTime } from './doctor-available-time/doctor-available-time.entity';
import { DoctorAvailableTimeModule } from './doctor-available-time/doctor-available-time.module';
import { Doctor } from './doctor/doctor.entity';
import { DoctorModule } from './doctor/doctor.module';
import { Favorite } from './favorite/favorite.entity';
import { FavoriteModule } from './favorite/favorite.module';
import { Review } from './review/review.entity';
import { ReviewModule } from './review/review.module';

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
        };
      },
    }),
    ClientModule,
    DoctorModule,
    AppointmentModule,
    ReviewModule,
    DoctorAvailableTimeModule,
    FavoriteModule,
    AuthModule,
  ],
})
export class AppModule {}

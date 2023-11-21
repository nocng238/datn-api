import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientModule } from './client/client.module';
import { DoctorModule } from './doctor/doctor.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ReviewModule } from './review/review.module';
import { DoctorAvailableTimeModule } from './doctor-available-time/doctor-available-time.module';
import { FavoriteModule } from './favorite/favorite.module';
import { Appointment } from './appointment/appointment.entity';
import { Doctor } from './doctor/doctor.entity';
import { Client } from './client/client.entity';
import { DoctorAvailableTime } from './doctor-available-time/doctor-available-time.entity';
import { Favorite } from './favorite/favorite.entity';
import { Review } from './review/review.entity';

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
          url: `postgres://${configService.get(
            'DB_USERNAME',
          )}:${configService.get('DB_PASSWORD')}@${configService.get(
            'DB_HOST',
          )}:${configService.get('DB_PORT')}/${configService.get(
            'DB_DATABASE',
          )}`,
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
  ],
})
export class AppModule {}

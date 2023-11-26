import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentController } from './appointment.controller';
import { Appointment } from './appointment.entity';
import { AppointmentService } from './appointment.service';
import { Doctor } from 'src/doctor/doctor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Doctor])],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}

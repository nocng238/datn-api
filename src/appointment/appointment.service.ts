import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppoitmentDto } from './dto/create.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async createAppoitment(
    clientId: string,
    createAppointmentDto: CreateAppoitmentDto,
  ): Promise<Appointment> {
    const createdAppointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      clientId,
    });
    return this.appointmentRepository.save(createdAppointment);
  }
}

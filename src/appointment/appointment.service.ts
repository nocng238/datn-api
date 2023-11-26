import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppoitmentDto } from './dto/create.dto';
import { Doctor } from 'src/doctor/doctor.entity';
@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async createAppoitment(
    clientId: string,
    createAppointmentDto: CreateAppoitmentDto,
  ): Promise<Appointment> {
    console.log('CreateAppoitmentDto: ', createAppointmentDto);

    const doctor = await this.doctorRepository.findOneBy({
      id: createAppointmentDto.doctorId,
    });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    const createdAppointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      clientId,
      totalPrice: doctor.feePerHour,
    });
    return this.appointmentRepository.save(createdAppointment);
  }
}

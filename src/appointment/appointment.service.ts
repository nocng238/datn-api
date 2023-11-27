import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/client/client.entity';
import { Doctor } from 'src/doctor/doctor.entity';
import { AppointmentStatusEnum } from 'src/shared';
import { PaginationRequestDto } from 'src/shared/dto/pagination.request.dto';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppoitmentDto } from './dto/create.dto';
import { SearchAppointmentDto } from './dto/search.dto';
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

  async approveAppointment(id: string) {
    await this.appointmentRepository.update(
      { id },
      { status: AppointmentStatusEnum.APPROVED },
    );
  }

  async searchAppointments(
    user: Client | Doctor,
    searchAppointmentDto: SearchAppointmentDto,
    paginationRequestdto: PaginationRequestDto,
  ) {
    const { search, paymentStatus, status } = searchAppointmentDto;
    const { limit, offset } = paginationRequestdto;
    const queryBuilder = this.appointmentRepository.createQueryBuilder('app');
    if (user.isDoctor) {
      queryBuilder.leftJoinAndSelect('app.client', 'client');
      queryBuilder.where('app.doctor_id = :doctorId', { doctorId: user.id });
      if (search) {
        queryBuilder.andWhere(
          'client.email ilike :search OR client.fullname ilike :search',
          { search: `%${search}%` },
        );
      }
      if (paymentStatus) {
        queryBuilder.andWhere('app.payment_status = :paymentStatus', {
          paymentStatus,
        });
      }
      if (status) {
        queryBuilder.andWhere('app.status = :status', {
          status,
        });
      }
    } else {
      queryBuilder.leftJoinAndSelect('app.doctor', 'doctor');
      queryBuilder.where('app.client_id = :clientId', { clientId: user.id });
      if (search) {
        queryBuilder.andWhere(
          'doctor.email ilike :search OR doctor.fullname ilike :search',
          { search: `%${search}%` },
        );
      }
    }
    queryBuilder.limit(limit).offset(offset);
    let items: Appointment[] = [];
    const [appointments, count] = await queryBuilder.getManyAndCount();
    items = items.concat(appointments);
    const meta = {
      totalItems: count,
      itemCount: items.length,
      limit: +limit,
      offset: +offset,
    };
    return { items, meta };
  }
}

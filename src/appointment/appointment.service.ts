import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/client/client.entity';
import { Doctor } from 'src/doctor/doctor.entity';
import { EmailService } from 'src/email/email.service';
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
    private readonly emailService: EmailService,
  ) {}

  async createAppoitment(
    client: Client | Doctor,
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
      client,
      totalPrice: doctor.feePerHour,
    });
    const newAppointment = await this.appointmentRepository.save(
      createdAppointment,
    );
    const payloadEmail: {
      idAppointment: string;
      clientName: string;
      clientEmail: string;
      startTime: Date;
      endTime: Date;
      note: string;
    } = {
      idAppointment: newAppointment.id,
      clientName: client.fullname,
      clientEmail: client.email,
      startTime: newAppointment.startTime,
      endTime: newAppointment.endTime,
      note: newAppointment.note,
    };
    await this.emailService.sendEmailForDoctorHasANewAppointment(
      doctor.email,
      payloadEmail,
    );
    return newAppointment;
  }

  async approveAppointment(id: string) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['client', 'doctor'],
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    if (appointment.status !== AppointmentStatusEnum.PENDING) {
      throw new BadRequestException('Only able to approve Pending appointment');
    }
    await this.appointmentRepository.update(
      { id: appointment.id },
      { status: AppointmentStatusEnum.APPROVED },
    );
    await this.emailService.sendEmailForClientIfDoctorApproveAppointment(
      appointment.client.email,
      {
        doctorName: appointment.doctor.fullname,
        endTime: appointment.endTime,
        startTime: appointment.startTime,
      },
    );
  }

  async cancelAppointment(id: string, reason: string) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['client', 'doctor'],
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    await this.appointmentRepository.update(
      { id: appointment.id },
      { status: AppointmentStatusEnum.CANCEL },
    );
    await this.emailService.sendEmailForClientIfDoctorCancelAppointment(
      appointment.client.email,
      {
        reason,
        doctorName: appointment.doctor.fullname,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
      },
    );
  }

  async rejectAppointment(id: string, reason: string) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['client', 'doctor'],
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    await this.appointmentRepository.update(
      { id: appointment.id },
      { status: AppointmentStatusEnum.REJECTED },
    );
    await this.emailService.sendMailRejectedToClient(appointment.client.email, {
      reason,
      doctorName: appointment.doctor.fullname,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
    });
  }

  async finishAppointment(id: string) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['client', 'doctor'],
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    await this.appointmentRepository.update(
      { id: appointment.id },
      { status: AppointmentStatusEnum.FINISHED },
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

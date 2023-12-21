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
import { CreateDoctorNote } from './dto/doctor-note.dto';
import { MarkAbsentDto } from './dto/mark-absent.dto';
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
    try {
      await this.emailService.sendEmailForDoctorHasANewAppointment(
        doctor.email,
        payloadEmail,
      );
    } catch (err) {
      console.error('Error sendEmailForDoctorHasANewAppointment ', {
        cause: err,
      });
    }
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
      { status: AppointmentStatusEnum.APPROVED, statusUpdatedAt: new Date() },
    );
    try {
      await this.emailService.sendEmailForClientIfDoctorApproveAppointment(
        appointment.client.email,
        {
          doctorName: appointment.doctor.fullname,
          endTime: appointment.endTime,
          startTime: appointment.startTime,
        },
      );
    } catch (err) {
      console.error('Error sendEmailForClientIfDoctorApproveAppointment ', {
        cause: err,
      });
    }
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
      { status: AppointmentStatusEnum.CANCEL, statusUpdatedAt: new Date() },
    );
    try {
      await this.emailService.sendEmailForClientIfDoctorCancelAppointment(
        appointment.client.email,
        {
          reason,
          doctorName: appointment.doctor.fullname,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
        },
      );
    } catch (err) {
      console.error('Error sendEmailForClientIfDoctorCancelAppointment ', {
        cause: err,
      });
    }
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
      { status: AppointmentStatusEnum.REJECTED, statusUpdatedAt: new Date() },
    );
    try {
      await this.emailService.sendMailRejectedToClient(
        appointment.client.email,
        {
          reason,
          doctorName: appointment.doctor.fullname,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
        },
      );
    } catch (err) {
      console.error('Error sendMailRejectedToClient ', {
        cause: err,
      });
    }
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
      { status: AppointmentStatusEnum.FINISHED, statusUpdatedAt: new Date() },
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
      // queryBuilder.leftJoinAndSelect('app.review', 'review');
      queryBuilder.where('app.client_id = :clientId', { clientId: user.id });
      if (search) {
        queryBuilder.andWhere(
          'doctor.email ilike :search OR doctor.fullname ilike :search',
          { search: `%${search}%` },
        );
      }
    }
    queryBuilder.orderBy('app.start_time', 'ASC');
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

  async rejectApmarkAppoinmentAsAbsentointment(
    id: string,
    markAbsentDto: MarkAbsentDto,
  ) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['client', 'doctor'],
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    if (appointment.startTime > markAbsentDto.currentTime) {
      throw new BadRequestException(`It's not time yet`);
    }
    return this.appointmentRepository.update(
      { id: appointment.id },
      { status: AppointmentStatusEnum.ABSENT, statusUpdatedAt: new Date() },
    );
  }

  async getChart(doctorId: string, month: number) {
    const data = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.doctor_id = :doctorId', {
        doctorId,
      })
      .andWhere(
        `to_char(appointment.start_time, 'MM') = :month OR to_char(appointment.end_time, 'MM') = :month`,
        {
          month,
        },
      )
      .getMany();
    const chartData = this.countByStatus(data);
    const keys = Object.keys(AppointmentStatusEnum);
    const chart2 = [];
    keys.forEach((key) => {
      chart2.push(chartData[key] || 0);
    });
    return chart2;
  }
  countByStatus(appointments: Appointment[]) {
    return appointments.reduce((counts, appointment) => {
      const key = appointment.status;
      if (!counts[key]) {
        counts[key] = 0;
      }
      counts[key]++;
      return counts;
    }, {});
  }

  async createDoctorNote(id: string, createDoctorNote: CreateDoctorNote) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    const { note } = createDoctorNote;
    await this.appointmentRepository.update(
      { id: appointment.id },
      { doctorNote: note, doctorNoteUpdatedAt: new Date() },
    );
  }
}

import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/client/client.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { AppointmentStatusEnum, PaymentStatusEnum } from 'src/shared';
import { PaginationRequestDto } from 'src/shared/dto/pagination.request.dto';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';
import { FindDoctor } from './dto/find.dto';
import { UpdateDoctorDto } from './dto/update.dto';
import { getRandomInt } from 'src/shared/utils/utils';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    private cloudinary: CloudinaryService,
  ) {}

  async getListDoctors(
    findDoctor: FindDoctor,
    paginationRequestdto: PaginationRequestDto,
  ) {
    const { search, address, endTime, startTime } = findDoctor;
    const { limit, offset } = paginationRequestdto;
    const queryBuilder = this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.appointments', 'appointments')
      .leftJoinAndSelect('appointments.client', 'client')
      .leftJoinAndSelect('appointments.review', 'review');
    if (search) {
      queryBuilder.andWhere(
        'doctor.email ilike :email OR doctor.fullname ilike :fullname',
        {
          email: `%${search}%`,
          fullname: `%${search}%`,
        },
      );
    }
    if (address) {
      queryBuilder.andWhere('doctor.address ilike :address', {
        address: `%${address}%`,
      });
    }

    if (startTime && endTime) {
      // startTime always <= endTime no need to handle unhappy case
      queryBuilder.andWhere(
        `NOT EXISTS (select from appointment where appointment.doctor_id = doctor.id 
          AND (
            (appointment.start_time <= :startTime AND appointment.end_time >= :endTime ) 
            OR (appointment.start_time >= :startTime AND appointment.start_time < :endTime)
            OR (appointment.end_time > :startTime AND appointment.end_time <= :endTime)
          )
          AND appointment.status != :cancel AND appointment.status != :rejected AND appointment.status != :finished
        )`,
        {
          startTime,
          endTime,
          cancel: AppointmentStatusEnum.CANCEL,
          rejected: AppointmentStatusEnum.REJECTED,
          finished: AppointmentStatusEnum.FINISHED,
        },
      );
    }
    queryBuilder.limit(limit).offset(offset);
    let items: Doctor[] = [];
    const [doctors, count] = await queryBuilder.getManyAndCount();
    items = items.concat(doctors);
    items = items.map((item) => ({
      ...item,
      reviews: item.appointments
        .filter((appointment) => appointment.reviewId)
        .map((appointment) => ({
          appointmentId: appointment.id,
          review: appointment.review,
          client: appointment.client,
        })),
      averageRating:
        item.appointments.reduce(
          (total, next) => total + (next.review ? next.review.rating : 0),
          0,
        ) /
        item.appointments.filter((appointment) => appointment.review !== null)
          .length,
    }));
    const meta = {
      totalItems: count,
      itemCount: items.length,
      limit: +limit,
      offset: +offset,
    };
    return { items, meta };
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto) {
    const doctor = await this.doctorRepository.findOneBy({ id });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    await this.doctorRepository.update({ id }, updateDoctorDto);
    return { ...doctor, ...updateDoctorDto };
  }

  async uploadCV(user: Client | Doctor, file: Express.Multer.File) {
    const uploadPDF = await this.cloudinary
      .uploadFile(file)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        throw new ServiceUnavailableException(error);
      });
    return uploadPDF.secure_url;
  }

  async getRevenueChart(doctorId: string) {
    const result = [];
    const doctor = await this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.appointments', 'appointments')
      .where('doctor.id = :doctorId', { doctorId })
      .getOne();
    const { appointments } = doctor;
    for (let i = 0; i < 12; i++) {
      result.push({
        month: i,
        revenue:
          appointments.filter(
            (appointment) =>
              new Date(appointment.startTime).getMonth() === i &&
              appointment.paymentStatus === PaymentStatusEnum.PAID &&
              appointment.status === AppointmentStatusEnum.FINISHED,
          ).length * doctor.feePerHour || getRandomInt(100, 500),
      });
    }
    return result;
  }
}

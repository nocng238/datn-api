import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/client/client.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PaginationRequestDto } from 'src/shared/dto/pagination.request.dto';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';
import { FindDoctor } from './dto/find.dto';
import { UpdateDoctorDto } from './dto/update.dto';
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
    const queryBuilder = this.doctorRepository.createQueryBuilder('doctor');
    if (search) {
      queryBuilder
        .where('doctor.email ilike :email', { email: `%${search}%` })
        .orWhere('doctor.fullname ilike :fullname', {
          fullname: `%${search}%`,
        });
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
        )`,
        {
          startTime,
          endTime,
        },
      );
    }
    queryBuilder.limit(limit).offset(offset);
    let items: Doctor[] = [];
    const [doctors, count] = await queryBuilder.getManyAndCount();
    items = items.concat(doctors);
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
    await this.doctorRepository.update({ id: user.id }, { cv: uploadPDF.url });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';
import { FindDoctor } from './dto/find.dto';
import { UpdateDoctorDto } from './dto/update.dto';
@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async getListDoctors(findDoctor: FindDoctor) {
    const { search, address, endTime, startTime } = findDoctor;
    const builder = this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.appointments', 'appointments');
    if (search) {
      builder
        .where('doctor.email ilike :email', { email: `%${search}%` })
        .orWhere('doctor.fullname ilike :fullname', {
          fullname: `%${search}%`,
        });
    }
    if (address) {
      builder.andWhere('doctor.address ilike :address', {
        address: `%${address}%`,
      });
    }

    if (startTime && endTime) {
      // startTime always <= endTime no need to handle unhappy case
      builder.andWhere(
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
    return builder.getMany();
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto) {
    const doctor = await this.doctorRepository.findOneBy({ id });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    await this.doctorRepository.update({ id }, updateDoctorDto);
    return { ...doctor, ...updateDoctorDto };
  }
}

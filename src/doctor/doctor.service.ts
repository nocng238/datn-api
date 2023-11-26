import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/appointment/appointment.entity';
import { Brackets, Repository } from 'typeorm';
import { Doctor } from './doctor.entity';
import { FindDoctor } from './dto/find.dto';
import { UpdateDoctorDto } from './dto/update.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Appointment)
    private appoinmentRepository: Repository<Appointment>,
  ) {}

  async getListDoctors(findDoctor: FindDoctor) {
    const { search, address, endTime, startTime } = findDoctor;
    const builder = this.doctorRepository.createQueryBuilder('doctor');
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

    const doctors = await builder.getMany();
    const appointments = doctors.map((doctor) => {
      return this.appoinmentRepository.findBy({ doctor });
    });
    // .flat(1);
    if (startTime && endTime) {
      // startTime always <= endTime no need to handle not happy case
      builder.andWhere(
        new Brackets((qb) => {
          qb.where(
            'appointments.start_time <= :startTime AND appointments.end_time <= :startTime',
            {
              startTime,
            },
          ).orWhere(
            'appointments.start_time >= :endTime AND appointments.end_time <= :endTime',
            {
              endTime,
            },
          );
        }),
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
    return { id, ...updateDoctorDto };
  }
}

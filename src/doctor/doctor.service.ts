import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Client } from 'src/client/client.entity';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';
import { DoctorRegisterDto } from './dto/doctor-register.dto';
import { FindDoctor } from './dto/find.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async register(registerDto: DoctorRegisterDto): Promise<Doctor> {
    const salt = await bcrypt.genSalt();
    const { password } = registerDto;
    let { email } = registerDto;
    const hashedPassword = await bcrypt.hash(password, salt);
    email = email.trim();
    let user: Client | Doctor = null;
    const client = await this.clientRepository.findOneBy({ email });
    const doctor = await this.doctorRepository.findOneBy({ email });
    if (client) {
      user = client;
    } else if (doctor) {
      user = doctor;
    }
    if (user) {
      throw new ConflictException('Email elready exists');
    }
    const createdDoctor = this.doctorRepository.create({
      ...registerDto,
      email,
      password: hashedPassword,
    });
    return this.doctorRepository.save(createdDoctor);
  }

  async getListDoctors(findDoctor: FindDoctor) {
    const { email, fullname, city, endTime, startTime } = findDoctor;
    const builder = this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect(
        'doctor.doctor_available_time',
        'doctor_available_time',
      );
    if (email) {
      builder.where('doctor.email ilike :email', { email: `%${email}%` });
    }
    if (fullname) {
      builder.andWhere('doctor.fullname ilike :email', {
        fullname: `%${fullname}%`,
      });
    }
    if (city) {
      builder.andWhere('doctor.city ilike :city', {
        city: `%${city}%`,
      });
    }
    if (startTime && endTime) {
      builder.andWhere(
        'doctor_available_time.start_time >= :startTime AND doctor_available_time.end_time <= :endTime',
        {
          startTime,
          endTime,
        },
      );
    }
    return builder.getMany();
  }
}

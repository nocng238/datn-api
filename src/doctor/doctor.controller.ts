import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Client } from 'src/client/client.entity';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';

@Controller('doctor')
export class DoctorController {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  @Post('register')
  async register(
    @Body()
    registerDto: {
      fullname: string;
      email: string;
      password: string;
      phone: string;
      workplace?: string;
    },
  ): Promise<Client> {
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
}

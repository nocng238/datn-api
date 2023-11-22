import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Doctor } from 'src/doctor/doctor.entity';
import { Repository } from 'typeorm';
import { Client } from './client.entity';

@Controller('client')
export class ClientController {
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
      phone?: string;
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
    const createdClient = this.clientRepository.create({
      ...registerDto,
      email,
      password: hashedPassword,
    });
    return this.clientRepository.save(createdClient);
  }
}

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ClientRegisterDto } from 'src/auth/dto/client-register.dto';
import { DoctorRegisterDto } from 'src/auth/dto/doctor-register.dto';
import { Client } from 'src/client/client.entity';
import { Doctor } from 'src/doctor/doctor.entity';
import { StatusEnum } from 'src/shared';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService implements OnModuleInit {
  logger = new Logger(SeedService.name);
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}
  async onModuleInit() {
    await this.seedData();
  }

  async seedData() {
    await this.seedUsers();
  }

  async seedUsers() {
    const password = 'abcdef';
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const client1Dto = {
      status: StatusEnum.VERIFY,
      fullname: 'Client 1',
      email: 'client1@email.com',
      password: hashedPassword,
    };
    const client2Dto = {
      status: StatusEnum.VERIFY,
      fullname: 'Client 2',
      email: 'client2@email.com',
      password: hashedPassword,
    };
    const doctor1Dto = {
      status: StatusEnum.VERIFY,
      fullname: 'Doctor 1',
      email: 'doctor1@email.com',
      password: hashedPassword,
      phone: '123456789',
    };
    const doctor2Dto = {
      status: StatusEnum.VERIFY,
      fullname: 'Doctor 2',
      email: 'doctor2@email.com',
      password: hashedPassword,
      phone: '123456789',
    };
    await this.saveClientIfNotExisting([client1Dto, client2Dto]);
    await this.saveDoctorIfNotExisting([doctor1Dto, doctor2Dto]);
    this.logger.log('Seed users data');
    const array = [client1Dto, client2Dto, doctor1Dto, doctor2Dto];
    for (const element of array) {
      this.logger.log('Email: ' + element.email);
    }
    this.logger.log('Password: ' + password);
  }

  async saveClientIfNotExisting(users: ClientRegisterDto[] | undefined[]) {
    for (const user of users) {
      const client = await this.clientRepository.findOneBy({
        email: user.email,
      });
      if (!client) {
        await this.clientRepository.save(user);
      }
    }
  }

  async saveDoctorIfNotExisting(users: DoctorRegisterDto[] | undefined[]) {
    for (const user of users) {
      const doctor = await this.doctorRepository.findOneBy({
        email: user.email,
      });
      if (!doctor) {
        await this.doctorRepository.save(user);
      }
    }
  }
}

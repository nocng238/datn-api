import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Client } from 'src/client/client.entity';
import { Doctor } from 'src/doctor/doctor.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from './jwt.payload';

@Controller()
export class AuthController {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() credentials: { email: string; password: string }) {
    let { email } = credentials;
    const { password } = credentials;
    email = email.trim();
    let user: Client | Doctor = null;
    let isDoctor = false;
    const client = await this.clientRepository.findOneBy({ email });
    const doctor = await this.doctorRepository.findOneBy({ email });
    if (client) {
      user = client;
    } else if (doctor) {
      user = doctor;
      isDoctor = true;
    } else {
      throw new UnauthorizedException('User not found');
    }
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Email or password is incorrect');
    }

    const payload: JwtPayload = {
      email,
      id: user.id,
      phone: user.phone ? user.phone : null,
      isDoctor,
      fullname: user.fullname ? user.fullname : null,
      address: user.address ? user.address : null,
      sex: user.sex ? user.sex : null,
      status: user.status ? user.status : null,
    };
    const accessToken: string = this.jwtService.sign(payload);
    return {
      accessToken,
    };
  }
}

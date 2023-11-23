import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Client } from 'src/client/client.entity';
import { DoctorService } from './doctor.service';
import { DoctorRegisterDto } from './dto/doctor-register.dto';
import { FindDoctor } from './dto/find.dto';

@Controller('doctor')
export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  @Post('register')
  async register(
    @Body()
    registerDto: DoctorRegisterDto,
  ): Promise<Client> {
    return this.doctorService.register(registerDto);
  }

  @Get()
  async getListDoctors(@Query() findDoctor: FindDoctor) {
    return this.doctorService.getListDoctors(findDoctor);
  }
}

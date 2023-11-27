import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DoctorService } from './doctor.service';
import { FindDoctor } from './dto/find.dto';

@Controller('doctor')
@UseGuards(JwtAuthGuard)
export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  @Get()
  async getListDoctors(@Query() findDoctor: FindDoctor) {
    return this.doctorService.getListDoctors(findDoctor);
  }
}

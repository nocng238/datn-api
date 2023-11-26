import { Controller, Get, Query } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { FindDoctor } from './dto/find.dto';

@Controller('doctor')
export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  @Get()
  async getListDoctors(@Query() findDoctor: FindDoctor) {
    return this.doctorService.getListDoctors(findDoctor);
  }
}

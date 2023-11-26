import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/user-decorator';
import { Client } from 'src/client/client.entity';
import { Doctor } from 'src/doctor/doctor.entity';
import { AppointmentService } from './appointment.service';
import { CreateAppoitmentDto } from './dto/create.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createAppoitment(
    @GetUser() user: Client | Doctor,
    @Body() createAppointmentDto: CreateAppoitmentDto,
  ) {
    if (user.isDoctor) {
      throw new ForbiddenException('Not allow doctor');
    }
    const clientId = user.id;
    return this.appointmentService.createAppoitment(
      clientId,
      createAppointmentDto,
    );
  }
}

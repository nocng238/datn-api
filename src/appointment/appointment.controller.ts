import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/user-decorator';
import { Client } from 'src/client/client.entity';
import { Doctor } from 'src/doctor/doctor.entity';
import { PaginationRequestDto } from 'src/shared/dto/pagination.request.dto';
import { AppointmentService } from './appointment.service';
import { CreateAppoitmentDto } from './dto/create.dto';
import { SearchAppointmentDto } from './dto/search.dto';

@Controller('appointment')
@UseGuards(JwtAuthGuard)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
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

  @Put('/approve/:id')
  async approveAppointment(
    @GetUser() user: Client | Doctor,
    @Param('id') id: string,
  ) {
    if (!user.isDoctor) {
      throw new ForbiddenException('Not allow client');
    }
    return this.appointmentService.approveAppointment(id);
  }

  @Get()
  async searchAppointments(
    @GetUser() user: Client | Doctor,
    @Query() searchAppointmentDto: SearchAppointmentDto,
    @Query() paginationRequestdto: PaginationRequestDto,
  ) {
    return this.appointmentService.searchAppointments(
      user,
      searchAppointmentDto,
      paginationRequestdto,
    );
  }
}

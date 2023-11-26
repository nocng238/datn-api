import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/user-decorator';
import { Client } from 'src/client/client.entity';
import { ClientService } from 'src/client/client.service';
import { UpdateClientDto } from 'src/client/dto/update.dto';
import { Doctor } from 'src/doctor/doctor.entity';
import { DoctorService } from 'src/doctor/doctor.service';
import { UpdateDoctorDto } from 'src/doctor/dto/update.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly clientService: ClientService,
    private readonly doctorService: DoctorService,
  ) {}
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@GetUser() user: Client | Doctor) {
    const {
      registerVerifyingToken,
      resetPasswordCode,
      resetPasswordCodeExpiry,
      password,
      createdAt,
      updatedAt,
      ...restParams
    } = user;
    return restParams;
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  updateUser(
    @GetUser() user: Client | Doctor,
    @Body() payload: UpdateClientDto | UpdateDoctorDto,
  ) {
    if (!user.isDoctor) {
      return this.clientService.update(user.id, payload);
    } else {
      return this.doctorService.update(user.id, payload as UpdateDoctorDto);
    }
  }
}

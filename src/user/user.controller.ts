import { Controller, Get, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/user-decorator';
import { Client } from 'src/client/client.entity';
import { ClientService } from 'src/client/client.service';
import { Doctor } from 'src/doctor/doctor.entity';
import { DoctorService } from 'src/doctor/doctor.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly clientService: ClientService,
    private readonly doctorService: DoctorService,
  ) {}
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@GetUser() user: Client | Doctor) {
    return user;
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  updateUser(@GetUser() user: Client | Doctor) {
    if (!user.isDoctor) {
      return this.clientService.update(user.id, { ...user });
    } else {
      return this.doctorService.update(user.id, { ...user });
    }
  }
}

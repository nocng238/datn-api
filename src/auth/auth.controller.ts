import { Body, Controller, Post } from '@nestjs/common';
import { Client } from 'src/client/client.entity';
import { Doctor } from 'src/doctor/doctor.entity';
import { AuthService } from './auth.service';
import { ClientRegisterDto } from './dto/client-register.dto';
import { Credentials } from './dto/credentials.dto';
import { DoctorRegisterDto } from './dto/doctor-register.dto';
import { VerifyEmailRequestParamDto } from './dto/token-request-param.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/login')
  async login(@Body() credentials: Credentials) {
    return this.authService.login(credentials);
  }

  @Post('client/register')
  async clientRegister(
    @Body()
    registerDto: ClientRegisterDto,
  ): Promise<Client> {
    return this.authService.clientRegister(registerDto);
  }

  @Post('doctor/register')
  async DoctorRegister(
    @Body()
    registerDto: DoctorRegisterDto,
  ): Promise<Doctor> {
    return this.authService.doctorRegister(registerDto);
  }

  @Post('auth/verify-email')
  async verifyEmail(
    @Body() verifyEmailRequestParamDto: VerifyEmailRequestParamDto,
  ) {
    return this.authService.verifyEmail(verifyEmailRequestParamDto);
  }
}

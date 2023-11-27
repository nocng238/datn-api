import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Client } from 'src/client/client.entity';
import { Doctor } from 'src/doctor/doctor.entity';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ClientRegisterDto } from './dto/client-register.dto';
import { Credentials } from './dto/credentials.dto';
import { DoctorRegisterDto } from './dto/doctor-register.dto';
import { ForgetPasswordRequestDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailRequestParamDto } from './dto/token-request-param.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from './user-decorator';

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

  @Post('forget-password')
  async forgetPassword(
    @Body() forgetPasswordRequestDto: ForgetPasswordRequestDto,
  ) {
    return this.authService.forgetPassword(forgetPasswordRequestDto);
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @GetUser() user: Client | Doctor,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user, changePasswordDto);
  }
}

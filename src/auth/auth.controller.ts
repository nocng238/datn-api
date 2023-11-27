import {
  Body,
  Controller,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Client } from 'src/client/client.entity';
import { Doctor } from 'src/doctor/doctor.entity';
import { imageUploadOptions } from 'src/shared/utils/utils';
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

  @Put('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @GetUser() user: Client | Doctor,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user, changePasswordDto);
  }

  @Post('/upload-avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', imageUploadOptions))
  async uploadAvatar(
    @GetUser() user: Client | Doctor,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authService.uploadAvatar(user, file);
  }
}

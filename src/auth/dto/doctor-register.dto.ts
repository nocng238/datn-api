import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DoctorRegisterDto {
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  workplace?: string;
}

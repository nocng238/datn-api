import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ClientRegisterDto {
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  address?: string;
}

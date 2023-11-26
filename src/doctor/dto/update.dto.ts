import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateDoctorDto {
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  workplace?: string;
}

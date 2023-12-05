import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDoctorDto {
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  workplace?: string;

  @IsNumber()
  feePerHour: number;

  @IsString()
  sex?: string;
}

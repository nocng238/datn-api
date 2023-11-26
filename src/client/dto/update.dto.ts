import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateClientDto {
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  address?: string;
}

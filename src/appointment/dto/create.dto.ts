import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateAppoitmentDto {
  @IsUUID()
  doctorId: string;

  @IsDateString()
  startTime: Date;

  @IsDateString()
  endTime: Date;

  @IsOptional()
  note?: string;
}

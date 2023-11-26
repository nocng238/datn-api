import { IsDate, IsOptional, IsUUID } from 'class-validator';

export class CreateAppoitmentDto {
  @IsUUID()
  doctorId: string;

  @IsDate()
  timeStart: Date;

  @IsDate()
  timeEnd: Date;

  @IsOptional()
  note?: string;
}

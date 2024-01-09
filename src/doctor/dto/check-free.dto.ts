import { IsDateString } from 'class-validator';

export class CheckDoctorFree {
  @IsDateString()
  startTime: Date;

  @IsDateString()
  endTime: Date;
}

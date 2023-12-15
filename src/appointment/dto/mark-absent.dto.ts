import { IsDateString } from 'class-validator';

export class MarkAbsentDto {
  @IsDateString()
  currentTime: Date;
}

import { IsDateString, IsOptional } from 'class-validator';

export class FindDoctor {
  search: string;

  @IsDateString()
  @IsOptional()
  startTime: Date;

  @IsDateString()
  @IsOptional()
  endTime: Date;

  address: string;

  limit: number;

  offset: number;
}

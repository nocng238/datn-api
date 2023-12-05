import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  appointmentId: string;

  @IsInt()
  @Max(5)
  @Min(1)
  rating: number;

  @IsString()
  @IsOptional()
  feedback?: string;
}

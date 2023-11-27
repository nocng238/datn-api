import { IsDateString, IsInt } from 'class-validator';

export class AddCreditCardDto {
  @IsInt()
  creditNumber: number;

  @IsDateString()
  expiredTime: Date;
}

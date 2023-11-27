import { IsDateString, IsNumberString } from 'class-validator';

export class AddCreditCardDto {
  @IsNumberString()
  creditNumber: string;

  @IsDateString()
  expiredTime: Date;
}

import { IsDate, IsInt } from 'class-validator';

export class AddCreditCardDto {
  @IsInt()
  creditNumber: number;

  @IsDate()
  expiredTime: Date;
}

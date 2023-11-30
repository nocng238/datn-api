import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';

export class AddCreditCardDto {
  @IsNumberString()
  creditNumber: string;

  @IsDateString()
  expiredTime: Date;

  @IsInt()
  cvc: number;

  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;
}

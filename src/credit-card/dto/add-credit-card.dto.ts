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

  @IsInt()
  expiredYear: Date;

  @IsInt()
  expiredMonth: number;

  @IsString()
  brand: string;

  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;
}

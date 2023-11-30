import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';
import { CreditCardBrand } from 'src/shared';

export class AddCreditCardDto {
  @IsNumberString()
  creditNumber: string;

  @IsInt()
  expiredYear: Date;

  @IsInt()
  expiredMonth: number;

  @IsString()
  brand: CreditCardBrand;

  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;
}

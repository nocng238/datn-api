import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PaymentMethodEnum } from 'src/shared';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  appointmentId: string;

  @IsEnum(PaymentMethodEnum)
  paymentMethod: PaymentMethodEnum;
}

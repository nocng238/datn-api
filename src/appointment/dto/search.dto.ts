import { IsEnum, IsOptional } from 'class-validator';
import { AppointmentStatusEnum, PaymentStatusEnum } from 'src/shared';

export class SearchAppointmentDto {
  @IsOptional()
  search: string;

  @IsOptional()
  @IsEnum(AppointmentStatusEnum)
  status: AppointmentStatusEnum;

  @IsOptional()
  @IsEnum(PaymentStatusEnum)
  paymentStatus: PaymentStatusEnum;
}

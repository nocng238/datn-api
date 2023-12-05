import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/appointment/appointment.entity';
import { Client } from 'src/client/client.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import StripeService from './stripe.service';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Client])],
  controllers: [PaymentController],
  providers: [StripeService, PaymentService],
  exports: [StripeService],
})
export class PaymentModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeModule } from 'src/stripe/stripe.module';
import { ClientCreditCard } from './client-credit-card.entity';
import { CreditCardController } from './credit-card.controller';
import { CreditCardService } from './credit-card.service';
import { DoctorCreditCard } from './doctor-credit-card.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientCreditCard, DoctorCreditCard]),
    StripeModule,
  ],
  controllers: [CreditCardController],
  providers: [CreditCardService],
  exports: [CreditCardService],
})
export class CreditCardModule {}

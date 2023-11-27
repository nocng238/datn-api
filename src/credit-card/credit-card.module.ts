import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientCreditCard } from './client-credit-card.entity';
import { CreditCardController } from './credit-card.controller';
import { CreditCardService } from './credit-card.service';
import { DoctorCreditCard } from './doctor-credit-card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientCreditCard, DoctorCreditCard])],
  controllers: [CreditCardController],
  providers: [CreditCardService],
  exports: [CreditCardService],
})
export class CreditCardModule {}

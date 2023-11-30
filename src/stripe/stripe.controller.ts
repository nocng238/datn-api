import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/user-decorator';
import { Client } from 'src/client/client.entity';
import { Doctor } from 'src/doctor/doctor.entity';
import StripeService from '../stripe/stripe.service';
import CreateChargeDto from './dto/create-charge.dto';

@Controller()
export default class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('charge')
  @UseGuards(JwtAuthGuard)
  async createCharge(
    @Body() charge: CreateChargeDto,
    @GetUser() user: Client | Doctor,
  ) {
    const { amount, paymentMethodId } = charge;
    await this.stripeService.charge(
      amount,
      paymentMethodId,
      user.stripeCustomerId,
    );
  }

  @Get('/stripe/credit-cards')
  @UseGuards(JwtAuthGuard)
  async getCreditCards(@GetUser() user: Client | Doctor) {
    return this.stripeService.listCreditCards(user.stripeCustomerId);
  }
}

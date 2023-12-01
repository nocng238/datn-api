import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import StripeService from '../stripe/stripe.service';
import CreateChargeDto from './dto/create-charge.dto';

@Controller()
export default class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  // @Post('charge')
  // @UseGuards(JwtAuthGuard)
  // async createCharge(
  //   @Body() charge: CreateChargeDto,
  //   @GetUser() user: Client | Doctor,
  // ) {
  //   const { amount, paymentMethodId } = charge;
  //   await this.stripeService.charge(
  //     amount,
  //     paymentMethodId,
  //     user.stripeCustomerId,
  //   );
  // }
  @Post('stripe/:customerId/:paymentMethodId')
  async addCard(
    @Param('customerId') customerId: string,
    @Param('paymentMethodId') paymentMethodId: string,
  ) {
    await this.stripeService.attachCreditCard(paymentMethodId, customerId);
  }

  @Post('charge/stripe/:customerId')
  async createCharge(
    @Body() charge: CreateChargeDto,
    @Param('customerId') customerId: string,
  ) {
    const { amount, paymentMethodId } = charge;
    await this.stripeService.charge(amount, paymentMethodId, customerId);
  }

  @Get('/stripe/credit-cards/:customerId')
  async getCreditCards(@Param('customerId') id: string) {
    return this.stripeService.listCreditCards(id);
  }

  @Put('/stripe/credit-cards/:customerId/:paymentMethodId')
  async setDefault(
    @Param('customerId') customerId: string,
    @Param('paymentMethodId') paymentMethodId: string,
  ) {
    return this.stripeService.setDefaultCreditCard(paymentMethodId, customerId);
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export default class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
  }

  public async createCustomer(name: string, email: string) {
    return this.stripe.customers.create({
      name,
      email,
    });
  }

  public async charge(
    amount: number,
    paymentMethodId: string,
    customerId: string,
  ) {
    return this.stripe.paymentIntents.create({
      amount,
      customer: customerId,
      payment_method: paymentMethodId,
      currency: this.configService.get('STRIPE_CURRENCY'),
      off_session: true, // we indicate that it occurs without the direct involvement of the customer with the use of previously collected credit card information
      confirm: true,
    });
  }

  public async attachCreditCard(paymentMethodId: string, customerId: string) {
    return this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
  }

  public async listCreditCards(customerId: string) {
    return this.stripe.paymentMethods.list({
      customer: customerId,
    });
  }

  public async detachCreditCard(paymentMethodId: string) {
    // Detaches a PaymentMethod object from a Customer. After a PaymentMethod is detached, it can no longer be used for a payment or re-attached to a Customer.
    return this.stripe.paymentMethods.detach(paymentMethodId);
  }

  public async setDefaultCreditCard(
    paymentMethodId: string,
    customerId: string,
  ) {
    try {
      return await this.stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}

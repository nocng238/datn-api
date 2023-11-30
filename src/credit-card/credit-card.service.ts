import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/client/client.entity';
import { Doctor } from 'src/doctor/doctor.entity';
import StripeService from 'src/stripe/stripe.service';
import { Repository } from 'typeorm';
import { ClientCreditCard } from './client-credit-card.entity';
import { DoctorCreditCard } from './doctor-credit-card.entity';
import { AddCreditCardDto } from './dto/add-credit-card.dto';

@Injectable()
export class CreditCardService {
  constructor(
    @InjectRepository(ClientCreditCard)
    private clientCreditCardRepository: Repository<ClientCreditCard>,
    @InjectRepository(DoctorCreditCard)
    private doctorCreditCardRepository: Repository<DoctorCreditCard>,
    private readonly stripeService: StripeService,
  ) {}

  async addCreditCard(
    user: Client | Doctor,
    addCreditCardDto: AddCreditCardDto,
  ) {
    let mainCredit: ClientCreditCard | DoctorCreditCard;
    if (user.isDoctor) {
      mainCredit = await this.doctorCreditCardRepository.findOneBy({
        doctorId: user.id,
        isMain: true,
      });
    } else {
      mainCredit = await this.clientCreditCardRepository.findOneBy({
        clientId: user.id,
        isMain: true,
      });
    }
    let isMain: boolean;
    if (mainCredit) {
      isMain = false;
    } else {
      isMain = true;
    }
    const { paymentMethodId } = addCreditCardDto;
    await this.stripeService.attachCreditCard(
      paymentMethodId,
      user.stripeCustomerId,
    );
    if (user.isDoctor) {
      const createdCreditCard = this.doctorCreditCardRepository.create({
        ...addCreditCardDto,
        isMain,
        doctor: { id: user.id },
      });
      return this.doctorCreditCardRepository.save(createdCreditCard);
    } else {
      const createdCreditCard = this.clientCreditCardRepository.create({
        ...addCreditCardDto,
        isMain,
        client: { id: user.id },
      });
      return this.clientCreditCardRepository.save(createdCreditCard);
    }
  }

  async getCreditCards(user: Client | Doctor) {
    if (user.isDoctor) {
      return this.doctorCreditCardRepository.findBy({ doctorId: user.id });
    } else {
      return this.clientCreditCardRepository.findBy({ clientId: user.id });
    }
  }

  async updateMain(id: string, user: Client | Doctor) {
    let creditCard: ClientCreditCard | DoctorCreditCard;
    if (user.isDoctor) {
      creditCard = await this.doctorCreditCardRepository.findOneBy({
        doctorId: user.id,
      });
    } else {
      creditCard = await this.clientCreditCardRepository.findOneBy({
        clientId: user.id,
      });
    }
    if (creditCard) {
      if (creditCard.isMain) {
        throw new BadRequestException('This card already is main');
      }
    } else {
      throw new NotFoundException('Credit card not found');
    }
    let mainCreditCard: ClientCreditCard | DoctorCreditCard;
    if (user.isDoctor) {
      mainCreditCard = await this.doctorCreditCardRepository.findOneBy({
        doctorId: user.id,
        isMain: true,
      });
    } else {
      mainCreditCard = await this.clientCreditCardRepository.findOneBy({
        clientId: user.id,
        isMain: true,
      });
    }
    await this.stripeService.setDefaultCreditCard(
      creditCard.paymentMethodId,
      user.stripeCustomerId,
    );
    if (user.isDoctor) {
      await this.doctorCreditCardRepository.update(
        { id: mainCreditCard.id },
        { isMain: false },
      );
      await this.doctorCreditCardRepository.update({ id }, { isMain: true });
    } else {
      await this.clientCreditCardRepository.update(
        { id: mainCreditCard.id },
        { isMain: false },
      );
      await this.clientCreditCardRepository.update({ id }, { isMain: true });
    }
  }
}

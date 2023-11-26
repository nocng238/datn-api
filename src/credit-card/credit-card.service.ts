import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/client/client.entity';
import { Doctor } from 'src/doctor/doctor.entity';
import { Repository } from 'typeorm';
import { CreditCard } from './credit-card.entity';
import { AddCreditCardDto } from './dto/add.dto';

@Injectable()
export class CreditCardService {
  constructor(
    @InjectRepository(CreditCard)
    private creditCardRepository: Repository<CreditCard>,
  ) {}

  async addCreditCard(
    user: Client | Doctor,
    addCreditCardDto: AddCreditCardDto,
  ) {
    const clientId = user.id;
    const mainCredit = await this.creditCardRepository.findOneBy({
      clientId,
      isMain: true,
    });
    let isMain: boolean;
    if (mainCredit) {
      isMain = false;
    } else {
      isMain = true;
    }
    const createdCreditCard = this.creditCardRepository.create({
      ...addCreditCardDto,
      client: { id: clientId },
      isMain,
    });
    await this.creditCardRepository.save(createdCreditCard);
  }
}

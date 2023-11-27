import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/client/client.entity';
import { Doctor } from 'src/doctor/doctor.entity';
import { Repository } from 'typeorm';
import { ClientCreditCard } from './client-credit-card.entity';
import { DoctorCreditCard } from './doctor-credit-card.entity';
import { AddCreditCardDto } from './dto/add.dto';

@Injectable()
export class CreditCardService {
  constructor(
    @InjectRepository(ClientCreditCard)
    private clientCreditCardRepository: Repository<ClientCreditCard>,
    @InjectRepository(DoctorCreditCard)
    private doctorCreditCardRepository: Repository<DoctorCreditCard>,
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
}

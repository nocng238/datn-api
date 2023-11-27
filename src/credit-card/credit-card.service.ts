import { BadRequestException, Injectable } from '@nestjs/common';
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

  async getCreditCards(user: Client | Doctor) {
    if (user.isDoctor) {
      return this.doctorCreditCardRepository.findBy({ doctorId: user.id });
    } else {
      return this.clientCreditCardRepository.findBy({ clientId: user.id });
    }
  }

  async updateMain(id: string, user: Client | Doctor) {
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
    if (mainCredit.id === id) {
      throw new BadRequestException('This card already is main');
    }
    if (user.isDoctor) {
      await this.doctorCreditCardRepository.update(
        { id: mainCredit.id },
        { isMain: false },
      );
      await this.doctorCreditCardRepository.update({ id }, { isMain: true });
    } else {
      await this.clientCreditCardRepository.update(
        { id: mainCredit.id },
        { isMain: false },
      );
      await this.clientCreditCardRepository.update({ id }, { isMain: true });
    }
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/appointment/appointment.entity';
import {
  AppointmentStatusEnum,
  PaymentMethodEnum,
  PaymentStatusEnum,
} from 'src/shared';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create.dto';
import StripeService from './stripe.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly stripeService: StripeService,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async createPayment(dto: CreatePaymentDto) {
    const { appointmentId, paymentMethod } = dto;
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
      relations: ['doctor', 'client', 'client.creditCards'],
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    if (appointment.paymentStatus === PaymentStatusEnum.PAID) {
      throw new BadRequestException('This appointment has already been paid');
    }
    if (appointment.status !== AppointmentStatusEnum.FINISHED) {
      throw new BadRequestException('This appointment has not been finished');
    }
    if (paymentMethod === PaymentMethodEnum.CASH) {
      // CASH
      await this.appointmentRepository.update(
        { id: appointmentId },
        {
          paymentMethod: PaymentMethodEnum.CASH,
          paymentStatus: PaymentStatusEnum.PAID,
        },
      );
    } else {
      // CARD
      const clientMainCard = appointment.client.creditCards.find(
        (card) => card.isMain,
      );
      if (!clientMainCard) {
        throw new NotFoundException('Client does not have a main credit card');
      }
      const { feePerHour } = appointment.doctor;
      if (!feePerHour) {
        throw new NotFoundException('Doctor have not had fee per hour value');
      }
      const { paymentMethodId } = clientMainCard;
      const amount = feePerHour;
      // TODO: redefine:
      // - what is the unit of this property (since default unit in stripe is cent, if it is cent, do it have to * 100)?
      // - do it should be amount = feePerHour * dayjs(dayjs(appointment.endDate) - dayjs(appointment.startDate)).duration().asHours() ?
      await this.stripeService.charge(
        amount,
        paymentMethodId,
        appointment.client.stripeCustomerId,
      );
      await this.appointmentRepository.update(
        { id: appointmentId },
        {
          paymentMethod: PaymentMethodEnum.CARD,
          paymentStatus: PaymentStatusEnum.PAID,
        },
      );
    }
  }
}

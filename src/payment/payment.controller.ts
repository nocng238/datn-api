import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/user-decorator';
import { Client } from 'src/client/client.entity';
import { Doctor } from 'src/doctor/doctor.entity';
import { CreatePaymentDto } from './dto/create.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPayment(
    @Body() dto: CreatePaymentDto,
    @GetUser() user: Client | Doctor,
  ) {
    if (!user.isDoctor) {
      throw new ForbiddenException('Not allow client');
    }
    await this.paymentService.createPayment(dto);
  }
}

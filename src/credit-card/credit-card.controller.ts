import {
  Body,
  Controller,
  ForbiddenException,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/user-decorator';
import { Client } from 'src/client/client.entity';
import { Doctor } from 'src/doctor/doctor.entity';
import { CreditCardService } from './credit-card.service';
import { AddCreditCardDto } from './dto/add.dto';

@Controller('credit-card')
export class CreditCardController {
  constructor(private readonly creditCardService: CreditCardService) {}

  @Put()
  @UseGuards(JwtAuthGuard)
  async addCreditCard(
    @GetUser() user: Client | Doctor,
    @Body() addCreditCardDto: AddCreditCardDto,
  ) {
    if (user.isDoctor) {
      throw new ForbiddenException('Not allow doctor');
    }
    return this.creditCardService.addCreditCard(user, addCreditCardDto);
  }
}

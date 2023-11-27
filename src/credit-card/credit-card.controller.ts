import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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
@UseGuards(JwtAuthGuard)
export class CreditCardController {
  constructor(private readonly creditCardService: CreditCardService) {}

  @Post()
  async addCreditCard(
    @GetUser() user: Client | Doctor,
    @Body() addCreditCardDto: AddCreditCardDto,
  ) {
    return this.creditCardService.addCreditCard(user, addCreditCardDto);
  }

  @Get()
  async getCreditCards(@GetUser() user: Client | Doctor) {
    return this.creditCardService.getCreditCards(user);
  }

  @Put('main/:id')
  async updateMain(@Param('id') id: string, @GetUser() user: Client | Doctor) {
    return this.creditCardService.updateMain(id, user);
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { Client } from './client.entity';
import { ClientService } from './client.service';
import { ClientRegisterDto } from './dto/client-register.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('register')
  async register(
    @Body()
    registerDto: ClientRegisterDto,
  ): Promise<Client> {
    return this.clientService.register(registerDto);
  }
}

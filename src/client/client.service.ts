import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { UpdateClientDto } from './dto/update.dto';
@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async update(id: string, updateClientDto: UpdateClientDto) {
    const client = await this.clientRepository.findOneBy({ id });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    await this.clientRepository.update({ id }, updateClientDto);
    return { id, ...updateClientDto };
  }
}

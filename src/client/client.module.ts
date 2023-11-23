import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from 'src/doctor/doctor.entity';
import { ClientController } from './client.controller';
import { Client } from './client.entity';
import { ClientService } from './client.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Doctor])],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}

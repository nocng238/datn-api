import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from 'src/doctor/doctor.entity';
import { ClientController } from './client.controller';
import { Client } from './client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Doctor])],
  controllers: [ClientController],
})
export class ClientModule {}

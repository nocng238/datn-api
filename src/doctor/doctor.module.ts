import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/client/client.entity';
import { DoctorController } from './doctor.controller';
import { Doctor } from './doctor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Doctor])],
  controllers: [DoctorController],
})
export class DoctorModule {}

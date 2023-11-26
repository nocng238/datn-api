import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/client/client.entity';
import { ClientModule } from 'src/client/client.module';
import { Doctor } from 'src/doctor/doctor.entity';
import { DoctorModule } from 'src/doctor/doctor.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, Doctor]),
    ClientModule,
    DoctorModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

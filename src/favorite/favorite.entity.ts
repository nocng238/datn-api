import { Client } from 'src/client/client.entity';
import { Doctor } from 'src/doctor/doctor.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('favorite')
export class Favorite {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'favorite_primary_key',
  })
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @ManyToOne(() => Client, (client) => client.appointments, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'doctor_id',
    foreignKeyConstraintName: 'favorite_client_foreign_key',
  })
  client: Client;
}

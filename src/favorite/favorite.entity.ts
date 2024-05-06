import { Client } from 'src/client/client.entity';
import { Doctor } from 'src/doctor/doctor.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('favorite')
export class Favorite extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'favorite_primary_key',
  })
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Doctor, (doctor) => doctor.favorites, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'doctor_id',
    foreignKeyConstraintName: 'favorite_doctor_foreign_key',
  })
  doctor: Doctor;

  @Column({ name: 'doctor_id' })
  doctorId: string;

  @ManyToOne(() => Client, (client) => client.favorites, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'client_id',
    foreignKeyConstraintName: 'favorite_client_foreign_key',
  })
  client: Client;

  @Column({ name: 'client_id' })
  clientId: string;
}

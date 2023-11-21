import { Client } from 'src/client/client.entity';
import { Doctor } from 'src/doctor/doctor.entity';
import { Review } from 'src/review/review.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('appointment')
export class Appointment {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'appoinment_primary_key',
  })
  id: string;

  @Column()
  status: string;

  @Column({ name: 'total_price', type: 'int' })
  totalPrice: number;

  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'end_time' })
  endTime: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'doctor_id',
    foreignKeyConstraintName: 'appointment_doctor_foreign_key',
  })
  doctor: Doctor;

  @ManyToOne(() => Client, (client) => client.appointments, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'doctor_id',
    foreignKeyConstraintName: 'appointment_client_foreign_key',
  })
  client: Client;

  @OneToOne(() => Review, (review) => review.appointment)
  @JoinColumn({
    name: 'review_id',
    foreignKeyConstraintName: 'appointment_review_foreign_key',
  })
  review: Review;
}
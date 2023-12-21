import { IsOptional } from 'class-validator';
import { Client } from 'src/client/client.entity';
import { Doctor } from 'src/doctor/doctor.entity';
import { Review } from 'src/review/review.entity';
import {
  AppointmentStatusEnum,
  PaymentMethodEnum,
  PaymentStatusEnum,
} from 'src/shared';
import {
  BaseEntity,
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
export class Appointment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'appoinment_primary_key',
  })
  id: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatusEnum,
    default: AppointmentStatusEnum.PENDING,
  })
  status: AppointmentStatusEnum;

  @Column({ name: 'total_price', type: 'int', nullable: true })
  totalPrice: number;

  @Column({ name: 'start_time', type: 'timestamptz' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamptz' })
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

  @Column({ name: 'doctor_id' })
  doctorId: string;

  @ManyToOne(() => Client, (client) => client.appointments, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'client_id',
    foreignKeyConstraintName: 'appointment_client_foreign_key',
  })
  client: Client;

  @Column({ name: 'client_id' })
  clientId: string;

  @OneToOne(() => Review, (review) => review.appointment)
  @JoinColumn({
    name: 'review_id',
    foreignKeyConstraintName: 'appointment_review_foreign_key',
  })
  review: Review;

  @IsOptional()
  @Column({ name: 'review_id', nullable: true })
  reviewId: string;

  @Column({ nullable: true })
  note: string;

  @Column({
    type: 'enum',
    enum: PaymentStatusEnum,
    default: PaymentStatusEnum.UNPAID,
    name: 'payment_status',
  })
  paymentStatus: PaymentStatusEnum;

  @Column({
    type: 'enum',
    enum: PaymentMethodEnum,
    name: 'payment_method',
    nullable: true,
  })
  paymentMethod: PaymentMethodEnum;

  @Column({ nullable: true, name: 'doctor_note' })
  doctorNote: string;

  @Column({
    nullable: true,
    name: 'doctor_note_updated_at',
    type: 'timestamptz',
  })
  doctorNoteUpdatedAt: Date;

  @Column({ nullable: true, name: 'status_updated_at', type: 'timestamptz' })
  statusUpdatedAt: Date;
}

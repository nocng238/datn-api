import { Doctor } from 'src/doctor/doctor.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('doctor_credit_card')
export class DoctorCreditCard {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'doctor_credit_card_primary_key',
  })
  id: string;

  @Column({ name: 'credit_number' })
  creditNumber: string;

  @Column({ name: 'expired_time' })
  expiredTime: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Doctor, (doctor) => doctor.creditCards, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'doctor_id',
    foreignKeyConstraintName: 'doctor_credit_card_doctor_foreign_key',
  })
  doctor: Doctor;

  @Column({ name: 'doctor_id' })
  doctorId: string;

  @Column({ name: 'is_main' })
  isMain: boolean;

  @Column({ name: 'payment_method_id' })
  paymentMethodId: string;
}

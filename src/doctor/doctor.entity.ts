import { Appointment } from 'src/appointment/appointment.entity';
import { DoctorCreditCard } from 'src/credit-card/doctor-credit-card.entity';
import { DoctorAvailableTime } from 'src/doctor-available-time/doctor-available-time.entity';
import { Favorite } from 'src/favorite/favorite.entity';
import { StatusEnum } from 'src/shared';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('doctor')
export class Doctor {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'doctor_primary_key',
  })
  id: string;

  @Column({ nullable: true })
  fullname: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  sex: string;

  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.NOT_VERIFY })
  status: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    nullable: true,
    default:
      'https://res.cloudinary.com/dizvl6kwh/image/upload/v1700844526/petcare/default-avatar_vurwzr.jpg',
  })
  avatar: string;

  @Column({ nullable: true })
  workplace: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  cv: string;

  @Column({ name: 'fee_per_hour', nullable: true })
  feePerHour: number;

  @OneToMany(() => DoctorCreditCard, (creditCard) => creditCard.doctor)
  creditCards: DoctorCreditCard[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];

  @OneToOne(
    () => DoctorAvailableTime,
    (doctorAvailableTime) => doctorAvailableTime.doctor,
  )
  @JoinColumn({
    name: 'doctor_available_time_id',
    foreignKeyConstraintName: 'doctor_doctor_available_time_foreign_key',
  })
  doctorAvailableTime: DoctorAvailableTime;

  @OneToMany(() => Favorite, (favorite) => favorite.doctor)
  favorites: Favorite[];

  @Column({ name: 'is_doctor', default: true })
  isDoctor: boolean;

  @Column({ name: 'register_verifying_token', nullable: true })
  registerVerifyingToken: string;

  @Column({ name: 'reset_password_code', nullable: true })
  resetPasswordCode: string;

  @Column({ name: 'reset_password_code_expiry', nullable: true })
  resetPasswordCodeExpiry: Date;

  @Column({ name: 'sent_email_verify_at', type: 'timestamptz', nullable: true })
  sentEmailVerifyAt: Date;
}

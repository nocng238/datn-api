import { Appointment } from 'src/appointment/appointment.entity';
import { DoctorAvailableTime } from 'src/doctor-available-time/doctor-available-time.entity';
import { Favorite } from 'src/favorite/favorite.entity';
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

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  workplace: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  cv: string;

  @Column({ nullable: true })
  city: string;

  @Column({ name: 'fee_per_hour', nullable: true })
  feePerHour: number;

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
}

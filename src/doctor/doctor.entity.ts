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

  @Column()
  fullname: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @Column()
  sex: string;

  @Column()
  status: string;

  @Column()
  phone: string;

  @Column()
  avatar: string;

  @Column()
  workplace: string;

  @Column()
  description: string;

  @Column()
  cv: string;

  @Column({ name: 'fee_per_hour' })
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

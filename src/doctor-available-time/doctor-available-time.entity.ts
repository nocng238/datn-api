import { Doctor } from 'src/doctor/doctor.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('doctor_available_time')
export class DoctorAvailableTime extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'doctor_available_time_primary_key',
  })
  id: string;

  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'end_time' })
  endTime: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Doctor, (doctor) => doctor.doctorAvailableTime)
  @JoinColumn({
    name: 'doctor_id',
    foreignKeyConstraintName: 'doctor_available_time_doctor_foreign_key',
  })
  doctor: Doctor;
}

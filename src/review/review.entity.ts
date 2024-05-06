import { Max, Min } from 'class-validator';
import { Appointment } from 'src/appointment/appointment.entity';
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

@Entity('review')
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'review_primary_key',
  })
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Appointment, (appointment) => appointment.review)
  @JoinColumn({
    name: 'appointment_id',
    foreignKeyConstraintName: 'review_appointment_foreign_key',
  })
  appointment: Appointment;

  @Column({ type: 'int' })
  @Max(5)
  @Min(1)
  rating: number;

  @Column({ nullable: true })
  feedback: string;
}

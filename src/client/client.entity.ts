import { Appointment } from 'src/appointment/appointment.entity';
import { CreditCard } from 'src/credit-card/credit-card.entity';
import { Favorite } from 'src/favorite/favorite.entity';
import { StatusEnum } from 'src/shared';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('client')
export class Client {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'client_primary_key',
  })
  id: string;

  @Column({ nullable: true })
  fullname: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  sex: string;

  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.NOT_VERIFY })
  status: string;

  @Column({ nullable: true })
  phone: string;

  // @OneToOne(() => CreditCard, (creditCard) => creditCard.client)
  // @JoinColumn({
  //   name: 'credit_card_id',
  //   foreignKeyConstraintName: 'credit_card_foreign_key',
  // })
  // creditCard: CreditCard
  @Column({ nullable: true })
  credit_card_id: string;

  @Column({
    nullable: true,
    default:
      'https://res.cloudinary.com/dizvl6kwh/image/upload/v1700844526/petcare/default-avatar_vurwzr.jpg',
  })
  avatar: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Appointment, (appointment) => appointment.client)
  appointments: Appointment[];

  @OneToMany(() => Favorite, (favorite) => favorite.client)
  favorites: Favorite[];

  @OneToMany(() => CreditCard, (creditCard) => creditCard.client)
  creditCards: CreditCard[];

  @Column({ name: 'is_doctor', default: false })
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

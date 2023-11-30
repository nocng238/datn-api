import { Client } from 'src/client/client.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('client_credit_card')
export class ClientCreditCard {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'client_credit_card_primary_key',
  })
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Client, (client) => client.creditCards, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'client_id',
    foreignKeyConstraintName: 'client_credit_card_client_foreign_key',
  })
  client: Client;

  @Column({ name: 'client_id' })
  clientId: string;

  @Column({ name: 'is_main' })
  isMain: boolean;

  @Column({ name: 'payment_method_id' })
  paymentMethodId: string;
}

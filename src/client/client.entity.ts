import { Appointment } from 'src/appointment/appointment.entity';
import { Favorite } from 'src/favorite/favorite.entity';
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Appointment, (appointment) => appointment.client)
  appointments: Appointment[];

  @OneToMany(() => Favorite, (favorite) => favorite.client)
  favorites: Favorite[];
}

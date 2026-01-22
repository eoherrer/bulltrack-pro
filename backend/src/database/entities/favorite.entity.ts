import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Bull } from './bull.entity';

@Entity('favorites')
@Unique(['user', 'bull'])
@Index(['user', 'bull'])
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => Bull, (bull) => bull.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bull_id' })
  bull: Bull;

  @Column({ name: 'bull_id' })
  bullId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

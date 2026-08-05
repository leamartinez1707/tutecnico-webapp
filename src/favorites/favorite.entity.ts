import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { User } from '../users/user.entity';
import { Technician } from '../technicians/technician.entity';

@Entity()
@Unique(['user', 'technician'])
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.favorites, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Technician, technician => technician.favoritedBy, { eager: true, onDelete: 'CASCADE' })
  technician: Technician;
}

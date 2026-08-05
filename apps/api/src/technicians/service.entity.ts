import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToMany } from 'typeorm';
import { Technician } from './technician.entity';

@Entity()
@Unique(['name'])
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128 })
  name: string;

  @ManyToMany(() => Technician, (technician) => technician.services)
  technicians: Technician[];
}

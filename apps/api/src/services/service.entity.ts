import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToMany, OneToMany } from 'typeorm';
import { Technician } from '../technicians/technician.entity';
import { Profession } from './profession.entity';

@Entity()
@Unique(['name'])
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128 })
  name: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  description: string | null;

  @ManyToMany(() => Technician, (technician) => technician.services)
  technicians: Technician[];

  @OneToMany(() => Profession, (profession) => profession.service)
  professions: Profession[];
}

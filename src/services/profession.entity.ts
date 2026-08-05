import { Entity, PrimaryColumn, Column, ManyToOne, Index, JoinColumn } from 'typeorm';
import { Service } from './service.entity';

@Entity()
@Index('idx_profession_service_id', ['serviceId'])
export class Profession {
  @PrimaryColumn()
  id: number; // seeded explicit IDs

  @Column({ length: 128 })
  name: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  description: string | null;

  @Column({ name: 'service_id' })
  serviceId: number;

  @ManyToOne(() => Service, (service) => service.professions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
  service: Service;
}
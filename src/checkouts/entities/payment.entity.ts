import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Technician } from 'src/technicians/technician.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  IN_PROCESS = 'in_process',
}

export enum SubscriptionPlanType {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  mercadopagoPaymentId: string;

  @Column({ nullable: true })
  mercadopagoPreferenceId: string;

  @Column({ type: 'varchar', length: 32 })
  status: PaymentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 16 })
  planType: SubscriptionPlanType;

  @Column({ type: 'varchar', length: 512, nullable: true })
  externalReference: string | null;

  @Column({ type: 'text', nullable: true })
  metadata: string | null;

  @ManyToOne(() => Technician, { onDelete: 'CASCADE' })
  @JoinColumn()
  technician: Technician;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

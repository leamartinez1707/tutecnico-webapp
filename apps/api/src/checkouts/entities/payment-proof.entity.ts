import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Technician } from 'src/technicians/technician.entity';

export enum PaymentProofStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity()
export class PaymentProof {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 16 })
  membershipType: string; // 'TRIAL' | 'PAID'

  @Column()
  transactionReference: string;

  @Column()
  transactionDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  bankAccount: string;

  @Column({ type: 'varchar', length: 16, default: PaymentProofStatus.PENDING })
  status: string;

  @ManyToOne(() => Technician, { onDelete: 'CASCADE' })
  @JoinColumn()
  technician: Technician;

  @CreateDateColumn()
  createdAt: Date;
}

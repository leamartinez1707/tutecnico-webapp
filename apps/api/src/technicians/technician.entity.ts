import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, ManyToMany, JoinTable, CreateDateColumn } from "typeorm";
import { User } from "src/users/user.entity";
import { Review } from "src/reviews/entities/review.entity";
import { Booking } from "src/bookings/entities/booking.entity";
import { Favorite } from '../favorites/favorite.entity';
import { Service } from '../services/service.entity';

export enum MembershipType {
    NONE = 'NONE',
    TRIAL = 'TRIAL',
    PAID = 'PAID',
}

@Entity()
export class Technician {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    specialization: string;

    @Column("decimal", { precision: 10, scale: 7 })
    latitude: number;

    @Column("decimal", { precision: 10, scale: 7 })
    longitude: number;

    @Column('decimal', { precision: 3, scale: 2, default: 0 })
    averageRating: number;

    @Column({ type: 'int', default: 0 })
    reviewsCount: number;

    @ManyToMany(() => Service, (service) => service.technicians, { cascade: ['insert'] })
    @JoinTable()
    services: Service[];

    @OneToOne(() => User, { cascade: true, eager: true })
    @JoinColumn()
    user: User;

    @OneToMany(() => Review, review => review.technician, { cascade: true })
    reviews: Review[];

    @OneToMany(() => Booking, booking => booking.technician, { cascade: true })
    bookings: Booking[];

    @OneToMany(() => Favorite, (favorite) => favorite.technician)
    favoritedBy: Favorite[];

    // Membership fields
    @Column({ type: 'varchar', length: 16, default: MembershipType.NONE })
    membershipType: MembershipType;

    @Column({ type: 'boolean', default: false })
    membershipActive: boolean;

    @Column({ type: 'timestamp', nullable: true })
    membershipStartedAt: Date | null;

    @Column({ type: 'timestamp', nullable: true })
    membershipExpiresAt: Date | null;

    @CreateDateColumn()
    createdAt: Date;
}
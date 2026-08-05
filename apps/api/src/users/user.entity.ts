import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany, OneToOne } from "typeorm";
import { Review } from "src/reviews/entities/review.entity";
import { Booking } from "src/bookings/entities/booking.entity";
import { Technician } from "src/technicians/technician.entity";
import { Favorite } from '../favorites/favorite.entity';

export enum UserRole {
    USUARIO = 'usuario',
    TECNICO = 'tecnico',
    ADMIN = 'admin',
}

@Entity()
@Unique(['email', 'username', 'phone'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column({ select: false })
    password: string;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'varchar', length: 16, default: UserRole.USUARIO })
    role: UserRole;

    @Column({ type: 'int', default: 0 })
    tokenVersion: number;

    @OneToOne(() => Technician, (technician) => technician.user)
    technician: Technician;

    @OneToMany(() => Review, (review) => review.user, { cascade: true })
    reviews: Review[];

    @OneToMany(() => Booking, (booking) => booking.user, { cascade: true })
    bookings: Booking[];

    @OneToMany(() => Favorite, (favorite) => favorite.user)
    favorites: Favorite[];

    @Column({ type: 'boolean', default: false })
    emailVerified: boolean;

    @Column({ type: 'varchar', length: 128, nullable: true })
    emailVerificationToken: string | null;

    @Column({ type: 'varchar', length: 128, nullable: true })
    passwordResetToken: string | null;

    @Column({ type: 'timestamp', nullable: true })
    passwordResetExpires: Date | null;

    @Column({ type: 'varchar', length: 512, nullable: true })
    profilePhotoUrl: string | null;
}
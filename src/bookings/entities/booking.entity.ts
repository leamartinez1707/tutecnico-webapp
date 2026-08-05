import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from "typeorm";
import { User } from "src/users/user.entity";
import { Technician } from "src/technicians/technician.entity";

@Entity()
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: Date;

    @Column()
    status: string;

    @Column()
    comment: string;

    @ManyToOne(() => User, user => user.bookings)
    @JoinColumn()
    user: User;

    @ManyToOne(() => Technician, technician => technician.bookings)
    @JoinColumn()
    technician: Technician;
}

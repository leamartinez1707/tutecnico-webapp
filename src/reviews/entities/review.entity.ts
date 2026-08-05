import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from "typeorm";
import { User } from "src/users/user.entity";
import { Technician } from "src/technicians/technician.entity";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    rating: number;

    @Column()
    comment: string;

    @Column()
    date: Date;

    @ManyToOne(() => User, (user) => user.reviews)
    user: User;

    @ManyToOne(() => Technician, (technician) => technician.reviews)
    technician: Technician;
}

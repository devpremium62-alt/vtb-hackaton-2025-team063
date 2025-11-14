import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, OneToMany} from 'typeorm';
import {MaxLength} from "class-validator";
import {User} from "../users/user.entity";

@Entity()
export class Limit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @MaxLength(255)
    name: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    limit: number;

    @Column({ type: 'int' })
    category: number;

    @Column({
        type: "enum",
        enum: ["week", "month"],
    })
    period: "week" | "month";

    @ManyToOne(() => User, {
        onDelete: 'CASCADE',
        eager: false,
    })
    user: User;
}

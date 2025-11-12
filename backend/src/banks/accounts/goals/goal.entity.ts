import {Entity, Column, ManyToOne, Index, PrimaryColumn} from 'typeorm';
import {MaxLength} from "class-validator";
import {User} from "../../../users/user.entity";

@Entity()
export class Goal {
    @PrimaryColumn()
    id: string;

    @Column()
    @Index()
    account: string;

    @Column()
    @Index()
    bankId: string;

    @Column()
    @MaxLength(255)
    name: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    value: number;

    @Column({type: "date"})
    date: Date;

    @Column()
    icon: string;

    @ManyToOne(() => User, {
        onDelete: 'CASCADE',
        eager: false,
    })
    user: User;
}

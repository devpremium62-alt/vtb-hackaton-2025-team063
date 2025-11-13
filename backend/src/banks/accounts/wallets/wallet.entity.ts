import {Entity, Column, ManyToOne, Index, PrimaryColumn} from 'typeorm';
import {MaxLength} from "class-validator";
import {User} from "../../../users/user.entity";

@Entity()
export class Wallet {
    @PrimaryColumn()
    id: string;

    @Column()
    @Index()
    account: string;

    @Column()
    @MaxLength(255)
    name: string;

    @Column()
    @Index()
    categoryId: number;

    @Column()
    @Index()
    bankId: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @ManyToOne(() => User, {
        onDelete: 'CASCADE',
        eager: false,
    })
    user: User;
}

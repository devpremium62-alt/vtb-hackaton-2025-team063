import {Entity, Column, ManyToOne, Index, PrimaryColumn} from 'typeorm';
import {User} from "../../../users/user.entity";

@Entity()
export class ChildAccount {
    @PrimaryColumn()
    id: string;

    @Column()
    @Index()
    account: string;

    @Column()
    @Index()
    bankId: string;

    @Column()
    avatar: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    moneyPerDay: number;

    @ManyToOne(() => User, {
        onDelete: 'CASCADE',
    })
    user: User;
}

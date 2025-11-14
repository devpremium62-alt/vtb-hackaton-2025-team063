import {Column, Entity, Index, ManyToOne, PrimaryColumn} from 'typeorm';
import {User} from "../../users/user.entity";

@Entity()
export class Consent {
    @PrimaryColumn()
    id: string;

    @Column()
    @Index()
    bankId: string;

    @Column()
    clientId: string;

    @Column({
        type: "enum",
        enum: ["active", "pending", "declined"],
    })
    status: "active" | "pending" | "declined";

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;
}

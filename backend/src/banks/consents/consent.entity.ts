import {Column, Entity, Index, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';
import {User} from "../../users/user.entity";

@Entity()
export class Consent {
    @PrimaryGeneratedColumn()
    id: string;

    @PrimaryColumn()
    consentId: string;

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

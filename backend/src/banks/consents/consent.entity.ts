import {Column, Entity, ManyToOne, PrimaryColumn} from 'typeorm';
import {User} from "../../users/user.entity";

@Entity()
export class Consent {
    @PrimaryColumn()
    id: string;

    @Column()
    bankId: string;

    @Column()
    clientId: string;

    @ManyToOne(() => User, (user) => user.consents, { onDelete: 'CASCADE' })
    user: User;
}

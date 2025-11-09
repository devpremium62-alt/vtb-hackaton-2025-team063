import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, OneToMany} from 'typeorm';
import {Consent} from "../banks/consents/consent.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    @Index()
    phone: string;

    @Column()
    avatar: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'partner_id' })
    partner?: User;

    @OneToMany(() => Consent, (consent) => consent.user)
    consents: Consent[];
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';

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
}

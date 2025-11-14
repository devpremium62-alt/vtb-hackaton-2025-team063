import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, OneToMany} from 'typeorm';

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

    @Column({type: "date", default: new Date()})
    connectedAt: Date;

    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'partner_id' })
    partner?: User;
}

import { Entity, Column, OneToOne } from 'typeorm';
import { CommonEntityFields } from '../../../utils/entities/common-entity-fields';
import { User } from './user.entity';

@Entity()
export class UserWallet extends CommonEntityFields {
    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    balance: number;

    @OneToOne(() => User, (user) => user.wallet, { onDelete: 'CASCADE' })
    user: User;
}
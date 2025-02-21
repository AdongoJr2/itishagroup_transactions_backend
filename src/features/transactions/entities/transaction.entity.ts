import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CommonEntityFields } from '../../../utils/entities/common-entity-fields';
import { TransactionStatus } from '../../../utils/enums/enums';

@Entity()
export class Transaction extends CommonEntityFields {
    @ManyToOne(() => User, (user) => user.sentTransactions, { onUpdate: 'CASCADE', onDelete: 'RESTRICT' })
    sender: User;

    @ManyToOne(() => User, (user) => user.receivedTransactions, { onUpdate: 'CASCADE', onDelete: 'RESTRICT', nullable: true })
    recipient: User;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({
        type: 'enum',
        enum: TransactionStatus,
        default: TransactionStatus.PENDING,
    })
    status: TransactionStatus;
}
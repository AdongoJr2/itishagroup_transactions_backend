import { Column, DeepPartial, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { CommonEntityFields } from "../../../utils/entities/common-entity-fields";
import { Exclude } from "class-transformer";
import { Transaction } from "../../transactions/entities/transaction.entity";
import { UserWallet } from "./user-wallet.entity";

@Entity()
export class User extends CommonEntityFields {
    constructor(partial: DeepPartial<User>) {
        super();
        Object.assign(this, partial);
    }

    @Column({ length: 200, nullable: true })
    firstName: string;

    @Column({ length: 200, nullable: true })
    lastName: string;

    @Column({
        unique: true,
    })
    email: string;

    @Column({
        unique: true,
        nullable: true,
    })
    phoneNumber: string;

    @Column({ nullable: true })
    @Exclude()
    password: string;

    @OneToMany(() => Transaction, (transaction) => transaction.sender, { onDelete: 'RESTRICT' })
    sentTransactions: Transaction[];

    @OneToMany(() => Transaction, (transaction) => transaction.recipient, { onDelete: 'RESTRICT' })
    receivedTransactions: Transaction[];

    @OneToOne(() => UserWallet, (wallet) => wallet.user, { cascade: ['insert'], onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    @JoinColumn()
    wallet: UserWallet;
}
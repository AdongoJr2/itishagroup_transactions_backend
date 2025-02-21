import { injectable } from "inversify";
import { Repository } from "typeorm";
import { Transaction } from "../entities/transaction.entity";
import AppDataSource from "../../../config/database";
import { User } from "../../users/entities/user.entity";
import { TransactionStatus } from "../../../utils/enums/enums";

@injectable()
export class TransactionService {
    private transactionRepository: Repository<Transaction>;

    constructor() {
        this.transactionRepository = AppDataSource.getRepository(Transaction);
    }

    async sendMoney(amount: number, sender: User, recipient: User) {
        const queryRunner = AppDataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            // Deduct amount from sender's balance
            sender.wallet.balance = +sender.wallet.balance - amount;
            await queryRunner.manager.save(sender.wallet);
            
            // Add amount to recipient's balance
            recipient.wallet.balance = +recipient.wallet.balance + amount;
            await queryRunner.manager.save(recipient.wallet);

            // Create the transaction record
            const transaction = queryRunner.manager.create(Transaction, {
                sender,
                recipient,
                amount,
                status: TransactionStatus.COMPLETED,
            })
            await queryRunner.manager.save(transaction);

            await queryRunner.commitTransaction();

            return transaction;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }
}
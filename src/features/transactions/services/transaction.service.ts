import { injectable } from "inversify";
import { Brackets, Repository } from "typeorm";
import { Transaction } from "../entities/transaction.entity";
import AppDataSource from "../../../config/database";
import { User } from "../../users/entities/user.entity";
import { TransactionStatus } from "../../../utils/enums/enums";
import { FindAllOptions } from "../../../core/types/find-all-options";
import { calculateDBOffsetAndLimit } from "../../../utils/pagination/pagination";

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

    async getTransactions(
        { page, pageSize }: FindAllOptions,
        userId: number,
    ): Promise<[Transaction[], number]> {
        try {
            const { offset, limit } = calculateDBOffsetAndLimit({ page, pageSize });

            const transactionHistoryAlias = 'transactionHistory';
            const transactionSenderRelationName = 'sender';
            const transactionRecipientRelationName = 'recipient';

            const queryBuilder = this.transactionRepository.createQueryBuilder(transactionHistoryAlias);

            queryBuilder
                .leftJoinAndSelect(
                    `${transactionHistoryAlias}.${transactionSenderRelationName}`,
                    transactionSenderRelationName,
                )
                .leftJoinAndSelect(
                    `${transactionHistoryAlias}.${transactionRecipientRelationName}`,
                    transactionRecipientRelationName,
                )
                .select([transactionHistoryAlias])
                .addSelect([
                    `${transactionSenderRelationName}.id`,
                    `${transactionSenderRelationName}.firstName`,
                    `${transactionSenderRelationName}.lastName`,
                ])
                .addSelect([
                    `${transactionRecipientRelationName}.id`,
                    `${transactionRecipientRelationName}.firstName`,
                    `${transactionRecipientRelationName}.lastName`,
                ])

            queryBuilder.andWhere(
                new Brackets((qb) => {
                    qb.orWhere(`${transactionSenderRelationName}.id = :userId`, {
                        userId: userId,
                    });
                    qb.orWhere(`${transactionRecipientRelationName}.id = :userId`, {
                        userId: userId,
                    });
                }),
            );

            queryBuilder.addOrderBy(`${transactionHistoryAlias}.id`, 'DESC')

            return queryBuilder.skip(offset).take(limit).getManyAndCount();
        } catch (error) {
            throw error
        }
    }
}
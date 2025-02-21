import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTransactionCascade1740156713785 implements MigrationInterface {
    name = 'UpdateUserTransactionCascade1740156713785'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_wallets" DROP CONSTRAINT "FK_7382818ff309cabe40c7a74237a"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_wallets" DROP CONSTRAINT "REL_7382818ff309cabe40c7a74237"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_wallets" DROP COLUMN "user_id"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_wallets"
            ADD "user_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "user_wallets"
            ADD CONSTRAINT "REL_7382818ff309cabe40c7a74237" UNIQUE ("user_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "user_wallets"
            ADD CONSTRAINT "FK_7382818ff309cabe40c7a74237a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserWallet1740151252943 implements MigrationInterface {
    name = 'CreateUserWallet1740151252943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user_wallets" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "balance" numeric(10, 2) NOT NULL DEFAULT '0',
                "user_id" integer,
                CONSTRAINT "REL_7382818ff309cabe40c7a74237" UNIQUE ("user_id"),
                CONSTRAINT "PK_f98089275dcfc65d59b1d347167" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "wallet_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "UQ_67abb81dc33e75d1743323fd5db" UNIQUE ("wallet_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_67abb81dc33e75d1743323fd5db" FOREIGN KEY ("wallet_id") REFERENCES "user_wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "user_wallets"
            ADD CONSTRAINT "FK_7382818ff309cabe40c7a74237a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_wallets" DROP CONSTRAINT "FK_7382818ff309cabe40c7a74237a"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_67abb81dc33e75d1743323fd5db"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "UQ_67abb81dc33e75d1743323fd5db"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "wallet_id"
        `);
        await queryRunner.query(`
            DROP TABLE "user_wallets"
        `);
    }

}

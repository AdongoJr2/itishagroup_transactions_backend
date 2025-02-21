import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTransaction1740150627643 implements MigrationInterface {
    name = 'CreateTransaction1740150627643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."transactions_status_enum" AS ENUM('pending', 'completed', 'failed')
        `);
        await queryRunner.query(`
            CREATE TABLE "transactions" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "amount" numeric(10, 2) NOT NULL,
                "status" "public"."transactions_status_enum" NOT NULL DEFAULT 'pending',
                "sender_id" integer,
                "recipient_id" integer,
                CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "transactions"
            ADD CONSTRAINT "FK_5007c936fb75048f7697ecb7eb0" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "transactions"
            ADD CONSTRAINT "FK_f458da04820985b566c4d98276e" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "transactions" DROP CONSTRAINT "FK_f458da04820985b566c4d98276e"
        `);
        await queryRunner.query(`
            ALTER TABLE "transactions" DROP CONSTRAINT "FK_5007c936fb75048f7697ecb7eb0"
        `);
        await queryRunner.query(`
            DROP TABLE "transactions"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."transactions_status_enum"
        `);
    }

}

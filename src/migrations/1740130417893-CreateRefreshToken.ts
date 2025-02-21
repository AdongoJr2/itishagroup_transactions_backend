import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRefreshToken1740130417893 implements MigrationInterface {
    name = 'CreateRefreshToken1740130417893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "refresh_tokens" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "token" character varying(255) NOT NULL,
                CONSTRAINT "UQ_4542dd2f38a61354a040ba9fd57" UNIQUE ("token"),
                CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "refresh_tokens"
        `);
    }

}

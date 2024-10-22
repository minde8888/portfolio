import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTables1729625668799 implements MigrationInterface {
    name = 'UpdateTables1729625668799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "auth" ADD CONSTRAINT "UQ_373ead146f110f04dad60848154" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "auth" ADD CONSTRAINT "FK_373ead146f110f04dad60848154" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" DROP CONSTRAINT "FK_373ead146f110f04dad60848154"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "auth" DROP CONSTRAINT "UQ_373ead146f110f04dad60848154"`);
        await queryRunner.query(`ALTER TABLE "auth" DROP COLUMN "userId"`);
    }

}

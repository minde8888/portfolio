import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTablesUuid1729626285995 implements MigrationInterface {
    name = 'UpdateTablesUuid1729626285995'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "surname"`);
        await queryRunner.query(`ALTER TABLE "auth" DROP CONSTRAINT "FK_373ead146f110f04dad60848154"`);
        await queryRunner.query(`ALTER TABLE "auth" DROP CONSTRAINT "PK_7e416cf6172bc5aec04244f6459"`);
        await queryRunner.query(`ALTER TABLE "auth" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "auth" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "auth" ADD CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "auth" DROP CONSTRAINT "UQ_373ead146f110f04dad60848154"`);
        await queryRunner.query(`ALTER TABLE "auth" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "auth" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "auth" ADD CONSTRAINT "UQ_373ead146f110f04dad60848154" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "auth" ADD CONSTRAINT "FK_373ead146f110f04dad60848154" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" DROP CONSTRAINT "FK_373ead146f110f04dad60848154"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "auth" DROP CONSTRAINT "UQ_373ead146f110f04dad60848154"`);
        await queryRunner.query(`ALTER TABLE "auth" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "auth" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "auth" ADD CONSTRAINT "UQ_373ead146f110f04dad60848154" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "auth" DROP CONSTRAINT "PK_7e416cf6172bc5aec04244f6459"`);
        await queryRunner.query(`ALTER TABLE "auth" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "auth" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "auth" ADD CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "auth" ADD CONSTRAINT "FK_373ead146f110f04dad60848154" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD "surname" character varying NOT NULL`);
    }

}

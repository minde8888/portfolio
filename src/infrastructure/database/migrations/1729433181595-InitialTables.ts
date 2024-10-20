import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialTables1729433181595 implements MigrationInterface {
    name = 'InitialTables1729433181595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "surname" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "surname"`);
    }

}

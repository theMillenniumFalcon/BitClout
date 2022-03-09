import {MigrationInterface, QueryRunner} from "typeorm";

export class Migrations1646858602885 implements MigrationInterface {
    name = 'Migrations1646858602885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "memberStatus"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "memberStatus" boolean NOT NULL DEFAULT false
        `);
    }

}

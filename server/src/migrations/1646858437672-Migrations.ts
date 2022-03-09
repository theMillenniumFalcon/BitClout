import {MigrationInterface, QueryRunner} from "typeorm";

export class Migrations1646858437672 implements MigrationInterface {
    name = 'Migrations1646858437672'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "group"
            ADD "memberStatus" boolean NOT NULL DEFAULT false
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "group" DROP COLUMN "memberStatus"
        `);
    }

}

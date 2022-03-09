import {MigrationInterface, QueryRunner} from "typeorm";

export class Migrations1646860624015 implements MigrationInterface {
    name = 'Migrations1646860624015'

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

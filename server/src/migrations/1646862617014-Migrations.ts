import {MigrationInterface, QueryRunner} from "typeorm";

export class Migrations1646862617014 implements MigrationInterface {
    name = 'Migrations1646862617014'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "group" DROP COLUMN "memberStatus"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "group"
            ADD "memberStatus" boolean NOT NULL DEFAULT false
        `);
    }

}

import {MigrationInterface, QueryRunner} from "typeorm";

export class Migrations1646858514372 implements MigrationInterface {
    name = 'Migrations1646858514372'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "group" DROP COLUMN "memberStatus"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "memberStatus" boolean NOT NULL DEFAULT false
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "memberStatus"
        `);
        await queryRunner.query(`
            ALTER TABLE "group"
            ADD "memberStatus" boolean NOT NULL DEFAULT false
        `);
    }

}

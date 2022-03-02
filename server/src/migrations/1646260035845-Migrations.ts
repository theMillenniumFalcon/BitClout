import {MigrationInterface, QueryRunner} from "typeorm";

export class Migrations1646260035845 implements MigrationInterface {
    name = 'Migrations1646260035845'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "group"
            ADD "description" character varying NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "group" DROP COLUMN "description"
        `);
    }

}

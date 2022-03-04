import {MigrationInterface, QueryRunner} from "typeorm";

export class Migrations1646410456454 implements MigrationInterface {
    name = 'Migrations1646410456454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "group"
            ADD "creatorId" integer NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "group" DROP COLUMN "creatorId"
        `);
    }

}

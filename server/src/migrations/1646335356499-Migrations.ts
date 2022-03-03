import {MigrationInterface, QueryRunner} from "typeorm";

export class Migrations1646335356499 implements MigrationInterface {
    name = 'Migrations1646335356499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "member" (
                "members" integer NOT NULL DEFAULT '0',
                "userId" integer NOT NULL,
                "groupId" integer NOT NULL,
                CONSTRAINT "PK_4e3e4366436e4b8753d6f0c5927" PRIMARY KEY ("userId", "groupId")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "group"
            ADD "member" integer NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "member"
            ADD CONSTRAINT "FK_08897b166dee565859b7fb2fcc8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "member"
            ADD CONSTRAINT "FK_1fee827e34a9a032a93cb9d56e3" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "member" DROP CONSTRAINT "FK_1fee827e34a9a032a93cb9d56e3"
        `);
        await queryRunner.query(`
            ALTER TABLE "member" DROP CONSTRAINT "FK_08897b166dee565859b7fb2fcc8"
        `);
        await queryRunner.query(`
            ALTER TABLE "group" DROP COLUMN "member"
        `);
        await queryRunner.query(`
            DROP TABLE "member"
        `);
    }

}

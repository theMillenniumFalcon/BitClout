import {MigrationInterface, QueryRunner} from "typeorm";

export class Migrations1646071756746 implements MigrationInterface {
    name = 'Migrations1646071756746'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "upvote" (
                "value" integer NOT NULL,
                "userId" integer NOT NULL,
                "postId" integer NOT NULL,
                CONSTRAINT "PK_802ac6b9099f86aa24eb22d9c05" PRIMARY KEY ("userId", "postId")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "upvote"
            ADD CONSTRAINT "FK_3abd9f37a94f8db3c33bda4fdae" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "upvote"
            ADD CONSTRAINT "FK_efc79eb8b81262456adfcb87de1" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "upvote" DROP CONSTRAINT "FK_efc79eb8b81262456adfcb87de1"
        `);
        await queryRunner.query(`
            ALTER TABLE "upvote" DROP CONSTRAINT "FK_3abd9f37a94f8db3c33bda4fdae"
        `);
        await queryRunner.query(`
            DROP TABLE "upvote"
        `);
    }

}

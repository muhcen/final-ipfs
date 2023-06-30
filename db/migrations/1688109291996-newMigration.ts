import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1688109291996 implements MigrationInterface {
    name = 'NewMigration1688109291996'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ipfs" ADD "uploadTime" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ipfs" DROP COLUMN "uploadTime"`);
    }

}

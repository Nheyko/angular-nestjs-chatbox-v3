import { MigrationInterface, QueryRunner } from "typeorm";

export class Roles1710340477032 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO roles (name) VALUES ('Admin'), ('Moderator'), ('User')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "role"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1762031911376 implements MigrationInterface {
    name = ' $npmConfigName1762031911376'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP COLUMN \`nombreCompleto\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD \`nombreCompleto\` varchar(255) NOT NULL`);
    }

}

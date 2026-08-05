import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddUserTokenVersion1750185600000 implements MigrationInterface {
    name = 'AddUserTokenVersion1750185600000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('user', new TableColumn({
            name: 'tokenVersion',
            type: 'int',
            isNullable: false,
            default: 0,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('user', 'tokenVersion');
    }
}

import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddUserRole1749406000000 implements MigrationInterface {
    name = 'AddUserRole1749406000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('user', new TableColumn({
            name: 'role',
            type: 'varchar',
            length: '16',
            isNullable: false,
            default: "'usuario'",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('user', 'role');
    }
}

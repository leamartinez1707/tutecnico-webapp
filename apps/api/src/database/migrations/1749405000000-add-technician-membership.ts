import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddTechnicianMembership1749405000000 implements MigrationInterface {
    name = 'AddTechnicianMembership1749405000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('technician', new TableColumn({
            name: 'membershipType',
            type: 'varchar',
            length: '16',
            isNullable: false,
            default: "'NONE'",
        }));
        await queryRunner.addColumn('technician', new TableColumn({
            name: 'membershipActive',
            type: 'boolean',
            isNullable: false,
            default: false,
        }));
        await queryRunner.addColumn('technician', new TableColumn({
            name: 'membershipStartedAt',
            type: 'timestamp',
            isNullable: true,
        }));
        await queryRunner.addColumn('technician', new TableColumn({
            name: 'membershipExpiresAt',
            type: 'timestamp',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('technician', 'membershipExpiresAt');
        await queryRunner.dropColumn('technician', 'membershipStartedAt');
        await queryRunner.dropColumn('technician', 'membershipActive');
        await queryRunner.dropColumn('technician', 'membershipType');
    }
}

import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique, TableIndex } from "typeorm";

export class Migration1748557558890 implements MigrationInterface {
    name = 'Migration1748557558890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // user
        await queryRunner.createTable(new Table({
            name: 'user',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'username', type: 'varchar', isNullable: false },
                { name: 'firstName', type: 'varchar', isNullable: false },
                { name: 'lastName', type: 'varchar', isNullable: false },
                { name: 'email', type: 'varchar', isNullable: false },
                { name: 'password', type: 'varchar', isNullable: false },
                { name: 'phone', type: 'varchar', isNullable: false },
                { name: 'address', type: 'varchar', isNullable: false },
                { name: 'isActive', type: 'boolean', isNullable: false, default: true },
            ],
            uniques: [new TableUnique({ name: 'UQ_user_email_username_phone', columnNames: ['email', 'username', 'phone'] })],
        }));

        // technician
        await queryRunner.createTable(new Table({
            name: 'technician',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'specialization', type: 'varchar', isNullable: false },
                { name: 'latitude', type: 'decimal', precision: 10, scale: 7, isNullable: false },
                { name: 'longitude', type: 'decimal', precision: 10, scale: 7, isNullable: false },
                { name: 'services', type: 'text', isNullable: false },
                { name: 'userId', type: 'int', isNullable: true },
            ],
            uniques: [new TableUnique({ name: 'UQ_technician_user', columnNames: ['userId'] })],
            foreignKeys: [
                new TableForeignKey({
                    name: 'FK_technician_user',
                    columnNames: ['userId'],
                    referencedTableName: 'user',
                    referencedColumnNames: ['id'],
                    onDelete: 'NO ACTION',
                    onUpdate: 'NO ACTION',
                }),
            ],
        }));

        // booking
        await queryRunner.createTable(new Table({
            name: 'booking',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'date', type: 'timestamp', isNullable: false },
                { name: 'status', type: 'varchar', isNullable: false },
                { name: 'comment', type: 'varchar', isNullable: false },
                { name: 'userId', type: 'int', isNullable: true },
                { name: 'technicianId', type: 'int', isNullable: true },
            ],
            foreignKeys: [
                new TableForeignKey({
                    name: 'FK_booking_user',
                    columnNames: ['userId'],
                    referencedTableName: 'user',
                    referencedColumnNames: ['id'],
                    onDelete: 'NO ACTION',
                    onUpdate: 'NO ACTION',
                }),
                new TableForeignKey({
                    name: 'FK_booking_technician',
                    columnNames: ['technicianId'],
                    referencedTableName: 'technician',
                    referencedColumnNames: ['id'],
                    onDelete: 'NO ACTION',
                    onUpdate: 'NO ACTION',
                }),
            ],
        }));

        // review
        await queryRunner.createTable(new Table({
            name: 'review',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'rating', type: 'int', isNullable: false },
                { name: 'comment', type: 'varchar', isNullable: false },
                { name: 'date', type: 'timestamp', isNullable: false },
                { name: 'userId', type: 'int', isNullable: true },
                { name: 'technicianId', type: 'int', isNullable: true },
            ],
            foreignKeys: [
                new TableForeignKey({
                    name: 'FK_review_user',
                    columnNames: ['userId'],
                    referencedTableName: 'user',
                    referencedColumnNames: ['id'],
                    onDelete: 'NO ACTION',
                    onUpdate: 'NO ACTION',
                }),
                new TableForeignKey({
                    name: 'FK_review_technician',
                    columnNames: ['technicianId'],
                    referencedTableName: 'technician',
                    referencedColumnNames: ['id'],
                    onDelete: 'NO ACTION',
                    onUpdate: 'NO ACTION',
                }),
            ],
        }));

        // favorite
        await queryRunner.createTable(new Table({
            name: 'favorite',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'userId', type: 'int', isNullable: true },
                { name: 'technicianId', type: 'int', isNullable: true },
            ],
            uniques: [new TableUnique({ name: 'UQ_favorite_user_technician', columnNames: ['userId', 'technicianId'] })],
            foreignKeys: [
                new TableForeignKey({
                    name: 'FK_favorite_user',
                    columnNames: ['userId'],
                    referencedTableName: 'user',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                    onUpdate: 'NO ACTION',
                }),
                new TableForeignKey({
                    name: 'FK_favorite_technician',
                    columnNames: ['technicianId'],
                    referencedTableName: 'technician',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                    onUpdate: 'NO ACTION',
                }),
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('favorite', true);
        await queryRunner.dropTable('review', true);
        await queryRunner.dropTable('booking', true);
        await queryRunner.dropTable('technician', true);
        await queryRunner.dropTable('user', true);
    }

}

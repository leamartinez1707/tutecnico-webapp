import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreatePaymentTable1750200004000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'payment',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'mercadopagoPaymentId',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'mercadopagoPreferenceId',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '32',
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'planType',
            type: 'varchar',
            length: '16',
          },
          {
            name: 'externalReference',
            type: 'varchar',
            length: '512',
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'technicianId',
            type: 'int',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'payment',
      new TableForeignKey({
        columnNames: ['technicianId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'technician',
        onDelete: 'CASCADE',
      }),
    );

    // Índice para búsquedas por técnico
    await queryRunner.query(
      `CREATE INDEX "idx_payment_technician" ON payment ("technicianId")`,
    );

    // Índice para búsquedas por referencia externa
    await queryRunner.query(
      `CREATE INDEX "idx_payment_external_ref" ON payment ("externalReference")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_payment_external_ref"`);
    await queryRunner.query(`DROP INDEX "idx_payment_technician"`);
    
    const table = await queryRunner.getTable('payment');
    if (table) {
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('technicianId') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('payment', foreignKey);
      }
    }
    
    await queryRunner.dropTable('payment');
  }
}

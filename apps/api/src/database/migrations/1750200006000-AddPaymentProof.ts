import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class AddPaymentProof1750200006000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'payment_proof',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'membershipType',
            type: 'varchar',
            length: '16',
          },
          {
            name: 'transactionReference',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'transactionDate',
            type: 'timestamp',
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'bankAccount',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '16',
            default: "'PENDING'",
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
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'payment_proof',
      new TableForeignKey({
        columnNames: ['technicianId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'technician',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.query(
      `CREATE INDEX "idx_payment_proof_technician" ON payment_proof ("technicianId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_payment_proof_technician"`);

    const table = await queryRunner.getTable('payment_proof');
    if (table) {
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('technicianId') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('payment_proof', foreignKey);
      }
    }

    await queryRunner.dropTable('payment_proof');
  }
}

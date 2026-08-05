import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class NormalizeServicesAndUserVerification1750200000000 implements MigrationInterface {
  name = 'NormalizeServicesAndUserVerification1750200000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Services table
    await queryRunner.createTable(new Table({
      name: 'service',
      columns: [
        { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
        { name: 'name', type: 'varchar', length: '128', isNullable: false },
      ],
      uniques: [{ name: 'UQ_service_name', columnNames: ['name'] }]
    }), true);

    // Create technician_services join table
    await queryRunner.createTable(new Table({
      name: 'technician_services_service',
      columns: [
        { name: 'technicianId', type: 'int', isNullable: false },
        { name: 'serviceId', type: 'int', isNullable: false },
      ],
      uniques: [{ name: 'UQ_technician_service', columnNames: ['technicianId', 'serviceId'] }]
    }), true);

    await queryRunner.createForeignKey('technician_services_service', new TableForeignKey({
      columnNames: ['technicianId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'technician',
      onDelete: 'CASCADE'
    }));
    await queryRunner.createForeignKey('technician_services_service', new TableForeignKey({
      columnNames: ['serviceId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'service',
      onDelete: 'CASCADE'
    }));

    // Migrate existing simple-array services data if column exists
    const hasServicesColumn = await queryRunner.hasColumn('technician', 'services');
    if (hasServicesColumn) {
      const technicians = await queryRunner.query('SELECT id, services FROM technician');
      for (const tech of technicians) {
        if (!tech.services) continue;
        const serviceNames: string[] = String(tech.services).split(',').map((s: string) => s.trim().toLowerCase()).filter((s: string) => !!s);
        for (const name of serviceNames) {
          // Insert service if not exists
          const existing = await queryRunner.query('SELECT id FROM service WHERE name = $1', [name]);
          let serviceId: number;
          if (existing.length) {
            serviceId = existing[0].id;
          } else {
            const insertRes = await queryRunner.query('INSERT INTO service(name) VALUES ($1) RETURNING id', [name]);
            serviceId = insertRes[0].id;
          }
          // Link technician-service
          await queryRunner.query('INSERT INTO technician_services_service("technicianId", "serviceId") VALUES ($1, $2) ON CONFLICT DO NOTHING', [tech.id, serviceId]);
        }
      }
      // Drop old column
      await queryRunner.dropColumn('technician', 'services');
    }

    // Add verification / reset columns to user if not existing
    const userColumns = [
      new TableColumn({ name: 'emailVerified', type: 'boolean', isNullable: false, default: false }),
      new TableColumn({ name: 'emailVerificationToken', type: 'varchar', length: '128', isNullable: true }),
      new TableColumn({ name: 'passwordResetToken', type: 'varchar', length: '128', isNullable: true }),
      new TableColumn({ name: 'passwordResetExpires', type: 'timestamp', isNullable: true }),
    ];
    for (const col of userColumns) {
      const hasCol = await queryRunner.hasColumn('user', col.name);
      if (!hasCol) await queryRunner.addColumn('user', col);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recreate services column (data loss for simplicity)
    const hasServicesColumn = await queryRunner.hasColumn('technician', 'services');
    if (!hasServicesColumn) {
      await queryRunner.addColumn('technician', new TableColumn({ name: 'services', type: 'text', isNullable: true }));
    }
    await queryRunner.dropTable('technician_services_service', true);
    await queryRunner.dropTable('service', true);
    // Remove user columns
    const cols = ['emailVerified', 'emailVerificationToken', 'passwordResetToken', 'passwordResetExpires'];
    for (const col of cols) {
      if (await queryRunner.hasColumn('user', col)) {
        await queryRunner.dropColumn('user', col);
      }
    }
  }
}

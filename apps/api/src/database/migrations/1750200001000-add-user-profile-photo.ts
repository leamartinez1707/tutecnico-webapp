import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserProfilePhoto1750200001000 implements MigrationInterface {
  name = 'AddUserProfilePhoto1750200001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('user', 'profilePhotoUrl');
    if (!hasColumn) {
      await queryRunner.addColumn('user', new TableColumn({
        name: 'profilePhotoUrl',
        type: 'varchar',
        length: '512',
        isNullable: true,
      }));
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('user', 'profilePhotoUrl');
    if (hasColumn) {
      await queryRunner.dropColumn('user', 'profilePhotoUrl');
    }
  }
}

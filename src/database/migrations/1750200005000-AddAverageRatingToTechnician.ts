import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAverageRatingToTechnician1750200005000 implements MigrationInterface {
    name = 'AddAverageRatingToTechnician1750200005000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "technician" ADD "averageRating" numeric(3,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`UPDATE "technician" t SET "averageRating" = COALESCE(sub.avg, 0) FROM (
            SELECT "technicianId" as tid, ROUND(AVG("rating")::numeric, 2) as avg
            FROM "review" GROUP BY "technicianId"
        ) sub WHERE sub.tid = t.id`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "technician" DROP COLUMN "averageRating"`);
    }
}

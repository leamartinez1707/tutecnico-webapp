import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTechnicianReviewsCount1751200000000 implements MigrationInterface {
    name = 'AddTechnicianReviewsCount1751200000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "technician" ADD "reviewsCount" integer NOT NULL DEFAULT 0`);
        // Backfill reviewsCount from existing reviews
        await queryRunner.query(`UPDATE "technician" t SET "reviewsCount" = COALESCE(rc.cnt, 0) FROM (
            SELECT r."technicianId" as tid, COUNT(*) as cnt
            FROM "review" r
            GROUP BY r."technicianId"
        ) rc WHERE rc.tid = t.id`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "technician" DROP COLUMN "reviewsCount"`);
    }
}

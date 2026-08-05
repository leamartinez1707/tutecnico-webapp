import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTechnicianCreatedAt1785974138143 implements MigrationInterface {
    name = 'AddTechnicianCreatedAt1785974138143'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_booking_technician"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_booking_user"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_favorite_technician"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_favorite_user"`);
        await queryRunner.query(`ALTER TABLE "profession" DROP CONSTRAINT "profession_service_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "technician" DROP CONSTRAINT "FK_technician_user"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_review_technician"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_review_user"`);
        await queryRunner.query(`ALTER TABLE "technician_services_service" DROP CONSTRAINT "FK_00088e7e094fffd07fee953e38e"`);
        await queryRunner.query(`ALTER TABLE "technician_services_service" DROP CONSTRAINT "FK_2d1c2c576a94a75be0aaf2993ef"`);
        await queryRunner.query(`DROP INDEX "public"."idx_payment_technician"`);
        await queryRunner.query(`DROP INDEX "public"."idx_payment_external_ref"`);
        await queryRunner.query(`DROP INDEX "public"."idx_payment_proof_technician"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "UQ_favorite_user_technician"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_user_email_username_phone"`);
        await queryRunner.query(`ALTER TABLE "technician_services_service" DROP CONSTRAINT "UQ_technician_service"`);
        await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "service" ADD "description" character varying(512)`);
        await queryRunner.query(`ALTER TABLE "technician" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "technician_services_service" ADD CONSTRAINT "PK_4f29ca7fb6c866eb995b0b429b0" PRIMARY KEY ("technicianId", "serviceId")`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_b137a28ab23fedf9dd0b8800c4c"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "UQ_52446a8c00026ec6344eab94fd6"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "mercadopagoPaymentId"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "mercadopagoPaymentId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "UQ_52446a8c00026ec6344eab94fd6" UNIQUE ("mercadopagoPaymentId")`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "mercadopagoPreferenceId"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "mercadopagoPreferenceId" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "technicianId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_proof" DROP CONSTRAINT "FK_f088d4d4406695f8a84e4f9ab4a"`);
        await queryRunner.query(`ALTER TABLE "payment_proof" DROP COLUMN "transactionReference"`);
        await queryRunner.query(`ALTER TABLE "payment_proof" ADD "transactionReference" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_proof" DROP COLUMN "bankAccount"`);
        await queryRunner.query(`ALTER TABLE "payment_proof" ADD "bankAccount" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_proof" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "payment_proof" ALTER COLUMN "technicianId" DROP NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_2d1c2c576a94a75be0aaf2993e" ON "technician_services_service" ("technicianId") `);
        await queryRunner.query(`CREATE INDEX "IDX_00088e7e094fffd07fee953e38" ON "technician_services_service" ("serviceId") `);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "UQ_713f42c808cf5ca08f75548c389" UNIQUE ("userId", "technicianId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_9e7160a7c4385e72483dfdc2379" UNIQUE ("email", "username", "phone")`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_336b3f4a235460dc93645fbf222" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_61ada9b3de7aaea887943befd84" FOREIGN KEY ("technicianId") REFERENCES "technician"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_83b775fdebbe24c29b2b5831f2d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_079105a6fa2ce23635672bf71f6" FOREIGN KEY ("technicianId") REFERENCES "technician"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profession" ADD CONSTRAINT "FK_8b04e7922b3c1dd9954ebe1ecc7" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "technician" ADD CONSTRAINT "FK_3460c2782b55e2b2e455161e2de" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_2f8a88b15d37682a0f38eaa7b9d" FOREIGN KEY ("technicianId") REFERENCES "technician"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_b137a28ab23fedf9dd0b8800c4c" FOREIGN KEY ("technicianId") REFERENCES "technician"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_proof" ADD CONSTRAINT "FK_f088d4d4406695f8a84e4f9ab4a" FOREIGN KEY ("technicianId") REFERENCES "technician"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "technician_services_service" ADD CONSTRAINT "FK_2d1c2c576a94a75be0aaf2993ef" FOREIGN KEY ("technicianId") REFERENCES "technician"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "technician_services_service" ADD CONSTRAINT "FK_00088e7e094fffd07fee953e38e" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "technician_services_service" DROP CONSTRAINT "FK_00088e7e094fffd07fee953e38e"`);
        await queryRunner.query(`ALTER TABLE "technician_services_service" DROP CONSTRAINT "FK_2d1c2c576a94a75be0aaf2993ef"`);
        await queryRunner.query(`ALTER TABLE "payment_proof" DROP CONSTRAINT "FK_f088d4d4406695f8a84e4f9ab4a"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_b137a28ab23fedf9dd0b8800c4c"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_2f8a88b15d37682a0f38eaa7b9d"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_1337f93918c70837d3cea105d39"`);
        await queryRunner.query(`ALTER TABLE "technician" DROP CONSTRAINT "FK_3460c2782b55e2b2e455161e2de"`);
        await queryRunner.query(`ALTER TABLE "profession" DROP CONSTRAINT "FK_8b04e7922b3c1dd9954ebe1ecc7"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_079105a6fa2ce23635672bf71f6"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_83b775fdebbe24c29b2b5831f2d"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_61ada9b3de7aaea887943befd84"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_336b3f4a235460dc93645fbf222"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_9e7160a7c4385e72483dfdc2379"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "UQ_713f42c808cf5ca08f75548c389"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_00088e7e094fffd07fee953e38"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2d1c2c576a94a75be0aaf2993e"`);
        await queryRunner.query(`ALTER TABLE "payment_proof" ALTER COLUMN "technicianId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_proof" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "payment_proof" DROP COLUMN "bankAccount"`);
        await queryRunner.query(`ALTER TABLE "payment_proof" ADD "bankAccount" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_proof" DROP COLUMN "transactionReference"`);
        await queryRunner.query(`ALTER TABLE "payment_proof" ADD "transactionReference" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_proof" ADD CONSTRAINT "FK_f088d4d4406695f8a84e4f9ab4a" FOREIGN KEY ("technicianId") REFERENCES "technician"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "technicianId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "mercadopagoPreferenceId"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "mercadopagoPreferenceId" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "UQ_52446a8c00026ec6344eab94fd6"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "mercadopagoPaymentId"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "mercadopagoPaymentId" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "UQ_52446a8c00026ec6344eab94fd6" UNIQUE ("mercadopagoPaymentId")`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_b137a28ab23fedf9dd0b8800c4c" FOREIGN KEY ("technicianId") REFERENCES "technician"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "technician_services_service" DROP CONSTRAINT "PK_4f29ca7fb6c866eb995b0b429b0"`);
        await queryRunner.query(`ALTER TABLE "technician" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "service" ADD "description" character varying(512)`);
        await queryRunner.query(`ALTER TABLE "technician_services_service" ADD CONSTRAINT "UQ_technician_service" UNIQUE ("technicianId", "serviceId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_user_email_username_phone" UNIQUE ("username", "email", "phone")`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "UQ_favorite_user_technician" UNIQUE ("userId", "technicianId")`);
        await queryRunner.query(`CREATE INDEX "idx_payment_proof_technician" ON "payment_proof" ("technicianId") `);
        await queryRunner.query(`CREATE INDEX "idx_payment_external_ref" ON "payment" ("externalReference") `);
        await queryRunner.query(`CREATE INDEX "idx_payment_technician" ON "payment" ("technicianId") `);
        await queryRunner.query(`ALTER TABLE "technician_services_service" ADD CONSTRAINT "FK_2d1c2c576a94a75be0aaf2993ef" FOREIGN KEY ("technicianId") REFERENCES "technician"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "technician_services_service" ADD CONSTRAINT "FK_00088e7e094fffd07fee953e38e" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_review_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_review_technician" FOREIGN KEY ("technicianId") REFERENCES "technician"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "technician" ADD CONSTRAINT "FK_technician_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profession" ADD CONSTRAINT "profession_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_favorite_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_favorite_technician" FOREIGN KEY ("technicianId") REFERENCES "technician"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_booking_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_booking_technician" FOREIGN KEY ("technicianId") REFERENCES "technician"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

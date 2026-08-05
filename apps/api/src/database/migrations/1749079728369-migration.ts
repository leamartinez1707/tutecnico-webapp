import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749079728369 implements MigrationInterface {
    name = 'Migration1749079728369'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`booking\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` datetime NOT NULL, \`status\` varchar(255) NOT NULL, \`comment\` varchar(255) NOT NULL, \`userId\` int NULL, \`technicianId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`favorite\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NULL, \`technicianId\` int NULL, UNIQUE INDEX \`IDX_713f42c808cf5ca08f75548c38\` (\`userId\`, \`technicianId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`technician\` (\`id\` int NOT NULL AUTO_INCREMENT, \`specialization\` varchar(255) NOT NULL, \`latitude\` decimal(10,7) NOT NULL, \`longitude\` decimal(10,7) NOT NULL, \`services\` text NOT NULL, \`userId\` int NULL, UNIQUE INDEX \`REL_3460c2782b55e2b2e455161e2d\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`review\` (\`id\` int NOT NULL AUTO_INCREMENT, \`rating\` int NOT NULL, \`comment\` varchar(255) NOT NULL, \`date\` datetime NOT NULL, \`userId\` int NULL, \`technicianId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_9e7160a7c4385e72483dfdc237\` (\`email\`, \`username\`, \`phone\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`booking\` ADD CONSTRAINT \`FK_336b3f4a235460dc93645fbf222\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`booking\` ADD CONSTRAINT \`FK_61ada9b3de7aaea887943befd84\` FOREIGN KEY (\`technicianId\`) REFERENCES \`technician\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`favorite\` ADD CONSTRAINT \`FK_83b775fdebbe24c29b2b5831f2d\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`favorite\` ADD CONSTRAINT \`FK_079105a6fa2ce23635672bf71f6\` FOREIGN KEY (\`technicianId\`) REFERENCES \`technician\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`technician\` ADD CONSTRAINT \`FK_3460c2782b55e2b2e455161e2de\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`review\` ADD CONSTRAINT \`FK_1337f93918c70837d3cea105d39\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`review\` ADD CONSTRAINT \`FK_2f8a88b15d37682a0f38eaa7b9d\` FOREIGN KEY (\`technicianId\`) REFERENCES \`technician\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_2f8a88b15d37682a0f38eaa7b9d\``);
        await queryRunner.query(`ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_1337f93918c70837d3cea105d39\``);
        await queryRunner.query(`ALTER TABLE \`technician\` DROP FOREIGN KEY \`FK_3460c2782b55e2b2e455161e2de\``);
        await queryRunner.query(`ALTER TABLE \`favorite\` DROP FOREIGN KEY \`FK_079105a6fa2ce23635672bf71f6\``);
        await queryRunner.query(`ALTER TABLE \`favorite\` DROP FOREIGN KEY \`FK_83b775fdebbe24c29b2b5831f2d\``);
        await queryRunner.query(`ALTER TABLE \`booking\` DROP FOREIGN KEY \`FK_61ada9b3de7aaea887943befd84\``);
        await queryRunner.query(`ALTER TABLE \`booking\` DROP FOREIGN KEY \`FK_336b3f4a235460dc93645fbf222\``);
        await queryRunner.query(`DROP INDEX \`IDX_9e7160a7c4385e72483dfdc237\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`review\``);
        await queryRunner.query(`DROP INDEX \`REL_3460c2782b55e2b2e455161e2d\` ON \`technician\``);
        await queryRunner.query(`DROP TABLE \`technician\``);
        await queryRunner.query(`DROP INDEX \`IDX_713f42c808cf5ca08f75548c38\` ON \`favorite\``);
        await queryRunner.query(`DROP TABLE \`favorite\``);
        await queryRunner.query(`DROP TABLE \`booking\``);
    }

}

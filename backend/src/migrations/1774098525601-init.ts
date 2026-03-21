import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1774098525601 implements MigrationInterface {
    name = 'Init1774098525601'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."booking_status_enum" AS ENUM('SUCCESS', 'FAILED', 'PENDING')`);
        await queryRunner.query(`CREATE TABLE "booking" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userEmail" character varying(255) NOT NULL, "quantity" integer NOT NULL, "totalAmount" numeric(10,2) NOT NULL, "status" "public"."booking_status_enum" NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "eventId" uuid, "ticketTierId" uuid, CONSTRAINT "CHK_bf1ef95e7ca514cb05f7a880c1" CHECK ("totalAmount" > 0), CONSTRAINT "CHK_e9d5f47f28155c09d9bf27138a" CHECK ("quantity" > 0), CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7911dde44a4ed698f4832ae024" ON "booking" ("userEmail") `);
        await queryRunner.query(`CREATE INDEX "IDX_4dce7ee7f022bba53dc457c419" ON "booking" ("ticketTierId", "status") `);
        await queryRunner.query(`CREATE INDEX "IDX_7a5c15da452e89df99176d326c" ON "booking" ("userEmail", "eventId") `);
        await queryRunner.query(`CREATE TYPE "public"."ticket_tier_name_enum" AS ENUM('VIP', 'FRONT_ROW', 'GA')`);
        await queryRunner.query(`CREATE TABLE "ticket_tier" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" "public"."ticket_tier_name_enum" NOT NULL, "price" numeric(10,2) NOT NULL, "totalQuantity" integer NOT NULL, "availableQuantity" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "eventId" uuid, CONSTRAINT "CHK_36724fdead84c3fd83c6952ac2" CHECK ("price" > 0), CONSTRAINT "CHK_2e6eaf688ddbcb298893924e94" CHECK ("availableQuantity" <= "totalQuantity"), CONSTRAINT "CHK_a42275882a5210a4b10e38495d" CHECK ("totalQuantity" > 0), CONSTRAINT "CHK_781a9d07159d3fee9c2e9f5c60" CHECK ("availableQuantity" >= 0), CONSTRAINT "PK_3a637a1e713d04b2ed80fc5d78d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9c8266fa4453e386f827134c70" ON "ticket_tier" ("eventId", "name") `);
        await queryRunner.query(`CREATE TABLE "event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "venue" character varying(255) NOT NULL, "eventDate" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_150b22121790781fc107c8bc1b" ON "event" ("eventDate") `);
        await queryRunner.query(`CREATE INDEX "IDX_3aeecff3130d099af5def4a872" ON "event" ("name", "venue") `);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_161ef84a823b75f741862a77138" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_c6dc0e2b0b6f9d039aa6cd6471a" FOREIGN KEY ("ticketTierId") REFERENCES "ticket_tier"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket_tier" ADD CONSTRAINT "FK_f8477dfcb7c6e53472b7674a898" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket_tier" DROP CONSTRAINT "FK_f8477dfcb7c6e53472b7674a898"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_c6dc0e2b0b6f9d039aa6cd6471a"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_161ef84a823b75f741862a77138"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3aeecff3130d099af5def4a872"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_150b22121790781fc107c8bc1b"`);
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9c8266fa4453e386f827134c70"`);
        await queryRunner.query(`DROP TABLE "ticket_tier"`);
        await queryRunner.query(`DROP TYPE "public"."ticket_tier_name_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7a5c15da452e89df99176d326c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4dce7ee7f022bba53dc457c419"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7911dde44a4ed698f4832ae024"`);
        await queryRunner.query(`DROP TABLE "booking"`);
        await queryRunner.query(`DROP TYPE "public"."booking_status_enum"`);
    }

}

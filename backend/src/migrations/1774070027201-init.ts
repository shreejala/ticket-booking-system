import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1774070027201 implements MigrationInterface {
    name = 'Init1774070027201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."booking_status_enum" AS ENUM('SUCCESS', 'FAILED', 'PENDING')`);
        await queryRunner.query(`CREATE TABLE "booking" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userEmail" character varying NOT NULL, "quantity" integer NOT NULL, "status" "public"."booking_status_enum" NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "eventId" uuid, "ticketTierId" uuid, CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."ticket_tier_name_enum" AS ENUM('VIP', 'FRONT_ROW', 'GA')`);
        await queryRunner.query(`CREATE TABLE "ticket_tier" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" "public"."ticket_tier_name_enum" NOT NULL, "price" numeric NOT NULL, "totalQuantity" integer NOT NULL, "availableQuantity" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "eventId" uuid, CONSTRAINT "PK_3a637a1e713d04b2ed80fc5d78d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "venue" character varying(255) NOT NULL, "eventDate" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_161ef84a823b75f741862a77138" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_c6dc0e2b0b6f9d039aa6cd6471a" FOREIGN KEY ("ticketTierId") REFERENCES "ticket_tier"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket_tier" ADD CONSTRAINT "FK_f8477dfcb7c6e53472b7674a898" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket_tier" DROP CONSTRAINT "FK_f8477dfcb7c6e53472b7674a898"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_c6dc0e2b0b6f9d039aa6cd6471a"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_161ef84a823b75f741862a77138"`);
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`DROP TABLE "ticket_tier"`);
        await queryRunner.query(`DROP TYPE "public"."ticket_tier_name_enum"`);
        await queryRunner.query(`DROP TABLE "booking"`);
        await queryRunner.query(`DROP TYPE "public"."booking_status_enum"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm"

export class RoleCreate1683100438650 implements MigrationInterface {
  name = "RoleCreate1683100438650"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "permissions" jsonb DEFAULT '[]', CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`
    )

    await queryRunner.query(
      `CREATE TABLE "groups" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "description" character varying NOT NULL, "role_id" character varying, CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "group_users" ("group_id" character varying NOT NULL, "user_id" character varying NOT NULL, CONSTRAINT "PK_36620c8747186b00c458893c594" PRIMARY KEY ("group_id", "user_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_be6db0d7dabab05d97233d19f6" ON "group_users" ("group_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_eba8af4e65056abb4c5f62556c" ON "group_users" ("user_id") `
    )
    await queryRunner.query(
      `ALTER TABLE "groups" ADD CONSTRAINT "FK_b5ec4f59d8703473034ee7d89b2" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "group_users" ADD CONSTRAINT "FK_be6db0d7dabab05d97233d19f61" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "group_users" ADD CONSTRAINT "FK_eba8af4e65056abb4c5f62556c6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "group_users" DROP CONSTRAINT "FK_eba8af4e65056abb4c5f62556c6"`
    )
    await queryRunner.query(
      `ALTER TABLE "group_users" DROP CONSTRAINT "FK_be6db0d7dabab05d97233d19f61"`
    )
    await queryRunner.query(
      `ALTER TABLE "groups" DROP CONSTRAINT "FK_b5ec4f59d8703473034ee7d89b2"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_eba8af4e65056abb4c5f62556c"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_be6db0d7dabab05d97233d19f6"`
    )
    await queryRunner.query(`DROP TABLE "group_users"`)
    await queryRunner.query(`DROP TABLE "groups"`)

    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP TABLE "role"`)
  }
}

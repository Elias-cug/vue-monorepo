/*
 Navicat Premium Dump SQL

 Source Server         : postgresql
 Source Server Type    : PostgreSQL
 Source Server Version : 140019 (140019)
 Source Host           : localhost:5432
 Source Catalog        : le_admin
 Source Schema         : le_auth

 Target Server Type    : PostgreSQL
 Target Server Version : 140019 (140019)
 File Encoding         : 65001

 Date: 10/07/2026 10:15:28
*/


-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS "le_auth"."roles";
CREATE TABLE "le_auth"."roles" (
  "id" int8 NOT NULL DEFAULT nextval('"le_auth".roles_id_seq'::regclass),
  "tenant_id" int8,
  "code" varchar(64) COLLATE "pg_catalog"."default" NOT NULL,
  "name" varchar(64) COLLATE "pg_catalog"."default" NOT NULL,
  "display_name" varchar(128) COLLATE "pg_catalog"."default",
  "description" varchar(255) COLLATE "pg_catalog"."default",
  "status" int2 NOT NULL DEFAULT 1,
  "is_system" bool NOT NULL DEFAULT false,
  "sort" int4 NOT NULL DEFAULT 0,
  "created_at" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by" int8,
  "updated_by" int8,
  "deleted_at" timestamp(6),
  "deleted_by" int8
)
;
ALTER TABLE "le_auth"."roles" OWNER TO "postgres";

-- ----------------------------
-- Indexes structure for table roles
-- ----------------------------
CREATE INDEX "idx_roles_code" ON "le_auth"."roles" USING btree (
  "code" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_roles_tenant_deleted" ON "le_auth"."roles" USING btree (
  "tenant_id" "pg_catalog"."int8_ops" ASC NULLS LAST,
  "deleted_at" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE INDEX "idx_roles_tenant_sort" ON "le_auth"."roles" USING btree (
  "tenant_id" "pg_catalog"."int8_ops" ASC NULLS LAST,
  "sort" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "idx_roles_tenant_status_deleted" ON "le_auth"."roles" USING btree (
  "tenant_id" "pg_catalog"."int8_ops" ASC NULLS LAST,
  "status" "pg_catalog"."int2_ops" ASC NULLS LAST,
  "deleted_at" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "uk_roles_tenant_code_active" ON "le_auth"."roles" USING btree (
  "tenant_id" "pg_catalog"."int8_ops" ASC NULLS LAST,
  "code" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX "uk_roles_tenant_name_active" ON "le_auth"."roles" USING btree (
  "tenant_id" "pg_catalog"."int8_ops" ASC NULLS LAST,
  "name" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
) WHERE deleted_at IS NULL;

-- ----------------------------
-- Triggers structure for table roles
-- ----------------------------
CREATE TRIGGER "trg_roles_updated_at" BEFORE UPDATE ON "le_auth"."roles"
FOR EACH ROW
EXECUTE PROCEDURE "le_auth"."update_updated_at_column"();

-- ----------------------------
-- Checks structure for table roles
-- ----------------------------
ALTER TABLE "le_auth"."roles" ADD CONSTRAINT "chk_roles_status" CHECK (status = ANY (ARRAY[0, 1]));
ALTER TABLE "le_auth"."roles" ADD CONSTRAINT "chk_roles_code_not_empty" CHECK (code::text <> ''::text);

-- ----------------------------
-- Primary Key structure for table roles
-- ----------------------------
ALTER TABLE "le_auth"."roles" ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");

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

 Date: 10/07/2026 10:14:52
*/


-- ----------------------------
-- Table structure for organization
-- ----------------------------
DROP TABLE IF EXISTS "le_auth"."organization";
CREATE TABLE "le_auth"."organization" (
  "id" int8 NOT NULL DEFAULT nextval('"le_auth".organization_id_seq'::regclass),
  "tenant_id" int8 NOT NULL,
  "parent_id" int8,
  "name" varchar(128) COLLATE "pg_catalog"."default" NOT NULL,
  "code" varchar(64) COLLATE "pg_catalog"."default" NOT NULL,
  "org_type" varchar(32) COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'department'::character varying,
  "sort_order" int2 NOT NULL DEFAULT 0,
  "status" int2 NOT NULL DEFAULT 1,
  "remark" varchar(255) COLLATE "pg_catalog"."default",
  "is_deleted" bool NOT NULL DEFAULT false,
  "created_at" timestamp(6) NOT NULL DEFAULT now(),
  "updated_at" timestamp(6) NOT NULL DEFAULT now(),
  "created_by" int8,
  "updated_by" int8
)
;
ALTER TABLE "le_auth"."organization" OWNER TO "postgres";

-- ----------------------------
-- Indexes structure for table organization
-- ----------------------------
CREATE INDEX "idx_organization_parent_id" ON "le_auth"."organization" USING btree (
  "parent_id" "pg_catalog"."int8_ops" ASC NULLS LAST
);
CREATE INDEX "idx_organization_tenant_status" ON "le_auth"."organization" USING btree (
  "tenant_id" "pg_catalog"."int8_ops" ASC NULLS LAST,
  "status" "pg_catalog"."int2_ops" ASC NULLS LAST
) WHERE is_deleted = false;

-- ----------------------------
-- Uniques structure for table organization
-- ----------------------------
ALTER TABLE "le_auth"."organization" ADD CONSTRAINT "uq_organization_tenant_code" UNIQUE ("tenant_id", "code");

-- ----------------------------
-- Primary Key structure for table organization
-- ----------------------------
ALTER TABLE "le_auth"."organization" ADD CONSTRAINT "organization_pkey" PRIMARY KEY ("id");

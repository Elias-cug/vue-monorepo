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

 Date: 10/07/2026 10:12:13
*/


-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS "le_auth"."user";
CREATE TABLE "le_auth"."user" (
  "id" int8 NOT NULL DEFAULT nextval('"le_auth".user_id_seq'::regclass),
  "tenant_id" int8 NOT NULL,
  "username" varchar(64) COLLATE "pg_catalog"."default" NOT NULL,
  "email" varchar(128) COLLATE "pg_catalog"."default",
  "phone" varchar(32) COLLATE "pg_catalog"."default",
  "password_hash" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "status" int2 NOT NULL DEFAULT 1,
  "is_deleted" bool NOT NULL DEFAULT false,
  "display_name" varchar(128) COLLATE "pg_catalog"."default",
  "avatar_url" varchar(255) COLLATE "pg_catalog"."default",
  "last_login_at" timestamp(6),
  "last_login_ip" inet,
  "created_at" timestamp(6) NOT NULL DEFAULT now(),
  "updated_at" timestamp(6) NOT NULL DEFAULT now(),
  "created_by" int8,
  "updated_by" int8,
  "is_password_changed" bool DEFAULT false,
  "password_updated_at" timestamp(6),
  "password_expires_at" timestamp(6),
  "login_failed_count" int4 DEFAULT 0,
  "last_login_failed_at" timestamp(6),
  "is_locked" bool DEFAULT false,
  "locked_until" timestamp(6),
  "is_first_login" bool DEFAULT true,
  "organization_id" int8
)
;
ALTER TABLE "le_auth"."user" OWNER TO "postgres";
COMMENT ON COLUMN "le_auth"."user"."id" IS '主键ID';
COMMENT ON COLUMN "le_auth"."user"."tenant_id" IS '租户ID';
COMMENT ON COLUMN "le_auth"."user"."username" IS '用户名';
COMMENT ON COLUMN "le_auth"."user"."email" IS '邮箱';
COMMENT ON COLUMN "le_auth"."user"."phone" IS '手机号';
COMMENT ON COLUMN "le_auth"."user"."password_hash" IS '密码哈希';
COMMENT ON COLUMN "le_auth"."user"."status" IS '用户状态';
COMMENT ON COLUMN "le_auth"."user"."is_deleted" IS '是否删除';
COMMENT ON COLUMN "le_auth"."user"."display_name" IS '显示名称';
COMMENT ON COLUMN "le_auth"."user"."avatar_url" IS '头像地址';
COMMENT ON COLUMN "le_auth"."user"."last_login_at" IS '最后登录时间';
COMMENT ON COLUMN "le_auth"."user"."last_login_ip" IS '最后登录IP';
COMMENT ON COLUMN "le_auth"."user"."created_at" IS '创建时间';
COMMENT ON COLUMN "le_auth"."user"."updated_at" IS '更新时间';
COMMENT ON COLUMN "le_auth"."user"."created_by" IS '创建人';
COMMENT ON COLUMN "le_auth"."user"."updated_by" IS '更新人';
COMMENT ON COLUMN "le_auth"."user"."is_password_changed" IS '用户是否已主动修改过密码（首次登录需修改）';
COMMENT ON COLUMN "le_auth"."user"."password_updated_at" IS '最近一次密码修改时间';
COMMENT ON COLUMN "le_auth"."user"."password_expires_at" IS '密码失效时间（用于强制周期更换）';
COMMENT ON COLUMN "le_auth"."user"."login_failed_count" IS '连续登录失败次数（用于防暴力破解）';
COMMENT ON COLUMN "le_auth"."user"."last_login_failed_at" IS '最近一次登录失败时间';
COMMENT ON COLUMN "le_auth"."user"."is_locked" IS '账户是否被锁定（登录失败触发）';
COMMENT ON COLUMN "le_auth"."user"."locked_until" IS '账户锁定自动解除时间';
COMMENT ON COLUMN "le_auth"."user"."is_first_login" IS '是否首次登录（用于强制修改初始密码）';
COMMENT ON TABLE "le_auth"."user" IS '系统用户表（包含认证、登录安全及审计信息）';

-- ----------------------------
-- Indexes structure for table user
-- ----------------------------
CREATE INDEX "idx_user_last_login" ON "le_auth"."user" USING btree (
  "last_login_at" "pg_catalog"."timestamp_ops" DESC NULLS FIRST
);
CREATE INDEX "idx_user_login" ON "le_auth"."user" USING btree (
  "tenant_id" "pg_catalog"."int8_ops" ASC NULLS LAST,
  "username" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
) WHERE is_deleted = false;
CREATE INDEX "idx_user_organization_id" ON "le_auth"."user" USING btree (
  "organization_id" "pg_catalog"."int8_ops" ASC NULLS LAST
) WHERE is_deleted = false;
CREATE INDEX "idx_user_status" ON "le_auth"."user" USING btree (
  "status" "pg_catalog"."int2_ops" ASC NULLS LAST
);
CREATE INDEX "idx_user_tenant" ON "le_auth"."user" USING btree (
  "tenant_id" "pg_catalog"."int8_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "uniq_user_tenant_username" ON "le_auth"."user" USING btree (
  "tenant_id" "pg_catalog"."int8_ops" ASC NULLS LAST,
  "username" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
) WHERE is_deleted = false;

-- ----------------------------
-- Checks structure for table user
-- ----------------------------
ALTER TABLE "le_auth"."user" ADD CONSTRAINT "chk_user_status" CHECK (status = ANY (ARRAY[0, 1]));
ALTER TABLE "le_auth"."user" ADD CONSTRAINT "chk_login_failed" CHECK (login_failed_count >= 0);

-- ----------------------------
-- Primary Key structure for table user
-- ----------------------------
ALTER TABLE "le_auth"."user" ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table user
-- ----------------------------
ALTER TABLE "le_auth"."user" ADD CONSTRAINT "fk_user_organization" FOREIGN KEY ("organization_id") REFERENCES "le_auth"."organization" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

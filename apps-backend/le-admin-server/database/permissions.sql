CREATE SCHEMA IF NOT EXISTS "le_auth";

CREATE SEQUENCE IF NOT EXISTS "le_auth"."permissions_id_seq";
CREATE SEQUENCE IF NOT EXISTS "le_auth"."role_permissions_id_seq";

CREATE OR REPLACE FUNCTION "le_auth"."update_updated_at_column"()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS "le_auth"."permissions" (
  "id" int8 NOT NULL DEFAULT nextval('"le_auth".permissions_id_seq'::regclass),
  "tenant_id" int8 NOT NULL,
  "application_id" int8 NOT NULL,
  "parent_id" int8,
  "code" varchar(128) COLLATE "pg_catalog"."default" NOT NULL,
  "name" varchar(64) COLLATE "pg_catalog"."default" NOT NULL,
  "display_name" varchar(128) COLLATE "pg_catalog"."default",
  "type" varchar(16) COLLATE "pg_catalog"."default" NOT NULL,
  "route_path" varchar(255) COLLATE "pg_catalog"."default",
  "component" varchar(255) COLLATE "pg_catalog"."default",
  "icon" varchar(128) COLLATE "pg_catalog"."default",
  "description" varchar(255) COLLATE "pg_catalog"."default",
  "status" int2 NOT NULL DEFAULT 1,
  "is_system" bool NOT NULL DEFAULT false,
  "sort" int4 NOT NULL DEFAULT 0,
  "created_at" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by" int8,
  "updated_by" int8,
  "deleted_at" timestamp(6),
  "deleted_by" int8,
  CONSTRAINT "permissions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "chk_permissions_status" CHECK (status = ANY (ARRAY[0, 1])),
  CONSTRAINT "chk_permissions_type" CHECK (type::text = ANY (ARRAY['app', 'menu', 'button'])),
  CONSTRAINT "chk_permissions_code_not_empty" CHECK (code::text <> ''::text),
  CONSTRAINT "fk_permissions_application" FOREIGN KEY ("application_id") REFERENCES "le_auth"."applications" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT "fk_permissions_parent" FOREIGN KEY ("parent_id") REFERENCES "le_auth"."permissions" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

ALTER SEQUENCE "le_auth"."permissions_id_seq" OWNED BY "le_auth"."permissions"."id";

CREATE INDEX IF NOT EXISTS "idx_permissions_application" ON "le_auth"."permissions" USING btree (
  "application_id" "pg_catalog"."int8_ops" ASC NULLS LAST
);
CREATE INDEX IF NOT EXISTS "idx_permissions_parent" ON "le_auth"."permissions" USING btree (
  "parent_id" "pg_catalog"."int8_ops" ASC NULLS LAST
);
CREATE INDEX IF NOT EXISTS "idx_permissions_tenant_application_deleted" ON "le_auth"."permissions" USING btree (
  "tenant_id" "pg_catalog"."int8_ops" ASC NULLS LAST,
  "application_id" "pg_catalog"."int8_ops" ASC NULLS LAST,
  "deleted_at" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE INDEX IF NOT EXISTS "idx_permissions_tenant_type_status" ON "le_auth"."permissions" USING btree (
  "tenant_id" "pg_catalog"."int8_ops" ASC NULLS LAST,
  "type" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST,
  "status" "pg_catalog"."int2_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX IF NOT EXISTS "uk_permissions_tenant_application_code_active" ON "le_auth"."permissions" USING btree (
  "tenant_id" "pg_catalog"."int8_ops" ASC NULLS LAST,
  "application_id" "pg_catalog"."int8_ops" ASC NULLS LAST,
  "code" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
) WHERE deleted_at IS NULL;

DROP TRIGGER IF EXISTS "trg_permissions_updated_at" ON "le_auth"."permissions";
CREATE TRIGGER "trg_permissions_updated_at" BEFORE UPDATE ON "le_auth"."permissions"
FOR EACH ROW
EXECUTE PROCEDURE "le_auth"."update_updated_at_column"();

CREATE TABLE IF NOT EXISTS "le_auth"."role_permissions" (
  "id" int8 NOT NULL DEFAULT nextval('"le_auth".role_permissions_id_seq'::regclass),
  "tenant_id" int8 NOT NULL,
  "role_id" int8 NOT NULL,
  "permission_id" int8 NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by" int8,
  CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "fk_role_permissions_role" FOREIGN KEY ("role_id") REFERENCES "le_auth"."roles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT "fk_role_permissions_permission" FOREIGN KEY ("permission_id") REFERENCES "le_auth"."permissions" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

ALTER SEQUENCE "le_auth"."role_permissions_id_seq" OWNED BY "le_auth"."role_permissions"."id";

CREATE UNIQUE INDEX IF NOT EXISTS "uk_role_permissions_tenant_role_permission" ON "le_auth"."role_permissions" USING btree (
  "tenant_id" "pg_catalog"."int8_ops" ASC NULLS LAST,
  "role_id" "pg_catalog"."int8_ops" ASC NULLS LAST,
  "permission_id" "pg_catalog"."int8_ops" ASC NULLS LAST
);
CREATE INDEX IF NOT EXISTS "idx_role_permissions_role" ON "le_auth"."role_permissions" USING btree (
  "role_id" "pg_catalog"."int8_ops" ASC NULLS LAST
);
CREATE INDEX IF NOT EXISTS "idx_role_permissions_permission" ON "le_auth"."role_permissions" USING btree (
  "permission_id" "pg_catalog"."int8_ops" ASC NULLS LAST
);

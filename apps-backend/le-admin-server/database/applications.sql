CREATE SCHEMA IF NOT EXISTS "le_auth";

CREATE SEQUENCE IF NOT EXISTS "le_auth"."applications_id_seq";

CREATE OR REPLACE FUNCTION "le_auth"."update_updated_at_column"()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS "le_auth"."applications" (
  "id" int8 NOT NULL DEFAULT nextval('"le_auth".applications_id_seq'::regclass),
  "tenant_id" int8,
  "code" varchar(64) COLLATE "pg_catalog"."default" NOT NULL,
  "name" varchar(64) COLLATE "pg_catalog"."default" NOT NULL,
  "display_name" varchar(128) COLLATE "pg_catalog"."default",
  "entry_url" varchar(255) COLLATE "pg_catalog"."default",
  "icon" varchar(128) COLLATE "pg_catalog"."default",
  "description" varchar(255) COLLATE "pg_catalog"."default",
  "status" int2 NOT NULL DEFAULT 1,
  "sort" int4 NOT NULL DEFAULT 0,
  "created_at" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by" int8,
  "updated_by" int8,
  "deleted_at" timestamp(6),
  "deleted_by" int8,
  CONSTRAINT "applications_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "chk_applications_status" CHECK (status = ANY (ARRAY[0, 1])),
  CONSTRAINT "chk_applications_code_not_empty" CHECK (code::text <> ''::text)
);

ALTER SEQUENCE "le_auth"."applications_id_seq" OWNED BY "le_auth"."applications"."id";

CREATE INDEX IF NOT EXISTS "idx_applications_code" ON "le_auth"."applications" USING btree (
  "code" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX IF NOT EXISTS "idx_applications_tenant_deleted" ON "le_auth"."applications" USING btree (
  "tenant_id" "pg_catalog"."int8_ops" ASC NULLS LAST,
  "deleted_at" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE INDEX IF NOT EXISTS "idx_applications_tenant_sort" ON "le_auth"."applications" USING btree (
  "tenant_id" "pg_catalog"."int8_ops" ASC NULLS LAST,
  "sort" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX IF NOT EXISTS "idx_applications_tenant_status_deleted" ON "le_auth"."applications" USING btree (
  "tenant_id" "pg_catalog"."int8_ops" ASC NULLS LAST,
  "status" "pg_catalog"."int2_ops" ASC NULLS LAST,
  "deleted_at" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX IF NOT EXISTS "uk_applications_tenant_code_active" ON "le_auth"."applications" USING btree (
  "tenant_id" "pg_catalog"."int8_ops" ASC NULLS LAST,
  "code" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "uk_applications_tenant_name_active" ON "le_auth"."applications" USING btree (
  "tenant_id" "pg_catalog"."int8_ops" ASC NULLS LAST,
  "name" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
) WHERE deleted_at IS NULL;

DROP TRIGGER IF EXISTS "trg_applications_updated_at" ON "le_auth"."applications";
CREATE TRIGGER "trg_applications_updated_at" BEFORE UPDATE ON "le_auth"."applications"
FOR EACH ROW
EXECUTE PROCEDURE "le_auth"."update_updated_at_column"();

create table if not exists le_auth.organization (
  id bigserial primary key,
  tenant_id bigint not null,
  parent_id bigint null,
  name varchar(128) not null,
  code varchar(64) not null,
  org_type varchar(32) not null default 'department',
  sort_order smallint not null default 0,
  status smallint not null default 1,
  remark varchar(255) null,
  is_deleted boolean not null default false,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  created_by bigint null,
  updated_by bigint null,
  constraint uq_organization_tenant_code unique (tenant_id, code)
);

create index if not exists idx_organization_parent_id
  on le_auth.organization(parent_id);

create index if not exists idx_organization_tenant_status
  on le_auth.organization(tenant_id, status)
  where is_deleted = false;

insert into le_auth.organization (
  tenant_id,
  parent_id,
  name,
  code,
  org_type,
  sort_order,
  status,
  remark
) values
  (1, null, '总公司', 'root', 'company', 0, 1, '默认根组织')
on conflict (tenant_id, code) do nothing;

insert into le_auth.organization (
  tenant_id,
  parent_id,
  name,
  code,
  org_type,
  sort_order,
  status,
  remark
) values
  (
    1,
    (select id from le_auth.organization where tenant_id = 1 and code = 'root'),
    '技术部',
    'tech',
    'department',
    10,
    1,
    null
  ),
  (
    1,
    (select id from le_auth.organization where tenant_id = 1 and code = 'root'),
    '产品部',
    'product',
    'department',
    20,
    1,
    null
  )
on conflict (tenant_id, code) do nothing;

insert into le_auth.organization (
  tenant_id,
  parent_id,
  name,
  code,
  org_type,
  sort_order,
  status,
  remark
) values (
  1,
  (select id from le_auth.organization where tenant_id = 1 and code = 'tech'),
  '平台组',
  'platform',
  'team',
  10,
  1,
  null
)
on conflict (tenant_id, code) do nothing;

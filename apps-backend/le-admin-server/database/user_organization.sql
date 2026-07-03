alter table le_auth."user"
  add column if not exists organization_id bigint null;

create index if not exists idx_user_organization_id
  on le_auth."user"(organization_id)
  where is_deleted = false;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'fk_user_organization'
  ) then
    alter table le_auth."user"
      add constraint fk_user_organization
      foreign key (organization_id)
      references le_auth.organization(id);
  end if;
end $$;

update le_auth."user" u
set organization_id = o.id
from le_auth.organization o
where u.organization_id is null
  and o.tenant_id = u.tenant_id
  and o.code = 'tech'
  and u.is_deleted = false;

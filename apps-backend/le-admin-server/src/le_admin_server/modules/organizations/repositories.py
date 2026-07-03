from typing import Any

from sqlalchemy import Select, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Organization
from .schemas import OrganizationCreateIn, OrganizationQueryIn, OrganizationUpdateIn

SORT_COLUMNS = {
    "id": Organization.id,
    "tenant_id": Organization.tenant_id,
    "parent_id": Organization.parent_id,
    "code": Organization.code,
    "name": Organization.name,
    "org_type": Organization.org_type,
    "status": Organization.status,
    "sort_order": Organization.sort_order,
    "created_at": Organization.created_at,
    "updated_at": Organization.updated_at,
}


def apply_organization_filters(
    statement: Select[Any],
    query: OrganizationQueryIn,
) -> Select[Any]:
    filters = [Organization.is_deleted.is_(False)]

    if query.tenant_id is not None:
        filters.append(Organization.tenant_id == query.tenant_id)
    if query.parent_id is not None:
        filters.append(Organization.parent_id == query.parent_id)
    if query.keyword is not None:
        keyword = f"%{query.keyword}%"
        filters.append(
            or_(
                Organization.name.ilike(keyword),
                Organization.code.ilike(keyword),
            )
        )
    if query.org_type is not None:
        filters.append(Organization.org_type == query.org_type)
    if query.status is not None:
        filters.append(Organization.status == query.status)

    return statement.where(*filters)


async def list_organizations(
    db: AsyncSession,
    query: OrganizationQueryIn,
) -> tuple[list[Organization], int]:
    count_statement = apply_organization_filters(
        select(func.count()).select_from(Organization),
        query,
    )
    total = await db.scalar(count_statement)

    sort_column = SORT_COLUMNS.get(query.sort_by, Organization.sort_order)
    order_by = sort_column.desc() if query.order == "desc" else sort_column.asc()
    offset = (query.page - 1) * query.page_size

    statement = apply_organization_filters(select(Organization), query)
    statement = statement.order_by(order_by, Organization.id.asc())
    statement = statement.limit(query.page_size).offset(offset)

    result = await db.execute(statement)
    return list(result.scalars().all()), int(total or 0)


async def list_all_organizations(
    db: AsyncSession,
    query: OrganizationQueryIn,
) -> list[Organization]:
    sort_column = SORT_COLUMNS.get(query.sort_by, Organization.sort_order)
    order_by = sort_column.desc() if query.order == "desc" else sort_column.asc()

    statement = apply_organization_filters(select(Organization), query)
    statement = statement.order_by(order_by, Organization.id.asc())

    result = await db.execute(statement)
    return list(result.scalars().all())


async def get_organization(
    db: AsyncSession,
    organization_id: int,
) -> Organization | None:
    statement = select(Organization).where(
        Organization.id == organization_id,
        Organization.is_deleted.is_(False),
    )
    return await db.scalar(statement)


async def get_organization_by_code(
    db: AsyncSession,
    *,
    tenant_id: int,
    code: str,
) -> Organization | None:
    statement = select(Organization).where(
        Organization.tenant_id == tenant_id,
        Organization.code == code,
        Organization.is_deleted.is_(False),
    )
    return await db.scalar(statement)


async def has_children(db: AsyncSession, organization_id: int) -> bool:
    statement = select(func.count()).select_from(Organization).where(
        Organization.parent_id == organization_id,
        Organization.is_deleted.is_(False),
    )
    count = await db.scalar(statement)
    return bool(count)


async def create_organization(
    db: AsyncSession,
    organization_in: OrganizationCreateIn,
    *,
    operator_id: int | None = None,
) -> Organization:
    data = organization_in.model_dump(exclude_none=True)
    if operator_id is not None:
        data["created_by"] = operator_id
        data["updated_by"] = operator_id

    organization = Organization(**data)
    db.add(organization)
    await db.flush()
    await db.refresh(organization)
    return organization


async def update_organization(
    db: AsyncSession,
    organization: Organization,
    organization_in: OrganizationUpdateIn,
    *,
    operator_id: int | None = None,
) -> Organization:
    data = organization_in.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(organization, field, value)

    if operator_id is not None:
        organization.updated_by = operator_id

    await db.flush()
    await db.refresh(organization)
    return organization


async def soft_delete_organization(
    db: AsyncSession,
    organization: Organization,
    *,
    operator_id: int | None = None,
) -> Organization:
    organization.is_deleted = True
    if operator_id is not None:
        organization.updated_by = operator_id

    await db.flush()
    await db.refresh(organization)
    return organization

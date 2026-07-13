from datetime import datetime
from typing import Any

from sqlalchemy import Select, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Role
from .schemas import RoleCreateIn, RoleQueryIn, RoleStatusUpdateIn, RoleUpdateIn

SORT_COLUMNS = {
    "id": Role.id,
    "tenant_id": Role.tenant_id,
    "code": Role.code,
    "name": Role.name,
    "display_name": Role.display_name,
    "status": Role.status,
    "is_system": Role.is_system,
    "sort": Role.sort,
    "created_at": Role.created_at,
    "updated_at": Role.updated_at,
}


def apply_role_filters(statement: Select[Any], query: RoleQueryIn) -> Select[Any]:
    filters = [Role.deleted_at.is_(None)]

    if query.tenant_id is not None:
        filters.append(Role.tenant_id == query.tenant_id)
    if query.keyword is not None:
        keyword = f"%{query.keyword}%"
        filters.append(
            or_(
                Role.code.ilike(keyword),
                Role.name.ilike(keyword),
                Role.display_name.ilike(keyword),
            )
        )
    if query.status is not None:
        filters.append(Role.status == query.status)

    return statement.where(*filters)


async def list_roles(db: AsyncSession, query: RoleQueryIn) -> tuple[list[Role], int]:
    count_statement = apply_role_filters(select(func.count()).select_from(Role), query)
    total = await db.scalar(count_statement)

    sort_column = SORT_COLUMNS.get(query.sort_by, Role.sort)
    order_by = sort_column.desc() if query.order == "desc" else sort_column.asc()
    offset = (query.page - 1) * query.page_size

    statement = apply_role_filters(select(Role), query)
    statement = statement.order_by(order_by, Role.id.asc())
    statement = statement.limit(query.page_size).offset(offset)

    result = await db.execute(statement)
    return list(result.scalars().all()), int(total or 0)


async def get_role(db: AsyncSession, role_id: int) -> Role | None:
    statement = select(Role).where(Role.id == role_id, Role.deleted_at.is_(None))
    return await db.scalar(statement)


async def get_role_by_code(
    db: AsyncSession,
    *,
    tenant_id: int,
    code: str,
) -> Role | None:
    statement = select(Role).where(
        Role.tenant_id == tenant_id,
        Role.code == code,
        Role.deleted_at.is_(None),
    )
    return await db.scalar(statement)


async def get_role_by_name(
    db: AsyncSession,
    *,
    tenant_id: int,
    name: str,
) -> Role | None:
    statement = select(Role).where(
        Role.tenant_id == tenant_id,
        Role.name == name,
        Role.deleted_at.is_(None),
    )
    return await db.scalar(statement)


async def create_role(
    db: AsyncSession,
    role_in: RoleCreateIn,
    *,
    operator_id: int | None = None,
) -> Role:
    data = role_in.model_dump(exclude_none=True)
    if operator_id is not None:
        data["created_by"] = operator_id
        data["updated_by"] = operator_id

    role = Role(**data)
    db.add(role)
    await db.flush()
    await db.refresh(role)
    return role


async def update_role(
    db: AsyncSession,
    role: Role,
    role_in: RoleUpdateIn,
    *,
    operator_id: int | None = None,
) -> Role:
    data = role_in.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(role, field, value)

    if operator_id is not None:
        role.updated_by = operator_id

    await db.flush()
    await db.refresh(role)
    return role


async def update_role_status(
    db: AsyncSession,
    role: Role,
    status_in: RoleStatusUpdateIn,
    *,
    operator_id: int | None = None,
) -> Role:
    role.status = status_in.status
    role.updated_at = datetime.now()
    if operator_id is not None:
        role.updated_by = operator_id

    await db.flush()
    await db.refresh(role)
    return role

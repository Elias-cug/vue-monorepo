from datetime import datetime
from typing import Any

from sqlalchemy import Select, delete, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Permission, RolePermission
from .schemas import (
    PermissionCreateIn,
    PermissionQueryIn,
    PermissionStatusUpdateIn,
    PermissionUpdateIn,
)

SORT_COLUMNS = {
    "id": Permission.id,
    "tenant_id": Permission.tenant_id,
    "application_id": Permission.application_id,
    "parent_id": Permission.parent_id,
    "code": Permission.code,
    "name": Permission.name,
    "type": Permission.type,
    "status": Permission.status,
    "sort": Permission.sort,
    "created_at": Permission.created_at,
    "updated_at": Permission.updated_at,
}


def apply_permission_filters(
    statement: Select[Any],
    query: PermissionQueryIn,
) -> Select[Any]:
    filters = [Permission.deleted_at.is_(None)]

    if query.tenant_id is not None:
        filters.append(Permission.tenant_id == query.tenant_id)
    if query.application_id is not None:
        filters.append(Permission.application_id == query.application_id)
    if query.parent_id is not None:
        filters.append(Permission.parent_id == query.parent_id)
    if query.keyword is not None:
        keyword = f"%{query.keyword}%"
        filters.append(
            or_(
                Permission.code.ilike(keyword),
                Permission.name.ilike(keyword),
                Permission.display_name.ilike(keyword),
            )
        )
    if query.type is not None:
        filters.append(Permission.type == query.type)
    if query.status is not None:
        filters.append(Permission.status == query.status)

    return statement.where(*filters)


async def list_permissions(
    db: AsyncSession,
    query: PermissionQueryIn,
) -> tuple[list[Permission], int]:
    count_statement = apply_permission_filters(
        select(func.count()).select_from(Permission),
        query,
    )
    total = await db.scalar(count_statement)

    sort_column = SORT_COLUMNS.get(query.sort_by, Permission.sort)
    order_by = sort_column.desc() if query.order == "desc" else sort_column.asc()
    offset = (query.page - 1) * query.page_size

    statement = apply_permission_filters(select(Permission), query)
    statement = statement.order_by(order_by, Permission.id.asc())
    statement = statement.limit(query.page_size).offset(offset)

    result = await db.execute(statement)
    return list(result.scalars().all()), int(total or 0)


async def list_all_permissions(
    db: AsyncSession,
    query: PermissionQueryIn,
) -> list[Permission]:
    sort_column = SORT_COLUMNS.get(query.sort_by, Permission.sort)
    order_by = sort_column.desc() if query.order == "desc" else sort_column.asc()

    statement = apply_permission_filters(select(Permission), query)
    statement = statement.order_by(order_by, Permission.id.asc())

    result = await db.execute(statement)
    return list(result.scalars().all())


async def get_permission(
    db: AsyncSession,
    permission_id: int,
) -> Permission | None:
    statement = select(Permission).where(
        Permission.id == permission_id,
        Permission.deleted_at.is_(None),
    )
    return await db.scalar(statement)


async def get_permission_by_code(
    db: AsyncSession,
    *,
    tenant_id: int,
    application_id: int,
    code: str,
) -> Permission | None:
    statement = select(Permission).where(
        Permission.tenant_id == tenant_id,
        Permission.application_id == application_id,
        Permission.code == code,
        Permission.deleted_at.is_(None),
    )
    return await db.scalar(statement)


async def list_enabled_permissions_by_ids(
    db: AsyncSession,
    permission_ids: list[int],
) -> list[Permission]:
    if not permission_ids:
        return []

    statement = select(Permission).where(
        Permission.id.in_(permission_ids),
        Permission.status == 1,
        Permission.deleted_at.is_(None),
    )
    result = await db.execute(statement)
    return list(result.scalars().all())


async def create_permission(
    db: AsyncSession,
    permission_in: PermissionCreateIn,
    *,
    operator_id: int | None = None,
) -> Permission:
    data = permission_in.model_dump(exclude_none=True)
    if operator_id is not None:
        data["created_by"] = operator_id
        data["updated_by"] = operator_id

    permission = Permission(**data)
    db.add(permission)
    await db.flush()
    await db.refresh(permission)
    return permission


async def update_permission(
    db: AsyncSession,
    permission: Permission,
    permission_in: PermissionUpdateIn,
    *,
    operator_id: int | None = None,
) -> Permission:
    data = permission_in.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(permission, field, value)

    if operator_id is not None:
        permission.updated_by = operator_id

    await db.flush()
    await db.refresh(permission)
    return permission


async def update_permission_status(
    db: AsyncSession,
    permission: Permission,
    status_in: PermissionStatusUpdateIn,
    *,
    operator_id: int | None = None,
) -> Permission:
    permission.status = status_in.status
    permission.updated_at = datetime.now()
    if operator_id is not None:
        permission.updated_by = operator_id

    await db.flush()
    await db.refresh(permission)
    return permission


async def list_role_permission_ids(
    db: AsyncSession,
    role_id: int,
) -> list[int]:
    statement = select(RolePermission.permission_id).where(
        RolePermission.role_id == role_id,
    )
    result = await db.execute(statement)
    return list(result.scalars().all())


async def replace_role_permissions(
    db: AsyncSession,
    *,
    tenant_id: int,
    role_id: int,
    permission_ids: list[int],
    operator_id: int | None = None,
) -> None:
    await db.execute(delete(RolePermission).where(RolePermission.role_id == role_id))

    role_permissions = [
        RolePermission(
            tenant_id=tenant_id,
            role_id=role_id,
            permission_id=permission_id,
            created_by=operator_id,
        )
        for permission_id in permission_ids
    ]
    db.add_all(role_permissions)
    await db.flush()

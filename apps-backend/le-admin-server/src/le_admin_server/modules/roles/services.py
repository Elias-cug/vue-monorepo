from lee_api_core import BusinessError, NotFoundError
from sqlalchemy.ext.asyncio import AsyncSession

from .repositories import (
    create_role,
    get_role,
    get_role_by_code,
    get_role_by_name,
    list_roles,
    update_role,
    update_role_status,
)
from .schemas import (
    RoleCreateIn,
    RoleOut,
    RoleQueryIn,
    RoleStatusUpdateIn,
    RoleUpdateIn,
)


async def list_roles_service(
    db: AsyncSession,
    query: RoleQueryIn,
) -> tuple[list[RoleOut], int]:
    roles, total = await list_roles(db, query)
    return [RoleOut.model_validate(role) for role in roles], total


async def validate_role_unique(
    db: AsyncSession,
    *,
    tenant_id: int,
    code: str,
    name: str,
    role_id: int | None = None,
) -> None:
    existing_code = await get_role_by_code(db, tenant_id=tenant_id, code=code)
    if existing_code and existing_code.id != role_id:
        raise BusinessError("角色编码已存在")

    existing_name = await get_role_by_name(db, tenant_id=tenant_id, name=name)
    if existing_name and existing_name.id != role_id:
        raise BusinessError("角色名称已存在")


async def create_role_service(
    db: AsyncSession,
    role_in: RoleCreateIn,
    *,
    operator_id: int | None = None,
) -> RoleOut:
    await validate_role_unique(
        db,
        tenant_id=role_in.tenant_id,
        code=role_in.code,
        name=role_in.name,
    )

    role = await create_role(db, role_in, operator_id=operator_id)
    await db.commit()
    return RoleOut.model_validate(role)


async def update_role_service(
    db: AsyncSession,
    role_id: int,
    role_in: RoleUpdateIn,
    *,
    operator_id: int | None = None,
) -> RoleOut:
    role = await get_role(db, role_id)
    if not role:
        raise NotFoundError("角色不存在")

    tenant_id = role_in.tenant_id or role.tenant_id
    if tenant_id is None:
        raise BusinessError("租户 ID 不能为空")

    code = role_in.code or role.code
    name = role_in.name or role.name
    await validate_role_unique(
        db,
        tenant_id=tenant_id,
        code=code,
        name=name,
        role_id=role_id,
    )

    updated = await update_role(db, role, role_in, operator_id=operator_id)
    await db.commit()
    return RoleOut.model_validate(updated)


async def update_role_status_service(
    db: AsyncSession,
    role_id: int,
    status_in: RoleStatusUpdateIn,
    *,
    operator_id: int | None = None,
) -> RoleOut:
    role = await get_role(db, role_id)
    if not role:
        raise NotFoundError("角色不存在")

    updated = await update_role_status(db, role, status_in, operator_id=operator_id)
    await db.commit()
    return RoleOut.model_validate(updated)

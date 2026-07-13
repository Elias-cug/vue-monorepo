from lee_api_core import BusinessError, NotFoundError
from sqlalchemy.ext.asyncio import AsyncSession

from le_admin_server.modules.applications.repositories import get_application
from le_admin_server.modules.roles.repositories import get_role

from .models import Permission
from .repositories import (
    create_permission,
    get_permission,
    get_permission_by_code,
    list_all_permissions,
    list_enabled_permissions_by_ids,
    list_permissions,
    list_role_permission_ids,
    replace_role_permissions,
    update_permission,
    update_permission_status,
)
from .schemas import (
    PermissionCreateIn,
    PermissionOut,
    PermissionQueryIn,
    PermissionStatusUpdateIn,
    PermissionTreeOut,
    PermissionUpdateIn,
    RolePermissionIdsOut,
    RolePermissionSaveIn,
)


def build_permission_tree(permissions: list[Permission]) -> list[PermissionTreeOut]:
    node_map = {
        permission.id: PermissionTreeOut.model_validate(permission)
        for permission in permissions
    }
    roots: list[PermissionTreeOut] = []

    for permission in permissions:
        node = node_map[permission.id]
        if permission.parent_id and permission.parent_id in node_map:
            node_map[permission.parent_id].children.append(node)
        else:
            roots.append(node)

    return roots


async def list_permissions_service(
    db: AsyncSession,
    query: PermissionQueryIn,
) -> tuple[list[PermissionOut], int]:
    permissions, total = await list_permissions(db, query)
    return (
        [PermissionOut.model_validate(permission) for permission in permissions],
        total,
    )


async def list_permission_tree_service(
    db: AsyncSession,
    query: PermissionQueryIn,
) -> list[PermissionTreeOut]:
    permissions = await list_all_permissions(db, query)
    return build_permission_tree(permissions)


async def validate_application_exists(
    db: AsyncSession,
    *,
    application_id: int,
) -> None:
    application = await get_application(db, application_id)
    if not application:
        raise BusinessError("应用不存在")


async def validate_permission_unique(
    db: AsyncSession,
    *,
    tenant_id: int,
    application_id: int,
    code: str,
    permission_id: int | None = None,
) -> None:
    existing = await get_permission_by_code(
        db,
        tenant_id=tenant_id,
        application_id=application_id,
        code=code,
    )
    if existing and existing.id != permission_id:
        raise BusinessError("权限编码已存在")


async def validate_parent_rule(
    db: AsyncSession,
    *,
    permission_type: str,
    tenant_id: int,
    application_id: int,
    parent_id: int | None,
    permission_id: int | None = None,
) -> None:
    if permission_type == "app":
        if parent_id is not None:
            raise BusinessError("应用权限不能选择上级权限")
        return

    if parent_id is None:
        raise BusinessError("菜单和按钮权限必须选择上级权限")

    if permission_id is not None and parent_id == permission_id:
        raise BusinessError("上级权限不能选择自己")

    parent = await get_permission(db, parent_id)
    if not parent:
        raise BusinessError("上级权限不存在")
    if parent.tenant_id != tenant_id or parent.application_id != application_id:
        raise BusinessError("上级权限必须属于同一租户和应用")
    if permission_type == "menu" and parent.type not in {"app", "menu"}:
        raise BusinessError("菜单权限的上级只能是应用或菜单")
    if permission_type == "button" and parent.type != "menu":
        raise BusinessError("按钮权限的上级只能是菜单")


async def create_permission_service(
    db: AsyncSession,
    permission_in: PermissionCreateIn,
    *,
    operator_id: int | None = None,
) -> PermissionOut:
    await validate_application_exists(db, application_id=permission_in.application_id)
    await validate_permission_unique(
        db,
        tenant_id=permission_in.tenant_id,
        application_id=permission_in.application_id,
        code=permission_in.code,
    )
    await validate_parent_rule(
        db,
        permission_type=permission_in.type,
        tenant_id=permission_in.tenant_id,
        application_id=permission_in.application_id,
        parent_id=permission_in.parent_id,
    )

    permission = await create_permission(
        db,
        permission_in,
        operator_id=operator_id,
    )
    await db.commit()
    return PermissionOut.model_validate(permission)


async def update_permission_service(
    db: AsyncSession,
    permission_id: int,
    permission_in: PermissionUpdateIn,
    *,
    operator_id: int | None = None,
) -> PermissionOut:
    permission = await get_permission(db, permission_id)
    if not permission:
        raise NotFoundError("权限不存在")

    update_fields = permission_in.model_fields_set
    if permission.is_system and {
        "code",
        "type",
        "application_id",
    }.intersection(update_fields):
        raise BusinessError("系统权限不能修改编码、类型或所属应用")

    tenant_id = permission_in.tenant_id or permission.tenant_id
    application_id = permission_in.application_id or permission.application_id
    permission_type = permission_in.type or permission.type
    code = permission_in.code or permission.code
    parent_id = (
        permission_in.parent_id
        if "parent_id" in update_fields
        else permission.parent_id
    )

    await validate_application_exists(db, application_id=application_id)
    await validate_permission_unique(
        db,
        tenant_id=tenant_id,
        application_id=application_id,
        code=code,
        permission_id=permission_id,
    )
    await validate_parent_rule(
        db,
        permission_type=permission_type,
        tenant_id=tenant_id,
        application_id=application_id,
        parent_id=parent_id,
        permission_id=permission_id,
    )

    updated = await update_permission(
        db,
        permission,
        permission_in,
        operator_id=operator_id,
    )
    await db.commit()
    return PermissionOut.model_validate(updated)


async def update_permission_status_service(
    db: AsyncSession,
    permission_id: int,
    status_in: PermissionStatusUpdateIn,
    *,
    operator_id: int | None = None,
) -> PermissionOut:
    permission = await get_permission(db, permission_id)
    if not permission:
        raise NotFoundError("权限不存在")

    updated = await update_permission_status(
        db,
        permission,
        status_in,
        operator_id=operator_id,
    )
    await db.commit()
    return PermissionOut.model_validate(updated)


async def list_role_permissions_service(
    db: AsyncSession,
    role_id: int,
) -> RolePermissionIdsOut:
    role = await get_role(db, role_id)
    if not role:
        raise NotFoundError("角色不存在")

    permission_ids = await list_role_permission_ids(db, role_id)
    return RolePermissionIdsOut(role_id=role_id, permission_ids=permission_ids)


async def save_role_permissions_service(
    db: AsyncSession,
    role_id: int,
    permission_in: RolePermissionSaveIn,
    *,
    operator_id: int | None = None,
) -> RolePermissionIdsOut:
    role = await get_role(db, role_id)
    if not role:
        raise NotFoundError("角色不存在")
    if role.tenant_id is None:
        raise BusinessError("角色租户 ID 不能为空")

    permission_ids = list(dict.fromkeys(permission_in.permission_ids))
    enabled_permissions = await list_enabled_permissions_by_ids(db, permission_ids)
    enabled_permission_ids = {permission.id for permission in enabled_permissions}
    if len(enabled_permission_ids) != len(permission_ids):
        raise BusinessError("存在无效或已禁用的权限")
    has_cross_tenant_permission = any(
        permission.tenant_id != role.tenant_id for permission in enabled_permissions
    )
    if has_cross_tenant_permission:
        raise BusinessError("权限必须与角色属于同一租户")

    await replace_role_permissions(
        db,
        tenant_id=role.tenant_id,
        role_id=role_id,
        permission_ids=permission_ids,
        operator_id=operator_id,
    )
    await db.commit()
    return RolePermissionIdsOut(role_id=role_id, permission_ids=permission_ids)

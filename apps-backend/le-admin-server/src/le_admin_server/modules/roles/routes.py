from typing import Annotated

from fastapi import APIRouter, Depends
from lee_api_core import PageData, SuccessResponse, page, success
from sqlalchemy.ext.asyncio import AsyncSession

from le_admin_server.api.deps import CurrentUser, get_db_session
from le_admin_server.modules.permissions.schemas import (
    RolePermissionIdsOut,
    RolePermissionSaveIn,
)
from le_admin_server.modules.permissions.services import (
    list_role_permissions_service,
    save_role_permissions_service,
)

from .schemas import (
    RoleCreateIn,
    RoleOut,
    RoleQueryIn,
    RoleStatusUpdateIn,
    RoleUpdateIn,
)
from .services import (
    create_role_service,
    list_roles_service,
    update_role_service,
    update_role_status_service,
)

router = APIRouter()


@router.get(
    "",
    summary="查询角色列表",
    response_model=SuccessResponse[PageData[RoleOut]],
)
async def list_roles_api(
    query: Annotated[RoleQueryIn, Depends()],
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _current_user: CurrentUser,
) -> SuccessResponse[PageData[RoleOut]]:
    roles, total = await list_roles_service(db, query)
    return success(page(roles, total))


@router.post("", summary="创建角色", response_model=SuccessResponse[RoleOut])
async def create_role_api(
    role_in: RoleCreateIn,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _current_user: CurrentUser,
) -> SuccessResponse[RoleOut]:
    role = await create_role_service(db, role_in)
    return success(role)


@router.put("/{role_id}", summary="更新角色", response_model=SuccessResponse[RoleOut])
async def update_role_api(
    role_id: int,
    role_in: RoleUpdateIn,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _current_user: CurrentUser,
) -> SuccessResponse[RoleOut]:
    role = await update_role_service(db, role_id, role_in)
    return success(role)


@router.patch(
    "/{role_id}/status",
    summary="切换角色状态",
    response_model=SuccessResponse[RoleOut],
)
async def update_role_status_api(
    role_id: int,
    status_in: RoleStatusUpdateIn,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _current_user: CurrentUser,
) -> SuccessResponse[RoleOut]:
    role = await update_role_status_service(db, role_id, status_in)
    return success(role)


@router.get(
    "/{role_id}/permissions",
    summary="查询角色权限",
    response_model=SuccessResponse[RolePermissionIdsOut],
)
async def list_role_permissions_api(
    role_id: int,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _current_user: CurrentUser,
) -> SuccessResponse[RolePermissionIdsOut]:
    result = await list_role_permissions_service(db, role_id)
    return success(result)


@router.put(
    "/{role_id}/permissions",
    summary="保存角色权限",
    response_model=SuccessResponse[RolePermissionIdsOut],
)
async def save_role_permissions_api(
    role_id: int,
    permission_in: RolePermissionSaveIn,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _current_user: CurrentUser,
) -> SuccessResponse[RolePermissionIdsOut]:
    result = await save_role_permissions_service(db, role_id, permission_in)
    return success(result)

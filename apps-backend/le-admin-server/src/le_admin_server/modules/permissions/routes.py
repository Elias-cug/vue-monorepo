from typing import Annotated

from fastapi import APIRouter, Depends
from lee_api_core import PageData, SuccessResponse, page, success
from sqlalchemy.ext.asyncio import AsyncSession

from le_admin_server.api.deps import CurrentUser, get_db_session

from .schemas import (
    PermissionCreateIn,
    PermissionOut,
    PermissionQueryIn,
    PermissionStatusUpdateIn,
    PermissionTreeOut,
    PermissionUpdateIn,
)
from .services import (
    create_permission_service,
    list_permission_tree_service,
    list_permissions_service,
    update_permission_service,
    update_permission_status_service,
)

router = APIRouter()


@router.get(
    "",
    summary="查询权限列表",
    response_model=SuccessResponse[PageData[PermissionOut]],
)
async def list_permissions_api(
    query: Annotated[PermissionQueryIn, Depends()],
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _current_user: CurrentUser,
) -> SuccessResponse[PageData[PermissionOut]]:
    permissions, total = await list_permissions_service(db, query)
    return success(page(permissions, total))


@router.get(
    "/tree",
    summary="查询权限树",
    response_model=SuccessResponse[list[PermissionTreeOut]],
)
async def list_permission_tree_api(
    query: Annotated[PermissionQueryIn, Depends()],
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _current_user: CurrentUser,
) -> SuccessResponse[list[PermissionTreeOut]]:
    permissions = await list_permission_tree_service(db, query)
    return success(permissions)


@router.post("", summary="创建权限", response_model=SuccessResponse[PermissionOut])
async def create_permission_api(
    permission_in: PermissionCreateIn,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _current_user: CurrentUser,
) -> SuccessResponse[PermissionOut]:
    permission = await create_permission_service(db, permission_in)
    return success(permission)


@router.put(
    "/{permission_id}",
    summary="更新权限",
    response_model=SuccessResponse[PermissionOut],
)
async def update_permission_api(
    permission_id: int,
    permission_in: PermissionUpdateIn,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _current_user: CurrentUser,
) -> SuccessResponse[PermissionOut]:
    permission = await update_permission_service(db, permission_id, permission_in)
    return success(permission)


@router.patch(
    "/{permission_id}/status",
    summary="切换权限状态",
    response_model=SuccessResponse[PermissionOut],
)
async def update_permission_status_api(
    permission_id: int,
    status_in: PermissionStatusUpdateIn,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _current_user: CurrentUser,
) -> SuccessResponse[PermissionOut]:
    permission = await update_permission_status_service(db, permission_id, status_in)
    return success(permission)

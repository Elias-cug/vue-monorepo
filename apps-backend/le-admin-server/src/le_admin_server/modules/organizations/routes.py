from typing import Annotated

from fastapi import APIRouter, Depends
from lee_api_core import PageData, SuccessResponse, page, success
from sqlalchemy.ext.asyncio import AsyncSession

from le_admin_server.api.deps import CurrentUser, get_db_session

from .schemas import (
    OrganizationCreateIn,
    OrganizationOut,
    OrganizationQueryIn,
    OrganizationTreeOut,
    OrganizationUpdateIn,
)
from .services import (
    create_organization_service,
    delete_organization_service,
    get_organization_service,
    list_organization_tree_service,
    list_organizations_service,
    update_organization_service,
)

router = APIRouter()


@router.get(
    "",
    summary="查询组织列表",
    response_model=SuccessResponse[PageData[OrganizationOut]],
)
async def list_organizations_api(
    query: Annotated[OrganizationQueryIn, Depends()],
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _current_user: CurrentUser,
) -> SuccessResponse[PageData[OrganizationOut]]:
    organizations, total = await list_organizations_service(db, query)
    return success(page(organizations, total))


@router.get(
    "/tree",
    summary="查询组织树",
    response_model=SuccessResponse[list[OrganizationTreeOut]],
)
async def list_organization_tree_api(
    query: Annotated[OrganizationQueryIn, Depends()],
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _current_user: CurrentUser,
) -> SuccessResponse[list[OrganizationTreeOut]]:
    organizations = await list_organization_tree_service(db, query)
    return success(organizations)


@router.post("", summary="创建组织", response_model=SuccessResponse[OrganizationOut])
async def create_organization_api(
    organization_in: OrganizationCreateIn,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _current_user: CurrentUser,
) -> SuccessResponse[OrganizationOut]:
    organization = await create_organization_service(db, organization_in)
    return success(organization)


@router.get(
    "/{organization_id}",
    summary="获取组织详情",
    response_model=SuccessResponse[OrganizationOut],
)
async def get_organization_api(
    organization_id: int,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _current_user: CurrentUser,
) -> SuccessResponse[OrganizationOut]:
    organization = await get_organization_service(db, organization_id)
    return success(organization)


@router.put(
    "/{organization_id}",
    summary="更新组织",
    response_model=SuccessResponse[OrganizationOut],
)
async def update_organization_api(
    organization_id: int,
    organization_in: OrganizationUpdateIn,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _current_user: CurrentUser,
) -> SuccessResponse[OrganizationOut]:
    organization = await update_organization_service(
        db,
        organization_id,
        organization_in,
    )
    return success(organization)


@router.delete(
    "/{organization_id}",
    summary="删除组织",
    response_model=SuccessResponse[OrganizationOut],
)
async def delete_organization_api(
    organization_id: int,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _current_user: CurrentUser,
) -> SuccessResponse[OrganizationOut]:
    organization = await delete_organization_service(db, organization_id)
    return success(organization)

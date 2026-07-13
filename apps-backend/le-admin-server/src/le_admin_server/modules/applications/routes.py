from typing import Annotated

from fastapi import APIRouter, Depends
from lee_api_core import PageData, SuccessResponse, page, success
from sqlalchemy.ext.asyncio import AsyncSession

from le_admin_server.api.deps import CurrentUser, get_db_session

from .schemas import (
    ApplicationCreateIn,
    ApplicationOut,
    ApplicationQueryIn,
    ApplicationStatusUpdateIn,
    ApplicationUpdateIn,
)
from .services import (
    create_application_service,
    list_applications_service,
    update_application_service,
    update_application_status_service,
)

router = APIRouter()


@router.get(
    "",
    summary="查询应用列表",
    response_model=SuccessResponse[PageData[ApplicationOut]],
)
async def list_applications_api(
    query: Annotated[ApplicationQueryIn, Depends()],
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _current_user: CurrentUser,
) -> SuccessResponse[PageData[ApplicationOut]]:
    applications, total = await list_applications_service(db, query)
    return success(page(applications, total))


@router.post("", summary="创建应用", response_model=SuccessResponse[ApplicationOut])
async def create_application_api(
    application_in: ApplicationCreateIn,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _current_user: CurrentUser,
) -> SuccessResponse[ApplicationOut]:
    application = await create_application_service(db, application_in)
    return success(application)


@router.put(
    "/{application_id}",
    summary="更新应用",
    response_model=SuccessResponse[ApplicationOut],
)
async def update_application_api(
    application_id: int,
    application_in: ApplicationUpdateIn,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _current_user: CurrentUser,
) -> SuccessResponse[ApplicationOut]:
    application = await update_application_service(
        db,
        application_id,
        application_in,
    )
    return success(application)


@router.patch(
    "/{application_id}/status",
    summary="切换应用状态",
    response_model=SuccessResponse[ApplicationOut],
)
async def update_application_status_api(
    application_id: int,
    status_in: ApplicationStatusUpdateIn,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    _current_user: CurrentUser,
) -> SuccessResponse[ApplicationOut]:
    application = await update_application_status_service(
        db,
        application_id,
        status_in,
    )
    return success(application)

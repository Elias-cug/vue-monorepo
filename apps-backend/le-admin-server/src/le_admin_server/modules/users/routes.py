from typing import Annotated

from fastapi import APIRouter, Depends
from lee_api_core import PageData, SuccessResponse, page, success
from sqlalchemy.ext.asyncio import AsyncSession

from le_admin_server.api.deps import get_db_session

from .schemas import (
    UserChangePasswordIn,
    UserCreateIn,
    UserOut,
    UserQueryIn,
    UserResetPasswordOut,
    UserUpdateIn,
)
from .services import (
    change_password_service,
    create_user_service,
    delete_user_service,
    get_user_service,
    list_users_service,
    reset_password_service,
    update_user_service,
)

router = APIRouter()


@router.get(
    "",
    summary="查询用户列表",
    response_model=SuccessResponse[PageData[UserOut]],
)
async def list_users_api(
    query: Annotated[UserQueryIn, Depends()],
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> SuccessResponse[PageData[UserOut]]:
    users, total = await list_users_service(db, query)
    return success(page(users, total))


@router.post(
    "/getUserList",
    summary="查询用户列表",
    response_model=SuccessResponse[PageData[UserOut]],
)
async def list_users_legacy_api(
    user_in: UserQueryIn,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> SuccessResponse[PageData[UserOut]]:
    users, total = await list_users_service(db, user_in)
    return success(page(users, total))


@router.post("", summary="创建用户", response_model=SuccessResponse[UserOut])
async def create_user_api(
    user_in: UserCreateIn,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> SuccessResponse[UserOut]:
    user = await create_user_service(db, user_in)
    return success(user)


@router.post("/create", summary="创建用户", response_model=SuccessResponse[UserOut])
async def create_user_legacy_api(
    user_in: UserCreateIn,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> SuccessResponse[UserOut]:
    user = await create_user_service(db, user_in)
    return success(user)


@router.get(
    "/{user_id}",
    summary="获取用户详情",
    response_model=SuccessResponse[UserOut],
)
async def get_user_api(
    user_id: int,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> SuccessResponse[UserOut]:
    user = await get_user_service(db, user_id)
    return success(user)


@router.put("/{user_id}", summary="更新用户", response_model=SuccessResponse[UserOut])
async def update_user_api(
    user_id: int,
    user_in: UserUpdateIn,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> SuccessResponse[UserOut]:
    user = await update_user_service(db, user_id, user_in)
    return success(user)


@router.post(
    "/update/{user_id}",
    summary="更新用户",
    response_model=SuccessResponse[UserOut],
)
async def update_user_legacy_api(
    user_id: int,
    user_in: UserUpdateIn,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> SuccessResponse[UserOut]:
    user = await update_user_service(db, user_id, user_in)
    return success(user)


@router.delete(
    "/{user_id}",
    summary="删除用户",
    response_model=SuccessResponse[UserOut],
)
async def delete_user_api(
    user_id: int,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> SuccessResponse[UserOut]:
    user = await delete_user_service(db, user_id)
    return success(user)


@router.post(
    "/delete/{user_id}",
    summary="删除用户",
    response_model=SuccessResponse[UserOut],
)
async def delete_user_legacy_api(
    user_id: int,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> SuccessResponse[UserOut]:
    user = await delete_user_service(db, user_id)
    return success(user)


@router.post(
    "/{user_id}/reset-password",
    summary="重置密码",
    response_model=SuccessResponse[UserResetPasswordOut],
)
async def reset_password_api(
    user_id: int,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> SuccessResponse[UserResetPasswordOut]:
    result = await reset_password_service(db, user_id)
    return success(result, message="密码重置成功")


@router.post(
    "/{user_id}/change-password",
    summary="修改密码",
    response_model=SuccessResponse[dict],
)
async def change_password_api(
    user_id: int,
    change_in: UserChangePasswordIn,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> SuccessResponse[dict]:
    await change_password_service(db, user_id, change_in)
    return success({}, message="密码修改成功")

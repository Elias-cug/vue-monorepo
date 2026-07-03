from typing import Annotated

from fastapi import APIRouter, Depends
from lee_api_core import SuccessResponse, success
from sqlalchemy.ext.asyncio import AsyncSession

from le_admin_server.api.deps import CurrentUser, get_db_session

from .schemas import CurrentUserOut, LoginIn, TokenPairOut
from .services import build_current_user, login_service

router = APIRouter()


@router.post(
    "/login",
    summary="用户登录",
    response_model=SuccessResponse[TokenPairOut],
)
async def login_api(
    login_in: LoginIn,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> SuccessResponse[TokenPairOut]:
    token_pair = await login_service(db, login_in)
    return success(token_pair)


@router.get(
    "/me",
    summary="当前用户",
    response_model=SuccessResponse[CurrentUserOut],
)
async def current_user_api(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> SuccessResponse[CurrentUserOut]:
    return success(await build_current_user(db, current_user))

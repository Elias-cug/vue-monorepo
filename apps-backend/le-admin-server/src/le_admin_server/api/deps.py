from __future__ import annotations

from typing import TYPE_CHECKING, Annotated

from fastapi import Depends, Header
from lee_api_core import UnauthorizedError
from lee_auth import decode_jwt_payload, extract_bearer_token
from lee_db import make_session_dependency
from sqlalchemy.ext.asyncio import AsyncSession

from le_admin_server.core.settings import get_settings
from le_admin_server.database import AsyncSessionLocal

if TYPE_CHECKING:
    from le_admin_server.modules.users.models import User

get_db_session = make_session_dependency(AsyncSessionLocal)


async def get_current_user(
    authorization: Annotated[str | None, Header()] = None,
    db: Annotated[AsyncSession, Depends(get_db_session)] = None,
) -> User:
    from le_admin_server.modules.users.repositories import get_user

    settings = get_settings()

    try:
        token = extract_bearer_token(authorization)
        payload = decode_jwt_payload(
            token,
            secret_key=settings.jwt_secret,
            algorithm=settings.jwt_algorithm,
        )
    except ValueError as exc:
        raise UnauthorizedError("无效或过期的登录凭证") from exc

    if payload.token_type != "access":
        raise UnauthorizedError("无效的登录凭证类型")

    try:
        user_id = int(payload.subject)
    except ValueError as exc:
        raise UnauthorizedError("无效的登录用户") from exc

    user = await get_user(db, user_id)
    if not user:
        raise UnauthorizedError("用户不存在")
    if user.status != 1:
        raise UnauthorizedError("用户已停用")

    return user


CurrentUser = Annotated["User", Depends(get_current_user)]

__all__ = ["CurrentUser", "get_current_user", "get_db_session"]

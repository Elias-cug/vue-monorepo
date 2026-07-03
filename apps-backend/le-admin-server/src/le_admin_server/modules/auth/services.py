from datetime import timedelta

from lee_api_core import UnauthorizedError
from lee_auth import create_jwt_token, verify_password
from sqlalchemy.ext.asyncio import AsyncSession

from le_admin_server.core.settings import get_settings
from le_admin_server.modules.organizations.repositories import get_organization
from le_admin_server.modules.users.models import User
from le_admin_server.modules.users.repositories import get_user_by_username

from .schemas import CurrentUserOut, LoginIn, TokenPairOut


async def build_current_user(db: AsyncSession, user: User) -> CurrentUserOut:
    organization_name = None
    if user.organization_id is not None:
        organization = await get_organization(db, user.organization_id)
        if organization:
            organization_name = organization.name

    return CurrentUserOut.model_validate(
        {
            **user.__dict__,
            "organization_name": organization_name,
        }
    )


async def authenticate_user(
    db: AsyncSession,
    login_in: LoginIn,
) -> User:
    user = await get_user_by_username(
        db,
        tenant_id=login_in.tenant_id,
        username=login_in.username,
    )
    if not user or not verify_password(login_in.password, user.password_hash):
        raise UnauthorizedError("用户名或密码错误")

    if user.status != 1:
        raise UnauthorizedError("用户已停用")
    if user.is_locked:
        raise UnauthorizedError("用户已锁定")

    return user


def create_user_tokens(user: User) -> TokenPairOut:
    settings = get_settings()
    claims = {
        "tenant_id": user.tenant_id,
        "username": user.username,
    }

    access_token, expires_in, _ = create_jwt_token(
        subject=user.id,
        token_type="access",
        secret_key=settings.jwt_secret,
        algorithm=settings.jwt_algorithm,
        expires_delta=timedelta(minutes=settings.access_token_exp_minutes),
        claims=claims,
    )
    refresh_token, _, _ = create_jwt_token(
        subject=user.id,
        token_type="refresh",
        secret_key=settings.jwt_secret,
        algorithm=settings.jwt_algorithm,
        expires_delta=timedelta(days=settings.refresh_token_exp_days),
        claims=claims,
    )

    return TokenPairOut(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=expires_in,
    )


async def login_service(db: AsyncSession, login_in: LoginIn) -> TokenPairOut:
    user = await authenticate_user(db, login_in)
    return create_user_tokens(user)

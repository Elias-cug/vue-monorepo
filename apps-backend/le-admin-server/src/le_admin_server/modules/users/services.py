from datetime import UTC, datetime

from lee_api_core import BusinessError, NotFoundError
from lee_auth import hash_password, verify_password
from sqlalchemy.ext.asyncio import AsyncSession

from .repositories import (
    create_user,
    get_user,
    get_user_by_username,
    list_users,
    soft_delete_user,
    update_user,
    update_user_password,
)
from .schemas import (
    UserChangePasswordIn,
    UserCreateIn,
    UserOut,
    UserQueryIn,
    UserResetPasswordOut,
    UserUpdateIn,
)

DEFAULT_INITIAL_PASSWORD = "Admin@1234"


def _now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


async def list_users_service(
    db: AsyncSession,
    query: UserQueryIn,
) -> tuple[list[UserOut], int]:
    users, total = await list_users(db, query)
    return [UserOut.model_validate(user) for user in users], total


async def get_user_service(db: AsyncSession, user_id: int) -> UserOut:
    user = await get_user(db, user_id)
    if not user:
        raise NotFoundError("用户不存在")
    return UserOut.model_validate(user)


async def create_user_service(
    db: AsyncSession,
    user_in: UserCreateIn,
    *,
    operator_id: int | None = None,
) -> UserOut:
    existing = await get_user_by_username(
        db,
        tenant_id=user_in.tenant_id,
        username=user_in.username,
    )
    if existing:
        raise BusinessError("用户名已存在")

    user = await create_user(
        db,
        user_in,
        password_hash=hash_password(DEFAULT_INITIAL_PASSWORD),
        operator_id=operator_id,
    )
    await db.commit()
    return UserOut.model_validate(user)


async def update_user_service(
    db: AsyncSession,
    user_id: int,
    user_in: UserUpdateIn,
    *,
    operator_id: int | None = None,
) -> UserOut:
    user = await get_user(db, user_id)
    if not user:
        raise NotFoundError("用户不存在")

    updated = await update_user(
        db,
        user,
        user_in,
        operator_id=operator_id,
    )
    await db.commit()
    return UserOut.model_validate(updated)


async def delete_user_service(
    db: AsyncSession,
    user_id: int,
    *,
    operator_id: int | None = None,
) -> UserOut:
    user = await get_user(db, user_id)
    if not user:
        raise NotFoundError("用户不存在")

    deleted = await soft_delete_user(db, user, operator_id=operator_id)
    await db.commit()
    return UserOut.model_validate(deleted)


async def reset_password_service(
    db: AsyncSession,
    user_id: int,
    *,
    operator_id: int | None = None,
) -> UserResetPasswordOut:
    user = await get_user(db, user_id)
    if not user:
        raise NotFoundError("用户不存在")

    await update_user_password(
        db,
        user,
        password_hash=hash_password(DEFAULT_INITIAL_PASSWORD),
        operator_id=operator_id,
        password_updated_at=_now(),
        is_password_changed=False,
        is_first_login=True,
        login_failed_count=0,
        last_login_failed_at=None,
        is_locked=False,
        locked_until=None,
    )
    await db.commit()
    return UserResetPasswordOut(id=user_id, initial_password=DEFAULT_INITIAL_PASSWORD)


async def change_password_service(
    db: AsyncSession,
    user_id: int,
    change_in: UserChangePasswordIn,
    *,
    operator_id: int | None = None,
) -> None:
    user = await get_user(db, user_id)
    if not user:
        raise NotFoundError("用户不存在")

    if not verify_password(change_in.old_password, user.password_hash):
        raise BusinessError("旧密码不正确")

    if verify_password(change_in.new_password, user.password_hash):
        raise BusinessError("新密码不能与旧密码相同")

    await update_user_password(
        db,
        user,
        password_hash=hash_password(change_in.new_password),
        operator_id=operator_id,
        password_updated_at=_now(),
        is_password_changed=True,
        is_first_login=False,
        login_failed_count=0,
        last_login_failed_at=None,
        is_locked=False,
        locked_until=None,
    )
    await db.commit()

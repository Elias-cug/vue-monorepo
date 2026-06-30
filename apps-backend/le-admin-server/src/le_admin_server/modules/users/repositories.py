from datetime import datetime
from typing import Any

from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import User
from .schemas import UserCreateIn, UserQueryIn, UserUpdateIn

SORT_COLUMNS = {
    "id": User.id,
    "tenant_id": User.tenant_id,
    "username": User.username,
    "status": User.status,
    "created_at": User.created_at,
    "updated_at": User.updated_at,
    "last_login_at": User.last_login_at,
}


def apply_user_filters(statement: Select[Any], query: UserQueryIn) -> Select[Any]:
    filters = [User.is_deleted.is_(False)]

    if query.tenant_id is not None:
        filters.append(User.tenant_id == query.tenant_id)
    if query.username is not None:
        filters.append(User.username == query.username)
    if query.email is not None:
        filters.append(User.email.ilike(f"%{query.email}%"))
    if query.phone is not None:
        filters.append(User.phone.like(f"%{query.phone}%"))
    if query.display_name is not None:
        filters.append(User.display_name.like(f"%{query.display_name}%"))
    if query.status is not None:
        filters.append(User.status == query.status)
    if query.created_from is not None:
        filters.append(User.created_at >= query.created_from)
    if query.created_to is not None:
        filters.append(User.created_at <= query.created_to)

    return statement.where(*filters)


async def list_users(
    db: AsyncSession,
    query: UserQueryIn,
) -> tuple[list[User], int]:
    count_statement = apply_user_filters(
        select(func.count()).select_from(User),
        query,
    )
    total = await db.scalar(count_statement)

    sort_column = SORT_COLUMNS.get(query.sort_by, User.created_at)
    order_by = sort_column.desc() if query.order == "desc" else sort_column.asc()
    offset = (query.page - 1) * query.page_size

    statement = apply_user_filters(select(User), query).order_by(order_by)
    statement = statement.limit(query.page_size).offset(offset)

    result = await db.execute(statement)
    return list(result.scalars().all()), int(total or 0)


async def get_user(db: AsyncSession, user_id: int) -> User | None:
    statement = select(User).where(User.id == user_id, User.is_deleted.is_(False))
    return await db.scalar(statement)


async def get_user_by_username(
    db: AsyncSession,
    *,
    tenant_id: int,
    username: str,
) -> User | None:
    statement = select(User).where(
        User.tenant_id == tenant_id,
        User.username == username,
        User.is_deleted.is_(False),
    )
    return await db.scalar(statement)


async def create_user(
    db: AsyncSession,
    user_in: UserCreateIn,
    *,
    password_hash: str,
    operator_id: int | None = None,
) -> User:
    data = user_in.model_dump(exclude_none=True)
    data["password_hash"] = password_hash
    if operator_id is not None:
        data["created_by"] = operator_id
        data["updated_by"] = operator_id

    user = User(**data)
    db.add(user)
    await db.flush()
    await db.refresh(user)
    return user


async def update_user(
    db: AsyncSession,
    user: User,
    user_in: UserUpdateIn,
    *,
    operator_id: int | None = None,
) -> User:
    data = user_in.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(user, field, value)

    if operator_id is not None:
        user.updated_by = operator_id

    await db.flush()
    await db.refresh(user)
    return user


async def soft_delete_user(
    db: AsyncSession,
    user: User,
    *,
    operator_id: int | None = None,
) -> User:
    user.is_deleted = True
    if operator_id is not None:
        user.updated_by = operator_id

    await db.flush()
    await db.refresh(user)
    return user


async def update_user_password(
    db: AsyncSession,
    user: User,
    *,
    password_hash: str,
    operator_id: int | None = None,
    password_updated_at: datetime | None = None,
    is_password_changed: bool | None = None,
    is_first_login: bool | None = None,
    login_failed_count: int | None = None,
    last_login_failed_at: datetime | None = None,
    is_locked: bool | None = None,
    locked_until: datetime | None = None,
) -> User:
    user.password_hash = password_hash
    if password_updated_at is not None:
        user.password_updated_at = password_updated_at
    if is_password_changed is not None:
        user.is_password_changed = is_password_changed
    if is_first_login is not None:
        user.is_first_login = is_first_login
    if login_failed_count is not None:
        user.login_failed_count = login_failed_count
    user.last_login_failed_at = last_login_failed_at
    if is_locked is not None:
        user.is_locked = is_locked
    user.locked_until = locked_until
    if operator_id is not None:
        user.updated_by = operator_id

    await db.flush()
    await db.refresh(user)
    return user

from datetime import datetime
from typing import Any

from sqlalchemy import Select, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Application
from .schemas import (
    ApplicationCreateIn,
    ApplicationQueryIn,
    ApplicationStatusUpdateIn,
    ApplicationUpdateIn,
)

SORT_COLUMNS = {
    "id": Application.id,
    "tenant_id": Application.tenant_id,
    "code": Application.code,
    "name": Application.name,
    "display_name": Application.display_name,
    "status": Application.status,
    "sort": Application.sort,
    "created_at": Application.created_at,
    "updated_at": Application.updated_at,
}


def apply_application_filters(
    statement: Select[Any],
    query: ApplicationQueryIn,
) -> Select[Any]:
    filters = [Application.deleted_at.is_(None)]

    if query.tenant_id is not None:
        filters.append(Application.tenant_id == query.tenant_id)
    if query.keyword is not None:
        keyword = f"%{query.keyword}%"
        filters.append(
            or_(
                Application.code.ilike(keyword),
                Application.name.ilike(keyword),
                Application.display_name.ilike(keyword),
            )
        )
    if query.status is not None:
        filters.append(Application.status == query.status)

    return statement.where(*filters)


async def list_applications(
    db: AsyncSession,
    query: ApplicationQueryIn,
) -> tuple[list[Application], int]:
    count_statement = apply_application_filters(
        select(func.count()).select_from(Application),
        query,
    )
    total = await db.scalar(count_statement)

    sort_column = SORT_COLUMNS.get(query.sort_by, Application.sort)
    order_by = sort_column.desc() if query.order == "desc" else sort_column.asc()
    offset = (query.page - 1) * query.page_size

    statement = apply_application_filters(select(Application), query)
    statement = statement.order_by(order_by, Application.id.asc())
    statement = statement.limit(query.page_size).offset(offset)

    result = await db.execute(statement)
    return list(result.scalars().all()), int(total or 0)


async def get_application(
    db: AsyncSession,
    application_id: int,
) -> Application | None:
    statement = select(Application).where(
        Application.id == application_id,
        Application.deleted_at.is_(None),
    )
    return await db.scalar(statement)


async def get_application_by_code(
    db: AsyncSession,
    *,
    tenant_id: int,
    code: str,
) -> Application | None:
    statement = select(Application).where(
        Application.tenant_id == tenant_id,
        Application.code == code,
        Application.deleted_at.is_(None),
    )
    return await db.scalar(statement)


async def get_application_by_name(
    db: AsyncSession,
    *,
    tenant_id: int,
    name: str,
) -> Application | None:
    statement = select(Application).where(
        Application.tenant_id == tenant_id,
        Application.name == name,
        Application.deleted_at.is_(None),
    )
    return await db.scalar(statement)


async def create_application(
    db: AsyncSession,
    application_in: ApplicationCreateIn,
    *,
    operator_id: int | None = None,
) -> Application:
    data = application_in.model_dump(exclude_none=True)
    if operator_id is not None:
        data["created_by"] = operator_id
        data["updated_by"] = operator_id

    application = Application(**data)
    db.add(application)
    await db.flush()
    await db.refresh(application)
    return application


async def update_application(
    db: AsyncSession,
    application: Application,
    application_in: ApplicationUpdateIn,
    *,
    operator_id: int | None = None,
) -> Application:
    data = application_in.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(application, field, value)

    if operator_id is not None:
        application.updated_by = operator_id

    await db.flush()
    await db.refresh(application)
    return application


async def update_application_status(
    db: AsyncSession,
    application: Application,
    status_in: ApplicationStatusUpdateIn,
    *,
    operator_id: int | None = None,
) -> Application:
    application.status = status_in.status
    application.updated_at = datetime.now()
    if operator_id is not None:
        application.updated_by = operator_id

    await db.flush()
    await db.refresh(application)
    return application

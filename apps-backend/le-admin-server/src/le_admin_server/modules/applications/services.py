from lee_api_core import BusinessError, NotFoundError
from sqlalchemy.ext.asyncio import AsyncSession

from .repositories import (
    create_application,
    get_application,
    get_application_by_code,
    get_application_by_name,
    list_applications,
    update_application,
    update_application_status,
)
from .schemas import (
    ApplicationCreateIn,
    ApplicationOut,
    ApplicationQueryIn,
    ApplicationStatusUpdateIn,
    ApplicationUpdateIn,
)


async def list_applications_service(
    db: AsyncSession,
    query: ApplicationQueryIn,
) -> tuple[list[ApplicationOut], int]:
    applications, total = await list_applications(db, query)
    return (
        [ApplicationOut.model_validate(application) for application in applications],
        total,
    )


async def validate_application_unique(
    db: AsyncSession,
    *,
    tenant_id: int,
    code: str,
    name: str,
    application_id: int | None = None,
) -> None:
    existing_code = await get_application_by_code(db, tenant_id=tenant_id, code=code)
    if existing_code and existing_code.id != application_id:
        raise BusinessError("应用编码已存在")

    existing_name = await get_application_by_name(db, tenant_id=tenant_id, name=name)
    if existing_name and existing_name.id != application_id:
        raise BusinessError("应用名称已存在")


async def create_application_service(
    db: AsyncSession,
    application_in: ApplicationCreateIn,
    *,
    operator_id: int | None = None,
) -> ApplicationOut:
    await validate_application_unique(
        db,
        tenant_id=application_in.tenant_id,
        code=application_in.code,
        name=application_in.name,
    )

    application = await create_application(
        db,
        application_in,
        operator_id=operator_id,
    )
    await db.commit()
    return ApplicationOut.model_validate(application)


async def update_application_service(
    db: AsyncSession,
    application_id: int,
    application_in: ApplicationUpdateIn,
    *,
    operator_id: int | None = None,
) -> ApplicationOut:
    application = await get_application(db, application_id)
    if not application:
        raise NotFoundError("应用不存在")

    tenant_id = application_in.tenant_id or application.tenant_id
    if tenant_id is None:
        raise BusinessError("租户 ID 不能为空")

    code = application_in.code or application.code
    name = application_in.name or application.name
    await validate_application_unique(
        db,
        tenant_id=tenant_id,
        code=code,
        name=name,
        application_id=application_id,
    )

    updated = await update_application(
        db,
        application,
        application_in,
        operator_id=operator_id,
    )
    await db.commit()
    return ApplicationOut.model_validate(updated)


async def update_application_status_service(
    db: AsyncSession,
    application_id: int,
    status_in: ApplicationStatusUpdateIn,
    *,
    operator_id: int | None = None,
) -> ApplicationOut:
    application = await get_application(db, application_id)
    if not application:
        raise NotFoundError("应用不存在")

    updated = await update_application_status(
        db,
        application,
        status_in,
        operator_id=operator_id,
    )
    await db.commit()
    return ApplicationOut.model_validate(updated)

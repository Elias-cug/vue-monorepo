from lee_api_core import BusinessError, NotFoundError
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Organization
from .repositories import (
    create_organization,
    get_organization,
    get_organization_by_code,
    has_children,
    list_all_organizations,
    list_organizations,
    soft_delete_organization,
    update_organization,
)
from .schemas import (
    OrganizationCreateIn,
    OrganizationOut,
    OrganizationQueryIn,
    OrganizationTreeOut,
    OrganizationUpdateIn,
)


def build_organization_tree(
    organizations: list[Organization],
) -> list[OrganizationTreeOut]:
    node_map = {
        organization.id: OrganizationTreeOut.model_validate(organization)
        for organization in organizations
    }
    roots: list[OrganizationTreeOut] = []

    for organization in organizations:
        node = node_map[organization.id]
        if organization.parent_id and organization.parent_id in node_map:
            node_map[organization.parent_id].children.append(node)
        else:
            roots.append(node)

    return roots


async def list_organizations_service(
    db: AsyncSession,
    query: OrganizationQueryIn,
) -> tuple[list[OrganizationOut], int]:
    organizations, total = await list_organizations(db, query)
    organization_items = [
        OrganizationOut.model_validate(organization)
        for organization in organizations
    ]
    return (
        organization_items,
        total,
    )


async def list_organization_tree_service(
    db: AsyncSession,
    query: OrganizationQueryIn,
) -> list[OrganizationTreeOut]:
    organizations = await list_all_organizations(db, query)
    return build_organization_tree(organizations)


async def get_organization_service(
    db: AsyncSession,
    organization_id: int,
) -> OrganizationOut:
    organization = await get_organization(db, organization_id)
    if not organization:
        raise NotFoundError("组织不存在")
    return OrganizationOut.model_validate(organization)


async def validate_parent(
    db: AsyncSession,
    *,
    organization_id: int | None = None,
    parent_id: int | None = None,
) -> None:
    if parent_id is None:
        return

    if organization_id is not None and parent_id == organization_id:
        raise BusinessError("上级组织不能选择自己")

    parent = await get_organization(db, parent_id)
    if not parent:
        raise BusinessError("上级组织不存在")


async def validate_code_unique(
    db: AsyncSession,
    *,
    tenant_id: int,
    code: str,
    organization_id: int | None = None,
) -> None:
    existing = await get_organization_by_code(db, tenant_id=tenant_id, code=code)
    if existing and existing.id != organization_id:
        raise BusinessError("组织编码已存在")


async def create_organization_service(
    db: AsyncSession,
    organization_in: OrganizationCreateIn,
    *,
    operator_id: int | None = None,
) -> OrganizationOut:
    await validate_parent(db, parent_id=organization_in.parent_id)
    await validate_code_unique(
        db,
        tenant_id=organization_in.tenant_id,
        code=organization_in.code,
    )

    organization = await create_organization(
        db,
        organization_in,
        operator_id=operator_id,
    )
    await db.commit()
    return OrganizationOut.model_validate(organization)


async def update_organization_service(
    db: AsyncSession,
    organization_id: int,
    organization_in: OrganizationUpdateIn,
    *,
    operator_id: int | None = None,
) -> OrganizationOut:
    organization = await get_organization(db, organization_id)
    if not organization:
        raise NotFoundError("组织不存在")

    await validate_parent(
        db,
        organization_id=organization_id,
        parent_id=organization_in.parent_id,
    )

    tenant_id = organization_in.tenant_id or organization.tenant_id
    code = organization_in.code or organization.code
    await validate_code_unique(
        db,
        tenant_id=tenant_id,
        code=code,
        organization_id=organization_id,
    )

    updated = await update_organization(
        db,
        organization,
        organization_in,
        operator_id=operator_id,
    )
    await db.commit()
    return OrganizationOut.model_validate(updated)


async def delete_organization_service(
    db: AsyncSession,
    organization_id: int,
    *,
    operator_id: int | None = None,
) -> OrganizationOut:
    organization = await get_organization(db, organization_id)
    if not organization:
        raise NotFoundError("组织不存在")

    if await has_children(db, organization_id):
        raise BusinessError("存在下级组织，不能删除")

    deleted = await soft_delete_organization(db, organization, operator_id=operator_id)
    await db.commit()
    return OrganizationOut.model_validate(deleted)

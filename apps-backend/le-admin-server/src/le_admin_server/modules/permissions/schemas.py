from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from lee_api_core import BaseSchema, ListQuerySchema
from pydantic import Field, field_serializer, field_validator

PermissionType = Literal["app", "menu", "button"]
PERMISSION_CODE_PATTERN = r"^[A-Za-z0-9_.:-]+$"


class PermissionCreateIn(BaseSchema):
    tenant_id: int = Field(..., ge=1)
    application_id: int = Field(..., ge=1)
    parent_id: int | None = Field(default=None, ge=1)
    code: str = Field(
        ...,
        min_length=1,
        max_length=128,
        pattern=PERMISSION_CODE_PATTERN,
    )
    name: str = Field(..., min_length=1, max_length=64)
    display_name: str | None = Field(default=None, max_length=128)
    type: PermissionType
    route_path: str | None = Field(default=None, max_length=255)
    component: str | None = Field(default=None, max_length=255)
    icon: str | None = Field(default=None, max_length=128)
    description: str | None = Field(default=None, max_length=255)
    status: int = Field(default=1, ge=0, le=1)
    is_system: bool = False
    sort: int = Field(default=0, ge=0)

    @field_validator(
        "parent_id",
        "display_name",
        "route_path",
        "component",
        "icon",
        "description",
        mode="before",
    )
    @classmethod
    def empty_to_none(cls, value: Any) -> Any:
        if value == "":
            return None
        return value


class PermissionUpdateIn(BaseSchema):
    tenant_id: int | None = Field(default=None, ge=1)
    application_id: int | None = Field(default=None, ge=1)
    parent_id: int | None = Field(default=None, ge=1)
    code: str | None = Field(
        default=None,
        min_length=1,
        max_length=128,
        pattern=PERMISSION_CODE_PATTERN,
    )
    name: str | None = Field(default=None, min_length=1, max_length=64)
    display_name: str | None = Field(default=None, max_length=128)
    type: PermissionType | None = None
    route_path: str | None = Field(default=None, max_length=255)
    component: str | None = Field(default=None, max_length=255)
    icon: str | None = Field(default=None, max_length=128)
    description: str | None = Field(default=None, max_length=255)
    status: int | None = Field(default=None, ge=0, le=1)
    sort: int | None = Field(default=None, ge=0)

    @field_validator(
        "parent_id",
        "display_name",
        "route_path",
        "component",
        "icon",
        "description",
        mode="before",
    )
    @classmethod
    def empty_to_none(cls, value: Any) -> Any:
        if value == "":
            return None
        return value


class PermissionStatusUpdateIn(BaseSchema):
    status: int = Field(..., ge=0, le=1)


class PermissionQueryIn(ListQuerySchema):
    tenant_id: int | None = None
    application_id: int | None = None
    parent_id: int | None = None
    keyword: str | None = None
    type: PermissionType | None = None
    status: int | None = Field(default=None, ge=0, le=1)

    @field_validator("keyword", mode="before")
    @classmethod
    def empty_str_to_none(cls, value: Any) -> Any:
        if isinstance(value, str) and not value.strip():
            return None
        return value


class PermissionOut(BaseSchema):
    id: int
    tenant_id: int
    application_id: int
    parent_id: int | None = None
    code: str
    name: str
    display_name: str | None = None
    type: str
    route_path: str | None = None
    component: str | None = None
    icon: str | None = None
    description: str | None = None
    status: int
    is_system: bool
    sort: int
    created_at: datetime
    updated_at: datetime

    @field_serializer("created_at", "updated_at", when_used="json")
    def serialize_datetime(self, value: datetime | None) -> str | None:
        if value is None:
            return None
        return value.strftime("%Y-%m-%d %H:%M:%S")


class PermissionTreeOut(PermissionOut):
    children: list[PermissionTreeOut] = Field(default_factory=list)


class RolePermissionIdsOut(BaseSchema):
    role_id: int
    permission_ids: list[int] = Field(default_factory=list)


class RolePermissionSaveIn(BaseSchema):
    permission_ids: list[int] = Field(default_factory=list)

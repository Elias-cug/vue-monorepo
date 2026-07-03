from __future__ import annotations

from datetime import datetime
from typing import Any

from lee_api_core import BaseSchema, ListQuerySchema
from pydantic import Field, field_serializer, field_validator

ORG_CODE_PATTERN = r"^[A-Za-z0-9_.-]+$"


class OrganizationCreateIn(BaseSchema):
    tenant_id: int = Field(..., ge=1)
    parent_id: int | None = Field(default=None, ge=1)
    name: str = Field(..., min_length=1, max_length=128)
    code: str = Field(..., min_length=1, max_length=64, pattern=ORG_CODE_PATTERN)
    org_type: str = Field(default="department", min_length=1, max_length=32)
    sort_order: int = Field(default=0, ge=0, le=32767)
    status: int = Field(default=1, ge=0, le=1)
    remark: str | None = Field(default=None, max_length=255)

    @field_validator("parent_id", "remark", mode="before")
    @classmethod
    def empty_to_none(cls, value: Any) -> Any:
        if value == "":
            return None
        return value


class OrganizationUpdateIn(BaseSchema):
    tenant_id: int | None = Field(default=None, ge=1)
    parent_id: int | None = Field(default=None, ge=1)
    name: str | None = Field(default=None, min_length=1, max_length=128)
    code: str | None = Field(
        default=None,
        min_length=1,
        max_length=64,
        pattern=ORG_CODE_PATTERN,
    )
    org_type: str | None = Field(default=None, min_length=1, max_length=32)
    sort_order: int | None = Field(default=None, ge=0, le=32767)
    status: int | None = Field(default=None, ge=0, le=1)
    remark: str | None = Field(default=None, max_length=255)

    @field_validator("parent_id", "remark", mode="before")
    @classmethod
    def empty_to_none(cls, value: Any) -> Any:
        if value == "":
            return None
        return value


class OrganizationQueryIn(ListQuerySchema):
    tenant_id: int | None = None
    parent_id: int | None = None
    keyword: str | None = None
    org_type: str | None = None
    status: int | None = Field(default=None, ge=0, le=1)

    @field_validator("keyword", "org_type", mode="before")
    @classmethod
    def empty_str_to_none(cls, value: Any) -> Any:
        if isinstance(value, str) and not value.strip():
            return None
        return value


class OrganizationOut(BaseSchema):
    id: int
    tenant_id: int
    parent_id: int | None = None
    name: str
    code: str
    org_type: str
    sort_order: int
    status: int
    remark: str | None = None
    created_at: datetime
    updated_at: datetime

    @field_serializer("created_at", "updated_at", when_used="json")
    def serialize_datetime(self, value: datetime | None) -> str | None:
        if value is None:
            return None
        return value.strftime("%Y-%m-%d %H:%M:%S")


class OrganizationTreeOut(OrganizationOut):
    children: list[OrganizationTreeOut] = Field(default_factory=list)

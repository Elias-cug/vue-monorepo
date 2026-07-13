from __future__ import annotations

from datetime import datetime
from typing import Any

from lee_api_core import BaseSchema, ListQuerySchema
from pydantic import Field, field_serializer, field_validator

APPLICATION_CODE_PATTERN = r"^[A-Za-z0-9_.-]+$"


class ApplicationCreateIn(BaseSchema):
    tenant_id: int = Field(..., ge=1)
    code: str = Field(
        ...,
        min_length=1,
        max_length=64,
        pattern=APPLICATION_CODE_PATTERN,
    )
    name: str = Field(..., min_length=1, max_length=64)
    display_name: str | None = Field(default=None, max_length=128)
    entry_url: str | None = Field(default=None, max_length=255)
    icon: str | None = Field(default=None, max_length=128)
    description: str | None = Field(default=None, max_length=255)
    status: int = Field(default=1, ge=0, le=1)
    sort: int = Field(default=0, ge=0)

    @field_validator("display_name", "entry_url", "icon", "description", mode="before")
    @classmethod
    def empty_to_none(cls, value: Any) -> Any:
        if value == "":
            return None
        return value


class ApplicationUpdateIn(BaseSchema):
    tenant_id: int | None = Field(default=None, ge=1)
    code: str | None = Field(
        default=None,
        min_length=1,
        max_length=64,
        pattern=APPLICATION_CODE_PATTERN,
    )
    name: str | None = Field(default=None, min_length=1, max_length=64)
    display_name: str | None = Field(default=None, max_length=128)
    entry_url: str | None = Field(default=None, max_length=255)
    icon: str | None = Field(default=None, max_length=128)
    description: str | None = Field(default=None, max_length=255)
    status: int | None = Field(default=None, ge=0, le=1)
    sort: int | None = Field(default=None, ge=0)

    @field_validator("display_name", "entry_url", "icon", "description", mode="before")
    @classmethod
    def empty_to_none(cls, value: Any) -> Any:
        if value == "":
            return None
        return value


class ApplicationStatusUpdateIn(BaseSchema):
    status: int = Field(..., ge=0, le=1)


class ApplicationQueryIn(ListQuerySchema):
    tenant_id: int | None = None
    keyword: str | None = None
    status: int | None = Field(default=None, ge=0, le=1)

    @field_validator("keyword", mode="before")
    @classmethod
    def empty_str_to_none(cls, value: Any) -> Any:
        if isinstance(value, str) and not value.strip():
            return None
        return value


class ApplicationOut(BaseSchema):
    id: int
    tenant_id: int | None = None
    code: str
    name: str
    display_name: str | None = None
    entry_url: str | None = None
    icon: str | None = None
    description: str | None = None
    status: int
    sort: int
    created_at: datetime
    updated_at: datetime

    @field_serializer("created_at", "updated_at", when_used="json")
    def serialize_datetime(self, value: datetime | None) -> str | None:
        if value is None:
            return None
        return value.strftime("%Y-%m-%d %H:%M:%S")

from datetime import datetime
from typing import Any

from lee_api_core import BaseSchema
from pydantic import Field, field_serializer, field_validator


class LoginIn(BaseSchema):
    tenant_id: int = Field(default=1, ge=1)
    username: str = Field(..., min_length=1, max_length=64)
    password: str = Field(..., min_length=1)


class TokenPairOut(BaseSchema):
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    expires_in: int


class CurrentUserOut(BaseSchema):
    id: int
    tenant_id: int
    organization_id: int | None = None
    organization_name: str | None = None
    username: str
    email: str | None = None
    phone: str | None = None
    display_name: str | None = None
    avatar_url: str | None = None
    status: int
    last_login_at: datetime | None = None
    last_login_ip: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    @field_validator("last_login_ip", mode="before")
    @classmethod
    def serialize_ip(cls, value: Any) -> str | None:
        if value is None:
            return None
        return str(value)

    @field_serializer("last_login_at", "created_at", "updated_at", when_used="json")
    def serialize_datetime(self, value: datetime | None) -> str | None:
        if value is None:
            return None
        return value.strftime("%Y-%m-%d %H:%M:%S")

from __future__ import annotations

from datetime import datetime
from typing import Any

from lee_api_core import BaseSchema, ListQuerySchema
from pydantic import Field, ValidationInfo, field_serializer, field_validator

USERNAME_PATTERN = r"^[A-Za-z0-9_.-]+$"


class UserCreateIn(BaseSchema):
    tenant_id: int = Field(..., ge=1)
    username: str = Field(..., min_length=1, max_length=64, pattern=USERNAME_PATTERN)
    email: str | None = Field(default=None, max_length=128)
    phone: str | None = Field(default=None, max_length=32)
    display_name: str | None = Field(default=None, max_length=128)
    avatar_url: str | None = Field(default=None, max_length=255)
    status: int = Field(default=1, ge=0, le=1)

    @field_validator("email", mode="before")
    @classmethod
    def validate_email(cls, value: Any) -> Any:
        if value is None or value == "":
            return None
        if isinstance(value, str) and "@" not in value:
            raise ValueError("邮箱格式不正确")
        return value


class UserUpdateIn(BaseSchema):
    tenant_id: int | None = Field(default=None, ge=1)
    email: str | None = Field(default=None, max_length=128)
    phone: str | None = Field(default=None, max_length=32)
    display_name: str | None = Field(default=None, max_length=128)
    avatar_url: str | None = Field(default=None, max_length=255)
    status: int | None = Field(default=None, ge=0, le=1)

    @field_validator("email", mode="before")
    @classmethod
    def validate_email(cls, value: Any) -> Any:
        if value is None or value == "":
            return None
        if isinstance(value, str) and "@" not in value:
            raise ValueError("邮箱格式不正确")
        return value


class UserChangePasswordIn(BaseSchema):
    old_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8)

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("新密码不能为空")
        return value


class UserResetPasswordOut(BaseSchema):
    id: int
    initial_password: str

class UserQueryIn(ListQuerySchema):
    tenant_id: int | None = None
    username: str | None = None
    email: str | None = None
    phone: str | None = None
    display_name: str | None = None
    status: int | None = Field(default=None, ge=0, le=1)
    created_from: datetime | None = Field(default=None)
    created_to: datetime | None = Field(default=None)

    @field_validator("username", "email", "phone", "display_name", mode="before")
    @classmethod
    def empty_str_to_none(cls, value: Any) -> Any:
        if isinstance(value, str) and not value.strip():
            return None
        return value

    @field_validator("created_from", "created_to", mode="before")
    @classmethod
    def parse_datetime(cls, value: Any, info: ValidationInfo) -> Any:
        if value is None:
            return None
        if isinstance(value, str):
            value = value.strip()
            if not value:
                return None
            if "T" not in value and " " in value:
                value = value.replace(" ", "T", 1)
            if len(value) == 10 and value[4] == "-" and value[7] == "-":
                suffix = "T23:59:59" if info.field_name == "created_to" else "T00:00:00"
                value = value + suffix
            return datetime.fromisoformat(value)
        return value


class UserOut(BaseSchema):
    id: int
    tenant_id: int
    username: str
    email: str | None = None
    phone: str | None = None
    status: int
    display_name: str | None = None
    avatar_url: str | None = None
    last_login_at: datetime | None = None
    last_login_ip: str | None = None
    created_at: datetime
    updated_at: datetime

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

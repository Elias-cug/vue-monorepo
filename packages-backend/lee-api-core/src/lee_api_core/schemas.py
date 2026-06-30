from typing import Generic, Literal, TypeVar

from pydantic import BaseModel, ConfigDict, Field

T = TypeVar("T")


def to_camel(value: str) -> str:
    parts = value.split("_")
    return parts[0] + "".join(part[:1].upper() + part[1:] for part in parts[1:])


class BaseSchema(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        from_attributes=True,
        populate_by_name=True,
    )


class SuccessResponse(BaseSchema, Generic[T]):
    code: int = 0
    message: str = "success"
    data: T | None = None


class PageData(BaseSchema, Generic[T]):
    data: list[T] = Field(default_factory=list)
    total: int = 0


class PaginationSchema(BaseSchema):
    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=200)


class OrderSchema(BaseSchema):
    sort_by: str = "created_at"
    order: Literal["asc", "desc"] = "desc"


class ListQuerySchema(PaginationSchema, OrderSchema):
    pass


def success(data: T | None = None, *, message: str = "success") -> SuccessResponse[T]:
    return SuccessResponse(data=data, message=message)


def page(items: list[T], total: int) -> PageData[T]:
    return PageData(data=items, total=total)

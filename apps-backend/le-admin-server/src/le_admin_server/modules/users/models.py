from __future__ import annotations

from datetime import datetime

from sqlalchemy import (
    BigInteger,
    Boolean,
    DateTime,
    Integer,
    SmallInteger,
    String,
    func,
    text,
)
from sqlalchemy.dialects.postgresql import INET
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql.elements import quoted_name

from le_admin_server.core.settings import get_settings
from le_admin_server.database import Base

settings = get_settings()


class User(Base):
    __tablename__ = quoted_name("user", True)
    if settings.database_schema:
        __table_args__ = {"schema": settings.database_schema}

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    tenant_id: Mapped[int] = mapped_column(BigInteger, nullable=False)

    username: Mapped[str] = mapped_column(String(64), nullable=False)
    email: Mapped[str | None] = mapped_column(String(128))
    phone: Mapped[str | None] = mapped_column(String(32))
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    status: Mapped[int] = mapped_column(
        SmallInteger,
        nullable=False,
        server_default=text("1"),
    )
    is_deleted: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        server_default=text("false"),
    )

    display_name: Mapped[str | None] = mapped_column(String(128))
    avatar_url: Mapped[str | None] = mapped_column(String(255))

    last_login_at: Mapped[datetime | None] = mapped_column(DateTime)
    last_login_ip: Mapped[str | None] = mapped_column(INET)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    created_by: Mapped[int | None] = mapped_column(BigInteger)
    updated_by: Mapped[int | None] = mapped_column(BigInteger)

    is_password_changed: Mapped[bool | None] = mapped_column(Boolean)
    password_updated_at: Mapped[datetime | None] = mapped_column(DateTime)
    password_expires_at: Mapped[datetime | None] = mapped_column(DateTime)

    login_failed_count: Mapped[int | None] = mapped_column(Integer)
    last_login_failed_at: Mapped[datetime | None] = mapped_column(DateTime)
    is_locked: Mapped[bool | None] = mapped_column(Boolean)
    locked_until: Mapped[datetime | None] = mapped_column(DateTime)
    is_first_login: Mapped[bool | None] = mapped_column(Boolean)

from lee_db import BigIntIdMixin, TimestampMixin, create_declarative_base
from sqlalchemy.orm import Mapped, mapped_column

Base = create_declarative_base()


class DemoModel(BigIntIdMixin, TimestampMixin, Base):
    __tablename__ = "demo"

    name: Mapped[str] = mapped_column()


def test_model_metadata_is_registered() -> None:
    assert "demo" in Base.metadata.tables
    assert "created_at" in Base.metadata.tables["demo"].columns
    assert "updated_at" in Base.metadata.tables["demo"].columns

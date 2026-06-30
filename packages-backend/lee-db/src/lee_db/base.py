from sqlalchemy.orm import DeclarativeBase


def create_declarative_base() -> type[DeclarativeBase]:
    class Base(DeclarativeBase):
        pass

    return Base

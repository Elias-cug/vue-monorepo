from lee_db import create_async_engine, create_declarative_base, create_session_factory

from .core.settings import get_settings

settings = get_settings()

Base = create_declarative_base()

engine = create_async_engine(
    settings.database_url,
    echo=settings.database_echo,
)

AsyncSessionLocal = create_session_factory(engine)

__all__ = ["AsyncSessionLocal", "Base", "engine"]

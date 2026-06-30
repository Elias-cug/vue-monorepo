from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

SERVICE_ROOT = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(SERVICE_ROOT / ".env"),
        env_prefix="LE_ADMIN_",
        extra="ignore",
    )

    app_name: str = "le-admin-server"
    app_version: str = "0.1.0"
    environment: str = "local"
    debug: bool = False

    api_v1_prefix: str = "/api/v1"
    cors_origins: list[str] = Field(default_factory=list)

    database_url: str = (
        "postgresql+asyncpg://postgres:postgres@localhost:5432/le_admin"
    )
    database_schema: str | None = None
    database_echo: bool = False
    check_database_on_startup: bool = False

    jwt_secret: str = "change-me-in-local-development"
    jwt_algorithm: str = "HS256"
    access_token_exp_minutes: int = 15
    refresh_token_exp_days: int = 14


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()

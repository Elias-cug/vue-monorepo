from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from lee_api_core import create_service_app, health_router
from lee_db import ping_database

from .api.v1.router import router as v1_router
from .core.settings import get_settings
from .database import engine


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncGenerator[None, None]:
    settings = get_settings()
    if settings.check_database_on_startup:
        await ping_database(engine)
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = create_service_app(
        title=settings.app_name,
        version=settings.app_version,
        lifespan=lifespan,
        cors_origins=settings.cors_origins,
    )

    app.include_router(health_router)
    app.include_router(v1_router, prefix=settings.api_v1_prefix)

    return app

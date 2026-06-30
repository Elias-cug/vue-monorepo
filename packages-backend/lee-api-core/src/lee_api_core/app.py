from collections.abc import Sequence
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .exceptions import register_exception_handlers


def create_service_app(
    *,
    title: str,
    version: str,
    lifespan: Any | None = None,
    cors_origins: Sequence[str] | None = None,
) -> FastAPI:
    app = FastAPI(title=title, version=version, lifespan=lifespan)
    register_exception_handlers(app)

    if cors_origins:
        install_cors(app, cors_origins=cors_origins)

    return app


def install_cors(app: FastAPI, *, cors_origins: Sequence[str]) -> None:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(cors_origins),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

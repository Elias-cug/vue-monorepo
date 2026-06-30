from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class BusinessError(Exception):
    def __init__(
        self,
        message: str,
        *,
        code: int = 400,
        status_code: int | None = None,
    ) -> None:
        self.message = message
        self.code = code
        self.status_code = status_code or code


class UnauthorizedError(BusinessError):
    def __init__(self, message: str = "unauthorized") -> None:
        super().__init__(message, code=401, status_code=401)


class PermissionDeniedError(BusinessError):
    def __init__(self, message: str = "permission denied") -> None:
        super().__init__(message, code=403, status_code=403)


class NotFoundError(BusinessError):
    def __init__(self, message: str = "resource not found") -> None:
        super().__init__(message, code=404, status_code=404)


async def business_exception_handler(
    _request: Request,
    exc: BusinessError,
) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"code": exc.code, "message": exc.message, "data": None},
    )


async def unhandled_exception_handler(
    _request: Request,
    _exc: Exception,
) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content={"code": 500, "message": "internal server error", "data": None},
    )


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(BusinessError, business_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)

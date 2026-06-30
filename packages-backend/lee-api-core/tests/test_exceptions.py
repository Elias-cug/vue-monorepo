from fastapi import FastAPI
from fastapi.testclient import TestClient
from lee_api_core import BusinessError, register_exception_handlers


def test_business_error_handler() -> None:
    app = FastAPI()
    register_exception_handlers(app)

    @app.get("/error")
    async def error() -> None:
        raise BusinessError("invalid input", code=400)

    response = TestClient(app).get("/error")

    assert response.status_code == 400
    assert response.json() == {
        "code": 400,
        "message": "invalid input",
        "data": None,
    }

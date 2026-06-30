from fastapi.testclient import TestClient
from le_admin_server.app import create_app


def test_healthz() -> None:
    client = TestClient(create_app())

    response = client.get("/healthz")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_v1_ping() -> None:
    client = TestClient(create_app())

    response = client.get("/api/v1/ping")

    assert response.status_code == 200
    assert response.json() == {
        "code": 0,
        "message": "success",
        "data": {"service": "le-admin-server"},
    }

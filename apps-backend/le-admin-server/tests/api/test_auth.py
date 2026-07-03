from fastapi.testclient import TestClient
from le_admin_server.api.deps import get_current_user
from le_admin_server.app import create_app
from le_admin_server.modules.auth.schemas import TokenPairOut
from le_admin_server.modules.organizations.models import Organization
from le_admin_server.modules.users.models import User


def make_user() -> User:
    return User(
        id=1,
        tenant_id=1,
        organization_id=1,
        username="admin",
        password_hash="hashed",
        status=1,
        display_name="管理员",
        email="admin@example.com",
        phone="13800000000",
    )


def test_login_api(monkeypatch) -> None:
    async def fake_login_service(_db, login_in):
        assert login_in.username == "admin"
        return TokenPairOut(
            access_token="access-token",
            refresh_token="refresh-token",
            expires_in=900,
        )

    monkeypatch.setattr(
        "le_admin_server.modules.auth.routes.login_service",
        fake_login_service,
    )

    client = TestClient(create_app())
    response = client.post(
        "/api/v1/auth/login",
        json={"tenantId": 1, "username": "admin", "password": "Admin@1234"},
    )

    assert response.status_code == 200
    assert response.json()["data"]["accessToken"] == "access-token"
    assert response.json()["data"]["tokenType"] == "Bearer"


def test_current_user_api(monkeypatch) -> None:
    async def fake_get_organization(_db, organization_id):
        assert organization_id == 1
        return Organization(
            id=1,
            tenant_id=1,
            name="技术部",
            code="tech",
            org_type="department",
            status=1,
            sort_order=10,
        )

    monkeypatch.setattr(
        "le_admin_server.modules.auth.services.get_organization",
        fake_get_organization,
    )

    app = create_app()
    app.dependency_overrides[get_current_user] = make_user

    client = TestClient(app)
    response = client.get("/api/v1/auth/me")

    assert response.status_code == 200
    assert response.json()["data"]["username"] == "admin"
    assert response.json()["data"]["organizationId"] == 1
    assert response.json()["data"]["organizationName"] == "技术部"
    assert response.json()["data"]["email"] == "admin@example.com"


def test_protected_api_rejects_missing_token() -> None:
    client = TestClient(create_app())
    response = client.get("/api/v1/users?page=1&pageSize=20")

    assert response.status_code == 401

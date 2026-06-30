from fastapi.testclient import TestClient
from le_admin_server.app import create_app
from le_admin_server.modules.users.schemas import UserOut, UserResetPasswordOut


def make_user(**overrides) -> UserOut:
    data = {
        "id": 1,
        "tenant_id": 1,
        "username": "admin",
        "email": "admin@example.com",
        "phone": "13800000000",
        "status": 1,
        "display_name": "管理员",
        "avatar_url": None,
        "last_login_at": None,
        "last_login_ip": None,
        "created_at": "2026-01-01T00:00:00",
        "updated_at": "2026-01-01T00:00:00",
    }
    data.update(overrides)
    return UserOut.model_validate(data)


def test_list_users_api(monkeypatch) -> None:
    async def fake_list_users_service(_db, query):
        assert query.page == 1
        assert query.page_size == 20
        return [make_user()], 1

    monkeypatch.setattr(
        "le_admin_server.modules.users.routes.list_users_service",
        fake_list_users_service,
    )

    client = TestClient(create_app())
    response = client.get("/api/v1/users?page=1&pageSize=20")

    assert response.status_code == 200
    assert response.json()["data"]["total"] == 1
    assert response.json()["data"]["data"][0]["username"] == "admin"


def test_create_user_api(monkeypatch) -> None:
    async def fake_create_user_service(_db, user_in):
        assert user_in.username == "new_user"
        return make_user(id=2, username="new_user")

    monkeypatch.setattr(
        "le_admin_server.modules.users.routes.create_user_service",
        fake_create_user_service,
    )

    client = TestClient(create_app())
    response = client.post(
        "/api/v1/users",
        json={
            "tenantId": 1,
            "username": "new_user",
            "email": "new@example.com",
            "phone": "13800000001",
            "displayName": "新用户",
            "status": 1,
        },
    )

    assert response.status_code == 200
    assert response.json()["data"]["id"] == 2


def test_update_user_api(monkeypatch) -> None:
    async def fake_update_user_service(_db, user_id, user_in):
        assert user_id == 1
        assert user_in.display_name == "更新用户"
        return make_user(display_name="更新用户")

    monkeypatch.setattr(
        "le_admin_server.modules.users.routes.update_user_service",
        fake_update_user_service,
    )

    client = TestClient(create_app())
    response = client.put(
        "/api/v1/users/1",
        json={"displayName": "更新用户", "status": 1},
    )

    assert response.status_code == 200
    assert response.json()["data"]["displayName"] == "更新用户"


def test_delete_user_api(monkeypatch) -> None:
    async def fake_delete_user_service(_db, user_id):
        assert user_id == 1
        return make_user()

    monkeypatch.setattr(
        "le_admin_server.modules.users.routes.delete_user_service",
        fake_delete_user_service,
    )

    client = TestClient(create_app())
    response = client.delete("/api/v1/users/1")

    assert response.status_code == 200
    assert response.json()["data"]["id"] == 1


def test_reset_password_api(monkeypatch) -> None:
    async def fake_reset_password_service(_db, user_id):
        assert user_id == 1
        return UserResetPasswordOut(id=1, initial_password="Admin@1234")

    monkeypatch.setattr(
        "le_admin_server.modules.users.routes.reset_password_service",
        fake_reset_password_service,
    )

    client = TestClient(create_app())
    response = client.post("/api/v1/users/1/reset-password")

    assert response.status_code == 200
    assert response.json()["data"] == {
        "id": 1,
        "initialPassword": "Admin@1234",
    }

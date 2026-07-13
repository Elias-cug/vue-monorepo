from fastapi.testclient import TestClient
from le_admin_server.api.deps import get_current_user
from le_admin_server.app import create_app
from le_admin_server.modules.roles.schemas import RoleOut


def create_test_client() -> TestClient:
    app = create_app()
    app.dependency_overrides[get_current_user] = lambda: object()
    return TestClient(app)


def make_role(**overrides) -> RoleOut:
    data = {
        "id": 1,
        "tenant_id": 1,
        "code": "admin",
        "name": "admin",
        "display_name": "管理员",
        "description": "系统管理员",
        "status": 1,
        "is_system": False,
        "sort": 0,
        "created_at": "2026-01-01T00:00:00",
        "updated_at": "2026-01-01T00:00:00",
    }
    data.update(overrides)
    return RoleOut.model_validate(data)


def test_list_roles_api(monkeypatch) -> None:
    async def fake_list_roles_service(_db, query):
        assert query.page == 1
        assert query.page_size == 20
        assert query.keyword == "admin"
        return [make_role()], 1

    monkeypatch.setattr(
        "le_admin_server.modules.roles.routes.list_roles_service",
        fake_list_roles_service,
    )

    client = create_test_client()
    response = client.get("/api/v1/roles?page=1&pageSize=20&keyword=admin")

    assert response.status_code == 200
    assert response.json()["data"]["total"] == 1
    assert response.json()["data"]["data"][0]["code"] == "admin"
    assert response.json()["data"]["data"][0]["displayName"] == "管理员"


def test_create_role_api(monkeypatch) -> None:
    async def fake_create_role_service(_db, role_in):
        assert role_in.tenant_id == 1
        assert role_in.code == "operator"
        assert role_in.display_name == "运营"
        return make_role(id=2, code="operator", name="operator", display_name="运营")

    monkeypatch.setattr(
        "le_admin_server.modules.roles.routes.create_role_service",
        fake_create_role_service,
    )

    client = create_test_client()
    response = client.post(
        "/api/v1/roles",
        json={
            "tenantId": 1,
            "code": "operator",
            "name": "operator",
            "displayName": "运营",
            "description": "运营角色",
            "status": 1,
            "sort": 10,
        },
    )

    assert response.status_code == 200
    assert response.json()["data"]["id"] == 2


def test_update_role_api(monkeypatch) -> None:
    async def fake_update_role_service(_db, role_id, role_in):
        assert role_id == 1
        assert role_in.name == "admin_updated"
        assert role_in.display_name == "更新角色"
        return make_role(name="admin_updated", display_name="更新角色")

    monkeypatch.setattr(
        "le_admin_server.modules.roles.routes.update_role_service",
        fake_update_role_service,
    )

    client = create_test_client()
    response = client.put(
        "/api/v1/roles/1",
        json={"name": "admin_updated", "displayName": "更新角色", "status": 1},
    )

    assert response.status_code == 200
    assert response.json()["data"]["name"] == "admin_updated"
    assert response.json()["data"]["displayName"] == "更新角色"


def test_update_role_status_api(monkeypatch) -> None:
    async def fake_update_role_status_service(_db, role_id, status_in):
        assert role_id == 1
        assert status_in.status == 0
        return make_role(status=0)

    monkeypatch.setattr(
        "le_admin_server.modules.roles.routes.update_role_status_service",
        fake_update_role_status_service,
    )

    client = create_test_client()
    response = client.patch("/api/v1/roles/1/status", json={"status": 0})

    assert response.status_code == 200
    assert response.json()["data"]["status"] == 0

from fastapi.testclient import TestClient
from le_admin_server.api.deps import get_current_user
from le_admin_server.app import create_app
from le_admin_server.modules.applications.schemas import ApplicationOut


def create_test_client() -> TestClient:
    app = create_app()
    app.dependency_overrides[get_current_user] = lambda: object()
    return TestClient(app)


def make_application(**overrides) -> ApplicationOut:
    data = {
        "id": 1,
        "tenant_id": 1,
        "code": "le-admin",
        "name": "le-admin",
        "display_name": "管理后台",
        "entry_url": "/le-admin",
        "icon": "menu-app-management",
        "description": "默认管理后台",
        "status": 1,
        "sort": 0,
        "created_at": "2026-01-01T00:00:00",
        "updated_at": "2026-01-01T00:00:00",
    }
    data.update(overrides)
    return ApplicationOut.model_validate(data)


def test_list_applications_api(monkeypatch) -> None:
    async def fake_list_applications_service(_db, query):
        assert query.page == 1
        assert query.page_size == 20
        assert query.keyword == "admin"
        return [make_application()], 1

    monkeypatch.setattr(
        "le_admin_server.modules.applications.routes.list_applications_service",
        fake_list_applications_service,
    )

    client = create_test_client()
    response = client.get("/api/v1/applications?page=1&pageSize=20&keyword=admin")

    assert response.status_code == 200
    assert response.json()["data"]["total"] == 1
    assert response.json()["data"]["data"][0]["code"] == "le-admin"
    assert response.json()["data"]["data"][0]["displayName"] == "管理后台"


def test_create_application_api(monkeypatch) -> None:
    async def fake_create_application_service(_db, application_in):
        assert application_in.tenant_id == 1
        assert application_in.code == "le-start"
        assert application_in.display_name == "启动应用"
        return make_application(
            id=2,
            code="le-start",
            name="le-start",
            display_name="启动应用",
        )

    monkeypatch.setattr(
        "le_admin_server.modules.applications.routes.create_application_service",
        fake_create_application_service,
    )

    client = create_test_client()
    response = client.post(
        "/api/v1/applications",
        json={
            "tenantId": 1,
            "code": "le-start",
            "name": "le-start",
            "displayName": "启动应用",
            "entryUrl": "/le-start",
            "icon": "menu-home",
            "description": "启动应用",
            "status": 1,
            "sort": 10,
        },
    )

    assert response.status_code == 200
    assert response.json()["data"]["id"] == 2


def test_update_application_api(monkeypatch) -> None:
    async def fake_update_application_service(_db, application_id, application_in):
        assert application_id == 1
        assert application_in.name == "le_admin_updated"
        assert application_in.display_name == "更新应用"
        return make_application(name="le_admin_updated", display_name="更新应用")

    monkeypatch.setattr(
        "le_admin_server.modules.applications.routes.update_application_service",
        fake_update_application_service,
    )

    client = create_test_client()
    response = client.put(
        "/api/v1/applications/1",
        json={
            "name": "le_admin_updated",
            "displayName": "更新应用",
            "status": 1,
        },
    )

    assert response.status_code == 200
    assert response.json()["data"]["name"] == "le_admin_updated"
    assert response.json()["data"]["displayName"] == "更新应用"


def test_update_application_status_api(monkeypatch) -> None:
    async def fake_update_application_status_service(_db, application_id, status_in):
        assert application_id == 1
        assert status_in.status == 0
        return make_application(status=0)

    monkeypatch.setattr(
        "le_admin_server.modules.applications.routes.update_application_status_service",
        fake_update_application_status_service,
    )

    client = create_test_client()
    response = client.patch("/api/v1/applications/1/status", json={"status": 0})

    assert response.status_code == 200
    assert response.json()["data"]["status"] == 0

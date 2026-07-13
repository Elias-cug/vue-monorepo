import pytest
from fastapi.testclient import TestClient
from le_admin_server.api.deps import get_current_user
from le_admin_server.app import create_app
from le_admin_server.modules.permissions.schemas import (
    PermissionOut,
    PermissionTreeOut,
    RolePermissionIdsOut,
)
from lee_api_core import BusinessError


def create_test_client() -> TestClient:
    app = create_app()
    app.dependency_overrides[get_current_user] = lambda: object()
    return TestClient(app)


def make_permission(**overrides) -> PermissionOut:
    data = {
        "id": 1,
        "tenant_id": 1,
        "application_id": 1,
        "parent_id": None,
        "code": "le-admin",
        "name": "le-admin",
        "display_name": "管理后台",
        "type": "app",
        "route_path": "/le-admin",
        "component": None,
        "icon": "menu-app-management",
        "description": "管理后台访问权限",
        "status": 1,
        "is_system": False,
        "sort": 0,
        "created_at": "2026-01-01T00:00:00",
        "updated_at": "2026-01-01T00:00:00",
    }
    data.update(overrides)
    return PermissionOut.model_validate(data)


def test_list_permissions_api(monkeypatch) -> None:
    async def fake_list_permissions_service(_db, query):
        assert query.page == 1
        assert query.page_size == 20
        assert query.type == "menu"
        return [make_permission(type="menu", parent_id=1)], 1

    monkeypatch.setattr(
        "le_admin_server.modules.permissions.routes.list_permissions_service",
        fake_list_permissions_service,
    )

    client = create_test_client()
    response = client.get("/api/v1/permissions?page=1&pageSize=20&type=menu")

    assert response.status_code == 200
    assert response.json()["data"]["total"] == 1
    assert response.json()["data"]["data"][0]["type"] == "menu"


def test_list_permission_tree_api(monkeypatch) -> None:
    async def fake_list_permission_tree_service(_db, _query):
        return [
            PermissionTreeOut.model_validate(
                {
                    **make_permission().model_dump(),
                    "children": [
                        {
                            **make_permission(
                                id=2,
                                parent_id=1,
                                code="user-management",
                                name="user-management",
                                display_name="用户管理",
                                type="menu",
                            ).model_dump(),
                            "children": [],
                        }
                    ],
                }
            )
        ]

    monkeypatch.setattr(
        "le_admin_server.modules.permissions.routes.list_permission_tree_service",
        fake_list_permission_tree_service,
    )

    client = create_test_client()
    response = client.get("/api/v1/permissions/tree")

    assert response.status_code == 200
    assert response.json()["data"][0]["children"][0]["type"] == "menu"


def test_create_permission_api(monkeypatch) -> None:
    async def fake_create_permission_service(_db, permission_in):
        assert permission_in.type == "button"
        assert permission_in.parent_id == 2
        return make_permission(
            id=3,
            parent_id=2,
            code="user:create",
            name="user-create",
            display_name="新增用户",
            type="button",
        )

    monkeypatch.setattr(
        "le_admin_server.modules.permissions.routes.create_permission_service",
        fake_create_permission_service,
    )

    client = create_test_client()
    response = client.post(
        "/api/v1/permissions",
        json={
            "tenantId": 1,
            "applicationId": 1,
            "parentId": 2,
            "code": "user:create",
            "name": "user-create",
            "displayName": "新增用户",
            "type": "button",
            "status": 1,
            "sort": 10,
        },
    )

    assert response.status_code == 200
    assert response.json()["data"]["type"] == "button"


def test_update_permission_api(monkeypatch) -> None:
    async def fake_update_permission_service(_db, permission_id, permission_in):
        assert permission_id == 1
        assert permission_in.display_name == "更新权限"
        return make_permission(display_name="更新权限")

    monkeypatch.setattr(
        "le_admin_server.modules.permissions.routes.update_permission_service",
        fake_update_permission_service,
    )

    client = create_test_client()
    response = client.put("/api/v1/permissions/1", json={"displayName": "更新权限"})

    assert response.status_code == 200
    assert response.json()["data"]["displayName"] == "更新权限"


def test_update_permission_status_api(monkeypatch) -> None:
    async def fake_update_permission_status_service(_db, permission_id, status_in):
        assert permission_id == 1
        assert status_in.status == 0
        return make_permission(status=0)

    monkeypatch.setattr(
        "le_admin_server.modules.permissions.routes.update_permission_status_service",
        fake_update_permission_status_service,
    )

    client = create_test_client()
    response = client.patch("/api/v1/permissions/1/status", json={"status": 0})

    assert response.status_code == 200
    assert response.json()["data"]["status"] == 0


def test_list_role_permissions_api(monkeypatch) -> None:
    async def fake_list_role_permissions_service(_db, role_id):
        assert role_id == 1
        return RolePermissionIdsOut(role_id=1, permission_ids=[1, 2, 3])

    monkeypatch.setattr(
        "le_admin_server.modules.roles.routes.list_role_permissions_service",
        fake_list_role_permissions_service,
    )

    client = create_test_client()
    response = client.get("/api/v1/roles/1/permissions")

    assert response.status_code == 200
    assert response.json()["data"]["permissionIds"] == [1, 2, 3]


def test_save_role_permissions_api(monkeypatch) -> None:
    async def fake_save_role_permissions_service(_db, role_id, permission_in):
        assert role_id == 1
        assert permission_in.permission_ids == [1, 2]
        return RolePermissionIdsOut(role_id=1, permission_ids=[1, 2])

    monkeypatch.setattr(
        "le_admin_server.modules.roles.routes.save_role_permissions_service",
        fake_save_role_permissions_service,
    )

    client = create_test_client()
    response = client.put("/api/v1/roles/1/permissions", json={"permissionIds": [1, 2]})

    assert response.status_code == 200
    assert response.json()["data"]["permissionIds"] == [1, 2]


@pytest.mark.asyncio
async def test_button_parent_must_be_menu(monkeypatch) -> None:
    from le_admin_server.modules.permissions import services

    async def fake_get_permission(_db, _permission_id):
        return make_permission(id=1, type="app")

    monkeypatch.setattr(services, "get_permission", fake_get_permission)

    with pytest.raises(BusinessError, match="按钮权限的上级只能是菜单"):
        await services.validate_parent_rule(
            None,
            permission_type="button",
            tenant_id=1,
            application_id=1,
            parent_id=1,
        )

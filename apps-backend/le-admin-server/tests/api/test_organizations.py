from fastapi.testclient import TestClient
from le_admin_server.api.deps import get_current_user
from le_admin_server.app import create_app
from le_admin_server.modules.organizations.schemas import (
    OrganizationOut,
    OrganizationTreeOut,
)


def create_test_client() -> TestClient:
    app = create_app()
    app.dependency_overrides[get_current_user] = lambda: object()
    return TestClient(app)


def make_organization(**overrides) -> OrganizationOut:
    data = {
        "id": 1,
        "tenant_id": 1,
        "parent_id": None,
        "name": "总公司",
        "code": "root",
        "org_type": "company",
        "sort_order": 0,
        "status": 1,
        "remark": "默认根组织",
        "created_at": "2026-01-01T00:00:00",
        "updated_at": "2026-01-01T00:00:00",
    }
    data.update(overrides)
    return OrganizationOut.model_validate(data)


def test_list_organizations_api(monkeypatch) -> None:
    async def fake_list_organizations_service(_db, query):
        assert query.page == 1
        assert query.page_size == 20
        return [make_organization()], 1

    monkeypatch.setattr(
        "le_admin_server.modules.organizations.routes.list_organizations_service",
        fake_list_organizations_service,
    )

    client = create_test_client()
    response = client.get("/api/v1/organizations?page=1&pageSize=20")

    assert response.status_code == 200
    assert response.json()["data"]["total"] == 1
    assert response.json()["data"]["data"][0]["code"] == "root"


def test_list_organization_tree_api(monkeypatch) -> None:
    async def fake_list_organization_tree_service(_db, _query):
        return [
            OrganizationTreeOut.model_validate(
                {
                    **make_organization().model_dump(),
                    "children": [
                        {
                            **make_organization(
                                id=2,
                                parent_id=1,
                                name="技术部",
                                code="tech",
                                org_type="department",
                            ).model_dump(),
                            "children": [],
                        }
                    ],
                }
            )
        ]

    monkeypatch.setattr(
        "le_admin_server.modules.organizations.routes.list_organization_tree_service",
        fake_list_organization_tree_service,
    )

    client = create_test_client()
    response = client.get("/api/v1/organizations/tree")

    assert response.status_code == 200
    assert response.json()["data"][0]["children"][0]["name"] == "技术部"


def test_create_organization_api(monkeypatch) -> None:
    async def fake_create_organization_service(_db, organization_in):
        assert organization_in.name == "技术部"
        return make_organization(
            id=2,
            name="技术部",
            code="tech",
            org_type="department",
        )

    monkeypatch.setattr(
        "le_admin_server.modules.organizations.routes.create_organization_service",
        fake_create_organization_service,
    )

    client = create_test_client()
    response = client.post(
        "/api/v1/organizations",
        json={
            "tenantId": 1,
            "parentId": 1,
            "name": "技术部",
            "code": "tech",
            "orgType": "department",
            "sortOrder": 10,
            "status": 1,
        },
    )

    assert response.status_code == 200
    assert response.json()["data"]["id"] == 2


def test_update_organization_api(monkeypatch) -> None:
    async def fake_update_organization_service(_db, organization_id, organization_in):
        assert organization_id == 1
        assert organization_in.name == "更新组织"
        return make_organization(name="更新组织")

    monkeypatch.setattr(
        "le_admin_server.modules.organizations.routes.update_organization_service",
        fake_update_organization_service,
    )

    client = create_test_client()
    response = client.put(
        "/api/v1/organizations/1",
        json={"name": "更新组织", "status": 1},
    )

    assert response.status_code == 200
    assert response.json()["data"]["name"] == "更新组织"


def test_delete_organization_api(monkeypatch) -> None:
    async def fake_delete_organization_service(_db, organization_id):
        assert organization_id == 1
        return make_organization()

    monkeypatch.setattr(
        "le_admin_server.modules.organizations.routes.delete_organization_service",
        fake_delete_organization_service,
    )

    client = create_test_client()
    response = client.delete("/api/v1/organizations/1")

    assert response.status_code == 200
    assert response.json()["data"]["id"] == 1

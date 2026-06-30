from lee_api_core import BaseSchema, page, success


class DemoSchema(BaseSchema):
    user_id: int


def test_base_schema_serializes_to_camel_case() -> None:
    data = DemoSchema(user_id=1)

    assert data.model_dump(by_alias=True) == {"userId": 1}


def test_success_response() -> None:
    response = success({"ok": "yes"})

    assert response.code == 0
    assert response.message == "success"
    assert response.data == {"ok": "yes"}


def test_page_data() -> None:
    response = page([{"id": 1}], 1)

    assert response.data == [{"id": 1}]
    assert response.total == 1

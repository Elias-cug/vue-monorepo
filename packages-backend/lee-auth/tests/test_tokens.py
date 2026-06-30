from datetime import timedelta

from lee_auth import create_jwt_token, decode_jwt_payload, decode_jwt_token


def test_create_and_decode_jwt_token() -> None:
    token, expires_in, jti = create_jwt_token(
        subject=1,
        token_type="access",
        secret_key="secret",
        expires_delta=timedelta(minutes=15),
        claims={"tenant_id": 100},
    )

    payload = decode_jwt_token(token, secret_key="secret")
    typed_payload = decode_jwt_payload(token, secret_key="secret")

    assert expires_in == 900
    assert payload["jti"] == jti
    assert payload["sub"] == "1"
    assert payload["type"] == "access"
    assert payload["tenant_id"] == 100
    assert typed_payload.subject == "1"

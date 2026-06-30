import uuid
from collections.abc import Mapping
from datetime import UTC, datetime, timedelta
from typing import Any

from jose import JWTError, jwt
from pydantic import BaseModel, ConfigDict, Field


class TokenPayload(BaseModel):
    model_config = ConfigDict(extra="allow", populate_by_name=True)

    token_type: str = Field(alias="type")
    subject: str = Field(alias="sub")
    jti: str
    issued_at: int = Field(alias="iat")
    expires_at: int = Field(alias="exp")


def create_jwt_token(
    *,
    subject: str | int,
    token_type: str,
    secret_key: str,
    expires_delta: timedelta,
    algorithm: str = "HS256",
    claims: Mapping[str, Any] | None = None,
) -> tuple[str, int, str]:
    now = datetime.now(UTC)
    expires_at = now + expires_delta
    jti = uuid.uuid4().hex

    payload: dict[str, Any] = dict(claims or {})
    payload.update(
        {
            "type": token_type,
            "sub": str(subject),
            "jti": jti,
            "iat": int(now.timestamp()),
            "exp": int(expires_at.timestamp()),
        }
    )

    token = jwt.encode(payload, secret_key, algorithm=algorithm)
    return token, int(expires_delta.total_seconds()), jti


def decode_jwt_token(
    token: str,
    *,
    secret_key: str,
    algorithm: str = "HS256",
) -> dict[str, Any]:
    try:
        return jwt.decode(token, secret_key, algorithms=[algorithm])
    except JWTError as exc:
        raise ValueError("invalid token") from exc


def decode_jwt_payload(
    token: str,
    *,
    secret_key: str,
    algorithm: str = "HS256",
) -> TokenPayload:
    return TokenPayload.model_validate(
        decode_jwt_token(token, secret_key=secret_key, algorithm=algorithm)
    )

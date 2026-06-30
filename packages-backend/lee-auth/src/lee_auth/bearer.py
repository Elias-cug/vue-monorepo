def extract_bearer_token(authorization: str | None) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise ValueError("missing bearer token")

    token = authorization.split(" ", 1)[1].strip()
    if not token:
        raise ValueError("missing bearer token")

    return token

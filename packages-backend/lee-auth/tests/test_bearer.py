import pytest
from lee_auth import extract_bearer_token


def test_extract_bearer_token() -> None:
    assert extract_bearer_token("Bearer abc") == "abc"


def test_extract_bearer_token_rejects_missing_token() -> None:
    with pytest.raises(ValueError):
        extract_bearer_token(None)

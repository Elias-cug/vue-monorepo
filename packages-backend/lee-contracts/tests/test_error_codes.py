from lee_contracts import ErrorCode


def test_error_code_values() -> None:
    assert ErrorCode.OK == 0
    assert ErrorCode.UNAUTHORIZED == 401

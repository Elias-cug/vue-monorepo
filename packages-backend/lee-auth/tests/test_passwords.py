from lee_auth import hash_password, verify_password


def test_hash_and_verify_password() -> None:
    hashed = hash_password("Admin@1234")

    assert hashed != "Admin@1234"
    assert verify_password("Admin@1234", hashed)
    assert not verify_password("wrong", hashed)

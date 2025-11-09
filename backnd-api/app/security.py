import binascii
import hashlib
from datetime import datetime, timedelta, timezone
from typing import Any

import bcrypt
from jose import JWTError, jwt

from .config import settings


_MAX_PASSWORD_BYTES = 72


def _prepare_password_bytes(password: str) -> bytes:
    """
    Prepare password bytes for bcrypt hashing.
    If password exceeds 72 bytes, pre-hash it with SHA-256 to ensure
    it fits within bcrypt's 72-byte limit.
    """
    password_bytes = password.encode("utf-8")
    if len(password_bytes) <= _MAX_PASSWORD_BYTES:
        return password_bytes
    
    # For passwords longer than 72 bytes, pre-hash with SHA-256
    # SHA-256 digest is 32 bytes, hexlify makes it 64 bytes (still < 72)
    # This ensures the input to bcrypt is always <= 72 bytes
    sha256_digest = hashlib.sha256(password_bytes).digest()
    return binascii.hexlify(sha256_digest)


def verify_password(plain_password: str, password_hash: str) -> bool:
    """
    Verify a password against a hash.
    Handles both regular bcrypt hashes and pre-hashed passwords.
    """
    prepared_password_bytes = _prepare_password_bytes(plain_password)
    # bcrypt expects bytes, password_hash is a string that needs to be encoded
    return bcrypt.checkpw(prepared_password_bytes, password_hash.encode("utf-8"))


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.
    For passwords longer than 72 bytes, pre-hashes with SHA-256 first.
    """
    prepared_password_bytes = _prepare_password_bytes(password)
    # Generate salt and hash
    salt = bcrypt.gensalt()
    password_hash_bytes = bcrypt.hashpw(prepared_password_bytes, salt)
    # Return as string (bcrypt hash is ASCII-safe)
    return password_hash_bytes.decode("utf-8")


def create_access_token(
    subject: dict[str, Any], expires_delta: timedelta | None = None
) -> tuple[str, int]:
    delta = expires_delta or timedelta(minutes=settings.jwt_access_token_expire_minutes)
    expire_at = datetime.now(timezone.utc) + delta
    to_encode = subject.copy()
    to_encode.update({"exp": int(expire_at.timestamp())})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm,
    )
    return encoded_jwt, int(delta.total_seconds())


def decode_access_token(token: str) -> dict[str, Any]:
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm],
        )
        return payload
    except JWTError as exc:
        msg = "Невалидный токен"
        raise ValueError(msg) from exc
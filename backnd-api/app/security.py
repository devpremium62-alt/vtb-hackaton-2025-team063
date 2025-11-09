from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from .config import settings


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

_MAX_PASSWORD_BYTES = 72


def _truncate_password(password: str) -> str:
    password_bytes = password.encode("utf-8")
    if len(password_bytes) <= _MAX_PASSWORD_BYTES:
        return password
    truncated_bytes = password_bytes[:_MAX_PASSWORD_BYTES]
    return truncated_bytes.decode("utf-8", errors="ignore")


def verify_password(plain_password: str, password_hash: str) -> bool:
    truncated = _truncate_password(plain_password)
    return pwd_context.verify(truncated, password_hash)


def hash_password(password: str) -> str:
    truncated = _truncate_password(password)
    return pwd_context.hash(truncated)


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
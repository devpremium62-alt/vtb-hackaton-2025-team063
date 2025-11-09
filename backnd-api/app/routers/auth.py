from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from ..dependencies import get_db
from ..models import User
from ..schemas import LoginRequest, Token, UserCreate, UserRead
from ..security import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register_user(
    payload: UserCreate,
    db: AsyncSession = Depends(get_db),
) -> Token:
    existing_user = await db.scalar(select(User).where(User.email == payload.email))
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким e-mail уже существует",
        )

    user = User(
        name=payload.name,
        phone=payload.phone,
        email=payload.email,
        image_url=str(payload.image_url) if payload.image_url else None,
        password_hash=hash_password(payload.password),
    )

    db.add(user)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Невозможно создать пользователя, e-mail уже используется",
        ) from None

    await db.refresh(user)

    token, expires_in = create_access_token(
        {"sub": str(user.id), "email": user.email}
    )

    return Token(
        access_token=token,
        expires_in=expires_in,
        user=UserRead.model_validate(user),
    )


@router.post("/login", response_model=Token)
async def login_user(
    credentials: LoginRequest,
    db: AsyncSession = Depends(get_db),
) -> Token:
    user = await db.scalar(select(User).where(User.email == credentials.email))
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверная пара e-mail/пароль",
        )

    token, expires_in = create_access_token(
        {"sub": str(user.id), "email": user.email}
    )

    return Token(
        access_token=token,
        expires_in=expires_in,
        user=UserRead.model_validate(user),
    )
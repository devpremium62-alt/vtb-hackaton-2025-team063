from datetime import datetime
from enum import Enum

from pydantic import BaseModel, EmailStr, HttpUrl, constr, field_validator


PhoneStr = constr(strip_whitespace=True, min_length=5, max_length=20)


class UserBase(BaseModel):
    name: constr(strip_whitespace=True, min_length=1, max_length=100)
    phone: PhoneStr
    email: EmailStr
    image_url: HttpUrl | None = None


class UserCreate(UserBase):
    password: constr(strip_whitespace=True, min_length=8, max_length=128)

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if value.lower() == value or value.upper() == value:
            msg = "Пароль должен содержать буквы в разном регистре"
            raise ValueError(msg)
        if not any(char.isdigit() for char in value):
            msg = "Пароль должен содержать хотя бы одну цифру"
            raise ValueError(msg)
        return value


class UserRead(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserRead


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AccountRole(str, Enum):
    OWNER = "owner"
    USER = "user"


class AccountBase(BaseModel):
    account_id: int
    user_id: int
    title: constr(strip_whitespace=True, min_length=1, max_length=100)
    balance: int
    currency: constr(strip_whitespace=True, min_length=1, max_length=8)
    bank: constr(strip_whitespace=True, min_length=1, max_length=100)
    role: AccountRole


class AccountRead(AccountBase):
    class Config:
        from_attributes = True
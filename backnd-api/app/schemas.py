from datetime import date, datetime
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


class ConsentBase(BaseModel):
    user_id: int
    bank_id: int
    concentID: constr(strip_whitespace=True, min_length=1, max_length=255)


class ConsentCreate(ConsentBase):
    pass


class ConsentUpdate(BaseModel):
    bank_id: int | None = None
    concentID: constr(strip_whitespace=True, min_length=1, max_length=255) | None = None


class ConsentRead(ConsentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BankBase(BaseModel):
    name: constr(strip_whitespace=True, min_length=1, max_length=100)
    website_url: HttpUrl


class BankCreate(BankBase):
    pass


class BankUpdate(BaseModel):
    name: constr(strip_whitespace=True, min_length=1, max_length=100) | None = None
    website_url: HttpUrl | None = None


class BankRead(BankBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class GoalBase(BaseModel):
    account_id: int
    name: constr(strip_whitespace=True, min_length=1, max_length=200)
    end_date: date
    target_amount: float
    description: constr(strip_whitespace=True, max_length=1000) | None = None


class GoalCreate(GoalBase):
    start_date: date | None = None
    collected_amount: float = 0.0


class GoalUpdate(BaseModel):
    name: constr(strip_whitespace=True, min_length=1, max_length=200) | None = None
    start_date: date | None = None
    end_date: date | None = None
    target_amount: float | None = None
    description: constr(strip_whitespace=True, max_length=1000) | None = None
    collected_amount: float | None = None


class GoalRead(GoalBase):
    id: int
    start_date: date
    collected_amount: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
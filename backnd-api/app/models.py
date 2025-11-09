from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, Numeric, String, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    image_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class Consent(Base):
    __tablename__ = "consents"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    bank_id: Mapped[int] = mapped_column(
        ForeignKey("banks.id", ondelete="CASCADE"), nullable=False, index=True
    )
    concentID: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    user: Mapped[User] = relationship("User")
    bank: Mapped["Bank"] = relationship("Bank")


class Bank(Base):
    __tablename__ = "banks"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    website_url: Mapped[str] = mapped_column(String(512), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class Goal(Base):
    __tablename__ = "goals"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    account_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    start_date: Mapped[date] = mapped_column(
        Date, server_default=func.current_date(), nullable=False
    )
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    target_amount: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False)
    description: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    collected_amount: Mapped[float] = mapped_column(
        Numeric(15, 2), server_default="0.00", nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
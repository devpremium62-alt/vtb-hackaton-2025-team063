from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..dependencies import get_db
from ..models import PaymentCalendar
from ..schemas import PaymentCalendarCreate, PaymentCalendarRead, PaymentCalendarUpdate

router = APIRouter(prefix="/payment-calendar", tags=["payment-calendar"])


@router.post(
    "/",
    response_model=PaymentCalendarRead,
    status_code=status.HTTP_201_CREATED,
    summary="Создать новый платеж в календаре",
)
async def create_payment(
    payload: PaymentCalendarCreate,
    db: AsyncSession = Depends(get_db),
) -> PaymentCalendarRead:
    payment = PaymentCalendar(
        account_id=payload.account_id,
        name=payload.name,
        payment_date=payload.payment_date,
        amount=payload.amount,
    )

    db.add(payment)
    await db.commit()
    await db.refresh(payment)

    return PaymentCalendarRead.model_validate(payment)


@router.get(
    "/",
    response_model=list[PaymentCalendarRead],
    summary="Получить список платежей",
)
async def list_payments(
    account_id: int | None = Query(
        default=None,
        ge=1,
        description="Фильтр по идентификатору аккаунта",
    ),
    skip: int = Query(default=0, ge=0, description="Количество записей для пропуска"),
    limit: int = Query(
        default=100, ge=1, le=1000, description="Максимальное количество записей"
    ),
    db: AsyncSession = Depends(get_db),
) -> list[PaymentCalendarRead]:
    query = select(PaymentCalendar)
    if account_id is not None:
        query = query.where(PaymentCalendar.account_id == account_id)

    query = query.offset(skip).limit(limit).order_by(PaymentCalendar.payment_date.asc())

    result = await db.execute(query)
    payments = result.scalars().all()

    return [PaymentCalendarRead.model_validate(payment) for payment in payments]


@router.get(
    "/{payment_id:int}",
    response_model=PaymentCalendarRead,
    summary="Получить платеж по идентификатору",
)
async def get_payment(
    payment_id: int,
    db: AsyncSession = Depends(get_db),
) -> PaymentCalendarRead:
    payment = await db.scalar(select(PaymentCalendar).where(PaymentCalendar.id == payment_id))
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Платеж не найден",
        )

    return PaymentCalendarRead.model_validate(payment)


@router.put(
    "/{payment_id:int}",
    response_model=PaymentCalendarRead,
    summary="Обновить платеж",
)
async def update_payment(
    payment_id: int,
    payload: PaymentCalendarUpdate,
    db: AsyncSession = Depends(get_db),
) -> PaymentCalendarRead:
    payment = await db.scalar(select(PaymentCalendar).where(PaymentCalendar.id == payment_id))
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Платеж не найден",
        )

    if payload.account_id is not None:
        payment.account_id = payload.account_id
    if payload.name is not None:
        payment.name = payload.name
    if payload.payment_date is not None:
        payment.payment_date = payload.payment_date
    if payload.amount is not None:
        payment.amount = payload.amount

    await db.commit()
    await db.refresh(payment)

    return PaymentCalendarRead.model_validate(payment)


@router.delete(
    "/{payment_id:int}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удалить платеж",
)
async def delete_payment(
    payment_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    payment = await db.scalar(select(PaymentCalendar).where(PaymentCalendar.id == payment_id))
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Платеж не найден",
        )

    await db.delete(payment)
    await db.commit()



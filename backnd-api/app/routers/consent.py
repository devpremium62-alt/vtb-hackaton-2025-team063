from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..dependencies import get_db
from ..models import Bank, Consent, User
from ..schemas import ConsentCreate, ConsentRead, ConsentUpdate

router = APIRouter(prefix="/consents", tags=["consents"])


@router.post(
    "/",
    response_model=ConsentRead,
    status_code=status.HTTP_201_CREATED,
    summary="Создать новое согласие",
)
async def create_consent(
    payload: ConsentCreate,
    db: AsyncSession = Depends(get_db),
) -> ConsentRead:
    # Проверяем существование пользователя
    user = await db.scalar(select(User).where(User.id == payload.user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден",
        )

    # Проверяем существование банка
    bank = await db.scalar(select(Bank).where(Bank.id == payload.bank_id))
    if not bank:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Банк не найден",
        )

    consent = Consent(
        user_id=payload.user_id,
        bank_id=payload.bank_id,
        concentID=payload.concentID,
    )

    db.add(consent)
    await db.commit()
    await db.refresh(consent)

    return ConsentRead.model_validate(consent)


@router.get(
    "/",
    response_model=list[ConsentRead],
    summary="Получить список согласий",
)
async def list_consents(
    user_id: int | None = Query(
        default=None,
        ge=1,
        description="Фильтр по идентификатору пользователя",
    ),
    bank_id: int | None = Query(
        default=None,
        ge=1,
        description="Фильтр по идентификатору банка",
    ),
    db: AsyncSession = Depends(get_db),
) -> list[ConsentRead]:
    query = select(Consent)
    if user_id is not None:
        query = query.where(Consent.user_id == user_id)
    if bank_id is not None:
        query = query.where(Consent.bank_id == bank_id)

    result = await db.execute(query)
    consents = result.scalars().all()

    return [ConsentRead.model_validate(consent) for consent in consents]


@router.get(
    "/{consent_id:int}",
    response_model=ConsentRead,
    summary="Получить согласие по идентификатору",
)
async def get_consent(
    consent_id: int,
    db: AsyncSession = Depends(get_db),
) -> ConsentRead:
    consent = await db.scalar(select(Consent).where(Consent.id == consent_id))
    if not consent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Согласие не найдено",
        )

    return ConsentRead.model_validate(consent)


@router.put(
    "/{consent_id:int}",
    response_model=ConsentRead,
    summary="Обновить согласие",
)
async def update_consent(
    consent_id: int,
    payload: ConsentUpdate,
    db: AsyncSession = Depends(get_db),
) -> ConsentRead:
    consent = await db.scalar(select(Consent).where(Consent.id == consent_id))
    if not consent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Согласие не найдено",
        )

    # Проверяем существование банка, если он обновляется
    if payload.bank_id is not None:
        bank = await db.scalar(select(Bank).where(Bank.id == payload.bank_id))
        if not bank:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Банк не найден",
            )
        consent.bank_id = payload.bank_id

    if payload.concentID is not None:
        consent.concentID = payload.concentID

    await db.commit()
    await db.refresh(consent)

    return ConsentRead.model_validate(consent)


@router.delete(
    "/{consent_id:int}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удалить согласие",
)
async def delete_consent(
    consent_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    consent = await db.scalar(select(Consent).where(Consent.id == consent_id))
    if not consent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Согласие не найдено",
        )

    db.delete(consent)
    await db.commit()


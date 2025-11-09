from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..dependencies import get_db
from ..models import Bank
from ..schemas import BankCreate, BankRead, BankUpdate

router = APIRouter(prefix="/banks", tags=["banks"])


@router.post(
    "/",
    response_model=BankRead,
    status_code=status.HTTP_201_CREATED,
    summary="Создать новый банк",
)
async def create_bank(
    payload: BankCreate,
    db: AsyncSession = Depends(get_db),
) -> BankRead:
    # Проверяем, существует ли банк с таким именем
    existing_bank = await db.scalar(select(Bank).where(Bank.name == payload.name))
    if existing_bank:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Банк с таким наименованием уже существует",
        )

    bank = Bank(
        name=payload.name,
        website_url=str(payload.website_url),
    )

    db.add(bank)
    await db.commit()
    await db.refresh(bank)

    return BankRead.model_validate(bank)


@router.get(
    "/",
    response_model=list[BankRead],
    summary="Получить список банков",
)
async def list_banks(
    skip: int = Query(default=0, ge=0, description="Количество записей для пропуска"),
    limit: int = Query(default=100, ge=1, le=1000, description="Максимальное количество записей"),
    db: AsyncSession = Depends(get_db),
) -> list[BankRead]:
    query = select(Bank).offset(skip).limit(limit)
    result = await db.execute(query)
    banks = result.scalars().all()

    return [BankRead.model_validate(bank) for bank in banks]


@router.get(
    "/{bank_id:int}",
    response_model=BankRead,
    summary="Получить банк по идентификатору",
)
async def get_bank(
    bank_id: int,
    db: AsyncSession = Depends(get_db),
) -> BankRead:
    bank = await db.scalar(select(Bank).where(Bank.id == bank_id))
    if not bank:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Банк не найден",
        )

    return BankRead.model_validate(bank)


@router.put(
    "/{bank_id:int}",
    response_model=BankRead,
    summary="Обновить банк",
)
async def update_bank(
    bank_id: int,
    payload: BankUpdate,
    db: AsyncSession = Depends(get_db),
) -> BankRead:
    bank = await db.scalar(select(Bank).where(Bank.id == bank_id))
    if not bank:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Банк не найден",
        )

    # Проверяем уникальность имени, если оно обновляется
    if payload.name is not None and payload.name != bank.name:
        existing_bank = await db.scalar(select(Bank).where(Bank.name == payload.name))
        if existing_bank:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Банк с таким наименованием уже существует",
            )
        bank.name = payload.name

    if payload.website_url is not None:
        bank.website_url = str(payload.website_url)

    await db.commit()
    await db.refresh(bank)

    return BankRead.model_validate(bank)


@router.delete(
    "/{bank_id:int}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удалить банк",
)
async def delete_bank(
    bank_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    bank = await db.scalar(select(Bank).where(Bank.id == bank_id))
    if not bank:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Банк не найден",
        )

    await db.delete(bank)
    await db.commit()


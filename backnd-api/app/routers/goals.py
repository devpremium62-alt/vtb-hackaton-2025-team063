from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..dependencies import get_db
from ..models import Goal
from ..schemas import GoalCreate, GoalRead, GoalUpdate

router = APIRouter(prefix="/goals", tags=["goals"])


@router.post(
    "/",
    response_model=GoalRead,
    status_code=status.HTTP_201_CREATED,
    summary="Создать новую цель",
)
async def create_goal(
    payload: GoalCreate,
    db: AsyncSession = Depends(get_db),
) -> GoalRead:
    goal = Goal(
        account_id=payload.account_id,
        name=payload.name,
        start_date=payload.start_date if payload.start_date is not None else date.today(),
        end_date=payload.end_date,
        target_amount=payload.target_amount,
        description=payload.description,
        collected_amount=payload.collected_amount,
    )

    db.add(goal)
    await db.commit()
    await db.refresh(goal)

    return GoalRead.model_validate(goal)


@router.get(
    "/",
    response_model=list[GoalRead],
    summary="Получить список целей",
)
async def list_goals(
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
) -> list[GoalRead]:
    query = select(Goal)
    if account_id is not None:
        query = query.where(Goal.account_id == account_id)

    query = query.offset(skip).limit(limit).order_by(Goal.created_at.desc())

    result = await db.execute(query)
    goals = result.scalars().all()

    return [GoalRead.model_validate(goal) for goal in goals]


@router.get(
    "/{goal_id:int}",
    response_model=GoalRead,
    summary="Получить цель по идентификатору",
)
async def get_goal(
    goal_id: int,
    db: AsyncSession = Depends(get_db),
) -> GoalRead:
    goal = await db.scalar(select(Goal).where(Goal.id == goal_id))
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Цель не найдена",
        )

    return GoalRead.model_validate(goal)


@router.put(
    "/{goal_id:int}",
    response_model=GoalRead,
    summary="Обновить цель",
)
async def update_goal(
    goal_id: int,
    payload: GoalUpdate,
    db: AsyncSession = Depends(get_db),
) -> GoalRead:
    goal = await db.scalar(select(Goal).where(Goal.id == goal_id))
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Цель не найдена",
        )

    if payload.name is not None:
        goal.name = payload.name
    if payload.start_date is not None:
        goal.start_date = payload.start_date
    if payload.end_date is not None:
        goal.end_date = payload.end_date
    if payload.target_amount is not None:
        goal.target_amount = payload.target_amount
    if payload.description is not None:
        goal.description = payload.description
    if payload.collected_amount is not None:
        goal.collected_amount = payload.collected_amount

    await db.commit()
    await db.refresh(goal)

    return GoalRead.model_validate(goal)


@router.delete(
    "/{goal_id:int}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удалить цель",
)
async def delete_goal(
    goal_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    goal = await db.scalar(select(Goal).where(Goal.id == goal_id))
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Цель не найдена",
        )

    await db.delete(goal)
    await db.commit()


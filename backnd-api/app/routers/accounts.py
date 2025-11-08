from fastapi import APIRouter, HTTPException, Query, status

from ..schemas import AccountRead, AccountRole

router = APIRouter(prefix="/accounts", tags=["accounts"])

MOCK_ACCOUNTS: list[AccountRead] = [
    AccountRead(
        account_id=1001,
        user_id=1,
        title="Семейный накопительный счёт",
        balance=1_250_000,
        currency="RUB",
        bank="VTB",
        role=AccountRole.OWNER,
    ),
    AccountRead(
        account_id=1002,
        user_id=1,
        title="Карта ежедневных расходов",
        balance=82_000,
        currency="RUB",
        bank="VTB",
        role=AccountRole.USER,
    ),
    AccountRead(
        account_id=1003,
        user_id=2,
        title="Накопления на обучение",
        balance=880_000,
        currency="RUB",
        bank="Sber",
        role=AccountRole.OWNER,
    ),
    AccountRead(
        account_id=1004,
        user_id=2,
        title="Совместная карта путешествий",
        balance=240_000,
        currency="RUB",
        bank="Tinkoff",
        role=AccountRole.USER,
    ),
    AccountRead(
        account_id=1005,
        user_id=3,
        title="Бизнес-счёт ИП",
        balance=1_575_000,
        currency="RUB",
        bank="Alfa",
        role=AccountRole.OWNER,
    ),
    AccountRead(
        account_id=1006,
        user_id=3,
        title="Общий бюджет семьи",
        balance=310_000,
        currency="RUB",
        bank="VTB",
        role=AccountRole.USER,
    ),
    AccountRead(
        account_id=1007,
        user_id=4,
        title="Сбережения на отпуск",
        balance=450_000,
        currency="RUB",
        bank="Gazprombank",
        role=AccountRole.OWNER,
    ),
    AccountRead(
        account_id=1008,
        user_id=4,
        title="Детская карта",
        balance=25_000,
        currency="RUB",
        bank="VTB",
        role=AccountRole.USER,
    ),
    AccountRead(
        account_id=1009,
        user_id=5,
        title="Инвестиционный счёт",
        balance=2_120_000,
        currency="RUB",
        bank="VTB",
        role=AccountRole.OWNER,
    ),
    AccountRead(
        account_id=1010,
        user_id=5,
        title="Резервный валютный счёт",
        balance=12_500,
        currency="USD",
        bank="Raiffeisen",
        role=AccountRole.USER,
    ),
]


@router.get("/", response_model=list[AccountRead], summary="Получить список аккаунтов")
async def list_accounts(
    user_id: int | None = Query(
        default=None,
        ge=1,
        description="Фильтр по идентификатору пользователя",
    ),
) -> list[AccountRead]:
    if user_id is None:
        return [account.model_copy() for account in MOCK_ACCOUNTS]

    return [
        account.model_copy()
        for account in MOCK_ACCOUNTS
        if account.user_id == user_id
    ]


@router.get(
    "/users/{user_id}",
    response_model=list[AccountRead],
    summary="Получить аккаунты конкретного пользователя",
)
async def list_accounts_for_user(user_id: int) -> list[AccountRead]:
    return [
        account.model_copy()
        for account in MOCK_ACCOUNTS
        if account.user_id == user_id
    ]


@router.get(
    "/{account_id:int}",
    response_model=AccountRead,
    summary="Получить аккаунт по идентификатору",
)
async def get_account(account_id: int) -> AccountRead:
    for account in MOCK_ACCOUNTS:
        if account.account_id == account_id:
            return account.model_copy()

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Аккаунт не найден",
    )
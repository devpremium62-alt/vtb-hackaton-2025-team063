# FastAPI сервис &laquo;backnd-api&raquo;

Сервис предоставляет REST API для регистрации и авторизации пользователей с выдачей JWT токена. Основные технологии: FastAPI, асинхронный SQLAlchemy, PostgreSQL, JWT (python-jose), Passlib.

## Структура проекта

```
backnd-api/
├── app/
│   ├── __init__.py
│   ├── config.py          # Конфигурация приложения и настройки JWT
│   ├── database.py        # Подключение к БД и управление сессиями
│   ├── main.py            # Точка входа FastAPI и регистрацию роутеров
│   ├── models.py          # SQLAlchemy-модели (User)
│   ├── schemas.py         # Pydantic-схемы запросов/ответов
│   ├── security.py        # Утилиты для хеширования паролей и генерации JWT
│   ├── dependencies.py    # Общие зависимости (получение DB-сессии)
│   └── routers/
│       ├── __init__.py
│       └── auth.py        # Эндпоинты регистрации и авторизации
├── requirements.txt       # Зависимости Python
├── .env.example           # Пример переменных окружения
└── README.md              # Данный файл
```

## Основные сущности

### Модель пользователя

| Поле        | Тип        | Описание                       |
|-------------|------------|--------------------------------|
| id          | int        | Первичный ключ                 |
| name        | str        | Имя пользователя               |
| phone       | str        | Телефон                        |
| image_url   | str \| None| Ссылка на изображение          |
| email       | str        | Уникальный e-mail              |
| password_hash | str      | Хеш пароля                     |
| created_at  | datetime   | Дата регистрации               |
| updated_at  | datetime   | Дата изменения                 |

### Pydantic-схемы

- `UserCreate`: регистрация (имя, телефон, email, пароль, опционально image_url).
- `UserRead`: данные пользователя без пароля.
- `Token`: ответ при авторизации (access_token, token_type, expires_in, user).

## Эндпоинты

- `POST /auth/register` &mdash; регистрация пользователя.
- `POST /auth/login` &mdash; авторизация по email/паролю и получение JWT.

## Настройка окружения

```bash
python -m venv .venv
source .venv/Scripts/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

## Переменные окружения (`.env`)

```
DATABASE_URL=sqlite:///./db.sqlite3
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
```

## Примечания

- Для простоты используется SQLite. При необходимости легко сменить `DATABASE_URL` на PostgreSQL.
- Пароли хешируются с помощью `passlib[bcrypt]`.
- JWT генерируется через `python-jose`.
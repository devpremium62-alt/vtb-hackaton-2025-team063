from pydantic import EmailStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "backnd-api"
    database_url: str = (
        "postgresql+asyncpg://backnd_api:backnd_api_password@postgres:5432/backnd_api"
    )
    database_pool_size: int = 5
    database_max_overflow: int = 10
    database_echo: bool = False

    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60

    default_admin_email: EmailStr | None = None

    cors_allow_origins: list[str] = ["*"]
    cors_allow_credentials: bool = True
    cors_allow_methods: list[str] = ["*"]
    cors_allow_headers: list[str] = ["*"]


settings = Settings()
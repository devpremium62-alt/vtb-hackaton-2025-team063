from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import engine
from .models import Base
from .routers import accounts, auth, banks, consent, goals

app = FastAPI(
    title=settings.app_name,
    description="API Description",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)

app.include_router(auth.router)
app.include_router(accounts.router)
app.include_router(consent.router)
app.include_router(banks.router)
app.include_router(goals.router)


@app.on_event("startup")
async def on_startup() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/health", summary="Health check")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}
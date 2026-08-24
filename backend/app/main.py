import asyncio
import contextlib
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import AsyncSessionLocal, engine

logger = logging.getLogger("facilityos")


async def _sla_breach_loop() -> None:
    """Periodic SLA breach sweep. Upgrade path: Celery beat when scaling out."""
    from app.services.ticket_service import sweep_sla_breaches

    while True:
        try:
            async with AsyncSessionLocal() as db:
                breached = await sweep_sla_breaches(db)
                await db.commit()
                if breached:
                    logger.warning("SLA breaches detected & escalated: %s", breached)
        except Exception:  # noqa: BLE001 — scheduler must never die
            logger.exception("SLA sweep failed")
        await asyncio.sleep(settings.SLA_BREACH_CHECK_INTERVAL_SECONDS)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Dev convenience: create tables if missing (Alembic owns real migrations).
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    task = asyncio.create_task(_sla_breach_loop())
    logger.info("%s started (sla sweep every %ss)", settings.PROJECT_NAME,
                settings.SLA_BREACH_CHECK_INTERVAL_SECONDS)
    yield
    task.cancel()
    with contextlib.suppress(asyncio.CancelledError):
        await task
    await engine.dispose()
    logger.info("%s shut down cleanly", settings.PROJECT_NAME)


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version="1.0.0",
        openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router, prefix=settings.API_V1_PREFIX)

    @app.get("/")
    async def root():
        return {"service": settings.PROJECT_NAME, "docs": "/docs"}

    return app


app = create_app()

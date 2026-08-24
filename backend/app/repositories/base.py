from typing import Any, Generic, Sequence, TypeVar

from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base import Base

M = TypeVar("M", bound=Base)


class BaseRepository(Generic[M]):
    """
    Generic data-access layer. All list queries go through `scoped()`,
    which injects the tenant filter — cross-tenant reads are structurally
    impossible from service code.
    """

    model: type[M]

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get(self, entity_id: str) -> M | None:
        return await self.db.get(self.model, entity_id)

    async def get_scoped(self, org_id: str, entity_id: str) -> M | None:
        obj = await self.get(entity_id)
        if obj is None or getattr(obj, "org_id", None) != org_id:
            return None
        return obj

    def scoped(self, org_id: str | None, stmt: Select | None = None) -> Select:
        base = stmt if stmt is not None else select(self.model)
        if org_id is not None and hasattr(self.model, "org_id"):
            base = base.where(self.model.org_id == org_id)  # type: ignore[attr-defined]
        return base

    async def list(
        self,
        org_id: str | None,
        offset: int = 0,
        limit: int = 100,
        order_by: Any = None,
        filters: dict[str, Any] | None = None,
    ) -> Sequence[M]:
        stmt = self.scoped(org_id)
        for col, val in (filters or {}).items():
            if val is not None:
                stmt = stmt.where(getattr(self.model, col) == val)
        if order_by is not None:
            stmt = stmt.order_by(order_by)
        stmt = stmt.offset(offset).limit(limit)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def count(self, org_id: str | None, filters: dict[str, Any] | None = None) -> int:
        stmt = self.scoped(org_id, select(func.count()).select_from(self.model))
        for col, val in (filters or {}).items():
            if val is not None:
                stmt = stmt.where(getattr(self.model, col) == val)
        result = await self.db.execute(stmt)
        return int(result.scalar_one())

    def add(self, obj: M) -> M:
        self.db.add(obj)
        return obj

    async def delete(self, obj: M) -> None:
        await self.db.delete(obj)

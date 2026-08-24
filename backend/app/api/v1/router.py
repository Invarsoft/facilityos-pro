from fastapi import APIRouter

from app.api.v1 import assets, auth, misc, onboarding, organizations, tickets, users

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(organizations.router)
api_router.include_router(onboarding.router)
api_router.include_router(tickets.router)
api_router.include_router(assets.router)
api_router.include_router(misc.router)

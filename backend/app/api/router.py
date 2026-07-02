from fastapi import APIRouter

from app.api.routes import analytics, auth, medicines, reminders

api_router = APIRouter(prefix="/api")
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(medicines.router, tags=["medicines"])
api_router.include_router(reminders.router, tags=["reminders"])
api_router.include_router(analytics.router, tags=["analytics"])

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.analytics import AnalyticsSummary, DashboardSummary, StatisticsSummary
from app.services.analytics import build_analytics, build_dashboard, build_statistics

router = APIRouter()


@router.get("/dashboard", response_model=DashboardSummary)
def get_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return build_dashboard(db, current_user)


@router.get("/analytics", response_model=AnalyticsSummary)
def get_analytics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return build_analytics(db, current_user)


@router.get("/statistics", response_model=StatisticsSummary)
def get_statistics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return build_statistics(db, current_user)

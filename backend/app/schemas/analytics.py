from pydantic import BaseModel


class DashboardSummary(BaseModel):
    today_count: int
    missed_count: int
    upcoming_count: int
    active_medicines: int
    completion_rate: float
    today_medicines: list[dict]
    upcoming_reminders: list[dict]


class AnalyticsSummary(BaseModel):
    completion_rate: float
    active_medicines: int
    missed_count: int
    streak_counter: int
    weekly_chart: list[dict]
    monthly_chart: list[dict]


class StatisticsSummary(BaseModel):
    users: int
    medicines: int
    reminders: int
    completed_reminders: int

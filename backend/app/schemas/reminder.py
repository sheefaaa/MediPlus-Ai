from datetime import datetime

from pydantic import BaseModel


class ReminderCreate(BaseModel):
    medicine_id: int
    reminder_time: datetime
    schedule_type: str = "daily"
    notification_status: str = "pending"
    completed: bool = False


class ReminderUpdate(BaseModel):
    reminder_time: datetime | None = None
    schedule_type: str | None = None
    notification_status: str | None = None
    completed: bool | None = None


class ReminderOut(BaseModel):
    id: int
    medicine_id: int
    reminder_time: datetime
    schedule_type: str
    notification_status: str
    completed: bool
    created_at: datetime
    medicine_name: str | None = None

    model_config = {"from_attributes": True}

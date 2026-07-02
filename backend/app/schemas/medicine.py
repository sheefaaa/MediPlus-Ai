from datetime import date, datetime

from pydantic import BaseModel, Field


class MedicineBase(BaseModel):
    medicine_name: str = Field(min_length=2, max_length=120)
    dosage: str = Field(min_length=1, max_length=80)
    frequency: str = Field(min_length=1, max_length=80)
    start_date: date
    end_date: date | None = None
    reminder_time: str = Field(pattern=r"^\d{2}:\d{2}$")
    category: str = Field(default="General", max_length=80)
    notes: str | None = None
    status: str = "active"


class MedicineCreate(MedicineBase):
    pass


class MedicineUpdate(BaseModel):
    medicine_name: str | None = None
    dosage: str | None = None
    frequency: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    reminder_time: str | None = Field(default=None, pattern=r"^\d{2}:\d{2}$")
    category: str | None = None
    notes: str | None = None
    status: str | None = None


class MedicineOut(MedicineBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = {"from_attributes": True}

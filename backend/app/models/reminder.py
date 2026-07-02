from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Reminder(Base):
    __tablename__ = "reminders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    medicine_id: Mapped[int] = mapped_column(ForeignKey("medicines.id", ondelete="CASCADE"), nullable=False, index=True)
    reminder_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    schedule_type: Mapped[str] = mapped_column(String(20), default="daily")
    notification_status: Mapped[str] = mapped_column(String(20), default="pending")
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    medicine = relationship("Medicine", back_populates="reminders")

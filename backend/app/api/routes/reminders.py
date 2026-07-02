from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.medicine import Medicine
from app.models.reminder import Reminder
from app.models.user import User
from app.schemas.reminder import ReminderCreate, ReminderOut, ReminderUpdate

router = APIRouter()


def serialize_reminder(reminder: Reminder) -> ReminderOut:
    return ReminderOut(
        id=reminder.id,
        medicine_id=reminder.medicine_id,
        reminder_time=reminder.reminder_time,
        schedule_type=reminder.schedule_type,
        notification_status=reminder.notification_status,
        completed=reminder.completed,
        created_at=reminder.created_at,
        medicine_name=reminder.medicine.medicine_name if reminder.medicine else None,
    )


def get_user_reminder_or_404(db: Session, reminder_id: int, user_id: int) -> Reminder:
    reminder = (
        db.query(Reminder)
        .join(Medicine, Reminder.medicine_id == Medicine.id)
        .filter(Reminder.id == reminder_id, Medicine.user_id == user_id)
        .first()
    )
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    return reminder


@router.get("/reminders", response_model=list[ReminderOut])
def list_reminders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reminders = (
        db.query(Reminder)
        .join(Medicine, Reminder.medicine_id == Medicine.id)
        .filter(Medicine.user_id == current_user.id)
        .order_by(Reminder.reminder_time.asc())
        .all()
    )
    return [serialize_reminder(item) for item in reminders]


@router.post("/reminders", response_model=ReminderOut, status_code=status.HTTP_201_CREATED)
def create_reminder(
    payload: ReminderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    medicine = db.query(Medicine).filter(Medicine.id == payload.medicine_id, Medicine.user_id == current_user.id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    reminder = Reminder(**payload.model_dump())
    db.add(reminder)
    db.commit()
    db.refresh(reminder)
    return serialize_reminder(reminder)


@router.put("/reminders/{reminder_id}", response_model=ReminderOut)
def update_reminder(
    reminder_id: int,
    payload: ReminderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reminder = get_user_reminder_or_404(db, reminder_id, current_user.id)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(reminder, key, value)
    db.add(reminder)
    db.commit()
    db.refresh(reminder)
    return serialize_reminder(reminder)


@router.delete("/reminders/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reminder(
    reminder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reminder = get_user_reminder_or_404(db, reminder_id, current_user.id)
    db.delete(reminder)
    db.commit()
    return None

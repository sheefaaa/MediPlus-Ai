from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.medicine import Medicine
from app.models.reminder import Reminder
from app.models.user import User
from app.schemas.medicine import MedicineCreate, MedicineOut, MedicineUpdate
from app.services.analytics import next_occurrence_time

router = APIRouter()


def get_user_medicine_or_404(db: Session, medicine_id: int, user_id: int) -> Medicine:
    medicine = db.query(Medicine).filter(Medicine.id == medicine_id, Medicine.user_id == user_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return medicine


@router.get("/medicines", response_model=list[MedicineOut])
def list_medicines(
    search: str | None = Query(default=None),
    category: str | None = Query(default=None),
    status_filter: str | None = Query(default=None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Medicine).filter(Medicine.user_id == current_user.id)
    if search:
        query = query.filter(Medicine.medicine_name.ilike(f"%{search}%"))
    if category:
        query = query.filter(Medicine.category == category)
    if status_filter:
        query = query.filter(Medicine.status == status_filter)
    return query.order_by(Medicine.created_at.desc()).all()


@router.post("/medicines", response_model=MedicineOut, status_code=status.HTTP_201_CREATED)
def create_medicine(
    payload: MedicineCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    medicine = Medicine(user_id=current_user.id, **payload.model_dump())
    db.add(medicine)
    db.commit()
    db.refresh(medicine)

    reminder = Reminder(medicine_id=medicine.id, reminder_time=next_occurrence_time(medicine.reminder_time))
    db.add(reminder)
    db.commit()
    return medicine


@router.get("/medicines/{medicine_id}", response_model=MedicineOut)
def get_medicine(
    medicine_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_medicine_or_404(db, medicine_id, current_user.id)


@router.put("/medicines/{medicine_id}", response_model=MedicineOut)
def update_medicine(
    medicine_id: int,
    payload: MedicineUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    medicine = get_user_medicine_or_404(db, medicine_id, current_user.id)
    update_data = payload.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(medicine, key, value)

    if "reminder_time" in update_data and medicine.reminders:
        medicine.reminders[0].reminder_time = next_occurrence_time(medicine.reminder_time)

    db.add(medicine)
    db.commit()
    db.refresh(medicine)
    return medicine


@router.delete("/medicines/{medicine_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_medicine(
    medicine_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    medicine = get_user_medicine_or_404(db, medicine_id, current_user.id)
    db.delete(medicine)
    db.commit()
    return None

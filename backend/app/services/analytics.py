from datetime import date, datetime, time, timedelta

from sqlalchemy.orm import Session

from app.models.medicine import Medicine
from app.models.reminder import Reminder
from app.models.user import User


def build_dashboard(db: Session, user: User) -> dict:
    medicines = db.query(Medicine).filter(Medicine.user_id == user.id).all()
    reminders = (
        db.query(Reminder)
        .join(Medicine, Reminder.medicine_id == Medicine.id)
        .filter(Medicine.user_id == user.id)
        .all()
    )

    today = date.today()
    now = datetime.now()
    tomorrow = now + timedelta(days=1)

    today_medicines = []
    upcoming_reminders = []
    for medicine in medicines:
        if medicine.start_date <= today and (medicine.end_date is None or medicine.end_date >= today):
            today_medicines.append(
                {
                    "id": medicine.id,
                    "medicine_name": medicine.medicine_name,
                    "dosage": medicine.dosage,
                    "reminder_time": medicine.reminder_time,
                    "status": medicine.status,
                    "category": medicine.category,
                }
            )

    missed_count = 0
    for reminder in reminders:
        if reminder.reminder_time < now and not reminder.completed:
            missed_count += 1
        if now <= reminder.reminder_time <= tomorrow:
            upcoming_reminders.append(
                {
                    "id": reminder.id,
                    "medicine_id": reminder.medicine_id,
                    "medicine_name": reminder.medicine.medicine_name,
                    "reminder_time": reminder.reminder_time.isoformat(),
                    "completed": reminder.completed,
                    "schedule_type": reminder.schedule_type,
                }
            )

    total = len(reminders)
    completed = len([item for item in reminders if item.completed])
    completion_rate = round((completed / total) * 100, 2) if total else 0.0

    return {
        "today_count": len(today_medicines),
        "missed_count": missed_count,
        "upcoming_count": len(upcoming_reminders),
        "active_medicines": len([medicine for medicine in medicines if medicine.status == "active"]),
        "completion_rate": completion_rate,
        "today_medicines": today_medicines,
        "upcoming_reminders": sorted(upcoming_reminders, key=lambda item: item["reminder_time"])[:6],
    }


def build_analytics(db: Session, user: User) -> dict:
    medicines = db.query(Medicine).filter(Medicine.user_id == user.id).all()
    reminders = (
        db.query(Reminder)
        .join(Medicine, Reminder.medicine_id == Medicine.id)
        .filter(Medicine.user_id == user.id)
        .all()
    )
    total = len(reminders)
    completed = len([item for item in reminders if item.completed])
    completion_rate = round((completed / total) * 100, 2) if total else 0.0
    missed_count = len([item for item in reminders if item.reminder_time < datetime.now() and not item.completed])

    weekly_chart = []
    for index in range(6, -1, -1):
        target = date.today() - timedelta(days=index)
        day_reminders = [item for item in reminders if item.reminder_time.date() == target]
        day_total = len(day_reminders)
        day_completed = len([item for item in day_reminders if item.completed])
        weekly_chart.append(
            {
                "label": target.strftime("%a"),
                "value": round((day_completed / day_total) * 100, 2) if day_total else 0,
            }
        )

    monthly_chart = []
    for index in range(4, -1, -1):
        target_date = date.today() - timedelta(days=index * 7)
        start = target_date - timedelta(days=6)
        range_reminders = [item for item in reminders if start <= item.reminder_time.date() <= target_date]
        range_total = len(range_reminders)
        range_completed = len([item for item in range_reminders if item.completed])
        monthly_chart.append(
            {
                "label": f"Week {5 - index}",
                "value": round((range_completed / range_total) * 100, 2) if range_total else 0,
            }
        )

    streak_counter = 0
    for index in range(0, 10):
        target = date.today() - timedelta(days=index)
        day_reminders = [item for item in reminders if item.reminder_time.date() == target]
        if not day_reminders:
            continue
        if all(item.completed for item in day_reminders):
            streak_counter += 1
        else:
            break

    return {
        "completion_rate": completion_rate,
        "active_medicines": len([medicine for medicine in medicines if medicine.status == "active"]),
        "missed_count": missed_count,
        "streak_counter": streak_counter,
        "weekly_chart": weekly_chart,
        "monthly_chart": monthly_chart,
    }


def build_statistics(db: Session, user: User) -> dict:
    medicines = db.query(Medicine).filter(Medicine.user_id == user.id).count()
    reminders_query = (
        db.query(Reminder)
        .join(Medicine, Reminder.medicine_id == Medicine.id)
        .filter(Medicine.user_id == user.id)
    )
    reminders = reminders_query.count()
    completed_reminders = reminders_query.filter(Reminder.completed.is_(True)).count()
    return {
        "users": 1,
        "medicines": medicines,
        "reminders": reminders,
        "completed_reminders": completed_reminders,
    }


def next_occurrence_time(reminder_time: str) -> datetime:
    hour, minute = [int(item) for item in reminder_time.split(":")]
    candidate = datetime.combine(date.today(), time(hour=hour, minute=minute))
    if candidate < datetime.now():
        candidate = candidate + timedelta(days=1)
    return candidate

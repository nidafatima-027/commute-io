from sqlalchemy.orm import Session
from typing import List
from app.db.models import Schedule

def get_user_schedule(db: Session, user_id: int) -> List[Schedule]:
    return db.query(Schedule).filter(Schedule.user_id == user_id).all()

def create_schedule(db: Session, schedule_data: dict, user_id: int) -> Schedule:
    db_schedule = Schedule(**schedule_data, user_id=user_id)
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

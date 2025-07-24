import json
from sqlalchemy.orm import Session
from typing import Optional
from app.db.models.user import User
from app.schema.user import UserCreate, UserUpdate

def get_user(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def get_user_by_phone(db: Session, phone: str) -> Optional[User]:
    return db.query(User).filter(User.phone == phone).first()

def create_user(db: Session, user: UserCreate) -> User:
    db_user = User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        bio=user.bio,
        is_driver=user.is_driver,
        is_rider=user.is_rider,
        preferences=user.preferences.dict() if user.preferences else None
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, update_data: dict) -> Optional[User]:
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    if 'preferences' in update_data:
        if isinstance(update_data['preferences'], str):
            try:
                update_data['preferences'] = json.loads(update_data['preferences'])
            except json.JSONDecodeError:
                update_data['preferences'] = None
        elif isinstance(update_data['preferences'], dict):
            update_data['preferences'] = json.dumps(update_data['preferences'])
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user
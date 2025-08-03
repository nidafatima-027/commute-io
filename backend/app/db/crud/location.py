from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.models.location import PreferredLocation
from sqlalchemy.exc import SQLAlchemyError

def get_user_locations(db: Session, user_id: int) -> List[PreferredLocation]:
    return db.query(PreferredLocation).filter(PreferredLocation.user_id == user_id).all()

def create_location(db: Session, location_data: dict, user_id: int) -> PreferredLocation:
    try:
        db_location = PreferredLocation(**location_data, user_id=user_id)
        db.add(db_location)
        db.commit()
        db.refresh(db_location)
        return db_location
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create location"
        )
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from datetime import datetime
from app.db.models.ride_history import RideHistory
from app.db.models.ride import Ride
from app.db.models.user import User
from app.db.models.car import Car
import pytz


def get_user_ride_history_by_id(db: Session, user_id: int) -> List[RideHistory]:
    """Get all ride history for a user (both as driver and rider) with related data"""
    return (db.query(RideHistory)
            .options(
                joinedload(RideHistory.user),
                joinedload(RideHistory.ride).joinedload(Ride.driver),
                joinedload(RideHistory.ride).joinedload(Ride.car)
            )
            .filter(RideHistory.user_id == user_id)
            .order_by(RideHistory.completed_at.desc())
            .all())

def get_ride_history_by_id(db: Session, history_id: int) -> List[RideHistory]:
    """Get all ride history for a user (both as driver and rider)"""
    return db.query(RideHistory).filter(RideHistory.id == history_id).first()

def get_rider_ride_history(db: Session, user_id: int, ride_id: int) -> List[RideHistory]:
    """Get all ride history for a user (both as driver and rider)"""
    return db.query(RideHistory).filter(RideHistory.user_id == user_id, RideHistory.ride_id == ride_id).first()

def get_ride_history_by_ride_id(db: Session, ride_id: int) -> List[RideHistory]:
    """Get all ride history for a user (both as driver and rider)"""
    return db.query(RideHistory).filter(RideHistory.ride_id == ride_id).all()

def create_ride_history_entry(db: Session, user_id: int, ride_id: int, role: str) -> RideHistory:
    """Create a new ride history entry"""
    pakistan_tz = pytz.timezone('Asia/Karachi')
    now_pakistan = datetime.now(pakistan_tz).replace(tzinfo=None)
    db_history = RideHistory(
        user_id=user_id,
        ride_id=ride_id,
        role=role,
        joined_at=now_pakistan
    )
    db.add(db_history)
    db.commit()
    db.refresh(db_history)
    return db_history

def complete_ride_history(db: Session, history_id: int, rating_given: int = None) -> Optional[RideHistory]:
    """Mark a ride as completed and optionally add rating"""
    db_history = db.query(RideHistory).filter(RideHistory.id == history_id).first()
    if not db_history:
        return None
    pakistan_tz = pytz.timezone('Asia/Karachi')
    now_pakistan = datetime.now(pakistan_tz).replace(tzinfo=None)
    db_history.completed_at = now_pakistan
    if rating_given:
        db_history.rating_given = rating_given
    
    db.commit()
    db.refresh(db_history)
    return db_history

def update_received_rating(db: Session, history_id: int, rating: int) -> Optional[RideHistory]:
    """Update the rating received by a user for a specific ride"""
    db_history = db.query(RideHistory).filter(RideHistory.id == history_id).first()
    
    if not db_history:
        return None
    
    db_history.rating_received = rating
    db.commit()
    db.refresh(db_history)
    return db_history

def update_rating_given(db: Session, history_id: int, rating: int) -> Optional[RideHistory]:
    """Update the rating received by a user for a specific ride"""
    db_history = db.query(RideHistory).filter(RideHistory.id == history_id).first()
    
    if not db_history:
        return None
    
    db_history.rating_given = rating
    db.commit()
    db.refresh(db_history)
    return db_history
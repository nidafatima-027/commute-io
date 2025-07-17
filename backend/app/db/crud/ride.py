from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.db.models.ride import Ride
from app.schema.ride import RideCreate, RideUpdate

def get_available_rides(db: Session, user_id: int, limit: int = 50) -> List[Ride]:
    return db.query(Ride).filter(
        Ride.driver_id != user_id,
        Ride.status == "active",
        Ride.seats_available > 0,
        Ride.start_time > datetime.utcnow()
    ).limit(limit).all()

def get_user_rides(db: Session, user_id: int) -> List[Ride]:
    return db.query(Ride).filter(Ride.driver_id == user_id).all()

def create_ride(db: Session, ride: RideCreate, driver_id: int) -> Ride:
    db_ride = Ride(
        driver_id=driver_id,
        start_location=ride.start_location,  # Direct string assignment
        end_location=ride.end_location,      # Direct string assignment
        car_id=ride.car_id,
        start_time=ride.start_time,
        seats_available=ride.seats_available,
        total_fare=ride.total_fare,
    )
    db.add(db_ride)
    db.commit()
    db.refresh(db_ride)
    return db_ride

def get_ride(db: Session, ride_id: int) -> Optional[Ride]:
    return db.query(Ride).filter(Ride.id == ride_id).first()

def update_ride(db: Session, ride_id: int, ride_update: RideUpdate, driver_id: int) -> Optional[Ride]:
    db_ride = db.query(Ride).filter(Ride.id == ride_id, Ride.driver_id == driver_id).first()
    if not db_ride:
        return None
    for field, value in ride_update.dict(exclude_unset=True).items():
        setattr(db_ride, field, value)
    db.commit()
    db.refresh(db_ride)
    return db_ride
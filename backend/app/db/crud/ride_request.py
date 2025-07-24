from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.models.ride_request import RideRequest

def create_ride_request(db: Session, ride_id: int, rider_id: int, message: str = None) -> RideRequest:
    db_request = RideRequest(ride_id=ride_id, rider_id=rider_id, message=message)
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

def get_ride_requests(db: Session, ride_id: int) -> List[RideRequest]:
    return db.query(RideRequest).filter(RideRequest.ride_id == ride_id, RideRequest.status == 'pending').all()

def get_ride_accepted_requests(db: Session, ride_id: int) -> List[RideRequest]:
    return db.query(RideRequest).filter(RideRequest.ride_id == ride_id, RideRequest.status == 'accepted').all()

def get_user_ride_requests(db: Session, user_id: int) -> List[RideRequest]:
    return db.query(RideRequest).filter(RideRequest.rider_id == user_id).all()

def update_ride_request_status(db: Session, request_id: int, status: str) -> Optional[RideRequest]:
    db_request = db.query(RideRequest).filter(RideRequest.id == request_id).first()
    if not db_request:
        return None
    db_request.status = status
    db.commit()
    db.refresh(db_request)
    return db_request

def user_already_requested(db: Session, ride_id: int, user_id: int) -> bool:
    return db.query(RideRequest).filter(
        RideRequest.ride_id == ride_id,
        RideRequest.rider_id == user_id
    ).first() is not None
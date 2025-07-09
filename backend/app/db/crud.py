from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
from datetime import datetime

from app.db.models import User, Car, Ride, RideRequest, Message, PreferredLocation, Schedule, RideHistory
from app.dto.user import UserCreate, UserUpdate
from app.dto.car import CarCreate, CarUpdate
from app.dto.ride import RideCreate, RideUpdate
from app.dto.message import MessageCreate
from app.core.security import get_password_hash


# User CRUD
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
        role_mode=user.role_mode,
        preferences=user.preferences
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, user_id: int, user_update: UserUpdate) -> Optional[User]:
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    for field, value in user_update.dict(exclude_unset=True).items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user


# Car CRUD
def get_user_cars(db: Session, user_id: int) -> List[Car]:
    return db.query(Car).filter(Car.user_id == user_id).all()


def create_car(db: Session, car: CarCreate, user_id: int) -> Car:
    db_car = Car(**car.dict(), user_id=user_id)
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    return db_car


def update_car(db: Session, car_id: int, car_update: CarUpdate, user_id: int) -> Optional[Car]:
    db_car = db.query(Car).filter(Car.id == car_id, Car.user_id == user_id).first()
    if not db_car:
        return None
    
    for field, value in car_update.dict(exclude_unset=True).items():
        setattr(db_car, field, value)
    
    db.commit()
    db.refresh(db_car)
    return db_car


def delete_car(db: Session, car_id: int, user_id: int) -> bool:
    db_car = db.query(Car).filter(Car.id == car_id, Car.user_id == user_id).first()
    if not db_car:
        return False
    
    db.delete(db_car)
    db.commit()
    return True


# Ride CRUD
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
    db_ride = Ride(**ride.dict(), driver_id=driver_id)
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


# Ride Request CRUD
def create_ride_request(db: Session, ride_id: int, rider_id: int, message: str = None) -> RideRequest:
    db_request = RideRequest(
        ride_id=ride_id,
        rider_id=rider_id,
        message=message
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request


def get_ride_requests(db: Session, ride_id: int) -> List[RideRequest]:
    return db.query(RideRequest).filter(RideRequest.ride_id == ride_id).all()


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


# Message CRUD
def create_message(db: Session, message: MessageCreate, sender_id: int) -> Message:
    db_message = Message(**message.dict(), sender_id=sender_id)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


def get_conversation(db: Session, user1_id: int, user2_id: int) -> List[Message]:
    return db.query(Message).filter(
        or_(
            and_(Message.sender_id == user1_id, Message.receiver_id == user2_id),
            and_(Message.sender_id == user2_id, Message.receiver_id == user1_id)
        )
    ).order_by(Message.sent_at).all()


def get_user_conversations(db: Session, user_id: int) -> List[Message]:
    # Get latest message from each conversation
    return db.query(Message).filter(
        or_(Message.sender_id == user_id, Message.receiver_id == user_id)
    ).order_by(Message.sent_at.desc()).all()


# Location CRUD
def get_user_locations(db: Session, user_id: int) -> List[PreferredLocation]:
    return db.query(PreferredLocation).filter(PreferredLocation.user_id == user_id).all()


def create_location(db: Session, location_data: dict, user_id: int) -> PreferredLocation:
    db_location = PreferredLocation(**location_data, user_id=user_id)
    db.add(db_location)
    db.commit()
    db.refresh(db_location)
    return db_location


# Schedule CRUD
def get_user_schedule(db: Session, user_id: int) -> List[Schedule]:
    return db.query(Schedule).filter(Schedule.user_id == user_id).all()


def create_schedule(db: Session, schedule_data: dict, user_id: int) -> Schedule:
    db_schedule = Schedule(**schedule_data, user_id=user_id)
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule
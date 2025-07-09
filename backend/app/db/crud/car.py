from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.models import Car
from app.schema.car import CarCreate, CarUpdate

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

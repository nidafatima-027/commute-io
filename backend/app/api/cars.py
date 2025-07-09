from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.api.auth import get_current_user
from app.db.crud import get_user_cars, create_car, update_car, delete_car
from app.dto.car import CarCreate, CarUpdate, CarResponse

router = APIRouter()


@router.get("/", response_model=List[CarResponse])
async def get_cars(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_cars(db, current_user.id)


@router.post("/", response_model=CarResponse)
async def create_user_car(
    car: CarCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_car(db, car, current_user.id)


@router.put("/{car_id}", response_model=CarResponse)
async def update_user_car(
    car_id: int,
    car_update: CarUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    updated_car = update_car(db, car_id, car_update, current_user.id)
    if not updated_car:
        raise HTTPException(status_code=404, detail="Car not found")
    return updated_car


@router.delete("/{car_id}")
async def delete_user_car(
    car_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not delete_car(db, car_id, current_user.id):
        raise HTTPException(status_code=404, detail="Car not found")
    return {"message": "Car deleted successfully"}
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.api.auth import get_current_user
from app.db.crud import update_user, get_user_schedule, create_schedule, get_user_locations, create_location
from app.dto.user import UserUpdate, UserResponse
from app.dto.schedule import ScheduleCreate, ScheduleResponse
from app.dto.location import LocationCreate, LocationResponse

router = APIRouter()


@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user = Depends(get_current_user)):
    return current_user


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    user_update: UserUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    updated_user = update_user(db, current_user.id, user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user


@router.get("/schedule", response_model=List[ScheduleResponse])
async def get_schedule(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_schedule(db, current_user.id)


@router.post("/schedule", response_model=ScheduleResponse)
async def create_user_schedule(
    schedule: ScheduleCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_schedule(db, schedule.dict(), current_user.id)


@router.get("/locations", response_model=List[LocationResponse])
async def get_locations(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_locations(db, current_user.id)


@router.post("/locations", response_model=LocationResponse)
async def create_user_location(
    location: LocationCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_location(db, location.dict(), current_user.id)
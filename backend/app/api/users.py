import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.api.auth import get_current_user
from app.db.crud.user import update_user
from app.db.crud.schedule import get_user_schedule, create_schedule
from app.schema.user import UserUpdate, UserResponse, UserPreferences, ProfileResponse, GenderPreference, MusicPreference, ConversationPreference, SmokingPreference
from app.schema.schedule import ScheduleCreate, ScheduleResponse
from app.db.models.ride import Ride
from app.db.models.ride_history import RideHistory
from app.db.models.user import User

router = APIRouter()


@router.get("/preferences/options")
async def get_preference_options():
    """
    Get all available preference options for user selection
    """
    return {
        "gender_preferences": [option.value for option in GenderPreference],
        "music_preferences": [option.value for option in MusicPreference],
        "conversation_preferences": [option.value for option in ConversationPreference],
        "smoking_preferences": [option.value for option in SmokingPreference]
    }


@router.get("/profile", response_model=ProfileResponse)
async def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Count rides taken (where user is passenger)
    rides_taken = db.query(RideHistory).filter(
        RideHistory.user_id == current_user.id
    ).count()
    
    # Count rides offered (where user is driver)
    rides_offered = db.query(Ride).filter(
        Ride.driver_id == current_user.id
    ).count()
    
    profile_data = {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "phone": current_user.phone,
        "bio": current_user.bio,
        "gender": current_user.gender,
        "photo_url": current_user.photo_url,
        "is_driver": current_user.is_driver,
        "is_rider": current_user.is_rider,
        # include all other fields you need
        "rides_taken": rides_taken,
        "rides_offered": rides_offered,
        "preferences": current_user.preferences
    }
    
    return profile_data


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    user_update: UserUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    update_data = user_update.dict(exclude_unset=True)
    if 'preferences' in update_data:
        if isinstance(update_data['preferences'], dict):
            update_data['preferences'] = json.dumps(update_data['preferences'])
    
    updated_user = update_user(db, current_user.id, update_data)
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


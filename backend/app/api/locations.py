from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.models.location import PreferredLocation

from app.core.database import get_db
from app.api.auth import get_current_user
from app.db.crud.location import get_user_locations, create_location
from app.schema.location import LocationCreate, LocationResponse

router = APIRouter()


@router.get("/", response_model=List[LocationResponse])
async def get_locations(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_locations(db, current_user.id)


@router.post("/", response_model=LocationResponse)
async def create_user_location(
    location: LocationCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(PreferredLocation).filter(
        (PreferredLocation.user_id == current_user.id) &
        ((PreferredLocation.name == location.name) | 
         (PreferredLocation.address == location.address))
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Location with this name or address already exists"
        )
    return create_location(db, location.dict(), current_user.id)
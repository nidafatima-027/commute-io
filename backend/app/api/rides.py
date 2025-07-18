from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.api.auth import get_current_user
from app.db.crud.ride import (
    get_available_rides, 
    create_ride, 
    get_user_rides, 
    get_ride,
    update_ride,
)
from app.db.crud.ride_request import (
    create_ride_request,
    get_ride_requests,
    get_user_ride_requests,
    update_ride_request_status
)
from app.schema.ride import (
    RideCreate,
    RideHistoryResponse, 
    RideUpdate, 
    RideResponse, 
    RideRequestCreate,
    RideRequestResponse,
    RideRequestUpdate
)
from app.db.crud.ride_history import create_ride_history_entry, get_user_ride_history

router = APIRouter()


@router.get("/", response_model=List[RideResponse])
async def search_rides(
    limit: int = Query(50, le=100),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        rides = get_available_rides(db, current_user.id, limit)
        return rides or []  # Return empty list if no rides found
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching rides: {str(e)}"
        )

@router.post("/", response_model=RideResponse)
async def create_new_ride(
    ride: RideCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_ride(db, ride, current_user.id)


@router.get("/my-rides", response_model=List[RideResponse])
async def get_my_rides(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_rides(db, current_user.id)


@router.get("/{ride_id}", response_model=RideResponse)
async def get_ride_details(
    ride_id: int,
    db: Session = Depends(get_db)
):
    ride = get_ride(db, ride_id)
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    return ride


@router.put("/{ride_id}", response_model=RideResponse)
async def update_ride_details(
    ride_id: int,
    ride_update: RideUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    updated_ride = update_ride(db, ride_id, ride_update, current_user.id)
    if not updated_ride:
        raise HTTPException(status_code=404, detail="Ride not found or unauthorized")
    return updated_ride


@router.post("/request", response_model=RideRequestResponse)
async def request_ride(
    request: RideRequestCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if ride exists and user is not the driver
    ride = get_ride(db, request.ride_id)
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    
    if ride.driver_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot request your own ride")
    
    return create_ride_request(db, request.ride_id, current_user.id, request.message)


@router.get("/{ride_id}/requests", response_model=List[RideRequestResponse])
async def get_ride_join_requests(
    ride_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify user is the driver
    ride = get_ride(db, ride_id)
    if not ride or ride.driver_id != current_user.id:
        raise HTTPException(status_code=404, detail="Ride not found or unauthorized")
    
    return get_ride_requests(db, ride_id)


@router.put("/requests/{request_id}", response_model=RideRequestResponse)
async def update_ride_request(
    request_id: int,
    request_update: RideRequestUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    updated_request = update_ride_request_status(db, request_id, request_update.status)
    if not updated_request:
        raise HTTPException(status_code=404, detail="Request not found")
    return updated_request


@router.get("/my-requests", response_model=List[RideRequestResponse])
async def get_my_ride_requests(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_ride_requests(db, current_user.id)


@router.get("/history", response_model=List[RideHistoryResponse])
async def get_ride_history(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's ride history (both as driver and rider)"""
    return get_user_ride_history(db, current_user.id)


@router.post("/history", response_model=RideHistoryResponse)
async def create_ride_history(
    ride_id: int,
    role: str,  # "driver" or "rider"
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a ride history entry when a ride is completed"""
    return create_ride_history_entry(db, current_user.id, ride_id, role)
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
    get_user_completed_rides,
    get_user_started_rides,
)
from app.db.crud.ride_request import (
    create_ride_request,
    get_ride_requests,
    get_user_ride_requests,
    get_driver_ride_requests,
    update_ride_request_status,
    user_already_requested,
    get_ride_accepted_requests,
    get_existing_request_time
)
from app.schema.ride import (
    RideCreate,
    RideHistoryResponse, 
    RideUpdate, 
    RideResponse,
    DriverRideResponse,
    RideRequestCreate,
    RideRequestResponse,
    RideRequestUpdate,
    RideHistoryUpdateRequest,
    RideHistoryCreate,
    RiderHistoryUpdateRequest,
    CheckRequestResponse
)
from app.db.crud.ride_history import create_ride_history_entry, get_user_ride_history_by_id, get_rider_ride_history, get_ride_history_by_id, complete_ride_history, update_received_rating, get_ride_history_by_ride_id

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

@router.post("/", response_model=DriverRideResponse)
async def create_new_ride(
    ride: RideCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    print(ride)
    return create_ride(db, ride, current_user.id)


@router.get("/my-rides", response_model=List[DriverRideResponse])
async def get_my_rides(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_rides(db, current_user.id)

@router.get("/my-started-rides", response_model=List[DriverRideResponse])
async def get_my_started_rides(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_started_rides(db, current_user.id)

@router.get("/my-completed-rides", response_model=List[DriverRideResponse])
async def get_my_rides(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_completed_rides(db, current_user.id)

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
    return get_user_ride_history_by_id(db, current_user.id)

@router.get("/driver-requests", response_model=List[RideRequestResponse])
async def get_driver_ride_requests_endpoint(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all ride requests for the driver's rides"""
    return get_driver_ride_requests(db, current_user.id)


@router.get("/{ride_id}", response_model=RideResponse)
async def get_ride_details(
    ride_id: int,
    db: Session = Depends(get_db)
):
    ride = get_ride(db, ride_id)
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    return ride


@router.put("/{ride_id}", response_model=DriverRideResponse)
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
    
    print(f"creating ride request: {request}")
    try:
        # Check if ride exists and user is not the driver
        ride = get_ride(db, request.ride_id)
        if not ride:
            raise HTTPException(
                status_code=404,
                detail={
                    "code": "ride_not_found",
                    "message": "Ride not found"
                }
            )
        
        if ride.driver_id == current_user.id:
            raise HTTPException(
                status_code=400,
                detail={
                    "code": "self_request",
                    "message": "Cannot request your own ride"
                }
            )

        # Check for existing request
        if user_already_requested(db, request.ride_id, current_user.id):
            existing_request_time = get_existing_request_time(db, request.ride_id, current_user.id)
            raise HTTPException(
                status_code=400,
                detail={
                    "code": "duplicate_request",
                    "message": "You have already requested this ride",
                    "metadata": {
                        "ride_id": request.ride_id,
                        "requested_at": existing_request_time,
                        "joining_stop": request.joining_stop,
                        "ending_stop": request.ending_stop
                    }
                }
            )
        
        # Validate stops
        if not request.joining_stop or not request.ending_stop:
            raise HTTPException(
                status_code=400,
                detail={
                    "code": "invalid_stops",
                    "message": "Both joining and ending stops are required"
                }
            )
        
        if request.joining_stop == request.ending_stop:
            raise HTTPException(
                status_code=400,
                detail={
                    "code": "same_stops",
                    "message": "Joining and ending stops cannot be the same"
                }
            )
        
        # Create new request
        ride_request = create_ride_request(db, request.ride_id, current_user.id,request.joining_stop, request.ending_stop, request.message)
        db.commit()
        return ride_request

    except HTTPException as http_exc:
        # Re-raise HTTP exceptions we've created
        raise http_exc
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail={
                "code": "server_error",
                "message": "Internal server error",
                "error": str(e)
            }
        )
    
@router.get("/{ride_id}/check-request", response_model=CheckRequestResponse)
async def check_existing_request(
    ride_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        exists = user_already_requested(db, ride_id, current_user.id)
        if exists:
            existing_request_time = get_existing_request_time(db, ride_id, current_user.id)
            return {
                "exists": True,
                "requested_at": existing_request_time
            }
        return {"exists": False}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "code": "server_error",
                "message": "Error checking request status"
            }
        )

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

@router.get("/{ride_id}/acceptedrequests", response_model=List[RideRequestResponse])
async def get_ride_accept_requests(
    ride_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify user is the driver
    ride = get_ride(db, ride_id)
    if not ride or ride.driver_id != current_user.id:
        raise HTTPException(status_code=404, detail="Ride not found or unauthorized")
    
    return get_ride_accepted_requests(db, ride_id)


@router.put("/requests/{request_id}", response_model=RideRequestResponse)
async def update_ride_request(
    request_id: int,
    request_update: RideRequestUpdate,
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

@router.get("/history/{user_id}/{ride_id}", response_model=RideHistoryResponse)
async def get_user_ride_history(
    user_id: int,
    ride_id: int,
    db: Session = Depends(get_db)
):
    """Get user's ride history (both as driver and rider)"""
    return get_rider_ride_history(db, user_id, ride_id)

@router.get("/history-ride/{ride_id}", response_model=List[RideHistoryResponse])
async def get_user_ride_history(
    ride_id: int,
    db: Session = Depends(get_db)
):
    """Get user's ride history (both as driver and rider)"""
    return get_ride_history_by_ride_id(db, ride_id)


@router.post("/history", response_model=RideHistoryResponse)
async def create_ride_history(
    history_data: RideHistoryCreate,
    db: Session = Depends(get_db)
):
    """Create a ride history entry when a ride is completed"""
    return create_ride_history_entry(db, history_data.user_id, history_data.ride_id, history_data.role)

@router.put("/history/{history_id}", response_model=RideHistoryResponse)
async def update_ride_history(
    history_id: int,
    update_data: RideHistoryUpdateRequest,
    db: Session = Depends(get_db)
):
    """Update a ride history entry using utility functions"""

    # If rating_received is provided, update it
    updated_history = None
    if update_data.rating_received is not None:
        updated_history = update_received_rating(db, history_id, update_data.rating_received)
        if not updated_history:
            raise HTTPException(status_code=404, detail="Ride history not found when updating received rating")

    # Always complete the ride and optionally update rating_given
    updated_history = complete_ride_history(db, history_id)
    if not updated_history:
        raise HTTPException(status_code=404, detail="Ride history not found when completing the ride")

    return updated_history

@router.put("/history/rider/{history_id}", response_model=RideHistoryResponse)
async def update_rider_ride_history(
    history_id: int,
    update_data: RiderHistoryUpdateRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a ride history entry"""
    db_history = get_ride_history_by_id(db, history_id)
    if not db_history:
        raise HTTPException(status_code=404, detail="Ride history not found")

    if db_history.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this ride history")

    if update_data.rating_given is not None:
        db_history.rating_given = update_data.rating_given

    db.commit()
    db.refresh(db_history)
    return db_history
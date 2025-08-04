from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.schema.car import CarResponse
from app.schema.user import UserRideResponse, UserResponse

class RideBase(BaseModel):
    car_id: int
    start_location: str
    end_location: str
    start_latitude: Optional[float] = None
    start_longitude: Optional[float] = None
    end_latitude: Optional[float] = None
    end_longitude: Optional[float] = None
    distance_km: Optional[float] = None
    estimated_duration: Optional[int] = None
    start_time: datetime
    seats_available: int
    main_stops: Optional[list[str]] = None  # List of main stops as strings
    total_fare: Optional[float] = None

    class Config:
        extra = "forbid"  # ← This allows extra fields if needed
        arbitrary_types_allowed = True


class RideCreate(RideBase):
    pass


class RideUpdate(BaseModel):
    start_time: Optional[datetime] = None
    seats_available: Optional[int] = None
    status: Optional[str] = None


class RideResponse(RideBase):
    id: int
    driver_id: int
    status: str
    driver: UserRideResponse
    car: CarResponse
    
    class Config:
        from_attributes = True

class DriverRideResponse(RideBase):
    id: int
    driver_id: int
    status: str
    driver: UserResponse
    car: CarResponse
    
    class Config:
        from_attributes = True


class RideRequestCreate(BaseModel):
    ride_id: int
    message: Optional[str] = None
    joining_stop: str  # New field
    ending_stop: str   # New field


class UserPublic(BaseModel):
    id: int
    name: str
    photo_url: Optional[str] = None
    rating: Optional[float] = None
    rides_taken: Optional[int] = None

    class Config:
        from_attributes = True

class RidePublic(BaseModel):
    id: int
    start_location: str
    end_location: str
    start_time: datetime
    seats_available: int
    total_fare: float

    class Config:
        from_attributes = True

class RideRequestResponse(BaseModel):
    id: int
    rider_id: int
    ride_id: int
    status: str
    requested_at: datetime
    message: Optional[str] = None
    joining_stop: Optional[str] = None  # Made optional
    ending_stop: Optional[str] = None   # Made optional
    rider: UserPublic
    ride: RidePublic

    class Config:
        from_attributes = True


class RideRequestUpdate(BaseModel):
    status: str  # accepted, rejected


class RideHistoryResponse(BaseModel):
    id: int
    user_id: int
    ride_id: int
    role: str  # driver, rider
    joined_at: datetime
    completed_at: Optional[datetime] = None
    rating_given: Optional[int] = None
    rating_received: Optional[int] = None
    review_given: Optional[str] = None
    review_received: Optional[str] = None
    # Add ride details for frontend
    ride: Optional["DriverRideResponse"] = None

    class Config:
        from_attributes = True

class RideHistoryUpdateRequest(BaseModel):
    rating_received: Optional[int] = None
    review_received: Optional[str] = None

class RiderHistoryUpdateRequest(BaseModel):
    rating_given: Optional[int] = None
    review_given: Optional[str] = None

class RideHistoryCreate(BaseModel):
    user_id: int
    ride_id: int
    role: str  # "driver" or "rider"

class CheckRequestResponse(BaseModel):
    exists: bool
    requested_at: Optional[str] = None  # ISO 8601 format
    status: Optional[str] = None  # 'pending', 'accepted', 'rejected'
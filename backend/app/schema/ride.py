from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.schema.car import CarResponse
from app.schema.user import UserResponse


class RideBase(BaseModel):
    car_id: int
    start_location: str
    end_location: str
    start_time: datetime
    seats_available: int
    total_fare: float


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
    driver: UserResponse  # Add this
    car: CarResponse      # Add this
    class Config:
        from_attributes = True


class RideRequestCreate(BaseModel):
    ride_id: int
    message: Optional[str] = None


class RideRequestResponse(BaseModel):
    id: int
    rider_id: int
    ride_id: int
    status: str
    requested_at: datetime
    message: Optional[str] = None

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

    class Config:
        from_attributes = True
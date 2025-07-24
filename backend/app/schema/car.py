from pydantic import BaseModel
from typing import Optional


class CarBase(BaseModel):
    make: str
    model: str
    year: Optional[int] = None
    color: Optional[str] = None
    license_plate: str
    seats: int
    ac_available: Optional[bool] = False  # New field
    photo_url: Optional[str] = None


class CarCreate(CarBase):
    pass


class CarUpdate(BaseModel):
    make: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    color: Optional[str] = None
    license_plate: Optional[str] = None
    seats: Optional[int] = None
    ac_available: Optional[bool] = None  # New field
    photo_url: Optional[str] = None


class CarResponse(CarBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
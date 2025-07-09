from pydantic import BaseModel
from typing import Optional


class LocationBase(BaseModel):
    name: str
    address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class LocationCreate(LocationBase):
    pass


class LocationResponse(LocationBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
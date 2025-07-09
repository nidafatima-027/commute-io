from pydantic import BaseModel
from typing import Optional
from datetime import time


class ScheduleBase(BaseModel):
    day_of_week: int  # 0=Monday, 6=Sunday
    start_time: Optional[time] = None
    end_time: Optional[time] = None


class ScheduleCreate(ScheduleBase):
    pass


class ScheduleResponse(ScheduleBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MessageBase(BaseModel):
    receiver_id: int
    content: str
    ride_id: Optional[int] = None


class MessageCreate(MessageBase):
    pass


class MessageResponse(MessageBase):
    id: int
    sender_id: int
    sent_at: datetime

    class Config:
        from_attributes = True


class ConversationResponse(BaseModel):
    user_id: int
    user_name: str
    user_photo: Optional[str] = None
    last_message: str
    last_message_time: datetime
    unread_count: int
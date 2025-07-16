from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum


class GenderPreference(str, Enum):
    NO_PREFERENCE = "No preference"
    MALE_ONLY = "Male only"
    FEMALE_ONLY = "Female only"


class MusicPreference(str, Enum):
    NO_MUSIC = "No music"
    LIGHT_MUSIC = "Light music"
    LOUD_MUSIC = "Loud music"
    USER_CAN_CHOOSE = "User can choose"


class ConversationPreference(str, Enum):
    SILENT_RIDE = "Silent ride"
    TALKATIVE_RIDE = "Talkative ride"
    NO_PREFERENCE = "No preference"


class SmokingPreference(str, Enum):
    REQUIRED = "Required"
    PREFERRED = "Preferred"
    NOT_REQUIRED = "Not required"


class UserPreferences(BaseModel):
    gender_preference: Optional[GenderPreference] = GenderPreference.NO_PREFERENCE
    music_preference: Optional[MusicPreference] = MusicPreference.USER_CAN_CHOOSE
    conversation_preference: Optional[ConversationPreference] = ConversationPreference.NO_PREFERENCE
    smoking_preference: Optional[SmokingPreference] = SmokingPreference.NOT_REQUIRED


class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    bio: Optional[str] = None
    is_driver: Optional[bool] = None
    is_rider: Optional[bool] = None
    preferences: Optional[str] = None
    preferences: Optional[UserPreferences] = None

class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    is_driver: Optional[bool] = None
    is_rider: Optional[bool] = None
    preferences: Optional[UserPreferences] = None
    photo_url: Optional[str] = None


class UserResponse(UserBase):
    id: int
    photo_url: Optional[str] = None
    trust_score: float
    created_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserRegister(UserBase):
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    is_new_user: bool 
    user: UserResponse


class TokenData(BaseModel):
    email: Optional[str] = None


class OTPRequest(BaseModel):
    email: EmailStr


class OTPVerify(BaseModel):
    email: EmailStr
    otp: str
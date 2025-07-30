from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status
from app.core.config import settings
import random
import string

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def verify_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        # Return the entire payload, not just email
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def generate_otp() -> str:
    return ''.join(random.choices(string.digits, k=6))


# In-memory OTP storage (use Redis in production)
otp_storage = {}


def store_otp(email: str, otp: str):
    otp_storage[email] = {
        "otp": otp,
        "expires_at": datetime.utcnow() + timedelta(minutes=5)
    }

def store_mobile_otp(phone: str, otp: str):
    otp_storage[phone] = {
        "otp": otp,
        "expires_at": datetime.utcnow() + timedelta(minutes=5)
    }


def verify_otp(email: str, otp: str) -> bool:
    if email not in otp_storage:
        return False
    
    stored_data = otp_storage[email]
    if datetime.utcnow() > stored_data["expires_at"]:
        del otp_storage[email]
        return False
    
    if stored_data["otp"] == otp:
        del otp_storage[email]
        return True
    
    return False

def verify_mobile_otp(phone: str, otp: str) -> bool:
    if phone not in otp_storage:
        return False
    
    stored_data = otp_storage[phone]
    if datetime.utcnow() > stored_data["expires_at"]:
        del otp_storage[phone]
        return False
    
    if stored_data["otp"] == otp:
        del otp_storage[phone]
        return True
    
    return False
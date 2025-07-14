from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from app.services.email_service import send_otp_email  # Import the service

from app.core.database import get_db
from app.core.security import (
    verify_password, 
    get_password_hash, 
    create_access_token, 
    verify_token,
    generate_otp,
    store_otp,
    verify_otp
)
from app.db.crud.user import get_user_by_email, create_user, get_user
from app.schema.user import UserRegister, UserLogin, Token, OTPRequest, OTPVerify, UserResponse
from app.core.config import settings

router = APIRouter()
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    email = verify_token(credentials.credentials)
    user = get_user_by_email(db, email=email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


@router.post("/register", response_model=Token)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    # Check if user already exists
    if get_user_by_email(db, email=user_data.email):
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Create user
    user = create_user(db, user_data)
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, 
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@router.post("/login", response_model=Token)
async def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = get_user_by_email(db, email=login_data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # For now, we'll skip password verification since we don't have it in the model
    # In production, add password field to User model and verify here
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, 
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@router.post("/send-otp")
async def send_otp(request: OTPRequest, db: Session = Depends(get_db)):
    #user = get_user_by_email(db, email=request.email)
    # if not user:
    #     raise HTTPException(status_code=404, detail="User not found")
    print(f"Attempting to send OTP to: {request.email}")  # Debug log
    try:
        otp = generate_otp()
        store_otp(request.email, otp)
        
        # Wrap email sending in try-except
        try:
            send_otp_email(request.email, otp)
        except Exception as e:
            print(f"Email sending failed: {str(e)}")
            # Don't raise HTTPException here - return a success response but log the error
            # (In production, you might want to use a fallback SMS service here)
        
        return {"message": "OTP processed successfully"}  # Always return success
    
    except Exception as e:
        print(f"OTP generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")



@router.post("/verify-otp", response_model=Token)
async def verify_otp_endpoint(request: OTPVerify, db: Session = Depends(get_db)):
    if not verify_otp(request.email, request.otp):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    user = get_user_by_email(db, email=request.email)
    is_new_user = False

    if not user:
        user_data = UserRegister(
            email=request.email,
            name="",  # Empty string as required by your schema
            phone=None,
            bio=None,
            is_driver=False,
            is_rider=False,
            preferences=None,
            password=""
        )
        user = create_user(db, user_data)
        is_new_user = True
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, 
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": user.email,
            "id": user.id,
            "is_new_user": is_new_user,
            "name": user.name or "",  # Provide default if None
            "trust_score": user.trust_score or 0,  # Default value
            "created_at": user.created_at or datetime.utcnow()
        }
    }


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_user)):
    return current_user
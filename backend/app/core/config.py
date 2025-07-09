from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from typing import List
import os


class Settings(BaseSettings):
    model_config = ConfigDict(env_file=".env", extra='ignore')
    
    # Database
    DATABASE_URL: str = "postgresql://username:password@localhost:5432/commute_io"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # Email
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    
    # CORS
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # Frontend URL
    FRONTEND_URL: str = "http://localhost:8081"
    
    # Environment
    ENVIRONMENT: str = "development"


settings = Settings()
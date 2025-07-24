import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)

def send_otp_mobile(phone_number: str, otp: str):
    """Send OTP via SMS (using Twilio as example provider)"""
    try:
        # For development, we'll just log the OTP instead of sending SMS
        if settings.ENVIRONMENT == "development":
            logger.info(f"Development Mode - OTP for {phone_number}: {otp}")
            print(f"🔐 OTP for {phone_number}: {otp}")
            return
        
        # Check if Twilio credentials are configured
        if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN or not settings.TWILIO_PHONE_NUMBER:
            logger.warning("Twilio credentials not configured, logging OTP instead")
            print(f"🔐 OTP for {phone_number}: {otp}")
            return
            
        # Send SMS using Twilio
        from twilio.rest import Client
        
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        
        message = client.messages.create(
            body=f"Your Commute.io verification code is: {otp}. This code expires in 10 minutes.",
            from_=settings.TWILIO_PHONE_NUMBER,
            to=phone_number
        )
        
        logger.info(f"OTP SMS sent successfully to {phone_number}. Message SID: {message.sid}")
        
    except Exception as e:
        logger.error(f"Failed to send OTP SMS to {phone_number}: {str(e)}")
        # In development, don't fail - just log the OTP
        if settings.ENVIRONMENT == "development":
            print(f"🔐 SMS failed, but here's your OTP for {phone_number}: {otp}")
        else:
            raise HTTPException(
                status_code=500,
                detail="Failed to send OTP SMS"
            )
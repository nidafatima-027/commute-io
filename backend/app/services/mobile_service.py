import requests
import logging
from app.core.config import settings
from fastapi import HTTPException

logger = logging.getLogger(__name__)

# UltraMsg Configuration
ULTRAMSG_INSTANCE_ID = "instance136155"
ULTRAMSG_TOKEN = "ei1cosyqzpniy68i"
ULTRAMSG_API_URL = f"https://api.ultramsg.com/{ULTRAMSG_INSTANCE_ID}/messages/chat"

def send_otp_mobile(phone_number: str, otp: str):
    """Send OTP via WhatsApp using UltraMsg API"""
    try:
        # Validate Pakistani phone number format
        if not phone_number.startswith('+92'):
            logger.error(f"Invalid phone number format: {phone_number}. Must start with +92")
            raise HTTPException(
                status_code=400,
                detail="Invalid phone number format. Must be a Pakistani number (+92)"
            )
        
        # For development mode, log OTP and try to send WhatsApp
        if settings.ENVIRONMENT == "development":
            print(f"🔐 Development Mode - OTP for {phone_number}: {otp}")
            logger.info(f"Development Mode - OTP for {phone_number}: {otp}")
        
        # Prepare WhatsApp message
        message_body = f"Your Commute.io verification code is: {otp}\n\nThis code will expire in 5 minutes.\n\nIf you didn't request this code, please ignore this message.\n\nBest regards,\nCommute.io Team"
        
        # UltraMsg API payload
        payload = {
            "token": ULTRAMSG_TOKEN,
            "to": phone_number,
            "body": message_body
        }
        
        # Send WhatsApp message
        response = requests.post(ULTRAMSG_API_URL, json=payload, timeout=30)
        
        if response.status_code == 200:
            response_data = response.json()
            if response_data.get("sent"):
                logger.info(f"WhatsApp OTP sent successfully to {phone_number}")
                print(f"✅ WhatsApp OTP sent to {phone_number}: {otp}")
            else:
                logger.error(f"WhatsApp API error: {response_data}")
                print(f"🔐 WhatsApp failed, but here's your OTP for {phone_number}: {otp}")
                # In development, don't fail - just log the OTP
                if settings.ENVIRONMENT == "development":
                    return
                else:
                    raise HTTPException(
                        status_code=500,
                        detail="Failed to send WhatsApp OTP"
                    )
        else:
            logger.error(f"WhatsApp API request failed: {response.status_code} - {response.text}")
            print(f"🔐 WhatsApp failed, but here's your OTP for {phone_number}: {otp}")
            # In development, don't fail - just log the OTP
            if settings.ENVIRONMENT == "development":
                return
            else:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to send WhatsApp OTP"
                )
        
    except requests.exceptions.Timeout:
        logger.error(f"WhatsApp API timeout for {phone_number}")
        print(f"🔐 WhatsApp timeout, but here's your OTP for {phone_number}: {otp}")
        if settings.ENVIRONMENT == "development":
            return
        else:
            raise HTTPException(
                status_code=500,
                detail="WhatsApp service timeout"
            )
    except requests.exceptions.RequestException as e:
        logger.error(f"WhatsApp API request error for {phone_number}: {str(e)}")
        print(f"🔐 WhatsApp failed, but here's your OTP for {phone_number}: {otp}")
        if settings.ENVIRONMENT == "development":
            return
        else:
            raise HTTPException(
                status_code=500,
                detail="Failed to send WhatsApp OTP"
            )
    except Exception as e:
        logger.error(f"Unexpected error sending WhatsApp OTP to {phone_number}: {str(e)}")
        print(f"🔐 WhatsApp failed, but here's your OTP for {phone_number}: {otp}")
        if settings.ENVIRONMENT == "development":
            return
        else:
            raise HTTPException(
                status_code=500,
                detail="Internal server error"
            )
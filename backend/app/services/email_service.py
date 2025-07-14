# app/services/email_service.py
from mailjet_rest import Client
from app.core.config import settings
from fastapi import HTTPException

def send_otp_email(email: str, otp: str):
    """Send OTP via Mailjet"""
    mailjet = Client(
        auth=(settings.MAILJET_API_KEY, settings.MAILJET_SECRET_KEY),
        version='v3.1'
    )
    
    data = {
        'Messages': [{
            "From": {"Email": settings.MAILJET_SENDER_EMAIL, "Name": "Your App"},
            "To": [{"Email": email}],
            "Subject": "Your OTP Code",
            "HTMLPart": f"<p>Your OTP is: <strong>{otp}</strong></p>"
        }]
    }
    
    response = mailjet.send.create(data=data)
    if response.status_code != 200:
        raise HTTPException(
            status_code=500,
            detail=f"Email failed: {response.json().get('ErrorMessage', 'Unknown error')}"
        )
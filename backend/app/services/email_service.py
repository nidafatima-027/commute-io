import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)

def send_otp_email(email: str, otp: str):
    """Send OTP via SMTP (Gmail fallback)"""
    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = settings.SMTP_USERNAME
        msg['To'] = email
        msg['Subject'] = "Your Commute.io OTP Code"
        
        # Email body
        body = f"""
        <html>
        <body>
            <h2>Your OTP Code</h2>
            <p>Your verification code is: <strong style="font-size: 24px; color: #4ECDC4;">{otp}</strong></p>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <br>
            <p>Best regards,<br>Commute.io Team</p>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(body, 'html'))
        
        # For development, we'll just log the OTP instead of sending email
        if settings.ENVIRONMENT == "development":
            logger.info(f"Development Mode - OTP for {email}: {otp}")
            print(f"🔐 OTP for {email}: {otp}")
            return
        
        # Production email sending
        if not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
            logger.warning("SMTP credentials not configured, logging OTP instead")
            print(f"🔐 OTP for {email}: {otp}")
            return
            
        # Send email
        server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        text = msg.as_string()
        server.sendmail(settings.SMTP_USERNAME, email, text)
        server.quit()
        
        logger.info(f"OTP email sent successfully to {email}")
        
    except Exception as e:
        logger.error(f"Failed to send OTP email to {email}: {str(e)}")
        # In development, don't fail - just log the OTP
        if settings.ENVIRONMENT == "development":
            print(f"🔐 Email failed, but here's your OTP for {email}: {otp}")
        else:
            raise HTTPException(
                status_code=500,
                detail="Failed to send OTP email"
            )
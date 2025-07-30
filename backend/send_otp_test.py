#!/usr/bin/env python3
"""
Test script to send OTP to specific phone number
"""

import requests
import json
import random
import string

# UltraMsg Configuration
ULTRAMSG_INSTANCE_ID = "instance136155"
ULTRAMSG_TOKEN = "ei1cosyqzpniy68i"
ULTRAMSG_API_URL = f"https://api.ultramsg.com/{ULTRAMSG_INSTANCE_ID}/messages/chat"

def generate_otp() -> str:
    """Generate a 6-digit OTP"""
    return ''.join(random.choices(string.digits, k=6))

def send_otp_to_number(phone_number: str):
    """Send OTP to specific phone number"""
    
    # Generate OTP
    otp = generate_otp()
    
    # Prepare WhatsApp message
    message_body = f"Your Commute.io verification code is: {otp}\n\nThis code will expire in 5 minutes.\n\nIf you didn't request this code, please ignore this message.\n\nBest regards,\nCommute.io Team"
    
    # UltraMsg API payload
    payload = {
        "token": ULTRAMSG_TOKEN,
        "to": phone_number,
        "body": message_body
    }
    
    print(f"Sending OTP to: {phone_number}")
    print(f"Generated OTP: {otp}")
    print(f"Message: {message_body}")
    print("-" * 50)
    
    try:
        # Send WhatsApp message
        response = requests.post(ULTRAMSG_API_URL, json=payload, timeout=30)
        
        print(f"Response Status: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"Response JSON: {json.dumps(response_data, indent=2)}")
            
            if response_data.get("sent"):
                print("✅ WhatsApp OTP sent successfully!")
                print(f"📱 OTP '{otp}' sent to {phone_number}")
            else:
                print("❌ WhatsApp API returned success but message not sent")
                print(f"Error: {response_data}")
        else:
            print(f"❌ HTTP Error: {response.status_code}")
            
    except requests.exceptions.Timeout:
        print("❌ Request timeout")
    except requests.exceptions.RequestException as e:
        print(f"❌ Request error: {str(e)}")
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")

if __name__ == "__main__":
    # Send OTP to the specific number
    phone_number = "+923363109779"
    send_otp_to_number(phone_number) 
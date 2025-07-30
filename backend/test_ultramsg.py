#!/usr/bin/env python3
"""
Test script for UltraMsg WhatsApp integration
"""

import requests
import json

# UltraMsg Configuration
ULTRAMSG_INSTANCE_ID = "instance136155"
ULTRAMSG_TOKEN = "ei1cosyqzpniy68i"
ULTRAMSG_API_URL = f"https://api.ultramsg.com/{ULTRAMSG_INSTANCE_ID}/messages/chat"

def test_ultramsg_whatsapp():
    """Test UltraMsg WhatsApp API"""
    
    # Test phone number (replace with your test number)
    test_phone = "+923001234567"  # Replace with actual test number
    test_otp = "123456"
    
    # Prepare WhatsApp message
    message_body = f"Your Commute.io verification code is: {test_otp}\n\nThis code will expire in 5 minutes.\n\nIf you didn't request this code, please ignore this message.\n\nBest regards,\nCommute.io Team"
    
    # UltraMsg API payload
    payload = {
        "token": ULTRAMSG_TOKEN,
        "to": test_phone,
        "body": message_body
    }
    
    print(f"Testing UltraMsg WhatsApp API...")
    print(f"Instance ID: {ULTRAMSG_INSTANCE_ID}")
    print(f"Token: {ULTRAMSG_TOKEN}")
    print(f"Phone: {test_phone}")
    print(f"Message: {message_body}")
    print(f"API URL: {ULTRAMSG_API_URL}")
    print("-" * 50)
    
    try:
        # Send WhatsApp message
        response = requests.post(ULTRAMSG_API_URL, json=payload, timeout=30)
        
        print(f"Response Status: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"Response JSON: {json.dumps(response_data, indent=2)}")
            
            if response_data.get("sent"):
                print("✅ WhatsApp message sent successfully!")
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
    test_ultramsg_whatsapp() 
#!/usr/bin/env python3
"""
Simple test to simulate frontend sending phone number to backend
"""

import requests
import json

def test_phone_otp_flow(phone_number: str):
    """Test the complete phone OTP flow"""
    
    print(f"📱 Testing Phone OTP Flow for: {phone_number}")
    print("=" * 50)
    
    # Step 1: Send OTP request (simulating frontend)
    print("1️⃣ Sending OTP request to backend...")
    
    url = "http://localhost:8000/api/auth/send-mobile-otp"
    payload = {"phone": phone_number}
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        
        print(f"📡 Status: {response.status_code}")
        print(f"📝 Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ OTP request successful!")
            print("🔍 Check backend console for OTP log message")
            print("📱 Check WhatsApp for the OTP message")
            
            # Step 2: Ask for OTP to test verification
            print("\n2️⃣ Testing OTP verification...")
            otp = input("🔢 Enter the OTP you received: ").strip()
            
            if otp:
                # Test OTP verification
                verify_url = "http://localhost:8000/api/auth/verify-mobile-otp"
                verify_payload = {"phone": phone_number, "otp": otp}
                
                verify_response = requests.post(verify_url, json=verify_payload, timeout=10)
                
                print(f"📡 Verification Status: {verify_response.status_code}")
                print(f"📝 Verification Response: {verify_response.text}")
                
                if verify_response.status_code == 200:
                    print("✅ OTP verification successful!")
                    data = verify_response.json()
                    if 'access_token' in data:
                        print(f"🔑 Access Token: {data['access_token'][:30]}...")
                    if 'is_new_user' in data:
                        print(f"👤 New User: {data['is_new_user']}")
                else:
                    print("❌ OTP verification failed")
            else:
                print("⏭️ Skipping OTP verification")
        else:
            print("❌ OTP request failed")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend server")
        print("💡 Make sure backend is running: cd backend && python run_server.py")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    # Test with your phone number
    phone = "+923363109779"
    test_phone_otp_flow(phone) 
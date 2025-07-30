#!/usr/bin/env python3
"""
Test script to simulate frontend sending phone number to backend API
"""

import requests
import json

# Backend API URL (assuming it's running on localhost:8000)
BACKEND_URL = "http://localhost:8000"

def test_send_mobile_otp(phone_number: str):
    """Test the /auth/send-mobile-otp endpoint"""
    
    # API endpoint
    endpoint = f"{BACKEND_URL}/auth/send-mobile-otp"
    
    # Request payload (same as frontend would send)
    payload = {
        "phone": phone_number
    }
    
    print(f"🧪 Testing Frontend -> Backend Flow")
    print(f"📱 Phone Number: {phone_number}")
    print(f"🌐 API Endpoint: {endpoint}")
    print(f"📦 Request Payload: {json.dumps(payload, indent=2)}")
    print("-" * 50)
    
    try:
        # Send POST request (simulating frontend)
        response = requests.post(endpoint, json=payload, timeout=30)
        
        print(f"📡 Response Status: {response.status_code}")
        print(f"📄 Response Headers: {dict(response.headers)}")
        print(f"📝 Response Body: {response.text}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"✅ Success! Backend processed the request")
            print(f"📋 Response: {json.dumps(response_data, indent=2)}")
            
            # Check if OTP was sent (in development mode, it should be logged)
            print(f"\n🔍 Check the backend console for OTP log message:")
            print(f"   Format: '🔐 WhatsApp OTP for {phone_number}: XXXXXX'")
            
        else:
            print(f"❌ Error: {response.status_code}")
            try:
                error_data = response.json()
                print(f"📋 Error Details: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📋 Error Text: {response.text}")
                
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Backend server not running")
        print("💡 Make sure to start the backend server with: python run_server.py")
    except requests.exceptions.Timeout:
        print("❌ Request timeout")
    except requests.exceptions.RequestException as e:
        print(f"❌ Request error: {str(e)}")
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")

def test_verify_mobile_otp(phone_number: str, otp: str):
    """Test the /auth/verify-mobile-otp endpoint"""
    
    # API endpoint
    endpoint = f"{BACKEND_URL}/auth/verify-mobile-otp"
    
    # Request payload
    payload = {
        "phone": phone_number,
        "otp": otp
    }
    
    print(f"\n🧪 Testing OTP Verification")
    print(f"📱 Phone Number: {phone_number}")
    print(f"🔢 OTP: {otp}")
    print(f"🌐 API Endpoint: {endpoint}")
    print(f"📦 Request Payload: {json.dumps(payload, indent=2)}")
    print("-" * 50)
    
    try:
        # Send POST request
        response = requests.post(endpoint, json=payload, timeout=30)
        
        print(f"📡 Response Status: {response.status_code}")
        print(f"📝 Response Body: {response.text}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"✅ Success! User authenticated")
            print(f"📋 Response: {json.dumps(response_data, indent=2)}")
            
            # Extract important fields
            if 'access_token' in response_data:
                print(f"🔑 Access Token: {response_data['access_token'][:50]}...")
            if 'is_new_user' in response_data:
                print(f"👤 New User: {response_data['is_new_user']}")
            if 'auth_method' in response_data:
                print(f"🔐 Auth Method: {response_data['auth_method']}")
                
        else:
            print(f"❌ Error: {response.status_code}")
            try:
                error_data = response.json()
                print(f"📋 Error Details: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📋 Error Text: {response.text}")
                
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Backend server not running")
    except requests.exceptions.Timeout:
        print("❌ Request timeout")
    except requests.exceptions.RequestException as e:
        print(f"❌ Request error: {str(e)}")
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")

if __name__ == "__main__":
    # Test phone number (you can change this)
    test_phone = "+923363109779"
    
    print("🚀 Testing Complete Frontend -> Backend Flow")
    print("=" * 60)
    
    # Step 1: Send OTP
    test_send_mobile_otp(test_phone)
    
    # Step 2: Ask user for OTP to test verification
    print(f"\n📝 To test OTP verification, enter the OTP you received:")
    print(f"   (Check backend console or WhatsApp for the OTP)")
    otp = input("🔢 Enter OTP: ").strip()
    
    if otp:
        test_verify_mobile_otp(test_phone, otp)
    else:
        print("⏭️ Skipping OTP verification test")
    
    print("\n✅ Test completed!") 
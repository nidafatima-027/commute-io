#!/usr/bin/env python3
"""
Quick test script for phone OTP flow
"""

import requests
import json

def quick_test():
    """Quick test of the phone OTP flow"""
    
    phone = "+923363109779"  # Your phone number
    
    print("🚀 Quick Phone OTP Test")
    print("=" * 40)
    
    # Test 1: Send OTP
    print(f"📱 Sending OTP to: {phone}")
    
    try:
        response = requests.post(
            "http://localhost:8000/api/auth/send-mobile-otp",
            json={"phone": phone},
            timeout=10
        )
        
        print(f"📡 Status: {response.status_code}")
        print(f"📝 Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ OTP sent successfully!")
            print("📱 Check your WhatsApp for the OTP")
            print("🔍 Check backend console for OTP log")
            
            # Test 2: Verify OTP (you'll need to enter the OTP manually)
            print("\n🔢 To test verification, enter the OTP you received:")
            otp = input("OTP: ").strip()
            
            if otp:
                verify_response = requests.post(
                    "http://localhost:8000/api/auth/verify-mobile-otp",
                    json={"phone": phone, "otp": otp},
                    timeout=10
                )
                
                print(f"📡 Verification Status: {verify_response.status_code}")
                print(f"📝 Verification Response: {verify_response.text}")
                
                if verify_response.status_code == 200:
                    print("✅ OTP verification successful!")
                else:
                    print("❌ OTP verification failed")
            else:
                print("⏭️ Skipping verification test")
        else:
            print("❌ OTP sending failed")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend server")
        print("💡 Make sure to run: cd backend && python run_server.py")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    quick_test() 
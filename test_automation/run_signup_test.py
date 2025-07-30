#!/usr/bin/env python3
"""
Simple test runner for Signup Flow tests.
This tests the navigation from Get Started to signup screen and the email/phone options.
"""
import os
import sys
import subprocess
from pathlib import Path


def main():
    """Run the signup flow test."""
    print("🚀 Commute.io - Signup Flow Test")
    print("=" * 50)
    
    # Ensure we're in the test_automation directory
    script_dir = Path(__file__).parent
    if not os.getcwd().endswith('test_automation'):
        os.chdir(script_dir)
    
    print("1. Checking prerequisites...")
    
    # Check if setup has been run
    if not Path("config/config.yaml").exists():
        print("❌ Configuration not found. Please run setup first:")
        print("   python setup_test_environment.py")
        return False
    
    # Check if signup_flow.feature exists
    if not Path("features/signup_flow.feature").exists():
        print("❌ Signup flow feature file not found")
        return False
    
    print("✅ Prerequisites check passed")
    
    print("\n2. Running Signup Flow test...")
    print("   This will test:")
    print("   - Navigation from Get Started to signup screen")
    print("   - Continue with email button")
    print("   - Continue with phone button")
    print("   - Navigation to email input screen")
    print("   - Navigation to phone input screen")
    
    try:
        # Run the test with pretty format for clear output
        cmd = [
            sys.executable, "run_tests.py",
            "--feature", "signup_flow.feature",
            "--format", "pretty"
        ]
        
        print(f"\nExecuting: {' '.join(cmd)}")
        print("-" * 50)
        
        result = subprocess.run(cmd)
        
        print("-" * 50)
        if result.returncode == 0:
            print("✅ Signup flow test completed successfully!")
            print("\nNext steps:")
            print("1. Test email authentication: Create email_auth.feature")
            print("2. Test phone authentication: Create phone_auth.feature")
            print("3. Test OTP verification: Create otp_verification.feature")
            print("4. Test profile setup: Create profile_setup.feature")
        else:
            print("❌ Signup flow test failed!")
            print("\nTroubleshooting:")
            print("1. Check if Expo server is running: npm start")
            print("2. Check if Appium server is running: appium --port 4723")
            print("3. Check if device is connected: adb devices")
            print("4. Check if app is loaded in Expo Go")
            print("5. Run setup again: python setup_test_environment.py")
            print("6. Check the screenshots for visual clues")
        
        return result.returncode == 0
        
    except Exception as e:
        print(f"❌ Error running test: {str(e)}")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
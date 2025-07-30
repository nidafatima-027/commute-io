#!/usr/bin/env python3
"""
Test runner for complete email authentication flow.
"""
import os
import sys
import subprocess
from pathlib import Path


def main():
    """Run the complete email authentication flow test."""
    print("🚀 Commute.io - Email Authentication Flow Test")
    print("=" * 55)
    
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
    
    # Check if email_authentication_flow.feature exists
    if not Path("features/email_authentication_flow.feature").exists():
        print("❌ Email authentication flow feature file not found")
        return False
    
    print("✅ Prerequisites check passed")
    
    print("\n2. Running Complete Email Authentication Flow...")
    print("   This will test the entire email flow:")
    print("   📱 Onboarding → Get Started")
    print("   📝 Signup → Continue with Email")
    print("   📧 Email Input → Continue")
    print("   🔐 OTP Verification → Verify")
    print("   👤 Profile Setup → Continue")
    print("   🏠 Main Dashboard")
    
    try:
        # Run the test with pretty format for clear output
        cmd = [
            sys.executable, "run_tests.py",
            "--feature", "email_authentication_flow.feature",
            "--format", "pretty"
        ]
        
        print(f"\nExecuting: {' '.join(cmd)}")
        print("-" * 55)
        
        result = subprocess.run(cmd)
        
        print("-" * 55)
        if result.returncode == 0:
            print("✅ Email authentication flow completed successfully!")
            print("\n🎉 Complete user journey tested!")
            print("\n📋 Test Summary:")
            print("   ✅ Onboarding screen validation")
            print("   ✅ Navigation to signup screen")
            print("   ✅ Continue with email button tap")
            print("   ✅ Email input screen navigation")
            print("   ✅ OTP verification screen navigation")
            print("   ✅ Profile setup screen navigation")
            print("   ✅ Main dashboard access")
            print("\nNext steps:")
            print("1. Test error scenarios: python run_tests.py --tags @error_handling")
            print("2. Test profile validation: python run_tests.py --tags @profile_validation")
            print("3. Run all email flow tests: python run_tests.py --tags @email_flow")
        else:
            print("❌ Email authentication flow failed!")
            print("\n🔍 Troubleshooting:")
            print("1. Check if Expo server is running: npm start")
            print("2. Check if device is connected: adb devices")
            print("3. Check if app is loaded in Expo Go")
            print("4. Verify button locators match your app")
            print("5. Check the screenshots for visual clues")
            print("6. Review the debug output above")
        
        return result.returncode == 0
        
    except Exception as e:
        print(f"❌ Error running tests: {str(e)}")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
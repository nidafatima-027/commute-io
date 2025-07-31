#!/usr/bin/env python3
"""
Test runner for Complete User Flow tests.
This tests the entire user journey from onboarding to main app.
"""
import os
import sys
import subprocess
from pathlib import Path


def main():
    """Run the complete user flow test."""
    print("🚀 Commute.io - Complete User Flow Test")
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
    
    # Check if complete_user_flow.feature exists
    if not Path("features/complete_user_flow.feature").exists():
        print("❌ Complete user flow feature file not found")
        return False
    
    print("✅ Prerequisites check passed")
    
    print("\n2. Running Complete User Flow test...")
    print("   This will test:")
    print("   - Complete email authentication flow")
    print("   - Complete phone authentication flow")
    print("   - Profile setup process")
    print("   - Validation error handling")
    print("   - OTP verification")
    print("   - Navigation between screens")
    print("   - Accessibility features")
    
    try:
        # Run the test with pretty format for clear output
        cmd = [
            sys.executable, "run_tests.py",
            "--feature", "complete_user_flow.feature",
            "--format", "pretty"
        ]
        
        print(f"\nExecuting: {' '.join(cmd)}")
        print("-" * 50)
        
        result = subprocess.run(cmd)
        
        print("-" * 50)
        if result.returncode == 0:
            print("✅ Complete user flow test completed successfully!")
            print("\n🎉 All user flows are working correctly!")
            print("\nNext steps:")
            print("1. Test specific flows: python run_tests.py --tags @email")
            print("2. Test phone flow: python run_tests.py --tags @phone")
            print("3. Test validation: python run_tests.py --tags @validation")
            print("4. Run all tests: python run_tests.py --regression")
        else:
            print("❌ Complete user flow test failed!")
            print("\nTroubleshooting:")
            print("1. Check if Expo server is running: npm start")
            print("2. Check if Appium server is running: appium --port 4723")
            print("3. Check if device is connected: adb devices")
            print("4. Check if app is loaded in Expo Go")
            print("5. Run setup again: python setup_test_environment.py")
            print("6. Check the screenshots for visual clues")
            print("7. Try individual tests first:")
            print("   - python run_get_started_test.py")
            print("   - python run_signup_test.py")
        
        return result.returncode == 0
        
    except Exception as e:
        print(f"❌ Error running test: {str(e)}")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
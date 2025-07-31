#!/usr/bin/env python3
"""
Simple test runner for Navigation Flow tests.
This tests the basic navigation from Get Started to signup to email/phone screens.
"""
import os
import sys
import subprocess
from pathlib import Path


def main():
    """Run the navigation flow test."""
    print("🚀 Commute.io - Navigation Flow Test")
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
    
    # Check if navigation_test.feature exists
    if not Path("features/navigation_test.feature").exists():
        print("❌ Navigation test feature file not found")
        return False
    
    print("✅ Prerequisites check passed")
    
    print("\n2. Running Navigation Flow test...")
    print("   This will test:")
    print("   - Navigation from Get Started to signup screen")
    print("   - Navigation to email input screen")
    print("   - Navigation to phone input screen")
    
    try:
        # Run the test with pretty format for clear output
        cmd = [
            sys.executable, "run_tests.py",
            "--feature", "navigation_test.feature",
            "--format", "pretty"
        ]
        
        print(f"\nExecuting: {' '.join(cmd)}")
        print("-" * 50)
        
        result = subprocess.run(cmd)
        
        print("-" * 50)
        if result.returncode == 0:
            print("✅ Navigation flow test completed successfully!")
            print("\n🎉 Navigation flow is working correctly!")
            print("\nNext steps:")
            print("1. Test complete user flow: python run_complete_flow_test.py")
            print("2. Test specific flows: python run_tests.py --tags @email")
            print("3. Test phone flow: python run_tests.py --tags @phone")
        else:
            print("❌ Navigation flow test failed!")
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
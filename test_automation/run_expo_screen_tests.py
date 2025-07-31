#!/usr/bin/env python3
"""
Test runner for Expo Go screen tests using direct navigation.
"""
import os
import sys
import subprocess
from pathlib import Path


def main():
    """Run the Expo Go screen tests."""
    print("🚀 Commute.io - Expo Go Screen Tests")
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
    
    # Check if expo_screen_tests.feature exists
    if not Path("features/expo_screen_tests.feature").exists():
        print("❌ Expo screen tests feature file not found")
        return False
    
    print("✅ Prerequisites check passed")
    
    print("\n2. Running Expo Go Screen Tests...")
    print("   This will test individual screens using direct navigation:")
    print("   - Signup screen")
    print("   - Email input screen")
    print("   - Phone input screen")
    print("   - OTP verification screen")
    print("   - Profile setup screen")
    
    try:
        # Run the test with pretty format for clear output
        cmd = [
            sys.executable, "run_tests.py",
            "--feature", "expo_screen_tests.feature",
            "--format", "pretty"
        ]
        
        print(f"\nExecuting: {' '.join(cmd)}")
        print("-" * 50)
        
        result = subprocess.run(cmd)
        
        print("-" * 50)
        if result.returncode == 0:
            print("✅ Expo Go screen tests completed successfully!")
            print("\n🎉 All screens are working correctly!")
            print("\nNext steps:")
            print("1. Test specific screens: python run_tests.py --tags @expo")
            print("2. Test signup flow: python run_tests.py --tags @signup")
            print("3. Test email flow: python run_tests.py --tags @email")
            print("4. Test phone flow: python run_tests.py --tags @phone")
        else:
            print("❌ Expo Go screen tests failed!")
            print("\nTroubleshooting:")
            print("1. Check if Expo server is running: npm start")
            print("2. Check if device is connected: adb devices")
            print("3. Check if app is loaded in Expo Go")
            print("4. Verify deep linking URLs in your app")
            print("5. Check the screenshots for visual clues")
        
        return result.returncode == 0
        
    except Exception as e:
        print(f"❌ Error running tests: {str(e)}")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
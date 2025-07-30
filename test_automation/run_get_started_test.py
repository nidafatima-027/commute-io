#!/usr/bin/env python3
"""
Simple test runner for Get Started page tests.
This is the recommended starting point for testing the Commute.io app.
"""
import os
import sys
import subprocess
from pathlib import Path


def main():
    """Run the Get Started page test."""
    print("🚀 Commute.io - Get Started Page Test")
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
    
    # Check if get_started.feature exists
    if not Path("features/get_started.feature").exists():
        print("❌ Get Started feature file not found")
        return False
    
    print("✅ Prerequisites check passed")
    
    print("\n2. Running Get Started page test...")
    print("   This will test:")
    print("   - App title 'Commute_io'")
    print("   - Welcome message 'Carpooling made easy'")
    print("   - Get Started button")
    print("   - Navigation to signup screen")
    print("   - Accessibility features")
    
    try:
        # Run the test with pretty format for clear output
        cmd = [
            sys.executable, "run_tests.py",
            "--feature", "get_started.feature",
            "--format", "pretty"
        ]
        
        print(f"\nExecuting: {' '.join(cmd)}")
        print("-" * 50)
        
        result = subprocess.run(cmd)
        
        print("-" * 50)
        if result.returncode == 0:
            print("✅ Get Started page test completed successfully!")
            print("\nNext steps:")
            print("1. Test navigation flows: python run_tests.py --feature onboarding.feature")
            print("2. Test authentication: python run_tests.py --auth")
            print("3. Run all tests: python run_tests.py --regression")
        else:
            print("❌ Get Started page test failed!")
            print("\nTroubleshooting:")
            print("1. Check if Expo server is running: npm start")
            print("2. Check if Appium server is running: appium --port 4723")
            print("3. Check if device is connected: adb devices")
            print("4. Check if app is loaded in Expo Go")
            print("5. Run setup again: python setup_test_environment.py")
        
        return result.returncode == 0
        
    except Exception as e:
        print(f"❌ Error running test: {str(e)}")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
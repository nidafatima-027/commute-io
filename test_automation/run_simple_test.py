#!/usr/bin/env python3
"""
Simple test runner without Allure complications.
"""
import subprocess
import sys
import os

def run_simple_test():
    """Run a simple smoke test without Allure."""
    print("🚀 Running Simple Smoke Test")
    print("=" * 40)
    
    # Simple behave command without complex formatting
    cmd = [
        sys.executable, "-m", "behave",
        "--tags", "@smoke",
        "-f", "pretty",
        "--no-capture",
        "--show-timings"
    ]
    
    print(f"Running: {' '.join(cmd)}")
    print("=" * 40)
    
    try:
        result = subprocess.run(cmd)
        return result.returncode == 0
    except Exception as e:
        print(f"Error running test: {str(e)}")
        return False

def main():
    """Main function."""
    print("🧪 Simple Test Runner for Expo Go")
    print("=" * 50)
    print("Make sure:")
    print("1. ✅ Appium server is running (appium --port 4723)")
    print("2. ✅ Your device is connected")
    print("3. ✅ Expo Go is installed and your app is loaded")
    print("4. ✅ Your app is on the main screen")
    print("=" * 50)
    
    success = run_simple_test()
    
    if success:
        print("\n🎉 Test completed successfully!")
    else:
        print("\n❌ Test failed - but this is expected for the first run")
        print("We may need to adjust element locators for your specific app UI")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
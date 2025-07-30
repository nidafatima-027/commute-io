#!/usr/bin/env python3
"""
Test script specifically designed for Expo Go - connects to existing session.
"""
import sys
import os
import time
from pathlib import Path

# Add current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from utils.driver_factory import DriverFactory
from utils.screenshot_helper import ScreenshotHelper


def test_expo_connection():
    """Test connection to existing Expo Go session."""
    print("🎯 Testing Expo Go Connection")
    print("=" * 50)
    
    try:
        print("Connecting to existing Expo Go session...")
        print("(This should NOT restart your app)")
        
        # Initialize driver with no-reset settings
        driver = DriverFactory.create_driver()
        print("✅ Connected successfully!")
        
        # Wait a moment for connection to stabilize
        time.sleep(2)
        
        # Get current state
        current_package = driver.current_package
        current_activity = driver.current_activity
        
        print(f"📱 Current Package: {current_package}")
        print(f"📱 Current Activity: {current_activity}")
        
        # Take screenshot of current state
        screenshot_path = ScreenshotHelper.capture_screenshot("expo_connection_test.png")
        print(f"📸 Screenshot saved: {screenshot_path}")
        
        # Check if we're in Expo Go
        if "exponent" in current_package.lower():
            print("✅ Successfully connected to Expo Go!")
            
            # Try to find some elements
            print("\n🔍 Quick element scan...")
            
            # Look for any text elements
            try:
                text_elements = driver.find_elements("xpath", "//*[@text and string-length(@text) > 0]")
                print(f"Found {len(text_elements)} text elements")
                
                if text_elements:
                    print("First few text elements:")
                    for i, element in enumerate(text_elements[:5]):
                        try:
                            text = element.text
                            if text and len(text.strip()) > 0:
                                print(f"  • '{text}'")
                        except Exception:
                            pass
                else:
                    print("No text elements found - might be on splash/loading screen")
                    
            except Exception as e:
                print(f"Error scanning elements: {str(e)}")
            
            return True
        else:
            print(f"⚠️  Connected to {current_package} instead of Expo Go")
            return False
            
    except Exception as e:
        print(f"❌ Connection failed: {str(e)}")
        return False
    
    finally:
        try:
            DriverFactory.quit_driver()
            print("✅ Driver disconnected cleanly")
        except Exception:
            pass


def main():
    """Main function."""
    print("🧪 Expo Go Connection Test")
    print("=" * 50)
    print("IMPORTANT SETUP:")
    print("1. ✅ Start your Expo development server:")
    print("   cd C:\\project\\Car-Pooling-App")
    print("   npx expo start")
    print("")
    print("2. ✅ Open Expo Go on your device")
    print("3. ✅ Load your Commute.io app in Expo Go")
    print("4. ✅ Navigate to your app's main screen")
    print("5. ✅ KEEP THE APP OPEN AND VISIBLE")
    print("")
    print("This test will connect to your existing session")
    print("WITHOUT restarting Expo Go!")
    print("=" * 50)
    
    input("Press Enter when your app is ready and visible in Expo Go...")
    
    success = test_expo_connection()
    
    if success:
        print("\n🎉 Connection test successful!")
        print("Your app should still be running and visible.")
        print("Now you can run the UI inspector or tests.")
    else:
        print("\n❌ Connection test failed!")
        print("Try ensuring your app is fully loaded in Expo Go.")
    
    return success


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
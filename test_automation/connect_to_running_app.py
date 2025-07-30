#!/usr/bin/env python3
"""
Connect to already running Expo Go app - NO launching or restarting.
"""
import sys
import os
import time
from pathlib import Path

# Add current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from utils.driver_factory import DriverFactory
from utils.screenshot_helper import ScreenshotHelper


def connect_to_running_app():
    """Connect to already running app without launching anything."""
    print("🔗 Connecting to Already Running App")
    print("=" * 50)
    
    try:
        print("Attempting to connect to running Expo Go...")
        print("⚠️  This will NOT launch, restart, or interfere with your app")
        
        # Create driver connection
        driver = DriverFactory.create_driver()
        print("✅ Connected to existing app session!")
        
        # Give it a moment to stabilize
        time.sleep(1)
        
        # Get current app state
        try:
            current_package = driver.current_package
            current_activity = driver.current_activity
            print(f"📱 Connected to: {current_package}")
            print(f"📱 Current activity: {current_activity}")
        except Exception as e:
            print(f"⚠️  Could not get app details: {str(e)}")
        
        # Take screenshot of whatever is currently on screen
        print("\n📸 Taking screenshot of current screen...")
        screenshot_path = ScreenshotHelper.capture_screenshot("connected_app_screen.png")
        print(f"Screenshot saved: {screenshot_path}")
        
        # Quick scan of visible elements
        print("\n🔍 Scanning visible elements...")
        try:
            # Find all visible text elements
            text_elements = driver.find_elements("xpath", "//*[@text and string-length(@text) > 0]")
            print(f"Found {len(text_elements)} text elements:")
            
            visible_texts = []
            for element in text_elements[:10]:  # Show first 10
                try:
                    text = element.text
                    if text and len(text.strip()) > 0 and text not in visible_texts:
                        visible_texts.append(text)
                        print(f"  • '{text}'")
                except Exception:
                    pass
            
            if not visible_texts:
                print("  No text elements found - might be on splash/loading screen")
                
        except Exception as e:
            print(f"Error scanning elements: {str(e)}")
        
        # Try to find clickable elements
        print("\n🖱️  Scanning clickable elements...")
        try:
            clickable_elements = driver.find_elements("xpath", "//*[@clickable='true']")
            print(f"Found {len(clickable_elements)} clickable elements")
            
            clickable_count = 0
            for element in clickable_elements[:5]:  # Show first 5
                try:
                    text = element.text or element.get_attribute("content-desc") or "No label"
                    if text != "No label":
                        print(f"  • Clickable: '{text}'")
                        clickable_count += 1
                except Exception:
                    pass
            
            if clickable_count == 0:
                print("  No labeled clickable elements found")
                
        except Exception as e:
            print(f"Error scanning clickable elements: {str(e)}")
        
        print("\n✅ Connection successful!")
        print("Your app should still be running exactly as it was.")
        return True
        
    except Exception as e:
        print(f"❌ Failed to connect: {str(e)}")
        print("\nPossible issues:")
        print("1. Expo Go is not running")
        print("2. Your app is not loaded in Expo Go")
        print("3. Device is not connected properly")
        print("4. Appium server is not running")
        return False
    
    finally:
        try:
            DriverFactory.quit_driver()
            print("\n🔌 Disconnected from app (app continues running)")
        except Exception:
            pass


def main():
    """Main function."""
    print("🔗 Connect to Running Expo Go App")
    print("=" * 60)
    print("PREREQUISITES:")
    print("1. ✅ Appium server running: appium --port 4723")
    print("2. ✅ Android device connected")
    print("3. ✅ Expo development server running:")
    print("   cd C:\\project\\Car-Pooling-App")
    print("   npx expo start")
    print("4. ✅ Expo Go open with your app loaded")
    print("5. ✅ Your app is visible on the screen")
    print("")
    print("🎯 This will connect to your existing app WITHOUT:")
    print("   • Launching anything")
    print("   • Restarting Expo Go")
    print("   • Closing your app")
    print("   • Changing what's on screen")
    print("=" * 60)
    
    input("Press Enter when your app is ready and visible...")
    
    success = connect_to_running_app()
    
    if success:
        print("\n🎉 SUCCESS!")
        print("Connection established to your running app.")
        print("Check the screenshot to see what was captured.")
        print("\nNext steps:")
        print("• Run: python inspect_app.py")
        print("• Or run tests: python run_simple_test.py")
    else:
        print("\n❌ CONNECTION FAILED")
        print("Make sure your app is running and try again.")
    
    return success


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
#!/usr/bin/env python3
"""
App UI Inspector - helps identify actual UI elements in your Expo Go app.
"""
import sys
import os
import time
from pathlib import Path

# Add current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from utils.driver_factory import DriverFactory
from utils.screenshot_helper import ScreenshotHelper


def inspect_current_screen():
    """Inspect the current screen and show available elements."""
    print("🔍 Inspecting Current Screen Elements")
    print("=" * 50)
    
    try:
        # Initialize driver
        print("Connecting to Expo Go...")
        driver = DriverFactory.create_driver()
        print("✓ Connected successfully!")
        
        # Take a screenshot first
        screenshot_path = ScreenshotHelper.capture_screenshot("current_screen_inspection.png")
        print(f"📸 Screenshot saved: {screenshot_path}")
        
        print("\n" + "=" * 50)
        print("📱 CURRENT SCREEN ANALYSIS")
        print("=" * 50)
        
        # Get current activity
        current_activity = driver.current_activity
        print(f"Current Activity: {current_activity}")
        
        # Get page source (this will show the UI hierarchy)
        print(f"Package: {driver.current_package}")
        
        print("\n🔍 FINDING TEXT ELEMENTS...")
        print("-" * 30)
        
        # Find all text elements
        try:
            text_elements = driver.find_elements("xpath", "//*[@text and string-length(@text) > 0]")
            print(f"Found {len(text_elements)} text elements:")
            
            for i, element in enumerate(text_elements[:15]):  # Show first 15
                try:
                    text = element.text
                    if text and len(text.strip()) > 0:
                        print(f"  {i+1:2d}. '{text}'")
                except Exception:
                    pass
                    
        except Exception as e:
            print(f"Error finding text elements: {str(e)}")
        
        print("\n🔍 FINDING CLICKABLE ELEMENTS...")
        print("-" * 30)
        
        # Find clickable elements
        try:
            clickable_elements = driver.find_elements("xpath", "//*[@clickable='true']")
            print(f"Found {len(clickable_elements)} clickable elements:")
            
            for i, element in enumerate(clickable_elements[:10]):  # Show first 10
                try:
                    text = element.text or element.get_attribute("content-desc") or "No text"
                    class_name = element.get_attribute("class") or "Unknown"
                    print(f"  {i+1:2d}. {class_name}: '{text}'")
                except Exception:
                    pass
                    
        except Exception as e:
            print(f"Error finding clickable elements: {str(e)}")
        
        print("\n🔍 FINDING INPUT FIELDS...")
        print("-" * 30)
        
        # Find input fields
        try:
            input_elements = driver.find_elements("xpath", "//android.widget.EditText")
            print(f"Found {len(input_elements)} input fields:")
            
            for i, element in enumerate(input_elements):
                try:
                    hint = element.get_attribute("hint") or "No hint"
                    text = element.text or "Empty"
                    print(f"  {i+1:2d}. Hint: '{hint}', Text: '{text}'")
                except Exception:
                    pass
                    
        except Exception as e:
            print(f"Error finding input elements: {str(e)}")
        
        print("\n🔍 COMMON UI PATTERNS...")
        print("-" * 30)
        
        # Look for common patterns
        patterns_to_check = [
            ("Welcome", "Welcome message"),
            ("Get Started", "Get Started button"),
            ("Sign", "Sign up/in elements"),
            ("Login", "Login elements"),
            ("Continue", "Continue buttons"),
            ("Next", "Next buttons"),
            ("Skip", "Skip options"),
            ("Home", "Home screen indicators"),
            ("Dashboard", "Dashboard elements"),
            ("Find", "Find rides"),
            ("Search", "Search functionality"),
        ]
        
        found_patterns = []
        for pattern, description in patterns_to_check:
            try:
                elements = driver.find_elements("xpath", f"//*[contains(@text, '{pattern}') or contains(@content-desc, '{pattern}')]")
                if elements:
                    found_patterns.append((pattern, description, len(elements)))
            except Exception:
                pass
        
        if found_patterns:
            print("Found these patterns:")
            for pattern, desc, count in found_patterns:
                print(f"  ✓ {desc}: {count} element(s)")
        else:
            print("No common patterns found - this might be a custom UI")
        
        print("\n" + "=" * 50)
        print("💡 RECOMMENDATIONS:")
        print("=" * 50)
        print("1. Check the screenshot to see the actual UI")
        print("2. Look at the text elements list above")
        print("3. We'll update the page objects based on what we find")
        print("4. If no familiar patterns found, share the screenshot!")
        
        # Save page source for detailed analysis
        try:
            page_source = driver.page_source
            with open("current_screen_source.xml", "w", encoding="utf-8") as f:
                f.write(page_source)
            print("📄 Page source saved to: current_screen_source.xml")
        except Exception as e:
            print(f"Could not save page source: {str(e)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during inspection: {str(e)}")
        return False
    
    finally:
        try:
            DriverFactory.quit_driver()
            print("\n✓ Driver closed")
        except Exception:
            pass


def main():
    """Main function."""
    print("🔍 Commute.io App UI Inspector")
    print("=" * 50)
    print("This tool will inspect your current app screen")
    print("Make sure:")
    print("1. Appium server is running")
    print("2. Your device is connected") 
    print("3. Expo Go is open with your app loaded")
    print("4. Your app is on the screen you want to inspect")
    print("=" * 50)
    
    input("Press Enter when ready to inspect...")
    
    success = inspect_current_screen()
    
    if success:
        print("\n🎉 Inspection completed!")
        print("Check the screenshot and analysis above.")
    else:
        print("\n❌ Inspection failed!")
    
    return success


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
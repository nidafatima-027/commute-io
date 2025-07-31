#!/usr/bin/env python3
"""
App UI Inspector - Helps identify UI elements

This script helps you inspect the current screen's UI elements
to understand what buttons, text fields, and other elements are available.
"""

import os
import sys
import time
import yaml

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def load_config():
    """Load configuration from YAML file"""
    config_path = os.path.join(os.path.dirname(__file__), 'config', 'config.yaml')
    with open(config_path, 'r') as file:
        return yaml.safe_load(file)

def create_driver():
    """Create Appium driver directly"""
    try:
        from appium import webdriver
        from appium.options.android import UiAutomator2Options
        
        config = load_config()
        android_config = config['android']
        appium_config = config['appium']
        
        print("🚀 Creating Appium driver...")
        
        options = UiAutomator2Options()
        options.platform_name = android_config['platform_name']
        options.automation_name = android_config['automation_name']
        
        if 'app_package' in android_config:
            options.app_package = android_config['app_package']
        if 'app_activity' in android_config:
            options.app_activity = android_config['app_activity']
            
        options.device_name = android_config['device_name']
        options.no_reset = android_config['no_reset']
        options.full_reset = android_config['full_reset']
        options.new_command_timeout = android_config['new_command_timeout']
        
        # Additional capabilities
        options.set_capability("autoGrantPermissions", True)
        options.set_capability("automationName", "UiAutomator2")
        options.set_capability("uiautomator2ServerLaunchTimeout", 60000)
        options.set_capability("adbExecTimeout", 60000)
        
        driver = webdriver.Remote(
            command_executor=appium_config['server_url'],
            options=options
        )
        
        driver.implicitly_wait(appium_config['implicit_wait'])
        print("✅ Appium driver created successfully")
        return driver
        
    except Exception as e:
        print(f"❌ Failed to create Appium driver: {str(e)}")
        return None

def close_driver(driver):
    """Close the Appium driver"""
    if driver:
        try:
            print("🧹 Closing Appium driver...")
            driver.quit()
            print("✅ Appium driver closed successfully")
        except Exception as e:
            print(f"⚠️ Error closing driver: {str(e)}")

def inspect_current_screen(driver):
    """Inspect the current screen's UI elements"""
    print("\n🔍 INSPECTING CURRENT SCREEN")
    print("=" * 50)
    
    try:
        # Get page source to see all elements
        page_source = driver.page_source
        print("📄 Page source length:", len(page_source))
        
        # Find all buttons
        buttons = driver.find_elements("xpath", "//android.widget.Button")
        print(f"\n🔘 BUTTONS ({len(buttons)} found):")
        for i, button in enumerate(buttons):
            try:
                text = button.text
                resource_id = button.get_attribute("resource-id")
                content_desc = button.get_attribute("content-desc")
                print(f"  {i+1}. Text: '{text}' | ID: {resource_id} | Desc: {content_desc}")
            except:
                print(f"  {i+1}. [Error reading button]")
        
        # Find all text fields
        text_fields = driver.find_elements("xpath", "//android.widget.EditText")
        print(f"\n✏️ TEXT FIELDS ({len(text_fields)} found):")
        for i, field in enumerate(text_fields):
            try:
                hint = field.get_attribute("hint")
                text = field.text
                input_type = field.get_attribute("inputType")
                resource_id = field.get_attribute("resource-id")
                print(f"  {i+1}. Hint: '{hint}' | Text: '{text}' | Type: {input_type} | ID: {resource_id}")
            except:
                print(f"  {i+1}. [Error reading text field]")
        
        # Find all text elements
        text_elements = driver.find_elements("xpath", "//android.widget.TextView")
        print(f"\n📝 TEXT ELEMENTS ({len(text_elements)} found):")
        for i, text_elem in enumerate(text_elements[:10]):  # Show first 10
            try:
                text = text_elem.text
                resource_id = text_elem.get_attribute("resource-id")
                if text and len(text.strip()) > 0:
                    print(f"  {i+1}. Text: '{text}' | ID: {resource_id}")
            except:
                pass
        
        # Find all clickable elements
        clickable_elements = driver.find_elements("xpath", "//*[@clickable='true']")
        print(f"\n👆 CLICKABLE ELEMENTS ({len(clickable_elements)} found):")
        for i, elem in enumerate(clickable_elements[:10]):  # Show first 10
            try:
                text = elem.text
                resource_id = elem.get_attribute("resource-id")
                class_name = elem.get_attribute("className")
                print(f"  {i+1}. Text: '{text}' | ID: {resource_id} | Class: {class_name}")
            except:
                pass
        
        print("\n" + "=" * 50)
        print("💡 TIPS:")
        print("- Use resource-id for precise element selection")
        print("- Use text content for button identification")
        print("- Use hint text for input field identification")
        print("- Use className for element type identification")
        
    except Exception as e:
        print(f"❌ Error inspecting screen: {str(e)}")

def main():
    """Main function"""
    print("🔍 App UI Inspector")
    print("=" * 30)
    
    # Check if we're in the right directory
    if not os.path.exists("config"):
        print("❌ Please run this script from the test_automation directory")
        return 1
    
    # Create driver
    driver = create_driver()
    if not driver:
        print("❌ Could not create driver")
        return 1
    
    try:
        print("\n📱 Make sure your Expo Go app is open and on the screen you want to inspect.")
        print("Press Enter when ready to inspect the current screen...")
        input()
        
        # Inspect the current screen
        inspect_current_screen(driver)
        
        print("\n✅ Inspection completed!")
        return 0
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return 1
    finally:
        # Always close the driver
        close_driver(driver)

if __name__ == "__main__":
    sys.exit(main())
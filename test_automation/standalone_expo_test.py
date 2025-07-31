#!/usr/bin/env python3
"""
Standalone Expo Test - No Import Dependencies

This is a completely standalone test that doesn't rely on any external imports
that might cause issues. It directly imports what it needs.
"""

import os
import sys
import time
import subprocess
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

def navigate_to_screen(driver, screen_name):
    """Navigate to a specific screen using deep linking"""
    try:
        config = load_config()
        navigation_urls = config.get('navigation_urls', {})
        
        if screen_name not in navigation_urls:
            print(f"❌ Unknown screen: {screen_name}")
            return False
        
        url = navigation_urls[screen_name]
        print(f"🧭 Navigating to {screen_name}: {url}")
        
        # Use adb to launch the deep link
        adb_command = f"adb shell am start -W -a android.intent.action.VIEW -d '{url}' host.exp.exponent"
        result = subprocess.run(adb_command, shell=True, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✅ Successfully navigated to {screen_name}")
            time.sleep(2)  # Wait for screen to load
            return True
        else:
            print(f"❌ Failed to navigate to {screen_name}: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ Error navigating to {screen_name}: {str(e)}")
        return False

def test_complete_expo_flow():
    """Test the complete Expo flow"""
    print("\n" + "="*60)
    print("🧪 STANDALONE EXPO FLOW TEST")
    print("="*60)
    
    driver = None
    try:
        # Create driver
        driver = create_driver()
        if not driver:
            print("❌ Could not create driver")
            return False
        
        # Test navigation to different screens
        screens_to_test = ['get_started', 'signup', 'email_page', 'otp_verification', 'profile_setup']
        
        for screen in screens_to_test:
            print(f"\n📍 Testing navigation to: {screen}")
            success = navigate_to_screen(driver, screen)
            if success:
                print(f"✅ Successfully navigated to {screen}")
                time.sleep(2)
            else:
                print(f"❌ Failed to navigate to {screen}")
        
        print("\n" + "="*60)
        print("🎉 STANDALONE TEST COMPLETED")
        print("="*60)
        return True
        
    except Exception as e:
        print(f"❌ Error in standalone test: {str(e)}")
        return False
    finally:
        if driver:
            close_driver(driver)

def main():
    """Main function"""
    print("🚀 Standalone Expo Test Runner")
    print("=" * 40)
    
    # Check if we're in the right directory
    if not os.path.exists("config"):
        print("❌ Please run this script from the test_automation directory")
        return 1
    
    # Run the test
    success = test_complete_expo_flow()
    
    if success:
        print("\n✅ Standalone test completed successfully!")
        return 0
    else:
        print("\n❌ Standalone test failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())
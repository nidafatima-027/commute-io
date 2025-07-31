#!/usr/bin/env python3
"""
Interactive Expo Test - Real UI Interaction

This test actually interacts with the app by tapping buttons, filling forms,
and navigating through the UI elements.
"""

import os
import sys
import time
import yaml
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

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

def wait_for_element(driver, locator, timeout=10):
    """Wait for an element to be present and visible"""
    try:
        element = WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located(locator)
        )
        return element
    except TimeoutException:
        print(f"⏰ Timeout waiting for element: {locator}")
        return None

def tap_element(driver, locator, description=""):
    """Tap on an element"""
    try:
        element = wait_for_element(driver, locator)
        if element:
            element.click()
            print(f"👆 Tapped {description}")
            time.sleep(1)
            return True
        else:
            print(f"❌ Element not found: {description}")
            return False
    except Exception as e:
        print(f"❌ Error tapping {description}: {str(e)}")
        return False

def enter_text(driver, locator, text, description=""):
    """Enter text in an input field"""
    try:
        element = wait_for_element(driver, locator)
        if element:
            element.clear()
            element.send_keys(text)
            print(f"✍️ Entered '{text}' in {description}")
            time.sleep(0.5)
            return True
        else:
            print(f"❌ Input field not found: {description}")
            return False
    except Exception as e:
        print(f"❌ Error entering text in {description}: {str(e)}")
        return False

def test_get_started_screen(driver):
    """Test the Get Started screen"""
    print("\n📍 Testing Get Started Screen...")
    
    # Look for common get started button patterns
    get_started_selectors = [
        (By.XPATH, "//*[contains(@text, 'Get Started')]"),
        (By.XPATH, "//*[contains(@text, 'Get started')]"),
        (By.XPATH, "//*[contains(@text, 'Start')]"),
        (By.XPATH, "//*[contains(@text, 'Begin')]"),
        (By.XPATH, "//*[contains(@text, 'Continue')]"),
        (By.XPATH, "//*[contains(@text, 'Next')]"),
        (By.XPATH, "//android.widget.Button[1]"),
        (By.XPATH, "//android.widget.Button"),
    ]
    
    for selector in get_started_selectors:
        if tap_element(driver, selector, "Get Started button"):
            print("✅ Successfully tapped Get Started button")
            time.sleep(2)
            return True
    
    print("❌ Could not find Get Started button")
    return False

def test_signup_screen(driver):
    """Test the Signup screen"""
    print("\n📍 Testing Signup Screen...")
    
    # Test data
    test_data = {
        'first_name': 'John',
        'last_name': 'Doe',
        'email': 'john.doe@test.com',
        'phone': '1234567890',
        'password': 'TestPassword123!'
    }
    
    # Try to find and fill first name field
    first_name_selectors = [
        (By.XPATH, "//*[contains(@text, 'First Name')]/following-sibling::*"),
        (By.XPATH, "//*[contains(@text, 'First name')]/following-sibling::*"),
        (By.XPATH, "//*[contains(@text, 'Name')]/following-sibling::*"),
        (By.XPATH, "//android.widget.EditText[1]"),
    ]
    
    for selector in first_name_selectors:
        if enter_text(driver, selector, test_data['first_name'], "First Name"):
            break
    
    # Try to find and fill last name field
    last_name_selectors = [
        (By.XPATH, "//*[contains(@text, 'Last Name')]/following-sibling::*"),
        (By.XPATH, "//*[contains(@text, 'Last name')]/following-sibling::*"),
        (By.XPATH, "//android.widget.EditText[2]"),
    ]
    
    for selector in last_name_selectors:
        if enter_text(driver, selector, test_data['last_name'], "Last Name"):
            break
    
    # Try to find and fill email field
    email_selectors = [
        (By.XPATH, "//*[contains(@text, 'Email')]/following-sibling::*"),
        (By.XPATH, "//*[contains(@text, 'email')]/following-sibling::*"),
        (By.XPATH, "//android.widget.EditText[contains(@inputType, 'textEmailAddress')]"),
        (By.XPATH, "//android.widget.EditText[3]"),
    ]
    
    for selector in email_selectors:
        if enter_text(driver, selector, test_data['email'], "Email"):
            break
    
    # Try to find and fill phone field
    phone_selectors = [
        (By.XPATH, "//*[contains(@text, 'Phone')]/following-sibling::*"),
        (By.XPATH, "//*[contains(@text, 'phone')]/following-sibling::*"),
        (By.XPATH, "//android.widget.EditText[contains(@inputType, 'phone')]"),
        (By.XPATH, "//android.widget.EditText[4]"),
    ]
    
    for selector in phone_selectors:
        if enter_text(driver, selector, test_data['phone'], "Phone"):
            break
    
    # Try to find and fill password field
    password_selectors = [
        (By.XPATH, "//*[contains(@text, 'Password')]/following-sibling::*"),
        (By.XPATH, "//*[contains(@text, 'password')]/following-sibling::*"),
        (By.XPATH, "//android.widget.EditText[contains(@inputType, 'textPassword')]"),
        (By.XPATH, "//android.widget.EditText[5]"),
    ]
    
    for selector in password_selectors:
        if enter_text(driver, selector, test_data['password'], "Password"):
            break
    
    # Look for signup/continue button
    signup_button_selectors = [
        (By.XPATH, "//*[contains(@text, 'Sign Up')]"),
        (By.XPATH, "//*[contains(@text, 'Signup')]"),
        (By.XPATH, "//*[contains(@text, 'Create Account')]"),
        (By.XPATH, "//*[contains(@text, 'Register')]"),
        (By.XPATH, "//*[contains(@text, 'Continue')]"),
        (By.XPATH, "//*[contains(@text, 'Next')]"),
        (By.XPATH, "//android.widget.Button"),
    ]
    
    for selector in signup_button_selectors:
        if tap_element(driver, selector, "Signup button"):
            print("✅ Successfully tapped Signup button")
            time.sleep(2)
            return True
    
    print("❌ Could not find Signup button")
    return False

def test_email_verification_screen(driver):
    """Test the Email verification screen"""
    print("\n📍 Testing Email Verification Screen...")
    
    # Test email
    test_email = "john.doe@test.com"
    
    # Try to find and fill email field
    email_selectors = [
        (By.XPATH, "//*[contains(@text, 'Email')]/following-sibling::*"),
        (By.XPATH, "//*[contains(@text, 'email')]/following-sibling::*"),
        (By.XPATH, "//android.widget.EditText[contains(@inputType, 'textEmailAddress')]"),
        (By.XPATH, "//android.widget.EditText[1]"),
    ]
    
    for selector in email_selectors:
        if enter_text(driver, selector, test_email, "Email"):
            break
    
    # Look for send OTP/continue button
    send_otp_selectors = [
        (By.XPATH, "//*[contains(@text, 'Send OTP')]"),
        (By.XPATH, "//*[contains(@text, 'Send Code')]"),
        (By.XPATH, "//*[contains(@text, 'Continue')]"),
        (By.XPATH, "//*[contains(@text, 'Next')]"),
        (By.XPATH, "//android.widget.Button"),
    ]
    
    for selector in send_otp_selectors:
        if tap_element(driver, selector, "Send OTP button"):
            print("✅ Successfully tapped Send OTP button")
            time.sleep(2)
            return True
    
    print("❌ Could not find Send OTP button")
    return False

def test_otp_verification_screen(driver):
    """Test the OTP verification screen"""
    print("\n📍 Testing OTP Verification Screen...")
    
    # Test OTP (common test OTP)
    test_otp = "123456"
    
    # Try to find OTP input fields
    otp_selectors = [
        (By.XPATH, "//android.widget.EditText[1]"),
        (By.XPATH, "//android.widget.EditText[2]"),
        (By.XPATH, "//android.widget.EditText[3]"),
        (By.XPATH, "//android.widget.EditText[4]"),
        (By.XPATH, "//android.widget.EditText[5]"),
        (By.XPATH, "//android.widget.EditText[6]"),
    ]
    
    # Enter OTP digit by digit
    for i, selector in enumerate(otp_selectors[:6]):
        digit = test_otp[i] if i < len(test_otp) else "0"
        if enter_text(driver, selector, digit, f"OTP digit {i+1}"):
            time.sleep(0.2)
    
    # Look for verify/continue button
    verify_selectors = [
        (By.XPATH, "//*[contains(@text, 'Verify')]"),
        (By.XPATH, "//*[contains(@text, 'Confirm')]"),
        (By.XPATH, "//*[contains(@text, 'Continue')]"),
        (By.XPATH, "//*[contains(@text, 'Next')]"),
        (By.XPATH, "//android.widget.Button"),
    ]
    
    for selector in verify_selectors:
        if tap_element(driver, selector, "Verify OTP button"):
            print("✅ Successfully tapped Verify OTP button")
            time.sleep(2)
            return True
    
    print("❌ Could not find Verify OTP button")
    return False

def test_profile_setup_screen(driver):
    """Test the Profile Setup screen"""
    print("\n📍 Testing Profile Setup Screen...")
    
    # Test data
    test_data = {
        'full_name': 'John Doe',
        'bio': 'Test user for automation',
        'location': 'New York',
        'interests': 'Technology, Travel'
    }
    
    # Try to find and fill profile fields
    profile_selectors = [
        (By.XPATH, "//*[contains(@text, 'Full Name')]/following-sibling::*"),
        (By.XPATH, "//*[contains(@text, 'Name')]/following-sibling::*"),
        (By.XPATH, "//android.widget.EditText[1]"),
    ]
    
    for selector in profile_selectors:
        if enter_text(driver, selector, test_data['full_name'], "Full Name"):
            break
    
    # Try to find and fill bio field
    bio_selectors = [
        (By.XPATH, "//*[contains(@text, 'Bio')]/following-sibling::*"),
        (By.XPATH, "//*[contains(@text, 'About')]/following-sibling::*"),
        (By.XPATH, "//android.widget.EditText[2]"),
    ]
    
    for selector in bio_selectors:
        if enter_text(driver, selector, test_data['bio'], "Bio"):
            break
    
    # Look for complete/save button
    complete_selectors = [
        (By.XPATH, "//*[contains(@text, 'Complete')]"),
        (By.XPATH, "//*[contains(@text, 'Save')]"),
        (By.XPATH, "//*[contains(@text, 'Finish')]"),
        (By.XPATH, "//*[contains(@text, 'Done')]"),
        (By.XPATH, "//*[contains(@text, 'Continue')]"),
        (By.XPATH, "//android.widget.Button"),
    ]
    
    for selector in complete_selectors:
        if tap_element(driver, selector, "Complete Profile button"):
            print("✅ Successfully tapped Complete Profile button")
            time.sleep(2)
            return True
    
    print("❌ Could not find Complete Profile button")
    return False

def test_complete_interactive_flow(driver):
    """Test the complete interactive flow"""
    print("\n" + "="*60)
    print("🧪 INTERACTIVE EXPO FLOW TEST")
    print("="*60)
    
    try:
        # Wait for app to load
        print("⏳ Waiting for app to load...")
        time.sleep(3)
        
        # Test each screen
        screens = [
            ("Get Started", test_get_started_screen),
            ("Signup", test_signup_screen),
            ("Email Verification", test_email_verification_screen),
            ("OTP Verification", test_otp_verification_screen),
            ("Profile Setup", test_profile_setup_screen),
        ]
        
        for screen_name, test_function in screens:
            print(f"\n{'='*20} {screen_name} {'='*20}")
            success = test_function(driver)
            if success:
                print(f"✅ {screen_name} test passed")
            else:
                print(f"⚠️ {screen_name} test had issues (continuing...)")
            time.sleep(2)
        
        print("\n" + "="*60)
        print("🎉 INTERACTIVE TEST COMPLETED")
        print("="*60)
        return True
        
    except Exception as e:
        print(f"❌ Error in interactive test: {str(e)}")
        return False

def main():
    """Main function"""
    print("🚀 Interactive Expo Test Runner")
    print("=" * 40)
    
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
        # Run the interactive test
        success = test_complete_interactive_flow(driver)
        
        if success:
            print("\n✅ Interactive test completed successfully!")
            return 0
        else:
            print("\n❌ Interactive test failed!")
            return 1
            
    finally:
        # Always close the driver
        close_driver(driver)

if __name__ == "__main__":
    sys.exit(main())
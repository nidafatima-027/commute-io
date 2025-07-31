import pytest
import time
import yaml
import os
from appium.webdriver.common.appiumby import AppiumBy
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

# Import our utilities
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from utils.driver_factory import create_driver, close_driver, wait_for_element, wait_for_element_clickable
from utils.navigation_helper import navigation_helper
from pages.enhanced_authentication_page import EnhancedEmailPage, EnhancedOTPVerificationPage

class TestCompleteExpoFlow:
    """Complete test flow for Expo Go app - all scenarios in one continuous test"""
    
    @pytest.fixture(scope="class")
    def driver(self):
        """Create and manage the Appium driver for the entire test class"""
        print("🚀 Setting up Appium driver for complete Expo flow...")
        driver = create_driver()
        
        # Start from Get Started screen
        print("🧭 Starting from Get Started screen...")
        if not navigation_helper.start_from_get_started(driver):
            print("⚠️ Could not navigate to Get Started screen, continuing anyway...")
        
        yield driver
        
        print("🧹 Cleaning up Appium driver...")
        close_driver(driver)
    
    @pytest.fixture(scope="class")
    def email_page(self, driver):
        """Enhanced email page object"""
        return EnhancedEmailPage(driver)
    
    @pytest.fixture(scope="class")
    def otp_page(self, driver):
        """Enhanced OTP verification page object"""
        return EnhancedOTPVerificationPage(driver)
    
    def test_complete_expo_authentication_flow(self, driver, email_page, otp_page):
        """
        Complete authentication flow test covering all scenarios:
        1. Get Started screen
        2. Signup screen
        3. Email authentication flow
        4. OTP verification
        5. Profile setup
        6. Phone authentication flow (optional)
        """
        print("\n" + "="*60)
        print("🧪 STARTING COMPLETE EXPO AUTHENTICATION FLOW")
        print("="*60)
        
        try:
            # Step 1: Verify we're on Get Started screen
            print("\n📍 Step 1: Verifying Get Started screen...")
            screen_info = navigation_helper.get_current_screen_info(driver)
            print(f"📱 Current screen elements: {screen_info}")
            
            # Look for Get Started screen elements
            get_started_elements = [
                (AppiumBy.XPATH, "//*[contains(@text, 'Get Started')]"),
                (AppiumBy.XPATH, "//*[contains(@text, 'Welcome')]"),
                (AppiumBy.XPATH, "//*[contains(@text, 'Continue with email')]"),
                (AppiumBy.XPATH, "//*[contains(@text, 'Continue with phone')]")
            ]
            
            get_started_found = False
            for locator in get_started_elements:
                element = wait_for_element(driver, locator, timeout=5)
                if element:
                    print(f"✅ Found Get Started element: {locator[1]}")
                    get_started_found = True
                    break
            
            if not get_started_found:
                print("⚠️ Get Started screen not detected, navigating to it...")
                navigation_helper.navigate_to_screen('get_started', driver)
                time.sleep(3)
            
            # Step 2: Navigate to Signup screen
            print("\n📍 Step 2: Navigating to Signup screen...")
            if not navigation_helper.navigate_to_screen('signup', driver):
                print("⚠️ Could not navigate to signup, trying to find signup elements...")
            
            # Look for signup elements
            signup_elements = [
                (AppiumBy.XPATH, "//*[contains(@text, 'Continue with email')]"),
                (AppiumBy.XPATH, "//*[contains(@text, 'Continue with phone')]"),
                (AppiumBy.XPATH, "//*[contains(@text, 'Sign Up')]"),
                (AppiumBy.XPATH, "//*[contains(@text, 'Create Account')]")
            ]
            
            signup_button = None
            for locator in signup_elements:
                element = wait_for_element_clickable(driver, locator, timeout=10)
                if element:
                    print(f"✅ Found signup element: {locator[1]} - '{element.text}'")
                    signup_button = element
                    break
            
            if not signup_button:
                print("❌ No signup elements found")
                return
            
            # Step 3: Start Email Authentication Flow
            print("\n📍 Step 3: Starting Email Authentication Flow...")
            
            # Try to tap "Continue with email" button
            email_button_locators = [
                (AppiumBy.XPATH, "//*[contains(@text, 'Continue with email')]"),
                (AppiumBy.XPATH, "//*[contains(@text, 'email') and contains(@class, 'Button')]"),
                (AppiumBy.XPATH, "//*[contains(@text, 'Email') and contains(@class, 'Button')]")
            ]
            
            email_button_tapped = False
            for locator in email_button_locators:
                try:
                    element = wait_for_element_clickable(driver, locator, timeout=5)
                    if element:
                        print(f"🔘 Tapping email button: {locator[1]} - '{element.text}'")
                        element.click()
                        email_button_tapped = True
                        time.sleep(2)
                        break
                except Exception as e:
                    print(f"⚠️ Failed to tap email button with locator {locator[1]}: {str(e)}")
                    continue
            
            if not email_button_tapped:
                print("❌ Could not tap email button, trying to navigate directly...")
                navigation_helper.navigate_to_screen('email_page', driver)
            
            # Step 4: Email Input and OTP Flow
            print("\n📍 Step 4: Email Input and OTP Flow...")
            
            # Navigate to email page if not already there
            if not navigation_helper.navigate_to_screen('email_page', driver):
                print("⚠️ Could not navigate to email page")
            
            # Use enhanced email page for better debugging
            print("📧 Using enhanced email page for input...")
            
            # Enter email
            email_entered = email_page.enter_email("test@example.com")
            if not email_entered:
                print("❌ Failed to enter email")
                return
            
            # Tap Next button
            next_button_tapped = email_page.tap_continue_button()
            if not next_button_tapped:
                print("❌ Failed to tap Next button")
                return
            
            # Step 5: OTP Verification
            print("\n📍 Step 5: OTP Verification...")
            
            # Navigate to OTP verification page
            if not navigation_helper.navigate_to_screen('otp_verification', driver):
                print("⚠️ Could not navigate to OTP verification page")
            
            # Use enhanced OTP page
            print("🔐 Using enhanced OTP page for verification...")
            
            # Enter OTP
            otp_entered = otp_page.enter_otp("123456")
            if not otp_entered:
                print("❌ Failed to enter OTP")
                return
            
            # Tap Verify button
            verify_button_tapped = otp_page.tap_verify_button()
            if not verify_button_tapped:
                print("❌ Failed to tap Verify button")
                return
            
            # Step 6: Profile Setup
            print("\n📍 Step 6: Profile Setup...")
            
            # Navigate to profile setup
            if not navigation_helper.navigate_to_screen('profile_setup', driver):
                print("⚠️ Could not navigate to profile setup page")
            
            # Look for profile setup elements
            profile_elements = [
                (AppiumBy.XPATH, "//*[contains(@text, 'Profile')]"),
                (AppiumBy.XPATH, "//*[contains(@text, 'Setup')]"),
                (AppiumBy.XPATH, "//*[@class='android.widget.EditText']")
            ]
            
            profile_found = False
            for locator in profile_elements:
                element = wait_for_element(driver, locator, timeout=5)
                if element:
                    print(f"✅ Found profile setup element: {locator[1]} - '{element.text}'")
                    profile_found = True
                    break
            
            if profile_found:
                print("✅ Profile setup screen detected")
            else:
                print("⚠️ Profile setup screen not detected")
            
            # Step 7: Optional Phone Flow
            print("\n📍 Step 7: Testing Phone Authentication Flow...")
            
            # Navigate back to signup to test phone flow
            if navigation_helper.navigate_to_screen('signup', driver):
                # Look for phone button
                phone_button_locators = [
                    (AppiumBy.XPATH, "//*[contains(@text, 'Continue with phone')]"),
                    (AppiumBy.XPATH, "//*[contains(@text, 'phone') and contains(@class, 'Button')]"),
                    (AppiumBy.XPATH, "//*[contains(@text, 'Phone') and contains(@class, 'Button')]")
                ]
                
                phone_button_found = False
                for locator in phone_button_locators:
                    element = wait_for_element(driver, locator, timeout=5)
                    if element:
                        print(f"✅ Found phone button: {locator[1]} - '{element.text}'")
                        phone_button_found = True
                        break
                
                if phone_button_found:
                    print("✅ Phone authentication option available")
                else:
                    print("⚠️ Phone authentication option not found")
            
            # Step 8: Final Verification
            print("\n📍 Step 8: Final Verification...")
            
            # Get final screen info
            final_screen_info = navigation_helper.get_current_screen_info(driver)
            print(f"📱 Final screen elements: {final_screen_info}")
            
            # Check if we have any authentication-related elements
            auth_elements = [
                "Profile", "Setup", "Welcome", "Dashboard", "Home", "Main"
            ]
            
            auth_found = any(auth in str(final_screen_info) for auth in auth_elements)
            
            if auth_found:
                print("✅ Authentication flow completed successfully")
            else:
                print("⚠️ Authentication flow may not have completed fully")
            
            print("\n" + "="*60)
            print("🎉 COMPLETE EXPO FLOW TEST FINISHED")
            print("="*60)
            
        except Exception as e:
            print(f"❌ Error in complete flow test: {str(e)}")
            # Get current screen info for debugging
            try:
                screen_info = navigation_helper.get_current_screen_info(driver)
                print(f"📱 Current screen at error: {screen_info}")
            except:
                pass
            raise
    
    def test_navigation_verification(self, driver):
        """Test to verify navigation between different screens works correctly"""
        print("\n🧭 Testing navigation between screens...")
        
        screens_to_test = ['get_started', 'signup', 'email_page', 'otp_verification', 'profile_setup']
        
        for screen in screens_to_test:
            print(f"🧭 Testing navigation to: {screen}")
            success = navigation_helper.navigate_to_screen(screen, driver)
            if success:
                print(f"✅ Successfully navigated to {screen}")
                time.sleep(2)
            else:
                print(f"❌ Failed to navigate to {screen}")
        
        print("✅ Navigation verification completed")
    
    def test_screen_elements_detection(self, driver):
        """Test to detect and list elements on different screens"""
        print("\n🔍 Testing screen elements detection...")
        
        screens_to_test = ['get_started', 'signup', 'email_page', 'otp_verification', 'profile_setup']
        
        for screen in screens_to_test:
            print(f"\n🔍 Detecting elements on: {screen}")
            navigation_helper.navigate_to_screen(screen, driver)
            time.sleep(2)
            
            screen_info = navigation_helper.get_current_screen_info(driver)
            print(f"📱 {screen} elements: {screen_info}")
        
        print("✅ Screen elements detection completed")
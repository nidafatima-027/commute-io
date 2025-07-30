"""
Enhanced pytest tests for email authentication flow with better debugging.
"""
import pytest
import time
from pages.enhanced_authentication_page import EnhancedEmailPage, EnhancedOTPVerificationPage
from pages.authentication_page import SignupPage, ProfileSetupPage
from pages.onboarding_page import OnboardingPage
from utils.driver_factory import DriverFactory
from appium.webdriver.common.appiumby import AppiumBy


class TestEnhancedEmailFlow:
    """Enhanced test class for email authentication flow with better debugging."""
    
    @pytest.fixture(scope="class")
    def driver(self):
        """Setup and teardown Appium driver."""
        print("\n🚀 Setting up Appium driver for enhanced email flow tests...")
        driver = DriverFactory.create_driver()
        yield driver
        print("\n🧹 Cleaning up Appium driver...")
        DriverFactory.quit_driver()
    
    @pytest.fixture
    def onboarding_page(self, driver):
        return OnboardingPage()
    
    @pytest.fixture
    def signup_page(self, driver):
        return SignupPage()
    
    @pytest.fixture
    def enhanced_email_page(self, driver):
        return EnhancedEmailPage()
    
    @pytest.fixture
    def enhanced_otp_page(self, driver):
        return EnhancedOTPVerificationPage()
    
    @pytest.fixture
    def profile_page(self, driver):
        return ProfileSetupPage()
    
    @pytest.mark.email_flow
    def test_enhanced_email_authentication_flow(self, onboarding_page, signup_page, enhanced_email_page, enhanced_otp_page, profile_page):
        """Test the complete email authentication flow with enhanced debugging."""
        print("\n🚀 Testing enhanced email authentication flow...")
        
        # Step 1: Verify onboarding
        print("\n📱 Step 1: Verifying onboarding screen...")
        assert onboarding_page.is_onboarding_screen_displayed(), "Onboarding screen not displayed"
        print("✅ Onboarding screen verified")
        
        # Step 2: Navigate to signup
        print("\n📝 Step 2: Navigating to signup screen...")
        onboarding_page.tap_get_started_button()
        time.sleep(3)
        assert signup_page.is_signup_screen_displayed(), "Not navigated to signup screen"
        print("✅ Successfully navigated to signup screen")
        
        # Step 3: Choose email authentication
        print("\n📧 Step 3: Choosing email authentication...")
        success = signup_page.tap_continue_with_email()
        assert success, "Failed to tap Continue with email button"
        time.sleep(3)
        
        # Step 4: Verify email input screen
        print("\n📧 Step 4: Verifying email input screen...")
        assert enhanced_email_page.is_email_page_displayed(), "Not navigated to email input screen"
        print("✅ Successfully navigated to email input screen")
        
        # List all visible elements for debugging
        print("\n🔍 Listing all visible elements on email screen...")
        elements = enhanced_email_page.list_all_visible_elements()
        for element in elements[:10]:  # Show first 10 elements
            print(f"  - {element}")
        
        # Step 5: Enter email
        print("\n📧 Step 5: Entering email address...")
        email = "test@example.com"
        success = enhanced_email_page.enter_email(email)
        assert success, f"Failed to enter email: {email}"
        print("✅ Successfully entered email")
        
        # Check if continue button is enabled
        print("\n➡️ Checking continue button state...")
        is_enabled = enhanced_email_page.is_continue_button_enabled()
        print(f"Continue button enabled: {is_enabled}")
        
        if not is_enabled:
            print("⚠️ Continue button is disabled. Waiting for validation...")
            time.sleep(2)
            is_enabled = enhanced_email_page.is_continue_button_enabled()
            print(f"Continue button enabled after wait: {is_enabled}")
        
        # Step 6: Tap continue button
        print("\n➡️ Step 6: Tapping continue button...")
        success = enhanced_email_page.tap_continue_button()
        assert success, "Failed to tap continue button"
        print("✅ Successfully tapped continue button")
        
        # Step 7: Verify OTP verification screen
        print("\n🔐 Step 7: Verifying OTP verification screen...")
        time.sleep(3)  # Wait for navigation
        
        # List all visible elements for debugging
        print("\n🔍 Listing all visible elements on current screen...")
        elements = enhanced_email_page.list_all_visible_elements()
        for element in elements[:10]:  # Show first 10 elements
            print(f"  - {element}")
        
        # Check if we're on OTP screen
        is_otp_screen = enhanced_otp_page.is_otp_verification_screen_displayed()
        print(f"OTP verification screen detected: {is_otp_screen}")
        
        if is_otp_screen:
            print("✅ Successfully navigated to OTP verification screen")
            
            # Step 8: Enter OTP
            print("\n🔢 Step 8: Entering OTP...")
            otp = "123456"
            success = enhanced_otp_page.enter_otp(otp)
            assert success, f"Failed to enter OTP: {otp}"
            print("✅ Successfully entered OTP")
            
            # Step 9: Tap verify button
            print("\n✅ Step 9: Tapping verify button...")
            success = enhanced_otp_page.tap_verify_button()
            assert success, "Failed to tap verify button"
            print("✅ Successfully tapped verify button")
            
            # Step 10: Verify profile setup screen
            print("\n👤 Step 10: Verifying profile setup screen...")
            time.sleep(3)
            assert profile_page.is_profile_setup_screen_displayed(), "Not navigated to profile setup screen"
            print("✅ Successfully navigated to profile setup screen")
            
            # Step 11: Complete profile setup
            print("\n👤 Step 11: Completing profile setup...")
            profile_page.enter_first_name("John")
            profile_page.enter_last_name("Doe")
            profile_page.select_date_of_birth("1990-01-01")
            profile_page.select_gender("Male")
            profile_page.tap_continue_button()
            time.sleep(3)
            
            print("✅ Profile setup completed successfully")
            print("🎉 Complete email authentication flow successful!")
            print("🏠 User should now be on main app dashboard")
            
        else:
            print("❌ Failed to navigate to OTP verification screen")
            print("🔍 Debugging information:")
            
            # List all visible elements again
            print("\n🔍 All visible elements on current screen:")
            elements = enhanced_email_page.list_all_visible_elements()
            for element in elements:
                print(f"  - {element}")
            
            # Check if we're still on email screen
            is_still_email = enhanced_email_page.is_email_page_displayed()
            print(f"Still on email screen: {is_still_email}")
            
            # Check if there are any error messages
            try:
                error_elements = enhanced_email_page.driver.find_elements(AppiumBy.XPATH, "//*[contains(@text, 'error') or contains(@text, 'Error') or contains(@text, 'invalid')]")
                if error_elements:
                    print("⚠️ Error messages found:")
                    for error in error_elements:
                        print(f"  - {error.text}")
            except:
                pass
            
            # This will fail the test but provide useful debugging info
            assert False, "Failed to navigate to OTP verification screen. Check the debug output above."
    
    @pytest.mark.email_flow
    def test_email_input_debugging(self, onboarding_page, signup_page, enhanced_email_page):
        """Test email input with detailed debugging."""
        print("\n🔍 Testing email input with detailed debugging...")
        
        # Navigate to email input screen
        onboarding_page.tap_get_started_button()
        time.sleep(2)
        signup_page.tap_continue_with_email()
        time.sleep(3)
        
        # Verify we're on email screen
        assert enhanced_email_page.is_email_page_displayed(), "Not on email input screen"
        
        # List all visible elements
        print("\n🔍 All visible elements on email screen:")
        elements = enhanced_email_page.list_all_visible_elements()
        for element in elements:
            print(f"  - {element}")
        
        # Test different email formats
        test_emails = [
            "test@example.com",
            "user@domain.org",
            "john.doe@company.co.uk"
        ]
        
        for email in test_emails:
            print(f"\n📧 Testing email: {email}")
            
            # Enter email
            success = enhanced_email_page.enter_email(email)
            print(f"Email entry success: {success}")
            
            # Check continue button state
            is_enabled = enhanced_email_page.is_continue_button_enabled()
            print(f"Continue button enabled: {is_enabled}")
            
            # Get entered email
            entered_email = enhanced_email_page.get_entered_email()
            print(f"Entered email: '{entered_email}'")
            
            if success and is_enabled:
                print("✅ Email input and button state are correct")
                break
            else:
                print("⚠️ Email input or button state issue")
        
        print("✅ Email input debugging test completed")
    
    @pytest.mark.email_flow
    def test_continue_button_debugging(self, onboarding_page, signup_page, enhanced_email_page):
        """Test continue button with detailed debugging."""
        print("\n🔍 Testing continue button with detailed debugging...")
        
        # Navigate to email input screen
        onboarding_page.tap_get_started_button()
        time.sleep(2)
        signup_page.tap_continue_with_email()
        time.sleep(3)
        
        # Verify we're on email screen
        assert enhanced_email_page.is_email_page_displayed(), "Not on email input screen"
        
        # Enter a valid email
        enhanced_email_page.enter_email("test@example.com")
        time.sleep(1)
        
        # Check button state before tapping
        print("\n➡️ Continue button state before tapping:")
        is_enabled = enhanced_email_page.is_continue_button_enabled()
        print(f"Button enabled: {is_enabled}")
        
        if is_enabled:
            # Try to tap the button
            print("\n👆 Attempting to tap continue button...")
            success = enhanced_email_page.tap_continue_button()
            print(f"Tap success: {success}")
            
            if success:
                print("✅ Continue button tap successful")
            else:
                print("❌ Continue button tap failed")
        else:
            print("⚠️ Continue button is disabled - cannot tap")
        
        print("✅ Continue button debugging test completed")
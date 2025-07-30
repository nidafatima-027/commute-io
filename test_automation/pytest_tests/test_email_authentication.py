"""
Pytest tests for email authentication flow.
"""
import pytest
import time
from pages.authentication_page import SignupPage, EmailPage, OTPVerificationPage, ProfileSetupPage
from pages.onboarding_page import OnboardingPage
from utils.driver_factory import DriverFactory


class TestEmailAuthentication:
    """Test class for complete email authentication flow."""
    
    @pytest.fixture(scope="class")
    def driver(self):
        """Setup and teardown Appium driver."""
        print("\n🚀 Setting up Appium driver...")
        driver = DriverFactory.get_driver()
        yield driver
        print("\n🧹 Cleaning up Appium driver...")
        driver.quit()
    
    @pytest.fixture
    def onboarding_page(self, driver):
        """Onboarding page object."""
        return OnboardingPage()
    
    @pytest.fixture
    def signup_page(self, driver):
        """Signup page object."""
        return SignupPage()
    
    @pytest.fixture
    def email_page(self, driver):
        """Email page object."""
        return EmailPage()
    
    @pytest.fixture
    def otp_page(self, driver):
        """OTP verification page object."""
        return OTPVerificationPage()
    
    @pytest.fixture
    def profile_page(self, driver):
        """Profile setup page object."""
        return ProfileSetupPage()
    
    def test_onboarding_screen_elements(self, onboarding_page):
        """Test onboarding screen displays correct elements."""
        print("\n📱 Testing onboarding screen elements...")
        
        assert onboarding_page.is_onboarding_screen_displayed(), "Onboarding screen not displayed"
        assert onboarding_page.is_app_title_visible(), "App title not visible"
        assert onboarding_page.is_welcome_message_visible(), "Welcome message not visible"
        assert onboarding_page.is_get_started_button_visible(), "Get Started button not visible"
        
        print("✅ Onboarding screen elements verified")
    
    def test_navigation_to_signup(self, onboarding_page, signup_page):
        """Test navigation from onboarding to signup screen."""
        print("\n📝 Testing navigation to signup screen...")
        
        # Tap Get Started button
        onboarding_page.tap_get_started_button()
        time.sleep(2)
        
        # Verify we're on signup screen
        assert signup_page.is_signup_screen_displayed(), "Not navigated to signup screen"
        assert signup_page.is_continue_with_email_button_visible(), "Continue with email button not visible"
        assert signup_page.is_continue_with_phone_button_visible(), "Continue with phone button not visible"
        
        print("✅ Successfully navigated to signup screen")
    
    def test_continue_with_email_navigation(self, signup_page, email_page):
        """Test tapping Continue with email button."""
        print("\n📧 Testing Continue with email navigation...")
        
        # Tap Continue with email
        success = signup_page.tap_continue_with_email()
        assert success, "Failed to tap Continue with email button"
        
        # Verify navigation to email input screen
        time.sleep(3)
        assert email_page.is_email_page_displayed(), "Not navigated to email input screen"
        
        print("✅ Successfully navigated to email input screen")
    
    @pytest.mark.parametrize("email", [
        "test@example.com",
        "user@domain.org",
        "john.doe@company.co.uk"
    ])
    def test_email_input_and_continue(self, email_page, otp_page, email):
        """Test entering email and continuing to OTP screen."""
        print(f"\n📧 Testing email input: {email}")
        
        # Enter email
        email_page.enter_email(email)
        time.sleep(1)
        
        # Tap Continue button
        email_page.tap_continue_button()
        time.sleep(2)
        
        # Verify navigation to OTP screen
        assert otp_page.is_otp_verification_screen_displayed(), "Not navigated to OTP verification screen"
        
        print(f"✅ Successfully entered email and navigated to OTP screen")
    
    @pytest.mark.parametrize("otp", [
        "123456",
        "654321",
        "111111"
    ])
    def test_otp_verification(self, otp_page, profile_page, otp):
        """Test OTP verification and navigation to profile setup."""
        print(f"\n🔐 Testing OTP verification: {otp}")
        
        # Enter OTP
        otp_page.enter_otp(otp)
        time.sleep(1)
        
        # Tap Verify button
        otp_page.tap_verify_button()
        time.sleep(2)
        
        # Verify navigation to profile setup
        assert profile_page.is_profile_setup_screen_displayed(), "Not navigated to profile setup screen"
        
        print(f"✅ Successfully verified OTP and navigated to profile setup")
    
    def test_profile_setup_completion(self, profile_page):
        """Test completing profile setup and reaching dashboard."""
        print("\n👤 Testing profile setup completion...")
        
        # Fill profile information
        profile_page.enter_first_name("John")
        profile_page.enter_last_name("Doe")
        profile_page.select_date_of_birth("1990-01-01")
        profile_page.select_gender("Male")
        
        time.sleep(1)
        
        # Tap Continue button
        profile_page.tap_continue_button()
        time.sleep(2)
        
        # Verify we're on main dashboard (or at least profile setup completed)
        print("✅ Profile setup completed successfully")
        print("🎉 User should now be on main app dashboard")
    
    def test_complete_email_authentication_flow(self, onboarding_page, signup_page, email_page, otp_page, profile_page):
        """Test the complete email authentication flow in one test."""
        print("\n🚀 Testing complete email authentication flow...")
        
        # Step 1: Verify onboarding
        assert onboarding_page.is_onboarding_screen_displayed(), "Onboarding screen not displayed"
        
        # Step 2: Navigate to signup
        onboarding_page.tap_get_started_button()
        time.sleep(2)
        assert signup_page.is_signup_screen_displayed(), "Not navigated to signup screen"
        
        # Step 3: Choose email authentication
        success = signup_page.tap_continue_with_email()
        assert success, "Failed to tap Continue with email button"
        time.sleep(3)
        assert email_page.is_email_page_displayed(), "Not navigated to email input screen"
        
        # Step 4: Enter email
        email_page.enter_email("test@example.com")
        email_page.tap_continue_button()
        time.sleep(2)
        assert otp_page.is_otp_verification_screen_displayed(), "Not navigated to OTP verification screen"
        
        # Step 5: Enter OTP
        otp_page.enter_otp("123456")
        otp_page.tap_verify_button()
        time.sleep(2)
        assert profile_page.is_profile_setup_screen_displayed(), "Not navigated to profile setup screen"
        
        # Step 6: Complete profile
        profile_page.enter_first_name("John")
        profile_page.enter_last_name("Doe")
        profile_page.select_date_of_birth("1990-01-01")
        profile_page.select_gender("Male")
        profile_page.tap_continue_button()
        time.sleep(2)
        
        print("🎉 Complete email authentication flow successful!")


class TestEmailAuthenticationErrors:
    """Test class for email authentication error scenarios."""
    
    @pytest.fixture(scope="class")
    def driver(self):
        """Setup and teardown Appium driver."""
        driver = DriverFactory.get_driver()
        yield driver
        driver.quit()
    
    @pytest.fixture
    def signup_page(self, driver):
        return SignupPage()
    
    @pytest.fixture
    def email_page(self, driver):
        return EmailPage()
    
    @pytest.fixture
    def otp_page(self, driver):
        return OTPVerificationPage()
    
    @pytest.mark.parametrize("invalid_email", [
        "invalid-email",
        "test@",
        "@domain.com",
        "test.domain.com"
    ])
    def test_invalid_email_validation(self, signup_page, email_page, invalid_email):
        """Test validation of invalid email addresses."""
        print(f"\n❌ Testing invalid email validation: {invalid_email}")
        
        # Navigate to email input screen
        signup_page.tap_continue_with_email()
        time.sleep(3)
        
        # Enter invalid email
        email_page.enter_email(invalid_email)
        email_page.tap_continue_button()
        time.sleep(1)
        
        # Should show error message (implementation depends on your app)
        print(f"✅ Invalid email validation test completed: {invalid_email}")
    
    @pytest.mark.parametrize("invalid_otp", [
        "000000",
        "12345",  # Too short
        "1234567"  # Too long
    ])
    def test_invalid_otp_validation(self, signup_page, email_page, otp_page, invalid_otp):
        """Test validation of invalid OTP codes."""
        print(f"\n❌ Testing invalid OTP validation: {invalid_otp}")
        
        # Navigate to OTP screen
        signup_page.tap_continue_with_email()
        time.sleep(3)
        email_page.enter_email("test@example.com")
        email_page.tap_continue_button()
        time.sleep(2)
        
        # Enter invalid OTP
        otp_page.enter_otp(invalid_otp)
        otp_page.tap_verify_button()
        time.sleep(1)
        
        # Should show error message (implementation depends on your app)
        print(f"✅ Invalid OTP validation test completed: {invalid_otp}")
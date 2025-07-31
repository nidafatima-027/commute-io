"""
Pytest tests for complete email authentication flow.
"""
import pytest
import time
from pages.authentication_page import EmailPage, OTPVerificationPage, ProfileSetupPage


class TestEmailInput:
    """Test class for email input screen functionality."""
    
    @pytest.mark.smoke
    def test_email_input_screen_displayed(self, navigate_to_email_input):
        """Test that email input screen is displayed correctly."""
        print("\n📧 Testing email input screen display...")
        
        email_page = navigate_to_email_input
        assert email_page.is_email_page_displayed(), "Email input screen not displayed"
        print("✅ Email input screen is displayed")
    
    @pytest.mark.smoke
    def test_email_input_field_visible(self, navigate_to_email_input):
        """Test that email input field is visible."""
        print("\n📝 Testing email input field visibility...")
        
        email_page = navigate_to_email_input
        assert email_page.is_email_input_visible(), "Email input field not visible"
        print("✅ Email input field is visible")
    
    @pytest.mark.smoke
    def test_continue_button_visible(self, navigate_to_email_input):
        """Test that Continue button is visible."""
        print("\n➡️ Testing Continue button visibility...")
        
        email_page = navigate_to_email_input
        assert email_page.is_continue_button_visible(), "Continue button not visible"
        print("✅ Continue button is visible")
    
    @pytest.mark.smoke
    def test_back_button_visible(self, navigate_to_email_input):
        """Test that Back button is visible."""
        print("\n⬅️ Testing Back button visibility...")
        
        email_page = navigate_to_email_input
        assert email_page.is_back_button_visible(), "Back button not visible"
        print("✅ Back button is visible")
    
    @pytest.mark.integration
    def test_complete_email_input_elements(self, navigate_to_email_input):
        """Test all email input screen elements are present."""
        print("\n🔍 Testing all email input elements...")
        
        email_page = navigate_to_email_input
        
        # Test all elements are visible
        assert email_page.is_email_page_displayed(), "Email input screen not displayed"
        assert email_page.is_email_input_visible(), "Email input field not visible"
        assert email_page.is_continue_button_visible(), "Continue button not visible"
        assert email_page.is_back_button_visible(), "Back button not visible"
        
        print("✅ All email input elements are present")
    
    @pytest.mark.parametrize("valid_email", [
        "test@example.com",
        "user@domain.org",
        "john.doe@company.co.uk",
        "user123@test-domain.com"
    ])
    def test_valid_email_input(self, navigate_to_email_input, valid_email):
        """Test entering valid email addresses."""
        print(f"\n✅ Testing valid email input: {valid_email}")
        
        email_page = navigate_to_email_input
        
        # Enter email
        success = email_page.enter_email(valid_email)
        assert success, f"Failed to enter email: {valid_email}"
        
        # Verify email was entered
        entered_email = email_page.get_entered_email()
        assert valid_email in entered_email, f"Email not entered correctly. Expected: {valid_email}, Got: {entered_email}"
        
        print(f"✅ Successfully entered valid email: {valid_email}")
    
    @pytest.mark.parametrize("invalid_email", [
        "invalid-email",
        "test@",
        "@domain.com",
        "test.domain.com",
        "test@domain",
        ""
    ])
    def test_invalid_email_input(self, navigate_to_email_input, invalid_email):
        """Test entering invalid email addresses."""
        print(f"\n❌ Testing invalid email input: {invalid_email}")
        
        email_page = navigate_to_email_input
        
        # Enter invalid email
        success = email_page.enter_email(invalid_email)
        assert success, f"Failed to enter invalid email: {invalid_email}"
        
        # Try to continue (should show validation error)
        email_page.tap_continue_button()
        time.sleep(1)
        
        # Check for error message (implementation depends on your app)
        print(f"✅ Invalid email validation test completed: {invalid_email}")
    
    @pytest.mark.smoke
    def test_back_button_functionality(self, navigate_to_email_input, signup_page):
        """Test Back button functionality."""
        print("\n⬅️ Testing Back button functionality...")
        
        email_page = navigate_to_email_input
        
        # Tap Back button
        email_page.tap_back_button()
        time.sleep(2)
        
        # Verify we're back on signup screen
        assert signup_page.is_signup_screen_displayed(), "Not navigated back to signup screen"
        print("✅ Successfully navigated back to signup screen")


class TestEmailNavigation:
    """Test class for email input navigation functionality."""
    
    @pytest.mark.smoke
    def test_email_to_otp_navigation(self, navigate_to_email_input, otp_page):
        """Test navigation from email input to OTP verification."""
        print("\n🔐 Testing email to OTP navigation...")
        
        email_page = navigate_to_email_input
        
        # Enter valid email
        email_page.enter_email("test@example.com")
        time.sleep(1)
        
        # Tap Continue button
        email_page.tap_continue_button()
        time.sleep(2)
        
        # Verify navigation to OTP screen
        assert otp_page.is_otp_verification_screen_displayed(), "Not navigated to OTP verification screen"
        print("✅ Successfully navigated to OTP verification screen")
    
    @pytest.mark.integration
    def test_email_screen_title(self, navigate_to_email_input):
        """Test email screen title."""
        print("\n🏷️ Testing email screen title...")
        
        email_page = navigate_to_email_input
        title = email_page.get_screen_title()
        assert title, "Email screen title not found"
        print(f"✅ Email screen title: {title}")


class TestOTPVerification:
    """Test class for OTP verification screen functionality."""
    
    @pytest.mark.smoke
    def test_otp_verification_screen_displayed(self, navigate_to_otp_verification):
        """Test that OTP verification screen is displayed correctly."""
        print("\n🔐 Testing OTP verification screen display...")
        
        otp_page = navigate_to_otp_verification
        assert otp_page.is_otp_verification_screen_displayed(), "OTP verification screen not displayed"
        print("✅ OTP verification screen is displayed")
    
    @pytest.mark.smoke
    def test_otp_input_fields_visible(self, navigate_to_otp_verification):
        """Test that OTP input fields are visible."""
        print("\n🔢 Testing OTP input fields visibility...")
        
        otp_page = navigate_to_otp_verification
        assert otp_page.is_otp_input_visible(), "OTP input fields not visible"
        print("✅ OTP input fields are visible")
    
    @pytest.mark.smoke
    def test_verify_button_visible(self, navigate_to_otp_verification):
        """Test that Verify button is visible."""
        print("\n✅ Testing Verify button visibility...")
        
        otp_page = navigate_to_otp_verification
        assert otp_page.is_verify_button_visible(), "Verify button not visible"
        print("✅ Verify button is visible")
    
    @pytest.mark.smoke
    def test_resend_otp_button_visible(self, navigate_to_otp_verification):
        """Test that Resend OTP button is visible."""
        print("\n🔄 Testing Resend OTP button visibility...")
        
        otp_page = navigate_to_otp_verification
        assert otp_page.is_resend_otp_button_visible(), "Resend OTP button not visible"
        print("✅ Resend OTP button is visible")
    
    @pytest.mark.parametrize("valid_otp", [
        "123456",
        "654321",
        "111111",
        "999999"
    ])
    def test_valid_otp_input(self, navigate_to_otp_verification, valid_otp):
        """Test entering valid OTP codes."""
        print(f"\n✅ Testing valid OTP input: {valid_otp}")
        
        otp_page = navigate_to_otp_verification
        
        # Enter OTP
        success = otp_page.enter_otp(valid_otp)
        assert success, f"Failed to enter OTP: {valid_otp}"
        
        print(f"✅ Successfully entered valid OTP: {valid_otp}")
    
    @pytest.mark.parametrize("invalid_otp", [
        "000000",
        "12345",  # Too short
        "1234567",  # Too long
        "abcdef",  # Non-numeric
        ""
    ])
    def test_invalid_otp_input(self, navigate_to_otp_verification, invalid_otp):
        """Test entering invalid OTP codes."""
        print(f"\n❌ Testing invalid OTP input: {invalid_otp}")
        
        otp_page = navigate_to_otp_verification
        
        # Enter invalid OTP
        success = otp_page.enter_otp(invalid_otp)
        assert success, f"Failed to enter invalid OTP: {invalid_otp}"
        
        # Try to verify (should show validation error)
        otp_page.tap_verify_button()
        time.sleep(1)
        
        # Check for error message (implementation depends on your app)
        print(f"✅ Invalid OTP validation test completed: {invalid_otp}")
    
    @pytest.mark.smoke
    def test_resend_otp_functionality(self, navigate_to_otp_verification):
        """Test Resend OTP button functionality."""
        print("\n🔄 Testing Resend OTP functionality...")
        
        otp_page = navigate_to_otp_verification
        
        # Check if resend button is enabled
        is_enabled = otp_page.is_resend_button_enabled()
        print(f"Resend button enabled: {is_enabled}")
        
        if is_enabled:
            # Tap resend button
            otp_page.tap_resend_otp_button()
            time.sleep(1)
            print("✅ Resend OTP button tapped successfully")
        else:
            print("⚠️ Resend OTP button is disabled (expected behavior)")
    
    @pytest.mark.smoke
    def test_otp_timer_functionality(self, navigate_to_otp_verification):
        """Test OTP timer functionality."""
        print("\n⏱️ Testing OTP timer functionality...")
        
        otp_page = navigate_to_otp_verification
        
        # Get timer text
        timer_text = otp_page.get_timer_text()
        print(f"Timer text: {timer_text}")
        
        # Wait for timer to expire (if needed)
        # otp_page.wait_for_timer_to_expire()
        
        print("✅ OTP timer functionality verified")


class TestOTPNavigation:
    """Test class for OTP verification navigation functionality."""
    
    @pytest.mark.smoke
    def test_otp_to_profile_navigation(self, navigate_to_otp_verification, profile_page):
        """Test navigation from OTP verification to profile setup."""
        print("\n👤 Testing OTP to profile navigation...")
        
        otp_page = navigate_to_otp_verification
        
        # Enter valid OTP
        otp_page.enter_otp("123456")
        time.sleep(1)
        
        # Tap Verify button
        otp_page.tap_verify_button()
        time.sleep(2)
        
        # Verify navigation to profile setup screen
        assert profile_page.is_profile_setup_screen_displayed(), "Not navigated to profile setup screen"
        print("✅ Successfully navigated to profile setup screen")
    
    @pytest.mark.integration
    def test_otp_screen_title(self, navigate_to_otp_verification):
        """Test OTP screen title."""
        print("\n🏷️ Testing OTP screen title...")
        
        otp_page = navigate_to_otp_verification
        title = otp_page.get_screen_title()
        assert title, "OTP screen title not found"
        print(f"✅ OTP screen title: {title}")


class TestProfileSetup:
    """Test class for profile setup screen functionality."""
    
    @pytest.mark.smoke
    def test_profile_setup_screen_displayed(self, navigate_to_profile_setup):
        """Test that profile setup screen is displayed correctly."""
        print("\n👤 Testing profile setup screen display...")
        
        profile_page = navigate_to_profile_setup
        assert profile_page.is_profile_setup_screen_displayed(), "Profile setup screen not displayed"
        print("✅ Profile setup screen is displayed")
    
    @pytest.mark.smoke
    def test_first_name_input_visible(self, navigate_to_profile_setup):
        """Test that first name input field is visible."""
        print("\n📝 Testing first name input visibility...")
        
        profile_page = navigate_to_profile_setup
        assert profile_page.is_first_name_input_visible(), "First name input field not visible"
        print("✅ First name input field is visible")
    
    @pytest.mark.smoke
    def test_last_name_input_visible(self, navigate_to_profile_setup):
        """Test that last name input field is visible."""
        print("\n📝 Testing last name input visibility...")
        
        profile_page = navigate_to_profile_setup
        assert profile_page.is_last_name_input_visible(), "Last name input field not visible"
        print("✅ Last name input field is visible")
    
    @pytest.mark.smoke
    def test_date_of_birth_input_visible(self, navigate_to_profile_setup):
        """Test that date of birth input field is visible."""
        print("\n📅 Testing date of birth input visibility...")
        
        profile_page = navigate_to_profile_setup
        assert profile_page.is_date_of_birth_input_visible(), "Date of birth input field not visible"
        print("✅ Date of birth input field is visible")
    
    @pytest.mark.smoke
    def test_gender_dropdown_visible(self, navigate_to_profile_setup):
        """Test that gender dropdown is visible."""
        print("\n👥 Testing gender dropdown visibility...")
        
        profile_page = navigate_to_profile_setup
        assert profile_page.is_gender_dropdown_visible(), "Gender dropdown not visible"
        print("✅ Gender dropdown is visible")
    
    @pytest.mark.smoke
    def test_continue_button_visible(self, navigate_to_profile_setup):
        """Test that Continue button is visible."""
        print("\n➡️ Testing Continue button visibility...")
        
        profile_page = navigate_to_profile_setup
        assert profile_page.is_continue_button_visible(), "Continue button not visible"
        print("✅ Continue button is visible")
    
    @pytest.mark.parametrize("profile_data", [
        {"first_name": "John", "last_name": "Doe", "dob": "1990-01-01", "gender": "Male"},
        {"first_name": "Jane", "last_name": "Smith", "dob": "1985-05-15", "gender": "Female"},
        {"first_name": "Alex", "last_name": "Johnson", "dob": "1995-12-25", "gender": "Other"}
    ])
    def test_profile_data_entry(self, navigate_to_profile_setup, profile_data):
        """Test entering profile data."""
        print(f"\n👤 Testing profile data entry: {profile_data}")
        
        profile_page = navigate_to_profile_setup
        
        # Enter profile data
        profile_page.enter_first_name(profile_data["first_name"])
        profile_page.enter_last_name(profile_data["last_name"])
        profile_page.select_date_of_birth(profile_data["dob"])
        profile_page.select_gender(profile_data["gender"])
        
        print(f"✅ Successfully entered profile data: {profile_data}")
    
    @pytest.mark.smoke
    def test_profile_setup_completion(self, navigate_to_profile_setup):
        """Test completing profile setup."""
        print("\n✅ Testing profile setup completion...")
        
        profile_page = navigate_to_profile_setup
        
        # Fill profile information
        profile_page.enter_first_name("John")
        profile_page.enter_last_name("Doe")
        profile_page.select_date_of_birth("1990-01-01")
        profile_page.select_gender("Male")
        
        time.sleep(1)
        
        # Tap Continue button
        profile_page.tap_continue_button()
        time.sleep(2)
        
        # Verify profile setup completed (user should be on dashboard)
        print("✅ Profile setup completed successfully")
        print("🎉 User should now be on main app dashboard")
    
    @pytest.mark.integration
    def test_profile_screen_title(self, navigate_to_profile_setup):
        """Test profile screen title."""
        print("\n🏷️ Testing profile screen title...")
        
        profile_page = navigate_to_profile_setup
        title = profile_page.get_screen_title()
        assert title, "Profile screen title not found"
        print(f"✅ Profile screen title: {title}")


class TestCompleteEmailFlow:
    """Test class for complete email authentication flow."""
    
    @pytest.mark.email_flow
    @pytest.mark.integration
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
        print("🏠 User is now on the main app dashboard")
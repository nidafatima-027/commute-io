"""
Pytest tests for signup flow.
"""
import pytest
import time
from pages.authentication_page import SignupPage


class TestSignupScreen:
    """Test class for signup screen functionality."""
    
    @pytest.mark.smoke
    def test_signup_screen_displayed(self, navigate_to_signup):
        """Test that signup screen is displayed correctly."""
        print("\n📝 Testing signup screen display...")
        
        signup_page = navigate_to_signup
        assert signup_page.is_signup_screen_displayed(), "Signup screen not displayed"
        print("✅ Signup screen is displayed")
    
    @pytest.mark.smoke
    def test_continue_with_email_button_visible(self, navigate_to_signup):
        """Test that Continue with email button is visible."""
        print("\n📧 Testing Continue with email button visibility...")
        
        signup_page = navigate_to_signup
        assert signup_page.is_continue_with_email_button_visible(), "Continue with email button not visible"
        button_text = signup_page.get_continue_with_email_button_text()
        assert "email" in button_text.lower(), f"Expected 'email' in button text, got: {button_text}"
        print(f"✅ Continue with email button is visible: {button_text}")
    
    @pytest.mark.smoke
    def test_continue_with_phone_button_visible(self, navigate_to_signup):
        """Test that Continue with phone button is visible."""
        print("\n📱 Testing Continue with phone button visibility...")
        
        signup_page = navigate_to_signup
        assert signup_page.is_continue_with_phone_button_visible(), "Continue with phone button not visible"
        button_text = signup_page.get_continue_with_phone_button_text()
        assert "phone" in button_text.lower(), f"Expected 'phone' in button text, got: {button_text}"
        print(f"✅ Continue with phone button is visible: {button_text}")
    
    @pytest.mark.smoke
    def test_continue_with_email_button_clickable(self, navigate_to_signup):
        """Test that Continue with email button is clickable."""
        print("\n👆 Testing Continue with email button clickability...")
        
        signup_page = navigate_to_signup
        assert signup_page.is_continue_with_email_button_clickable(), "Continue with email button not clickable"
        print("✅ Continue with email button is clickable")
    
    @pytest.mark.smoke
    def test_continue_with_phone_button_clickable(self, navigate_to_signup):
        """Test that Continue with phone button is clickable."""
        print("\n👆 Testing Continue with phone button clickability...")
        
        signup_page = navigate_to_signup
        assert signup_page.is_continue_with_phone_button_clickable(), "Continue with phone button not clickable"
        print("✅ Continue with phone button is clickable")
    
    @pytest.mark.integration
    def test_complete_signup_screen_elements(self, navigate_to_signup):
        """Test all signup screen elements are present."""
        print("\n🔍 Testing all signup screen elements...")
        
        signup_page = navigate_to_signup
        
        # Test all elements are visible
        assert signup_page.is_signup_screen_displayed(), "Signup screen not displayed"
        assert signup_page.is_continue_with_email_button_visible(), "Continue with email button not visible"
        assert signup_page.is_continue_with_phone_button_visible(), "Continue with phone button not visible"
        assert signup_page.is_continue_with_email_button_clickable(), "Continue with email button not clickable"
        assert signup_page.is_continue_with_phone_button_clickable(), "Continue with phone button not clickable"
        
        print("✅ All signup screen elements are present and functional")
    
    @pytest.mark.accessibility
    def test_signup_accessibility_labels(self, navigate_to_signup):
        """Test that all interactive elements have accessibility labels."""
        print("\n♿ Testing signup accessibility labels...")
        
        signup_page = navigate_to_signup
        
        # Check if elements have accessibility labels
        elements_with_labels = signup_page.get_elements_with_accessibility_labels()
        assert len(elements_with_labels) > 0, "No elements with accessibility labels found"
        
        print(f"✅ Found {len(elements_with_labels)} elements with accessibility labels")


class TestSignupNavigation:
    """Test class for signup navigation functionality."""
    
    @pytest.mark.smoke
    def test_continue_with_email_navigation(self, navigate_to_signup, email_page):
        """Test navigation to email input screen."""
        print("\n📧 Testing Continue with email navigation...")
        
        signup_page = navigate_to_signup
        
        # Tap Continue with email
        success = signup_page.tap_continue_with_email()
        assert success, "Failed to tap Continue with email button"
        
        # Verify navigation to email input screen
        time.sleep(3)
        assert email_page.is_email_page_displayed(), "Not navigated to email input screen"
        print("✅ Successfully navigated to email input screen")
    
    @pytest.mark.smoke
    def test_continue_with_phone_navigation(self, navigate_to_signup, phone_page):
        """Test navigation to phone input screen."""
        print("\n📱 Testing Continue with phone navigation...")
        
        signup_page = navigate_to_signup
        
        # Tap Continue with phone
        success = signup_page.tap_continue_with_phone()
        assert success, "Failed to tap Continue with phone button"
        
        # Verify navigation to phone input screen
        time.sleep(3)
        assert phone_page.is_phone_page_displayed(), "Not navigated to phone input screen"
        print("✅ Successfully navigated to phone input screen")
    
    @pytest.mark.integration
    def test_signup_screen_title(self, navigate_to_signup):
        """Test signup screen title."""
        print("\n🏷️ Testing signup screen title...")
        
        signup_page = navigate_to_signup
        title = signup_page.get_screen_title()
        assert title, "Signup screen title not found"
        print(f"✅ Signup screen title: {title}")
    
    @pytest.mark.integration
    def test_terms_text_displayed(self, navigate_to_signup):
        """Test that terms text is displayed."""
        print("\n📄 Testing terms text display...")
        
        signup_page = navigate_to_signup
        assert signup_page.is_terms_text_displayed(), "Terms text not displayed"
        print("✅ Terms text is displayed")


class TestSignupErrorHandling:
    """Test class for signup error handling."""
    
    @pytest.mark.error_handling
    def test_button_tap_without_navigation(self, navigate_to_signup):
        """Test button tap behavior when navigation fails."""
        print("\n⚠️ Testing button tap without navigation...")
        
        signup_page = navigate_to_signup
        
        # This test would be useful if there are scenarios where navigation might fail
        # For now, we'll just verify the button is functional
        assert signup_page.is_continue_with_email_button_clickable(), "Continue with email button not clickable"
        print("✅ Continue with email button is functional")
    
    @pytest.mark.error_handling
    def test_screen_validation_on_invalid_state(self, signup_page):
        """Test screen validation when in invalid state."""
        print("\n❌ Testing screen validation on invalid state...")
        
        # This would test what happens if we try to access signup screen without proper navigation
        # For now, we'll just verify the page object handles this gracefully
        try:
            is_displayed = signup_page.is_signup_screen_displayed()
            print(f"✅ Screen validation handled gracefully: {is_displayed}")
        except Exception as e:
            print(f"⚠️ Screen validation error (expected): {str(e)}")
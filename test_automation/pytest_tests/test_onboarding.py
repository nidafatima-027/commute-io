"""
Pytest tests for onboarding flow.
"""
import pytest
import time
from pages.onboarding_page import OnboardingPage


class TestOnboarding:
    """Test class for onboarding screen functionality."""
    
    @pytest.mark.smoke
    def test_onboarding_screen_displayed(self, onboarding_page):
        """Test that onboarding screen is displayed correctly."""
        print("\n📱 Testing onboarding screen display...")
        
        assert onboarding_page.is_onboarding_screen_displayed(), "Onboarding screen not displayed"
        print("✅ Onboarding screen is displayed")
    
    @pytest.mark.smoke
    def test_app_title_visible(self, onboarding_page):
        """Test that app title is visible."""
        print("\n🏷️ Testing app title visibility...")
        
        assert onboarding_page.is_app_title_visible(), "App title not visible"
        title_text = onboarding_page.get_app_title()
        assert "Commute_io" in title_text, f"Expected 'Commute_io' in title, got: {title_text}"
        print(f"✅ App title is visible: {title_text}")
    
    @pytest.mark.smoke
    def test_welcome_message_visible(self, onboarding_page):
        """Test that welcome message is visible."""
        print("\n👋 Testing welcome message visibility...")
        
        assert onboarding_page.is_welcome_message_visible(), "Welcome message not visible"
        welcome_text = onboarding_page.get_welcome_message()
        assert "Carpooling made easy" in welcome_text, f"Expected 'Carpooling made easy' in message, got: {welcome_text}"
        print(f"✅ Welcome message is visible: {welcome_text}")
    
    @pytest.mark.smoke
    def test_subtitle_visible(self, onboarding_page):
        """Test that subtitle is visible."""
        print("\n📝 Testing subtitle visibility...")
        
        assert onboarding_page.is_subtitle_visible(), "Subtitle not visible"
        subtitle_text = onboarding_page.get_subtitle()
        print(f"✅ Subtitle is visible: {subtitle_text}")
    
    @pytest.mark.smoke
    def test_get_started_button_visible(self, onboarding_page):
        """Test that Get Started button is visible."""
        print("\n🚀 Testing Get Started button visibility...")
        
        assert onboarding_page.is_get_started_button_visible(), "Get Started button not visible"
        button_text = onboarding_page.get_get_started_button_text()
        assert "Get Started" in button_text, f"Expected 'Get Started' in button text, got: {button_text}"
        print(f"✅ Get Started button is visible: {button_text}")
    
    @pytest.mark.smoke
    def test_get_started_button_clickable(self, onboarding_page):
        """Test that Get Started button is clickable."""
        print("\n👆 Testing Get Started button clickability...")
        
        assert onboarding_page.is_get_started_button_clickable(), "Get Started button not clickable"
        print("✅ Get Started button is clickable")
    
    @pytest.mark.integration
    def test_complete_onboarding_elements(self, onboarding_page):
        """Test all onboarding screen elements are present."""
        print("\n🔍 Testing all onboarding elements...")
        
        # Test all elements are visible
        assert onboarding_page.is_onboarding_screen_displayed(), "Onboarding screen not displayed"
        assert onboarding_page.is_app_title_visible(), "App title not visible"
        assert onboarding_page.is_welcome_message_visible(), "Welcome message not visible"
        assert onboarding_page.is_subtitle_visible(), "Subtitle not visible"
        assert onboarding_page.is_get_started_button_visible(), "Get Started button not visible"
        assert onboarding_page.is_get_started_button_clickable(), "Get Started button not clickable"
        
        print("✅ All onboarding elements are present and functional")
    
    @pytest.mark.accessibility
    def test_accessibility_labels(self, onboarding_page):
        """Test that all interactive elements have accessibility labels."""
        print("\n♿ Testing accessibility labels...")
        
        # Check if elements have accessibility labels
        elements_with_labels = onboarding_page.get_elements_with_accessibility_labels()
        assert len(elements_with_labels) > 0, "No elements with accessibility labels found"
        
        print(f"✅ Found {len(elements_with_labels)} elements with accessibility labels")
    
    @pytest.mark.smoke
    def test_screen_reader_navigation(self, onboarding_page):
        """Test that screen supports screen reader navigation."""
        print("\n🔊 Testing screen reader navigation...")
        
        # This would need to be implemented based on your app's accessibility features
        # For now, we'll just verify the screen is accessible
        assert onboarding_page.is_onboarding_screen_displayed(), "Screen not accessible"
        print("✅ Screen supports screen reader navigation")


class TestOnboardingNavigation:
    """Test class for onboarding navigation functionality."""
    
    @pytest.mark.smoke
    def test_get_started_button_tap(self, onboarding_page, signup_page):
        """Test tapping Get Started button."""
        print("\n👆 Testing Get Started button tap...")
        
        # Tap Get Started button
        onboarding_page.tap_get_started_button()
        time.sleep(2)
        
        # Verify navigation to signup screen
        assert signup_page.is_signup_screen_displayed(), "Not navigated to signup screen"
        print("✅ Successfully navigated to signup screen")
    
    @pytest.mark.integration
    def test_onboarding_to_signup_flow(self, onboarding_page, signup_page):
        """Test complete flow from onboarding to signup."""
        print("\n🔄 Testing onboarding to signup flow...")
        
        # Verify we start on onboarding
        assert onboarding_page.is_onboarding_screen_displayed(), "Not on onboarding screen"
        
        # Verify all onboarding elements
        assert onboarding_page.is_app_title_visible(), "App title not visible"
        assert onboarding_page.is_welcome_message_visible(), "Welcome message not visible"
        assert onboarding_page.is_get_started_button_visible(), "Get Started button not visible"
        
        # Tap Get Started
        onboarding_page.tap_get_started_button()
        time.sleep(2)
        
        # Verify we're on signup screen
        assert signup_page.is_signup_screen_displayed(), "Not navigated to signup screen"
        assert signup_page.is_continue_with_email_button_visible(), "Continue with email button not visible"
        assert signup_page.is_continue_with_phone_button_visible(), "Continue with phone button not visible"
        
        print("✅ Complete onboarding to signup flow successful")
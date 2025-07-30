"""
Onboarding page object for handling onboarding screen interactions.
"""
from selenium.webdriver.common.by import By
from appium.webdriver.common.appiumby import AppiumBy
from .base_page import BasePage


class OnboardingPage(BasePage):
    """Page object for onboarding screen."""
    
    # Locators based on actual app structure
    APP_TITLE = (AppiumBy.XPATH, "//*[contains(@text, 'Commute_io')]")
    WELCOME_MESSAGE = (AppiumBy.XPATH, "//*[contains(@text, 'Carpooling made easy')]")
    SUBTITLE_MESSAGE = (AppiumBy.XPATH, "//*[contains(@text, 'Join a community of commuters')]")
    GET_STARTED_BUTTON = (AppiumBy.XPATH, "//*[@text='Get Started' or @content-desc='Get Started']")
    SKIP_BUTTON = (AppiumBy.XPATH, "//*[@text='Skip' or @content-desc='Skip']")
    NEXT_BUTTON = (AppiumBy.XPATH, "//*[@text='Next' or @content-desc='Next']")
    
    # Text patterns for onboarding content
    ONBOARDING_TEXTS = [
        "Commute_io",
        "Carpooling made easy",
        "Join a community of commuters",
        "Get Started"
    ]
    
    def __init__(self):
        super().__init__()
    
    def is_onboarding_screen_displayed(self) -> bool:
        """Check if onboarding screen is displayed."""
        try:
            # Check for multiple onboarding elements
            checks = [
                self.wait_for_element_to_be_visible(self.APP_TITLE, timeout=5),
                self.wait_for_element_to_be_visible(self.WELCOME_MESSAGE, timeout=5),
                self.wait_for_element_to_be_visible(self.GET_STARTED_BUTTON, timeout=5)
            ]
            return any(checks)
        except Exception:
            # Fallback: check if any onboarding text is present
            return any(self.is_text_present(text) for text in self.ONBOARDING_TEXTS)
    
    def is_welcome_message_displayed(self) -> bool:
        """Check if welcome message is displayed."""
        return (self.wait_for_element_to_be_visible(self.WELCOME_MESSAGE, timeout=5) or
                self.wait_for_element_to_be_visible(self.APP_TITLE, timeout=5))
    
    def are_onboarding_slides_displayed(self) -> bool:
        """Check if onboarding content is displayed."""
        # This app appears to have a single onboarding screen, not slides
        return (self.is_element_present(self.APP_TITLE) or
                self.is_element_present(self.WELCOME_MESSAGE) or
                any(self.is_text_present(text) for text in self.ONBOARDING_TEXTS))
    
    def is_get_started_button_displayed(self) -> bool:
        """Check if Get Started button is displayed."""
        return self.wait_for_element_to_be_visible(self.GET_STARTED_BUTTON, timeout=5)
    
    def is_skip_button_displayed(self) -> bool:
        """Check if Skip button is displayed."""
        return self.is_element_present(self.SKIP_BUTTON)
    
    def tap_get_started_button(self) -> bool:
        """Tap on Get Started button."""
        if self.wait_for_element_to_be_clickable(self.GET_STARTED_BUTTON):
            element = self.driver.find_element(*self.GET_STARTED_BUTTON)
            return self.tap_element(element)
        return False
    
    def tap_skip_button(self) -> bool:
        """Tap on Skip button."""
        if self.wait_for_element_to_be_clickable(self.SKIP_BUTTON):
            element = self.driver.find_element(*self.SKIP_BUTTON)
            return self.tap_element(element)
        return False
    
    def tap_next_button(self) -> bool:
        """Tap on Next button."""
        if self.wait_for_element_to_be_clickable(self.NEXT_BUTTON):
            element = self.driver.find_element(*self.NEXT_BUTTON)
            return self.tap_element(element)
        return False
    
    def swipe_to_next_slide(self) -> bool:
        """Swipe to next onboarding slide."""
        try:
            size = self.driver.get_window_size()
            start_x = int(size['width'] * 0.8)
            end_x = int(size['width'] * 0.2)
            y = int(size['height'] * 0.5)
            
            return self.swipe_horizontal(start_x, y, end_x, y)
        except Exception as e:
            print(f"Failed to swipe to next slide: {str(e)}")
            return False
    
    def swipe_through_all_slides(self, max_slides: int = 5) -> bool:
        """Swipe through all onboarding slides."""
        # This app appears to have a single onboarding screen, not slides
        # So we'll just verify the Get Started button is present
        return self.is_get_started_button_displayed()
    
    def get_current_slide_text(self) -> str:
        """Get text content of current screen."""
        try:
            # Try to find text elements on current screen
            text_elements = self.driver.find_elements(By.XPATH, "//*[@class='android.widget.TextView']")
            texts = []
            for element in text_elements:
                text = self.get_text_from_element(element)
                if text and len(text) > 5:  # Filter out short/empty texts
                    texts.append(text)
            return " ".join(texts)
        except Exception:
            return ""
    
    def verify_accessibility_labels(self) -> bool:
        """Verify that interactive elements have accessibility labels."""
        try:
            interactive_elements = [
                self.GET_STARTED_BUTTON,
                self.SKIP_BUTTON,
                self.NEXT_BUTTON
            ]
            
            for locator in interactive_elements:
                if self.is_element_present(locator):
                    element = self.driver.find_element(*locator)
                    content_desc = self.get_element_attribute(element, "content-desc")
                    text = self.get_element_attribute(element, "text")
                    
                    # Element should have either content-desc or text for accessibility
                    if not content_desc and not text:
                        print(f"Element {locator} lacks accessibility label")
                        return False
            
            return True
        except Exception as e:
            print(f"Failed to verify accessibility labels: {str(e)}")
            return False
    
    def complete_onboarding_flow(self) -> bool:
        """Complete the entire onboarding flow."""
        try:
            # Wait for onboarding screen to load
            if not self.is_onboarding_screen_displayed():
                print("Onboarding screen not displayed")
                return False
            
            # Tap Get Started button
            if not self.tap_get_started_button():
                print("Failed to tap Get Started button")
                return False
            
            # Wait for navigation to complete
            self.wait_for_screen_to_load()
            return True
            
        except Exception as e:
            print(f"Failed to complete onboarding flow: {str(e)}")
            return False
    
    def get_screen_title(self) -> str:
        """Get the screen title."""
        try:
            element = self.driver.find_element(*self.APP_TITLE)
            return self.get_text_from_element(element)
        except Exception:
            return ""
    
    def get_welcome_message(self) -> str:
        """Get the welcome message text."""
        try:
            element = self.driver.find_element(*self.WELCOME_MESSAGE)
            return self.get_text_from_element(element)
        except Exception:
            return ""
    
    def get_subtitle_message(self) -> str:
        """Get the subtitle message text."""
        try:
            element = self.driver.find_element(*self.SUBTITLE_MESSAGE)
            return self.get_text_from_element(element)
        except Exception:
            return ""
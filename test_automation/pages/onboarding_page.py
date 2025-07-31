"""
Onboarding page object for handling onboarding screen interactions.
Based on Figma design analysis.
"""
from selenium.webdriver.common.by import By
from appium.webdriver.common.appiumby import AppiumBy
from .base_page import BasePage


class OnboardingPage(BasePage):
    """Page object for onboarding screen based on Figma design."""
    
    # Locators based on exact Figma design
    APP_TITLE = (AppiumBy.XPATH, "//*[contains(@text, 'Commute_io') or contains(@content-desc, 'Commute_io')]")
    WELCOME_MESSAGE = (AppiumBy.XPATH, "//*[contains(@text, 'Carpooling made easy') or contains(@content-desc, 'Carpooling made easy')]")
    SUBTITLE_MESSAGE = (AppiumBy.XPATH, "//*[contains(@text, 'Join a community of commuters') or contains(@content-desc, 'Join a community of commuters')]")
    GET_STARTED_BUTTON = (AppiumBy.XPATH, "//*[@text='Get Started' or @content-desc='Get Started' or contains(@text, 'Get Started')]")
    SKIP_BUTTON = (AppiumBy.XPATH, "//*[@text='Skip' or @content-desc='Skip']")
    
    # Alternative locators for better element detection
    APP_LOGO = (AppiumBy.XPATH, "//*[contains(@resource-id, 'logo') or contains(@class, 'Image')]")
    BACKGROUND_GRADIENT = (AppiumBy.XPATH, "//*[contains(@class, 'LinearGradient') or contains(@resource-id, 'background')]")
    
    # Text patterns for onboarding content (from Figma)
    ONBOARDING_TEXTS = [
        "Commute_io",
        "Carpooling made easy",
        "Join a community of commuters",
        "Get Started"
    ]
    
    def __init__(self):
        super().__init__()
    
    def is_onboarding_screen_displayed(self) -> bool:
        """Check if onboarding screen is displayed based on Figma design."""
        try:
            # Check for multiple onboarding elements from Figma
            checks = [
                self.wait_for_element_to_be_visible(self.APP_TITLE, timeout=10),
                self.wait_for_element_to_be_visible(self.WELCOME_MESSAGE, timeout=10),
                self.wait_for_element_to_be_visible(self.GET_STARTED_BUTTON, timeout=10)
            ]
            return any(checks)
        except Exception:
            # Fallback: check if any onboarding text is present
            return any(self.is_text_present(text) for text in self.ONBOARDING_TEXTS)
    
    def is_welcome_message_displayed(self) -> bool:
        """Check if welcome message is displayed."""
        return (self.wait_for_element_to_be_visible(self.WELCOME_MESSAGE, timeout=10) or
                self.wait_for_element_to_be_visible(self.APP_TITLE, timeout=10))
    
    def are_onboarding_slides_displayed(self) -> bool:
        """Check if onboarding content is displayed."""
        # Based on Figma, this is a single screen with all elements visible
        return (self.is_element_present(self.APP_TITLE) or
                self.is_element_present(self.WELCOME_MESSAGE) or
                any(self.is_text_present(text) for text in self.ONBOARDING_TEXTS))
    
    def is_get_started_button_displayed(self) -> bool:
        """Check if Get Started button is displayed."""
        return self.wait_for_element_to_be_visible(self.GET_STARTED_BUTTON, timeout=10)
    
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
    
    def verify_accessibility_labels(self) -> bool:
        """Verify that interactive elements have accessibility labels."""
        try:
            interactive_elements = [
                self.GET_STARTED_BUTTON,
                self.SKIP_BUTTON
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
    
    def get_all_visible_texts(self) -> list:
        """Get all visible text elements for debugging."""
        try:
            text_elements = self.driver.find_elements(By.XPATH, "//*[@class='android.widget.TextView']")
            texts = []
            for element in text_elements:
                text = self.get_text_from_element(element)
                if text and len(text.strip()) > 0:
                    texts.append(text.strip())
            return texts
        except Exception:
            return []
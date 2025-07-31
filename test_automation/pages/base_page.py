"""
Base page object class for all page objects.
"""
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from appium.webdriver.common.appiumby import AppiumBy

from utils.driver_factory import create_driver, close_driver, wait_for_element, wait_for_element_clickable
from utils.screenshot_helper import ScreenshotHelper


class BasePage:
    """Base class for all page objects."""
    
    def __init__(self, driver=None):
        """Initialize the base page with driver."""
        if driver:
            self.driver = driver
        else:
            self.driver = create_driver()
        self.wait = WebDriverWait(self.driver, 30)
        self.screenshot_helper = ScreenshotHelper()
    
    def wait_for_element(self, locator, timeout=30):
        """Wait for an element to be present and visible."""
        try:
            element = WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located(locator)
            )
            return element
        except TimeoutException:
            print(f"⏰ Timeout waiting for element: {locator}")
            return None
    
    def wait_for_element_clickable(self, locator, timeout=30):
        """Wait for an element to be clickable."""
        try:
            element = WebDriverWait(self.driver, timeout).until(
                EC.element_to_be_clickable(locator)
            )
            return element
        except TimeoutException:
            print(f"⏰ Timeout waiting for clickable element: {locator}")
            return None
    
    def take_screenshot(self, name):
        """Take a screenshot."""
        return self.screenshot_helper.take_screenshot(self.driver, name)
    
    def is_element_present(self, locator, timeout=10):
        """Check if an element is present on the page."""
        try:
            element = self.wait_for_element(locator, timeout)
            return element is not None
        except:
            return False
    
    def is_element_clickable(self, locator, timeout=10):
        """Check if an element is clickable."""
        try:
            element = self.wait_for_element_clickable(locator, timeout)
            return element is not None
        except:
            return False
    
    def get_element_text(self, locator):
        """Get the text of an element."""
        try:
            element = self.wait_for_element(locator)
            return element.text if element else ""
        except:
            return ""
    
    def click_element(self, locator):
        """Click an element."""
        try:
            element = self.wait_for_element_clickable(locator)
            if element:
                element.click()
                return True
            return False
        except Exception as e:
            print(f"❌ Failed to click element {locator}: {str(e)}")
            return False
    
    def enter_text(self, locator, text):
        """Enter text into an input field."""
        try:
            element = self.wait_for_element(locator)
            if element:
                element.clear()
                element.send_keys(text)
                return True
            return False
        except Exception as e:
            print(f"❌ Failed to enter text in {locator}: {str(e)}")
            return False
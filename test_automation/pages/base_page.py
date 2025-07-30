"""
Base page class with common functionality for all page objects.
"""
import time
from typing import Optional, List, Tuple
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from appium.webdriver.common.appiumby import AppiumBy
# TouchAction is deprecated in newer Appium versions, using W3C Actions instead
from utils.driver_factory import DriverFactory
from utils.screenshot_helper import ScreenshotHelper


class BasePage:
    """Base page class with common functionality."""
    
    def __init__(self):
        self.driver = DriverFactory.get_driver()
        self.wait = DriverFactory.get_wait()
        self.config = DriverFactory.load_config()
        self.timeouts = self.config.get('timeouts', {})
    
    # Common locator strategies
    def find_element_by_text(self, text: str, exact_match: bool = True) -> Optional:
        """Find element by text content."""
        try:
            if exact_match:
                xpath = f"//*[@text='{text}']"
            else:
                xpath = f"//*[contains(@text, '{text}')]"
            return self.driver.find_element(By.XPATH, xpath)
        except NoSuchElementException:
            return None
    
    def find_element_by_content_desc(self, content_desc: str) -> Optional:
        """Find element by content description."""
        try:
            return self.driver.find_element(AppiumBy.ACCESSIBILITY_ID, content_desc)
        except NoSuchElementException:
            return None
    
    def find_element_by_id(self, resource_id: str) -> Optional:
        """Find element by resource ID."""
        try:
            return self.driver.find_element(AppiumBy.ID, resource_id)
        except NoSuchElementException:
            return None
    
    def find_elements_by_class(self, class_name: str) -> List:
        """Find elements by class name."""
        try:
            return self.driver.find_elements(AppiumBy.CLASS_NAME, class_name)
        except NoSuchElementException:
            return []
    
    # Wait methods
    def wait_for_element_to_be_clickable(self, locator: Tuple[str, str], timeout: Optional[int] = None) -> bool:
        """Wait for element to be clickable."""
        try:
            timeout = timeout or self.timeouts.get('medium', 10)
            WebDriverWait(self.driver, timeout).until(EC.element_to_be_clickable(locator))
            return True
        except TimeoutException:
            return False
    
    def wait_for_element_to_be_visible(self, locator: Tuple[str, str], timeout: Optional[int] = None) -> bool:
        """Wait for element to be visible."""
        try:
            timeout = timeout or self.timeouts.get('medium', 10)
            WebDriverWait(self.driver, timeout).until(EC.visibility_of_element_located(locator))
            return True
        except TimeoutException:
            return False
    
    def wait_for_text_to_be_present(self, text: str, timeout: Optional[int] = None) -> bool:
        """Wait for specific text to be present on screen."""
        try:
            timeout = timeout or self.timeouts.get('medium', 10)
            WebDriverWait(self.driver, timeout).until(
                lambda driver: self.find_element_by_text(text, exact_match=False) is not None
            )
            return True
        except TimeoutException:
            return False
    
    # Action methods
    def tap_element(self, element) -> bool:
        """Tap on an element."""
        try:
            element.click()
            return True
        except Exception as e:
            print(f"Failed to tap element: {str(e)}")
            return False
    
    def tap_by_coordinates(self, x: int, y: int) -> bool:
        """Tap at specific coordinates using W3C Actions."""
        try:
            from selenium.webdriver.common.action_chains import ActionChains
            actions = ActionChains(self.driver)
            actions.move_by_offset(x, y).click().perform()
            return True
        except Exception as e:
            print(f"Failed to tap coordinates ({x}, {y}): {str(e)}")
            return False
    
    def enter_text(self, element, text: str) -> bool:
        """Enter text into an element."""
        try:
            element.clear()
            element.send_keys(text)
            return True
        except Exception as e:
            print(f"Failed to enter text '{text}': {str(e)}")
            return False
    
    def swipe_horizontal(self, start_x: int, start_y: int, end_x: int, end_y: int, duration: int = 1000) -> bool:
        """Perform horizontal swipe gesture."""
        try:
            self.driver.swipe(start_x, start_y, end_x, end_y, duration)
            return True
        except Exception as e:
            print(f"Failed to swipe: {str(e)}")
            return False
    
    def swipe_vertical(self, direction: str = "up", distance: int = 500) -> bool:
        """Perform vertical swipe gesture."""
        try:
            size = self.driver.get_window_size()
            start_x = size['width'] // 2
            start_y = size['height'] // 2
            
            if direction.lower() == "up":
                end_y = start_y - distance
            else:  # down
                end_y = start_y + distance
            
            self.driver.swipe(start_x, start_y, start_x, end_y, 1000)
            return True
        except Exception as e:
            print(f"Failed to swipe {direction}: {str(e)}")
            return False
    
    def scroll_to_element(self, text: str, max_scrolls: int = 5) -> bool:
        """Scroll to find an element with specific text."""
        for _ in range(max_scrolls):
            if self.find_element_by_text(text, exact_match=False):
                return True
            self.swipe_vertical("up")
            time.sleep(1)
        return False
    
    # Validation methods
    def is_element_present(self, locator: Tuple[str, str]) -> bool:
        """Check if element is present."""
        try:
            self.driver.find_element(*locator)
            return True
        except NoSuchElementException:
            return False
    
    def is_text_present(self, text: str) -> bool:
        """Check if text is present on screen."""
        return self.find_element_by_text(text, exact_match=False) is not None
    
    def get_text_from_element(self, element) -> str:
        """Get text content from an element."""
        try:
            return element.text
        except Exception:
            return ""
    
    def get_element_attribute(self, element, attribute: str) -> str:
        """Get attribute value from an element."""
        try:
            return element.get_attribute(attribute)
        except Exception:
            return ""
    
    # Screen management
    def take_screenshot(self, filename: Optional[str] = None) -> str:
        """Take a screenshot of current screen."""
        return ScreenshotHelper.capture_screenshot(filename)
    
    def wait_for_screen_to_load(self, timeout: Optional[int] = None) -> None:
        """Wait for screen to fully load."""
        timeout = timeout or self.timeouts.get('medium', 10)
        time.sleep(2)  # Basic wait for screen to stabilize
    
    def back_button(self) -> bool:
        """Press Android back button."""
        try:
            self.driver.back()
            return True
        except Exception as e:
            print(f"Failed to press back button: {str(e)}")
            return False
    
    def home_button(self) -> bool:
        """Press Android home button."""
        try:
            self.driver.press_keycode(3)  # KEYCODE_HOME
            return True
        except Exception as e:
            print(f"Failed to press home button: {str(e)}")
            return False
    
    # Utility methods
    def get_current_activity(self) -> str:
        """Get current activity name."""
        try:
            return self.driver.current_activity
        except Exception:
            return ""
    
    def hide_keyboard(self) -> bool:
        """Hide soft keyboard if visible."""
        try:
            if self.driver.is_keyboard_shown():
                self.driver.hide_keyboard()
            return True
        except Exception:
            return False
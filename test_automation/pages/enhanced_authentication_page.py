"""
Enhanced authentication page objects with better locators and debugging.
"""
from selenium.webdriver.common.by import By
from appium.webdriver.common.appiumby import AppiumBy
from .base_page import BasePage
import time


class EnhancedEmailPage(BasePage):
    """Enhanced page object for email input screen with better locators."""
    
    # Multiple locator strategies for email input
    EMAIL_INPUT_STRATEGIES = [
        (AppiumBy.XPATH, "//*[contains(@resource-id, 'email') or contains(@hint, 'email') or contains(@placeholder, 'email')]"),
        (AppiumBy.XPATH, "//android.widget.EditText[contains(@resource-id, 'email') or contains(@hint, 'email')]"),
        (AppiumBy.XPATH, "//*[@class='android.widget.EditText']"),
        (AppiumBy.XPATH, "//*[contains(@text, 'email') or contains(@text, 'Email')]"),
        (AppiumBy.ACCESSIBILITY_ID, "email"),
        (AppiumBy.ID, "email"),
    ]
    
    # Multiple locator strategies for continue button
    CONTINUE_BUTTON_STRATEGIES = [
        (AppiumBy.XPATH, "//*[@text='Continue' or @content-desc='Continue']"),
        (AppiumBy.XPATH, "//android.widget.Button[@text='Continue' or @content-desc='Continue']"),
        (AppiumBy.XPATH, "//*[@class='android.widget.Button' and contains(@text, 'Continue')]"),
        (AppiumBy.XPATH, "//*[contains(@text, 'Continue')]"),
        (AppiumBy.ACCESSIBILITY_ID, "continue"),
        (AppiumBy.ID, "continue"),
    ]
    
    # Screen identification locators
    SCREEN_IDENTIFIERS = [
        (AppiumBy.XPATH, "//*[contains(@text, 'Email') or contains(@content-desc, 'Email')]"),
        (AppiumBy.XPATH, "//*[contains(@text, 'Enter your email') or contains(@text, 'Email address')]"),
        (AppiumBy.XPATH, "//*[contains(@text, 'email') or contains(@text, 'Email')]"),
    ]
    
    def __init__(self):
        super().__init__()
    
    def is_email_page_displayed(self) -> bool:
        """Check if email page is displayed with multiple strategies."""
        print("🔍 Checking if email page is displayed...")
        
        try:
            # Try screen identifiers first
            for i, locator in enumerate(self.SCREEN_IDENTIFIERS):
                try:
                    if self.wait_for_element_to_be_visible(locator, timeout=3):
                        element = self.driver.find_element(*locator)
                        text = self.get_text_from_element(element)
                        print(f"✓ Found email page identifier {i+1}: '{text}'")
                        return True
                except Exception as e:
                    print(f"✗ Email page identifier {i+1} failed: {str(e)}")
                    continue
            
            # Try email input field
            for i, locator in enumerate(self.EMAIL_INPUT_STRATEGIES):
                try:
                    if self.wait_for_element_to_be_visible(locator, timeout=3):
                        print(f"✓ Found email input field with strategy {i+1}")
                        return True
                except Exception as e:
                    print(f"✗ Email input strategy {i+1} failed: {str(e)}")
                    continue
            
            # Try continue button
            for i, locator in enumerate(self.CONTINUE_BUTTON_STRATEGIES):
                try:
                    if self.wait_for_element_to_be_visible(locator, timeout=3):
                        print(f"✓ Found continue button with strategy {i+1}")
                        return True
                except Exception as e:
                    print(f"✗ Continue button strategy {i+1} failed: {str(e)}")
                    continue
            
            print("✗ No email page elements found")
            return False
            
        except Exception as e:
            print(f"❌ Error checking email page: {str(e)}")
            return False
    
    def enter_email(self, email: str) -> bool:
        """Enter email address with multiple locator strategies."""
        print(f"📧 Entering email: {email}")
        
        for i, locator in enumerate(self.EMAIL_INPUT_STRATEGIES):
            try:
                print(f"Trying email input strategy {i+1}: {locator[1]}")
                
                if self.wait_for_element_to_be_visible(locator, timeout=3):
                    element = self.driver.find_element(*locator)
                    print(f"✓ Found email input field: {locator[1]}")
                    
                    # Clear existing text
                    try:
                        element.clear()
                        print("✓ Cleared existing text")
                    except Exception as e:
                        print(f"⚠️ Could not clear text: {str(e)}")
                    
                    # Enter email
                    success = self.enter_text(element, email)
                    if success:
                        print(f"✓ Successfully entered email: {email}")
                        
                        # Verify email was entered
                        entered_text = element.get_attribute('text')
                        if email in entered_text:
                            print(f"✓ Email verification successful: {entered_text}")
                            return True
                        else:
                            print(f"⚠️ Email verification failed. Expected: {email}, Got: {entered_text}")
                            continue
                    else:
                        print(f"✗ Failed to enter email with strategy {i+1}")
                        continue
                else:
                    print(f"✗ Email input strategy {i+1} not found")
                    continue
                    
            except Exception as e:
                print(f"✗ Email input strategy {i+1} failed: {str(e)}")
                continue
        
        print("✗ All email input strategies failed")
        return False
    
    def tap_continue_button(self) -> bool:
        """Tap continue button with multiple locator strategies and validation."""
        print("➡️ Tapping Continue button...")
        
        for i, locator in enumerate(self.CONTINUE_BUTTON_STRATEGIES):
            try:
                print(f"Trying continue button strategy {i+1}: {locator[1]}")
                
                # Check if button is visible and clickable
                if self.wait_for_element_to_be_clickable(locator, timeout=5):
                    element = self.driver.find_element(*locator)
                    button_text = self.get_text_from_element(element)
                    print(f"✓ Found Continue button: '{button_text}'")
                    
                    # Check if button is enabled
                    if element.is_enabled():
                        print("✓ Continue button is enabled")
                        
                        # Get button state before tapping
                        is_enabled_before = element.is_enabled()
                        print(f"Button enabled before tap: {is_enabled_before}")
                        
                        # Tap the button
                        success = self.tap_element(element)
                        if success:
                            print("✓ Successfully tapped Continue button")
                            
                            # Wait for navigation
                            time.sleep(3)
                            
                            # Check if button is still enabled (should be disabled after tap)
                            try:
                                is_enabled_after = element.is_enabled()
                                print(f"Button enabled after tap: {is_enabled_after}")
                            except:
                                print("✓ Button no longer accessible (navigation successful)")
                            
                            return True
                        else:
                            print(f"✗ Failed to tap Continue button with strategy {i+1}")
                            continue
                    else:
                        print("⚠️ Continue button is disabled")
                        
                        # Wait a bit and check again
                        time.sleep(2)
                        if element.is_enabled():
                            print("✓ Continue button is now enabled")
                            success = self.tap_element(element)
                            if success:
                                print("✓ Successfully tapped Continue button")
                                time.sleep(3)
                                return True
                        else:
                            print("✗ Continue button is still disabled")
                            continue
                else:
                    print(f"✗ Continue button strategy {i+1} not found or not clickable")
                    continue
                    
            except Exception as e:
                print(f"✗ Continue button strategy {i+1} failed: {str(e)}")
                continue
        
        print("✗ All continue button strategies failed")
        return False
    
    def get_entered_email(self) -> str:
        """Get the currently entered email."""
        for locator in self.EMAIL_INPUT_STRATEGIES:
            try:
                if self.wait_for_element_to_be_visible(locator, timeout=2):
                    element = self.driver.find_element(*locator)
                    return element.get_attribute('text') or element.get_attribute('value') or ''
            except:
                continue
        return ''
    
    def is_continue_button_enabled(self) -> bool:
        """Check if continue button is enabled."""
        for locator in self.CONTINUE_BUTTON_STRATEGIES:
            try:
                if self.wait_for_element_to_be_visible(locator, timeout=2):
                    element = self.driver.find_element(*locator)
                    return element.is_enabled()
            except:
                continue
        return False
    
    def list_all_visible_elements(self) -> list:
        """List all visible elements on the email page for debugging."""
        print("🔍 Listing all visible elements on email page...")
        return super().list_all_visible_elements()


class EnhancedOTPVerificationPage(BasePage):
    """Enhanced page object for OTP verification screen."""
    
    # Multiple locator strategies for OTP input
    OTP_INPUT_STRATEGIES = [
        (AppiumBy.XPATH, "//*[contains(@resource-id, 'otp') or contains(@hint, 'OTP') or contains(@placeholder, 'OTP')]"),
        (AppiumBy.XPATH, "//android.widget.EditText[contains(@resource-id, 'otp') or contains(@hint, 'OTP')]"),
        (AppiumBy.XPATH, "//*[@class='android.widget.EditText']"),
        (AppiumBy.XPATH, "//*[contains(@text, 'OTP') or contains(@text, 'otp')]"),
        (AppiumBy.ACCESSIBILITY_ID, "otp"),
        (AppiumBy.ID, "otp"),
    ]
    
    # Multiple locator strategies for verify button
    VERIFY_BUTTON_STRATEGIES = [
        (AppiumBy.XPATH, "//*[@text='Verify' or @content-desc='Verify']"),
        (AppiumBy.XPATH, "//android.widget.Button[@text='Verify' or @content-desc='Verify']"),
        (AppiumBy.XPATH, "//*[@class='android.widget.Button' and contains(@text, 'Verify')]"),
        (AppiumBy.XPATH, "//*[contains(@text, 'Verify')]"),
        (AppiumBy.ACCESSIBILITY_ID, "verify"),
        (AppiumBy.ID, "verify"),
    ]
    
    # Screen identification locators
    SCREEN_IDENTIFIERS = [
        (AppiumBy.XPATH, "//*[contains(@text, 'OTP') or contains(@content-desc, 'OTP')]"),
        (AppiumBy.XPATH, "//*[contains(@text, 'verification') or contains(@text, 'Verification')]"),
        (AppiumBy.XPATH, "//*[contains(@text, 'Enter OTP') or contains(@text, 'Enter the code')]"),
    ]
    
    def __init__(self):
        super().__init__()
    
    def is_otp_verification_screen_displayed(self) -> bool:
        """Check if OTP verification screen is displayed with multiple strategies."""
        print("🔍 Checking if OTP verification screen is displayed...")
        
        try:
            # Try screen identifiers first
            for i, locator in enumerate(self.SCREEN_IDENTIFIERS):
                try:
                    if self.wait_for_element_to_be_visible(locator, timeout=3):
                        element = self.driver.find_element(*locator)
                        text = self.get_text_from_element(element)
                        print(f"✓ Found OTP screen identifier {i+1}: '{text}'")
                        return True
                except Exception as e:
                    print(f"✗ OTP screen identifier {i+1} failed: {str(e)}")
                    continue
            
            # Try OTP input field
            for i, locator in enumerate(self.OTP_INPUT_STRATEGIES):
                try:
                    if self.wait_for_element_to_be_visible(locator, timeout=3):
                        print(f"✓ Found OTP input field with strategy {i+1}")
                        return True
                except Exception as e:
                    print(f"✗ OTP input strategy {i+1} failed: {str(e)}")
                    continue
            
            # Try verify button
            for i, locator in enumerate(self.VERIFY_BUTTON_STRATEGIES):
                try:
                    if self.wait_for_element_to_be_visible(locator, timeout=3):
                        print(f"✓ Found verify button with strategy {i+1}")
                        return True
                except Exception as e:
                    print(f"✗ Verify button strategy {i+1} failed: {str(e)}")
                    continue
            
            print("✗ No OTP verification screen elements found")
            return False
            
        except Exception as e:
            print(f"❌ Error checking OTP verification screen: {str(e)}")
            return False
    
    def enter_otp(self, otp: str) -> bool:
        """Enter OTP with multiple locator strategies."""
        print(f"🔢 Entering OTP: {otp}")
        
        for i, locator in enumerate(self.OTP_INPUT_STRATEGIES):
            try:
                print(f"Trying OTP input strategy {i+1}: {locator[1]}")
                
                if self.wait_for_element_to_be_visible(locator, timeout=3):
                    element = self.driver.find_element(*locator)
                    print(f"✓ Found OTP input field: {locator[1]}")
                    
                    # Clear existing text
                    try:
                        element.clear()
                        print("✓ Cleared existing text")
                    except Exception as e:
                        print(f"⚠️ Could not clear text: {str(e)}")
                    
                    # Enter OTP
                    success = self.enter_text(element, otp)
                    if success:
                        print(f"✓ Successfully entered OTP: {otp}")
                        return True
                    else:
                        print(f"✗ Failed to enter OTP with strategy {i+1}")
                        continue
                else:
                    print(f"✗ OTP input strategy {i+1} not found")
                    continue
                    
            except Exception as e:
                print(f"✗ OTP input strategy {i+1} failed: {str(e)}")
                continue
        
        print("✗ All OTP input strategies failed")
        return False
    
    def tap_verify_button(self) -> bool:
        """Tap verify button with multiple locator strategies."""
        print("✅ Tapping Verify button...")
        
        for i, locator in enumerate(self.VERIFY_BUTTON_STRATEGIES):
            try:
                print(f"Trying verify button strategy {i+1}: {locator[1]}")
                
                if self.wait_for_element_to_be_clickable(locator, timeout=5):
                    element = self.driver.find_element(*locator)
                    button_text = self.get_text_from_element(element)
                    print(f"✓ Found Verify button: '{button_text}'")
                    
                    if element.is_enabled():
                        print("✓ Verify button is enabled")
                        success = self.tap_element(element)
                        if success:
                            print("✓ Successfully tapped Verify button")
                            time.sleep(3)
                            return True
                        else:
                            print(f"✗ Failed to tap Verify button with strategy {i+1}")
                            continue
                    else:
                        print("⚠️ Verify button is disabled")
                        continue
                else:
                    print(f"✗ Verify button strategy {i+1} not found or not clickable")
                    continue
                    
            except Exception as e:
                print(f"✗ Verify button strategy {i+1} failed: {str(e)}")
                continue
        
        print("✗ All verify button strategies failed")
        return False
    
    def list_all_visible_elements(self) -> list:
        """List all visible elements on the OTP verification page for debugging."""
        print("🔍 Listing all visible elements on OTP verification page...")
        return super().list_all_visible_elements()
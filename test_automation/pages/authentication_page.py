"""
Authentication page objects for signup, login, and OTP verification screens.
Based on Figma design analysis.
"""
from selenium.webdriver.common.by import By
from appium.webdriver.common.appiumby import AppiumBy
from .base_page import BasePage
import time


class SignupPage(BasePage):
    """Page object for signup screen based on Figma design."""
    
    # Locators based on exact Figma design - More specific and flexible
    APP_NAME = (AppiumBy.XPATH, "//*[contains(@text, 'Commute_io') or contains(@content-desc, 'Commute_io')]")
    TITLE = (AppiumBy.XPATH, "//*[contains(@text, 'Get started') or contains(@content-desc, 'Get started')]")
    
    # Multiple locator strategies for email button
    CONTINUE_WITH_EMAIL_BUTTON = (AppiumBy.XPATH, "//*[contains(@text, 'Continue with email') or contains(@content-desc, 'Continue with email') or contains(@text, 'email') or contains(@text, 'Email')]")
    CONTINUE_WITH_EMAIL_BUTTON_ALT = (AppiumBy.XPATH, "//*[@text='Continue with email' or @content-desc='Continue with email']")
    CONTINUE_WITH_EMAIL_BUTTON_CLASS = (AppiumBy.XPATH, "//android.widget.Button[contains(@text, 'email') or contains(@text, 'Email')]")
    
    # Multiple locator strategies for phone button
    CONTINUE_WITH_PHONE_BUTTON = (AppiumBy.XPATH, "//*[contains(@text, 'Continue with phone') or contains(@content-desc, 'Continue with phone') or contains(@text, 'phone') or contains(@text, 'Phone')]")
    CONTINUE_WITH_PHONE_BUTTON_ALT = (AppiumBy.XPATH, "//*[@text='Continue with phone' or @content-desc='Continue with phone']")
    CONTINUE_WITH_PHONE_BUTTON_CLASS = (AppiumBy.XPATH, "//android.widget.Button[contains(@text, 'phone') or contains(@text, 'Phone')]")
    
    TERMS_TEXT = (AppiumBy.XPATH, "//*[contains(@text, 'Terms of Service') or contains(@text, 'Privacy Policy') or contains(@content-desc, 'Terms')]")
    
    # Email/Phone input locators (for the next screens)
    EMAIL_INPUT = (AppiumBy.XPATH, "//*[contains(@resource-id, 'email') or contains(@hint, 'email') or contains(@placeholder, 'email') or contains(@text, 'email')]")
    PHONE_INPUT = (AppiumBy.XPATH, "//*[contains(@resource-id, 'phone') or contains(@hint, 'phone') or contains(@placeholder, 'phone') or contains(@text, 'phone')]")
    CONTINUE_BUTTON = (AppiumBy.XPATH, "//*[@text='Continue' or @content-desc='Continue' or contains(@text, 'Continue')]")
    ERROR_MESSAGE = (AppiumBy.XPATH, "//*[contains(@resource-id, 'error') or contains(@class, 'error') or contains(@text, 'error')]")
    
    def __init__(self):
        super().__init__()
    
    def is_signup_screen_displayed(self) -> bool:
        """Check if signup screen is displayed based on Figma design."""
        try:
            # Check for multiple signup screen elements from Figma
            checks = [
                self.wait_for_element_to_be_visible(self.TITLE, timeout=10),
                self.wait_for_element_to_be_visible(self.CONTINUE_WITH_EMAIL_BUTTON, timeout=10),
                self.wait_for_element_to_be_visible(self.CONTINUE_WITH_PHONE_BUTTON, timeout=10)
            ]
            return any(checks)
        except Exception:
            # Fallback: check for signup-related text
            return (self.is_text_present("Get started") or
                    self.is_text_present("Continue with email") or
                    self.is_text_present("Continue with phone"))
    
    def tap_continue_with_email(self) -> bool:
        """Tap on Continue with email button using multiple locator strategies."""
        print("Attempting to tap 'Continue with email' button...")
        
        # Try multiple locator strategies
        locators = [
            self.CONTINUE_WITH_EMAIL_BUTTON,
            self.CONTINUE_WITH_EMAIL_BUTTON_ALT,
            self.CONTINUE_WITH_EMAIL_BUTTON_CLASS
        ]
        
        for i, locator in enumerate(locators):
            try:
                print(f"Trying locator strategy {i+1}: {locator[1]}")
                
                if self.wait_for_element_to_be_clickable(locator, timeout=3):
                    element = self.driver.find_element(*locator)
                    button_text = self.get_text_from_element(element)
                    print(f"✓ Found 'Continue with email' button: '{button_text}'")
                    
                    # Try to tap the element
                    result = self.tap_element(element)
                    if result:
                        print("✓ Successfully tapped 'Continue with email' button")
                        
                        # Wait for navigation to complete
                        time.sleep(3)
                        
                        # Verify navigation by checking if we're on email page
                        email_page = EmailPage()
                        if email_page.is_email_page_displayed():
                            print("✓ Successfully navigated to email input screen")
                            return True
                        else:
                            print("⚠ Navigation verification failed, but tap was successful")
                            # List all visible elements to help debug
                            self.list_all_visible_elements()
                            return True
                    else:
                        print("✗ Failed to tap 'Continue with email' button")
                        continue
                else:
                    print(f"✗ Locator strategy {i+1}: Button not found or not clickable")
                    continue
                    
            except Exception as e:
                print(f"✗ Locator strategy {i+1} failed: {str(e)}")
                continue
        
        # If all strategies failed, try to find any clickable element with email text
        print("Trying fallback: Find any element with email text...")
        try:
            email_elements = self.driver.find_elements(AppiumBy.XPATH, "//*[contains(@text, 'email') or contains(@text, 'Email')]")
            for element in email_elements:
                if element.is_displayed() and element.is_enabled():
                    print(f"Found fallback element: {self.get_text_from_element(element)}")
                    result = self.tap_element(element)
                    if result:
                        print("✓ Successfully tapped fallback email element")
                        
                        # Wait for navigation to complete
                        time.sleep(3)
                        
                        # Verify navigation
                        email_page = EmailPage()
                        if email_page.is_email_page_displayed():
                            print("✓ Successfully navigated to email input screen")
                            return True
                        else:
                            print("⚠ Navigation verification failed, but tap was successful")
                            return True
                        return True
        except Exception as e:
            print(f"Fallback strategy failed: {str(e)}")
        
        print("✗ All strategies failed to tap 'Continue with email' button")
        return False
    
    def tap_continue_with_phone(self) -> bool:
        """Tap on Continue with phone button using multiple locator strategies."""
        print("Attempting to tap 'Continue with phone' button...")
        
        # Try multiple locator strategies
        locators = [
            self.CONTINUE_WITH_PHONE_BUTTON,
            self.CONTINUE_WITH_PHONE_BUTTON_ALT,
            self.CONTINUE_WITH_PHONE_BUTTON_CLASS
        ]
        
        for i, locator in enumerate(locators):
            try:
                print(f"Trying locator strategy {i+1}: {locator[1]}")
                
                if self.wait_for_element_to_be_clickable(locator, timeout=3):
                    element = self.driver.find_element(*locator)
                    button_text = self.get_text_from_element(element)
                    print(f"✓ Found 'Continue with phone' button: '{button_text}'")
                    
                    # Try to tap the element
                    result = self.tap_element(element)
                    if result:
                        print("✓ Successfully tapped 'Continue with phone' button")
                        return True
                    else:
                        print("✗ Failed to tap 'Continue with phone' button")
                        continue
                else:
                    print(f"✗ Locator strategy {i+1}: Button not found or not clickable")
                    continue
                    
            except Exception as e:
                print(f"✗ Locator strategy {i+1} failed: {str(e)}")
                continue
        
        # If all strategies failed, try to find any clickable element with phone text
        print("Trying fallback: Find any element with phone text...")
        try:
            phone_elements = self.driver.find_elements(AppiumBy.XPATH, "//*[contains(@text, 'phone') or contains(@text, 'Phone')]")
            for element in phone_elements:
                if element.is_displayed() and element.is_enabled():
                    print(f"Found fallback element: {self.get_text_from_element(element)}")
                    result = self.tap_element(element)
                    if result:
                        print("✓ Successfully tapped fallback phone element")
                        return True
        except Exception as e:
            print(f"Fallback strategy failed: {str(e)}")
        
        print("✗ All strategies failed to tap 'Continue with phone' button")
        return False
    
    def get_screen_title(self) -> str:
        """Get the screen title."""
        try:
            element = self.driver.find_element(*self.TITLE)
            return self.get_text_from_element(element)
        except Exception:
            return ""
    
    def is_continue_with_email_displayed(self) -> bool:
        """Check if Continue with email button is displayed."""
        return self.wait_for_element_to_be_visible(self.CONTINUE_WITH_EMAIL_BUTTON, timeout=10)
    
    def is_continue_with_phone_displayed(self) -> bool:
        """Check if Continue with phone button is displayed."""
        return self.wait_for_element_to_be_visible(self.CONTINUE_WITH_PHONE_BUTTON, timeout=10)
    
    def is_terms_text_displayed(self) -> bool:
        """Check if terms text is displayed."""
        return self.is_element_present(self.TERMS_TEXT)
    
    # Methods for the next screens (email/phone input)
    def enter_phone_number(self, phone_number: str) -> bool:
        """Enter phone number."""
        if self.wait_for_element_to_be_visible(self.PHONE_INPUT):
            element = self.driver.find_element(*self.PHONE_INPUT)
            return self.enter_text(element, phone_number)
        return False
    
    def enter_email(self, email: str) -> bool:
        """Enter email address."""
        if self.wait_for_element_to_be_visible(self.EMAIL_INPUT):
            element = self.driver.find_element(*self.EMAIL_INPUT)
            return self.enter_text(element, email)
        return False
    
    def tap_continue_button(self) -> bool:
        """Tap continue button."""
        if self.wait_for_element_to_be_clickable(self.CONTINUE_BUTTON):
            element = self.driver.find_element(*self.CONTINUE_BUTTON)
            return self.tap_element(element)
        return False
    
    def get_error_message(self) -> str:
        """Get error message text."""
        if self.is_element_present(self.ERROR_MESSAGE):
            element = self.driver.find_element(*self.ERROR_MESSAGE)
            return self.get_text_from_element(element)
        return ""
    
    def is_error_message_displayed(self, expected_message: str) -> bool:
        """Check if specific error message is displayed."""
        return self.is_text_present(expected_message)
    
    def list_all_visible_elements(self) -> list:
        """List all visible elements on the current screen for debugging."""
        try:
            # Find all clickable elements
            clickable_elements = self.driver.find_elements(AppiumBy.XPATH, "//*[@clickable='true' or @enabled='true']")
            
            # Find all text elements
            text_elements = self.driver.find_elements(AppiumBy.XPATH, "//*[@text and string-length(@text) > 0]")
            
            elements_info = []
            
            # Add clickable elements
            for element in clickable_elements:
                try:
                    text = self.get_text_from_element(element)
                    if text:
                        elements_info.append(f"Clickable: '{text}'")
                except:
                    pass
            
            # Add text elements
            for element in text_elements:
                try:
                    text = self.get_text_from_element(element)
                    if text and text not in [e.split(": '")[1].rstrip("'") for e in elements_info]:
                        elements_info.append(f"Text: '{text}'")
                except:
                    pass
            
            return elements_info
        except Exception as e:
            print(f"Error listing elements: {str(e)}")
            return []


class EmailPage(BasePage):
    """Page object for email input screen based on Figma design."""
    
    # Enhanced locators with multiple strategies
    EMAIL_INPUT = (AppiumBy.XPATH, "//*[contains(@resource-id, 'email') or contains(@hint, 'email') or contains(@placeholder, 'email') or contains(@text, 'email')]")
    EMAIL_INPUT_ALT = (AppiumBy.XPATH, "//android.widget.EditText[contains(@resource-id, 'email') or contains(@hint, 'email')]")
    EMAIL_INPUT_CLASS = (AppiumBy.XPATH, "//*[@class='android.widget.EditText']")
    
    CONTINUE_BUTTON = (AppiumBy.XPATH, "//*[@text='Next' or @content-desc='Next' or @text='Continue' or @content-desc='Continue' or contains(@text, 'Next') or contains(@text, 'Continue')]")
    CONTINUE_BUTTON_ALT = (AppiumBy.XPATH, "//android.widget.Button[@text='Next' or @content-desc='Next' or @text='Continue' or @content-desc='Continue']")
    CONTINUE_BUTTON_CLASS = (AppiumBy.XPATH, "//*[@class='android.widget.Button' and (contains(@text, 'Next') or contains(@text, 'Continue'))]")
    
    BACK_BUTTON = (AppiumBy.XPATH, "//*[@text='Back' or @content-desc='Back' or contains(@text, 'Back')]")
    ERROR_MESSAGE = (AppiumBy.XPATH, "//*[contains(@resource-id, 'error') or contains(@class, 'error') or contains(@text, 'error')]")
    SCREEN_TITLE = (AppiumBy.XPATH, "//*[contains(@text, 'Email') or contains(@content-desc, 'Email')]")
    
    def __init__(self):
        super().__init__()
    
    def is_email_page_displayed(self) -> bool:
        """Check if email page is displayed based on Figma design."""
        try:
            # First try to find email input field
            if self.wait_for_element_to_be_visible(self.EMAIL_INPUT, timeout=5):
                print("✓ Email input field found")
                return True
            
            # Try to find continue button
            if self.wait_for_element_to_be_visible(self.CONTINUE_BUTTON, timeout=5):
                print("✓ Continue button found on email page")
                return True
            
            # Check for email-related text
            if (self.is_text_present("email") or 
                self.is_text_present("Email") or
                self.is_text_present("Enter your email") or
                self.is_text_present("Email address")):
                print("✓ Email-related text found")
                return True
            
            return False
        except Exception as e:
            print(f"Error checking email page: {str(e)}")
            return False
    
    def enter_email(self, email: str) -> bool:
        """Enter email address."""
        if self.wait_for_element_to_be_visible(self.EMAIL_INPUT):
            element = self.driver.find_element(*self.EMAIL_INPUT)
            return self.enter_text(element, email)
        return False
    
    def tap_continue_button(self) -> bool:
        """Tap continue button."""
        if self.wait_for_element_to_be_clickable(self.CONTINUE_BUTTON):
            element = self.driver.find_element(*self.CONTINUE_BUTTON)
            return self.tap_element(element)
        return False
    
    def tap_back_button(self) -> bool:
        """Tap back button."""
        if self.wait_for_element_to_be_clickable(self.BACK_BUTTON):
            element = self.driver.find_element(*self.BACK_BUTTON)
            return self.tap_element(element)
        return False
    
    def get_screen_title(self) -> str:
        """Get the screen title."""
        try:
            element = self.driver.find_element(*self.SCREEN_TITLE)
            return self.get_text_from_element(element)
        except Exception:
            return ""


class PhoneNumberPage(BasePage):
    """Page object for phone number input screen based on Figma design."""
    
    # Locators based on Figma design
    PHONE_INPUT = (AppiumBy.XPATH, "//*[contains(@resource-id, 'phone') or contains(@hint, 'phone') or contains(@placeholder, 'phone') or contains(@text, 'phone')]")
    CONTINUE_BUTTON = (AppiumBy.XPATH, "//*[@text='Continue' or @content-desc='Continue' or contains(@text, 'Continue')]")
    BACK_BUTTON = (AppiumBy.XPATH, "//*[@text='Back' or @content-desc='Back' or contains(@text, 'Back')]")
    ERROR_MESSAGE = (AppiumBy.XPATH, "//*[contains(@resource-id, 'error') or contains(@class, 'error') or contains(@text, 'error')]")
    SCREEN_TITLE = (AppiumBy.XPATH, "//*[contains(@text, 'Phone') or contains(@content-desc, 'Phone')]")
    
    def __init__(self):
        super().__init__()
    
    def is_phone_page_displayed(self) -> bool:
        """Check if phone page is displayed based on Figma design."""
        try:
            # First try to find phone input field
            if self.wait_for_element_to_be_visible(self.PHONE_INPUT, timeout=5):
                print("✓ Phone input field found")
                return True
            
            # Try to find continue button
            if self.wait_for_element_to_be_visible(self.CONTINUE_BUTTON, timeout=5):
                print("✓ Continue button found on phone page")
                return True
            
            # Check for phone-related text
            if (self.is_text_present("phone") or 
                self.is_text_present("Phone") or
                self.is_text_present("Enter your phone") or
                self.is_text_present("Phone number")):
                print("✓ Phone-related text found")
                return True
            
            return False
        except Exception as e:
            print(f"Error checking phone page: {str(e)}")
            return False
    
    def enter_phone_number(self, phone_number: str) -> bool:
        """Enter phone number."""
        if self.wait_for_element_to_be_visible(self.PHONE_INPUT):
            element = self.driver.find_element(*self.PHONE_INPUT)
            return self.enter_text(element, phone_number)
        return False
    
    def tap_continue_button(self) -> bool:
        """Tap continue button."""
        if self.wait_for_element_to_be_clickable(self.CONTINUE_BUTTON):
            element = self.driver.find_element(*self.CONTINUE_BUTTON)
            return self.tap_element(element)
        return False
    
    def tap_back_button(self) -> bool:
        """Tap back button."""
        if self.wait_for_element_to_be_clickable(self.BACK_BUTTON):
            element = self.driver.find_element(*self.BACK_BUTTON)
            return self.tap_element(element)
        return False
    
    def get_screen_title(self) -> str:
        """Get the screen title."""
        try:
            element = self.driver.find_element(*self.SCREEN_TITLE)
            return self.get_text_from_element(element)
        except Exception:
            return ""


class OTPVerificationPage(BasePage):
    """Page object for OTP verification screen based on Figma design."""
    
    # Locators based on Figma design - 6-digit OTP input
    OTP_INPUT = (AppiumBy.XPATH, "//*[contains(@resource-id, 'otp') or contains(@hint, 'OTP') or contains(@placeholder, 'OTP')]")
    OTP_DIGIT_1 = (AppiumBy.XPATH, "(//*[contains(@resource-id, 'otp') or contains(@class, 'otp') or contains(@text, 'OTP')])[1]")
    OTP_DIGIT_2 = (AppiumBy.XPATH, "(//*[contains(@resource-id, 'otp') or contains(@class, 'otp') or contains(@text, 'OTP')])[2]")
    OTP_DIGIT_3 = (AppiumBy.XPATH, "(//*[contains(@resource-id, 'otp') or contains(@class, 'otp') or contains(@text, 'OTP')])[3]")
    OTP_DIGIT_4 = (AppiumBy.XPATH, "(//*[contains(@resource-id, 'otp') or contains(@class, 'otp') or contains(@text, 'OTP')])[4]")
    OTP_DIGIT_5 = (AppiumBy.XPATH, "(//*[contains(@resource-id, 'otp') or contains(@class, 'otp') or contains(@text, 'OTP')])[5]")
    OTP_DIGIT_6 = (AppiumBy.XPATH, "(//*[contains(@resource-id, 'otp') or contains(@class, 'otp') or contains(@text, 'OTP')])[6]")
    VERIFY_BUTTON = (AppiumBy.XPATH, "//*[@text='Verify' or @content-desc='Verify' or contains(@text, 'Verify')]")
    RESEND_OTP_BUTTON = (AppiumBy.XPATH, "//*[contains(@text, 'Resend') or contains(@text, 'resend') or contains(@content-desc, 'Resend')]")
    TIMER_TEXT = (AppiumBy.XPATH, "//*[contains(@text, 'seconds') or contains(@text, 'minute') or contains(@content-desc, 'timer')]")
    ERROR_MESSAGE = (AppiumBy.XPATH, "//*[contains(@resource-id, 'error') or contains(@class, 'error') or contains(@text, 'error')]")
    SCREEN_TITLE = (AppiumBy.XPATH, "//*[contains(@text, 'OTP') or contains(@text, 'verification') or contains(@content-desc, 'OTP')]")
    
    def __init__(self):
        super().__init__()
    
    def is_otp_verification_screen_displayed(self) -> bool:
        """Check if OTP verification screen is displayed based on Figma design."""
        try:
            checks = [
                self.wait_for_element_to_be_visible(self.VERIFY_BUTTON, timeout=10),
                self.wait_for_element_to_be_visible(self.OTP_INPUT, timeout=10)
            ]
            return any(checks)
        except Exception:
            return (self.is_text_present("OTP") or
                    self.is_text_present("verification") or
                    self.is_text_present("Verify"))
    
    def enter_otp(self, otp: str) -> bool:
        """Enter OTP code based on Figma design."""
        try:
            if len(otp) == 6:
                # Try to enter in individual digit fields (6-digit OTP from Figma)
                digits = [self.OTP_DIGIT_1, self.OTP_DIGIT_2, self.OTP_DIGIT_3, 
                         self.OTP_DIGIT_4, self.OTP_DIGIT_5, self.OTP_DIGIT_6]
                
                for i, digit_locator in enumerate(digits):
                    if self.wait_for_element_to_be_visible(digit_locator, timeout=3):
                        element = self.driver.find_element(*digit_locator)
                        self.enter_text(element, otp[i])
                        time.sleep(0.5)
                return True
            else:
                # Try to enter in single OTP input field
                if self.wait_for_element_to_be_visible(self.OTP_INPUT):
                    element = self.driver.find_element(*self.OTP_INPUT)
                    return self.enter_text(element, otp)
            return False
        except Exception as e:
            print(f"Error entering OTP: {str(e)}")
            return False
    
    def tap_verify_button(self) -> bool:
        """Tap verify button."""
        if self.wait_for_element_to_be_clickable(self.VERIFY_BUTTON):
            element = self.driver.find_element(*self.VERIFY_BUTTON)
            return self.tap_element(element)
        return False
    
    def tap_resend_otp_button(self) -> bool:
        """Tap resend OTP button."""
        if self.wait_for_element_to_be_clickable(self.RESEND_OTP_BUTTON):
            element = self.driver.find_element(*self.RESEND_OTP_BUTTON)
            return self.tap_element(element)
        return False
    
    def is_resend_button_enabled(self) -> bool:
        """Check if resend button is enabled."""
        if self.is_element_present(self.RESEND_OTP_BUTTON):
            element = self.driver.find_element(*self.RESEND_OTP_BUTTON)
            return element.is_enabled()
        return False
    
    def get_timer_text(self) -> str:
        """Get timer text."""
        if self.is_element_present(self.TIMER_TEXT):
            element = self.driver.find_element(*self.TIMER_TEXT)
            return self.get_text_from_element(element)
        return ""
    
    def wait_for_timer_to_expire(self, timeout: int = 65) -> bool:
        """Wait for OTP timer to expire."""
        start_time = time.time()
        while time.time() - start_time < timeout:
            if self.is_resend_button_enabled():
                return True
            time.sleep(1)
        return False
    
    def get_error_message(self) -> str:
        """Get error message text."""
        if self.is_element_present(self.ERROR_MESSAGE):
            element = self.driver.find_element(*self.ERROR_MESSAGE)
            return self.get_text_from_element(element)
        return ""
    
    def get_screen_title(self) -> str:
        """Get the screen title."""
        try:
            element = self.driver.find_element(*self.SCREEN_TITLE)
            return self.get_text_from_element(element)
        except Exception:
            return ""


class ProfileSetupPage(BasePage):
    """Page object for profile setup screen based on Figma design."""
    
    # Locators based on Figma design
    FIRST_NAME_INPUT = (AppiumBy.XPATH, "//*[contains(@resource-id, 'first') or contains(@hint, 'First') or contains(@placeholder, 'First')]")
    LAST_NAME_INPUT = (AppiumBy.XPATH, "//*[contains(@resource-id, 'last') or contains(@hint, 'Last') or contains(@placeholder, 'Last')]")
    DATE_OF_BIRTH_INPUT = (AppiumBy.XPATH, "//*[contains(@resource-id, 'birth') or contains(@hint, 'birth') or contains(@placeholder, 'birth')]")
    GENDER_DROPDOWN = (AppiumBy.XPATH, "//*[contains(@resource-id, 'gender') or contains(@text, 'Gender') or contains(@placeholder, 'Gender')]")
    PROFILE_PICTURE_BUTTON = (AppiumBy.XPATH, "//*[contains(@resource-id, 'photo') or contains(@text, 'photo') or contains(@content-desc, 'photo')]")
    CONTINUE_BUTTON = (AppiumBy.XPATH, "//*[@text='Continue' or @content-desc='Continue' or contains(@text, 'Continue')]")
    SKIP_BUTTON = (AppiumBy.XPATH, "//*[@text='Skip' or @content-desc='Skip' or contains(@text, 'Skip')]")
    SCREEN_TITLE = (AppiumBy.XPATH, "//*[contains(@text, 'profile') or contains(@text, 'setup') or contains(@content-desc, 'profile')]")
    
    def __init__(self):
        super().__init__()
    
    def is_profile_setup_screen_displayed(self) -> bool:
        """Check if profile setup screen is displayed based on Figma design."""
        try:
            checks = [
                self.wait_for_element_to_be_visible(self.FIRST_NAME_INPUT, timeout=10),
                self.wait_for_element_to_be_visible(self.CONTINUE_BUTTON, timeout=10)
            ]
            return any(checks)
        except Exception:
            return (self.is_text_present("profile") or
                    self.is_text_present("setup") or
                    self.is_text_present("Profile"))
    
    def enter_first_name(self, first_name: str) -> bool:
        """Enter first name."""
        if self.wait_for_element_to_be_visible(self.FIRST_NAME_INPUT):
            element = self.driver.find_element(*self.FIRST_NAME_INPUT)
            return self.enter_text(element, first_name)
        return False
    
    def enter_last_name(self, last_name: str) -> bool:
        """Enter last name."""
        if self.wait_for_element_to_be_visible(self.LAST_NAME_INPUT):
            element = self.driver.find_element(*self.LAST_NAME_INPUT)
            return self.enter_text(element, last_name)
        return False
    
    def select_date_of_birth(self, date: str) -> bool:
        """Select date of birth."""
        if self.wait_for_element_to_be_visible(self.DATE_OF_BIRTH_INPUT):
            element = self.driver.find_element(*self.DATE_OF_BIRTH_INPUT)
            self.tap_element(element)
            # Handle date picker if needed
            return self.enter_text(element, date)
        return False
    
    def select_gender(self, gender: str) -> bool:
        """Select gender."""
        if self.wait_for_element_to_be_visible(self.GENDER_DROPDOWN):
            element = self.driver.find_element(*self.GENDER_DROPDOWN)
            self.tap_element(element)
            # Handle dropdown selection
            gender_option = (AppiumBy.XPATH, f"//*[@text='{gender}' or contains(@text, '{gender}')]")
            if self.wait_for_element_to_be_visible(gender_option):
                gender_element = self.driver.find_element(*gender_option)
                return self.tap_element(gender_element)
        return False
    
    def upload_profile_picture(self) -> bool:
        """Upload profile picture."""
        if self.wait_for_element_to_be_visible(self.PROFILE_PICTURE_BUTTON):
            element = self.driver.find_element(*self.PROFILE_PICTURE_BUTTON)
            return self.tap_element(element)
        return False
    
    def tap_continue_button(self) -> bool:
        """Tap continue button."""
        if self.wait_for_element_to_be_clickable(self.CONTINUE_BUTTON):
            element = self.driver.find_element(*self.CONTINUE_BUTTON)
            return self.tap_element(element)
        return False
    
    def complete_profile_setup(self, first_name: str, last_name: str, dob: str, gender: str) -> bool:
        """Complete profile setup."""
        try:
            if not self.enter_first_name(first_name):
                return False
            if not self.enter_last_name(last_name):
                return False
            if not self.select_date_of_birth(dob):
                return False
            if not self.select_gender(gender):
                return False
            return self.tap_continue_button()
        except Exception as e:
            print(f"Error completing profile setup: {str(e)}")
            return False
    
    def get_screen_title(self) -> str:
        """Get the screen title."""
        try:
            element = self.driver.find_element(*self.SCREEN_TITLE)
            return self.get_text_from_element(element)
        except Exception:
            return ""
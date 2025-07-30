"""
Authentication page objects for signup, login, and OTP verification screens.
"""
from selenium.webdriver.common.by import By
from appium.webdriver.common.appiumby import AppiumBy
from .base_page import BasePage
import time


class SignupPage(BasePage):
    """Page object for signup screen."""
    
    # Locators
    PHONE_INPUT = (AppiumBy.XPATH, "//*[contains(@resource-id, 'phone') or contains(@hint, 'phone')]")
    EMAIL_INPUT = (AppiumBy.XPATH, "//*[contains(@resource-id, 'email') or contains(@hint, 'email')]")
    CONTINUE_BUTTON = (AppiumBy.XPATH, "//*[@text='Continue' or @content-desc='Continue']")
    USE_EMAIL_OPTION = (AppiumBy.XPATH, "//*[contains(@text, 'email') or contains(@text, 'Email')]")
    USE_PHONE_OPTION = (AppiumBy.XPATH, "//*[contains(@text, 'phone') or contains(@text, 'Phone')]")
    ERROR_MESSAGE = (AppiumBy.XPATH, "//*[contains(@resource-id, 'error') or contains(@class, 'error')]")
    
    def __init__(self):
        super().__init__()
    
    def is_signup_screen_displayed(self) -> bool:
        """Check if signup screen is displayed."""
        return (self.is_element_present(self.PHONE_INPUT) or 
                self.is_element_present(self.EMAIL_INPUT) or
                self.is_text_present("Sign up") or
                self.is_text_present("Create account"))
    
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
    
    def tap_use_email_option(self) -> bool:
        """Tap on use email option."""
        if self.wait_for_element_to_be_clickable(self.USE_EMAIL_OPTION):
            element = self.driver.find_element(*self.USE_EMAIL_OPTION)
            return self.tap_element(element)
        return False
    
    def tap_use_phone_option(self) -> bool:
        """Tap on use phone option."""
        if self.wait_for_element_to_be_clickable(self.USE_PHONE_OPTION):
            element = self.driver.find_element(*self.USE_PHONE_OPTION)
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


class OTPVerificationPage(BasePage):
    """Page object for OTP verification screen."""
    
    # Locators
    OTP_INPUT = (AppiumBy.XPATH, "//*[contains(@resource-id, 'otp') or contains(@hint, 'OTP')]")
    OTP_DIGIT_1 = (AppiumBy.XPATH, "(//*[contains(@resource-id, 'otp') or contains(@class, 'otp')])[1]")
    OTP_DIGIT_2 = (AppiumBy.XPATH, "(//*[contains(@resource-id, 'otp') or contains(@class, 'otp')])[2]")
    OTP_DIGIT_3 = (AppiumBy.XPATH, "(//*[contains(@resource-id, 'otp') or contains(@class, 'otp')])[3]")
    OTP_DIGIT_4 = (AppiumBy.XPATH, "(//*[contains(@resource-id, 'otp') or contains(@class, 'otp')])[4]")
    OTP_DIGIT_5 = (AppiumBy.XPATH, "(//*[contains(@resource-id, 'otp') or contains(@class, 'otp')])[5]")
    OTP_DIGIT_6 = (AppiumBy.XPATH, "(//*[contains(@resource-id, 'otp') or contains(@class, 'otp')])[6]")
    VERIFY_BUTTON = (AppiumBy.XPATH, "//*[@text='Verify' or @content-desc='Verify']")
    RESEND_OTP_BUTTON = (AppiumBy.XPATH, "//*[contains(@text, 'Resend') or contains(@text, 'resend')]")
    TIMER_TEXT = (AppiumBy.XPATH, "//*[contains(@text, 'seconds') or contains(@text, 'minute')]")
    ERROR_MESSAGE = (AppiumBy.XPATH, "//*[contains(@resource-id, 'error') or contains(@class, 'error')]")
    
    def __init__(self):
        super().__init__()
    
    def is_otp_verification_screen_displayed(self) -> bool:
        """Check if OTP verification screen is displayed."""
        return (self.is_element_present(self.OTP_INPUT) or
                self.is_element_present(self.VERIFY_BUTTON) or
                self.is_text_present("Enter OTP") or
                self.is_text_present("verification"))
    
    def enter_otp(self, otp: str) -> bool:
        """Enter OTP code."""
        try:
            # Try single OTP input field first
            if self.is_element_present(self.OTP_INPUT):
                element = self.driver.find_element(*self.OTP_INPUT)
                return self.enter_text(element, otp)
            
            # Try individual digit fields
            digit_locators = [
                self.OTP_DIGIT_1, self.OTP_DIGIT_2, self.OTP_DIGIT_3,
                self.OTP_DIGIT_4, self.OTP_DIGIT_5, self.OTP_DIGIT_6
            ]
            
            for i, digit in enumerate(otp):
                if i < len(digit_locators):
                    if self.is_element_present(digit_locators[i]):
                        element = self.driver.find_element(*digit_locators[i])
                        if not self.enter_text(element, digit):
                            return False
            
            return True
        except Exception as e:
            print(f"Failed to enter OTP: {str(e)}")
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
        try:
            # Wait for resend button to become enabled
            for _ in range(timeout):
                if self.is_resend_button_enabled():
                    return True
                time.sleep(1)
            return False
        except Exception:
            return False
    
    def get_error_message(self) -> str:
        """Get error message text."""
        if self.is_element_present(self.ERROR_MESSAGE):
            element = self.driver.find_element(*self.ERROR_MESSAGE)
            return self.get_text_from_element(element)
        return ""


class ProfileSetupPage(BasePage):
    """Page object for profile setup screen."""
    
    # Locators
    FIRST_NAME_INPUT = (AppiumBy.XPATH, "//*[contains(@resource-id, 'first') or contains(@hint, 'First')]")
    LAST_NAME_INPUT = (AppiumBy.XPATH, "//*[contains(@resource-id, 'last') or contains(@hint, 'Last')]")
    DATE_OF_BIRTH_INPUT = (AppiumBy.XPATH, "//*[contains(@resource-id, 'birth') or contains(@hint, 'birth')]")
    GENDER_DROPDOWN = (AppiumBy.XPATH, "//*[contains(@resource-id, 'gender') or contains(@text, 'Gender')]")
    PROFILE_PICTURE_BUTTON = (AppiumBy.XPATH, "//*[contains(@resource-id, 'photo') or contains(@text, 'photo')]")
    CONTINUE_BUTTON = (AppiumBy.XPATH, "//*[@text='Continue' or @content-desc='Continue']")
    SKIP_BUTTON = (AppiumBy.XPATH, "//*[@text='Skip' or @content-desc='Skip']")
    
    def __init__(self):
        super().__init__()
    
    def is_profile_setup_screen_displayed(self) -> bool:
        """Check if profile setup screen is displayed."""
        return (self.is_element_present(self.FIRST_NAME_INPUT) or
                self.is_text_present("Profile") or
                self.is_text_present("Tell us about yourself"))
    
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
        if self.wait_for_element_to_be_clickable(self.DATE_OF_BIRTH_INPUT):
            element = self.driver.find_element(*self.DATE_OF_BIRTH_INPUT)
            self.tap_element(element)
            # Handle date picker (implementation depends on specific date picker UI)
            return True
        return False
    
    def select_gender(self, gender: str) -> bool:
        """Select gender from dropdown."""
        if self.wait_for_element_to_be_clickable(self.GENDER_DROPDOWN):
            element = self.driver.find_element(*self.GENDER_DROPDOWN)
            self.tap_element(element)
            # Wait for dropdown options and select
            return self.find_element_by_text(gender) and self.tap_element(self.find_element_by_text(gender))
        return False
    
    def upload_profile_picture(self) -> bool:
        """Upload profile picture."""
        if self.wait_for_element_to_be_clickable(self.PROFILE_PICTURE_BUTTON):
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
        """Complete the profile setup process."""
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
            print(f"Failed to complete profile setup: {str(e)}")
            return False
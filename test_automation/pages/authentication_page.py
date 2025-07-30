"""
Authentication page objects for signup, login, and OTP verification screens.
"""
from selenium.webdriver.common.by import By
from appium.webdriver.common.appiumby import AppiumBy
from .base_page import BasePage
import time


class SignupPage(BasePage):
    """Page object for signup screen."""
    
    # Locators based on actual app structure
    APP_NAME = (AppiumBy.XPATH, "//*[contains(@text, 'Commute_io')]")
    TITLE = (AppiumBy.XPATH, "//*[contains(@text, 'Get started')]")
    CONTINUE_WITH_EMAIL_BUTTON = (AppiumBy.XPATH, "//*[contains(@text, 'Continue with email') or contains(@text, 'email')]")
    CONTINUE_WITH_PHONE_BUTTON = (AppiumBy.XPATH, "//*[contains(@text, 'Continue with phone') or contains(@text, 'phone')]")
    TERMS_TEXT = (AppiumBy.XPATH, "//*[contains(@text, 'Terms of Service') or contains(@text, 'Privacy Policy')]")
    
    # Email/Phone input locators (for the next screens)
    EMAIL_INPUT = (AppiumBy.XPATH, "//*[contains(@resource-id, 'email') or contains(@hint, 'email') or contains(@placeholder, 'email')]")
    PHONE_INPUT = (AppiumBy.XPATH, "//*[contains(@resource-id, 'phone') or contains(@hint, 'phone') or contains(@placeholder, 'phone')]")
    CONTINUE_BUTTON = (AppiumBy.XPATH, "//*[@text='Continue' or @content-desc='Continue']")
    ERROR_MESSAGE = (AppiumBy.XPATH, "//*[contains(@resource-id, 'error') or contains(@class, 'error')]")
    
    def __init__(self):
        super().__init__()
    
    def is_signup_screen_displayed(self) -> bool:
        """Check if signup screen is displayed."""
        try:
            # Check for multiple signup screen elements
            checks = [
                self.wait_for_element_to_be_visible(self.TITLE, timeout=5),
                self.wait_for_element_to_be_visible(self.CONTINUE_WITH_EMAIL_BUTTON, timeout=5),
                self.wait_for_element_to_be_visible(self.CONTINUE_WITH_PHONE_BUTTON, timeout=5)
            ]
            return any(checks)
        except Exception:
            # Fallback: check for signup-related text
            return (self.is_text_present("Get started") or
                    self.is_text_present("Continue with email") or
                    self.is_text_present("Continue with phone"))
    
    def tap_continue_with_email(self) -> bool:
        """Tap on Continue with email button."""
        if self.wait_for_element_to_be_clickable(self.CONTINUE_WITH_EMAIL_BUTTON):
            element = self.driver.find_element(*self.CONTINUE_WITH_EMAIL_BUTTON)
            return self.tap_element(element)
        return False
    
    def tap_continue_with_phone(self) -> bool:
        """Tap on Continue with phone button."""
        if self.wait_for_element_to_be_clickable(self.CONTINUE_WITH_PHONE_BUTTON):
            element = self.driver.find_element(*self.CONTINUE_WITH_PHONE_BUTTON)
            return self.tap_element(element)
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
        return self.wait_for_element_to_be_visible(self.CONTINUE_WITH_EMAIL_BUTTON, timeout=5)
    
    def is_continue_with_phone_displayed(self) -> bool:
        """Check if Continue with phone button is displayed."""
        return self.wait_for_element_to_be_visible(self.CONTINUE_WITH_PHONE_BUTTON, timeout=5)
    
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


class EmailPage(BasePage):
    """Page object for email input screen."""
    
    # Locators
    EMAIL_INPUT = (AppiumBy.XPATH, "//*[contains(@resource-id, 'email') or contains(@hint, 'email') or contains(@placeholder, 'email')]")
    CONTINUE_BUTTON = (AppiumBy.XPATH, "//*[@text='Continue' or @content-desc='Continue']")
    BACK_BUTTON = (AppiumBy.XPATH, "//*[@text='Back' or @content-desc='Back']")
    ERROR_MESSAGE = (AppiumBy.XPATH, "//*[contains(@resource-id, 'error') or contains(@class, 'error')]")
    
    def __init__(self):
        super().__init__()
    
    def is_email_page_displayed(self) -> bool:
        """Check if email page is displayed."""
        return self.wait_for_element_to_be_visible(self.EMAIL_INPUT, timeout=5)
    
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


class PhoneNumberPage(BasePage):
    """Page object for phone number input screen."""
    
    # Locators
    PHONE_INPUT = (AppiumBy.XPATH, "//*[contains(@resource-id, 'phone') or contains(@hint, 'phone') or contains(@placeholder, 'phone')]")
    CONTINUE_BUTTON = (AppiumBy.XPATH, "//*[@text='Continue' or @content-desc='Continue']")
    BACK_BUTTON = (AppiumBy.XPATH, "//*[@text='Back' or @content-desc='Back']")
    ERROR_MESSAGE = (AppiumBy.XPATH, "//*[contains(@resource-id, 'error') or contains(@class, 'error')]")
    
    def __init__(self):
        super().__init__()
    
    def is_phone_page_displayed(self) -> bool:
        """Check if phone page is displayed."""
        return self.wait_for_element_to_be_visible(self.PHONE_INPUT, timeout=5)
    
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
                self.is_text_present("OTP") or
                self.is_text_present("verification"))
    
    def enter_otp(self, otp: str) -> bool:
        """Enter OTP code."""
        try:
            if len(otp) == 6:
                # Try to enter in individual digit fields
                digits = [self.OTP_DIGIT_1, self.OTP_DIGIT_2, self.OTP_DIGIT_3, 
                         self.OTP_DIGIT_4, self.OTP_DIGIT_5, self.OTP_DIGIT_6]
                
                for i, digit_locator in enumerate(digits):
                    if self.wait_for_element_to_be_visible(digit_locator, timeout=2):
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
                self.is_text_present("profile") or
                self.is_text_present("setup"))
    
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
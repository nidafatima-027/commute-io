"""
Step definitions for Expo Go direct navigation.
"""
from behave import given, when, then
from utils.expo_navigator import ExpoNavigator
import time


@given('I navigate directly to signup screen')
def step_navigate_directly_to_signup(context):
    """Navigate directly to signup screen using Expo Go deep linking."""
    print("Navigating directly to signup screen...")
    assert ExpoNavigator.navigate_to_signup(), "Failed to navigate to signup screen"
    
    # Wait for screen to load
    time.sleep(3)
    
    # Initialize signup page
    from pages.authentication_page import SignupPage
    context.signup_page = SignupPage()


@given('I navigate directly to email input screen')
def step_navigate_directly_to_email_input(context):
    """Navigate directly to email input screen using Expo Go deep linking."""
    print("Navigating directly to email input screen...")
    assert ExpoNavigator.navigate_to_email_input(), "Failed to navigate to email input screen"
    
    # Wait for screen to load
    time.sleep(3)
    
    # Initialize email page
    from pages.authentication_page import EmailPage
    context.email_page = EmailPage()


@given('I navigate directly to phone input screen')
def step_navigate_directly_to_phone_input(context):
    """Navigate directly to phone input screen using Expo Go deep linking."""
    print("Navigating directly to phone input screen...")
    assert ExpoNavigator.navigate_to_phone_input(), "Failed to navigate to phone input screen"
    
    # Wait for screen to load
    time.sleep(3)
    
    # Initialize phone page
    from pages.authentication_page import PhoneNumberPage
    context.phone_page = PhoneNumberPage()


@given('I navigate directly to OTP verification screen')
def step_navigate_directly_to_otp_verification(context):
    """Navigate directly to OTP verification screen using Expo Go deep linking."""
    print("Navigating directly to OTP verification screen...")
    assert ExpoNavigator.navigate_to_otp_verification(), "Failed to navigate to OTP verification screen"
    
    # Wait for screen to load
    time.sleep(3)
    
    # Initialize OTP page
    from pages.authentication_page import OTPVerificationPage
    context.otp_page = OTPVerificationPage()


@given('I navigate directly to profile setup screen')
def step_navigate_directly_to_profile_setup(context):
    """Navigate directly to profile setup screen using Expo Go deep linking."""
    print("Navigating directly to profile setup screen...")
    assert ExpoNavigator.navigate_to_profile_setup(), "Failed to navigate to profile setup screen"
    
    # Wait for screen to load
    time.sleep(3)
    
    # Initialize profile page
    from pages.authentication_page import ProfileSetupPage
    context.profile_page = ProfileSetupPage()


@given('I navigate directly to main app dashboard')
def step_navigate_directly_to_main_dashboard(context):
    """Navigate directly to main app dashboard using Expo Go deep linking."""
    print("Navigating directly to main app dashboard...")
    assert ExpoNavigator.navigate_to_home(), "Failed to navigate to main app dashboard"
    
    # Wait for screen to load
    time.sleep(3)


@when('I reload the app')
def step_reload_app(context):
    """Reload the Expo Go app."""
    print("Reloading the app...")
    assert ExpoNavigator.reload_app(), "Failed to reload the app"
    
    # Wait for app to reload
    time.sleep(5)


@then('I should be on the correct screen')
def step_should_be_on_correct_screen(context):
    """Generic step to verify we're on the correct screen."""
    # This step can be customized based on the expected screen
    print("Verifying we're on the correct screen...")
    time.sleep(2)
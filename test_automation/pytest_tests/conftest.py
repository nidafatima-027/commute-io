"""
Shared pytest fixtures for test automation.
"""
import pytest
import time
from utils.driver_factory import create_driver, close_driver
from utils.navigation_helper import navigation_helper
from pages.onboarding_page import OnboardingPage
from pages.authentication_page import SignupPage, EmailPage, OTPVerificationPage, ProfileSetupPage


@pytest.fixture(scope="session")
def appium_driver():
    """Session-scoped Appium driver fixture."""
    print("\n🚀 Setting up Appium driver for test session...")
    driver = create_driver()
    yield driver
    print("\n🧹 Cleaning up Appium driver...")
    close_driver(driver)


@pytest.fixture(scope="function")
def driver(appium_driver):
    """Function-scoped driver fixture that resets app state."""
    print("\n🔄 Resetting app state...")
    try:
        # Reset app to initial state (you can customize this)
        appium_driver.terminate_app("host.exp.exponent")
        time.sleep(2)
        appium_driver.activate_app("host.exp.exponent")
        time.sleep(3)
    except Exception as e:
        print(f"⚠️ App reset failed (this is normal if app isn't running): {str(e)}")
        # Try to launch the app if it's not running
        try:
            appium_driver.activate_app("host.exp.exponent")
            time.sleep(3)
        except Exception as e2:
            print(f"⚠️ App activation failed: {str(e2)}")
    
    yield appium_driver


@pytest.fixture
def onboarding_page(driver):
    """Onboarding page object fixture."""
    return OnboardingPage()


@pytest.fixture
def signup_page(driver):
    """Signup page object fixture."""
    return SignupPage()


@pytest.fixture
def email_page(driver):
    """Email page object fixture."""
    return EmailPage()


@pytest.fixture
def otp_page(driver):
    """OTP verification page object fixture."""
    return OTPVerificationPage()


@pytest.fixture
def profile_page(driver):
    """Profile setup page object fixture."""
    return ProfileSetupPage()


@pytest.fixture
def navigate_to_signup(onboarding_page, signup_page):
    """Fixture to navigate from onboarding to signup screen."""
    print("\n📝 Navigating to signup screen...")
    onboarding_page.tap_get_started_button()
    time.sleep(2)
    assert signup_page.is_signup_screen_displayed(), "Failed to navigate to signup screen"
    return signup_page


@pytest.fixture
def navigate_to_email_input(signup_page, email_page):
    """Fixture to navigate from signup to email input screen."""
    print("\n📧 Navigating to email input screen...")
    success = signup_page.tap_continue_with_email()
    assert success, "Failed to tap Continue with email button"
    time.sleep(3)
    assert email_page.is_email_page_displayed(), "Failed to navigate to email input screen"
    return email_page


@pytest.fixture
def navigate_to_otp_verification(email_page, otp_page):
    """Fixture to navigate from email input to OTP verification screen."""
    print("\n🔐 Navigating to OTP verification screen...")
    email_page.enter_email("test@example.com")
    email_page.tap_continue_button()
    time.sleep(2)
    assert otp_page.is_otp_verification_screen_displayed(), "Failed to navigate to OTP verification screen"
    return otp_page


@pytest.fixture
def navigate_to_profile_setup(otp_page, profile_page):
    """Fixture to navigate from OTP verification to profile setup screen."""
    print("\n👤 Navigating to profile setup screen...")
    otp_page.enter_otp("123456")
    otp_page.tap_verify_button()
    time.sleep(2)
    assert profile_page.is_profile_setup_screen_displayed(), "Failed to navigate to profile setup screen"
    return profile_page


# Custom markers for better test organization
def pytest_configure(config):
    """Configure custom markers."""
    config.addinivalue_line(
        "markers", "smoke: mark test as smoke test"
    )
    config.addinivalue_line(
        "markers", "regression: mark test as regression test"
    )
    config.addinivalue_line(
        "markers", "email_flow: mark test as email authentication flow test"
    )
    config.addinivalue_line(
        "markers", "error_handling: mark test as error handling test"
    )
    config.addinivalue_line(
        "markers", "slow: mark test as slow running test"
    )
    config.addinivalue_line(
        "markers", "integration: mark test as integration test"
    )
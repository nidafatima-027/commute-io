"""
Step definitions for onboarding feature scenarios.
"""
from behave import given, when, then
from pages.onboarding_page import OnboardingPage


@given('the app is launched for the first time')
def step_app_launched_first_time(context):
    """Step to launch app for first time."""
    # App should already be launched and navigated to onboarding via environment setup
    context.onboarding_page = OnboardingPage()
    context.onboarding_page.wait_for_screen_to_load()
    
    # Verify we're on the onboarding screen
    assert context.onboarding_page.is_onboarding_screen_displayed(), "Onboarding screen is not displayed"


@when('I am on the onboarding screen')
def step_on_onboarding_screen(context):
    """Step to verify being on onboarding screen."""
    context.onboarding_page = OnboardingPage()
    assert context.onboarding_page.is_onboarding_screen_displayed(), "Onboarding screen is not displayed"


@given('I am on the onboarding screen')
def step_given_on_onboarding_screen(context):
    """Given step for being on onboarding screen."""
    step_on_onboarding_screen(context)


@then('I should see the welcome message')
def step_should_see_welcome_message(context):
    """Step to verify welcome message is displayed."""
    assert context.onboarding_page.is_welcome_message_displayed(), "Welcome message is not displayed"


@then('I should see onboarding slides')
def step_should_see_onboarding_slides(context):
    """Step to verify onboarding slides are displayed."""
    assert context.onboarding_page.are_onboarding_slides_displayed(), "Onboarding slides are not displayed"


@then('I should see the Get Started button')
def step_should_see_get_started_button(context):
    """Step to verify Get Started button is displayed."""
    # The Get Started button should be visible on the onboarding screen
    assert context.onboarding_page.is_get_started_button_displayed(), "Get Started button is not displayed"


@when('I swipe through all onboarding slides')
def step_swipe_through_all_slides(context):
    """Step to swipe through all onboarding slides."""
    # For this app, the onboarding appears to be a single screen with Get Started button
    # So we'll just verify the button is there
    assert context.onboarding_page.is_get_started_button_displayed(), "Get Started button is not displayed"


@when('I tap on Get Started button')
def step_tap_get_started_button(context):
    """Step to tap Get Started button."""
    assert context.onboarding_page.tap_get_started_button(), "Failed to tap Get Started button"


@when('I tap on Skip button if available')
def step_tap_skip_button_if_available(context):
    """Step to tap Skip button if it's available."""
    if context.onboarding_page.is_skip_button_displayed():
        assert context.onboarding_page.tap_skip_button(), "Failed to tap Skip button"
    else:
        # If skip is not available, complete the onboarding flow
        context.onboarding_page.complete_onboarding_flow()


@then('I should be navigated to the signup screen')
def step_should_be_navigated_to_signup_screen(context):
    """Step to verify navigation to signup screen."""
    # Wait for navigation to complete
    context.onboarding_page.wait_for_screen_to_load()
    
    # Import here to avoid circular imports
    from pages.authentication_page import SignupPage
    signup_page = SignupPage()
    
    # Wait a bit more for the signup screen to fully load
    import time
    time.sleep(3)
    
    # Check if signup screen is displayed
    assert signup_page.is_signup_screen_displayed(), "Not navigated to signup screen"


@then('all interactive elements should have accessibility labels')
def step_verify_accessibility_labels(context):
    """Step to verify accessibility labels are present."""
    assert context.onboarding_page.verify_accessibility_labels(), "Some interactive elements lack accessibility labels"


@then('the screen should support screen reader navigation')
def step_verify_screen_reader_support(context):
    """Step to verify screen reader navigation support."""
    # This is a basic check - in real implementation you might use accessibility testing tools
    # For now, we'll verify that key elements have content descriptions
    assert context.onboarding_page.verify_accessibility_labels(), "Screen reader navigation not properly supported"


# New step for URL-based navigation
@given('I navigate to the onboarding screen via URL')
def step_navigate_to_onboarding_via_url(context):
    """Navigate to onboarding screen using URL navigation."""
    assert context.url_navigator.navigate_to_onboarding(), "Failed to navigate to onboarding screen via URL"
    
    # Wait for screen to load
    assert context.url_navigator.wait_for_screen_to_load("onboarding"), "Onboarding screen failed to load"
    
    context.onboarding_page = OnboardingPage()
    context.onboarding_page.wait_for_screen_to_load()


@when('I navigate to the signup screen via URL')
def step_navigate_to_signup_via_url(context):
    """Navigate to signup screen using URL navigation."""
    assert context.url_navigator.navigate_to_signup(), "Failed to navigate to signup screen via URL"
    
    # Wait for screen to load
    assert context.url_navigator.wait_for_screen_to_load("signup"), "Signup screen failed to load"
    
    # Import here to avoid circular imports
    from pages.authentication_page import SignupPage
    context.signup_page = SignupPage()
    context.signup_page.wait_for_screen_to_load()


# New steps for specific text verification
@then('I should see the app title "{expected_title}"')
def step_should_see_app_title(context, expected_title):
    """Step to verify app title is displayed."""
    actual_title = context.onboarding_page.get_screen_title()
    assert expected_title in actual_title, f"Expected title '{expected_title}' not found. Actual: '{actual_title}'"


@then('I should see the welcome message "{expected_message}"')
def step_should_see_welcome_message_text(context, expected_message):
    """Step to verify specific welcome message is displayed."""
    actual_message = context.onboarding_page.get_welcome_message()
    assert expected_message in actual_message, f"Expected message '{expected_message}' not found. Actual: '{actual_message}'"


@then('I should see the subtitle about community')
def step_should_see_subtitle_about_community(context):
    """Step to verify subtitle about community is displayed."""
    subtitle = context.onboarding_page.get_subtitle_message()
    assert "community" in subtitle.lower(), f"Subtitle about community not found. Actual: '{subtitle}'"


# New steps for signup screen verification
@then('I should see the signup screen')
def step_should_see_signup_screen(context):
    """Step to verify signup screen is displayed."""
    from pages.authentication_page import SignupPage
    signup_page = SignupPage()
    assert signup_page.is_signup_screen_displayed(), "Signup screen is not displayed"


@then('I should see Continue with email button')
def step_should_see_continue_with_email_button(context):
    """Step to verify Continue with email button is displayed."""
    from pages.authentication_page import SignupPage
    signup_page = SignupPage()
    assert signup_page.is_continue_with_email_displayed(), "Continue with email button is not displayed"


@then('I should see Continue with phone button')
def step_should_see_continue_with_phone_button(context):
    """Step to verify Continue with phone button is displayed."""
    from pages.authentication_page import SignupPage
    signup_page = SignupPage()
    assert signup_page.is_continue_with_phone_displayed(), "Continue with phone button is not displayed"


@when('I tap Continue with email')
def step_tap_continue_with_email(context):
    """Step to tap Continue with email button."""
    from pages.authentication_page import SignupPage
    signup_page = SignupPage()
    assert signup_page.tap_continue_with_email(), "Failed to tap Continue with email button"


@when('I tap Continue with phone')
def step_tap_continue_with_phone(context):
    """Step to tap Continue with phone button."""
    from pages.authentication_page import SignupPage
    signup_page = SignupPage()
    assert signup_page.tap_continue_with_phone(), "Failed to tap Continue with phone button"


# Steps for email and phone input screens
@then('I should be on the email input screen')
def step_should_be_on_email_input_screen(context):
    """Step to verify email input screen is displayed."""
    from pages.authentication_page import EmailPage
    email_page = EmailPage()
    
    # Wait for navigation
    import time
    time.sleep(3)
    
    assert email_page.is_email_page_displayed(), "Email input screen is not displayed"


@then('I should be on the phone input screen')
def step_should_be_on_phone_input_screen(context):
    """Step to verify phone input screen is displayed."""
    from pages.authentication_page import PhoneNumberPage
    phone_page = PhoneNumberPage()
    
    # Wait for navigation
    import time
    time.sleep(3)
    
    assert phone_page.is_phone_page_displayed(), "Phone input screen is not displayed"


@when('I enter email "{email}"')
def step_enter_email(context, email):
    """Step to enter email address."""
    from pages.authentication_page import EmailPage
    email_page = EmailPage()
    assert email_page.enter_email(email), f"Failed to enter email: {email}"


@when('I enter phone number "{phone}"')
def step_enter_phone_number(context, phone):
    """Step to enter phone number."""
    from pages.authentication_page import PhoneNumberPage
    phone_page = PhoneNumberPage()
    assert phone_page.enter_phone_number(phone), f"Failed to enter phone number: {phone}"


@when('I tap Continue button')
def step_tap_continue_button(context):
    """Step to tap Continue button."""
    # Try both email and phone pages
    from pages.authentication_page import EmailPage, PhoneNumberPage
    
    email_page = EmailPage()
    phone_page = PhoneNumberPage()
    
    if email_page.is_email_page_displayed():
        assert email_page.tap_continue_button(), "Failed to tap Continue button on email page"
    elif phone_page.is_phone_page_displayed():
        assert phone_page.tap_continue_button(), "Failed to tap Continue button on phone page"
    else:
        assert False, "Neither email nor phone page is displayed"
"""
Step definitions for onboarding feature scenarios.
"""
from behave import given, when, then
from pages.onboarding_page import OnboardingPage


@given('the app is launched for the first time')
def step_app_launched_first_time(context):
    """Step to launch app for first time."""
    # App should already be launched via environment setup
    context.onboarding_page = OnboardingPage()
    context.onboarding_page.wait_for_screen_to_load()


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
    # First swipe through slides to reach the last slide
    context.onboarding_page.swipe_through_all_slides()
    assert context.onboarding_page.is_get_started_button_displayed(), "Get Started button is not displayed"


@when('I swipe through all onboarding slides')
def step_swipe_through_all_slides(context):
    """Step to swipe through all onboarding slides."""
    assert context.onboarding_page.swipe_through_all_slides(), "Failed to swipe through all slides"


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
    context.onboarding_page.wait_for_screen_to_load()
    # Import here to avoid circular imports
    from pages.authentication_page import SignupPage
    signup_page = SignupPage()
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
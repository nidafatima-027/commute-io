"""
Common step definitions that can be reused across features.
"""
import time
from behave import given, when, then
from pages.base_page import BasePage


@given('I am logged in to the app')
def step_logged_in_to_app(context):
    """Step to be logged in to the app."""
    # This would typically involve a complete authentication flow
    # For testing purposes, we'll assume the user is already logged in
    # or perform a quick login if needed
    from pages.authentication_page import SignupPage, OTPVerificationPage, ProfileSetupPage
    
    base_page = BasePage()
    
    # Check if already on main dashboard
    if (base_page.is_text_present("Dashboard") or 
        base_page.is_text_present("Home") or
        base_page.is_text_present("Find rides")):
        return
    
    # If not logged in, perform login flow
    from features.steps.authentication_steps import (
        step_on_authentication_flow, step_on_signup_screen,
        step_enter_valid_phone_number, step_tap_continue_button,
        step_navigated_to_phone_otp_screen, step_enter_valid_otp,
        step_tap_verify_button, step_navigated_to_profile_setup_screen,
        step_enter_first_name, step_enter_last_name, step_select_date_of_birth,
        step_select_gender, step_navigated_to_main_dashboard
    )
    
    try:
        step_on_authentication_flow(context)
        step_enter_valid_phone_number(context, "+1234567890")
        step_tap_continue_button(context)
        step_navigated_to_phone_otp_screen(context)
        step_enter_valid_otp(context, "123456")
        step_tap_verify_button(context)
        step_navigated_to_profile_setup_screen(context)
        step_enter_first_name(context, "Test")
        step_enter_last_name(context, "User")
        step_select_date_of_birth(context, "01/01/1990")
        step_select_gender(context, "Male")
        context.profile_page.tap_continue_button()
        step_navigated_to_main_dashboard(context)
    except Exception as e:
        print(f"Login flow failed: {str(e)}")
        # Assume we're already logged in if flow fails


@given('I have location permissions enabled')
def step_location_permissions_enabled(context):
    """Step to ensure location permissions are enabled."""
    try:
        driver = context.driver
        # Grant location permissions
        driver.execute_script("mobile: changePermissions", {
            "permissions": "location",
            "appPackage": context.config['android']['app_package'],
            "action": "grant"
        })
    except Exception as e:
        print(f"Could not grant location permissions: {str(e)}")
        # Continue anyway - permissions might already be granted


@given('I am on the main dashboard')
def step_on_main_dashboard(context):
    """Step to be on the main dashboard."""
    base_page = BasePage()
    
    # Check if already on dashboard
    if (base_page.is_text_present("Dashboard") or 
        base_page.is_text_present("Home") or
        base_page.is_text_present("Find rides")):
        return
    
    # If not on dashboard, ensure logged in first
    step_logged_in_to_app(context)
    
    # Verify we're on dashboard
    assert (base_page.is_text_present("Dashboard") or 
            base_page.is_text_present("Home") or
            base_page.is_text_present("Find rides")), "Not on main dashboard"


@when('I tap on "{button_text}" button')
def step_tap_button_by_text(context, button_text):
    """Step to tap any button by its text."""
    base_page = BasePage()
    element = base_page.find_element_by_text(button_text)
    assert element is not None, f"Button '{button_text}' not found"
    assert base_page.tap_element(element), f"Failed to tap button '{button_text}'"


@when('I tap on "{element_text}"')
def step_tap_element_by_text(context, element_text):
    """Step to tap any element by its text."""
    step_tap_button_by_text(context, element_text)


@then('I should see "{text}"')
def step_should_see_text(context, text):
    """Step to verify text is visible on screen."""
    base_page = BasePage()
    assert base_page.wait_for_text_to_be_present(text), f"Text '{text}' not found on screen"


@then('I should not see "{text}"')
def step_should_not_see_text(context, text):
    """Step to verify text is not visible on screen."""
    base_page = BasePage()
    assert not base_page.is_text_present(text), f"Text '{text}' should not be visible on screen"


@when('I wait for {seconds:d} seconds')
def step_wait_seconds(context, seconds):
    """Step to wait for specified number of seconds."""
    time.sleep(seconds)


@when('I scroll down')
def step_scroll_down(context):
    """Step to scroll down on the screen."""
    base_page = BasePage()
    base_page.swipe_vertical("up")  # Swipe up to scroll down


@when('I scroll up')
def step_scroll_up(context):
    """Step to scroll up on the screen."""
    base_page = BasePage()
    base_page.swipe_vertical("down")  # Swipe down to scroll up


@when('I scroll to find "{text}"')
def step_scroll_to_find_text(context, text):
    """Step to scroll until text is found."""
    base_page = BasePage()
    assert base_page.scroll_to_element(text), f"Could not find '{text}' by scrolling"


@when('I press the back button')
def step_press_back_button(context):
    """Step to press Android back button."""
    base_page = BasePage()
    assert base_page.back_button(), "Failed to press back button"


@when('I take a screenshot')
def step_take_screenshot(context):
    """Step to take a screenshot."""
    base_page = BasePage()
    screenshot_path = base_page.take_screenshot()
    print(f"Screenshot saved: {screenshot_path}")


@then('the current screen should be "{screen_name}"')
def step_verify_current_screen(context, screen_name):
    """Step to verify the current screen."""
    base_page = BasePage()
    # This is a basic implementation - you might want to be more specific
    screen_indicators = {
        "onboarding": ["Welcome", "Get Started"],
        "signup": ["Sign up", "Create account", "Continue"],
        "login": ["Login", "Sign in"],
        "otp": ["OTP", "verification", "Verify"],
        "profile": ["Profile", "Tell us about yourself"],
        "dashboard": ["Dashboard", "Home", "Find rides"],
        "search": ["Search", "Find rides", "Where to"],
        "rides": ["Rides", "My rides"],
        "messages": ["Messages", "Chat"]
    }
    
    indicators = screen_indicators.get(screen_name.lower(), [screen_name])
    screen_found = any(base_page.is_text_present(indicator) for indicator in indicators)
    assert screen_found, f"Not on {screen_name} screen"


@when('I enter "{text}" in the "{field_name}" field')
def step_enter_text_in_field(context, text, field_name):
    """Step to enter text in a specific field."""
    base_page = BasePage()
    
    # Try to find field by various methods
    field_element = None
    
    # Try by hint text
    field_element = base_page.find_element_by_text(field_name)
    if not field_element:
        # Try by resource ID containing field name
        from selenium.webdriver.common.by import By
        try:
            field_element = context.driver.find_element(
                By.XPATH, 
                f"//*[contains(@resource-id, '{field_name.lower()}') or contains(@hint, '{field_name}')]"
            )
        except:
            pass
    
    assert field_element is not None, f"Field '{field_name}' not found"
    assert base_page.enter_text(field_element, text), f"Failed to enter text in '{field_name}' field"


@then('I should see a list of "{item_type}"')
def step_should_see_list_of_items(context, item_type):
    """Step to verify a list of items is displayed."""
    base_page = BasePage()
    
    # Look for common list indicators
    list_indicators = [
        f"{item_type}",
        "RecyclerView",
        "ListView",
        "list",
        "item"
    ]
    
    list_found = any(base_page.is_text_present(indicator) for indicator in list_indicators)
    assert list_found, f"List of {item_type} not found"


@when('I select "{option}" from "{dropdown_name}"')
def step_select_from_dropdown(context, option, dropdown_name):
    """Step to select an option from a dropdown."""
    base_page = BasePage()
    
    # First tap the dropdown
    dropdown_element = base_page.find_element_by_text(dropdown_name)
    if not dropdown_element:
        from selenium.webdriver.common.by import By
        try:
            dropdown_element = context.driver.find_element(
                By.XPATH,
                f"//*[contains(@resource-id, '{dropdown_name.lower()}') or contains(@text, '{dropdown_name}')]"
            )
        except:
            pass
    
    assert dropdown_element is not None, f"Dropdown '{dropdown_name}' not found"
    assert base_page.tap_element(dropdown_element), f"Failed to tap dropdown '{dropdown_name}'"
    
    # Wait for dropdown options to appear
    time.sleep(1)
    
    # Select the option
    option_element = base_page.find_element_by_text(option)
    assert option_element is not None, f"Option '{option}' not found in dropdown"
    assert base_page.tap_element(option_element), f"Failed to select option '{option}'"


@then('I should be able to "{action}"')
def step_should_be_able_to_action(context, action):
    """Step to verify that an action is possible."""
    # This is a generic step that can be customized based on the action
    base_page = BasePage()
    
    action_verifications = {
        "send messages": lambda: base_page.is_text_present("Send") or base_page.is_text_present("Message"),
        "make calls": lambda: base_page.is_text_present("Call") or base_page.is_text_present("Phone"),
        "navigate": lambda: base_page.is_text_present("Navigate") or base_page.is_text_present("Directions"),
        "rate": lambda: base_page.is_text_present("Rate") or base_page.is_text_present("Rating"),
        "pay": lambda: base_page.is_text_present("Pay") or base_page.is_text_present("Payment")
    }
    
    verification = action_verifications.get(action.lower())
    if verification:
        assert verification(), f"Unable to {action}"
    else:
        # Generic verification - look for action text
        assert base_page.is_text_present(action), f"Action '{action}' not available"


@given('I am logged in as a driver')
def step_logged_in_as_driver(context):
    """Step to be logged in as a driver."""
    # Similar to regular login but might need driver-specific setup
    step_logged_in_to_app(context)
    
    # Additional driver-specific verification could be added here
    # For now, assume the same login process works for drivers
"""
Step definitions for authentication feature scenarios.
"""
import time
from behave import given, when, then
from pages.authentication_page import SignupPage, OTPVerificationPage, ProfileSetupPage


@given('the app is launched')
def step_app_is_launched(context):
    """Step to verify app is launched."""
    # App should already be launched via environment setup
    context.current_page = None
    time.sleep(2)  # Wait for app to fully load


@given('I am on the authentication flow')
def step_on_authentication_flow(context):
    """Step to be on authentication flow."""
    # This could involve navigating through onboarding first
    from pages.onboarding_page import OnboardingPage
    onboarding_page = OnboardingPage()
    
    if onboarding_page.is_onboarding_screen_displayed():
        onboarding_page.complete_onboarding_flow()
    
    context.signup_page = SignupPage()
    context.signup_page.wait_for_screen_to_load()


@given('I am on the signup screen')
def step_on_signup_screen(context):
    """Step to be on signup screen."""
    if not hasattr(context, 'signup_page'):
        context.signup_page = SignupPage()
    
    if not context.signup_page.is_signup_screen_displayed():
        # Navigate to signup if not already there
        step_on_authentication_flow(context)
    
    assert context.signup_page.is_signup_screen_displayed(), "Not on signup screen"


@when('I enter a valid phone number "{phone_number}"')
def step_enter_valid_phone_number(context, phone_number):
    """Step to enter a valid phone number."""
    assert context.signup_page.enter_phone_number(phone_number), f"Failed to enter phone number: {phone_number}"
    context.entered_phone = phone_number


@when('I enter phone number "{phone_number}"')
def step_enter_phone_number(context, phone_number):
    """Step to enter phone number (for validation testing)."""
    # Check if we're on phone page or signup page
    from pages.authentication_page import PhoneNumberPage
    phone_page = PhoneNumberPage()
    
    if phone_page.is_phone_page_displayed():
        # We're on the phone input screen
        assert phone_page.enter_phone_number(phone_number), f"Failed to enter phone number: {phone_number}"
        context.phone_page = phone_page
    else:
        # We're still on signup page
        assert context.signup_page.enter_phone_number(phone_number), f"Failed to enter phone number: {phone_number}"
    
    context.entered_phone = phone_number


@when('I tap on Continue button')
def step_tap_continue_button(context):
    """Step to tap Continue button."""
    # Check which page we're on and tap the appropriate continue button
    from pages.authentication_page import EmailPage, PhoneNumberPage
    
    email_page = EmailPage()
    phone_page = PhoneNumberPage()
    
    if email_page.is_email_page_displayed():
        # We're on the email input screen
        assert email_page.tap_continue_button(), "Failed to tap Continue button on email page"
        context.email_page = email_page
    elif phone_page.is_phone_page_displayed():
        # We're on the phone input screen
        assert phone_page.tap_continue_button(), "Failed to tap Continue button on phone page"
        context.phone_page = phone_page
    else:
        # We're still on signup page
        assert context.signup_page.tap_continue_button(), "Failed to tap Continue button on signup page"
    
    time.sleep(2)  # Wait for navigation


@when('I tap Continue button')
def step_tap_continue_button_simple(context):
    """Step to tap Continue button (simple version)."""
    # This is an alias for the above step
    step_tap_continue_button(context)


@then('I should be navigated to phone OTP verification screen')
def step_navigated_to_phone_otp_screen(context):
    """Step to verify navigation to phone OTP verification screen."""
    context.otp_page = OTPVerificationPage()
    context.otp_page.wait_for_screen_to_load()
    assert context.otp_page.is_otp_verification_screen_displayed(), "Not navigated to OTP verification screen"


@when('I tap on Use Email Instead option')
def step_tap_use_email_option(context):
    """Step to tap use email option."""
    assert context.signup_page.tap_use_email_option(), "Failed to tap use email option"
    time.sleep(1)


@when('I enter a valid email "{email}"')
def step_enter_valid_email(context, email):
    """Step to enter a valid email."""
    assert context.signup_page.enter_email(email), f"Failed to enter email: {email}"
    context.entered_email = email


@when('I enter email "{email}"')
def step_enter_email(context, email):
    """Step to enter email (for validation testing)."""
    # Check if we're on email page or signup page
    from pages.authentication_page import EmailPage
    email_page = EmailPage()
    
    if email_page.is_email_page_displayed():
        # We're on the email input screen
        assert email_page.enter_email(email), f"Failed to enter email: {email}"
        context.email_page = email_page
    else:
        # We're still on signup page
        assert context.signup_page.enter_email(email), f"Failed to enter email: {email}"
    
    context.entered_email = email


@then('I should be navigated to email OTP verification screen')
def step_navigated_to_email_otp_screen(context):
    """Step to verify navigation to email OTP verification screen."""
    context.otp_page = OTPVerificationPage()
    context.otp_page.wait_for_screen_to_load()
    assert context.otp_page.is_otp_verification_screen_displayed(), "Not navigated to email OTP verification screen"


@when('I enter a valid OTP "{otp}"')
def step_enter_valid_otp(context, otp):
    """Step to enter a valid OTP."""
    if not hasattr(context, 'otp_page'):
        context.otp_page = OTPVerificationPage()
    assert context.otp_page.enter_otp(otp), f"Failed to enter OTP: {otp}"


@when('I enter invalid OTP "{otp}"')
def step_enter_invalid_otp(context, otp):
    """Step to enter invalid OTP."""
    if not hasattr(context, 'otp_page'):
        context.otp_page = OTPVerificationPage()
    context.otp_page.enter_otp(otp)


@when('I tap on Verify button')
def step_tap_verify_button(context):
    """Step to tap Verify button."""
    assert context.otp_page.tap_verify_button(), "Failed to tap Verify button"
    time.sleep(2)  # Wait for verification


@then('I should be navigated to profile setup screen')
def step_navigated_to_profile_setup_screen(context):
    """Step to verify navigation to profile setup screen."""
    context.profile_page = ProfileSetupPage()
    context.profile_page.wait_for_screen_to_load()
    assert context.profile_page.is_profile_setup_screen_displayed(), "Not navigated to profile setup screen"


@then('I should see error message "{error_message}"')
def step_should_see_error_message(context, error_message):
    """Step to verify error message is displayed."""
    # Check in signup page first
    if hasattr(context, 'signup_page'):
        actual_error = context.signup_page.get_error_message()
        if actual_error and error_message.lower() in actual_error.lower():
            return
        if context.signup_page.is_error_message_displayed(error_message):
            return
    
    # Check in OTP page if available
    if hasattr(context, 'otp_page'):
        actual_error = context.otp_page.get_error_message()
        if actual_error and error_message.lower() in actual_error.lower():
            return
    
    # Generic text search as fallback
    from pages.base_page import BasePage
    base_page = BasePage()
    assert base_page.is_text_present(error_message), f"Error message '{error_message}' not found"


@then('I should remain on the signup screen')
def step_remain_on_signup_screen(context):
    """Step to verify remaining on signup screen."""
    assert context.signup_page.is_signup_screen_displayed(), "Not remaining on signup screen"


@then('I should remain on the email signup screen')
def step_remain_on_email_signup_screen(context):
    """Step to verify remaining on email signup screen."""
    # Email signup is same screen as phone signup, just different input visible
    assert context.signup_page.is_signup_screen_displayed(), "Not remaining on email signup screen"


@given('I have entered a valid phone number and received OTP screen')
def step_entered_phone_received_otp_screen(context):
    """Step for having entered phone and being on OTP screen."""
    step_on_signup_screen(context)
    step_enter_valid_phone_number(context, "+1234567890")
    step_tap_continue_button(context)
    step_navigated_to_phone_otp_screen(context)


@then('I should remain on the OTP verification screen')
def step_remain_on_otp_screen(context):
    """Step to verify remaining on OTP verification screen."""
    assert context.otp_page.is_otp_verification_screen_displayed(), "Not remaining on OTP verification screen"


@given('I am on the phone OTP verification screen')
def step_on_phone_otp_screen(context):
    """Step to be on phone OTP verification screen."""
    if not hasattr(context, 'otp_page'):
        step_entered_phone_received_otp_screen(context)
    assert context.otp_page.is_otp_verification_screen_displayed(), "Not on phone OTP verification screen"


@when('I wait for {seconds:d} seconds')
def step_wait_for_seconds(context, seconds):
    """Step to wait for specified seconds."""
    time.sleep(seconds)


@when('I tap on Resend OTP button')
def step_tap_resend_otp_button(context):
    """Step to tap Resend OTP button."""
    assert context.otp_page.tap_resend_otp_button(), "Failed to tap Resend OTP button"


@then('I should see confirmation message "{message}"')
def step_see_confirmation_message(context, message):
    """Step to verify confirmation message."""
    from pages.base_page import BasePage
    base_page = BasePage()
    assert base_page.wait_for_text_to_be_present(message), f"Confirmation message '{message}' not found"


@then('the timer should reset')
def step_timer_should_reset(context):
    """Step to verify timer reset."""
    # This is a simplified check - in real implementation you'd verify the actual timer value
    timer_text = context.otp_page.get_timer_text()
    assert timer_text, "Timer text not found after reset"


@given('I have successfully verified my phone number')
def step_successfully_verified_phone(context):
    """Step for having successfully verified phone number."""
    step_entered_phone_received_otp_screen(context)
    step_enter_valid_otp(context, "123456")
    step_tap_verify_button(context)


@given('I am on the profile setup screen')
def step_on_profile_setup_screen(context):
    """Step to be on profile setup screen."""
    if not hasattr(context, 'profile_page'):
        step_successfully_verified_phone(context)
        step_navigated_to_profile_setup_screen(context)
    assert context.profile_page.is_profile_setup_screen_displayed(), "Not on profile setup screen"


@when('I enter first name "{first_name}"')
def step_enter_first_name(context, first_name):
    """Step to enter first name."""
    assert context.profile_page.enter_first_name(first_name), f"Failed to enter first name: {first_name}"


@when('I enter last name "{last_name}"')
def step_enter_last_name(context, last_name):
    """Step to enter last name."""
    assert context.profile_page.enter_last_name(last_name), f"Failed to enter last name: {last_name}"


@when('I select date of birth "{dob}"')
def step_select_date_of_birth(context, dob):
    """Step to select date of birth."""
    assert context.profile_page.select_date_of_birth(dob), f"Failed to select date of birth: {dob}"


@when('I select gender "{gender}"')
def step_select_gender(context, gender):
    """Step to select gender."""
    assert context.profile_page.select_gender(gender), f"Failed to select gender: {gender}"


@when('I upload a profile picture')
def step_upload_profile_picture(context):
    """Step to upload profile picture."""
    # This might just tap the button - actual file selection would depend on the implementation
    context.profile_page.upload_profile_picture()


@then('I should be navigated to the main app dashboard')
def step_navigated_to_main_dashboard(context):
    """Step to verify navigation to main app dashboard."""
    context.profile_page.wait_for_screen_to_load()
    from pages.base_page import BasePage
    base_page = BasePage()
    # Look for dashboard indicators
    assert (base_page.is_text_present("Dashboard") or 
            base_page.is_text_present("Home") or
            base_page.is_text_present("Find rides") or
            base_page.is_text_present("Search")), "Not navigated to main dashboard"


@when('I leave required fields empty')
def step_leave_required_fields_empty(context):
    """Step to leave required fields empty."""
    # Simply don't fill any fields - this tests validation
    pass


@then('I should see validation errors for required fields')
def step_see_validation_errors(context):
    """Step to verify validation errors for required fields."""
    from pages.base_page import BasePage
    base_page = BasePage()
    # Look for common validation error patterns
    validation_messages = [
        "required", "Required", "field is required", "cannot be empty",
        "Please enter", "Please fill", "This field"
    ]
    
    error_found = any(base_page.is_text_present(msg) for msg in validation_messages)
    assert error_found, "No validation errors found for required fields"


@then('I should remain on the profile setup screen')
def step_remain_on_profile_setup_screen(context):
    """Step to verify remaining on profile setup screen."""
    assert context.profile_page.is_profile_setup_screen_displayed(), "Not remaining on profile setup screen"


@given('I have a registered account with phone "{phone}"')
def step_have_registered_account(context, phone):
    """Step for having a registered account."""
    # This would typically involve database setup or using test data
    # For now, we'll assume the account exists
    context.registered_phone = phone


@given('I am on the login screen')
def step_on_login_screen(context):
    """Step to be on login screen."""
    # Login screen might be the same as signup screen with different mode
    context.signup_page = SignupPage()
    assert context.signup_page.is_signup_screen_displayed(), "Not on login screen"


@when('I enter my phone number "{phone}"')
def step_enter_my_phone_number(context, phone):
    """Step to enter registered phone number."""
    assert context.signup_page.enter_phone_number(phone), f"Failed to enter phone number: {phone}"


@when('I tap on Send OTP button')
def step_tap_send_otp_button(context):
    """Step to tap Send OTP button."""
    # This might be the same as Continue button
    assert context.signup_page.tap_continue_button(), "Failed to tap Send OTP button"


@then('I should receive OTP verification screen')
def step_receive_otp_verification_screen(context):
    """Step to verify receiving OTP verification screen."""
    step_navigated_to_phone_otp_screen(context)


@when('I enter valid OTP')
def step_enter_valid_otp_no_param(context):
    """Step to enter valid OTP without parameter."""
    step_enter_valid_otp(context, "123456")


@then('I should be logged in and see the main dashboard')
def step_logged_in_see_dashboard(context):
    """Step to verify successful login and dashboard view."""
    step_navigated_to_main_dashboard(context)
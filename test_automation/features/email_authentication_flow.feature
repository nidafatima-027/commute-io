Feature: Email Authentication Flow
  As a user
  I want to complete the email authentication process
  So that I can access the main app dashboard

  Background:
    Given the app is launched for the first time

  @email_flow @smoke
  Scenario: Complete email authentication flow
    # Step 1: Start from onboarding
    When I am on the onboarding screen
    Then I should see the app title "Commute_io"
    And I should see the welcome message "Carpooling made easy"
    
    # Step 2: Navigate to signup
    When I tap on Get Started button
    Then I should be navigated to the signup screen
    And I should see Continue with email button
    And I should see Continue with phone button
    
    # Step 3: Choose email authentication
    When I tap Continue with email
    Then I should be on the email input screen
    
    # Step 4: Enter email address
    When I enter email "test@example.com"
    And I tap Continue button
    Then I should be on the OTP verification screen
    
    # Step 5: Enter OTP code
    When I enter OTP "123456"
    And I tap Verify button
    Then I should be on the profile setup screen
    
    # Step 6: Complete profile setup
    When I enter first name "John"
    And I enter last name "Doe"
    And I select date of birth "1990-01-01"
    And I select gender "Male"
    And I tap Continue button
    Then I should be on the main app dashboard

  @email_flow @error_handling
  Scenario: Email authentication with invalid email
    When I am on the onboarding screen
    And I tap on Get Started button
    Then I should be navigated to the signup screen
    When I tap Continue with email
    Then I should be on the email input screen
    When I enter email "invalid-email"
    And I tap Continue button
    Then I should see error message "Please enter a valid email address"

  @email_flow @error_handling
  Scenario: Email authentication with invalid OTP
    When I am on the onboarding screen
    And I tap on Get Started button
    Then I should be navigated to the signup screen
    When I tap Continue with email
    Then I should be on the email input screen
    When I enter email "test@example.com"
    And I tap Continue button
    Then I should be on the OTP verification screen
    When I enter OTP "000000"
    And I tap Verify button
    Then I should see error message "Invalid OTP code"

  @email_flow @profile_validation
  Scenario: Profile setup validation
    When I am on the onboarding screen
    And I tap on Get Started button
    Then I should be navigated to the signup screen
    When I tap Continue with email
    Then I should be on the email input screen
    When I enter email "test@example.com"
    And I tap Continue button
    Then I should be on the OTP verification screen
    When I enter OTP "123456"
    And I tap Verify button
    Then I should be on the profile setup screen
    When I tap Continue button without entering data
    Then I should see error message "Please fill in all required fields"
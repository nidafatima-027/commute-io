Feature: Complete User Flow
  As a new user
  I want to complete the entire signup and authentication process
  So that I can start using the Commute.io rideshare app

  Background:
    Given the app is launched for the first time

  @complete_flow @smoke
  Scenario: Complete email authentication flow
    When I am on the onboarding screen
    And I tap on Get Started button
    Then I should be navigated to the signup screen
    And I should see Continue with email button
    And I should see Continue with phone button
    When I tap Continue with email
    Then I should be on the email input screen
    When I enter email "test@example.com"
    And I tap Continue button
    Then I should be on the OTP verification screen
    When I enter OTP "123456"
    And I tap Verify button
    Then I should be on the profile setup screen

  @complete_flow @phone
  Scenario: Complete phone authentication flow
    When I am on the onboarding screen
    And I tap on Get Started button
    Then I should be navigated to the signup screen
    When I tap Continue with phone
    Then I should be on the phone input screen
    When I enter phone number "+1234567890"
    And I tap Continue button
    Then I should be on the OTP verification screen
    When I enter OTP "123456"
    And I tap Verify button
    Then I should be on the profile setup screen

  @complete_flow @profile
  Scenario: Complete profile setup
    Given I am on the profile setup screen
    When I enter first name "John"
    And I enter last name "Doe"
    And I select date of birth "1990-01-01"
    And I select gender "Male"
    And I tap Continue button
    Then I should be on the main app dashboard

  @complete_flow @validation
  Scenario: Email validation error
    When I am on the onboarding screen
    And I tap on Get Started button
    Then I should be navigated to the signup screen
    When I tap Continue with email
    Then I should be on the email input screen
    When I enter email "invalid-email"
    And I tap Continue button
    Then I should see error message "Invalid email"

  @complete_flow @validation
  Scenario: Phone validation error
    When I am on the onboarding screen
    And I tap on Get Started button
    Then I should be navigated to the signup screen
    When I tap Continue with phone
    Then I should be on the phone input screen
    When I enter phone number "invalid"
    And I tap Continue button
    Then I should see error message "Invalid phone number"

  @complete_flow @otp
  Scenario: OTP verification error
    Given I am on the OTP verification screen
    When I enter OTP "000000"
    And I tap Verify button
    Then I should see error message "Invalid OTP"

  @complete_flow @navigation
  Scenario: Back navigation from email screen
    When I am on the onboarding screen
    And I tap on Get Started button
    Then I should be navigated to the signup screen
    When I tap Continue with email
    Then I should be on the email input screen
    When I tap Back button
    Then I should be navigated to the signup screen

  @complete_flow @navigation
  Scenario: Back navigation from phone screen
    When I am on the onboarding screen
    And I tap on Get Started button
    Then I should be navigated to the signup screen
    When I tap Continue with phone
    Then I should be on the phone input screen
    When I tap Back button
    Then I should be navigated to the signup screen

  @complete_flow @accessibility
  Scenario: Accessibility features throughout flow
    When I am on the onboarding screen
    Then all interactive elements should have accessibility labels
    And I tap on Get Started button
    Then I should be navigated to the signup screen
    And all interactive elements should have accessibility labels
    When I tap Continue with email
    Then I should be on the email input screen
    And all interactive elements should have accessibility labels
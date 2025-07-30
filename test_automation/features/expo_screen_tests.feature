Feature: Expo Go Screen Tests
  As a developer
  I want to test individual screens in Expo Go
  So that I can verify each screen works independently

  Background:
    Given the app is launched for the first time

  @expo @signup
  Scenario: Test signup screen directly
    Given I navigate directly to signup screen
    Then I should see the signup screen
    And I should see Continue with email button
    And I should see Continue with phone button

  @expo @email
  Scenario: Test email input screen directly
    Given I navigate directly to email input screen
    Then I should be on the email input screen
    When I enter email "test@example.com"
    And I tap Continue button
    Then I should be on the OTP verification screen

  @expo @phone
  Scenario: Test phone input screen directly
    Given I navigate directly to phone input screen
    Then I should be on the phone input screen
    When I enter phone number "+1234567890"
    And I tap Continue button
    Then I should be on the OTP verification screen

  @expo @otp
  Scenario: Test OTP verification screen directly
    Given I navigate directly to OTP verification screen
    Then I should be on the OTP verification screen
    When I enter OTP "123456"
    And I tap Verify button
    Then I should be on the profile setup screen

  @expo @profile
  Scenario: Test profile setup screen directly
    Given I navigate directly to profile setup screen
    Then I should be on the profile setup screen
    When I enter first name "John"
    And I enter last name "Doe"
    And I select date of birth "1990-01-01"
    And I select gender "Male"
    And I tap Continue button
    Then I should be on the main app dashboard
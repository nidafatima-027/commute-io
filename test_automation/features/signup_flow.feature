Feature: Signup Flow
  As a new user
  I want to complete the signup process
  So that I can create an account and start using the Commute.io app

  Background:
    Given the app is launched for the first time

  @signup @smoke
  Scenario: Navigate to signup screen from Get Started
    When I am on the onboarding screen
    And I tap on Get Started button
    Then I should be navigated to the signup screen
    And I should see Continue with email button
    And I should see Continue with phone button

  @signup @email
  Scenario: Continue with email option
    Given I am on the onboarding screen
    When I tap on Get Started button
    Then I should be navigated to the signup screen
    When I tap Continue with email
    Then I should be on the email input screen

  @signup @phone
  Scenario: Continue with phone option
    Given I am on the onboarding screen
    When I tap on Get Started button
    Then I should be navigated to the signup screen
    When I tap Continue with phone
    Then I should be on the phone input screen

           # URL navigation scenario removed as requested

  @signup @accessibility
  Scenario: Signup screen accessibility
    Given I navigate to the signup screen via URL
    Then all interactive elements should have accessibility labels
    And the screen should support screen reader navigation
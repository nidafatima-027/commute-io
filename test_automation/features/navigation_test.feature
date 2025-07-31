Feature: Navigation Flow Test
  As a user
  I want to navigate through the app screens
  So that I can verify the flow works correctly

  Background:
    Given the app is launched for the first time

  @navigation @smoke
  Scenario: Navigate from Get Started to signup screen
    When I am on the onboarding screen
    And I tap on Get Started button
    Then I should be navigated to the signup screen
    And I should see Continue with email button
    And I should see Continue with phone button

  @navigation @email
  Scenario: Navigate to email input screen
    When I am on the onboarding screen
    And I tap on Get Started button
    Then I should be navigated to the signup screen
    When I tap Continue with email
    Then I should be on the email input screen

  @navigation @phone
  Scenario: Navigate to phone input screen
    When I am on the onboarding screen
    And I tap on Get Started button
    Then I should be navigated to the signup screen
    When I tap Continue with phone
    Then I should be on the phone input screen
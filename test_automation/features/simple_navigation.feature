Feature: Simple Navigation Test
  As a user
  I want to navigate from Get Started to signup and tap buttons
  So that I can see what happens during navigation

  Background:
    Given the app is launched for the first time

  @simple @navigation
  Scenario: Navigate and tap Continue with email
    When I am on the onboarding screen
    And I tap on Get Started button
    Then I should be navigated to the signup screen
    And I should see Continue with email button
    When I tap Continue with email
    Then I should be on the email input screen

  @simple @navigation
  Scenario: Navigate and tap Continue with phone
    When I am on the onboarding screen
    And I tap on Get Started button
    Then I should be navigated to the signup screen
    And I should see Continue with phone button
    When I tap Continue with phone
    Then I should be on the phone input screen
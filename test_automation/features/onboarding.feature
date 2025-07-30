Feature: App Onboarding
  As a new user
  I want to complete the onboarding process
  So that I can start using the Commute.io rideshare app

  Background:
    Given the app is launched for the first time

  @onboarding @smoke
  Scenario: View onboarding screens
    When I am on the onboarding screen
    Then I should see the welcome message
    And I should see onboarding slides
    And I should see the Get Started button

  @onboarding
  Scenario: Complete onboarding flow
    Given I am on the onboarding screen
    When I swipe through all onboarding slides
    And I tap on Get Started button
    Then I should be navigated to the signup screen

  @onboarding
  Scenario: Skip onboarding
    Given I am on the onboarding screen
    When I tap on Skip button if available
    Then I should be navigated to the signup screen

  @onboarding @accessibility
  Scenario: Onboarding accessibility features
    Given I am on the onboarding screen
    Then all interactive elements should have accessibility labels
    And the screen should support screen reader navigation
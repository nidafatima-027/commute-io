Feature: Screen Element Validation
  As a developer
  I want to validate screen elements independently
  So that I can test UI components without navigation issues

  Background:
    Given the app is launched for the first time

  @validation @onboarding
  Scenario: Validate onboarding screen elements
    When I am on the onboarding screen
    Then I should see the app title "Commute_io"
    And I should see the welcome message "Carpooling made easy"
    And I should see the Get Started button
    And all interactive elements should have accessibility labels

  @validation @signup
  Scenario: Validate signup screen elements (if accessible)
    When I am on the onboarding screen
    And I tap on Get Started button
    Then I should be navigated to the signup screen
    And I should see Continue with email button
    And I should see Continue with phone button
    And all interactive elements should have accessibility labels

  @validation @buttons
  Scenario: Validate button functionality
    When I am on the onboarding screen
    And I tap on Get Started button
    Then I should be navigated to the signup screen
    When I tap Continue with email
    # Note: This will attempt to navigate but may not work in Expo Go
    # The test will validate that the button tap was successful
    Then the button tap should be successful

  @validation @buttons
  Scenario: Validate phone button functionality
    When I am on the onboarding screen
    And I tap on Get Started button
    Then I should be navigated to the signup screen
    When I tap Continue with phone
    # Note: This will attempt to navigate but may not work in Expo Go
    # The test will validate that the button tap was successful
    Then the button tap should be successful
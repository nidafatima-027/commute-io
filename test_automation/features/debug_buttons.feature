Feature: Debug Button Detection
  As a developer
  I want to debug the button detection issue
  So that I can see what elements are actually visible

  Background:
    Given the app is launched for the first time

  @debug @buttons
  Scenario: Debug signup screen elements and button taps
    When I am on the onboarding screen
    And I tap on Get Started button
    Then I should be navigated to the signup screen
    And I should see Continue with email button
    And I should see Continue with phone button
    When I tap Continue with email
    # This will show debug information and attempt navigation
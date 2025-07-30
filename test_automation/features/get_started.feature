Feature: Get Started Page
  As a new user
  I want to see the Get Started page
  So that I can begin using the Commute.io rideshare app

  Background:
    Given the app is launched for the first time

  @get_started @smoke
  Scenario: View Get Started page elements
    When I am on the onboarding screen
    Then I should see the app title "Commute_io"
    And I should see the welcome message "Carpooling made easy"
    And I should see the subtitle about community
    And I should see the Get Started button

  @get_started
  Scenario: Navigate to signup from Get Started
    Given I am on the onboarding screen
    When I tap on Get Started button
    Then I should be navigated to the signup screen

  @get_started @accessibility
  Scenario: Get Started page accessibility
    Given I am on the onboarding screen
    Then all interactive elements should have accessibility labels
    And the screen should support screen reader navigation

  @get_started @url_navigation
  Scenario: Navigate to Get Started via URL
    Given I navigate to the onboarding screen via URL
    When I am on the onboarding screen
    Then I should see the Get Started button
    And I should see the welcome message "Carpooling made easy"
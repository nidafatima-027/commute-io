Feature: Driver Features
  As a driver
  I want to offer rides and manage ride requests
  So that I can provide transportation services

  Background:
    Given I am logged in as a driver
    And I am on the main dashboard

  @driver @offer_ride @smoke
  Scenario: Offer a new ride
    Given I am on the offer ride screen
    When I enter departure location "Downtown Plaza"
    And I enter destination "Airport Terminal"
    And I select departure date and time
    And I set number of available seats "3"
    And I set price per seat "$15"
    And I add ride description "Comfortable ride with AC"
    And I tap on "Publish Ride" button
    Then I should see ride confirmation
    And the ride should appear in my offered rides list

  @driver @requests
  Scenario: View and manage ride requests
    Given I have offered a ride
    And I am on the driver requests screen
    Then I should see pending ride requests
    When I tap on a ride request
    Then I should see requester details
    And I should see pickup location
    And I should see number of seats requested

  @driver @requests
  Scenario: Accept a ride request
    Given I have pending ride requests
    When I select a ride request
    And I tap on "Accept Request" button
    Then the request should be accepted
    And I should see confirmation message
    And the requester should be notified

  @driver @requests
  Scenario: Decline a ride request
    Given I have pending ride requests
    When I select a ride request
    And I tap on "Decline Request" button
    And I provide decline reason "Schedule conflict"
    Then the request should be declined
    And I should see confirmation message
    And the requester should be notified

  @driver @ride_management
  Scenario: Start a ride
    Given I have accepted ride requests
    And it's time for departure
    When I tap on "Start Ride" button
    Then the ride status should change to "In Progress"
    And passengers should be notified
    And GPS tracking should be enabled

  @driver @ride_management
  Scenario: Complete a ride
    Given I have a ride in progress
    When I arrive at the destination
    And I tap on "Complete Ride" button
    Then the ride status should change to "Completed"
    And passengers should be prompted to rate
    And payment should be processed

  @driver @ride_management
  Scenario: Cancel an offered ride
    Given I have offered a ride
    And no requests have been accepted yet
    When I tap on "Cancel Ride" button
    And I confirm cancellation
    And I provide cancellation reason "Emergency came up"
    Then the ride should be cancelled
    And interested passengers should be notified

  @driver @communication
  Scenario: Message passengers
    Given I have accepted ride requests
    When I tap on "Message Passengers" button
    Then I should see chat interface
    And I should be able to send messages to all passengers
    And I should be able to send individual messages

  @driver @profile
  Scenario: Update driver profile
    Given I am on the driver profile screen
    When I update my vehicle information
    And I update my license details
    And I upload required documents
    And I tap on "Save Changes" button
    Then my profile should be updated
    And I should see confirmation message

  @driver @earnings
  Scenario: View earnings summary
    Given I am on the driver summary screen
    Then I should see total earnings
    And I should see number of completed rides
    And I should see average rating
    And I should see earnings breakdown by date

  @driver @earnings
  Scenario: View detailed earnings
    Given I am on the driver summary details screen
    When I select a specific date range
    Then I should see detailed earnings for that period
    And I should see individual ride earnings
    And I should see deductions if any

  @driver @navigation
  Scenario: Get navigation to pickup location
    Given I have accepted a ride request
    When I tap on "Navigate to Pickup" button
    Then navigation app should open
    And route to pickup location should be displayed

  @driver @validation @negative
  Scenario Outline: Invalid ride offer details
    Given I am on the offer ride screen
    When I enter departure location "<departure>"
    And I enter destination "<destination>"
    And I set available seats "<seats>"
    And I set price "<price>"
    And I tap on "Publish Ride" button
    Then I should see error message "<error_message>"

    Examples:
      | departure | destination | seats | price | error_message |
      |           | Valid Dest  | 3     | $15   | Departure location is required |
      | Valid Dep |             | 3     | $15   | Destination is required |
      | Valid Dep | Valid Dest  | 0     | $15   | Number of seats must be greater than 0 |
      | Valid Dep | Valid Dest  | 3     |       | Price is required |
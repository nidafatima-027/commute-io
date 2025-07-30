Feature: Ride Booking
  As a registered user
  I want to book rides
  So that I can travel from one location to another

  Background:
    Given I am logged in to the app
    And I have location permissions enabled
    And I am on the main dashboard

  @ride_booking @smoke
  Scenario: Book an immediate ride
    Given I am on the ride search screen
    When I enter pickup location "123 Main St"
    And I enter destination "456 Oak Ave"
    And I tap on "Find Rides" button
    Then I should see available ride options
    When I select a ride option
    And I tap on "Book Ride" button
    Then I should see ride confirmation screen
    And I should see driver details
    And I should see estimated arrival time

  @ride_booking
  Scenario: Search for available rides
    Given I am on the ride search screen
    When I enter pickup location "Downtown Plaza"
    And I enter destination "Airport Terminal"
    And I select departure time "Now"
    And I tap on "Search" button
    Then I should see a list of available rides
    And each ride should display driver name
    And each ride should display pickup time
    And each ride should display price
    And each ride should display available seats

  @ride_booking
  Scenario: Filter ride search results
    Given I have searched for rides and see results
    When I apply price filter "Under $20"
    And I apply departure time filter "Within 30 minutes"
    And I apply rating filter "4+ stars"
    Then the results should be filtered accordingly
    And I should only see rides matching the criteria

  @ride_booking
  Scenario: Book a recurring ride
    Given I am on the create recurring ride screen
    When I enter pickup location "Home Address"
    And I enter destination "Office Address"
    And I select days "Monday, Tuesday, Wednesday, Thursday, Friday"
    And I select departure time "8:00 AM"
    And I select return time "6:00 PM"
    And I tap on "Create Recurring Ride" button
    Then I should see confirmation of recurring ride creation
    And the ride should appear in my recurring rides list

  @ride_booking @location
  Scenario: Use current location as pickup
    Given I am on the ride search screen
    And location services are enabled
    When I tap on "Use Current Location" for pickup
    Then my current location should be auto-filled as pickup location
    And I should see the address on the map

  @ride_booking @location
  Scenario: Select location from map
    Given I am on the ride search screen
    When I tap on the map to select pickup location
    And I drag the pin to desired location
    And I tap on "Confirm Location" button
    Then the selected location should be set as pickup location

  @ride_booking @negative
  Scenario Outline: Invalid location entry
    Given I am on the ride search screen
    When I enter pickup location "<pickup>"
    And I enter destination "<destination>"
    And I tap on "Find Rides" button
    Then I should see error message "<error_message>"

    Examples:
      | pickup      | destination | error_message |
      |             | Valid Dest  | Pickup location is required |
      | Valid Pick  |             | Destination is required |
      |             |             | Both pickup and destination are required |

  @ride_booking @payment
  Scenario: View ride pricing details
    Given I have selected a ride option
    When I view the ride details
    Then I should see base fare
    And I should see service fee
    And I should see total amount
    And I should see payment method

  @ride_booking @communication
  Scenario: Contact driver after booking
    Given I have successfully booked a ride
    And I am on the ride confirmation screen
    When I tap on "Message Driver" button
    Then I should be navigated to chat screen
    And I should be able to send messages to the driver

  @ride_booking @cancellation
  Scenario: Cancel a booked ride
    Given I have successfully booked a ride
    And the ride is not yet started
    When I tap on "Cancel Ride" button
    And I confirm cancellation
    Then the ride should be cancelled
    And I should see cancellation confirmation
    And I should receive refund if applicable
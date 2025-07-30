Feature: User Authentication
  As a user
  I want to register and login to the app
  So that I can access rideshare services

  Background:
    Given the app is launched
    And I am on the authentication flow

  @authentication @signup @smoke
  Scenario: Successful user registration with phone number
    Given I am on the signup screen
    When I enter a valid phone number "+1234567890"
    And I tap on "Continue" button
    Then I should be navigated to phone OTP verification screen
    When I enter a valid OTP "123456"
    And I tap on "Verify" button
    Then I should be navigated to profile setup screen

  @authentication @signup
  Scenario: Successful user registration with email
    Given I am on the signup screen
    When I tap on "Use Email Instead" option
    And I enter a valid email "test@example.com"
    And I tap on "Continue" button
    Then I should be navigated to email OTP verification screen
    When I enter a valid OTP "123456"
    And I tap on "Verify" button
    Then I should be navigated to profile setup screen

  @authentication @signup @negative
  Scenario Outline: Invalid phone number registration
    Given I am on the signup screen
    When I enter phone number "<phone_number>"
    And I tap on "Continue" button
    Then I should see error message "<error_message>"
    And I should remain on the signup screen

    Examples:
      | phone_number | error_message |
      | 123          | Please enter a valid phone number |
      | +123         | Please enter a valid phone number |
      | abc123       | Please enter a valid phone number |
      |              | Phone number is required |

  @authentication @signup @negative
  Scenario Outline: Invalid email registration
    Given I am on the signup screen
    When I tap on "Use Email Instead" option
    And I enter email "<email>"
    And I tap on "Continue" button
    Then I should see error message "<error_message>"
    And I should remain on the email signup screen

    Examples:
      | email        | error_message |
      | invalid      | Please enter a valid email address |
      | test@        | Please enter a valid email address |
      | @domain.com  | Please enter a valid email address |
      |              | Email is required |

  @authentication @otp @negative
  Scenario: Invalid OTP verification
    Given I have entered a valid phone number and received OTP screen
    When I enter invalid OTP "000000"
    And I tap on "Verify" button
    Then I should see error message "Invalid OTP. Please try again."
    And I should remain on the OTP verification screen

  @authentication @otp
  Scenario: Resend OTP functionality
    Given I am on the phone OTP verification screen
    When I wait for 60 seconds
    And I tap on "Resend OTP" button
    Then I should see confirmation message "OTP has been resent"
    And the timer should reset

  @authentication @profile
  Scenario: Complete profile setup after registration
    Given I have successfully verified my phone number
    And I am on the profile setup screen
    When I enter first name "John"
    And I enter last name "Doe"
    And I select date of birth "01/01/1990"
    And I select gender "Male"
    And I upload a profile picture
    And I tap on "Continue" button
    Then I should be navigated to the main app dashboard

  @authentication @profile @negative
  Scenario: Incomplete profile setup
    Given I am on the profile setup screen
    When I leave required fields empty
    And I tap on "Continue" button
    Then I should see validation errors for required fields
    And I should remain on the profile setup screen

  @authentication @login
  Scenario: Login with existing account
    Given I have a registered account with phone "+1234567890"
    And I am on the login screen
    When I enter my phone number "+1234567890"
    And I tap on "Send OTP" button
    Then I should receive OTP verification screen
    When I enter valid OTP
    And I tap on "Verify" button
    Then I should be logged in and see the main dashboard
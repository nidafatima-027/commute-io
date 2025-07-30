# Commute.io Mobile Test Automation Framework

A comprehensive BDD test automation framework for the Commute.io Android app using Python, Appium, and Behave.

## 🏗️ Framework Architecture

- **BDD Framework**: Behave (Gherkin syntax)
- **Mobile Automation**: Appium with Python client
- **Page Object Model**: Organized page classes for maintainability
- **Reporting**: Allure reporting with screenshots
- **Configuration**: YAML-based configuration management

## 📋 Prerequisites

### Software Requirements

1. **Python 3.8+**
2. **Java JDK 8+** (required by Appium)
3. **Android SDK** with ADB in PATH
4. **Node.js 14+** (for Appium server)
5. **Appium Server**

### Device Requirements

- Physical Android device with USB debugging enabled
- Commute.io app installed (`com.anonymous.boltexponativewind`)
- Device connected via USB

## 🚀 Quick Setup

### 1. Install Appium Server

```bash
npm install -g appium
npm install -g @appium/doctor

# Verify installation
appium-doctor --android
```

### 2. Clone and Setup Framework

```bash
cd test_automation

# Install Python dependencies
pip install -r requirements.txt

# Check prerequisites
python run_tests.py --check
```

### 3. Start Appium Server

```bash
appium --port 4723
```

### 4. Connect Device and Install App

```bash
# Check device connection
adb devices

# Install app (if not already installed)
adb install path/to/commute-app.apk

# Verify app installation
adb shell pm list packages | grep com.anonymous.boltexponativewind
```

## 🎯 Running Tests

### Basic Test Execution

```bash
# Run all tests
python run_tests.py

# Run smoke tests only
python run_tests.py --smoke

# Run specific feature
python run_tests.py --feature onboarding.feature

# Run tests with specific tags
python run_tests.py --tags "@authentication and @smoke"
```

### Advanced Test Execution

```bash
# Run authentication tests
python run_tests.py --auth

# Run ride booking tests
python run_tests.py --ride

# Generate Allure report
python run_tests.py --smoke --report

# Run with specific format
python run_tests.py --format json
```

### Direct Behave Commands

```bash
# Basic execution
behave

# Run with tags
behave --tags="@smoke"

# Run specific feature
behave features/onboarding.feature

# Generate Allure results
behave -f allure_behave.formatter:AllureFormatter -o allure-results
```

## 🏭 Framework Structure

```
test_automation/
├── features/
│   ├── onboarding.feature          # Onboarding scenarios
│   ├── authentication.feature     # Login/signup scenarios
│   ├── ride_booking.feature       # Ride booking scenarios
│   ├── driver_features.feature    # Driver-specific scenarios
│   ├── environment.py             # Behave hooks & setup
│   └── steps/
│       ├── onboarding_steps.py    # Onboarding step definitions
│       ├── authentication_steps.py # Auth step definitions
│       └── common_steps.py        # Reusable step definitions
├── pages/
│   ├── base_page.py               # Base page class
│   ├── onboarding_page.py         # Onboarding page object
│   └── authentication_page.py    # Auth page objects
├── utils/
│   ├── driver_factory.py          # WebDriver management
│   └── screenshot_helper.py       # Screenshot utilities
├── config/
│   └── config.yaml               # Test configuration
├── behave.ini                    # Behave configuration
├── requirements.txt              # Python dependencies
├── run_tests.py                 # Test runner script
└── README.md                    # This file
```

## 🎪 Available Test Scenarios

### Onboarding Tests
- View onboarding screens
- Complete onboarding flow
- Skip onboarding
- Accessibility features

### Authentication Tests
- Phone number registration
- Email registration
- OTP verification
- Profile setup
- Input validation
- Error handling

### Ride Booking Tests
- Search for rides
- Book immediate rides
- Book recurring rides
- Filter search results
- Location selection
- Price calculation

### Driver Features Tests
- Offer rides
- Manage ride requests
- Accept/decline requests
- Start/complete rides
- Earnings tracking

## 🏷️ Test Tags

Organize and filter tests using tags:

- `@smoke` - Critical functionality tests
- `@authentication` - User authentication tests
- `@onboarding` - App onboarding tests
- `@ride_booking` - Ride booking functionality
- `@driver` - Driver-specific features
- `@negative` - Negative/error scenario tests
- `@accessibility` - Accessibility compliance tests

## 🔧 Configuration

### Device Configuration

Edit `config/config.yaml`:

```yaml
android:
  platform_name: "Android"
  device_name: "Your Device Name"
  app_package: "com.anonymous.boltexponativewind"
  # Add device UDID if multiple devices
  # udid: "your-device-udid"
```

### Test Data Configuration

```yaml
test_data:
  valid_phone: "+1234567890"
  valid_email: "test@example.com"
  # Add your test data here
```

## 📊 Reporting

### Allure Reports

Generate beautiful HTML reports with screenshots:

```bash
# Run tests with Allure format
python run_tests.py --smoke --report

# Or manually generate
behave -f allure_behave.formatter:AllureFormatter -o allure-results
allure serve allure-results
```

### Console Output

```bash
# Pretty format (default)
behave -f pretty

# Plain format
behave -f plain

# JSON format
behave -f json
```

## 🐛 Troubleshooting

### Common Issues

1. **Appium server not running**
   ```bash
   # Start Appium server
   appium --port 4723
   ```

2. **Device not detected**
   ```bash
   # Check ADB connection
   adb devices
   adb kill-server
   adb start-server
   ```

3. **App not installed**
   ```bash
   # Verify app installation
   adb shell pm list packages | grep boltexponativewind
   ```

4. **Permission issues**
   ```bash
   # Grant app permissions manually on device
   # Or use ADB
   adb shell pm grant com.anonymous.boltexponativewind android.permission.ACCESS_FINE_LOCATION
   ```

### Debug Mode

Enable verbose logging:

```bash
# Run with debug output
behave --no-capture --show-timings -v

# Check Appium logs
appium --port 4723 --log-level debug
```

## 🤝 Contributing

### Adding New Tests

1. **Create Feature File**
   ```gherkin
   Feature: New Feature
     Scenario: New test scenario
       Given preconditions
       When actions
       Then assertions
   ```

2. **Implement Step Definitions**
   ```python
   @when('I perform new action')
   def step_new_action(context):
       page = NewPage()
       page.perform_action()
   ```

3. **Add Page Objects**
   ```python
   class NewPage(BasePage):
       def perform_action(self):
           # Implementation
   ```

### Best Practices

- Use Page Object Model for UI interactions
- Keep step definitions simple and reusable
- Add proper error handling and assertions
- Use meaningful test data
- Tag tests appropriately
- Add screenshots on failures

## 📞 Support

For issues and questions:

1. Check the troubleshooting section
2. Review Appium and Behave documentation
3. Check device and app setup
4. Verify Appium server connectivity

## 📚 Documentation Links

- [Appium Documentation](https://appium.io/docs/)
- [Behave Documentation](https://behave.readthedocs.io/)
- [Selenium WebDriver](https://selenium-python.readthedocs.io/)
- [Allure Reporting](https://docs.qameta.io/allure/)
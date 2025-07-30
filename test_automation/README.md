# Commute.io Test Automation

This directory contains automated tests for the Commute.io mobile app using Appium, Behave, and Python.

## 🚀 Quick Start

### 1. Setup Environment
```bash
# Navigate to test automation directory
cd test_automation

# Run the setup script (automatically detects your IP and installs dependencies)
python setup_test_environment.py
```

### 2. Start Required Services
```bash
# Start Expo development server (in project root)
npm start

# Start Appium server (in another terminal)
appium --port 4723
```

### 3. Run Tests
```bash
# Run the Get Started page test (recommended first test)
python run_tests.py --feature get_started.feature

# Run smoke tests
python run_tests.py --smoke

# Run all tests
python run_tests.py --regression
```

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js & npm**
- **Android SDK** with ADB in PATH
- **Appium 2.x**
- **Android device** with USB debugging enabled
- **Expo Go** app installed on device

## 🔧 Configuration

The test framework automatically configures itself using `setup_test_environment.py`. Key configuration files:

- `config/config.yaml` - Test configuration
- `behave.ini` - Behave framework settings
- `requirements.txt` - Python dependencies

### Important Configuration Notes

1. **IP Address**: The setup script automatically detects your local IP and updates the config
2. **Expo Go**: Tests connect to Expo Go app, not a standalone APK
3. **App State**: Tests keep the app running between scenarios for faster execution
4. **URL Navigation**: Tests use Expo Go's URL scheme for direct screen access

## 🧪 Test Structure

### Features
- `get_started.feature` - Get Started page tests (start here!)
- `onboarding.feature` - Onboarding flow tests
- `authentication.feature` - Signup and authentication tests
- `ride_booking.feature` - Ride booking functionality
- `driver_features.feature` - Driver-specific features

### Page Objects
- `pages/onboarding_page.py` - Get Started page interactions
- `pages/authentication_page.py` - Signup and auth page interactions
- `pages/base_page.py` - Common page functionality

### Utilities
- `utils/url_navigator.py` - URL-based navigation for Expo Go
- `utils/driver_factory.py` - Appium driver management
- `utils/screenshot_helper.py` - Screenshot capture on failures

## 🎯 Test Execution

### Basic Commands
```bash
# Check prerequisites
python run_tests.py --check

# Install dependencies
python run_tests.py --install

# Run specific feature
python run_tests.py --feature get_started.feature

# Run with tags
python run_tests.py --tags @smoke

# Generate Allure report
python run_tests.py --feature get_started.feature --report
```

### Test Suites
```bash
# Smoke tests (quick validation)
python run_tests.py --smoke

# Authentication tests only
python run_tests.py --auth

# Ride booking tests only
python run_tests.py --ride

# All tests (regression)
python run_tests.py --regression
```

## 📱 App Flow Analysis

### Navigation Flow
1. **Onboarding Screen** (`/onboarding`) - Get Started page
2. **Signup Screen** (`/auth/signup`) - Choose email or phone
3. **Authentication Flow**:
   - Email: `/auth/EmailPage` → `/auth/EmailOTP` → `/auth/profile-setup`
   - Phone: `/auth/PhoneNumberPage` → `/auth/PhoneOTP` → `/auth/profile-setup`
4. **Profile Setup**: `/auth/DailySchedule` → `/auth/PreferredpickupLocation` → `/auth/AddLocationScreen`
5. **Main App** (`/(tabs)`) - Home, Search, Requests, Messages, Profile

### Key Screens Tested
- ✅ Get Started page with app title and welcome message
- ✅ Navigation to signup screen
- ✅ Accessibility features
- ✅ URL-based navigation

## 🔍 Troubleshooting

### Common Issues

1. **"Expo Go not found"**
   - Install Expo Go from Google Play Store
   - Make sure your app is loaded in Expo Go

2. **"Cannot connect to device"**
   - Enable USB debugging on your Android device
   - Run `adb devices` to verify connection

3. **"Appium server not responding"**
   - Start Appium: `appium --port 4723`
   - Check if port 4723 is available

4. **"IP address issues"**
   - Run `python setup_test_environment.py` to auto-detect IP
   - Update `config/config.yaml` manually if needed

5. **"App not loading in Expo Go"**
   - Start Expo server: `npm start`
   - Scan QR code with Expo Go app

### Debug Mode
```bash
# Run with verbose output
python run_tests.py --feature get_started.feature --format plain

# Check Appium connection
python test_appium_connection.py

# Inspect app elements
python inspect_app.py
```

## 📊 Reporting

### Allure Reports
```bash
# Generate and serve report
python run_tests.py --feature get_started.feature --report

# Generate report only
allure generate allure-results -o allure-report --clean

# Serve existing report
allure serve allure-results
```

### Screenshots
- Screenshots are automatically captured on test failures
- Stored in `screenshots/` directory
- Attached to Allure reports

## 🚀 Advanced Features

### URL Navigation
Tests use Expo Go's URL scheme for direct screen access:
```python
# Navigate directly to Get Started page
context.url_navigator.navigate_to_onboarding()

# Navigate to signup screen
context.url_navigator.navigate_to_signup()
```

### App State Management
- App stays running between test scenarios
- Faster execution and better state preservation
- Only quits driver after all tests complete

### Progressive Testing
Start with simple tests and build up:
1. **Get Started page** (basic UI elements)
2. **Navigation flows** (screen transitions)
3. **Authentication** (user registration)
4. **Core features** (ride booking, messaging)

## 📝 Test Development

### Adding New Tests
1. Create feature file in `features/`
2. Add step definitions in `features/steps/`
3. Create page objects in `pages/`
4. Update configuration if needed

### Best Practices
- Use descriptive scenario names
- Add appropriate tags (@smoke, @regression, etc.)
- Include accessibility tests
- Add screenshots for failures
- Keep tests independent

## 🤝 Contributing

1. Follow the existing test structure
2. Add appropriate tags to scenarios
3. Update documentation
4. Test your changes thoroughly

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the logs in `screenshots/`
3. Run the setup script to verify environment
4. Check Appium and Expo Go documentation

---

**Last Updated**: [CURRENT_DATE]  
**Test Framework Version**: 2.0  
**Compatible with**: Commute.io v1.0.0
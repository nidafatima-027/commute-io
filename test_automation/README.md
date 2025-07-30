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

### 3. Run Tests (Progressive Approach)

#### Step 1: Test Get Started Page
```bash
# Test the Get Started page (recommended first test)
python run_get_started_test.py
```

#### Step 2: Test Signup Flow
```bash
# Test navigation to signup screen and email/phone options
python run_signup_test.py
```

#### Step 3: Run All Tests
```bash
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
- `signup_flow.feature` - Signup screen and email/phone options
- `onboarding.feature` - Onboarding flow tests
- `authentication.feature` - Signup and authentication tests
- `ride_booking.feature` - Ride booking functionality
- `driver_features.feature` - Driver-specific features

### Page Objects
- `pages/onboarding_page.py` - Get Started page interactions
- `pages/authentication_page.py` - Signup, email, phone, and OTP page interactions
- `pages/base_page.py` - Common page functionality

### Utilities
- `utils/url_navigator.py` - URL-based navigation for Expo Go
- `utils/driver_factory.py` - Appium driver management
- `utils/screenshot_helper.py` - Screenshot capture on failures

## 🎯 Test Execution

### Progressive Testing (Recommended)

1. **Get Started Page** - Basic UI elements
   ```bash
   python run_get_started_test.py
   ```

2. **Signup Flow** - Navigation and options
   ```bash
   python run_signup_test.py
   ```

3. **Email Authentication** - Email input and OTP
   ```bash
   python run_tests.py --feature email_auth.feature
   ```

4. **Phone Authentication** - Phone input and OTP
   ```bash
   python run_tests.py --feature phone_auth.feature
   ```

5. **Profile Setup** - User profile creation
   ```bash
   python run_tests.py --feature profile_setup.feature
   ```

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
- ✅ **Get Started page** - App title, welcome message, Get Started button
- ✅ **Signup screen** - Continue with email/phone options
- ✅ **Email input screen** - Email address input
- ✅ **Phone input screen** - Phone number input
- ✅ **Navigation flows** - Screen transitions
- ✅ **Accessibility features** - Screen reader support

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

6. **"Navigation test failed"**
   - Check screenshots in `screenshots/` directory
   - Verify app is on correct screen
   - Check element locators in page objects

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
2. **Signup flow** (navigation and options)
3. **Authentication** (email/phone input)
4. **OTP verification** (code entry)
5. **Profile setup** (user information)
6. **Core features** (ride booking, messaging)

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

## 🎯 Next Steps After Current Tests

### Immediate Actions
1. **Test Get Started page** - `python run_get_started_test.py`
2. **Test Signup flow** - `python run_signup_test.py`
3. **Create email authentication test** - Email input and OTP flow
4. **Create phone authentication test** - Phone input and OTP flow
5. **Create profile setup test** - User profile creation

### Future Enhancements
1. **OTP Verification Tests** - Complete OTP entry and verification
2. **Profile Setup Tests** - Complete user profile creation
3. **Main App Tests** - Home screen and core functionality
4. **Ride Booking Tests** - Complete ride booking flow
5. **Messaging Tests** - In-app messaging functionality

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
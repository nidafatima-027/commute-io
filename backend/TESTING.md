# Commute.io Automation Testing Guide

This document provides comprehensive guidance for running automated tests for the Commute.io carpooling application.

## 🏗️ Test Architecture

The testing suite is organized into the following categories:

- **API Tests**: Test the FastAPI backend endpoints
- **Mobile Automation Tests**: Test the React Native mobile app using Appium
- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test component interactions

## 📋 Prerequisites

### Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Mobile Testing Prerequisites

#### 1. Appium Installation
```bash
# Install Node.js first (if not already installed)
# Then install Appium
npm install -g appium

# Install Appium Doctor to check setup
npm install -g appium-doctor

# Check your setup
appium-doctor
```

#### 2. Android Setup
```bash
# Install Android Studio and Android SDK
# Set ANDROID_HOME environment variable
export ANDROID_HOME=/path/to/android/sdk

# Add platform-tools to PATH
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Create and start an Android emulator
# Or connect a physical Android device
```

#### 3. iOS Setup (Optional)
```bash
# Install Xcode (macOS only)
# Install iOS Simulator
# Set up iOS automation capabilities
```

#### 4. APK File
Place your APK file in one of these locations:
- `./app.apk`
- `../app.apk`
- `../../app.apk`

Or set the `APK_PATH` environment variable:
```bash
export APK_PATH=/path/to/your/app.apk
```

## 🚀 Running Tests

### Quick Start
```bash
cd backend
python run_tests.py --all
```

### Test Runner Options

#### Run All Tests
```bash
python run_tests.py --all
```

#### Run Specific Test Types
```bash
# API tests only
python run_tests.py --api

# Mobile automation tests only
python run_tests.py --mobile

# Unit tests only
python run_tests.py --unit

# Integration tests only
python run_tests.py --integration
```

#### Additional Options
```bash
# Run with verbose output
python run_tests.py --all --verbose

# Run with coverage report
python run_tests.py --all --coverage

# Run tests in parallel
python run_tests.py --all --parallel

# Show available test markers
python run_tests.py --markers
```

### Direct Pytest Commands

#### API Tests
```bash
pytest tests/api/ -m api -v
```

#### Mobile Tests
```bash
pytest tests/mobile/ -m mobile -v
```

#### All Tests with Coverage
```bash
pytest tests/ --cov=app --cov-report=html --cov-report=term-missing
```

## 📱 Mobile Automation Tests

### Test Workflows

The mobile automation tests cover the following user workflows:

1. **Complete User Onboarding Flow**
   - App launch and welcome screen
   - Phone number authentication
   - OTP verification
   - Profile setup

2. **Ride Creation Flow**
   - Navigate to offer ride screen
   - Fill ride details (start/end location, time, seats, fare)
   - Create and post ride

3. **Ride Search and Request Flow**
   - Search for available rides
   - View ride details
   - Request to join ride
   - Add request message

4. **Messaging Flow**
   - Navigate to messages
   - Select conversation
   - Send and receive messages

5. **Profile Management Flow**
   - View profile
   - Edit profile information
   - Update preferences

6. **Complete User Journey**
   - End-to-end workflow combining all above flows

### Mobile Test Configuration

The mobile tests use Appium with the following configuration:

```python
# Android Configuration
ANDROID_CONFIG = {
    "platform_name": "Android",
    "automation_name": "UiAutomator2",
    "device_name": "Android Emulator",
    "app": "path/to/app.apk",
    "no_reset": True,
    "auto_grant_permissions": True
}
```

### Running Mobile Tests

#### Prerequisites Check
```bash
# Check if Appium server is running
appium

# In another terminal, check mobile environment
python run_tests.py --mobile
```

#### Run Specific Mobile Tests
```bash
# Run all mobile tests
pytest tests/mobile/ -m mobile

# Run specific mobile test
pytest tests/mobile/test_mobile_workflow.py::TestMobileWorkflow::test_complete_user_onboarding_flow

# Run slow tests only
pytest tests/mobile/ -m "mobile and slow"
```

## 🔌 API Tests

### Test Coverage

The API tests cover all major endpoints:

#### Authentication
- `POST /api/auth/send-mobile-otp`
- `POST /api/auth/verify-mobile-otp`
- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`
- `GET /api/auth/me`
- `POST /api/auth/logout`

#### Rides
- `GET /api/rides/` (search)
- `POST /api/rides/` (create)
- `GET /api/rides/{id}` (details)
- `PUT /api/rides/{id}` (update)
- `DELETE /api/rides/{id}` (delete)
- `POST /api/rides/{id}/request` (request ride)
- `GET /api/rides/{id}/requests` (get requests)
- `PUT /api/rides/requests/{id}` (update request)

#### Users
- `GET /api/users/profile`
- `PUT /api/users/profile`
- `GET /api/users/{id}`
- `GET /api/users/preferences`
- `PUT /api/users/preferences`
- `GET /api/users/schedule`
- `POST /api/users/schedule`

#### Messages
- `POST /api/messages/` (send)
- `GET /api/messages/conversations`
- `GET /api/messages/conversations/{user_id}`
- `GET /api/messages/ride/{ride_id}`
- `PUT /api/messages/{id}/read`
- `DELETE /api/messages/{id}`

### Running API Tests

```bash
# Run all API tests
pytest tests/api/ -m api

# Run specific API test file
pytest tests/api/test_auth_api.py

# Run specific test method
pytest tests/api/test_auth_api.py::TestAuthAPI::test_send_mobile_otp_success

# Run with coverage
pytest tests/api/ -m api --cov=app --cov-report=html
```

## 🧪 Test Data and Fixtures

### Test Data
The tests use predefined test data:

```python
test_user_data = {
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "bio": "Test bio",
    "is_driver": True,
    "is_rider": True
}

test_ride_data = {
    "start_location": "Downtown Office",
    "end_location": "Suburban Home",
    "start_time": "2024-01-15T10:00:00Z",
    "seats_available": 3,
    "total_fare": 25.50
}
```

### Test Fixtures
The tests use pytest fixtures for:
- Database setup and teardown
- Authentication headers
- Test clients
- Mobile drivers

## 📊 Coverage Reports

### Generate Coverage Report
```bash
pytest tests/ --cov=app --cov-report=html --cov-report=term-missing
```

### View Coverage Report
```bash
# Open in browser
open htmlcov/index.html

# Or use the test runner
python run_tests.py --all --coverage
```

## 🔧 Configuration

### Environment Variables
```bash
# APK file path
export APK_PATH=/path/to/your/app.apk

# iOS app path (if testing iOS)
export IPA_PATH=/path/to/your/app.ipa

# Android SDK path
export ANDROID_HOME=/path/to/android/sdk

# Test database URL
export TEST_DATABASE_URL=sqlite:///./test_commute_io.db
```

### Pytest Configuration
The `pytest.ini` file contains:
- Test discovery patterns
- Markers for test categorization
- Coverage settings
- Async test configuration

## 🐛 Troubleshooting

### Common Issues

#### Appium Server Not Running
```bash
# Start Appium server
appium

# Check if server is running
curl http://localhost:4723/status
```

#### APK File Not Found
```bash
# Check if APK exists
ls -la *.apk

# Set APK_PATH environment variable
export APK_PATH=/path/to/your/app.apk
```

#### Android Emulator Not Available
```bash
# List available emulators
emulator -list-avds

# Start an emulator
emulator -avd <emulator_name>
```

#### Test Database Issues
```bash
# Clean test database
rm -f test_commute_io.db

# Run database migrations
alembic upgrade head
```

#### Mobile Test Failures
- Check if the app is properly installed
- Verify element locators match the actual UI
- Ensure the app is in the expected state
- Check device/emulator connectivity

### Debug Mode
```bash
# Run tests with maximum verbosity
pytest tests/ -v -s --tb=long

# Run specific test with debug output
pytest tests/mobile/test_mobile_workflow.py::TestMobileWorkflow::test_complete_user_onboarding_flow -v -s
```

## 📈 Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.9
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Run API tests
        run: |
          cd backend
          python run_tests.py --api --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v1
```

## 🤝 Contributing

### Adding New Tests

1. **API Tests**: Add to `tests/api/` directory
2. **Mobile Tests**: Add to `tests/mobile/` directory
3. **Unit Tests**: Add to `tests/unit/` directory
4. **Integration Tests**: Add to `tests/integration/` directory

### Test Naming Convention
- Test files: `test_*.py`
- Test classes: `Test*`
- Test methods: `test_*`

### Test Markers
Use appropriate markers for test categorization:
- `@pytest.mark.api` - API tests
- `@pytest.mark.mobile` - Mobile tests
- `@pytest.mark.unit` - Unit tests
- `@pytest.mark.integration` - Integration tests
- `@pytest.mark.slow` - Slow running tests

### Best Practices
1. Write descriptive test names
2. Use fixtures for common setup
3. Clean up after tests
4. Handle edge cases
5. Add proper assertions
6. Document complex test scenarios

## 📞 Support

For issues with the testing suite:
1. Check the troubleshooting section
2. Review test logs and error messages
3. Verify prerequisites are met
4. Open an issue with detailed error information
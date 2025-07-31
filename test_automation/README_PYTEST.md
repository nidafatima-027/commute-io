# Commute.io Pytest Test Automation

A comprehensive test automation framework for the Commute.io mobile app using **Pytest**, **Appium**, and **Python**.

## 🎯 **Why Pytest?**

- ✅ **Simpler syntax** - Less verbose than Gherkin/Behave
- ✅ **Better debugging** - Excellent error reporting and tracebacks
- ✅ **Fixtures** - Perfect for setup/teardown and shared resources
- ✅ **Parametrized tests** - Easy to test multiple scenarios
- ✅ **Better IDE support** - Great autocomplete and navigation
- ✅ **Rich ecosystem** - Tons of plugins and utilities
- ✅ **Parallel execution** - Run tests in parallel for faster execution

## 🚀 **Quick Start**

### 1. Setup Environment
```bash
# Navigate to test automation directory
cd test_automation

# Install pytest dependencies
pip install -r requirements_pytest.txt

# Run the setup script
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

#### Basic Test Execution
```bash
# Run smoke tests (default)
python run_pytest_tests.py

# Run all tests
python run_pytest_tests.py --all

# Run specific test types
python run_pytest_tests.py --smoke
python run_pytest_tests.py --email-flow
python run_pytest_tests.py --integration
```

#### Advanced Test Execution
```bash
# Run complete email authentication flow
python run_pytest_tests.py --complete-flow

# Run parametrized tests
python run_pytest_tests.py --parametrized

# Run error handling tests
python run_pytest_tests.py --error-handling

# Run specific test file
python run_pytest_tests.py --test pytest_tests/test_onboarding.py

# Run specific test function
python run_pytest_tests.py --test pytest_tests/test_email_flow.py::TestCompleteEmailFlow::test_complete_email_authentication_flow
```

#### Direct Pytest Commands
```bash
# Run with pytest directly
pytest pytest_tests/ -v

# Run with specific markers
pytest pytest_tests/ -m smoke -v
pytest pytest_tests/ -m email_flow -v
pytest pytest_tests/ -m integration -v

# Run with HTML reporting
pytest pytest_tests/ --html=reports/report.html --self-contained-html

# Run with parallel execution
pytest pytest_tests/ -n auto
```

## 📋 **Test Structure**

### Test Files
```
pytest_tests/
├── conftest.py                    # Shared fixtures and configuration
├── test_onboarding.py            # Onboarding screen tests
├── test_signup.py                # Signup screen tests
├── test_email_flow.py            # Complete email authentication flow
└── test_phone_flow.py            # Phone authentication flow (future)
```

### Test Classes
- **`TestOnboarding`** - Onboarding screen functionality
- **`TestOnboardingNavigation`** - Navigation from onboarding
- **`TestSignupScreen`** - Signup screen functionality
- **`TestSignupNavigation`** - Navigation from signup
- **`TestEmailInput`** - Email input screen functionality
- **`TestEmailNavigation`** - Email input navigation
- **`TestOTPVerification`** - OTP verification functionality
- **`TestOTPNavigation`** - OTP verification navigation
- **`TestProfileSetup`** - Profile setup functionality
- **`TestCompleteEmailFlow`** - Complete email authentication flow

### Test Markers
- **`@pytest.mark.smoke`** - Basic functionality tests
- **`@pytest.mark.email_flow`** - Email authentication flow tests
- **`@pytest.mark.integration`** - Integration tests
- **`@pytest.mark.error_handling`** - Error handling tests
- **`@pytest.mark.accessibility`** - Accessibility tests
- **`@pytest.mark.slow`** - Slow running tests

## 🔧 **Fixtures**

### Session-Level Fixtures
- **`appium_driver`** - Appium driver for entire test session
- **`driver`** - Function-scoped driver with app state reset

### Page Object Fixtures
- **`onboarding_page`** - Onboarding page object
- **`signup_page`** - Signup page object
- **`email_page`** - Email page object
- **`otp_page`** - OTP verification page object
- **`profile_page`** - Profile setup page object

### Navigation Fixtures
- **`navigate_to_signup`** - Navigate from onboarding to signup
- **`navigate_to_email_input`** - Navigate from signup to email input
- **`navigate_to_otp_verification`** - Navigate from email to OTP
- **`navigate_to_profile_setup`** - Navigate from OTP to profile setup

## 🎯 **Test Scenarios**

### 1. Onboarding Tests
- ✅ Onboarding screen display
- ✅ App title visibility
- ✅ Welcome message visibility
- ✅ Get Started button functionality
- ✅ Navigation to signup screen

### 2. Signup Tests
- ✅ Signup screen display
- ✅ Continue with email button
- ✅ Continue with phone button
- ✅ Navigation to email/phone input

### 3. Email Authentication Flow
- ✅ Email input screen display
- ✅ Valid email validation
- ✅ Invalid email validation
- ✅ Navigation to OTP verification
- ✅ OTP input and verification
- ✅ Navigation to profile setup
- ✅ Profile data entry
- ✅ Complete flow to dashboard

### 4. Error Handling
- ✅ Invalid email formats
- ✅ Invalid OTP codes
- ✅ Missing required fields
- ✅ Network error scenarios

### 5. Accessibility
- ✅ Screen reader support
- ✅ Accessibility labels
- ✅ Keyboard navigation

## 📊 **Reporting**

### HTML Reports
Tests generate comprehensive HTML reports in the `reports/` directory:
- **`smoke_test_report.html`** - Smoke test results
- **`email_flow_report.html`** - Email flow test results
- **`integration_test_report.html`** - Integration test results
- **`complete_flow_report.html`** - Complete flow test results
- **`full_test_report.html`** - All test results

### Console Output
- ✅ Detailed test progress
- ✅ Pass/fail status
- ✅ Error messages and tracebacks
- ✅ Test duration information

## 🔍 **Debugging**

### Verbose Output
```bash
# Run with verbose output
pytest pytest_tests/ -v -s

# Run with maximum verbosity
pytest pytest_tests/ -vvv -s
```

### Specific Test Debugging
```bash
# Run single test with debug output
pytest pytest_tests/test_email_flow.py::TestCompleteEmailFlow::test_complete_email_authentication_flow -v -s

# Run with print statements
pytest pytest_tests/ -s
```

### Screenshots
Failed tests automatically capture screenshots in the `screenshots/` directory.

## ⚙️ **Configuration**

### pytest.ini
```ini
[tool:pytest]
testpaths = pytest_tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = -v --tb=short --strict-markers --disable-warnings --color=yes
```

### conftest.py
- Shared fixtures configuration
- Custom markers registration
- Driver setup and teardown

## 🚀 **Advanced Features**

### Parametrized Tests
```python
@pytest.mark.parametrize("valid_email", [
    "test@example.com",
    "user@domain.org",
    "john.doe@company.co.uk"
])
def test_valid_email_input(self, navigate_to_email_input, valid_email):
    # Test with different email addresses
```

### Parallel Execution
```bash
# Install pytest-xdist
pip install pytest-xdist

# Run tests in parallel
pytest pytest_tests/ -n auto
```

### Test Retry
```bash
# Install pytest-rerunfailures
pip install pytest-rerunfailures

# Retry failed tests
pytest pytest_tests/ --reruns 3
```

### Coverage Reporting
```bash
# Install pytest-cov
pip install pytest-cov

# Run with coverage
pytest pytest_tests/ --cov=pytest_tests --cov-report=html
```

## 🔧 **Troubleshooting**

### Common Issues

1. **Pytest not found**
   ```bash
   pip install -r requirements_pytest.txt
   ```

2. **Appium server not running**
   ```bash
   appium --port 4723
   ```

3. **Device not connected**
   ```bash
   adb devices
   ```

4. **Expo server not running**
   ```bash
   npm start
   ```

5. **Configuration missing**
   ```bash
   python setup_test_environment.py
   ```

### Debug Commands
```bash
# Check pytest installation
python -m pytest --version

# List available markers
python run_pytest_tests.py --markers

# Run with debug output
pytest pytest_tests/ -v -s --tb=long

# Check test discovery
pytest pytest_tests/ --collect-only
```

## 📈 **Performance**

### Test Execution Times
- **Smoke tests**: ~30-60 seconds
- **Email flow tests**: ~2-3 minutes
- **Complete flow test**: ~3-5 minutes
- **All tests**: ~10-15 minutes

### Optimization Tips
1. Use `--tb=short` for faster output
2. Run specific test types instead of all tests
3. Use parallel execution with `-n auto`
4. Disable screenshots for faster execution
5. Use session-scoped fixtures where possible

## 🎉 **Benefits of Pytest**

1. **Better Error Messages** - Clear, detailed error reporting
2. **Fixtures** - Reusable setup and teardown
3. **Parametrization** - Test multiple scenarios easily
4. **Markers** - Organize and filter tests
5. **Plugins** - Rich ecosystem of extensions
6. **IDE Support** - Excellent integration with VS Code, PyCharm
7. **Parallel Execution** - Faster test runs
8. **HTML Reports** - Beautiful, detailed reports

## 📚 **Next Steps**

1. **Run the complete flow test**:
   ```bash
   python run_pytest_tests.py --complete-flow
   ```

2. **Explore test markers**:
   ```bash
   python run_pytest_tests.py --markers
   ```

3. **Run specific test types**:
   ```bash
   python run_pytest_tests.py --smoke
   python run_pytest_tests.py --email-flow
   ```

4. **Generate HTML reports**:
   ```bash
   pytest pytest_tests/ --html=reports/my_report.html --self-contained-html
   ```

5. **Add new test scenarios**:
   - Create new test files in `pytest_tests/`
   - Use existing fixtures and page objects
   - Add appropriate markers

---

**🎯 Ready to test your app with Pytest!** 🚀
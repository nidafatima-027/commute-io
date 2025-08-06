#!/usr/bin/env python3
"""
Basic test script to verify framework components without device.
"""
import sys
import os
from pathlib import Path

# Add current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

def test_imports():
    """Test that all framework modules can be imported."""
    print("Testing framework imports...")
    
    try:
        from utils.driver_factory import DriverFactory
        print("✓ DriverFactory imported successfully")
        
        from utils.screenshot_helper import ScreenshotHelper  
        print("✓ ScreenshotHelper imported successfully")
        
        from pages.base_page import BasePage
        print("✓ BasePage imported successfully")
        
        from pages.onboarding_page import OnboardingPage
        print("✓ OnboardingPage imported successfully")
        
        from pages.authentication_page import SignupPage, OTPVerificationPage, ProfileSetupPage
        print("✓ Authentication pages imported successfully")
        
        return True
    except ImportError as e:
        print(f"✗ Import error: {str(e)}")
        return False

def test_config_loading():
    """Test configuration loading."""
    print("\nTesting configuration loading...")
    
    try:
        from utils.driver_factory import DriverFactory
        config = DriverFactory.load_config()
        
        # Check required config sections
        required_sections = ['android', 'appium', 'test_data', 'timeouts']
        for section in required_sections:
            if section in config:
                print(f"✓ Config section '{section}' found")
            else:
                print(f"✗ Config section '{section}' missing")
                return False
        
        # Check specific config values
        app_package = config.get('android', {}).get('app_package')
        valid_packages = ['com.anonymous.boltexponativewind', 'host.exp.exponent']
        if app_package in valid_packages:
            print(f"✓ App package configured correctly: {app_package}")
        else:
            print(f"✗ App package incorrect: {app_package}")
            print(f"  Expected one of: {valid_packages}")
            return False
            
        return True
    except Exception as e:
        print(f"✗ Config loading error: {str(e)}")
        return False

def test_behave_availability():
    """Test if behave is available."""
    print("\nTesting Behave availability...")
    
    try:
        import behave
        print(f"✓ Behave version {behave.__version__} is available")
        return True
    except ImportError:
        print("✗ Behave not available")
        return False

def test_step_definitions():
    """Test that step definition files exist and are valid."""
    print("\nTesting step definition files...")
    
    step_files = [
        'features/steps/onboarding_steps.py',
        'features/steps/authentication_steps.py', 
        'features/steps/common_steps.py'
    ]
    
    for step_file in step_files:
        if os.path.exists(step_file):
            print(f"✓ Step file {step_file} exists")
            try:
                # Try to import the module
                module_name = step_file.replace('/', '.').replace('.py', '')
                __import__(module_name)
                print(f"✓ Step file {step_file} is valid")
            except Exception as e:
                print(f"✗ Step file {step_file} has errors: {str(e)}")
                return False
        else:
            print(f"✗ Step file {step_file} missing")
            return False
    
    return True

def test_feature_files():
    """Test that feature files exist and are readable."""
    print("\nTesting feature files...")
    
    feature_files = [
        'features/onboarding.feature',
        'features/authentication.feature',
        'features/ride_booking.feature',
        'features/driver_features.feature'
    ]
    
    for feature_file in feature_files:
        if os.path.exists(feature_file):
            print(f"✓ Feature file {feature_file} exists")
            try:
                with open(feature_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if 'Feature:' in content and 'Scenario:' in content:
                        print(f"✓ Feature file {feature_file} has valid structure")
                    else:
                        print(f"✗ Feature file {feature_file} missing Feature/Scenario")
                        return False
            except Exception as e:
                print(f"✗ Error reading {feature_file}: {str(e)}")
                return False
        else:
            print(f"✗ Feature file {feature_file} missing")
            return False
    
    return True

def test_environment_file():
    """Test environment.py file."""
    print("\nTesting environment configuration...")
    
    env_file = 'features/environment.py'
    if os.path.exists(env_file):
        print(f"✓ Environment file {env_file} exists")
        try:
            # Check for required functions
            with open(env_file, 'r') as f:
                content = f.read()
                required_functions = ['before_all', 'before_scenario', 'after_scenario', 'after_step']
                for func in required_functions:
                    if f"def {func}" in content:
                        print(f"✓ Function {func} found in environment")
                    else:
                        print(f"✗ Function {func} missing in environment")
                        return False
            return True
        except Exception as e:
            print(f"✗ Error reading environment file: {str(e)}")
            return False
    else:
        print(f"✗ Environment file {env_file} missing")
        return False

def main():
    """Run all tests."""
    print("🧪 Testing Appium + Behave Framework Components")
    print("=" * 50)
    
    tests = [
        test_imports,
        test_config_loading,
        test_behave_availability,
        test_step_definitions,
        test_feature_files,
        test_environment_file
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
            else:
                print(f"Test {test.__name__} failed!")
        except Exception as e:
            print(f"Test {test.__name__} crashed: {str(e)}")
    
    print("\n" + "=" * 50)
    print(f"Framework Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All framework components are working correctly!")
        print("\nNext steps:")
        print("1. Connect your Android device via USB")
        print("2. Start Appium server: appium --port 4723")
        print("3. Run: python run_tests.py --check")
        print("4. Run tests: python run_tests.py --smoke")
        return True
    else:
        print("❌ Some framework components need attention.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
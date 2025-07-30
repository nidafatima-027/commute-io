"""
Behave environment configuration for test setup and teardown.
"""
import os
import sys
from behave import fixture
from utils.driver_factory import DriverFactory
from utils.screenshot_helper import ScreenshotHelper

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def before_all(context):
    """
    Executed once before all tests.
    Initialize global test configuration.
    """
    print("Starting Appium test automation...")
    
    # Create screenshots directory
    ScreenshotHelper.create_screenshot_directory()
    
    # Clean up old screenshots
    ScreenshotHelper.cleanup_old_screenshots(days_to_keep=7)
    
    # Initialize context variables
    context.config = DriverFactory.load_config()
    context.screenshots_enabled = context.config.get('screenshots', {}).get('on_failure', True)


def before_scenario(context, scenario):
    """
    Executed before each scenario.
    Initialize WebDriver for each test scenario.
    """
    print(f"\nStarting scenario: {scenario.name}")
    
    try:
        # Initialize driver for each scenario
        context.driver = DriverFactory.create_driver()
        print("Appium driver initialized successfully")
        
        # Store scenario info for potential failure screenshots
        context.current_scenario = scenario.name
        context.current_step = "Scenario Setup"
        
    except Exception as e:
        print(f"Failed to initialize driver: {str(e)}")
        print("Please ensure:")
        print("1. Appium server is running on localhost:4723")
        print("2. Android device is connected and USB debugging is enabled")
        print("3. The app package 'com.anonymous.boltexponativewind' is installed")
        raise


def after_step(context, step):
    """
    Executed after each step.
    Capture screenshot on step failure.
    """
    context.current_step = step.name
    
    if step.status == "failed" and context.screenshots_enabled:
        print(f"Step failed: {step.name}")
        try:
            screenshot_path = ScreenshotHelper.capture_failure_screenshot(
                context.current_scenario, 
                step.name
            )
            if screenshot_path:
                # Attach screenshot to Allure report if available
                try:
                    import allure
                    allure.attach.file(
                        screenshot_path,
                        name=f"Failure Screenshot - {step.name}",
                        attachment_type=allure.attachment_type.PNG
                    )
                except ImportError:
                    pass  # Allure not available
        except Exception as e:
            print(f"Failed to capture failure screenshot: {str(e)}")


def after_scenario(context, scenario):
    """
    Executed after each scenario.
    Clean up WebDriver and capture final screenshot if scenario failed.
    """
    if scenario.status == "failed":
        print(f"Scenario failed: {scenario.name}")
        
        # Capture final scenario failure screenshot
        if context.screenshots_enabled:
            try:
                ScreenshotHelper.capture_failure_screenshot(
                    scenario.name, 
                    "Scenario End"
                )
            except Exception as e:
                print(f"Failed to capture final screenshot: {str(e)}")
    
    # Quit driver after each scenario
    try:
        DriverFactory.quit_driver()
        print("Driver quit successfully")
    except Exception as e:
        print(f"Error quitting driver: {str(e)}")


def after_all(context):
    """
    Executed once after all tests.
    Final cleanup.
    """
    print("\nTest automation completed")
    
    # Ensure driver is quit
    try:
        DriverFactory.quit_driver()
    except Exception:
        pass  # Driver might already be quit


# Fixture for handling app permissions
@fixture
def grant_permissions(context):
    """Fixture to grant necessary app permissions."""
    try:
        driver = DriverFactory.get_driver()
        # Grant location permissions if requested
        driver.execute_script("mobile: changePermissions", {
            "permissions": "all",
            "appPackage": context.config['android']['app_package']
        })
    except Exception as e:
        print(f"Could not grant permissions: {str(e)}")


# Fixture for app state management
@fixture
def reset_app(context):
    """Fixture to reset app to initial state."""
    try:
        driver = DriverFactory.get_driver()
        driver.reset()
    except Exception as e:
        print(f"Could not reset app: {str(e)}")


# Fixture for device orientation
@fixture
def set_portrait_orientation(context):
    """Fixture to ensure device is in portrait mode."""
    try:
        driver = DriverFactory.get_driver()
        driver.orientation = "PORTRAIT"
    except Exception as e:
        print(f"Could not set orientation: {str(e)}")
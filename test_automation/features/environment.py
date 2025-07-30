"""
Behave environment configuration for test setup and teardown.
"""
import os
import sys
from behave import fixture
from utils.driver_factory import DriverFactory
from utils.screenshot_helper import ScreenshotHelper
# URL navigation removed as requested

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
    
    # URL navigation removed as requested


def before_scenario(context, scenario):
    """
    Executed before each scenario.
    Initialize WebDriver for each test scenario.
    """
    print(f"\nStarting scenario: {scenario.name}")
    
    try:
        # Initialize driver for each scenario (but don't quit after)
        context.driver = DriverFactory.create_driver()
        print("Appium driver initialized successfully")
        
        # Store scenario info for potential failure screenshots
        context.current_scenario = scenario.name
        context.current_step = "Scenario Setup"
        
        # App will be launched normally without URL navigation
        
    except Exception as e:
        print(f"Failed to initialize driver: {str(e)}")
        print("Please ensure:")
        print("1. Appium server is running on localhost:4723")
        print("2. Android device is connected and USB debugging is enabled")
        print("3. Expo Go is installed and your app is loaded")
        print("4. Update the base_url in config.yaml with your local IP address")
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
    Capture final screenshot if scenario failed, but keep app running.
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
    
    # DON'T quit driver - keep app running for next scenario
    print("Keeping app running for next scenario...")


def after_all(context):
    """
    Executed once after all tests.
    Final cleanup - only quit driver at the very end.
    """
    print("\nTest automation completed")
    
    # Only quit driver at the very end
    try:
        DriverFactory.quit_driver()
        print("Driver quit successfully")
    except Exception as e:
        print(f"Error quitting driver: {str(e)}")


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
        # Instead of resetting, navigate back to onboarding
        context.url_navigator.navigate_to_onboarding()
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


# Fixture for URL navigation
@fixture
def navigate_to_screen(context, screen_name):
    """Fixture to navigate to a specific screen."""
    try:
        return context.url_navigator.navigate_to_screen(screen_name)
    except Exception as e:
        print(f"Could not navigate to {screen_name}: {str(e)}")
        return False
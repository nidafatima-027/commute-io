"""
Driver factory for Appium WebDriver initialization and management.
"""
import os
import yaml
from appium import webdriver
from appium.options.android import UiAutomator2Options
from appium.webdriver.common.appiumby import AppiumBy
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException


class DriverFactory:
    """Factory class for creating and managing Appium WebDriver instances."""
    
    _driver = None
    
    @classmethod
    def create_driver(cls, device_udid=None):
        """Create and configure Appium WebDriver instance"""
        config = load_config()
        appium_config = config['appium']
        android_config = config['android']
        
        try:
            print("🚀 Creating Appium driver...")
            
            # Configure UiAutomator2 options
            options = UiAutomator2Options()
            options.platform_name = android_config['platform_name']
            options.automation_name = android_config['automation_name']
            
            # Set app package and activity for Expo Go
            if 'app_package' in android_config:
                options.app_package = android_config['app_package']
            if 'app_activity' in android_config:
                options.app_activity = android_config['app_activity']
                
            options.device_name = android_config['device_name']
            options.no_reset = android_config['no_reset']
            options.full_reset = android_config['full_reset']
            options.new_command_timeout = android_config['new_command_timeout']
            
            # Add device UDID if provided
            if device_udid:
                options.udid = device_udid
            
            # Additional capabilities for better performance
            options.set_capability("autoGrantPermissions", True)
            options.set_capability("automationName", "UiAutomator2")
            options.set_capability("uiautomator2ServerLaunchTimeout", 60000)
            options.set_capability("adbExecTimeout", 60000)
            
            options.set_capability("dontStopAppOnReset", android_config.get('dont_stop_app_on_reset', True))
            options.set_capability("skipDeviceInitialization", android_config.get('skip_device_initialization', True))
            options.set_capability("skipServerInstallation", android_config.get('skip_server_installation', True))
            options.set_capability("skipUnlock", android_config.get('skip_unlock', True))
            options.set_capability("skipLogCapture", android_config.get('skip_log_capture', True))
            
            # Create driver
            cls._driver = webdriver.Remote(
                command_executor=appium_config['server_url'],
                options=options
            )
            
            # Set implicit wait
            cls._driver.implicitly_wait(appium_config['implicit_wait'])
            
            print("✅ Appium driver created successfully")
            return cls._driver
            
        except Exception as e:
            print(f"❌ Failed to create Appium driver: {str(e)}")
            raise
    
    @classmethod
    def get_driver(cls):
        """Get the current driver instance"""
        if cls._driver is None:
            return cls.create_driver()
        return cls._driver
    
    @classmethod
    def close_driver(cls):
        """Close the current driver instance"""
        if cls._driver:
            try:
                print("🧹 Closing Appium driver...")
                cls._driver.quit()
                cls._driver = None
                print("✅ Appium driver closed successfully")
            except Exception as e:
                print(f"⚠️ Error closing driver: {str(e)}")


def load_config():
    """Load configuration from YAML file"""
    config_path = os.path.join(os.path.dirname(__file__), '..', 'config', 'config.yaml')
    with open(config_path, 'r') as file:
        return yaml.safe_load(file)

def create_driver(device_udid=None):
    """Create and configure Appium WebDriver instance (function version for backward compatibility)"""
    return DriverFactory.create_driver(device_udid)

def close_driver(driver):
    """Close the Appium WebDriver instance (function version for backward compatibility)"""
    if driver:
        try:
            print("🧹 Closing Appium driver...")
            driver.quit()
            print("✅ Appium driver closed successfully")
        except Exception as e:
            print(f"⚠️ Error closing driver: {str(e)}")

def wait_for_element(driver, locator, timeout=30):
    """Wait for an element to be present and visible"""
    try:
        element = WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located(locator)
        )
        return element
    except TimeoutException:
        print(f"⏰ Timeout waiting for element: {locator}")
        return None

def wait_for_element_clickable(driver, locator, timeout=30):
    """Wait for an element to be clickable"""
    try:
        element = WebDriverWait(driver, timeout).until(
            EC.element_to_be_clickable(locator)
        )
        return element
    except TimeoutException:
        print(f"⏰ Timeout waiting for clickable element: {locator}")
        return None
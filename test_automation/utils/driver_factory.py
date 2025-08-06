"""
Driver factory for Appium WebDriver initialization and management.
"""
import os
import yaml
from typing import Optional
from appium import webdriver
from appium.options.android import UiAutomator2Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import WebDriverException


class DriverFactory:
    """Factory class to create and manage Appium WebDriver instances."""
    
    _driver: Optional[webdriver.Remote] = None
    _config: dict = {}
    
    @classmethod
    def load_config(cls) -> dict:
        """Load configuration from YAML file."""
        if not cls._config:
            config_path = os.path.join(os.path.dirname(__file__), '..', 'config', 'config.yaml')
            with open(config_path, 'r') as file:
                cls._config = yaml.safe_load(file)
        return cls._config
    
    @classmethod
    def create_driver(cls, device_udid: Optional[str] = None) -> webdriver.Remote:
        """
        Create and return an Appium WebDriver instance.
        
        Args:
            device_udid: Optional device UDID for specific device targeting
            
        Returns:
            webdriver.Remote: Configured Appium driver
        """
        config = cls.load_config()
        android_config = config['android']
        appium_config = config['appium']
        
        # Create UiAutomator2 options
        options = UiAutomator2Options()
        options.platform_name = android_config['platform_name']
        options.automation_name = android_config['automation_name']
        options.app_package = android_config['app_package']
        # Only set app_activity if it exists in config (for launching)
        if 'app_activity' in android_config:
            options.app_activity = android_config['app_activity']
        options.device_name = android_config['device_name']
        options.no_reset = android_config['no_reset']
        options.full_reset = android_config['full_reset']
        options.new_command_timeout = android_config['new_command_timeout']
        
        # Add device UDID if provided
        if device_udid:
            options.udid = device_udid
        
        # Additional capabilities for better performance and Expo Go compatibility
        options.set_capability("autoGrantPermissions", True)
        options.set_capability("automationName", "UiAutomator2")
        options.set_capability("uiautomator2ServerLaunchTimeout", 60000)
        options.set_capability("adbExecTimeout", 60000)
        
        # Connect to existing app capabilities
        options.set_capability("dontStopAppOnReset", android_config.get('dont_stop_app_on_reset', True))
        options.set_capability("skipDeviceInitialization", android_config.get('skip_device_initialization', True))
        options.set_capability("skipServerInstallation", android_config.get('skip_server_installation', True))
        options.set_capability("autoLaunch", android_config.get('auto_launch', False))
        options.set_capability("skipUnlock", android_config.get('skip_unlock', True))
        options.set_capability("skipLogCapture", android_config.get('skip_log_capture', True))
        
        try:
            cls._driver = webdriver.Remote(
                command_executor=appium_config['server_url'],
                options=options
            )
            
            # Set implicit wait
            cls._driver.implicitly_wait(appium_config['implicit_wait'])
            
            return cls._driver
            
        except WebDriverException as e:
            raise Exception(f"Failed to create Appium driver: {str(e)}")
    
    @classmethod
    def get_driver(cls) -> webdriver.Remote:
        """Get the current driver instance."""
        if cls._driver is None:
            raise Exception("Driver not initialized. Call create_driver() first.")
        return cls._driver
    
    @classmethod
    def quit_driver(cls) -> None:
        """Quit the current driver instance."""
        if cls._driver:
            cls._driver.quit()
            cls._driver = None
    
    @classmethod
    def get_wait(cls, timeout: Optional[int] = None) -> WebDriverWait:
        """
        Get a WebDriverWait instance.
        
        Args:
            timeout: Optional timeout in seconds
            
        Returns:
            WebDriverWait: Configured wait instance
        """
        if not timeout:
            config = cls.load_config()
            timeout = config['appium']['explicit_wait']
        
        return WebDriverWait(cls.get_driver(), timeout)
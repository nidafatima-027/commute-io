import os
import pytest
from appium import webdriver
from appium.options.android import UiAutomator2Options
from appium.options.ios import XCUITestOptions

class MobileTestConfig:
    """Configuration for mobile automation tests."""
    
    # Appium Server Configuration
    APPIUM_SERVER_URL = "http://localhost:4723"
    
    # Android Configuration
    ANDROID_CONFIG = {
        "platform_name": "Android",
        "automation_name": "UiAutomator2",
        "device_name": "Android Emulator",
        "app": None,  # Will be set based on APK path
        "no_reset": True,
        "auto_grant_permissions": True,
        "new_command_timeout": 60,
        "app_wait_activity": "*",
        "app_wait_duration": 10000
    }
    
    # iOS Configuration (for future use)
    IOS_CONFIG = {
        "platform_name": "iOS",
        "automation_name": "XCUITest",
        "device_name": "iPhone Simulator",
        "app": None,  # Will be set based on IPA path
        "no_reset": True,
        "auto_accept_alerts": True
    }
    
    @classmethod
    def get_android_driver(cls, apk_path=None):
        """Get Android Appium driver."""
        options = UiAutomator2Options()
        
        # Set basic options
        for key, value in cls.ANDROID_CONFIG.items():
            if key == "app" and apk_path:
                options.app = apk_path
            elif key == "app" and not apk_path:
                # Try to find APK in common locations
                apk_path = cls.find_apk_file()
                if apk_path:
                    options.app = apk_path
            else:
                setattr(options, key, value)
        
        # Additional Android-specific options
        options.auto_grant_permissions = True
        options.no_reset = True
        options.new_command_timeout = 60
        
        print(f"🤖 Android Configuration:")
        print(f"   App: {options.app}")
        print(f"   Device: {options.device_name}")
        print(f"   Automation: {options.automation_name}")
        
        return webdriver.Remote(cls.APPIUM_SERVER_URL, options=options)
    
    @classmethod
    def get_ios_driver(cls, ipa_path=None):
        """Get iOS Appium driver."""
        options = XCUITestOptions()
        
        # Set basic options
        for key, value in cls.IOS_CONFIG.items():
            if key == "app" and ipa_path:
                options.app = ipa_path
            elif key == "app" and not ipa_path:
                # Try to find IPA in common locations
                ipa_path = cls.find_ipa_file()
                if ipa_path:
                    options.app = ipa_path
            else:
                setattr(options, key, value)
        
        print(f"🍎 iOS Configuration:")
        print(f"   App: {options.app}")
        print(f"   Device: {options.device_name}")
        print(f"   Automation: {options.automation_name}")
        
        return webdriver.Remote(cls.APPIUM_SERVER_URL, options=options)
    
    @classmethod
    def find_apk_file(cls):
        """Find APK file in common locations."""
        possible_paths = [
            "./app.apk",
            "./android/app/build/outputs/apk/debug/app-debug.apk",
            "./android/app/build/outputs/apk/release/app-release.apk",
            "../app.apk",
            "../../app.apk"
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                return os.path.abspath(path)
        
        print("⚠️ APK file not found in common locations")
        print("   Please provide the APK path manually")
        return None
    
    @classmethod
    def find_ipa_file(cls):
        """Find IPA file in common locations."""
        possible_paths = [
            "./app.ipa",
            "./ios/build/app.ipa",
            "../app.ipa",
            "../../app.ipa"
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                return os.path.abspath(path)
        
        print("⚠️ IPA file not found in common locations")
        print("   Please provide the IPA path manually")
        return None
    
    @classmethod
    def check_appium_server(cls):
        """Check if Appium server is running."""
        import requests
        try:
            response = requests.get(f"{cls.APPIUM_SERVER_URL}/status", timeout=5)
            if response.status_code == 200:
                print("✅ Appium server is running")
                return True
            else:
                print("❌ Appium server is not responding properly")
                return False
        except requests.exceptions.RequestException:
            print("❌ Appium server is not running")
            print("   Please start Appium server with: appium")
            return False
    
    @classmethod
    def get_device_info(cls, driver):
        """Get device information."""
        try:
            device_info = {
                "platform": driver.capabilities.get("platformName"),
                "version": driver.capabilities.get("platformVersion"),
                "device": driver.capabilities.get("deviceName"),
                "app": driver.capabilities.get("app"),
                "automation": driver.capabilities.get("automationName")
            }
            
            print("📱 Device Information:")
            for key, value in device_info.items():
                print(f"   {key}: {value}")
            
            return device_info
        except Exception as e:
            print(f"⚠️ Could not get device info: {e}")
            return {}

# Test fixtures for mobile automation
@pytest.fixture(scope="session")
def mobile_config():
    """Mobile test configuration fixture."""
    return MobileTestConfig

@pytest.fixture(scope="function")
def android_driver(mobile_config):
    """Android Appium driver fixture."""
    # Check if Appium server is running
    if not mobile_config.check_appium_server():
        pytest.skip("Appium server is not running")
    
    # Get APK path from environment or find it
    apk_path = os.getenv("APK_PATH")
    
    driver = mobile_config.get_android_driver(apk_path)
    
    # Get device info
    mobile_config.get_device_info(driver)
    
    yield driver
    
    # Cleanup
    try:
        driver.quit()
    except:
        pass

@pytest.fixture(scope="function")
def ios_driver(mobile_config):
    """iOS Appium driver fixture."""
    # Check if Appium server is running
    if not mobile_config.check_appium_server():
        pytest.skip("Appium server is not running")
    
    # Get IPA path from environment or find it
    ipa_path = os.getenv("IPA_PATH")
    
    driver = mobile_config.get_ios_driver(ipa_path)
    
    # Get device info
    mobile_config.get_device_info(driver)
    
    yield driver
    
    # Cleanup
    try:
        driver.quit()
    except:
        pass
"""
URL Navigator utility for Expo Go direct screen navigation.
"""
import subprocess
import time
from typing import Optional
from utils.driver_factory import DriverFactory


class URLNavigator:
    """Utility class for navigating to specific screens using Expo Go URL scheme."""
    
    @staticmethod
    def get_base_url() -> str:
        """Get the base URL for Expo Go navigation."""
        config = DriverFactory.load_config()
        return config['expo']['base_url']
    
    @staticmethod
    def get_navigation_url(screen_name: str) -> str:
        """Get the full navigation URL for a specific screen."""
        config = DriverFactory.load_config()
        base_url = config['expo']['base_url']
        screen_path = config['navigation_urls'].get(screen_name)
        
        if not screen_path:
            raise ValueError(f"Unknown screen name: {screen_name}")
        
        return f"{base_url}{screen_path}"
    
    @staticmethod
    def navigate_to_screen(screen_name: str, timeout: int = 30) -> bool:
        """
        Navigate to a specific screen using ADB intent.
        
        Args:
            screen_name: Name of the screen to navigate to
            timeout: Timeout in seconds for navigation
            
        Returns:
            bool: True if navigation successful, False otherwise
        """
        try:
            url = URLNavigator.get_navigation_url(screen_name)
            
            # Use ADB to launch the URL in Expo Go
            cmd = [
                "adb", "shell", "am", "start",
                "-W",  # Wait for launch to complete
                "-a", "android.intent.action.VIEW",
                "-d", url,
                "host.exp.exponent"
            ]
            
            print(f"Navigating to: {url}")
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
            
            if result.returncode == 0:
                print(f"✓ Successfully navigated to {screen_name}")
                # Wait for screen to load
                time.sleep(3)
                return True
            else:
                print(f"✗ Failed to navigate to {screen_name}: {result.stderr}")
                return False
                
        except subprocess.TimeoutExpired:
            print(f"✗ Navigation to {screen_name} timed out")
            return False
        except Exception as e:
            print(f"✗ Error navigating to {screen_name}: {str(e)}")
            return False
    
    @staticmethod
    def navigate_to_onboarding() -> bool:
        """Navigate to the onboarding screen."""
        return URLNavigator.navigate_to_screen("onboarding")
    
    @staticmethod
    def navigate_to_signup() -> bool:
        """Navigate to the signup screen."""
        return URLNavigator.navigate_to_screen("signup")
    
    @staticmethod
    def navigate_to_email_page() -> bool:
        """Navigate to the email signup page."""
        return URLNavigator.navigate_to_screen("email_page")
    
    @staticmethod
    def navigate_to_phone_page() -> bool:
        """Navigate to the phone signup page."""
        return URLNavigator.navigate_to_screen("phone_page")
    
    @staticmethod
    def navigate_to_home() -> bool:
        """Navigate to the main home screen."""
        return URLNavigator.navigate_to_screen("home")
    
    @staticmethod
    def get_current_screen_url() -> Optional[str]:
        """Get the current screen URL from Expo Go."""
        try:
            # This is a placeholder - in a real implementation, you might need to
            # extract this from the app's current state or use a different method
            driver = DriverFactory.get_driver()
            # For now, we'll return None as this requires app-specific implementation
            return None
        except Exception as e:
            print(f"Error getting current screen URL: {str(e)}")
            return None
    
    @staticmethod
    def is_screen_loaded(screen_name: str, timeout: int = 10) -> bool:
        """
        Check if a specific screen is loaded.
        
        Args:
            screen_name: Name of the screen to check
            timeout: Timeout in seconds
            
        Returns:
            bool: True if screen is loaded, False otherwise
        """
        try:
            driver = DriverFactory.get_driver()
            
            # Wait for screen to be ready
            time.sleep(2)
            
            # Check for screen-specific elements
            if screen_name == "onboarding":
                # Check for onboarding elements
                onboarding_elements = [
                    "//*[contains(@text, 'Commute_io')]",
                    "//*[contains(@text, 'Get Started')]",
                    "//*[contains(@text, 'Carpooling made easy')]"
                ]
                for xpath in onboarding_elements:
                    try:
                        element = driver.find_element("xpath", xpath)
                        if element.is_displayed():
                            return True
                    except:
                        continue
                        
            elif screen_name == "signup":
                # Check for signup elements
                signup_elements = [
                    "//*[contains(@text, 'Get started')]",
                    "//*[contains(@text, 'Continue with email')]",
                    "//*[contains(@text, 'Continue with phone')]"
                ]
                for xpath in signup_elements:
                    try:
                        element = driver.find_element("xpath", xpath)
                        if element.is_displayed():
                            return True
                    except:
                        continue
            
            return False
            
        except Exception as e:
            print(f"Error checking if screen {screen_name} is loaded: {str(e)}")
            return False
"""
Expo Navigator utility for deep linking navigation in Expo Go.
"""
import subprocess
import time
from typing import Optional
from utils.driver_factory import DriverFactory


class ExpoNavigator:
    """Utility class for navigating within Expo Go using deep links."""
    
    @staticmethod
    def get_expo_base_url() -> str:
        """Get the base URL for Expo Go navigation."""
        config = DriverFactory.load_config()
        return config['expo']['base_url']
    
    @staticmethod
    def navigate_to_screen(screen_path: str, timeout: int = 30) -> bool:
        """
        Navigate to a specific screen using Expo Go deep linking.
        
        Args:
            screen_path: The screen path (e.g., "/auth/signup", "/auth/email")
            timeout: Timeout in seconds for navigation
            
        Returns:
            bool: True if navigation successful, False otherwise
        """
        try:
            base_url = ExpoNavigator.get_expo_base_url()
            full_url = f"{base_url}{screen_path}"
            
            print(f"Navigating to: {full_url}")
            
            # Use ADB to launch the deep link in Expo Go
            cmd = [
                "adb", "shell", "am", "start",
                "-W",  # Wait for launch to complete
                "-a", "android.intent.action.VIEW",
                "-d", full_url,
                "host.exp.exponent"
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
            
            if result.returncode == 0:
                print(f"✓ Successfully navigated to {screen_path}")
                time.sleep(3)  # Wait for screen to load
                return True
            else:
                print(f"✗ Failed to navigate to {screen_path}: {result.stderr}")
                return False
                
        except subprocess.TimeoutExpired:
            print(f"✗ Navigation to {screen_path} timed out")
            return False
        except Exception as e:
            print(f"✗ Error navigating to {screen_path}: {str(e)}")
            return False
    
    @staticmethod
    def navigate_to_signup() -> bool:
        """Navigate to the signup screen."""
        return ExpoNavigator.navigate_to_screen("/auth/signup")
    
    @staticmethod
    def navigate_to_email_input() -> bool:
        """Navigate to the email input screen."""
        return ExpoNavigator.navigate_to_screen("/auth/email")
    
    @staticmethod
    def navigate_to_phone_input() -> bool:
        """Navigate to the phone input screen."""
        return ExpoNavigator.navigate_to_screen("/auth/phone")
    
    @staticmethod
    def navigate_to_otp_verification() -> bool:
        """Navigate to the OTP verification screen."""
        return ExpoNavigator.navigate_to_screen("/auth/otp")
    
    @staticmethod
    def navigate_to_profile_setup() -> bool:
        """Navigate to the profile setup screen."""
        return ExpoNavigator.navigate_to_screen("/auth/profile-setup")
    
    @staticmethod
    def navigate_to_home() -> bool:
        """Navigate to the main home screen."""
        return ExpoNavigator.navigate_to_screen("/(tabs)")
    
    @staticmethod
    def reload_app() -> bool:
        """Reload the Expo Go app."""
        try:
            # Use ADB to force stop and restart Expo Go
            subprocess.run(["adb", "shell", "am", "force-stop", "host.exp.exponent"], 
                         capture_output=True, text=True)
            time.sleep(2)
            
            # Relaunch Expo Go
            base_url = ExpoNavigator.get_expo_base_url()
            cmd = [
                "adb", "shell", "am", "start",
                "-W",
                "-a", "android.intent.action.VIEW",
                "-d", base_url,
                "host.exp.exponent"
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            return result.returncode == 0
            
        except Exception as e:
            print(f"✗ Error reloading app: {str(e)}")
            return False
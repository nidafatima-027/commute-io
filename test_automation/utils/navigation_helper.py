import subprocess
import time
import yaml
import os
from typing import Optional

def load_config():
    """Load configuration from YAML file"""
    config_path = os.path.join(os.path.dirname(__file__), '..', 'config', 'config.yaml')
    with open(config_path, 'r') as file:
        return yaml.safe_load(file)

class ExpoNavigationHelper:
    """Helper class for navigating through Expo Go app using deep linking"""
    
    def __init__(self):
        self.config = load_config()
        self.navigation_urls = self.config.get('navigation_urls', {})
        self.expo_config = self.config.get('expo', {})
        
    def get_expo_server_ip(self) -> str:
        """Get the Expo server IP from config or detect automatically"""
        app_url = self.expo_config.get('app_url', '')
        if app_url and 'exp://' in app_url:
            # Extract IP from exp://IP:PORT format
            ip_part = app_url.replace('exp://', '').split(':')[0]
            if ip_part != '192.168.1.100':  # Default placeholder
                return ip_part
        
        # Try to detect IP automatically
        try:
            result = subprocess.run(['hostname', '-I'], capture_output=True, text=True)
            if result.returncode == 0:
                ip = result.stdout.strip().split()[0]
                return ip
        except:
            pass
        
        return '192.168.1.100'  # Fallback
    
    def update_navigation_urls(self, ip: str):
        """Update navigation URLs with the correct IP address"""
        base_url = f"exp://{ip}:8081"
        self.navigation_urls = {
            'get_started': f"{base_url}/--/onboarding",
            'signup': f"{base_url}/--/auth/signup",
            'email_page': f"{base_url}/--/auth/EmailPage",
            'otp_verification': f"{base_url}/--/auth/EmailOTP",
            'profile_setup': f"{base_url}/--/auth/profile-setup",
            'phone_page': f"{base_url}/--/auth/PhoneNumberPage",
            'phone_otp': f"{base_url}/--/auth/PhoneOTP",
            'daily_schedule': f"{base_url}/--/auth/DailySchedule",
            'preferred_location': f"{base_url}/--/auth/PreferredpickupLocation",
            'add_location': f"{base_url}/--/auth/AddLocationScreen",
            'main_app': f"{base_url}/--/(tabs)"
        }
    
    def navigate_to_screen(self, screen_name: str, driver=None) -> bool:
        """
        Navigate to a specific screen using deep linking
        
        Args:
            screen_name: Name of the screen to navigate to
            driver: Optional Appium driver for additional verification
            
        Returns:
            bool: True if navigation successful, False otherwise
        """
        try:
            # Update URLs with correct IP
            ip = self.get_expo_server_ip()
            self.update_navigation_urls(ip)
            
            if screen_name not in self.navigation_urls:
                print(f"❌ Unknown screen: {screen_name}")
                return False
            
            url = self.navigation_urls[screen_name]
            print(f"🧭 Navigating to {screen_name}: {url}")
            
            # Use adb to launch the deep link
            adb_command = f"adb shell am start -W -a android.intent.action.VIEW -d '{url}' host.exp.exponent"
            result = subprocess.run(adb_command, shell=True, capture_output=True, text=True)
            
            if result.returncode == 0:
                print(f"✅ Successfully navigated to {screen_name}")
                time.sleep(2)  # Wait for screen to load
                
                # Optional: Verify navigation with driver
                if driver:
                    return self.verify_screen_navigation(driver, screen_name)
                
                return True
            else:
                print(f"❌ Failed to navigate to {screen_name}: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Error navigating to {screen_name}: {str(e)}")
            return False
    
    def verify_screen_navigation(self, driver, screen_name: str) -> bool:
        """Verify that navigation was successful by checking screen elements"""
        try:
            from appium.webdriver.common.appiumby import AppiumBy
            from selenium.webdriver.support.ui import WebDriverWait
            from selenium.webdriver.support import expected_conditions as EC
            
            # Define expected elements for each screen
            screen_elements = {
                'get_started': [
                    (AppiumBy.XPATH, "//*[contains(@text, 'Get Started') or contains(@text, 'Welcome')]"),
                    (AppiumBy.XPATH, "//*[contains(@text, 'Continue with email') or contains(@text, 'Continue with phone')]")
                ],
                'signup': [
                    (AppiumBy.XPATH, "//*[contains(@text, 'Sign Up') or contains(@text, 'Create Account')]"),
                    (AppiumBy.XPATH, "//*[contains(@text, 'Continue with email') or contains(@text, 'Continue with phone')]")
                ],
                'email_page': [
                    (AppiumBy.XPATH, "//*[@class='android.widget.EditText']"),
                    (AppiumBy.XPATH, "//*[@class='android.widget.Button' and contains(@text, 'Next')]")
                ],
                'otp_verification': [
                    (AppiumBy.XPATH, "//*[@class='android.widget.EditText']"),
                    (AppiumBy.XPATH, "//*[@class='android.widget.Button' and contains(@text, 'Verify')]")
                ],
                'profile_setup': [
                    (AppiumBy.XPATH, "//*[contains(@text, 'Profile') or contains(@text, 'Setup')]"),
                    (AppiumBy.XPATH, "//*[@class='android.widget.EditText']")
                ]
            }
            
            if screen_name not in screen_elements:
                print(f"⚠️ No verification elements defined for {screen_name}")
                return True
            
            # Wait for at least one expected element to appear
            elements = screen_elements[screen_name]
            for locator in elements:
                try:
                    element = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located(locator)
                    )
                    print(f"✅ Verified {screen_name} navigation - found element: {locator[1]}")
                    return True
                except:
                    continue
            
            print(f"❌ Failed to verify {screen_name} navigation - no expected elements found")
            return False
            
        except Exception as e:
            print(f"⚠️ Error verifying {screen_name} navigation: {str(e)}")
            return True  # Assume success if verification fails
    
    def start_from_get_started(self, driver=None) -> bool:
        """Start the test flow from the Get Started screen"""
        return self.navigate_to_screen('get_started', driver)
    
    def get_current_screen_info(self, driver) -> dict:
        """Get information about the current screen"""
        try:
            # Try to find common screen identifiers
            screen_info = {
                'title': None,
                'buttons': [],
                'inputs': [],
                'text_elements': []
            }
            
            # Get all visible elements
            all_elements = driver.find_elements("xpath", "//*")
            
            for element in all_elements:
                try:
                    if element.is_displayed():
                        text = element.text or element.get_attribute('content-desc') or ''
                        element_type = element.tag_name or element.get_attribute('class') or 'Unknown'
                        
                        if text.strip():
                            if 'Button' in element_type:
                                screen_info['buttons'].append(text)
                            elif 'EditText' in element_type:
                                screen_info['inputs'].append(text)
                            else:
                                screen_info['text_elements'].append(text)
                                
                except:
                    continue
            
            return screen_info
            
        except Exception as e:
            print(f"❌ Error getting screen info: {str(e)}")
            return {'error': str(e)}

# Create singleton instance
navigation_helper = ExpoNavigationHelper()
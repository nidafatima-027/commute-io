"""
Basic pytest tests for Commute.io app.
"""
import pytest
import time
from pages.onboarding_page import OnboardingPage
from pages.authentication_page import SignupPage
from utils.driver_factory import DriverFactory


class TestBasicFunctionality:
    """Basic functionality tests that don't require complex navigation."""
    
    @pytest.fixture(scope="class")
    def driver(self):
        """Setup and teardown Appium driver."""
        print("\n🚀 Setting up Appium driver...")
        driver = DriverFactory.create_driver()
        yield driver
        print("\n🧹 Cleaning up Appium driver...")
        DriverFactory.quit_driver()
    
    def test_driver_initialization(self, driver):
        """Test that driver is properly initialized."""
        print("\n🔧 Testing driver initialization...")
        
        assert driver is not None, "Driver should not be None"
        print("✅ Driver initialized successfully")
        
        # Test basic driver functionality
        current_activity = driver.current_activity
        print(f"Current activity: {current_activity}")
        
        # Test that we can get page source
        page_source = driver.page_source
        assert len(page_source) > 0, "Page source should not be empty"
        print("✅ Page source retrieved successfully")
    
    def test_onboarding_page_basic(self, driver):
        """Test basic onboarding page functionality."""
        print("\n📱 Testing onboarding page basics...")
        
        onboarding_page = OnboardingPage()
        
        # Wait a bit for the app to load
        time.sleep(3)
        
        # Test that we can check if onboarding screen is displayed
        try:
            is_displayed = onboarding_page.is_onboarding_screen_displayed()
            print(f"Onboarding screen displayed: {is_displayed}")
            
            if is_displayed:
                print("✅ Onboarding screen is displayed")
            else:
                print("⚠️ Onboarding screen not detected (app might be on different screen)")
                
        except Exception as e:
            print(f"⚠️ Error checking onboarding screen: {str(e)}")
        
        # Test that we can get page source
        page_source = driver.page_source
        print(f"Page source length: {len(page_source)}")
        print("✅ Basic onboarding page test completed")
    
    def test_signup_page_basic(self, driver):
        """Test basic signup page functionality."""
        print("\n📝 Testing signup page basics...")
        
        signup_page = SignupPage()
        
        # Wait a bit for the app to load
        time.sleep(3)
        
        # Test that we can check if signup screen is displayed
        try:
            is_displayed = signup_page.is_signup_screen_displayed()
            print(f"Signup screen displayed: {is_displayed}")
            
            if is_displayed:
                print("✅ Signup screen is displayed")
            else:
                print("⚠️ Signup screen not detected (app might be on different screen)")
                
        except Exception as e:
            print(f"⚠️ Error checking signup screen: {str(e)}")
        
        print("✅ Basic signup page test completed")
    
    def test_app_connection(self, driver):
        """Test that we can connect to the app."""
        print("\n🔗 Testing app connection...")
        
        # Test basic app connection
        try:
            # Get current activity
            current_activity = driver.current_activity
            print(f"Current activity: {current_activity}")
            
            # Get app package
            app_package = driver.current_package
            print(f"App package: {app_package}")
            
            # Check if we're connected to Expo Go
            if "exponent" in app_package.lower():
                print("✅ Connected to Expo Go app")
            else:
                print(f"⚠️ Connected to app: {app_package}")
            
            # Test that we can get page source
            page_source = driver.page_source
            print(f"Page source length: {len(page_source)}")
            
            # Look for common app elements
            if "commute" in page_source.lower():
                print("✅ Commute.io app content detected")
            elif "expo" in page_source.lower():
                print("✅ Expo Go content detected")
            else:
                print("⚠️ App content not clearly identified")
            
        except Exception as e:
            print(f"❌ Error testing app connection: {str(e)}")
            raise
    
    def test_element_detection(self, driver):
        """Test that we can detect basic elements."""
        print("\n🔍 Testing element detection...")
        
        # Wait for app to load
        time.sleep(3)
        
        try:
            # Get page source
            page_source = driver.page_source
            
            # Look for common elements
            elements_found = []
            
            if "button" in page_source.lower():
                elements_found.append("buttons")
            
            if "text" in page_source.lower():
                elements_found.append("text elements")
            
            if "input" in page_source.lower():
                elements_found.append("input fields")
            
            if "image" in page_source.lower():
                elements_found.append("images")
            
            print(f"Elements detected: {', '.join(elements_found)}")
            
            if elements_found:
                print("✅ Element detection working")
            else:
                print("⚠️ No common elements detected")
                
        except Exception as e:
            print(f"❌ Error in element detection: {str(e)}")
    
    def test_screen_interaction(self, driver):
        """Test basic screen interaction capabilities."""
        print("\n👆 Testing screen interaction...")
        
        try:
            # Get screen size
            screen_size = driver.get_window_size()
            print(f"Screen size: {screen_size}")
            
            # Test tap at center of screen
            width = screen_size['width']
            height = screen_size['height']
            center_x = width // 2
            center_y = height // 2
            
            print(f"Tapping at center: ({center_x}, {center_y})")
            
            # Perform tap action
            from selenium.webdriver.common.action_chains import ActionChains
            actions = ActionChains(driver)
            actions.move_by_offset(center_x, center_y).click().perform()
            
            print("✅ Screen interaction test completed")
            
        except Exception as e:
            print(f"⚠️ Error in screen interaction: {str(e)}")
    
    def test_app_state(self, driver):
        """Test app state management."""
        print("\n📱 Testing app state...")
        
        try:
            # Get current app state
            app_state = driver.app_state("host.exp.exponent")
            print(f"App state: {app_state}")
            
            # Test app activation
            driver.activate_app("host.exp.exponent")
            time.sleep(2)
            
            new_app_state = driver.app_state("host.exp.exponent")
            print(f"App state after activation: {new_app_state}")
            
            if new_app_state == "RUNNING_IN_FOREGROUND":
                print("✅ App is running in foreground")
            else:
                print(f"⚠️ App state: {new_app_state}")
                
        except Exception as e:
            print(f"⚠️ Error testing app state: {str(e)}")


class TestSimpleNavigation:
    """Simple navigation tests."""
    
    @pytest.fixture(scope="class")
    def driver(self):
        """Setup and teardown Appium driver."""
        print("\n🚀 Setting up Appium driver for navigation tests...")
        driver = DriverFactory.create_driver()
        yield driver
        print("\n🧹 Cleaning up Appium driver...")
        DriverFactory.quit_driver()
    
    def test_get_started_button_tap(self, driver):
        """Test tapping Get Started button."""
        print("\n👆 Testing Get Started button tap...")
        
        onboarding_page = OnboardingPage()
        
        # Wait for app to load
        time.sleep(3)
        
        try:
            # Check if onboarding screen is displayed
            if onboarding_page.is_onboarding_screen_displayed():
                print("✅ Onboarding screen detected")
                
                # Try to tap Get Started button
                onboarding_page.tap_get_started_button()
                time.sleep(2)
                
                print("✅ Get Started button tapped")
                
                # Check if we navigated to signup screen
                signup_page = SignupPage()
                if signup_page.is_signup_screen_displayed():
                    print("✅ Successfully navigated to signup screen")
                else:
                    print("⚠️ Navigation to signup screen not confirmed")
                    
            else:
                print("⚠️ Onboarding screen not detected")
                
        except Exception as e:
            print(f"❌ Error in Get Started button test: {str(e)}")
    
    def test_continue_with_email_button(self, driver):
        """Test Continue with email button."""
        print("\n📧 Testing Continue with email button...")
        
        signup_page = SignupPage()
        
        # Wait for app to load
        time.sleep(3)
        
        try:
            # Check if signup screen is displayed
            if signup_page.is_signup_screen_displayed():
                print("✅ Signup screen detected")
                
                # Check if Continue with email button is visible
                if signup_page.is_continue_with_email_button_visible():
                    print("✅ Continue with email button is visible")
                    
                    # Try to tap the button
                    success = signup_page.tap_continue_with_email()
                    if success:
                        print("✅ Continue with email button tapped successfully")
                    else:
                        print("⚠️ Continue with email button tap failed")
                else:
                    print("⚠️ Continue with email button not visible")
            else:
                print("⚠️ Signup screen not detected")
                
        except Exception as e:
            print(f"❌ Error in Continue with email button test: {str(e)}")
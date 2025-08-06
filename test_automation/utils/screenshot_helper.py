"""
Screenshot helper utility for capturing and managing screenshots during test execution.
"""
import os
import time
from datetime import datetime
from typing import Optional
from .driver_factory import DriverFactory


class ScreenshotHelper:
    """Helper class for capturing and managing screenshots."""
    
    @staticmethod
    def create_screenshot_directory() -> str:
        """Create screenshot directory if it doesn't exist."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        screenshot_dir = os.path.join("screenshots", timestamp)
        os.makedirs(screenshot_dir, exist_ok=True)
        return screenshot_dir
    
    @staticmethod
    def capture_screenshot(
        filename: Optional[str] = None,
        directory: Optional[str] = None
    ) -> str:
        """
        Capture a screenshot and save it to the specified location.
        
        Args:
            filename: Optional custom filename
            directory: Optional custom directory
            
        Returns:
            str: Path to the saved screenshot
        """
        try:
            driver = DriverFactory.get_driver()
            
            if not directory:
                directory = ScreenshotHelper.create_screenshot_directory()
            
            if not filename:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:-3]
                filename = f"screenshot_{timestamp}.png"
            
            if not filename.endswith('.png'):
                filename += '.png'
            
            filepath = os.path.join(directory, filename)
            
            # Ensure directory exists
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            
            # Capture screenshot
            driver.save_screenshot(filepath)
            
            print(f"Screenshot saved: {filepath}")
            return filepath
            
        except Exception as e:
            print(f"Failed to capture screenshot: {str(e)}")
            return ""
    
    @staticmethod
    def capture_failure_screenshot(scenario_name: str, step_name: str) -> str:
        """
        Capture a screenshot for test failure scenarios.
        
        Args:
            scenario_name: Name of the failed scenario
            step_name: Name of the failed step
            
        Returns:
            str: Path to the saved screenshot
        """
        # Clean names for filename
        clean_scenario = "".join(c for c in scenario_name if c.isalnum() or c in (' ', '-', '_')).rstrip()
        clean_step = "".join(c for c in step_name if c.isalnum() or c in (' ', '-', '_')).rstrip()
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"FAILURE_{clean_scenario}_{clean_step}_{timestamp}.png"
        
        return ScreenshotHelper.capture_screenshot(filename)
    
    @staticmethod
    def cleanup_old_screenshots(days_to_keep: int = 7) -> None:
        """
        Clean up old screenshot directories.
        
        Args:
            days_to_keep: Number of days to keep screenshots
        """
        screenshots_base = "screenshots"
        if not os.path.exists(screenshots_base):
            return
        
        current_time = time.time()
        cutoff_time = current_time - (days_to_keep * 24 * 60 * 60)
        
        for item in os.listdir(screenshots_base):
            item_path = os.path.join(screenshots_base, item)
            if os.path.isdir(item_path):
                creation_time = os.path.getctime(item_path)
                if creation_time < cutoff_time:
                    import shutil
                    shutil.rmtree(item_path)
                    print(f"Cleaned up old screenshot directory: {item_path}")
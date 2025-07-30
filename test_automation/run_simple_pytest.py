#!/usr/bin/env python3
"""
Simple pytest runner for Commute.io test automation.
"""
import os
import sys
import subprocess
from pathlib import Path


def main():
    """Run simple pytest tests with proper driver initialization."""
    print("🚀 Commute.io - Simple Pytest Test Runner")
    print("=" * 50)
    
    # Ensure we're in the test_automation directory
    script_dir = Path(__file__).parent
    if not os.getcwd().endswith('test_automation'):
        os.chdir(script_dir)
    
    print("1. Checking prerequisites...")
    
    # Check if pytest is installed
    try:
        import pytest
        print("✅ Pytest is installed")
    except ImportError:
        print("❌ Pytest not found. Installing...")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements_pytest.txt"])
    
    # Check if config exists
    if not Path("config/config.yaml").exists():
        print("❌ Configuration not found. Please run setup first:")
        print("   python setup_test_environment.py")
        return False
    
    print("✅ Prerequisites check passed")
    
    print("\n2. Running Simple Pytest Tests...")
    print("   This will test basic functionality with proper driver setup")
    
    try:
        # Create reports directory
        reports_dir = Path("reports")
        if not reports_dir.exists():
            reports_dir.mkdir()
            print("📁 Created reports directory")
        
        # Run a simple test first to verify driver setup
        print("\n🔧 Testing driver initialization...")
        cmd = [
            sys.executable, "-m", "pytest",
            "pytest_tests/test_onboarding.py::TestOnboarding::test_onboarding_screen_displayed",
            "-v",
            "-s",
            "--tb=short",
            "--html=reports/simple_test_report.html",
            "--self-contained-html"
        ]
        
        print(f"Executing: {' '.join(cmd)}")
        print("-" * 50)
        
        result = subprocess.run(cmd)
        
        print("-" * 50)
        if result.returncode == 0:
            print("✅ Driver initialization successful!")
            print("\n🎉 Basic test passed!")
            print("\nNext steps:")
            print("1. Run smoke tests: python run_pytest_tests.py --smoke")
            print("2. Run complete flow: python run_pytest_tests.py --complete-flow")
            print("3. Run all tests: python run_pytest_tests.py --all")
        else:
            print("❌ Driver initialization failed!")
            print("\n🔍 Troubleshooting:")
            print("1. Check if Expo server is running: npm start")
            print("2. Check if device is connected: adb devices")
            print("3. Check if app is loaded in Expo Go")
            print("4. Check if Appium server is running: appium --port 4723")
            print("5. Review the test reports for specific failures")
        
        return result.returncode == 0
        
    except Exception as e:
        print(f"❌ Error running tests: {str(e)}")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
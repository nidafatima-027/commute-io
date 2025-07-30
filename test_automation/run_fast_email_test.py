#!/usr/bin/env python3
"""
Fast email flow test runner with optimized locators.
This uses only the working locator strategies for maximum speed.
"""
import os
import sys
import subprocess
from pathlib import Path


def main():
    """Run the fast email flow test with optimized locators."""
    print("🚀 Commute.io - Fast Email Flow Test")
    print("=" * 45)
    
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
    
    print("\n2. Running Fast Email Flow Test...")
    print("   This uses optimized locators for maximum speed:")
    print("   📱 Onboarding → Get Started")
    print("   📝 Signup → Continue with Email")
    print("   📧 Email Input → Next (optimized locator)")
    print("   🔐 OTP Verification → Verify (optimized locator)")
    print("   👤 Profile Setup → Continue")
    print("   🏠 Main Dashboard")
    
    try:
        # Create reports directory
        reports_dir = Path("reports")
        if not reports_dir.exists():
            reports_dir.mkdir()
            print("📁 Created reports directory")
        
        # Run the fast email flow test
        print("\n⚡ Running fast email flow test...")
        cmd = [
            sys.executable, "-m", "pytest",
            "pytest_tests/test_enhanced_email_flow.py::TestEnhancedEmailFlow::test_enhanced_email_authentication_flow",
            "-v",
            "-s",  # Show print statements
            "--tb=short",  # Short traceback for speed
            "--html=reports/fast_email_test_report.html",
            "--self-contained-html"
        ]
        
        print(f"Executing: {' '.join(cmd)}")
        print("-" * 45)
        
        result = subprocess.run(cmd)
        
        print("-" * 45)
        if result.returncode == 0:
            print("✅ Fast email flow test completed successfully!")
            print("\n🎉 Complete email authentication flow working!")
            print("\n📋 Test Summary:")
            print("   ✅ Onboarding screen verification")
            print("   ✅ Navigation to signup screen")
            print("   ✅ Continue with email button tap")
            print("   ✅ Email input screen navigation")
            print("   ✅ Email input with validation")
            print("   ✅ Next button detection and tap (optimized)")
            print("   ✅ OTP verification screen navigation")
            print("   ✅ OTP input and verification (optimized)")
            print("   ✅ Profile setup screen navigation")
            print("   ✅ Profile setup completion")
            print("   ✅ Main dashboard access")
            print("\n⚡ Performance Optimizations:")
            print("   - Using only working locator strategies")
            print("   - Reduced timeout values for faster failure detection")
            print("   - Optimized element detection algorithms")
            print("   - Streamlined navigation verification")
        else:
            print("❌ Fast email flow test failed!")
            print("\n🔍 Debugging Information Available:")
            print("   - Check the detailed output above for specific issues")
            print("   - Review the HTML report: reports/fast_email_test_report.html")
            print("   - Look for element detection issues")
            print("   - Check button state and validation")
            print("\n💡 Troubleshooting Tips:")
            print("   1. Make sure your device is connected: adb devices")
            print("   2. Make sure Appium server is running: appium --port 4723")
            print("   3. Make sure your app is loaded in Expo Go")
            print("   4. Check if the button text is exactly 'Next'")
            print("   5. Verify the app is on the correct screen")
        
        return result.returncode == 0
        
    except Exception as e:
        print(f"❌ Error running fast email flow test: {str(e)}")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
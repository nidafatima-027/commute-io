#!/usr/bin/env python3
"""
Enhanced email flow test runner with better debugging.
"""
import os
import sys
import subprocess
from pathlib import Path


def main():
    """Run the enhanced email flow test with detailed debugging."""
    print("🚀 Commute.io - Enhanced Email Flow Test")
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
    
    print("\n2. Running Enhanced Email Flow Test...")
    print("   This will test the email authentication flow with detailed debugging:")
    print("   📱 Onboarding → Get Started")
    print("   📝 Signup → Continue with Email")
    print("   📧 Email Input → Continue (with detailed debugging)")
    print("   🔐 OTP Verification → Verify")
    print("   👤 Profile Setup → Continue")
    print("   🏠 Main Dashboard")
    
    try:
        # Create reports directory
        reports_dir = Path("reports")
        if not reports_dir.exists():
            reports_dir.mkdir()
            print("📁 Created reports directory")
        
        # Run the enhanced email flow test
        print("\n🔍 Running enhanced email flow test with debugging...")
        cmd = [
            sys.executable, "-m", "pytest",
            "pytest_tests/test_enhanced_email_flow.py::TestEnhancedEmailFlow::test_enhanced_email_authentication_flow",
            "-v",
            "-s",  # Show print statements
            "--tb=long",  # Show full traceback
            "--html=reports/enhanced_email_flow_report.html",
            "--self-contained-html"
        ]
        
        print(f"Executing: {' '.join(cmd)}")
        print("-" * 50)
        
        result = subprocess.run(cmd)
        
        print("-" * 50)
        if result.returncode == 0:
            print("✅ Enhanced email flow test completed successfully!")
            print("\n🎉 Complete email authentication flow working!")
            print("\n📋 Test Summary:")
            print("   ✅ Onboarding screen verification")
            print("   ✅ Navigation to signup screen")
            print("   ✅ Continue with email button tap")
            print("   ✅ Email input screen navigation")
            print("   ✅ Email input with validation")
            print("   ✅ Continue button functionality")
            print("   ✅ OTP verification screen navigation")
            print("   ✅ OTP input and verification")
            print("   ✅ Profile setup screen navigation")
            print("   ✅ Profile setup completion")
            print("   ✅ Main dashboard access")
        else:
            print("❌ Enhanced email flow test failed!")
            print("\n🔍 Debugging Information Available:")
            print("   - Check the detailed output above for specific issues")
            print("   - Review the HTML report: reports/enhanced_email_flow_report.html")
            print("   - Look for element detection issues")
            print("   - Check button state and validation")
        
        return result.returncode == 0
        
    except Exception as e:
        print(f"❌ Error running enhanced email flow test: {str(e)}")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
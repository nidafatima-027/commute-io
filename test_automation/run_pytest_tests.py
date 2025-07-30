#!/usr/bin/env python3
"""
Pytest test runner for Commute.io test automation.
"""
import os
import sys
import subprocess
import argparse
from pathlib import Path


def setup_environment():
    """Setup the test environment."""
    print("🔧 Setting up test environment...")
    
    # Ensure we're in the test_automation directory
    script_dir = Path(__file__).parent
    if not os.getcwd().endswith('test_automation'):
        os.chdir(script_dir)
    
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
    
    print("✅ Environment setup complete")
    return True


def run_smoke_tests():
    """Run smoke tests."""
    print("\n🚀 Running Smoke Tests...")
    print("=" * 50)
    
    cmd = [
        sys.executable, "-m", "pytest",
        "pytest_tests/",
        "-m", "smoke",
        "-v",
        "--tb=short",
        "--html=reports/smoke_test_report.html",
        "--self-contained-html"
    ]
    
    result = subprocess.run(cmd)
    return result.returncode == 0


def run_email_flow_tests():
    """Run email flow tests."""
    print("\n📧 Running Email Flow Tests...")
    print("=" * 50)
    
    cmd = [
        sys.executable, "-m", "pytest",
        "pytest_tests/",
        "-m", "email_flow",
        "-v",
        "--tb=short",
        "--html=reports/email_flow_report.html",
        "--self-contained-html"
    ]
    
    result = subprocess.run(cmd)
    return result.returncode == 0


def run_integration_tests():
    """Run integration tests."""
    print("\n🔗 Running Integration Tests...")
    print("=" * 50)
    
    cmd = [
        sys.executable, "-m", "pytest",
        "pytest_tests/",
        "-m", "integration",
        "-v",
        "--tb=short",
        "--html=reports/integration_test_report.html",
        "--self-contained-html"
    ]
    
    result = subprocess.run(cmd)
    return result.returncode == 0


def run_error_handling_tests():
    """Run error handling tests."""
    print("\n❌ Running Error Handling Tests...")
    print("=" * 50)
    
    cmd = [
        sys.executable, "-m", "pytest",
        "pytest_tests/",
        "-m", "error_handling",
        "-v",
        "--tb=short",
        "--html=reports/error_handling_report.html",
        "--self-contained-html"
    ]
    
    result = subprocess.run(cmd)
    return result.returncode == 0


def run_all_tests():
    """Run all tests."""
    print("\n🎯 Running All Tests...")
    print("=" * 50)
    
    cmd = [
        sys.executable, "-m", "pytest",
        "pytest_tests/",
        "-v",
        "--tb=short",
        "--html=reports/full_test_report.html",
        "--self-contained-html",
        "--durations=10"
    ]
    
    result = subprocess.run(cmd)
    return result.returncode == 0


def run_specific_test(test_path):
    """Run a specific test file or test function."""
    print(f"\n🎯 Running Specific Test: {test_path}")
    print("=" * 50)
    
    cmd = [
        sys.executable, "-m", "pytest",
        test_path,
        "-v",
        "--tb=short",
        "--html=reports/specific_test_report.html",
        "--self-contained-html"
    ]
    
    result = subprocess.run(cmd)
    return result.returncode == 0


def run_parametrized_tests():
    """Run tests with different parameters."""
    print("\n🔄 Running Parametrized Tests...")
    print("=" * 50)
    
    cmd = [
        sys.executable, "-m", "pytest",
        "pytest_tests/test_email_flow.py::TestEmailInput::test_valid_email_input",
        "pytest_tests/test_email_flow.py::TestEmailInput::test_invalid_email_input",
        "pytest_tests/test_email_flow.py::TestOTPVerification::test_valid_otp_input",
        "pytest_tests/test_email_flow.py::TestOTPVerification::test_invalid_otp_input",
        "pytest_tests/test_email_flow.py::TestProfileSetup::test_profile_data_entry",
        "-v",
        "--tb=short",
        "--html=reports/parametrized_test_report.html",
        "--self-contained-html"
    ]
    
    result = subprocess.run(cmd)
    return result.returncode == 0


def run_complete_flow_test():
    """Run the complete email authentication flow test."""
    print("\n🚀 Running Complete Email Authentication Flow Test...")
    print("=" * 60)
    
    cmd = [
        sys.executable, "-m", "pytest",
        "pytest_tests/test_email_flow.py::TestCompleteEmailFlow::test_complete_email_authentication_flow",
        "-v",
        "--tb=short",
        "--html=reports/complete_flow_report.html",
        "--self-contained-html",
        "-s"  # Show print statements
    ]
    
    result = subprocess.run(cmd)
    return result.returncode == 0


def create_reports_directory():
    """Create reports directory if it doesn't exist."""
    reports_dir = Path("reports")
    if not reports_dir.exists():
        reports_dir.mkdir()
        print("📁 Created reports directory")


def main():
    """Main function to run pytest tests."""
    parser = argparse.ArgumentParser(description="Run Commute.io pytest tests")
    parser.add_argument("--smoke", action="store_true", help="Run smoke tests")
    parser.add_argument("--email-flow", action="store_true", help="Run email flow tests")
    parser.add_argument("--integration", action="store_true", help="Run integration tests")
    parser.add_argument("--error-handling", action="store_true", help="Run error handling tests")
    parser.add_argument("--parametrized", action="store_true", help="Run parametrized tests")
    parser.add_argument("--complete-flow", action="store_true", help="Run complete email authentication flow")
    parser.add_argument("--all", action="store_true", help="Run all tests")
    parser.add_argument("--test", type=str, help="Run specific test file or test function")
    parser.add_argument("--markers", action="store_true", help="List all available markers")
    
    args = parser.parse_args()
    
    print("🚀 Commute.io - Pytest Test Automation")
    print("=" * 50)
    
    # Setup environment
    if not setup_environment():
        return 1
    
    # Create reports directory
    create_reports_directory()
    
    # List markers if requested
    if args.markers:
        print("\n📋 Available Test Markers:")
        print("-" * 30)
        print("smoke: Basic functionality tests")
        print("email_flow: Email authentication flow tests")
        print("integration: Integration tests")
        print("error_handling: Error handling tests")
        print("accessibility: Accessibility tests")
        print("slow: Slow running tests")
        return 0
    
    # Run tests based on arguments
    success = True
    
    if args.smoke:
        success = run_smoke_tests()
    elif args.email_flow:
        success = run_email_flow_tests()
    elif args.integration:
        success = run_integration_tests()
    elif args.error_handling:
        success = run_error_handling_tests()
    elif args.parametrized:
        success = run_parametrized_tests()
    elif args.complete_flow:
        success = run_complete_flow_test()
    elif args.test:
        success = run_specific_test(args.test)
    elif args.all:
        success = run_all_tests()
    else:
        # Default: run smoke tests
        print("\n🎯 No specific test type specified. Running smoke tests...")
        success = run_smoke_tests()
    
    # Print summary
    print("\n" + "=" * 50)
    if success:
        print("✅ All tests completed successfully!")
        print("\n📊 Test Reports:")
        print("   - HTML reports saved in reports/ directory")
        print("   - Check individual report files for detailed results")
    else:
        print("❌ Some tests failed!")
        print("\n🔍 Troubleshooting:")
        print("   1. Check if Expo server is running: npm start")
        print("   2. Check if device is connected: adb devices")
        print("   3. Check if app is loaded in Expo Go")
        print("   4. Review the test reports for specific failures")
    
    print("\n📋 Next Steps:")
    print("   - Run specific test types: python run_pytest_tests.py --help")
    print("   - View test markers: python run_pytest_tests.py --markers")
    print("   - Run complete flow: python run_pytest_tests.py --complete-flow")
    
    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())
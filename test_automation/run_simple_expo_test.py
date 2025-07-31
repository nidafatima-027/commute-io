#!/usr/bin/env python3
"""
Simple Expo Test Runner - No conftest.py dependencies

This script runs the complete Expo flow test without relying on the conftest.py file
that has import issues.
"""

import os
import sys
import subprocess
import time

def run_simple_test():
    """Run the complete Expo flow test directly"""
    print("🚀 Simple Expo Test Runner")
    print("=" * 40)
    
    # Check if we're in the right directory
    if not os.path.exists("pytest_tests"):
        print("❌ Please run this script from the test_automation directory")
        return False
    
    # Run the test directly without conftest.py
    cmd = [
        sys.executable, "-m", "pytest",
        "pytest_tests/test_complete_expo_flow.py::TestCompleteExpoFlow::test_complete_expo_authentication_flow",
        "-v", "-s", "--tb=long",
        "--ignore=conftest.py"  # Ignore conftest.py to avoid import issues
    ]
    
    try:
        print("🧪 Running complete Expo flow test...")
        print(f"🔧 Command: {' '.join(cmd)}")
        
        result = subprocess.run(cmd)
        return result.returncode == 0
        
    except Exception as e:
        print(f"❌ Failed to run test: {str(e)}")
        return False

def run_navigation_test():
    """Run the navigation test"""
    print("🧭 Running navigation test...")
    
    cmd = [
        sys.executable, "-m", "pytest",
        "pytest_tests/test_complete_expo_flow.py::TestCompleteExpoFlow::test_navigation_verification",
        "-v", "-s", "--tb=short",
        "--ignore=conftest.py"
    ]
    
    try:
        result = subprocess.run(cmd)
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Failed to run navigation test: {str(e)}")
        return False

def run_elements_test():
    """Run the elements detection test"""
    print("🔍 Running elements detection test...")
    
    cmd = [
        sys.executable, "-m", "pytest",
        "pytest_tests/test_complete_expo_flow.py::TestCompleteExpoFlow::test_screen_elements_detection",
        "-v", "-s", "--tb=short",
        "--ignore=conftest.py"
    ]
    
    try:
        result = subprocess.run(cmd)
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Failed to run elements test: {str(e)}")
        return False

def main():
    """Main function"""
    if len(sys.argv) > 1:
        test_type = sys.argv[1]
    else:
        test_type = "complete"
    
    if test_type == "complete":
        success = run_simple_test()
    elif test_type == "navigation":
        success = run_navigation_test()
    elif test_type == "elements":
        success = run_elements_test()
    else:
        print(f"❌ Unknown test type: {test_type}")
        print("Available types: complete, navigation, elements")
        return 1
    
    if success:
        print("\n✅ Test completed successfully!")
        return 0
    else:
        print("\n❌ Test failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())
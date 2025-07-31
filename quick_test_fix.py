#!/usr/bin/env python3
"""
Quick Test Fix - Bypass Import Issues

This script runs a simple test to verify the setup works without any import issues.
"""

import os
import sys
import subprocess

def main():
    print("🔧 Quick Test Fix")
    print("=" * 30)
    
    # Check if we're in the right directory
    if not os.path.exists("test_automation"):
        print("❌ Please run this script from the project root directory")
        return 1
    
    # Change to test_automation directory
    os.chdir("test_automation")
    
    # Check if simple test runner exists
    if not os.path.exists("run_simple_expo_test.py"):
        print("❌ Simple test runner not found")
        return 1
    
    # Run the simple test
    print("🧪 Running simple Expo test...")
    cmd = [sys.executable, "run_simple_expo_test.py", "complete"]
    
    try:
        result = subprocess.run(cmd)
        if result.returncode == 0:
            print("✅ Test completed successfully!")
            return 0
        else:
            print("❌ Test failed!")
            return 1
    except Exception as e:
        print(f"❌ Error running test: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
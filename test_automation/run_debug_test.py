#!/usr/bin/env python3
"""
Debug test runner to identify button detection issues.
"""
import os
import sys
import subprocess
from pathlib import Path


def main():
    """Run the debug test."""
    print("🔍 Commute.io - Debug Button Detection")
    print("=" * 50)
    
    # Ensure we're in the test_automation directory
    script_dir = Path(__file__).parent
    if not os.getcwd().endswith('test_automation'):
        os.chdir(script_dir)
    
    print("1. Checking prerequisites...")
    
    # Check if setup has been run
    if not Path("config/config.yaml").exists():
        print("❌ Configuration not found. Please run setup first:")
        print("   python setup_test_environment.py")
        return False
    
    # Check if debug_buttons.feature exists
    if not Path("features/debug_buttons.feature").exists():
        print("❌ Debug test feature file not found")
        return False
    
    print("✅ Prerequisites check passed")
    
    print("\n2. Running Debug test...")
    print("   This will show all visible elements on the signup screen")
    print("   to help identify why buttons are not being tapped.")
    
    try:
        # Run the test with pretty format for clear output
        cmd = [
            sys.executable, "run_tests.py",
            "--feature", "debug_buttons.feature",
            "--format", "pretty"
        ]
        
        print(f"\nExecuting: {' '.join(cmd)}")
        print("-" * 50)
        
        result = subprocess.run(cmd)
        
        print("-" * 50)
        if result.returncode == 0:
            print("✅ Debug test completed successfully!")
            print("\n📋 Check the output above for:")
            print("   - All visible elements on the signup screen")
            print("   - Button detection attempts")
            print("   - Any error messages")
        else:
            print("❌ Debug test failed!")
            print("\n📋 Even if it failed, check the output for:")
            print("   - All visible elements on the signup screen")
            print("   - Button detection attempts")
            print("   - Any error messages")
        
        return result.returncode == 0
        
    except Exception as e:
        print(f"❌ Error running debug test: {str(e)}")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
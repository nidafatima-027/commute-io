#!/usr/bin/env python3
"""
Simple navigation test runner with debug information.
"""
import os
import sys
import subprocess
from pathlib import Path


def main():
    """Run the simple navigation test."""
    print("🚀 Commute.io - Simple Navigation Test with Debug")
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
    
    # Check if simple_navigation.feature exists
    if not Path("features/simple_navigation.feature").exists():
        print("❌ Simple navigation test feature file not found")
        return False
    
    print("✅ Prerequisites check passed")
    
    print("\n2. Running Simple Navigation test...")
    print("   This will:")
    print("   - Show all visible elements on signup screen")
    print("   - Attempt to tap Continue with email/phone buttons")
    print("   - Show detailed debug information")
    print("   - Test navigation to email/phone input screens")
    
    try:
        # Run the test with pretty format for clear output
        cmd = [
            sys.executable, "run_tests.py",
            "--feature", "simple_navigation.feature",
            "--format", "pretty"
        ]
        
        print(f"\nExecuting: {' '.join(cmd)}")
        print("-" * 50)
        
        result = subprocess.run(cmd)
        
        print("-" * 50)
        if result.returncode == 0:
            print("✅ Simple navigation test completed successfully!")
            print("\n🎉 Navigation is working correctly!")
            print("\nNext steps:")
            print("1. Test complete user flow: python run_complete_flow_test.py")
            print("2. Test specific flows: python run_tests.py --tags @email")
            print("3. Test phone flow: python run_tests.py --tags @phone")
        else:
            print("❌ Simple navigation test failed!")
            print("\n📋 Check the debug output above for:")
            print("   - All visible elements on the signup screen")
            print("   - Button detection attempts")
            print("   - Navigation issues")
            print("   - Any error messages")
        
        return result.returncode == 0
        
    except Exception as e:
        print(f"❌ Error running test: {str(e)}")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
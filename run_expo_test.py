#!/usr/bin/env python3
"""
Complete Expo Flow Test Runner - Windows Compatible

This script runs a comprehensive test that covers all authentication scenarios
in one continuous flow using Expo Go, without relaunching the app.

Prerequisites:
1. Expo Go app installed on device/emulator
2. Expo development server running (npm start)
3. Appium server running (appium --port 4723)
4. Backend server running (cd backend && python start_backend.py)
5. Device connected and accessible via adb
"""

import os
import sys
import subprocess
import time
import argparse
import platform
from pathlib import Path

def check_prerequisites():
    """Check if all prerequisites are met"""
    print("🔍 Checking prerequisites...")
    
    # Check if we're in the right directory
    if not os.path.exists("test_automation"):
        print("❌ Please run this script from the project root directory")
        return False
    
    # Check if Expo server is running
    try:
        result = subprocess.run(['curl', '-s', 'http://localhost:8081'], 
                              capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            print("✅ Expo development server is running")
        else:
            print("❌ Expo development server is not running")
            print("💡 Start it with: npm start")
            return False
    except:
        print("❌ Could not check Expo server")
        return False
    
    # Check if Appium server is running
    try:
        result = subprocess.run(['curl', '-s', 'http://localhost:4723/status'], 
                              capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            print("✅ Appium server is running")
        else:
            print("❌ Appium server is not running")
            print("💡 Start it with: appium --port 4723")
            return False
    except:
        print("❌ Could not check Appium server")
        return False
    
    # Check if backend server is running
    try:
        result = subprocess.run(['curl', '-s', 'http://localhost:8000/api/health'], 
                              capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            print("✅ Backend server is running")
        else:
            print("❌ Backend server is not running")
            print("💡 Start it with: cd backend && python start_backend.py")
            return False
    except:
        print("❌ Could not check backend server")
        return False
    
    # Check if device is connected
    try:
        result = subprocess.run(['adb', 'devices'], capture_output=True, text=True)
        if result.returncode == 0:
            lines = result.stdout.strip().split('\n')[1:]  # Skip header
            devices = [line for line in lines if line.strip() and 'device' in line]
            if devices:
                print(f"✅ Device connected: {devices[0].split()[0]}")
            else:
                print("❌ No device connected")
                print("💡 Connect a device or start an emulator")
                return False
        else:
            print("❌ Could not check devices")
            return False
    except:
        print("❌ Could not check devices")
        return False
    
    return True

def get_expo_server_ip():
    """Get the Expo server IP address"""
    try:
        # Try to get IP from hostname
        if platform.system() == "Windows":
            result = subprocess.run(['ipconfig'], capture_output=True, text=True)
            if result.returncode == 0:
                # Parse Windows ipconfig output
                lines = result.stdout.split('\n')
                for line in lines:
                    if 'IPv4' in line and '192.168.' in line:
                        ip = line.split(':')[-1].strip()
                        return ip
        else:
            result = subprocess.run(['hostname', '-I'], capture_output=True, text=True)
            if result.returncode == 0:
                ip = result.stdout.strip().split()[0]
                return ip
    except:
        pass
    
    # Fallback to common IPs
    return "192.168.1.100"

def update_config_with_ip(ip):
    """Update the config file with the correct IP address"""
    config_path = os.path.join("test_automation", "config", "config.yaml")
    
    try:
        with open(config_path, 'r') as file:
            content = file.read()
        
        # Update the app_url
        content = content.replace(
            'app_url: "exp://192.168.1.100:8081"',
            f'app_url: "exp://{ip}:8081"'
        )
        
        # Update navigation URLs
        content = content.replace(
            'get_started: "exp://192.168.1.100:8081/--/onboarding"',
            f'get_started: "exp://{ip}:8081/--/onboarding"'
        )
        content = content.replace(
            'signup: "exp://192.168.1.100:8081/--/auth/signup"',
            f'signup: "exp://{ip}:8081/--/auth/signup"'
        )
        content = content.replace(
            'email_page: "exp://192.168.1.100:8081/--/auth/EmailPage"',
            f'email_page: "exp://{ip}:8081/--/auth/EmailPage"'
        )
        content = content.replace(
            'otp_verification: "exp://192.168.1.100:8081/--/auth/EmailOTP"',
            f'otp_verification: "exp://{ip}:8081/--/auth/EmailOTP"'
        )
        content = content.replace(
            'profile_setup: "exp://192.168.1.100:8081/--/auth/profile-setup"',
            f'profile_setup: "exp://{ip}:8081/--/auth/profile-setup"'
        )
        
        with open(config_path, 'w') as file:
            file.write(content)
        
        print(f"✅ Updated config with IP: {ip}")
        
    except Exception as e:
        print(f"❌ Failed to update config: {str(e)}")

def get_python_command():
    """Get the appropriate Python command for the current system"""
    # Try different Python commands
    python_commands = ['python3', 'python', 'py']
    
    # First, try to use the virtual environment if it exists
    test_automation_dir = os.path.join(os.getcwd(), "test_automation")
    venv_python = os.path.join(test_automation_dir, 'venv', 'bin', 'python')
    if os.path.exists(venv_python):
        print(f"✅ Using virtual environment Python: {venv_python}")
        return venv_python
    
    # Try system Python commands
    for cmd in python_commands:
        try:
            result = subprocess.run([cmd, '--version'], 
                                  capture_output=True, text=True, timeout=5)
            if result.returncode == 0:
                print(f"✅ Using Python command: {cmd}")
                return cmd
        except:
            continue
    
    print("❌ No Python command found")
    return None

def run_tests(test_type="complete"):
    """Run the specified test type"""
    print(f"\n🧪 Running {test_type} test...")
    
    # Get Python command
    python_cmd = get_python_command()
    if not python_cmd:
        return False
    
    # Get the absolute path to test_automation directory
    current_dir = os.getcwd()
    test_automation_dir = os.path.join(current_dir, "test_automation")
    
    # Verify the directory exists
    if not os.path.exists(test_automation_dir):
        print(f"❌ Test automation directory not found: {test_automation_dir}")
        return False
    
    # Use the simple test runner that avoids conftest.py issues
    simple_runner = os.path.join(test_automation_dir, "run_simple_expo_test.py")
    
    if os.path.exists(simple_runner):
        cmd = [python_cmd, simple_runner, test_type]
    else:
        # Fallback to direct pytest command
        if test_type == "complete":
            cmd = [
                python_cmd, "-m", "pytest", 
                "pytest_tests/test_complete_expo_flow.py::TestCompleteExpoFlow::test_complete_expo_authentication_flow",
                "-v", "-s", "--tb=long",
                "--ignore=conftest.py"
            ]
        elif test_type == "navigation":
            cmd = [
                python_cmd, "-m", "pytest", 
                "pytest_tests/test_complete_expo_flow.py::TestCompleteExpoFlow::test_navigation_verification",
                "-v", "-s", "--tb=short",
                "--ignore=conftest.py"
            ]
        elif test_type == "elements":
            cmd = [
                python_cmd, "-m", "pytest", 
                "pytest_tests/test_complete_expo_flow.py::TestCompleteExpoFlow::test_screen_elements_detection",
                "-v", "-s", "--tb=short",
                "--ignore=conftest.py"
            ]
        else:
            print(f"❌ Unknown test type: {test_type}")
            return False
    
    try:
        print(f"📁 Running from directory: {test_automation_dir}")
        print(f"🔧 Command: {' '.join(cmd)}")
        
        result = subprocess.run(cmd, cwd=test_automation_dir)
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Failed to run tests: {str(e)}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Run Complete Expo Flow Tests")
    parser.add_argument("--test-type", choices=["complete", "navigation", "elements"], 
                       default="complete", help="Type of test to run")
    parser.add_argument("--skip-checks", action="store_true", 
                       help="Skip prerequisite checks")
    parser.add_argument("--ip", help="Manual IP address for Expo server")
    
    args = parser.parse_args()
    
    print("🚀 Complete Expo Flow Test Runner (Windows Compatible)")
    print("=" * 60)
    print(f"🖥️  Platform: {platform.system()} {platform.release()}")
    
    # Check prerequisites unless skipped
    if not args.skip_checks:
        if not check_prerequisites():
            print("\n❌ Prerequisites not met. Please fix the issues above.")
            return 1
    
    # Get and update IP address
    ip = args.ip or get_expo_server_ip()
    print(f"🌐 Using Expo server IP: {ip}")
    update_config_with_ip(ip)
    
    # Instructions for user
    print("\n📱 Setup Instructions:")
    print("1. Make sure Expo Go app is installed on your device/emulator")
    print("2. Scan the QR code from your Expo development server")
    print("3. The app should open in Expo Go")
    print("4. Keep the app open - the test will navigate through it")
    
    input("\nPress Enter when ready to start the test...")
    
    # Run the tests
    success = run_tests(args.test_type)
    
    if success:
        print("\n✅ Test completed successfully!")
    else:
        print("\n❌ Test failed!")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
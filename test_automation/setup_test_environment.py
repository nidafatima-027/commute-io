#!/usr/bin/env python3
"""
Setup script for test automation environment.
"""
import os
import sys
import subprocess
import socket
import yaml
from pathlib import Path


def get_local_ip():
    """Get the local IP address."""
    try:
        # Connect to a remote address to get local IP
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("8.8.8.8", 80))
            return s.getsockname()[0]
    except Exception:
        return "192.168.1.100"  # Default fallback


def update_config_with_local_ip():
    """Update the config file with the local IP address."""
    config_path = Path(__file__).parent / "config" / "config.yaml"
    
    if not config_path.exists():
        print("✗ Config file not found")
        return False
    
    try:
        with open(config_path, 'r') as file:
            config = yaml.safe_load(file)
        
        local_ip = get_local_ip()
        current_ip = config.get('expo', {}).get('base_url', '').split('://')[1].split(':')[0]
        
        if current_ip != local_ip:
            config['expo']['base_url'] = f"exp://{local_ip}:8081"
            
            with open(config_path, 'w') as file:
                yaml.dump(config, file, default_flow_style=False)
            
            print(f"✓ Updated config with local IP: {local_ip}")
            return True
        else:
            print(f"✓ Config already has correct IP: {local_ip}")
            return True
            
    except Exception as e:
        print(f"✗ Error updating config: {str(e)}")
        return False


def check_expo_server():
    """Check if Expo development server is running."""
    try:
        # Try to connect to Expo server
        import requests
        response = requests.get("http://localhost:8081", timeout=5)
        if response.status_code == 200:
            print("✓ Expo development server is running")
            return True
        else:
            print("✗ Expo development server is not responding properly")
            return False
    except ImportError:
        print("✗ requests module not available")
        return False
    except Exception:
        print("✗ Expo development server is not running")
        print("  Please start it with: npm start")
        return False


def check_appium_server():
    """Check if Appium server is running."""
    try:
        import requests
        urls_to_try = [
            "http://localhost:4723/status",
            "http://127.0.0.1:4723/status"
        ]
        
        for url in urls_to_try:
            try:
                response = requests.get(url, timeout=5)
                if response.status_code == 200:
                    print(f"✓ Appium server is running on {url}")
                    return True
            except requests.exceptions.RequestException:
                continue
        
        print("✗ Appium server is not running")
        print("  Please start it with: appium --port 4723")
        return False
        
    except ImportError:
        print("✗ requests module not available")
        return False


def check_android_device():
    """Check if Android device is connected."""
    try:
        result = subprocess.run(["adb", "devices"], capture_output=True, text=True)
        if "device" in result.stdout and "List of devices" in result.stdout:
            devices = [line for line in result.stdout.split('\n') if '\tdevice' in line]
            if devices:
                print(f"✓ Android device detected: {devices[0].split()[0]}")
                return True
            else:
                print("✗ No Android devices detected")
                print("  Please connect your device and enable USB debugging")
                return False
        else:
            print("✗ ADB not working properly")
            return False
    except FileNotFoundError:
        print("✗ ADB not found in PATH")
        print("  Please install Android SDK and add ADB to PATH")
        return False


def check_expo_go():
    """Check if Expo Go is installed."""
    try:
        result = subprocess.run([
            "adb", "shell", "pm", "list", "packages", "host.exp.exponent"
        ], capture_output=True, text=True)
        
        if "host.exp.exponent" in result.stdout:
            print("✓ Expo Go is installed on device")
            return True
        else:
            print("✗ Expo Go is not installed")
            print("  Please install Expo Go from Play Store")
            return False
    except Exception as e:
        print(f"✗ Error checking Expo Go: {str(e)}")
        return False


def install_dependencies():
    """Install Python dependencies."""
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], 
                      check=True)
        print("✓ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError:
        print("✗ Failed to install dependencies")
        return False


def main():
    """Main setup function."""
    print("Setting up test automation environment...\n")
    
    # Ensure we're in the test_automation directory
    script_dir = Path(__file__).parent
    if not os.getcwd().endswith('test_automation'):
        os.chdir(script_dir)
    
    # Install dependencies
    print("1. Installing dependencies...")
    if not install_dependencies():
        print("Failed to install dependencies")
        return False
    
    # Update config with local IP
    print("\n2. Updating configuration...")
    if not update_config_with_local_ip():
        print("Failed to update configuration")
        return False
    
    # Check prerequisites
    print("\n3. Checking prerequisites...")
    checks = [
        ("Expo development server", check_expo_server),
        ("Appium server", check_appium_server),
        ("Android device", check_android_device),
        ("Expo Go app", check_expo_go)
    ]
    
    all_passed = True
    for name, check_func in checks:
        print(f"\nChecking {name}...")
        if not check_func():
            all_passed = False
    
    if all_passed:
        print("\n✓ All prerequisites are met!")
        print("\nNext steps:")
        print("1. Make sure your app is loaded in Expo Go")
        print("2. Run a test with: python run_tests.py --feature get_started.feature")
        print("3. Or run all tests with: python run_tests.py --smoke")
    else:
        print("\n✗ Some prerequisites are not met. Please fix the issues above.")
        return False
    
    return True


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
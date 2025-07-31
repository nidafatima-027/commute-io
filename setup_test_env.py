#!/usr/bin/env python3
"""
Setup script for Expo Go Test Automation Environment

This script installs all required dependencies for running the Expo Go tests.
"""

import os
import sys
import subprocess
import platform

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8 or higher is required")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} is compatible")
    return True

def get_python_command():
    """Get the appropriate Python command"""
    commands = ['python3', 'python', 'py']
    
    for cmd in commands:
        try:
            result = subprocess.run([cmd, '--version'], 
                                  capture_output=True, text=True, timeout=5)
            if result.returncode == 0:
                print(f"✅ Found Python: {cmd}")
                return cmd
        except:
            continue
    
    print("❌ No Python command found")
    return None

def install_dependencies():
    """Install required dependencies"""
    python_cmd = get_python_command()
    if not python_cmd:
        return False
    
    print("\n📦 Installing dependencies...")
    
    # Change to test_automation directory
    test_automation_dir = os.path.join(os.getcwd(), "test_automation")
    if not os.path.exists(test_automation_dir):
        print(f"❌ Test automation directory not found: {test_automation_dir}")
        return False
    
    # Install dependencies
    requirements_file = os.path.join(test_automation_dir, "requirements_pytest.txt")
    if not os.path.exists(requirements_file):
        print(f"❌ Requirements file not found: {requirements_file}")
        return False
    
    try:
        print(f"📁 Installing from: {requirements_file}")
        result = subprocess.run([
            python_cmd, "-m", "pip", "install", "-r", requirements_file
        ], cwd=test_automation_dir)
        
        if result.returncode == 0:
            print("✅ Dependencies installed successfully")
            return True
        else:
            print("❌ Failed to install dependencies")
            return False
            
    except Exception as e:
        print(f"❌ Error installing dependencies: {str(e)}")
        return False

def verify_installation():
    """Verify that all required packages are installed"""
    print("\n🔍 Verifying installation...")
    
    required_packages = [
        'pytest',
        'Appium-Python-Client',
        'selenium',
        'PyYAML'
    ]
    
    python_cmd = get_python_command()
    if not python_cmd:
        return False
    
    all_installed = True
    for package in required_packages:
        try:
            result = subprocess.run([
                python_cmd, "-c", f"import {package.replace('-', '_')}; print('✅ {package}')"
            ], capture_output=True, text=True, timeout=5)
            
            if result.returncode == 0:
                print(f"✅ {package} is installed")
            else:
                print(f"❌ {package} is not installed")
                all_installed = False
                
        except Exception as e:
            print(f"❌ Error checking {package}: {str(e)}")
            all_installed = False
    
    return all_installed

def main():
    print("🚀 Expo Go Test Automation Setup")
    print("=" * 40)
    print(f"🖥️  Platform: {platform.system()} {platform.release()}")
    
    # Check Python version
    if not check_python_version():
        return 1
    
    # Install dependencies
    if not install_dependencies():
        print("\n❌ Failed to install dependencies")
        return 1
    
    # Verify installation
    if not verify_installation():
        print("\n❌ Some dependencies are missing")
        return 1
    
    print("\n🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Start Expo development server: npm start")
    print("2. Start backend server: cd backend && python start_backend.py")
    print("3. Start Appium server: appium --port 4723")
    print("4. Run the test: python run_expo_test.py")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
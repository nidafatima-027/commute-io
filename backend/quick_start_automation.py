#!/usr/bin/env python3
"""
Quick Start Automation Script for Commute.io

This script helps you quickly get started with the automation testing suite.
It will guide you through the setup process and run initial tests.
"""

import os
import sys
import subprocess
import time
from pathlib import Path

class QuickStartAutomation:
    """Quick start automation setup and testing."""
    
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.frontend_root = self.project_root.parent
        
    def print_welcome(self):
        """Print welcome message and overview."""
        print("🚀 Welcome to Commute.io Automation Testing!")
        print("=" * 60)
        print("This script will help you:")
        print("1. Check prerequisites")
        print("2. Install dependencies")
        print("3. Start backend server")
        print("4. Run initial tests")
        print("5. Set up mobile testing environment")
        print("=" * 60)
        print()
    
    def check_python_version(self):
        """Check if Python version is compatible."""
        print("🐍 Checking Python version...")
        
        version = sys.version_info
        if version.major >= 3 and version.minor >= 8:
            print(f"✅ Python {version.major}.{version.minor}.{version.micro} is compatible")
            return True
        else:
            print(f"❌ Python {version.major}.{version.minor}.{version.micro} is not compatible")
            print("   Please use Python 3.8 or higher")
            return False
    
    def install_dependencies(self):
        """Install Python dependencies."""
        print("\n📦 Installing Python dependencies...")
        
        requirements_file = self.project_root / "requirements.txt"
        if requirements_file.exists():
            try:
                subprocess.run(
                    ["pip", "install", "-r", "requirements.txt"],
                    cwd=self.project_root,
                    check=True
                )
                print("✅ Dependencies installed successfully")
                return True
            except subprocess.CalledProcessError:
                print("❌ Failed to install dependencies")
                return False
        else:
            print("❌ requirements.txt not found")
            return False
    
    def check_backend_server(self):
        """Check if backend server is running."""
        print("\n🔍 Checking backend server...")
        
        try:
            import requests
            response = requests.get("http://localhost:8000/api/health", timeout=5)
            if response.status_code == 200:
                print("✅ Backend server is already running")
                return True
        except:
            pass
        
        print("⚠️ Backend server is not running")
        return False
    
    def start_backend_server(self):
        """Start the backend server."""
        print("\n🚀 Starting backend server...")
        
        try:
            # Start backend server in background
            process = subprocess.Popen(
                ["python", "run_server.py"],
                cwd=self.project_root,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            
            # Wait a bit for server to start
            time.sleep(3)
            
            # Check if server started successfully
            try:
                import requests
                response = requests.get("http://localhost:8000/api/health", timeout=5)
                if response.status_code == 200:
                    print("✅ Backend server started successfully")
                    return process
                else:
                    print("❌ Backend server failed to start properly")
                    return None
            except:
                print("❌ Backend server failed to start")
                return None
                
        except Exception as e:
            print(f"❌ Error starting backend server: {e}")
            return None
    
    def run_initial_tests(self):
        """Run initial API tests to verify setup."""
        print("\n🧪 Running initial API tests...")
        
        try:
            result = subprocess.run(
                ["python", "run_tests.py", "--api", "--verbose"],
                cwd=self.project_root,
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0:
                print("✅ Initial API tests passed")
                return True
            else:
                print("❌ Initial API tests failed")
                print("Output:", result.stdout)
                print("Errors:", result.stderr)
                return False
                
        except Exception as e:
            print(f"❌ Error running tests: {e}")
            return False
    
    def setup_mobile_environment(self):
        """Setup mobile testing environment."""
        print("\n📱 Setting up mobile testing environment...")
        
        # Check if APK file exists
        apk_paths = [
            self.project_root / "app.apk",
            self.project_root.parent / "app.apk",
            self.project_root.parent.parent / "app.apk"
        ]
        
        apk_found = False
        for apk_path in apk_paths:
            if apk_path.exists():
                print(f"✅ APK file found: {apk_path}")
                os.environ["APK_PATH"] = str(apk_path)
                apk_found = True
                break
        
        if not apk_found:
            print("⚠️ APK file not found")
            print("   Please place your APK file in one of these locations:")
            for path in apk_paths:
                print(f"   - {path}")
            print("   Or set APK_PATH environment variable")
        
        # Check if Appium is installed
        try:
            result = subprocess.run(["appium", "--version"], capture_output=True, text=True)
            if result.returncode == 0:
                print("✅ Appium is installed")
                print(f"   Version: {result.stdout.strip()}")
            else:
                print("⚠️ Appium is not installed")
                print("   Install with: npm install -g appium")
        except FileNotFoundError:
            print("⚠️ Appium is not installed")
            print("   Install with: npm install -g appium")
        
        return apk_found
    
    def run_mobile_tests(self):
        """Run mobile automation tests."""
        print("\n📱 Running mobile automation tests...")
        
        # Check if Appium server is running
        try:
            import requests
            response = requests.get("http://localhost:4723/status", timeout=5)
            if response.status_code == 200:
                print("✅ Appium server is running")
            else:
                print("⚠️ Appium server is not running")
                print("   Start with: appium")
                return False
        except:
            print("⚠️ Appium server is not running")
            print("   Start with: appium")
            return False
        
        # Run mobile tests
        try:
            result = subprocess.run(
                ["python", "run_tests.py", "--mobile", "--verbose"],
                cwd=self.project_root,
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0:
                print("✅ Mobile tests completed successfully")
                return True
            else:
                print("❌ Mobile tests failed")
                print("Output:", result.stdout)
                print("Errors:", result.stderr)
                return False
                
        except Exception as e:
            print(f"❌ Error running mobile tests: {e}")
            return False
    
    def print_next_steps(self):
        """Print next steps for the user."""
        print("\n🎉 Quick start completed!")
        print("=" * 60)
        print("Next steps:")
        print()
        print("1. 📚 Read the testing documentation:")
        print("   cat TESTING.md")
        print()
        print("2. 🧪 Run specific test types:")
        print("   python run_tests.py --api          # API tests only")
        print("   python run_tests.py --mobile       # Mobile tests only")
        print("   python run_tests.py --all          # All tests")
        print()
        print("3. 📊 Generate coverage reports:")
        print("   python run_tests.py --all --coverage")
        print()
        print("4. 🔧 Troubleshoot network issues:")
        print("   python fix_network_issue.py")
        print()
        print("5. 📱 For mobile testing:")
        print("   - Start Appium server: appium")
        print("   - Ensure APK file is available")
        print("   - Start Android emulator or connect device")
        print()
        print("6. 🚀 For development:")
        print("   - Backend: cd backend && python run_server.py")
        print("   - Frontend: npm run dev")
        print()
        print("📞 For help, check TESTING.md or open an issue")
        print("=" * 60)
    
    def run_quick_start(self):
        """Run the complete quick start process."""
        self.print_welcome()
        
        # Check Python version
        if not self.check_python_version():
            return False
        
        # Install dependencies
        if not self.install_dependencies():
            return False
        
        # Check/start backend server
        backend_process = None
        if not self.check_backend_server():
            backend_process = self.start_backend_server()
            if not backend_process:
                print("⚠️ Continuing without backend server...")
        
        # Run initial tests
        if backend_process:
            self.run_initial_tests()
        
        # Setup mobile environment
        self.setup_mobile_environment()
        
        # Try to run mobile tests
        self.run_mobile_tests()
        
        # Print next steps
        self.print_next_steps()
        
        return True

def main():
    """Main function."""
    quick_start = QuickStartAutomation()
    success = quick_start.run_quick_start()
    
    if success:
        print("\n✅ Quick start completed successfully!")
    else:
        print("\n❌ Quick start encountered issues")
        print("   Please check the output above and try again")
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
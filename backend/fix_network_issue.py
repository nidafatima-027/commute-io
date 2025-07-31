#!/usr/bin/env python3
"""
Network Issue Diagnostic and Fix Script for Commute.io

This script helps diagnose and fix network connectivity issues that might be affecting
the APK build and mobile app functionality.
"""

import os
import sys
import socket
import requests
import subprocess
import json
from pathlib import Path

class NetworkDiagnostic:
    """Network diagnostic and fix utility."""
    
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.frontend_root = self.project_root.parent
        
    def check_backend_connectivity(self):
        """Check if backend server is accessible."""
        print("🔍 Checking backend connectivity...")
        
        # Check if backend is running
        try:
            response = requests.get("http://localhost:8000/api/health", timeout=5)
            if response.status_code == 200:
                print("✅ Backend server is running and accessible")
                return True
            else:
                print(f"⚠️ Backend server responded with status: {response.status_code}")
                return False
        except requests.exceptions.ConnectionError:
            print("❌ Backend server is not running or not accessible")
            return False
        except requests.exceptions.Timeout:
            print("❌ Backend server connection timeout")
            return False
    
    def check_api_endpoints(self):
        """Check if API endpoints are working."""
        print("\n🔍 Checking API endpoints...")
        
        endpoints = [
            "http://localhost:8000/",
            "http://localhost:8000/api/health",
            "http://localhost:8000/docs"
        ]
        
        for endpoint in endpoints:
            try:
                response = requests.get(endpoint, timeout=5)
                print(f"✅ {endpoint} - Status: {response.status_code}")
            except Exception as e:
                print(f"❌ {endpoint} - Error: {e}")
    
    def check_frontend_configuration(self):
        """Check frontend API configuration."""
        print("\n🔍 Checking frontend API configuration...")
        
        api_file = self.frontend_root / "services" / "api.ts"
        if api_file.exists():
            print(f"✅ API configuration file found: {api_file}")
            
            # Read and analyze the API configuration
            with open(api_file, 'r') as f:
                content = f.read()
                
            # Check for API base URL configuration
            if "getApiBaseUrl" in content:
                print("✅ Dynamic API base URL configuration found")
            else:
                print("⚠️ Static API base URL configuration detected")
                
            # Check for localhost references
            if "localhost:8000" in content:
                print("✅ Backend URL configured for localhost:8000")
            else:
                print("⚠️ Backend URL may not be configured for localhost")
        else:
            print(f"❌ API configuration file not found: {api_file}")
    
    def check_network_interfaces(self):
        """Check available network interfaces."""
        print("\n🔍 Checking network interfaces...")
        
        try:
            # Get local IP addresses
            hostname = socket.gethostname()
            local_ip = socket.gethostbyname(hostname)
            print(f"✅ Hostname: {hostname}")
            print(f"✅ Local IP: {local_ip}")
            
            # Check if backend is accessible via local IP
            try:
                response = requests.get(f"http://{local_ip}:8000/api/health", timeout=5)
                if response.status_code == 200:
                    print(f"✅ Backend accessible via local IP: {local_ip}:8000")
                else:
                    print(f"⚠️ Backend not accessible via local IP: {local_ip}:8000")
            except:
                print(f"❌ Backend not accessible via local IP: {local_ip}:8000")
                
        except Exception as e:
            print(f"❌ Error getting network information: {e}")
    
    def check_mobile_network_config(self):
        """Check mobile network configuration."""
        print("\n🔍 Checking mobile network configuration...")
        
        # Check if there are any mobile-specific network configurations
        mobile_config_files = [
            self.frontend_root / "app.json",
            self.frontend_root / "package.json"
        ]
        
        for config_file in mobile_config_files:
            if config_file.exists():
                print(f"✅ Mobile config file found: {config_file}")
                
                if config_file.name == "app.json":
                    with open(config_file, 'r') as f:
                        config = json.load(f)
                        print(f"   App name: {config.get('expo', {}).get('name', 'N/A')}")
                        print(f"   App slug: {config.get('expo', {}).get('slug', 'N/A')}")
    
    def suggest_fixes(self):
        """Suggest fixes for common network issues."""
        print("\n🔧 Suggested fixes for network issues:")
        print("-" * 50)
        
        print("1. Backend Server Issues:")
        print("   - Start backend server: cd backend && python run_server.py")
        print("   - Check if port 8000 is available: netstat -tulpn | grep 8000")
        print("   - Restart backend server if needed")
        
        print("\n2. Frontend Configuration Issues:")
        print("   - Update API base URL in services/api.ts")
        print("   - Check if __DEV__ flag is working correctly")
        print("   - Verify network permissions in app.json")
        
        print("\n3. Mobile Device Issues:")
        print("   - Ensure device/emulator is on same network as development machine")
        print("   - Check firewall settings")
        print("   - Try using local IP instead of localhost")
        print("   - Restart Expo development server")
        
        print("\n4. APK Build Issues:")
        print("   - Clear build cache: expo r -c")
        print("   - Rebuild APK with fresh cache")
        print("   - Check if all dependencies are properly installed")
        
        print("\n5. Network Debugging:")
        print("   - Use Expo DevTools to check network requests")
        print("   - Check browser developer tools for web version")
        print("   - Use network monitoring tools")
    
    def create_network_test_script(self):
        """Create a simple network test script for mobile."""
        print("\n📱 Creating mobile network test script...")
        
        test_script = self.project_root / "mobile_network_test.py"
        
        script_content = '''#!/usr/bin/env python3
"""
Mobile Network Test Script
Run this script to test network connectivity from mobile app perspective.
"""

import requests
import json
import time

def test_api_connectivity():
    """Test API connectivity from mobile perspective."""
    print("🔍 Testing API connectivity...")
    
    # Test different endpoints
    endpoints = [
        "http://localhost:8000/",
        "http://localhost:8000/api/health",
        "http://10.0.2.2:8000/",  # Android emulator localhost
        "http://10.0.2.2:8000/api/health"
    ]
    
    for endpoint in endpoints:
        try:
            print(f"Testing: {endpoint}")
            response = requests.get(endpoint, timeout=10)
            print(f"✅ {endpoint} - Status: {response.status_code}")
            
            if response.status_code == 200:
                print(f"   Response: {response.text[:100]}...")
        except Exception as e:
            print(f"❌ {endpoint} - Error: {e}")
        
        time.sleep(1)
    
    print("\\n📱 Mobile network test completed!")

if __name__ == "__main__":
    test_api_connectivity()
'''
        
        with open(test_script, 'w') as f:
            f.write(script_content)
        
        # Make it executable
        os.chmod(test_script, 0o755)
        print(f"✅ Network test script created: {test_script}")
    
    def run_network_diagnostic(self):
        """Run complete network diagnostic."""
        print("🚀 Commute.io Network Diagnostic")
        print("=" * 50)
        
        # Run all checks
        backend_ok = self.check_backend_connectivity()
        self.check_api_endpoints()
        self.check_frontend_configuration()
        self.check_network_interfaces()
        self.check_mobile_network_config()
        
        # Create test script
        self.create_network_test_script()
        
        # Suggest fixes
        self.suggest_fixes()
        
        # Summary
        print("\n" + "=" * 50)
        if backend_ok:
            print("✅ Backend connectivity is working")
        else:
            print("❌ Backend connectivity issues detected")
            print("   Please start the backend server first")
        
        print("\n📋 Next steps:")
        print("1. Start backend server: cd backend && python run_server.py")
        print("2. Start frontend: npm run dev")
        print("3. Test mobile app connectivity")
        print("4. Run automation tests: python run_tests.py --mobile")

def main():
    """Main function."""
    diagnostic = NetworkDiagnostic()
    diagnostic.run_network_diagnostic()

if __name__ == "__main__":
    main()
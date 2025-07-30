#!/usr/bin/env python3
"""
Simple script to test Appium server connectivity.
"""
import requests
import json
import sys

def test_appium_connection():
    """Test connection to Appium server."""
    print("🔍 Testing Appium Server Connection")
    print("=" * 40)
    
    # URLs to test
    urls_to_test = [
        "http://localhost:4723/wd/hub/status",
        "http://127.0.0.1:4723/wd/hub/status",
        "http://0.0.0.0:4723/wd/hub/status"
    ]
    
    for url in urls_to_test:
        print(f"\nTesting: {url}")
        try:
            response = requests.get(url, timeout=10)
            print(f"  Status Code: {response.status_code}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    print(f"  ✓ Server is responding")
                    print(f"  Response: {json.dumps(data, indent=2)}")
                    return True
                except ValueError:
                    print(f"  ✓ Server responded but not with JSON")
                    print(f"  Response: {response.text[:200]}")
            else:
                print(f"  ✗ Unexpected status code")
                
        except requests.exceptions.ConnectionError:
            print(f"  ✗ Connection refused - server not running on this address")
        except requests.exceptions.Timeout:
            print(f"  ✗ Connection timeout")
        except Exception as e:
            print(f"  ✗ Error: {str(e)}")
    
    return False

def test_port_availability():
    """Test if port 4723 is available."""
    print("\n🔍 Testing Port Availability")
    print("=" * 40)
    
    import socket
    
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        result = sock.connect_ex(('localhost', 4723))
        sock.close()
        
        if result == 0:
            print("✓ Port 4723 is open and accepting connections")
            return True
        else:
            print("✗ Port 4723 is not accepting connections")
            return False
    except Exception as e:
        print(f"✗ Error testing port: {str(e)}")
        return False

def main():
    """Main function."""
    print("🧪 Appium Server Connection Test")
    print("=" * 50)
    
    # Test port first
    port_available = test_port_availability()
    
    # Test HTTP connection
    http_working = test_appium_connection()
    
    print("\n" + "=" * 50)
    print("📋 Test Results Summary")
    print("=" * 50)
    
    if port_available:
        print("✓ Port 4723 is accessible")
    else:
        print("✗ Port 4723 is not accessible")
        
    if http_working:
        print("✓ Appium HTTP server is responding")
        print("\n🎉 Appium server is working correctly!")
        print("\nNext steps:")
        print("1. Connect your Android device")
        print("2. Run: python run_tests.py --check")
        return True
    else:
        print("✗ Appium HTTP server is not responding")
        print("\n❌ Appium server connection failed!")
        print("\nTroubleshooting:")
        print("1. Make sure Appium is running: appium --port 4723")
        print("2. Check if another process is using port 4723")
        print("3. Try restarting Appium server")
        print("4. Check firewall settings")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
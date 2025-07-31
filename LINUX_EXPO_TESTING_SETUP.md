# Linux Expo Go Testing Setup Guide

## 🎯 Overview

This guide helps you set up and run the complete Expo Go test automation on **Linux**, covering all authentication scenarios in one continuous flow.

## 🚀 Quick Start

### Option 1: Using the Linux Script (Recommended)
```bash
# Make executable and run
chmod +x run_expo_test_linux.sh
./run_expo_test_linux.sh
```

### Option 2: Manual Setup
```bash
# Navigate to test_automation directory
cd test_automation

# Activate virtual environment
source venv/bin/activate

# Run the test
python run_complete_expo_flow.py
```

## 📋 Prerequisites

### 1. Python 3.8+
```bash
# Check Python version
python3 --version

# Install if needed (Ubuntu/Debian)
sudo apt update
sudo apt install python3 python3-pip python3-venv
```

### 2. Node.js and npm
```bash
# Install Node.js (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 3. Android Development Tools
```bash
# Install ADB
sudo apt install android-tools-adb

# Or download from Android SDK
# https://developer.android.com/studio#command-tools
```

### 4. Appium
```bash
# Install Appium globally
npm install -g appium

# Install UiAutomator2 driver
appium driver install uiautomator2
```

## 🔧 Setup Steps

### Step 1: Install Dependencies
```bash
# Navigate to test_automation directory
cd test_automation

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements_pytest.txt
```

### Step 2: Start All Services

#### Terminal 1: Expo Development Server
```bash
npm start
```

#### Terminal 2: Backend Server
```bash
cd backend
python start_backend.py
```

#### Terminal 3: Appium Server
```bash
appium --port 4723
```

### Step 3: Connect Device
```bash
# Check if device is connected
adb devices

# Should show something like:
# List of devices attached
# emulator-5554    device
```

### Step 4: Open App in Expo Go
1. **Install Expo Go** from Google Play Store
2. **Scan QR code** from Expo development server
3. **Wait for app to load** in Expo Go
4. **Keep app open** - don't close it

### Step 5: Run the Test
```bash
# Option 1: Using Linux script
./run_expo_test_linux.sh

# Option 2: Manual execution
cd test_automation
source venv/bin/activate
python run_complete_expo_flow.py
```

## 🧪 Test Types

### Complete Flow Test (Default)
```bash
python run_complete_expo_flow.py --test-type complete
```
- Tests all authentication scenarios in one continuous flow
- Covers: Get Started → Signup → Email → OTP → Profile Setup → Phone

### Navigation Test
```bash
python run_complete_expo_flow.py --test-type navigation
```
- Tests navigation between different screens
- Verifies deep linking works correctly

### Element Detection Test
```bash
python run_complete_expo_flow.py --test-type elements
```
- Detects and lists elements on each screen
- Useful for debugging element locators

## 🔍 Troubleshooting

### Common Linux Issues

#### 1. "Permission denied"
```bash
# Make script executable
chmod +x run_expo_test_linux.sh

# Or run with bash
bash run_expo_test_linux.sh
```

#### 2. "Python3 not found"
```bash
# Install Python 3
sudo apt update
sudo apt install python3 python3-pip python3-venv
```

#### 3. "Virtual environment not found"
```bash
# Create virtual environment
cd test_automation
python3 -m venv venv
source venv/bin/activate
pip install -r requirements_pytest.txt
```

#### 4. "adb not found"
```bash
# Install ADB
sudo apt install android-tools-adb

# Or add to PATH if installed manually
export PATH=$PATH:/path/to/android-sdk/platform-tools
```

#### 5. "Appium not found"
```bash
# Install Appium globally
npm install -g appium

# Or use npx
npx appium --port 4723
```

### Network Issues

#### 1. "Expo development server is not running"
```bash
# Check if Expo server is running
curl http://localhost:8081

# Start Expo server if needed
npm start
```

#### 2. "Backend server is not running"
```bash
# Check if backend is running
curl http://localhost:8000/api/health

# Start backend server if needed
cd backend
python start_backend.py
```

#### 3. "Appium server is not running"
```bash
# Check if Appium is running
curl http://localhost:4723/status

# Start Appium server if needed
appium --port 4723
```

#### 4. "No device connected"
```bash
# Check connected devices
adb devices

# Start emulator if needed
emulator -avd YourAVDName

# Or connect physical device via USB
```

### IP Address Issues

#### 1. "Wrong IP address detected"
```bash
# Use manual IP address
python run_complete_expo_flow.py --ip 192.168.1.100

# Find your IP address
hostname -I
# or
ip addr show
```

#### 2. "Device can't connect to Expo server"
- Ensure device and computer are on same network
- Check firewall settings: `sudo ufw status`
- Try using mobile hotspot

## 📱 Device Setup

### Android Emulator
```bash
# List available AVDs
emulator -list-avds

# Start emulator
emulator -avd YourAVDName

# Wait for emulator to boot, then run test
```

### Physical Device
1. **Enable Developer Options**:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options
   - Enable "USB Debugging"

2. **Connect via USB**:
   ```bash
   adb devices
   ```

3. **Install Expo Go**:
   - Download from Google Play Store
   - Open and scan QR code

## 🔧 Advanced Configuration

### Custom IP Address
```bash
# Use specific IP address
python run_complete_expo_flow.py --ip 192.168.1.100
```

### Skip Prerequisite Checks
```bash
# Skip all checks (use with caution)
python run_complete_expo_flow.py --skip-checks
```

### Debug Mode
```bash
# Run with verbose output
python run_complete_expo_flow.py --test-type elements
```

## 📊 Test Results

### Success Indicators
- ✅ All navigation steps completed
- ✅ Email authentication flow successful
- ✅ OTP verification completed
- ✅ Profile setup detected
- ✅ Phone authentication option available

### Failure Indicators
- ❌ Navigation timeouts
- ❌ Element not found errors
- ❌ App crashes or freezes
- ❌ Network connection issues

## 🎯 Best Practices

### 1. **Environment Setup**
- Use dedicated test device/emulator
- Keep device screen on during tests
- Use stable WiFi connection

### 2. **Service Management**
- Start services in separate terminals
- Monitor service logs for errors
- Restart services if they become unresponsive

### 3. **Test Execution**
- Run tests during low network usage
- Don't close Expo Go app during test
- Keep device connected via USB

### 4. **Debugging**
- Use element detection test for debugging
- Check device logs: `adb logcat`
- Monitor Expo server logs

## 🔄 Continuous Testing

### Automated Setup Script
Create a script to start all services:
```bash
#!/bin/bash
echo "Starting all services for Expo Go testing..."

# Start Expo server
npm start &
EXPO_PID=$!

# Start backend server
cd backend
python start_backend.py &
BACKEND_PID=$!

# Start Appium server
appium --port 4723 &
APPIUM_PID=$!

echo "All services started! PIDs: $EXPO_PID, $BACKEND_PID, $APPIUM_PID"
echo "Run the test when ready: ./run_expo_test_linux.sh"

# Wait for user input to stop
read -p "Press Enter to stop all services..."
kill $EXPO_PID $BACKEND_PID $APPIUM_PID
```

### Integration with CI/CD
The Linux setup can be integrated into CI/CD pipelines:
- ✅ **Automated dependency installation**
- ✅ **Service startup scripts**
- ✅ **Test execution and reporting**
- ✅ **Error handling and recovery**

## 📈 Performance Tips

### 1. **Use SSD Storage**
- Faster file operations
- Quicker test execution

### 2. **Sufficient RAM**
- At least 8GB recommended
- Close unnecessary applications

### 3. **Stable Network**
- Use wired connection if possible
- Avoid network congestion

### 4. **Optimized Device**
- Use dedicated test device
- Clear app data regularly

## 🎉 Success!

With this setup, you can now:
- ✅ Run complete authentication flow tests on Linux
- ✅ Avoid network issues with Expo Go
- ✅ Get fast feedback on your changes
- ✅ Debug issues effectively
- ✅ Maintain a stable testing environment

The Linux-compatible setup provides a reliable way to test all your authentication scenarios while maintaining the simplicity and speed of Expo Go testing.
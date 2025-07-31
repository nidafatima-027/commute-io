# Windows Expo Go Testing Setup Guide

## 🎯 Overview

This guide helps you set up and run the complete Expo Go test automation on Windows, covering all authentication scenarios in one continuous flow.

## 🚀 Quick Start

### Option 1: Using the Windows Batch File (Recommended)
```cmd
# Double-click or run from command prompt
run_expo_test.bat
```

### Option 2: Using Python Script
```cmd
# Run the Windows-compatible script
python run_expo_test.py
```

### Option 3: Using Python3
```cmd
# If you have python3 installed
python3 run_expo_test.py
```

## 📋 Prerequisites

### 1. Python Installation
- **Python 3.8 or higher** required
- Download from: https://www.python.org/downloads/
- Make sure to check "Add Python to PATH" during installation

### 2. Node.js and npm
- **Node.js 16 or higher** required
- Download from: https://nodejs.org/
- Includes npm automatically

### 3. Android Development Tools
- **Android Studio** (for emulator) or **Physical Android Device**
- **ADB (Android Debug Bridge)** - usually included with Android Studio
- **Expo Go app** installed on device/emulator

### 4. Appium
```cmd
# Install Appium globally
npm install -g appium

# Install UiAutomator2 driver
appium driver install uiautomator2
```

## 🔧 Setup Steps

### Step 1: Install Dependencies
```cmd
# Run the setup script
python setup_test_env.py
```

This will:
- ✅ Check Python version compatibility
- ✅ Install all required Python packages
- ✅ Verify installation

### Step 2: Start All Services

#### Terminal 1: Expo Development Server
```cmd
npm start
```

#### Terminal 2: Backend Server
```cmd
cd backend
python start_backend.py
```

#### Terminal 3: Appium Server
```cmd
appium --port 4723
```

### Step 3: Connect Device
```cmd
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
```cmd
# Option 1: Using batch file
run_expo_test.bat

# Option 2: Using Python script
python run_expo_test.py

# Option 3: With specific test type
python run_expo_test.py --test-type navigation
```

## 🧪 Test Types

### Complete Flow Test (Default)
```cmd
python run_expo_test.py --test-type complete
```
- Tests all authentication scenarios in one continuous flow
- Covers: Get Started → Signup → Email → OTP → Profile Setup → Phone

### Navigation Test
```cmd
python run_expo_test.py --test-type navigation
```
- Tests navigation between different screens
- Verifies deep linking works correctly

### Element Detection Test
```cmd
python run_expo_test.py --test-type elements
```
- Detects and lists elements on each screen
- Useful for debugging element locators

## 🔍 Troubleshooting

### Common Windows Issues

#### 1. "Python is not recognized"
```cmd
# Solution: Add Python to PATH or use full path
C:\Python39\python.exe run_expo_test.py

# Or install Python with "Add to PATH" option
```

#### 2. "The directory name is invalid"
```cmd
# Solution: Run from project root directory
cd C:\project\Car-Pooling-App
python run_expo_test.py
```

#### 3. "curl is not recognized"
```cmd
# Solution: Install curl or use PowerShell
# Download from: https://curl.se/windows/

# Or use PowerShell equivalent:
powershell -Command "Invoke-WebRequest -Uri http://localhost:8081"
```

#### 4. "adb is not recognized"
```cmd
# Solution: Add Android SDK to PATH
# Add to PATH: C:\Users\YourUser\AppData\Local\Android\Sdk\platform-tools

# Or use full path:
C:\Users\YourUser\AppData\Local\Android\Sdk\platform-tools\adb.exe devices
```

#### 5. "Appium is not recognized"
```cmd
# Solution: Install Appium globally
npm install -g appium

# Or use npx:
npx appium --port 4723
```

### Network Issues

#### 1. "Expo development server is not running"
```cmd
# Check if Expo server is running
curl http://localhost:8081

# Start Expo server if needed
npm start
```

#### 2. "Backend server is not running"
```cmd
# Check if backend is running
curl http://localhost:8000/api/health

# Start backend server if needed
cd backend
python start_backend.py
```

#### 3. "Appium server is not running"
```cmd
# Check if Appium is running
curl http://localhost:4723/status

# Start Appium server if needed
appium --port 4723
```

#### 4. "No device connected"
```cmd
# Check connected devices
adb devices

# Start emulator if needed
emulator -avd YourAVDName

# Or connect physical device via USB
```

### IP Address Issues

#### 1. "Wrong IP address detected"
```cmd
# Use manual IP address
python run_expo_test.py --ip 192.168.1.100

# Find your IP address
ipconfig
```

#### 2. "Device can't connect to Expo server"
- Ensure device and computer are on same network
- Check Windows Firewall settings
- Try using mobile hotspot

## 📱 Device Setup

### Android Emulator
```cmd
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
   ```cmd
   adb devices
   ```

3. **Install Expo Go**:
   - Download from Google Play Store
   - Open and scan QR code

## 🔧 Advanced Configuration

### Custom IP Address
```cmd
# Use specific IP address
python run_expo_test.py --ip 192.168.1.100
```

### Skip Prerequisite Checks
```cmd
# Skip all checks (use with caution)
python run_expo_test.py --skip-checks
```

### Debug Mode
```cmd
# Run with verbose output
python run_expo_test.py --test-type elements
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
Create a batch file to start all services:
```batch
@echo off
echo Starting all services for Expo Go testing...

REM Start Expo server
start "Expo Server" cmd /k "npm start"

REM Start backend server
start "Backend Server" cmd /k "cd backend && python start_backend.py"

REM Start Appium server
start "Appium Server" cmd /k "appium --port 4723"

echo All services started!
echo Run the test when ready: python run_expo_test.py
pause
```

### Integration with CI/CD
The Windows setup can be integrated into CI/CD pipelines:
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
- ✅ Run complete authentication flow tests on Windows
- ✅ Avoid network issues with Expo Go
- ✅ Get fast feedback on your changes
- ✅ Debug issues effectively
- ✅ Maintain a stable testing environment

The Windows-compatible setup provides a reliable way to test all your authentication scenarios while maintaining the simplicity and speed of Expo Go testing.
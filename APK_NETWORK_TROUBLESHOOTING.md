# APK Network Troubleshooting Guide

## 🚨 Problem: "Network request failed" in APK

When you build and run an APK, the app can't connect to your local backend server, resulting in "Network request failed" errors.

## 🔍 Root Cause

The issue occurs because:
1. **APK runs in production mode** (`__DEV__` is false)
2. **Production mode tries to connect to production API** (`https://your-production-api.com/api`)
3. **Production API doesn't exist** or isn't accessible
4. **Local backend server** is only accessible via localhost/network IP

## ✅ Solutions

### Solution 1: Use the Network Debug Screen (Recommended)

1. **Rebuild your APK** with the new network configuration:
   ```bash
   npx expo build:android
   ```

2. **Install the new APK** on your device/emulator

3. **Open the app** and navigate to: `Debug > Network`

4. **Configure the IP address**:
   - **For Android Emulator**: Use `10.0.2.2` (default)
   - **For Physical Device**: Enter your computer's IP address

5. **Test the connection** using the "Test Connection" button

### Solution 2: Manual Configuration

#### For Android Emulator:
The app is already configured to use `10.0.2.2` for emulator testing.

#### For Physical Device:
1. **Find your computer's IP address**:
   ```bash
   # On Windows
   ipconfig
   
   # On macOS/Linux
   ifconfig
   # or
   hostname -I
   ```

2. **Update the configuration** in `services/config.ts`:
   ```typescript
   export const API_CONFIG = {
     testing: {
       android: 'http://YOUR_IP_ADDRESS:8000/api', // Replace with your IP
     }
   };
   ```

3. **Rebuild the APK**:
   ```bash
   npx expo build:android
   ```

### Solution 3: Quick Setup Script

Run the setup script to automatically configure everything:
```bash
./setup-apk-testing.sh
```

## 🔧 Backend Server Setup

### 1. Start the Backend Server
```bash
cd backend
python start_backend.py
```

### 2. Verify Backend is Running
```bash
curl http://localhost:8000/api/health
```
Should return: `{"status": "healthy", "message": "API is running"}`

### 3. Test Network Accessibility
```bash
# Replace YOUR_IP with your computer's IP address
curl http://YOUR_IP:8000/api/health
```

## 🌐 Network Configuration

### Android Emulator
- **IP Address**: `10.0.2.2`
- **Port**: `8000`
- **URL**: `http://10.0.2.2:8000/api`

### Physical Device
- **IP Address**: Your computer's IP (e.g., `192.168.1.100`)
- **Port**: `8000`
- **URL**: `http://192.168.1.100:8000/api`

## 🔍 Troubleshooting Steps

### Step 1: Check Backend Server
```bash
# Check if backend is running
curl http://localhost:8000/api/health

# If not running, start it
cd backend
python start_backend.py
```

### Step 2: Check Network Connectivity
```bash
# Test from your computer
curl http://YOUR_IP:8000/api/health

# Test from device (if possible)
adb shell curl http://YOUR_IP:8000/api/health
```

### Step 3: Check Firewall Settings
- **Windows**: Allow port 8000 in Windows Firewall
- **macOS**: Allow incoming connections on port 8000
- **Linux**: Check iptables/ufw settings

### Step 4: Verify Device Network
- Ensure device and computer are on the same network
- Try using mobile hotspot if WiFi doesn't work
- Check if device can ping your computer's IP

### Step 5: Use Network Debug Screen
1. Open the app
2. Navigate to `Debug > Network`
3. Check current network status
4. Test connection
5. Set custom IP if needed

## 📱 Testing Different Scenarios

### Scenario 1: Android Emulator
```bash
# Start emulator
emulator -avd YOUR_AVD_NAME

# Build and install APK
npx expo build:android
adb install CarpoolingApp.apk
```

### Scenario 2: Physical Device
```bash
# Get device connected
adb devices

# Install APK
adb install CarpoolingApp.apk

# Check device logs
adb logcat | grep "API"
```

### Scenario 3: Different Networks
- **Home WiFi**: Usually `192.168.1.xxx`
- **Office WiFi**: Usually `10.0.0.xxx` or `172.16.0.xxx`
- **Mobile Hotspot**: Use your computer's IP address

## 🛠️ Advanced Configuration

### Environment Variables
You can also use environment variables to configure the API URL:

```bash
# Set environment variable
export API_BASE_URL=http://YOUR_IP:8000/api

# Or create a .env file
echo "API_BASE_URL=http://YOUR_IP:8000/api" > .env
```

### Custom Network Configuration
Modify `services/config.ts` for different environments:

```typescript
export const API_CONFIG = {
  development: {
    android: 'http://10.0.2.2:8000/api', // Emulator
  },
  testing: {
    android: 'http://192.168.1.100:8000/api', // Physical device
  },
  production: {
    android: 'https://your-production-api.com/api', // Real production
  }
};
```

## 📋 Common Error Messages

### "Network request failed"
- Backend server not running
- Wrong IP address
- Firewall blocking connection
- Device not on same network

### "Connection refused"
- Backend server not running
- Wrong port number
- Firewall blocking connection

### "Timeout"
- Network connectivity issues
- Backend server overloaded
- Wrong IP address

### "CORS error"
- Backend CORS configuration issue
- Wrong protocol (http vs https)

## 🎯 Quick Fix Checklist

- [ ] Backend server is running on port 8000
- [ ] Backend is accessible from network (not just localhost)
- [ ] Device and computer are on same network
- [ ] Firewall allows connections on port 8000
- [ ] Correct IP address is configured in app
- [ ] APK is rebuilt with new configuration
- [ ] Network debug screen shows "Connected: Yes"

## 📞 Getting Help

If you're still having issues:

1. **Check the logs**:
   ```bash
   adb logcat | grep "API\|Network\|Error"
   ```

2. **Use the Network Debug Screen** in the app

3. **Test with curl** from your computer:
   ```bash
   curl http://YOUR_IP:8000/api/health
   ```

4. **Verify backend is running**:
   ```bash
   curl http://localhost:8000/api/health
   ```

5. **Check network configuration** in `services/config.ts`
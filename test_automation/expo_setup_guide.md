# Testing with Expo Go

## 🎯 Setup for Expo Go Development Testing

Since you're using Expo Go for development, here's how to set up the test automation:

### 📱 Prerequisites

1. **Install Expo Go** on your Android device from Play Store
2. **Start your Expo development server** in the main project directory:
   ```bash
   cd C:\project\Car-Pooling-App
   npm start
   # or
   npx expo start
   ```
3. **Load your app in Expo Go** by scanning the QR code

### ⚙️ Configuration Changes Made

The framework has been updated to work with Expo Go:

- **App Package**: Changed from `com.anonymous.boltexponativewind` to `host.exp.exponent`
- **Activity**: Changed to `.experience.HomeActivity`
- **Auto Launch**: Disabled (we'll navigate manually)

### 🚀 Testing Workflow

1. **Start Expo Development Server:**
   ```bash
   cd C:\project\Car-Pooling-App
   npx expo start
   ```

2. **Load App in Expo Go:**
   - Open Expo Go on your device
   - Scan the QR code or enter the development URL
   - Ensure your app is running and visible

3. **Run Prerequisites Check:**
   ```bash
   cd test_automation
   python run_tests.py --check
   ```

4. **Run Tests:**
   ```bash
   # Start with basic framework test
   python test_basic.py
   
   # Run smoke tests
   python run_tests.py --smoke
   ```

### 🎯 Important Notes for Expo Go Testing

#### Manual Navigation Required
Since we're using Expo Go, the tests will:
1. Launch Expo Go app
2. **You may need to manually navigate to your app** within Expo Go
3. Then the tests will take over and interact with your app

#### App State Management
- The app should be **already loaded and running** in Expo Go before starting tests
- Make sure your development server is running
- Ensure the app is on the main/home screen before running tests

#### Locator Strategy
- UI elements will have the same structure as your React Native app
- The framework will use text, accessibility labels, and resource IDs to find elements
- If tests fail to find elements, we may need to inspect the app structure

### 🔄 Switching to Production APK Later

When you have a built APK, simply update `config/config.yaml`:

```yaml
android:
  # Comment out Expo Go settings
  # app_package: "host.exp.exponent"
  # app_activity: ".experience.HomeActivity"
  
  # Uncomment production settings
  app_package: "com.anonymous.boltexponativewind"
  app_activity: ".MainActivity"
  auto_launch: true  # Can auto-launch production APK
```

### 🛠️ Troubleshooting

**If tests can't find your app in Expo Go:**
1. Ensure your app is the active/foreground app in Expo Go
2. Make sure development server is running
3. Try manually navigating to your app's main screen
4. Check if app is fully loaded (not showing loading screens)

**If Appium can't interact with Expo Go:**
1. Grant all permissions to Expo Go app
2. Enable "Allow from this source" for development apps
3. Ensure USB debugging is enabled
4. Try restarting Expo Go app

### 📝 Next Steps

1. **Test the setup:**
   ```bash
   python run_tests.py --check
   ```

2. **Run framework test:**
   ```bash
   python test_basic.py
   ```

3. **Start with simple tests:**
   ```bash
   python run_tests.py --smoke
   ```

The framework will adapt to your app's UI structure once it's running in Expo Go!
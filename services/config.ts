import { Platform } from 'react-native';

// Configuration for different environments
export const API_CONFIG = {
  // Development (Expo Go)
  development: {
    web: 'http://localhost:8000/api',
    android: 'http://10.0.2.2:8000/api', // Android emulator
    ios: 'http://localhost:8000/api',
  },
  
  // Production (APK/IPA)
  production: {
    web: 'https://your-production-api.com/api',
    android: 'http://10.0.2.2:8000/api', // For testing APK with local backend
    ios: 'https://your-production-api.com/api',
  },
  
  // Testing (APK with local backend)
  testing: {
    web: 'http://localhost:8000/api',
    android: 'http://10.0.2.2:8000/api', // Android emulator
    ios: 'http://localhost:8000/api',
  }
};

// Get the current environment
export const getCurrentEnvironment = () => {
  if (__DEV__) {
    return 'development';
  }
  
  // For APK testing, you can force testing mode
  // You can also use AsyncStorage to store a flag
  return 'testing'; // Change this to 'production' for real production
};

// Get the appropriate API URL for the current platform and environment
export const getApiUrl = () => {
  const environment = getCurrentEnvironment();
  const platform = Platform.OS;
  
  return API_CONFIG[environment][platform] || API_CONFIG[environment].web;
};

// Helper function to get your computer's IP address for physical device testing
export const getComputerIP = () => {
  // You can set this manually or detect it programmatically
  // For now, return common IP addresses - you'll need to update this
  
  // Common IP addresses for different networks:
  // - Home WiFi: 192.168.1.xxx
  // - Office WiFi: 10.0.0.xxx or 172.16.0.xxx
  // - Android Emulator: 10.0.2.2
  // - iOS Simulator: localhost
  
  return '10.0.2.2'; // Default for Android emulator
};

// Function to update API URL for physical device testing
export const updateApiUrlForDevice = (computerIP: string) => {
  API_CONFIG.testing.android = `http://${computerIP}:8000/api`;
  API_CONFIG.development.android = `http://${computerIP}:8000/api`;
};
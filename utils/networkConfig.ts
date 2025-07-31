import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Network configuration utilities
export class NetworkConfig {
  private static instance: NetworkConfig;
  private customIP: string | null = null;

  static getInstance(): NetworkConfig {
    if (!NetworkConfig.instance) {
      NetworkConfig.instance = new NetworkConfig();
    }
    return NetworkConfig.instance;
  }

  // Set custom IP for physical device testing
  async setCustomIP(ip: string): Promise<void> {
    this.customIP = ip;
    await AsyncStorage.setItem('custom_api_ip', ip);
    console.log('🔧 Custom IP set to:', ip);
  }

  // Get custom IP from storage
  async getCustomIP(): Promise<string | null> {
    if (this.customIP) {
      return this.customIP;
    }
    return await AsyncStorage.getItem('custom_api_ip');
  }

  // Get the appropriate IP for the current setup
  async getHostIP(): Promise<string> {
    const customIP = await this.getCustomIP();
    if (customIP) {
      return customIP;
    }

    // Default IPs based on platform and environment
    if (Platform.OS === 'android') {
      // Check if running on emulator or physical device
      // For emulator: 10.0.2.2
      // For physical device: need to be set manually
      return '10.0.2.2'; // Default for emulator
    }

    return 'localhost';
  }

  // Test network connectivity
  async testConnection(): Promise<boolean> {
    try {
      const hostIP = await this.getHostIP();
      const testUrl = `http://${hostIP}:8000/api/health`;
      
      console.log('🔍 Testing connection to:', testUrl);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        timeout: 5000,
      });
      
      const isConnected = response.ok;
      console.log('✅ Connection test result:', isConnected);
      return isConnected;
    } catch (error) {
      console.log('❌ Connection test failed:', error);
      return false;
    }
  }

  // Get network status information
  async getNetworkInfo(): Promise<{
    hostIP: string;
    isConnected: boolean;
    environment: string;
    platform: string;
  }> {
    const hostIP = await this.getHostIP();
    const isConnected = await this.testConnection();
    
    return {
      hostIP,
      isConnected,
      environment: __DEV__ ? 'development' : 'production',
      platform: Platform.OS,
    };
  }
}

// Export singleton instance
export const networkConfig = NetworkConfig.getInstance();
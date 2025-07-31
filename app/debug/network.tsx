import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { networkConfig } from '../../utils/networkConfig';
import { updateApiUrlForDevice } from '../../services/config';

export default function NetworkDebugScreen() {
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [customIP, setCustomIP] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadNetworkInfo();
  }, []);

  const loadNetworkInfo = async () => {
    setIsLoading(true);
    try {
      const info = await networkConfig.getNetworkInfo();
      setNetworkInfo(info);
    } catch (error) {
      console.error('Error loading network info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    setIsLoading(true);
    try {
      const isConnected = await networkConfig.testConnection();
      Alert.alert(
        'Connection Test',
        isConnected ? '✅ Connected successfully!' : '❌ Connection failed!'
      );
      await loadNetworkInfo();
    } catch (error) {
      Alert.alert('Error', 'Failed to test connection');
    } finally {
      setIsLoading(false);
    }
  };

  const setCustomIPAddress = async () => {
    if (!customIP.trim()) {
      Alert.alert('Error', 'Please enter a valid IP address');
      return;
    }

    setIsLoading(true);
    try {
      await networkConfig.setCustomIP(customIP.trim());
      updateApiUrlForDevice(customIP.trim());
      Alert.alert('Success', 'Custom IP address set successfully!');
      setCustomIP('');
      await loadNetworkInfo();
    } catch (error) {
      Alert.alert('Error', 'Failed to set custom IP address');
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefault = async () => {
    setIsLoading(true);
    try {
      await networkConfig.setCustomIP('');
      Alert.alert('Success', 'Reset to default IP address!');
      await loadNetworkInfo();
    } catch (error) {
      Alert.alert('Error', 'Failed to reset IP address');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🌐 Network Configuration</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Network Status</Text>
        {networkInfo ? (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Host IP:</Text> {networkInfo.hostIP}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Connected:</Text>{' '}
              <Text style={networkInfo.isConnected ? styles.success : styles.error}>
                {networkInfo.isConnected ? 'Yes' : 'No'}
              </Text>
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Environment:</Text> {networkInfo.environment}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Platform:</Text> {networkInfo.platform}
            </Text>
          </View>
        ) : (
          <Text style={styles.loadingText}>
            {isLoading ? 'Loading...' : 'No network info available'}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Connection</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={testConnection}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Testing...' : 'Test Connection'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Set Custom IP Address</Text>
        <Text style={styles.description}>
          Use this for physical device testing. Enter your computer's IP address.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter IP address (e.g., 192.168.1.100)"
          value={customIP}
          onChangeText={setCustomIP}
          keyboardType="numeric"
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.buttonHalf]}
            onPress={setCustomIPAddress}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Set IP</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonHalf, styles.resetButton]}
            onPress={resetToDefault}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.instructionText}>
          1. For Android Emulator: Use 10.0.2.2 (default)
        </Text>
        <Text style={styles.instructionText}>
          2. For Physical Device: Find your computer's IP address and enter it above
        </Text>
        <Text style={styles.instructionText}>
          3. Make sure your backend server is running on port 8000
        </Text>
        <Text style={styles.instructionText}>
          4. Test the connection to verify it works
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  label: {
    fontWeight: 'bold',
  },
  success: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  error: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonHalf: {
    flex: 1,
    marginHorizontal: 5,
  },
  resetButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    lineHeight: 20,
  },
});
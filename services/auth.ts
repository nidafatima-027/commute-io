import AsyncStorage from '@react-native-async-storage/async-storage';

// Store the auth token
export const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('userToken', token);
  } catch (error) {
    console.error('Failed to store token', error);
  }
};

// Store the auth method
export const storeAuthMethod = async (method: 'email' | 'phone') => {
  try {
    await AsyncStorage.setItem('authMethod', method);
  } catch (error) {
    console.error('Failed to store auth method', error);
  }
};

// Retrieve the auth method
export const getAuthMethod = async () => {
  try {
    return await AsyncStorage.getItem('authMethod');
  } catch (error) {
    console.error('Failed to get auth method', error);
    return null;
  }
};

// Retrieve the token
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('userToken');
  } catch (error) {
    console.error('Failed to get token', error);
    return null;
  }
};

// Clear auth data
export const clearAuthData = async () => {
  try {
    await AsyncStorage.multiRemove(['userToken', 'authMethod']);
  } catch (error) {
    console.error('Failed to clear auth data', error);
  }
};
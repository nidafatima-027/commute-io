import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { getApiUrl } from './config';

// Function to get the API base URL dynamically
const getApiBaseUrl = () => {
  // Use the new configuration system
  const apiUrl = getApiUrl();
  console.log('🌐 Using API URL:', apiUrl);
  return apiUrl;
};


const API_BASE_URL = getApiBaseUrl();

// Debug log to see what URL is being used
console.log('🌐 API Base URL:', API_BASE_URL);

// Token management
export const tokenManager = {
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('access_token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('access_token', token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  },

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('access_token');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }
};

// API request helper with better error handling
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  try {
    const token = await tokenManager.getToken();
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    };

    console.log(`📡 API Request: ${options.method || 'GET'} ${API_BASE_URL}${endpoint}`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`;
      console.error('❌ API Error:', errorMessage);
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('✅ API Success:', endpoint);
    return data;
  } catch (error) {
    console.error('🚨 API Request Failed:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Network error occurred');
    }
  }
}

// Authentication API
export const authAPI = {
  async register(userData: {
    name: string;
    email: string;
    phone?: string;
    bio?: string;
    is_driver?: boolean;
    is_rider?: boolean;
    preferences?: any;
    password: string;
  }) {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.access_token) {
      await tokenManager.setToken(response.access_token);
    }
    
    return response;
  },

  async login(email: string, password: string) {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.access_token) {
      await tokenManager.setToken(response.access_token);
    }
    
    return response;
  },

  async sendOTP(email: string) {
    return apiRequest('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async sendMobileOTP(phone: string) {
    return apiRequest('/auth/send-mobile-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  async verifyOTP(email: string, otp: string) {
    const response = await apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
    
    if (response.access_token) {
      await tokenManager.setToken(response.access_token);
    }
    
    return response;
  },

  async verifyMobileOTP(phone: string, otp: string) {
    const response = await apiRequest('/auth/verify-mobile-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });
    
    if (response.access_token) {
      await tokenManager.setToken(response.access_token);
    }
    
    return response;
  },

  async getCurrentUser() {
    return apiRequest('/auth/me');
  },

  async logout() {
    await tokenManager.removeToken();
  }
};

// Users API
export const usersAPI = {
  async getProfile() {
    return apiRequest('/users/profile');
  },

  async getUserProfileById(userId: number) {
    return apiRequest(`/users/profile/${userId}`);
  },

  async updateProfile(userData: {
    name?: string;
    email?: string;  // Optional for phone users
    phone?: string;  // Optional for email users
    bio?: string;
    is_driver?: boolean;
    is_rider?: boolean;
    preferences?: any;
    photo_url?: string;
    gender?: string;
  }) {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  async createCar(carData: {
    make: string;
    model: string;
    license_plate: string;
    seats: number;
    ac_available: boolean;
    color?: string;
    year?: string;
  }) {
    return apiRequest('/cars/', {
      method: 'POST',
      body: JSON.stringify(carData),
    });
  },

  async getPreferenceOptions() {
    return apiRequest('/users/preferences/options');
  },

  async getSchedule() {
    return apiRequest('/users/schedule');
  },

  async createSchedule(scheduleData: {
    day_of_week: number;
    start_time?: string;
    end_time?: string;
  }) {
    return apiRequest('/users/schedule', {
      method: 'POST',
      body: JSON.stringify(scheduleData),
    });
  }
};

// Rides API
export const ridesAPI = {
  async searchRides(limit: number = 50) {
  try {
    const data = await apiRequest(`/rides/?limit=${limit}`);
    return data || []; // Ensure we always return an array
  } catch (error) {
    console.error('Error searching rides:', error);
    throw error;
  }
},

  async createRide(rideData: {
    car_id: number;
    start_location: string;  // Changed from start_location_id
    end_location: string;    // Changed from end_location_id
    start_time: string;
    seats_available: number;
    total_fare: number; 
  }) {
    return apiRequest('/rides/', {
      method: 'POST',
      body: JSON.stringify(rideData),
    });
  },

  async getMyRides() {
    return apiRequest('/rides/my-rides');
  },

  async getMyCompletedRides() {
    return apiRequest('/rides/my-completed-rides');
  },

  async getRideDetails(rideId: number) {
    return apiRequest(`/rides/${rideId}`);
  },

  async updateRide(rideId: number, updateData: {
    start_time?: string;
    seats_available?: number;
    status?: string;
  }) {
    return apiRequest(`/rides/${rideId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  async requestRide(rideId: number, message?: string) {
  const response = await apiRequest('/rides/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      ride_id: rideId, 
      message: message || "I'd like to join your ride" 
    }),
  });
  return response;
},

  async getRideRequests(rideId: number) {
    return apiRequest(`/rides/${rideId}/requests`);
  },

  async getAcceptedRideRequests(rideId: number) {
    return apiRequest(`/rides/${rideId}/acceptedrequests`);
  },

  async updateRideRequest(requestId: number, status: 'accepted' | 'rejected') {
    return apiRequest(`/rides/requests/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  async getMyRideRequests() {
    return apiRequest('/rides/my-requests');
  },

  async getDriverRideRequests() {
    return apiRequest('/rides/driver-requests');
  },
  async getRiderRideHistory(user_id: number, ride_id: number) {
    return apiRequest(`/rides/history/${user_id}/${ride_id}`);
  },

  async getRideHistory() {
    return apiRequest('/rides/history');
  },

  async getRideHistoryByRideId(ride_id: number) {
    return apiRequest(`/rides/history-ride/${ride_id}`);
  },

  async createRideHistory(userId: number, rideId: number, role: 'driver' | 'rider') {
    return apiRequest('/rides/history', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, ride_id: rideId, role }),
    });
  },
  async updateRideHistory(historyId: number, updateData: {
    rating_received?: number;
  }) {
    return apiRequest(`/rides/history/${historyId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },
  
  async updateRideHistoryByUser(historyId: number, updateData: {
    rating_given?: number;
  }) {
    return apiRequest(`/rides/history/rider/${historyId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  async checkExistingRequest(rideId: number) {
    const response = await apiRequest(`/rides/${rideId}/check-request`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response as CheckRequestResponse;
  },
};

export type CheckRequestResponse = {
  exists: boolean;
  requested_at?: string; // ISO 8601 format timestamp
  status?: 'pending' | 'accepted' | 'rejected';
};
// Cars API
export const carsAPI = {
  async getCars() {
    return apiRequest('/cars/');
  },

  async createCar(carData: {
    make: string;
    model: string;
    year?: number;
    color?: string;
    license_plate: string;
    seats: number;
    photo_url?: string;
  }) {
    return apiRequest('/cars/', {
      method: 'POST',
      body: JSON.stringify(carData),
    });
  },

  async updateCar(carId: number, carData: {
    make?: string;
    model?: string;
    year?: number;
    color?: string;
    license_plate?: string;
    seats?: number;
    photo_url?: string;
  }) {
    return apiRequest(`/cars/${carId}`, {
      method: 'PUT',
      body: JSON.stringify(carData),
    });
  },

  async deleteCar(carId: number) {
    return apiRequest(`/cars/${carId}`, {
      method: 'DELETE',
    });
  },
  async getMyCars() {
    return apiRequest('/cars/my');
  },
};

// Messages API
export const messagesAPI = {
  async sendMessage(receiverId: number, content: string, rideId?: number) {
    const payload: any = {
      receiver_id: receiverId,
      content,
    };
    
    // Only include ride_id if it's a valid number
    if (rideId && !isNaN(rideId)) {
      payload.ride_id = rideId;
    }
    
    return apiRequest('/messages/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getConversations() {
    return apiRequest('/messages/conversations');
  },

  async getConversationWithUser(userId: number) {
    return apiRequest(`/messages/${userId}`);
  }
};

// Locations API
export const locationsAPI = {
  async getLocations() {
    return apiRequest('/locations/');
  },

  async createLocation(locationData: {
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
  }) {
    return apiRequest('/locations/', {
      method: 'POST',
      body: JSON.stringify(locationData),
    });
  }
};

// Health check
export const healthAPI = {
  async checkHealth() {
    return apiRequest('/health');
  }
};

// Export a test function to verify connection
export const testConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/`);
    const data = await response.json();
    console.log('🔗 Backend connection test:', data);
    return data;
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    throw error;
  }
};

export async function sendGenAIChat(message: string): Promise<string> {
  try {
    const response = await apiRequest('/genai-chat/api/genai-chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });

    return response.reply;
  } catch (error) {
    console.error('❌ GenAI Chat error:', error);
    return "Sorry, I couldn't process your request right now.";
  }
}
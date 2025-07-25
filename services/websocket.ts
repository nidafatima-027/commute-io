import { io, Socket } from 'socket.io-client';
import { tokenManager } from './api';

interface WebSocketEvents {
  // Ride request events
  'new_ride_request': (data: any) => void;
  'ride_request_accepted': (data: any) => void;
  'ride_request_rejected': (data: any) => void;
  
  // Message events
  'new_message': (data: any) => void;
  
  // Ride status events
  'ride_status_changed': (data: any) => void;
  'new_ride_available': (data: any) => void;
  
  // Connection events
  'connect': () => void;
  'disconnect': () => void;
  'error': (error: any) => void;
}

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000; // 5 seconds
  
  // Event listeners storage
  private eventListeners: { [event: string]: Array<(...args: any[]) => void> } = {};

  constructor() {
    this.connect();
  }

  private async connect() {
    try {
      const token = await tokenManager.getToken();
      if (!token) {
        console.warn('No auth token available for WebSocket connection');
        return;
      }

      // Use the same base URL logic as the API
      const baseUrl = this.getWebSocketUrl();
      
      this.socket = io(baseUrl, {
        auth: {
          token: token,
        },
        transports: ['websocket', 'polling'],
        upgrade: true,
        rememberUpgrade: true,
      });

      this.setupEventHandlers();
      console.log('🔌 WebSocket connecting to:', baseUrl);
      
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.scheduleReconnect();
    }
  }

  private getWebSocketUrl(): string {
    // Mirror the API base URL logic
    if (__DEV__) {
      const { Constants } = require('expo-constants');
      const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
      if (debuggerHost) {
        return `http://${debuggerHost}:8000`;
      }
    }
    return 'http://10.210.6.99:8000'; // Fallback
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      this.reconnectAttempts = 0;
      this.emit('connect');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      this.emit('disconnect');
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.scheduleReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('🚫 WebSocket connection error:', error);
      this.emit('error', error);
      this.scheduleReconnect();
    });

    // Set up event forwarding for all registered events
    Object.keys(this.eventListeners).forEach(event => {
      this.socket?.on(event, (...args) => {
        this.emit(event, ...args);
      });
    });
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Scheduling reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
    
    setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }

  // Public API
  public on<K extends keyof WebSocketEvents>(event: K, callback: WebSocketEvents[K]): void {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);

    // If socket is already connected, add listener immediately
    if (this.socket?.connected) {
      this.socket.on(event, callback);
    }
  }

  public off<K extends keyof WebSocketEvents>(event: K, callback: WebSocketEvents[K]): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
    }
    
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  private emit(event: string, ...args: any[]): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in WebSocket event handler for ${event}:`, error);
        }
      });
    }
  }

  public send(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('WebSocket not connected, cannot send:', event, data);
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public isConnected(): boolean {
    return this.socket?.connected || false;
  }

  public reconnect(): void {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.connect();
  }

  // Convenience methods for specific events
  public onNewRideRequest(callback: (data: any) => void): void {
    this.on('new_ride_request', callback);
  }

  public onRideRequestAccepted(callback: (data: any) => void): void {
    this.on('ride_request_accepted', callback);
  }

  public onNewMessage(callback: (data: any) => void): void {
    this.on('new_message', callback);
  }

  public onRideStatusChanged(callback: (data: any) => void): void {
    this.on('ride_status_changed', callback);
  }

  public onNewRideAvailable(callback: (data: any) => void): void {
    this.on('new_ride_available', callback);
  }
}

// Create and export singleton instance
export const webSocketService = new WebSocketService();
export default webSocketService;
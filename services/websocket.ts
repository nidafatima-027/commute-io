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
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000; // 5 seconds
  private pingInterval: NodeJS.Timeout | null = null;
  
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

      // Use the same base URL logic as the API but with ws://
      const baseUrl = this.getWebSocketUrl();
      const wsUrl = `${baseUrl}/ws?token=${encodeURIComponent(token)}`;
      
      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
      console.log('🔌 WebSocket connecting to:', wsUrl);
      
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.scheduleReconnect();
    }
  }

  private getWebSocketUrl(): string {
    // Mirror the API base URL logic but with ws protocol
    if (__DEV__) {
      try {
        const { Constants } = require('expo-constants');
        const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
        if (debuggerHost) {
          return `ws://${debuggerHost}:8000`;
        }
      } catch (e) {
        // Fallback if Constants is not available
      }
    }
    return 'ws://10.210.6.99:8000'; // Fallback
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('✅ WebSocket connected');
      this.reconnectAttempts = 0;
      this.startPing();
      this.emit('connect');
    };

    this.ws.onclose = (event) => {
      console.log('❌ WebSocket disconnected:', event.code, event.reason);
      this.stopPing();
      this.emit('disconnect');
      this.scheduleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('🚫 WebSocket error:', error);
      this.emit('error', error);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type && data.payload) {
          this.emit(data.type, data.payload);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  }

  private startPing() {
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Ping every 30 seconds
  }

  private stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
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
  }

  public off<K extends keyof WebSocketEvents>(event: K, callback: WebSocketEvents[K]): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
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
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: event, payload: data }));
    } else {
      console.warn('WebSocket not connected, cannot send:', event, data);
    }
  }

  public disconnect(): void {
    this.stopPing();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
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
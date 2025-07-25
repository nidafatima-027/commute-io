// Mock WebSocket service for testing without real WebSocket connectivity

interface WebSocketEvents {
  'new_ride_request': (data: any) => void;
  'ride_request_accepted': (data: any) => void;
  'ride_request_rejected': (data: any) => void;
  'new_message': (data: any) => void;
  'ride_status_changed': (data: any) => void;
  'new_ride_available': (data: any) => void;
  'connect': () => void;
  'disconnect': () => void;
  'error': (error: any) => void;
}

class MockWebSocketService {
  private eventListeners: { [event: string]: Array<(...args: any[]) => void> } = {};
  private connected = false;

  constructor() {
    // Simulate connection after a brief delay
    setTimeout(() => {
      this.connected = true;
      this.emit('connect');
      console.log('✅ Mock WebSocket connected (for testing)');
    }, 1000);
  }

  // Public API - same interface as real WebSocket service
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
          console.error(`Error in mock WebSocket event handler for ${event}:`, error);
        }
      });
    }
  }

  public send(event: string, data: any): void {
    console.log('📤 Mock WebSocket send:', event, data);
    // In a real implementation, this would send to server
  }

  public disconnect(): void {
    this.connected = false;
    this.emit('disconnect');
    console.log('❌ Mock WebSocket disconnected');
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public reconnect(): void {
    this.connected = true;
    this.emit('connect');
    console.log('🔄 Mock WebSocket reconnected');
  }

  // Convenience methods
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

  // Test methods to simulate events
  public simulateNewRideRequest(data: any): void {
    this.emit('new_ride_request', data);
  }

  public simulateNewMessage(data: any): void {
    this.emit('new_message', data);
  }
}

// Create and export singleton instance
export const webSocketService = new MockWebSocketService();
export default webSocketService;
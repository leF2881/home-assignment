import { io, Socket } from 'socket.io-client';
import { Incident } from '@/types/incident';

export type WebSocketEvent =
  | { type: 'incident_update'; data: Incident }
  | { type: 'connected' }
  | { type: 'connecting' }      // ✅ חדש
  | { type: 'disconnected' }
  | { type: 'error'; error: string };

export type WebSocketCallback = (event: WebSocketEvent) => void;

class WebSocketService {
  private socket: Socket | null = null;
  private callbacks: Set<WebSocketCallback> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;

  connect(token: string) {
    if (this.socket?.connected) {
      console.log('WebSocket already connected');
      return;
    }

    console.log('🔌 Connecting to WebSocket...');

    this.socket = io('https://incident-platform.azurewebsites.net', {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: this.reconnectDelay,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    // ✅ connection successful
    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
      this.notifyCallbacks({ type: 'connected' });
    });

    // ✅ disconnected
    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      this.notifyCallbacks({ type: 'disconnected' });
    });

    // ✅ connecting (reconnect attempts)
    this.socket.io.on('reconnect_attempt', (attemptNumber: number) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
      this.notifyCallbacks({ type: 'connecting' });
    });

    // ✅ reconnected
    this.socket.io.on('reconnect', (attemptNumber: number) => {
      console.log(`✅ Reconnected after ${attemptNumber} attempts`);
      this.reconnectAttempts = 0;
      this.notifyCallbacks({ type: 'connected' });
    });

    // ✅ reconnection failed
    this.socket.io.on('reconnect_failed', () => {
      console.error('❌ Reconnection failed');
      this.notifyCallbacks({ type: 'error', error: 'Reconnection failed' });
    });

    // ✅ connection error
    this.socket.on('connect_error', (error) => {
      console.error('🔴 WebSocket connection error:', error.message);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.notifyCallbacks({
          type: 'error',
          error: 'Failed to connect after multiple attempts',
        });
      }
    });

    // ✅ incident updates
    this.socket.on('incident_update', (data: Incident) => {
      console.log('📨 Received incident update:', data);
      this.notifyCallbacks({ type: 'incident_update', data });
    });
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting WebSocket...');
      this.socket.disconnect();
      this.socket = null;
      this.callbacks.clear();
      this.reconnectAttempts = 0;
    }
  }

  subscribe(callback: WebSocketCallback) {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  private notifyCallbacks(event: WebSocketEvent) {
    this.callbacks.forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in WebSocket callback:', error);
      }
    });
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const websocketService = new WebSocketService();

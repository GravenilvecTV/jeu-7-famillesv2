import { io } from 'socket.io-client';
import { WS_URL } from '../config/api';
import { SOCKET_EVENTS } from '../constants/game';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(WS_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.clearAllListeners();
    }
  }

  emit(event, data) {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit(event, data);
  }

  on(event, callback) {
    if (!this.socket) {
      console.error('Socket not initialized');
      return;
    }

    this.socket.on(event, callback);
    
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
      
      if (this.listeners.has(event)) {
        this.listeners.get(event).delete(callback);
      }
    }
  }

  clearAllListeners() {
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach(callback => {
        this.socket?.off(event, callback);
      });
    });
    this.listeners.clear();
  }

  joinGame(gameId, playerName) {
    this.emit(SOCKET_EVENTS.JOIN_GAME, { gameId, playerName });
  }

  sendGameAction(gameId, action) {
    this.emit(SOCKET_EVENTS.GAME_ACTION, { gameId, action });
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
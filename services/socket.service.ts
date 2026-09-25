import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/lib/config';

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    this.token = token;
    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback);
  }

  emit(event: string, data?: any) {
    this.socket?.emit(event, data);
  }

  // User status events
  onUserOnline(callback: (userId: string) => void) {
    this.on('user:online', callback);
  }

  onUserOffline(callback: (userId: string) => void) {
    this.on('user:offline', callback);
  }

  // Message events
  onNewMessage(callback: (message: any) => void) {
    this.on('message:new', callback);
  }

  onMessageRead(callback: (data: any) => void) {
    this.on('message:read', callback);
  }

  onUserTyping(callback: (data: any) => void) {
    this.on('user:typing', callback);
  }

  sendTyping(conversationId: string) {
    this.emit('typing', { conversationId });
  }

  // Connection events
  onConnectionRequest(callback: (data: any) => void) {
    this.on('connection:request', callback);
  }

  onConnectionAccepted(callback: (data: any) => void) {
    this.on('connection:accepted', callback);
  }

  // Notification events
  onNewNotification(callback: (notification: any) => void) {
    this.on('notification:new', callback);
  }

  // Live events
  onUserJoinedLive(callback: (userId: string) => void) {
    this.on('live:join', callback);
  }

  onUserLeftLive(callback: (userId: string) => void) {
    this.on('live:leave', callback);
  }

  // Collaboration events
  onCollaborationRequest(callback: (data: any) => void) {
    this.on('collaboration:request', callback);
  }

  onCollaborationAccepted(callback: (data: any) => void) {
    this.on('collaboration:accepted', callback);
  }

  onSessionJoined(callback: (data: any) => void) {
    this.on('session:joined', callback);
  }

  onSessionLeft(callback: (data: any) => void) {
    this.on('session:left', callback);
  }
}

export const socketService = new SocketService();
